// Section renderers + page assembly.
//
// Section order is Karan's authoritative order:
//   Hero → [hub, if the page has children] → Benefits → Why → FAQ → Map → Quote form → Final CTA
// The quote form ALWAYS sits below the map. Note this differs from the legacy
// hand-built pages, where the quote card overlapped the hero via a negative
// margin — styles.mjs cancels that margin for generated pages.

import { head, topbarAndHeader, quoteSection, footer, callBtn } from './chrome.mjs';
import { escapeHtml, rich, richRaw, plain, schemaText, stripLeadIn } from './richtext.mjs';

/* ------------------------------------------------------------------ schema */

function localBusiness(site) {
  return {
    '@type': 'LocalBusiness',
    name: site.name,
    url: site.origin + '/',
    telephone: site.phoneIntl,
    email: site.email,
    priceRange: 'Free quotes',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: 'US',
    },
  };
}

function breadcrumbSchema(site, crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: site.origin + c.href,
    })),
  };
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: schemaText(f.q),
      // Links stay visible for users but are stripped to plain text here —
      // JSON-LD answers must not carry markup.
      acceptedAnswer: { '@type': 'Answer', text: schemaText(f.a) },
    })),
  };
}

function serviceSchema(site, page) {
  const area = page.areaServed
    ? {
        '@type': 'City',
        name: page.areaServed,
        address: { '@type': 'PostalAddress', addressRegion: page.state || 'FL', addressCountry: 'US' },
      }
    : site.areaServed;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: schemaText(page.serviceName || page.head.title),
    serviceType: page.serviceType || 'Pest Control',
    description: schemaText(page.head.description),
    areaServed: area,
    provider: { '@context': 'https://schema.org', ...localBusiness(site) },
  };
}

/* ---------------------------------------------------------------- sections */

function crumbsHtml(crumbs) {
  const parts = crumbs.map((c, i) =>
    i === crumbs.length - 1
      ? `<span class="here">${escapeHtml(c.label)}</span>`
      : `<a href="${c.href}">${escapeHtml(c.label)}</a>`
  );
  return `      <nav class="crumbs" aria-label="Breadcrumb">${parts.join('<span class="sep">/</span>')}</nav>\n`;
}

function heroSection(site, page, crumbs) {
  const h = page.hero;
  // Chips and the offer badge carry deliberate inline <b> markup, so they go
  // through richRaw rather than being escaped.
  const chips = (h.chips || site.defaultChips)
    .map((c) => `        <span class="chip">${richRaw(c)}</span>`)
    .join('\n');
  const offer = h.offer ? `      <div class="offer-badge">${richRaw(h.offer)}</div>\n` : '';

  return `<!-- ================= HERO ================= -->
<section class="hero" aria-label="Intro">
  <div class="wrap hero-grid">
    <div>
${crumbsHtml(crumbs)}      <span class="kicker" style="color:var(--gold)">${escapeHtml(h.kicker)}</span>
      <h1>${h.h1}</h1>
      <p class="lead">${rich(h.description)}</p>
${offer}      <div class="hero-ctas">
        <a class="btn btn-gold" href="#quote">Get a Free Quote →</a>
        ${callBtn(site, 'btn-outline', 'Call Now')}
      </div>
      <div class="trustrow">
${chips}
      </div>
    </div>
    <div class="hero-img">
      <img src="${h.image}" alt="${escapeHtml(plain(h.imageAlt))}" width="1254" height="1254" />
      <div class="ratecard">
        <div class="stars">★★★★★</div>
        <div class="n">4.9 / 5</div>
        <div class="s">Trusted Pensacola Reviews</div>
      </div>
    </div>
  </div>
</section>`;
}

/** Benefits (image left) and Why (image right) are the same block, mirrored. */
function splitSection(site, block, { reverse }) {
  // Karan's bullet text repeats its title in bold up front; the template already
  // renders the title as a styled lead-in, so strip the duplicate.
  const bullets = block.bullets
    .map((b) => `        <li><b>${escapeHtml(plain(b.title))}</b>${rich(stripLeadIn(b.text, b.title))}</li>`)
    .join('\n');

  const sub = block.subheading ? `      <p class="sub2">${rich(block.subheading)}</p>\n` : '';

  return `<section class="split${reverse ? ' rev' : ''}">
  <div class="wrap grid2">
    <div class="media">
      <img src="${block.image}" alt="${escapeHtml(plain(block.imageAlt))}" loading="lazy" />
    </div>
    <div class="body">
      <span class="kicker">${escapeHtml(block.badge)}</span>
      <h2>${escapeHtml(block.heading)}</h2>
${sub}      <ul>
${bullets}
      </ul>
      <div class="ctas">
        <a class="btn btn-gold" href="#quote">Get a Free Quote →</a>
        <a class="phone-lg" href="tel:${site.phoneHref}" onclick="phoneClick()">${site.phone}</a>
      </div>
    </div>
  </div>
</section>`;
}

