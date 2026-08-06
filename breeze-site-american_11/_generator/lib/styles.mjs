// Shared stylesheet for every generated page.
// BASE is copied verbatim from the existing hand-built pages so generated pages
// are visually indistinguishable from the ones already live. ADDITIONS holds the
// new section styles (breadcrumbs, Benefits/Why split, hub card grids).

const BASE = `
  :root{
    --navy:#0B2447;
    --navy-2:#123168;
    --royal:#1B5FCC;
    --sky:#5CA8F5;
    --gold:#FFB81C;
    --gold-deep:#E8940A;
    --red:#BF1E2E;
    --ink:#131A24;
    --muted:#4E5C6E;
    --paper:#F6F8FB;
    --white:#FFFFFF;
    --line:rgba(11,36,71,.14);
    --shadow:0 6px 24px rgba(11,36,71,.12);
    --shadow-lg:0 18px 50px rgba(11,36,71,.22);
    --r:12px;
    --disp:"Barlow Condensed",Impact,sans-serif;
    --body:"Barlow",Arial,sans-serif;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}}
  body{font-family:var(--body);color:var(--ink);background:var(--white);line-height:1.55;font-size:16.5px}
  img{max-width:100%;display:block}
  a{color:var(--royal)}
  .wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  h1,h2,h3{font-family:var(--disp);text-transform:uppercase;letter-spacing:.5px;line-height:1.04}
  h2{font-size:clamp(30px,4.4vw,46px);font-weight:800;color:var(--navy)}
  .kicker{display:inline-flex;align-items:center;gap:8px;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:2.5px;font-size:14px;color:var(--red);margin-bottom:10px}
  .kicker::before,.kicker::after{content:"★";color:var(--gold-deep);font-size:11px}
  .sub{color:var(--muted);max-width:680px;margin:12px auto 0;text-align:center}
  section{padding:64px 0}
  .center{text-align:center}
  .grad{background:linear-gradient(180deg,var(--sky) 0%,var(--royal) 46%,var(--gold) 52%,var(--gold-deep) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}

  /* ===== top urgency bar ===== */
  .topbar{background:var(--red);color:#fff;font-family:var(--disp);font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-size:14px;text-align:center;padding:8px 12px}
  .topbar a{color:#fff;text-decoration:underline;text-underline-offset:3px}

  /* ===== header ===== */
  header{position:sticky;top:0;z-index:60;background:var(--white);border-bottom:3px solid var(--gold);box-shadow:0 2px 12px rgba(11,36,71,.08)}
  .nav{display:flex;align-items:center;gap:22px;height:70px}
  .logo{display:flex;flex-direction:column;line-height:1;text-decoration:none}
  .logo .b{font-family:var(--disp);font-weight:800;font-size:34px;letter-spacing:1px;background:linear-gradient(180deg,#7db9f8 0%,#1B5FCC 45%,#FFB81C 55%,#E8940A 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}
  .logo .p{font-family:var(--disp);font-weight:700;font-size:12.5px;letter-spacing:4.5px;color:var(--ink)}
  .navlinks{display:flex;gap:20px;margin-left:auto}
  .navlinks a{font-weight:600;color:var(--navy);text-decoration:none;font-size:15px}
  .navlinks a:hover{color:var(--royal)}
  .headcall{margin-left:auto;display:flex;align-items:center;gap:14px}
  .navlinks + .headcall{margin-left:0}
  .phone-lg{font-family:var(--disp);font-weight:800;font-size:24px;color:var(--navy);text-decoration:none;white-space:nowrap}
  .btn{display:inline-block;font-family:var(--disp);font-weight:800;text-transform:uppercase;letter-spacing:1px;border-radius:8px;text-decoration:none;text-align:center;cursor:pointer;border:0;transition:transform .12s ease,box-shadow .12s ease}
  .btn:focus-visible{outline:3px solid var(--royal);outline-offset:2px}
  .btn-gold{background:linear-gradient(180deg,var(--gold),var(--gold-deep));color:var(--navy);padding:13px 24px;font-size:18px;box-shadow:0 4px 14px rgba(232,148,10,.45)}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-navy{background:var(--navy);color:#fff;padding:13px 24px;font-size:18px}
  .btn-outline{border:2px solid #fff;color:#fff;padding:12px 24px;font-size:18px;background:transparent}
  .btn-red{background:var(--red);color:#fff;padding:13px 24px;font-size:18px}

  /* ===== hero ===== */
  .hero{background:radial-gradient(1100px 620px at 78% -10%, #1c3f86 0%, transparent 60%),linear-gradient(160deg,var(--navy) 0%,var(--navy-2) 70%,#0d295a 100%);color:#fff;padding:56px 0 60px;position:relative;overflow:hidden}
  .hero::before{content:"★ ★ ★ ★ ★";position:absolute;top:22px;left:-14px;color:rgba(255,184,28,.16);font-size:56px;letter-spacing:20px;transform:rotate(-90deg);transform-origin:left top}
  .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center}
  .hero h1{font-size:clamp(38px,5.6vw,64px);font-weight:800}
  .hero h1 .grad{filter:drop-shadow(0 2px 0 rgba(0,0,0,.35))}
  .hero p.lead{margin:16px 0 22px;font-size:19px;color:#dbe6f7;max-width:540px}
  .hero p.lead a{color:var(--gold);text-decoration:underline;text-underline-offset:3px}
  .offer-badge{display:inline-flex;align-items:center;gap:8px;background:var(--red);color:#fff;font-family:var(--disp);font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-size:16px;padding:9px 18px;border-radius:6px;box-shadow:0 4px 14px rgba(191,30,46,.45);margin:14px 0 20px;border:1.5px solid rgba(255,255,255,.35)}
  .offer-badge b{color:var(--gold);font-weight:800}
  .hero-ctas{display:flex;gap:14px;flex-wrap:wrap}
  .hero-ctas .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px}
  .trustrow{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
  .chip{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:7px 14px;font-size:13.5px;font-weight:600;color:#eaf1fc}
  .chip b{color:var(--gold)}
  .hero-img{position:relative}
  .hero-img img{border-radius:16px;box-shadow:var(--shadow-lg);border:4px solid #fff;width:100%;height:auto;aspect-ratio:4/3.4;max-height:540px;object-fit:cover;object-position:center 32%}
  .ratecard{position:absolute;bottom:-18px;left:-14px;background:#fff;color:var(--navy);border-radius:12px;padding:12px 18px;box-shadow:var(--shadow);text-align:center}
  .ratecard .stars{color:var(--gold-deep);font-size:18px;letter-spacing:2px}
  .ratecard .n{font-family:var(--disp);font-weight:800;font-size:22px}
  .ratecard .s{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}

  /* ===== quote form ===== */
  .quote{background:var(--paper);border-bottom:1px solid var(--line)}
  .quote-card{background:#fff;border:1px solid var(--line);border-top:6px solid var(--gold);border-radius:14px;box-shadow:var(--shadow);padding:30px;margin-top:-92px;position:relative;z-index:5}
  .quote-card h2{font-size:clamp(26px,3.4vw,36px)}
  .quote-card .fast{color:var(--red);font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;font-size:15px}
  .fgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:18px}
  .f-3{grid-column:span 3}.f-2{grid-column:span 2}.f-6{grid-column:span 6}
  label{display:block;font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--navy);margin-bottom:5px}
  input,select,textarea{width:100%;padding:12px 13px;border:1.5px solid var(--line);border-radius:8px;font-family:var(--body);font-size:16px;background:#fff;color:var(--ink)}
  input:focus,select:focus,textarea:focus{outline:2px solid var(--royal);border-color:var(--royal)}
  .fine{font-size:12.5px;color:var(--muted);margin-top:12px}
  .quote-actions{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:18px}
  .or{font-family:var(--disp);font-weight:700;text-transform:uppercase;color:var(--muted)}
  .thanks{display:none;text-align:center;padding:34px 10px}
  .thanks .big{font-family:var(--disp);font-weight:800;font-size:38px;color:var(--navy);text-transform:uppercase}
  .thanks p{color:var(--muted);max-width:520px;margin:10px auto 18px}

  /* ===== services / hub cards ===== */
  .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:36px}
  .card.feat{border:3px solid var(--gold);box-shadow:0 10px 34px rgba(232,148,10,.28)}
  .card{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column}
  .card img{height:230px;width:100%;object-fit:cover}
  .card .pad{padding:22px 22px 26px;display:flex;flex-direction:column;flex:1}
  .card h3{font-size:26px;color:var(--navy);margin-bottom:8px}
  .card p{color:var(--muted);font-size:15.5px;flex:1}
  .card ul{list-style:none;margin:12px 0 18px;flex:1}
  .card li{padding-left:24px;position:relative;margin:7px 0;font-size:15px;color:var(--ink)}
  .card li::before{content:"✔";position:absolute;left:0;color:var(--royal);font-weight:800}
  .tag{align-self:flex-start;background:var(--red);color:#fff;font-family:var(--disp);font-weight:700;letter-spacing:1.5px;text-transform:uppercase;font-size:12px;border-radius:4px;padding:4px 10px;margin-bottom:10px}
  .tag.blue{background:var(--royal)}

  /* ===== guarantee ===== */
  .guarantee{background:var(--paper)}
  .g-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:44px;align-items:center}
  .g-grid img{border-radius:14px;box-shadow:var(--shadow);max-width:340px;margin:0 auto}
  .shield{display:inline-flex;align-items:center;gap:10px;background:var(--navy);color:var(--gold);font-family:var(--disp);font-weight:800;text-transform:uppercase;letter-spacing:1.5px;padding:10px 18px;border-radius:8px;font-size:18px;margin-bottom:14px}
  .g-grid p{color:var(--muted);margin:10px 0}

  /* ===== areas / map ===== */
  .areas .a-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:36px;align-items:start;margin-top:32px}
  .citylist{display:grid;grid-template-columns:1fr 1fr;gap:8px 22px;margin-top:16px}
  .citylist span{padding:8px 0;border-bottom:1px dashed var(--line);font-weight:600;color:var(--navy)}
  .citylist span a{color:var(--navy);text-decoration:none}.citylist span a:hover{color:var(--royal);text-decoration:underline}.citylist span::before{content:"★ ";color:var(--gold-deep);font-size:11px}
  .mapbox{border-radius:14px;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--line)}
  .mapbox iframe{width:100%;height:420px;border:0;display:block}

  /* ===== faq ===== */
  .faq{background:var(--paper)}
  .qa{background:#fff;border:1px solid var(--line);border-left:5px solid var(--royal);border-radius:10px;margin-top:14px;overflow:hidden}
  .qa summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:14px;padding:17px 20px;font-family:var(--disp);font-weight:700;font-size:19px;text-transform:uppercase;letter-spacing:.5px;color:var(--navy)}
  .qa summary::-webkit-details-marker{display:none}
  .qa summary::after{content:"+";font-size:26px;color:var(--gold-deep);font-weight:800}
  .qa[open] summary::after{content:"–"}
  .qa .a{padding:0 20px 18px;color:var(--muted)}

  /* ===== final cta ===== */
  .final{background:radial-gradient(900px 400px at 50% -20%, #1c3f86 0%, transparent 60%),var(--navy);color:#fff;text-align:center;padding:76px 0}
  .final h2{color:#fff;font-size:clamp(34px,5vw,54px)}
  .final h2 .grad{filter:drop-shadow(0 2px 0 rgba(0,0,0,.35))}
  .final p{color:#d9e4f6;margin:14px auto 26px;max-width:560px}
  .final .hero-ctas{justify-content:center}

  /* ===== footer ===== */
  footer{background:#081a35;color:#b9c8e0;padding:54px 0 40px;font-size:14.5px}
  .fgrid4{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1fr;gap:30px}
  footer h4{font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--gold);font-size:15px;margin-bottom:12px}
  footer a{color:#dfe8f7;text-decoration:none}
  footer a:hover{text-decoration:underline}
  footer ul{list-style:none}
  footer li{margin:7px 0}
  .fbottom{border-top:1px solid rgba(255,255,255,.14);margin-top:38px;padding-top:18px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:13px;color:#8fa2c2}

  /* ===== nav dropdown (Service Areas) — CSS only, no JS ===== */
  .navdrop{position:relative;display:flex;align-items:center}
  .navdrop > a{font-weight:600;color:var(--navy);text-decoration:none;font-size:15px;display:inline-flex;align-items:center;gap:5px}
  .navdrop > a::after{content:"\\25BE";font-size:11px;opacity:.65}
  .navdrop:hover > a,.navdrop:focus-within > a{color:var(--royal)}
  .navdrop-panel{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:14px;background:#fff;border:1px solid var(--line);border-top:3px solid var(--gold);border-radius:10px;box-shadow:var(--shadow-lg);padding:10px 0;display:none;flex-direction:column;z-index:80;white-space:nowrap;min-width:210px}
  /* invisible bridge so the menu survives the gap between link and panel */
  .navdrop-panel::before{content:"";position:absolute;top:-16px;left:0;right:0;height:16px}
  .navdrop:hover .navdrop-panel,.navdrop:focus-within .navdrop-panel{display:flex}
  .navdrop-panel a{display:block;padding:9px 22px;font-size:15px;font-weight:600;color:var(--navy);text-decoration:none}
  .navdrop-panel a:hover{color:var(--royal);background:var(--paper)}

  /* ===== footer map (sits below the footer columns) ===== */
  .footmap{margin-top:34px}
  .footmap iframe{width:100%;height:260px;border:0;display:block;border-radius:12px}
  @media(max-width:560px){.footmap iframe{height:200px}}
`;

