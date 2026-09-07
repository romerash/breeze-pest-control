# Breeze SEO page generator

Generates the static SEO pages for `breeze-site-american_11`. No dependencies —
plain Node (ESM), no install step.

```bash
cd breeze-site-american_11
node _generator/build.mjs          # build every page + regenerate sitemap.xml
node _generator/build.mjs --check  # render only, write nothing
```

Preview locally:

```bash
cd breeze-site-american_11
python -m http.server 8080     # then open http://localhost:8080/template-preview/
```

## Layout

```
_generator/
  build.mjs              entry point: reads content, writes pages, rebuilds sitemap
  lib/
    render.mjs           section renderers + page assembly
    chrome.mjs           head, tracking, header, quote form, footer
    styles.mjs           the stylesheet (BASE copied from the live pages + ADDITIONS)
    richtext.mjs         Markdown-link handling: rich / richRaw / plain / schemaText
  content/
    site.json            NAP, services, tracking IDs, consent text, legacy sitemap URLs
    pages/*.json         one file per page
```

Each page writes to `<url>/index.html` in the site root. `sitemap.xml` is rebuilt
from `site.legacyUrls` plus every generated page that is not `noindex`.

## Adding a page

**Before scaffolding anything, check that the parent page exists.** A page at
`/a/b/c/` needs a real page at `/a/b/`. If the parent does not exist, the
breadcrumb has a dead rung, the page has no hub to be linked from, and the
parent URL 404s. Either build the parent in the same batch or move the child.
`node _generator/build.mjs` fails loud about this — see **Parent page check**.

1. Copy `content/pages/template-preview.json` to a new file.
2. Set `url`, `crumbLabel`, and drop `noindex`.
3. Paste Karan's copy into `head` / `hero` / `benefits` / `why` / `faqs` / `map` / `final`.
4. Delete any optional block you do not need — `hub`, `benefits`, `why`, `faqs`
   and `map` all drop out cleanly, along with their schema.
5. `node _generator/build.mjs`.

`/template-preview/` renders every section with each field labelled. It is
noindexed and excluded from the sitemap — keep it that way.

## Section order

Karan's authoritative order:

```
Hero → [location hub] → Benefits → Why → [services hub] → FAQ → Map → Quote form → Final CTA
```

**Hub placement depends on the variant.** A `variant: "service"` hub always sits
directly above the FAQ — after Benefits and Why (Karan, 2026-09-03). A
`variant: "location"` hub leads the page straight after the hero, and on a
heroless hub page (`/service-areas/`) it takes over the H1 and breadcrumbs.

**Location service pages (`type: "service"`) carry no Map section** — set by Karan
on 2026-09-02. They run Hero → Benefits → Why → FAQ → Quote form → Final CTA.
Omit the `map` key entirely; it drops out cleanly along with its markup.

**The quote form always sits below the map.** This differs from the legacy
hand-built pages, where the quote card is pulled up over the hero by a negative
margin — `styles.mjs` cancels that margin for generated pages. All `#quote` CTAs
still anchor to it correctly.

Benefits renders image-left; Why mirrors it image-right on a paper background.

## Links in copy

Copy carries exactly one internal link (home) and one external link (.gov / wiki).
**Keep them where Karan placed them — including inside FAQ answers.**

| Helper | Escapes? | Use for |
|---|---|---|
| `rich()` | yes | Normal body copy — hero description, subheadings, bullet text, FAQ answers, map description |
| `richRaw()` | no | Fields with deliberate inline HTML — `hero.h1`, `hero.offer`, `hero.chips`, `final.heading` |
| `plain()` | n/a | Meta title/description, image alt |
| `schemaText()` | n/a | JSON-LD values — FAQ answers keep their link for users but go in as plain text |

## Hub cards

`hub.cards` in a page's JSON are rendered first, then any child pages found under
that URL are appended automatically (deduped by `href`). Declared cards let a hub
link somewhere real before its child pages exist; auto-discovery takes over as
each month's pages get built.

**`/service-areas/` lists COUNTIES ONLY — never city pages.** Cities belong on
their county page. Keep `hub.cards` empty there; county pages are picked up
automatically as direct children.

## Parent page check

Every generated page below the top level must have a real page at its parent
URL; `/` is exempt, since the homepage is a legacy hand-built page. The build
lists any page nested under a URL with nothing behind it.

Known open case: `/service-areas/escambia-county-fl/pensacola/termite-inspection/`
sits under `/service-areas/escambia-county-fl/pensacola/`, which does not exist —
Pensacola is the last city still on its legacy flat URL. Until that city page is
built, `crumbsFor()` marks the rung `orphan`, `crumbsHtml()` renders it as plain
text instead of a link, and it is emitted without an `item` in the
BreadcrumbList schema. Building the Pensacola city page heals all of it on the
next build and lets `/pest-control-pensacola/` finally 301.

## Placeholder guard

A page whose JSON still has a `"_status"` beginning `"AWAITING"` is automatically
rendered `noindex` and kept out of the sitemap — use it for anything still
missing (`"AWAITING COPY…"`, `"AWAITING IMAGES…"`). Delete the `_status` key when
the page is genuinely complete and it becomes indexable on the next build. This stops
thin scaffold pages from ever being crawled.

## Redirects

Cities are rebuilt from their legacy flat URL (`/pest-control-milton/`) into the
tree (`/service-areas/santa-rosa-county-fl/milton/`) one batch at a time. Until the
old URL redirects, both pages compete for the same keyword.

`site.json` → `redirects[]` maps each one. Entries with `"enabled": true` are
written to `/_redirects` as 301s and dropped from the sitemap; the rest are
inert placeholders.

> **Only enable a redirect once the tree page has real copy.** Pointing a 301 at a
> placeholder page throws away the old page's rankings.

`/_redirects` is the Netlify format (the site already uses Netlify Forms). On a
different host this needs translating to that host's redirect config.

## Known gaps

- **`/services/{slug}/` pages do not exist yet.** `site.json` → `services[].href`
  currently points each service at a live destination. When the real pages are
  built, change each `href` to `/services/{slug}/` and update the matching card
  in `content/pages/services.json`.
- **`/apply` 404s.** Linked from the header, footer and the homepage careers
  section, but the page was never built. Pre-existing on the live hand-built
  pages too.
- **`site.gbpEmbed` is an address query, not the real Google Business Profile
  embed.** Replace with the actual GBP embed URL from the Google Business
  dashboard.
- **Google Ads conversion labels are placeholders** (`CONVERSION_LABEL` in the
  footer script, and the phone-click conversion). Carried over from the live
  pages; form and call conversions will not report to Ads until they are filled in.