/**
 * Card hub — renders only when the page has real children.
 * On a heroless page the hub leads, so it takes over the H1 and the breadcrumbs;
 * otherwise the page would ship without an H1 at all.
 */
function hubSection(hub, { asH1 = false, crumbs = null } = {}) {
  // Location cards are title + CTA only. Only service cards carry a description.
  const isService = hub.variant === 'service';

  const cards = hub.cards
    .map(
      (c) => `      <article class="card">
        <img src="${c.image}" alt="${escapeHtml(plain(c.imageAlt))}" loading="lazy" />
        <div class="pad">
          <h3>${escapeHtml(c.title)}</h3>
${isService && c.description ? `          <p>${rich(c.description)}</p>\n` : ''}          <a class="go" href="${c.href}">${escapeHtml(hub.cta)}</a>
        </div>
      </article>`
    )
    .join('\n');

  const tag = asH1 ? 'h1' : 'h2';

  return `<section class="hub${isService ? '' : ' loc'}${asH1 ? ' lead' : ''}">
  <div class="wrap">
${crumbs ? crumbsHtml(crumbs) : ''}    <div class="center">
      <span class="kicker">${escapeHtml(hub.badge)}</span>
      <${tag}>${escapeHtml(hub.heading)}</${tag}>
      ${hub.description ? `<p class="sub">${rich(hub.description)}</p>` : ''}
    </div>
    <div class="cards">
${cards}
    </div>
  </div>
</section>`;
}

function faqSection(faqs) {
  const items = faqs
    .map(
      (f) => `    <details class="qa">
      <summary>${escapeHtml(plain(f.q))}</summary>
      <div class="a">${rich(f.a)}</div>
    </details>`
    )
    .join('\n');

  return `<section class="faq" id="faq">
  <div class="wrap">
    <div class="center">
      <span class="kicker">Questions</span>
      <h2>Frequently Asked Questions</h2>
    </div>
${items}
  </div>
</section>`;
}

/**
 * Map. Two variants, with literal labels:
 *   location -> area map by place query   (county / city pages)
 *   gbp      -> Google Business Profile   (service pages)
 */
function mapSection(site, map) {
  const isGbp = map.variant === 'gbp';
  const heading = isGbp ? 'Our Google Business Profile' : 'Our Service Area';
  const src = isGbp
    ? site.gbpEmbed
    : `https://www.google.com/maps?q=${encodeURIComponent(map.query)}&z=${map.zoom || 12}&output=embed`;

  return `<section class="maprow">
  <div class="wrap">
    <div class="center">
      <span class="kicker">Find Us</span>
      <h2>${heading}</h2>
      <p class="mapdesc">${rich(map.description)}</p>
    </div>
    <div class="mapbox">
      <iframe title="${escapeHtml(map.title || heading)}" src="${src}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>
</section>`;
}

function finalSection(site, final) {
  return `<section class="final">
  <div class="wrap">
    <h2>${final.heading}</h2>
    <p>${rich(final.description)}</p>
    <div class="hero-ctas">
      <a class="btn btn-gold" href="#quote" style="font-size:21px;padding:16px 34px">Get My Free Quote →</a>
      ${callBtn(site, 'btn-outline', site.phone, 'font-size:21px')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------- page */

export function renderPage(site, page, { canonical, crumbs, hub = null, counties = [] }) {
  const jsonLd = [serviceSchema(site, page), breadcrumbSchema(site, crumbs)];
  if (page.faqs?.length) jsonLd.push(faqSchema(page.faqs));

  // `hero` is optional. Without it the hub leads the page and inherits the H1
  // and breadcrumbs (see hubSection).
  const hasHero = !!page.hero;

  const sections = [
    hasHero ? heroSection(site, page, crumbs) : null,
    hub && hub.cards.length ? hubSection(hub, { asH1: !hasHero, crumbs: hasHero ? null : crumbs }) : null,
    page.benefits ? splitSection(site, page.benefits, { reverse: false }) : null,
    page.why ? splitSection(site, page.why, { reverse: true }) : null,
    page.faqs?.length ? faqSection(page.faqs) : null,
    page.map ? mapSection(site, page.map) : null,
    quoteSection(site, {
      title: page.quote?.title || 'Request a Free Quote',
      intro:
        page.quote?.intro ||
        "Tell us what's bugging you. A member of our local Pensacola team will reach out during business hours — no pressure, no obligation.",
      preselect: page.quote?.preselectService || null,
    }),
    finalSection(site, page.final),
  ].filter(Boolean);

  return [
    head(site, page, { canonical, jsonLd, noindex: page.noindex }),
    '<body>',
    topbarAndHeader(site, counties),
    '',
    '<main id="top">',
    '',
    sections.join('\n\n'),
    '',
    '</main>',
    '',
    footer(site, counties),
  ].join('\n');
}
