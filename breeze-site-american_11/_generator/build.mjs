#!/usr/bin/env node
// Breeze Pest Control — static SEO page generator.
//
//   node _generator/build.mjs           build every page + regenerate sitemap
//   node _generator/build.mjs --check   render to memory only, write nothing
//
// Reads content/site.json (shared NAP, services, tracking IDs) and every
// content/pages/*.json (one file per page), writes <url>/index.html into the
// site root, then rebuilds sitemap.xml from the legacy URLs plus every
// generated page that is not noindex.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderPage } from './lib/render.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(HERE, '..');
const CHECK_ONLY = process.argv.includes('--check');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const site = readJson(join(HERE, 'content', 'site.json'));

const pages = readdirSync(join(HERE, 'content', 'pages'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, ...readJson(join(HERE, 'content', 'pages', f)) }));

/* ------------------------------------------------------- tree + breadcrumbs */

const byUrl = new Map(pages.map((p) => [p.url, p]));

/** Breadcrumbs from the URL path, labelled from each ancestor page's crumbLabel. */
function crumbsFor(page) {
  const crumbs = [{ label: 'Home', href: '/' }];
  const segments = page.url.split('/').filter(Boolean);

  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    const href = `${path}/`;
    const ancestor = byUrl.get(href);
    crumbs.push({
      label: ancestor?.crumbLabel || page.crumbLabel || seg,
      href,
    });
  }
  return crumbs;
}

/**
 * Hub cards = cards declared in the page JSON, plus auto-discovered child pages,
 * deduped by href. Declared cards let a hub link somewhere real before its child
 * pages exist; auto-discovery takes over as each month's pages get built.
 */
function hubFor(page) {
  if (!page.hub) return null;

  const declared = page.hub.cards || [];
  const seen = new Set(declared.map((c) => c.href));

  const children = pages
    .filter((p) => p.url !== page.url && p.url.startsWith(page.url) && !p.noindex)
    .filter((p) => p.url.slice(page.url.length).split('/').filter(Boolean).length === 1)
    .filter((p) => !seen.has(p.url))
    .map((p) => ({
      href: p.url,
      title: p.hubCard?.title || p.crumbLabel,
      description: p.hubCard?.description || p.head.description,
      image: p.hubCard?.image || p.hero?.image,
      imageAlt: p.hubCard?.imageAlt || p.hero?.imageAlt,
    }));

  return { ...page.hub, cards: [...declared, ...children] };
}

/* ------------------------------------------------------------------- build */

/**
 * A page still carrying its scaffold placeholder copy must never be indexed or
 * sitemapped — thin placeholder pages getting crawled is worse than not existing.
 * The guard clears itself automatically when `_status` is removed on copy arrival.
 */
const awaitingCopy = (page) => String(page._status || '').startsWith('AWAITING COPY');

// Karan's limits. Anything over gets truncated in results.
const MAX_TITLE = 80;
const MAX_DESC = 155;
const metaWarnings = [];