// New sections introduced by the generated-page template.
const ADDITIONS = `
  /* ===== breadcrumbs (inside hero) ===== */
  .crumbs{font-size:13.5px;color:#9db4d8;margin-bottom:14px;font-weight:600}
  .crumbs a{color:#cfe0f8;text-decoration:none}
  .crumbs a:hover{color:var(--gold);text-decoration:underline}
  .crumbs .sep{opacity:.55;margin:0 7px}
  .crumbs .here{color:#eaf1fc}

  /* ===== split section (Benefits / Why) ===== */
  .split .grid2{display:grid;grid-template-columns:1fr 1fr;gap:46px;align-items:center}
  .split .media img{border-radius:14px;box-shadow:var(--shadow);width:100%;aspect-ratio:4/3.2;object-fit:cover}
  .split.rev{background:var(--paper)}
  .split.rev .media{order:2}
  .split.rev .body{order:1}
  .split .body h2{text-align:left}
  .split .sub2{color:var(--muted);margin:12px 0 20px;max-width:560px}
  .split .sub2 a{color:var(--royal);font-weight:600}
  .split ul{list-style:none;margin:0 0 24px}
  .split li{padding-left:32px;position:relative;margin:16px 0;color:var(--muted);font-size:15.5px}
  .split li::before{content:"✔";position:absolute;left:0;top:1px;color:var(--royal);font-weight:800;font-size:17px}
  .split li b{display:block;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.5px;font-size:18.5px;color:var(--navy);margin-bottom:2px}
  .split li a{color:var(--royal);font-weight:600}
  .split .ctas{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
  .split .ctas .phone-lg{font-size:22px}

  /* ===== hub grid ===== */
  .hub{background:var(--paper)}
  /* Heroless page: the hub leads, so it carries the H1 and breadcrumbs. The
     breadcrumbs need dark text here — the hero versions sit on navy. */
  .hub.lead{padding-top:40px}
  .hub.lead h1{font-size:clamp(30px,4.4vw,46px);font-weight:800;color:var(--navy)}
  .hub.lead .crumbs{color:var(--muted);margin-bottom:22px}
  .hub.lead .crumbs a{color:var(--royal)}
  .hub.lead .crumbs a:hover{color:var(--gold-deep)}
  .hub.lead .crumbs .here{color:var(--navy)}
  .hub .cards{margin-top:36px}
  .hub .sub{max-width:940px}
  .hub .card p{margin-bottom:16px}
  .hub .card .go{align-self:flex-start;margin-top:auto;font-family:var(--disp);font-weight:800;text-transform:uppercase;letter-spacing:1px;font-size:16px;color:var(--royal);text-decoration:none}
  /* Location cards are title + CTA only, so they centre. Service cards keep
     their description and stay left-aligned. */
  .hub.loc .card .pad{text-align:center;align-items:center}
  .hub.loc .card .go{align-self:center}
  .hub .card .go:hover{color:var(--gold-deep)}
  .hub .card .go::after{content:" →"}

  /* ===== map section ===== */
  .maprow .mapdesc{color:var(--muted);max-width:760px;margin:12px auto 26px;text-align:center}
  .maprow .mapdesc a{color:var(--royal);font-weight:600}

  /* ===== quote form: sits below the map, NOT overlapping the hero =====
     Cancels the negative margin the legacy hand-built pages use to pull the
     card up over the hero. */
  .quote{border-top:1px solid var(--line);border-bottom:0}
  .quote-card{margin-top:0}

  /* Background rhythm for the generated section order:
     hero(navy) → hub(paper) → benefits(white) → why(paper) → faq(white)
     → map(white) → quote(paper) → final(navy) */
  .faq{background:#fff}

  @media(max-width:980px){
    .hero-grid,.g-grid,.areas .a-grid,.split .grid2{grid-template-columns:1fr}
    .cards{grid-template-columns:1fr}
    .split.rev .media,.split.rev .body{order:initial}
    .navlinks{display:none}
    .f-3,.f-2{grid-column:span 6}
    .phone-lg{font-size:20px}
    .hero{padding:40px 0 44px}
    section{padding:48px 0}
    .hero::before{display:none}
    .hero-img img{aspect-ratio:16/11;max-height:330px;border-width:3px}
    .ratecard{left:12px;bottom:12px;padding:8px 14px;border-radius:10px}
    .ratecard .stars{font-size:14px;letter-spacing:1px}
    .ratecard .n{font-size:18px}
    .ratecard .s{font-size:9.5px;letter-spacing:1px}
    .kicker{letter-spacing:1.5px;font-size:12.5px;text-align:left}
    .topbar{font-size:12px;letter-spacing:.6px;padding:7px 10px}
    .quote-card{padding:22px 16px}
    .g-grid img{max-width:280px}
    .hero p.lead{font-size:17px}
    .offer-badge{font-size:13px;letter-spacing:.7px;padding:8px 12px;max-width:100%;flex-wrap:wrap;justify-content:center;text-align:center;line-height:1.35}
    .trustrow .chip{font-size:12.5px;padding:6px 12px}
    .hero-ctas{flex-direction:column;gap:12px}
    .g-grid > *{min-width:0}
    .shield{font-size:15px;letter-spacing:1px;padding:9px 14px}
    .hero-ctas .btn{width:100%;flex:none;white-space:nowrap}
    .mapbox iframe{height:320px}
    .fgrid4{grid-template-columns:1fr 1fr}
  }
  @media(max-width:560px){
    .headcall .btn{display:none}
    .fgrid4{grid-template-columns:1fr}
    .hero h1{font-size:clamp(32px,11vw,42px)}
    h2{font-size:clamp(27px,7.5vw,34px)}
    .phone-lg{font-size:17px}
    .hero-ctas .btn{white-space:normal;font-size:17px!important;padding:13px 16px}
    .nav{gap:10px}
    .crumbs{font-size:12.5px}
  }
`;

export const styles = BASE + ADDITIONS;
