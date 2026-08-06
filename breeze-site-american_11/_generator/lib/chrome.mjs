// Page chrome shared by every generated page: <head>, tracking, topbar, header,
// the quote-form section, footer, and the form/phone tracking script.
// Mirrors the markup already live on the hand-built pages.

import { styles } from './styles.mjs';
import { escapeHtml, plain } from './richtext.mjs';

export function head(site, page, { canonical, jsonLd = [], noindex = false }) {
  const title = plain(page.head.title);
  const desc = plain(page.head.description);
  const ogTitle = plain(page.head.ogTitle || page.head.title);
  const ogDesc = plain(page.head.ogDescription || page.head.description);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}" />${noindex ? '\n<meta name="robots" content="noindex,nofollow" />' : ''}
<meta name="theme-color" content="#0B2447" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${escapeHtml(ogTitle)}" />
<meta property="og:description" content="${escapeHtml(ogDesc)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />

<!-- Google tag (gtag.js) — Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.googleAdsId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${site.googleAdsId}');
</script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${site.gtmId}');</script>
<!-- End Google Tag Manager -->

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

${jsonLd.map((b) => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`).join('\n')}

<style>${styles}</style>
</head>`;
}

export function topbarAndHeader(site, counties = []) {
  // Service Areas dropdown — counties only.
  // CSS-only (hover + focus-within), so it needs no JavaScript.
  const dropdown = counties.length
    ? `<div class="navdrop">
        <a href="/service-areas/">Service Areas</a>
        <div class="navdrop-panel">
${counties.map((c) => `          <a href="${c.href}">${escapeHtml(c.label)}</a>`).join('\n')}
        </div>
      </div>`
    : '<a href="/service-areas/">Service Areas</a>';

  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<div class="topbar">Fast local response — first visit within 48 hours · <a href="tel:${site.phoneHref}" onclick="phoneClick()">Call ${site.phone}</a></div>

<header>
  <div class="wrap nav">
    <a class="logo" href="/" aria-label="Breeze Pest Control home">
      <span class="b">BREEZE</span>
      <span class="p">PEST CONTROL</span>
    </a>
    <nav class="navlinks" aria-label="Main">
      <a href="/services/">Services</a>
      ${dropdown}
      <a href="/#how">How It Works</a>
      <a href="/#reviews">Reviews</a>
      <a href="/#faq">FAQ</a>
      <a href="/apply">Careers</a>
    </nav>
    <div class="headcall">
      <a class="phone-lg" href="tel:${site.phoneHref}" onclick="phoneClick()">${site.phone}</a>
      <a class="btn btn-gold" href="#quote">Get a Free Quote</a>
    </div>
  </div>
</header>`;
}

const PHONE_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true" style="flex:none"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';

export function callBtn(site, cls, label, style = '') {
  return `<a class="btn ${cls}" href="tel:${site.phoneHref}" onclick="phoneClick()"${style ? ` style="${style}"` : ''}>${PHONE_SVG}<span>${label}</span></a>`;
}

/** The quote form. `preselect` matches an option label to preselect a service. */
export function quoteSection(site, { title, intro, preselect = null }) {
  const options = [...site.services.map((s) => s.formLabel), ...(site.extraFormOptions || [])]
    .map((label) => `                <option${label === preselect ? ' selected' : ''}>${escapeHtml(label)}</option>`)
    .join('\n');

  return `<!-- ================= QUOTE FORM ================= -->
<section class="quote" id="quote">
  <div class="wrap">
    <div class="quote-card">
      <div id="formview">
        <span class="fast">★ Free quote — under 2 minutes ★</span>
        <h2>${escapeHtml(title)}</h2>
        <p style="color:var(--muted);margin-top:6px">${escapeHtml(intro)}</p>
        <form id="leadform" name="quote-request" method="POST" data-netlify="true" netlify-honeypot="company">
          <input type="hidden" name="form-name" value="quote-request" />
          <p style="display:none"><label>Company<input name="company" /></label></p>
          <div class="fgrid">
            <div class="f-3"><label for="fn">First Name*</label><input id="fn" name="first_name" autocomplete="given-name" required /></div>
            <div class="f-3"><label for="ln">Last Name*</label><input id="ln" name="last_name" autocomplete="family-name" required /></div>
            <div class="f-3"><label for="em">Email*</label><input id="em" type="email" name="email" autocomplete="email" required /></div>
            <div class="f-3"><label for="ph">Phone Number*</label><input id="ph" type="tel" name="phone" autocomplete="tel" required /></div>
            <div class="f-3"><label for="ad">Street Address*</label><input id="ad" name="street_address" autocomplete="street-address" required /></div>
            <div class="f-2"><label for="zp">ZIP Code*</label><input id="zp" name="zip" inputmode="numeric" pattern="[0-9]{5}" required /></div>
            <div class="f-1 f-2" style="grid-column:span 1"></div>
            <div class="f-6"><label for="sv">What can we help with?</label>
              <select id="sv" name="service">
${options}
              </select>
            </div>
          </div>
          <div class="quote-actions">
            <button class="btn btn-red" type="submit" style="font-size:20px;padding:15px 34px">Request a Free Quote</button>
            <span class="or">or call</span>
            <a class="phone-lg" href="tel:${site.phoneHref}" onclick="phoneClick()">${site.phone}</a>
          </div>
          <p class="fine">${site.consentText}</p>
        </form>
      </div>
      <div class="thanks" id="thanksview">
        <div style="font-size:52px">✅</div>
        <div class="big">You're all set!</div>
        <p>Thanks — your request is in. A member of our Pensacola team will reach out shortly during business hours to confirm details and get you scheduled.</p>
        <a class="btn btn-navy" href="tel:${site.phoneHref}" onclick="phoneClick()">Need us sooner? Call ${site.phone}</a>
      </div>
    </div>
  </div>
</section>`;
}

export function footer(site, counties = []) {
  const serviceLinks = site.services
    .map((s) => `        <li><a href="${s.href || `/services/${s.slug}/`}">${escapeHtml(s.name)}</a></li>`)
    .join('\n');

  // County pages, discovered from the content tree — new counties appear here
  // automatically the month they are built.
  const areaLinks = counties
    .map((c) => `        <li><a href="${c.href}">${escapeHtml(c.label)}</a></li>`)
    .join('\n');

  return `<footer>
  <div class="wrap fgrid4">
    <div>
      <a class="logo" href="/" style="margin-bottom:12px"><span class="b">BREEZE</span><span class="p" style="color:#fff">PEST CONTROL</span></a>
      <p style="margin-top:10px">Pensacola's local home protection team. Family-owned, refreshingly honest — since 2015.</p>
      <p style="margin-top:12px">${site.address.street}<br>${site.address.city}, ${site.address.region} ${site.address.postalCode}<br><a href="tel:${site.phoneHref}" onclick="phoneClick()">${site.phone}</a><br><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <div>
      <h4>Services</h4>
      <ul>
${serviceLinks}
      </ul>
    </div>
    <div>
      <h4>Service Areas</h4>
      <ul>
${areaLinks}
      </ul>
    </div>
    <div>
      <h4>Company</h4>
      <ul>
        <li><a href="/service-areas/">Service Areas</a></li>
        <li><a href="/#how">How It Works</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><a href="/apply">Careers</a></li>
      </ul>
    </div>
    <div>
      <h4>Hours</h4>
      <ul>
        <li>Mon–Fri · 7am–6pm</li>
        <li>Saturday · 8am–4pm</li>
        <li>Sunday · Closed</li>
        <li>24-Hour Callback Window</li>
      </ul>
    </div>
  </div>
  <div class="wrap footmap">
    <iframe title="Breeze Pest Control location on Google Maps" src="${site.gbpEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  </div>
  <div class="wrap fbottom">
    <span>© ${site.copyrightYear} Breeze Pest Control · All rights reserved. · <a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms/">Terms &amp; Conditions</a></span>
    <span>FDACS Lic. #${site.license} · Fully Licensed &amp; Insured</span>
  </div>
</footer>

<script>
  // Phone click conversion event (Saba: attach Google Ads call conversion label in GTM or replace send_to below)
  function phoneClick(){
    try{
      gtag('event','phone_call_click',{event_category:'lead',event_label:'tel_link'});
      window.dataLayer.push({event:'phone_call_click'});
    }catch(e){}
  }
  // Lead form: submit to Netlify Forms via fetch, show thank-you view, fire conversion
  document.getElementById('leadform').addEventListener('submit',function(e){
    e.preventDefault();
    var f=e.target;
    var data=new URLSearchParams(new FormData(f)).toString();
    fetch('/', {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data})
      .catch(function(){})
      .finally(function(){
        document.getElementById('formview').style.display='none';
        document.getElementById('thanksview').style.display='block';
        try{
          gtag('event','generate_lead',{event_category:'lead',event_label:'quote_form'});
          window.dataLayer.push({event:'quote_form_submitted'});
          // Saba: for Google Ads form conversion add:
          // gtag('event','conversion',{send_to:'${site.googleAdsId}/CONVERSION_LABEL'});
        }catch(err){}
        document.getElementById('thanksview').scrollIntoView({behavior:'smooth',block:'center'});
      });
  });
</script>
</body>
</html>
`;
}