// County pages (with their city pages) for the footer column and the nav dropdown.
const live = (p) => !p.noindex && !awaitingCopy(p);
const counties = pages
  .filter((p) => p.type === 'county' && live(p))
  .map((c) => ({
    href: c.url,
    label: c.crumbLabel,
    cities: pages
      .filter((p) => p.type === 'city' && live(p) && p.url.startsWith(c.url))
      .map((p) => ({ href: p.url, label: p.crumbLabel }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const written = [];

for (const page of pages) {
  if (awaitingCopy(page)) page.noindex = true;

  if (!awaitingCopy(page)) {
    const t = page.head.title.length;
    const d = page.head.description.length;
    if (t > MAX_TITLE) metaWarnings.push(`${page.url}  title ${t}/${MAX_TITLE}`);
    if (d > MAX_DESC) metaWarnings.push(`${page.url}  description ${d}/${MAX_DESC}`);
  }

  const canonical = site.origin + page.url;
  const html = renderPage(site, page, {
    canonical,
    crumbs: crumbsFor(page),
    hub: hubFor(page),
    counties,
  });

  const outDir = join(SITE_ROOT, page.url.replace(/^\/|\/$/g, ''));
  const outFile = join(outDir, 'index.html');

  if (!CHECK_ONLY) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outFile, html, 'utf8');
  }

  written.push({ url: page.url, bytes: Buffer.byteLength(html), noindex: !!page.noindex });
  console.log(
    `${CHECK_ONLY ? 'check' : 'write'}  ${page.url.padEnd(46)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB${
      awaitingCopy(page) ? '  [awaiting copy — noindex]' : page.noindex ? '  [noindex]' : ''
    }`
  );
}

/* --------------------------------------------------------------- redirects */
// Legacy flat pages rebuilt in the tree 301 to their new URL so the two do not
// compete for the same keyword. Only entries marked `enabled` are written — a
// redirect must never point at a page that is still placeholder.
const activeRedirects = (site.redirects || []).filter((r) => r.enabled);
const redirected = new Set(activeRedirects.map((r) => r.from));

if (!CHECK_ONLY) {
  const rules = activeRedirects.map((r) => `${r.from.padEnd(38)} ${r.to.padEnd(58)} 301`).join('\n');
  writeFileSync(
    join(SITE_ROOT, '_redirects'),
    `# Legacy flat URLs rebuilt under /service-areas/.\n# Generated by _generator/build.mjs — edit site.json redirects[], not this file.\n${rules}\n`,
    'utf8'
  );
}
console.log(`\nredirects: ${activeRedirects.length} active, ${(site.redirects || []).length - activeRedirects.length} pending copy`);

/* ----------------------------------------------------------------- sitemap */

const sitemapUrls = [
  // A redirected legacy URL must not stay in the sitemap.
  ...site.legacyUrls
    .filter((u) => !redirected.has(u))
    .map((u) => ({ url: u, freq: u === '/privacy-policy/' || u === '/terms/' ? 'yearly' : 'monthly' })),
  ...written.filter((p) => !p.noindex).map((p) => ({ url: p.url, freq: 'monthly' })),
];

const seen = new Set();
const rows = sitemapUrls
  .filter((r) => (seen.has(r.url) ? false : seen.add(r.url)))
  .map((r) => `  <url><loc>${site.origin}${r.url}</loc><changefreq>${r.freq}</changefreq></url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;

if (!CHECK_ONLY) writeFileSync(join(SITE_ROOT, 'sitemap.xml'), sitemap, 'utf8');

/* ------------------------------------------- Benefits/Why image uniqueness */
// Karan's rule: no image may fill a Benefits or Why slot on two pages in the
// same batch. Pages carry a `batch` key ("2026-08"); ones without are skipped.
const byBatch = {};
for (const p of pages) {
  if (!p.batch || awaitingCopy(p)) continue;
  for (const k of ['benefits', 'why']) {
    if (!p[k]?.image) continue;
    ((byBatch[p.batch] ||= {})[p[k].image] ||= []).push(`${p.url}·${k}`);
  }
}
const dupes = Object.entries(byBatch).flatMap(([batch, imgs]) =>
  Object.entries(imgs)
    .filter(([, uses]) => uses.length > 1)
    .map(([img, uses]) => `${batch}  ${img.replace('/assets/', '')}  ${uses.join('  ')}`)
);
if (dupes.length) {
  console.log(`\n⚠  ${dupes.length} Benefits/Why image reused within a batch:`);
  dupes.forEach((w) => console.log(`   ${w}`));
} else {
  console.log('\nimages: Benefits/Why unique within every batch');
}

if (metaWarnings.length) {
  console.log(`\n⚠  ${metaWarnings.length} meta length issue(s) — will be truncated in results:`);
  metaWarnings.forEach((w) => console.log(`   ${w}`));
} else {
  console.log(`\nmeta: all titles ≤ ${MAX_TITLE}, all descriptions ≤ ${MAX_DESC}`);
}

console.log(
  `\n${CHECK_ONLY ? 'Checked' : 'Built'} ${written.length} page(s); sitemap has ${seen.size} URL(s).`
);
