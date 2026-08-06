// Copy fields carry links — one internal (home) and one external (.gov / local
// authority / wiki) per page, placed wherever Karan put them in the copy.
//
// Karan authors links as raw HTML anchors, and sometimes bolds a phrase inline.
// So body copy is escaped EXCEPT for a small allowlist of inline tags, which
// pass through verbatim. Markdown link syntax is also supported.
//
//   rich()       -> HTML for users. Escapes everything except allowed inline tags.
//   richRaw()    -> no escaping at all. Only for fields that are pure markup
//                   (hero h1, offer badge, trust chips, final heading).
//   plain()      -> all tags and Markdown links stripped to text.
//   schemaText() -> plain(), whitespace-collapsed. For meta tags and JSON-LD.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const MD_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

// Inline tags Karan uses in copy. Anything else gets escaped.
const ALLOWED_TAG = /<\/?(?:a|b|strong|em|i|br)(?:\s[^<>]*)?\/?>/gi;

export function escapeHtml(str = '') {
  return String(str).replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

function isExternal(href) {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?breezepestcontrol\.co(\/|$)/i.test(href);
}

/** Markdown links + **bold**, both of which Karan uses in copy. */
function inline(str) {
  return str
    .replace(MD_LINK, (_, text, href) =>
      isExternal(href)
        ? `<a href="${href}" target="_blank" rel="noopener">${text}</a>`
        : `<a href="${href}">${text}</a>`
    )
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}

/**
 * Render copy as HTML: allowlisted inline tags pass through untouched, all other
 * markup is escaped, and Markdown links are converted.
 */
export function rich(str = '') {
  const source = String(str);
  let out = '';
  let last = 0;

  for (const m of source.matchAll(ALLOWED_TAG)) {
    out += inline(escapeHtml(source.slice(last, m.index)));
    out += m[0]; // allowed tag, verbatim
    last = m.index + m[0].length;
  }
  out += inline(escapeHtml(source.slice(last)));
  return out;
}

/**
 * No escaping at all — for fields that are pure markup by design
 * (hero.h1, hero.offer, hero.chips, final.heading).
 */
export function richRaw(str = '') {
  return inline(String(str));
}

/** Strip Markdown links AND HTML tags to bare text. */
export function plain(str = '') {
  return String(str)
    .replace(MD_LINK, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/<[^>]+>/g, '');
}

/** JSON-LD / meta value: tags and links stripped, whitespace collapsed. */
export function schemaText(str = '') {
  return plain(str).replace(/\s+/g, ' ').trim();
}

/**
 * Karan's bullet copy repeats the bullet title, bolded, at the start of its text
 * ("<b>Thorough Property Assessments:</b> Every property..."). The template
 * already renders the title as a styled lead-in, so drop the duplicate.
 */
export function stripLeadIn(text = '', title = '') {
  const t = String(title).trim().replace(/[.:]+$/, '');
  if (!t) return String(text).trim();

  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lead = new RegExp(`^\\s*(?:<(?:b|strong)>)?\\s*${escaped}\\s*:?\\s*(?:</(?:b|strong)>)?\\s*:?\\s*`, 'i');
  return String(text).replace(lead, '').trim();
}
