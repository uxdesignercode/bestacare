// Generates the static HTML pages into the project root.  Run:  node tools/build.mjs
// The output is plain HTML + CSS + JS. Node is only used to avoid repeating the header, footer and
// service-page layout by hand. Edit content in tools/data.mjs, then run this again.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services, homeFaqs, faqTopics, guides, VIDEOS, PHONE, PHONE2, TEL, WA } from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Sample photos from the Figma design. [file, object-position]
const PHOTOS = { care: ['photo-care', '77% 50%'], nurse: ['photo-nurse', '50% 25%'], train: ['photo-train', '50% 50%'], elder: ['photo-elder', '50% 25%'], family: ['photo-family', '50% 10%'], hands: ['photo-hands', '50% 85%'], nurse2: ['photo-nurse2', '50% 25%'], team: ['photo-team', '50% 32%'], bp: ['photo-bp', '50% 100%'], ball: ['photo-ball', '50% 50%'] };
const photo = (key) => `assets/img/${PHOTOS[key][0]}.jpg`;
const pos = (key, guide = false) => ` style="object-position:${guide && key === 'hands' ? '50% 30%' : PHOTOS[key][1]}"`;

/* ---------- icons ---------- */
const ICONS = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'circle-x': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  'arrow-right': '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  contact: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-1a5 5 0 0 1 10 0v1"/>',
  'hand-heart': '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
  stethoscope: '<path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  baby: '<path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
  ribbon: '<circle cx="12" cy="8" r="5"/><path d="m9 12-3 9 6-3 6 3-3-9"/>',
  hardhat: '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5M4 15v-3a6 6 0 0 1 6-6M14 6a6 6 0 0 1 6 6v3"/>',
  factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M17 18h1M12 18h1M7 18h1"/>',
  play: '<path d="M6 3l14 9-14 9z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41m11.32-11.32 1.41-1.41M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  syringe: '<path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-3c0-.3.1-.5.3-.7L14.5 5M9 11l4 4M5 19l-3 3M14 4l6 6"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
};
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</svg>`;
const ic = (n, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- shared parts ---------- */
const NAV = [['index.html', 'Home', 'home'], ['services.html', 'Services', 'services'], ['faqs.html', 'FAQs', 'faqs'], ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']];
const logo = `<a class="logo" href="index.html" aria-label="BestaCare home"><img src="assets/img/logo-mark.png" alt="" width="37" height="40"><img src="assets/img/logo-wordmark.png" alt="BestaCare" width="129" height="22"></a>`;

const header = (active) => `
<header class="topbar">
  <div class="topbar__in">
    ${logo}
    <nav class="nav" aria-label="Main">${NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <a class="phone-link" href="${TEL}">${ic('phone', 'i--18')}${PHONE}</a>
    <button class="btn btn--call" type="button" data-open-callback>${ic('phone')}Call me back</button>
    <a class="phone-round" href="${TEL}" aria-label="Call ${PHONE}">${ic('phone', 'i--22')}</a>
  </div>
</header>`;

const tabbar = (active) => `
<nav class="tabbar" aria-label="Quick links">
  <a href="index.html"${active === 'home' ? ' aria-current="page"' : ''}>${ic('home', 'i--22')}Home</a>
  <a href="services.html"${active === 'services' ? ' aria-current="page"' : ''}>${ic('grid', 'i--22')}Services</a>
  <a class="tab-call" href="${TEL}" aria-label="Call us">${ic('phone', 'i--26')}</a>
  <a href="${WA}">${ic('message', 'i--22')}WhatsApp</a>
  <a href="contact.html"${active === 'contact' ? ' aria-current="page"' : ''}>${ic('contact', 'i--22')}Contact</a>
</nav>`;

const footer = () => `
<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">${logo}<p>Patient care at home. Trained caretakers and nurses for your family.</p></div>
      <div class="footer__call">
        <h4>Call us</h4>
        <a href="${TEL}"><span class="circle circle--36">${ic('phone', 'i--18')}</span>${PHONE}</a>
        <a href="tel:+916387405700"><span class="circle circle--36">${ic('phone', 'i--18')}</span>${PHONE2}</a>
        <a href="${WA}"><span class="circle circle--36">${ic('message', 'i--18')}</span>WhatsApp ${PHONE}</a>
      </div>
      <div class="footer__pages"><h4>Pages</h4>
        <div class="footer__grid">
          <a href="services.html">Services</a><a href="caretakers.html">Our caretakers</a>
          <a href="care-guides.html">Care guides</a><a href="faqs.html">FAQs</a>
          <a href="work-with-us.html">Work with us</a><a href="about.html">About</a>
          <a href="contact.html">Contact</a><a href="privacy-terms.html">Privacy and terms</a>
        </div>
      </div>
    </div>
    <hr>
    <p class="small">© 2026 BestaCare Life Services Agency. Navi Mumbai.</p>
  </div>
</footer>`;

const dialog = `
<div class="dlg" id="cb-dialog" role="dialog" aria-modal="true" aria-labelledby="cb-dialog-title" hidden>
  <div class="dlg__card" tabindex="-1">
    <span class="grab"></span>
    <div data-dlg="form">
      <div class="dlg__head"><span class="circle circle--48">${ic('phone', 'i--22')}</span><h2 id="cb-dialog-title">Get a call back</h2><button class="dlg__x" type="button" data-close aria-label="Close">${ic('x')}</button></div>
      <p class="muted" style="margin-top:16px">Leave your number. A care advisor will call you and answer your questions.</p>
      <div style="margin-top:16px"><span class="promise">${ic('clock', 'i--18')}We call you back within 5 minutes.</span></div>
      <div style="margin-top:16px">${callbackForm({ id: 'dlg', variant: 'card', label: 'Call me back' })}</div>
    </div>
    <div data-dlg="ok" class="dlg__ok" hidden>
      <div class="dlg__head"><span class="circle circle--48">${ic('check', 'i--22')}</span><h2>Thank you</h2><button class="dlg__x" type="button" data-close aria-label="Close">${ic('x')}</button></div>
      <p style="margin-top:16px" data-ok-text></p>
      <p class="muted" style="margin-top:8px">Keep your phone near you. If you miss our call, we try again.</p>
      <button class="btn btn--call btn--lg btn--block" type="button" data-close style="margin-top:20px">Close</button>
    </div>
  </div>
</div>`;

/* Call-back form. variants: hero (button inside the field), band (stacked, on dark), aside / card (stacked, light). */
function callbackForm({ id, variant = 'card', label = 'Call me back', forLine = '', orCall = true }) {
  const dark = variant === 'band';
  const inside = variant === 'hero';
  const btn = `<button class="btn btn--call${inside ? '' : ' btn--lg btn--block'}" type="submit">${ic('phone')}${inside ? `<span class="d-only">${label}</span><span class="m-only">Call back</span>` : label}</button>`;
  return `
<form class="cbf cbf--${variant}${dark ? ' on-dark' : ''}" data-callback novalidate>
  ${inside ? `<span class="promise">${ic('clock', 'i--18')}We call you back within 5 minutes.</span>` : dark ? `<span class="promise">${ic('clock', 'i--18')}We call you back within 5 minutes.</span>` : ''}
  ${inside ? `<div class="cbf__mhead"><span class="circle circle--48">${ic('phone', 'i--22')}</span><div><b>Get a call back</b><span>${forLine ? esc(forLine) + '. A person calls you.' : 'Enter your number. A person calls you.'}</span></div></div>` : ''}
  ${forLine ? `<span class="small muted for-line" style="display:flex;gap:6px;align-items:center">${ic('info', 'i--16')}${esc(forLine)}</span>` : ''}
  <div class="fld">
    <label class="cbf__label" for="${id}-name">Your name</label>
    <div class="field__box">
      <input id="${id}-name" name="cbname" type="text" autocomplete="name" placeholder="Full name" maxlength="80">
    </div>
    <p class="err" role="alert" hidden>${ic('alert', 'i--16')}<span></span></p>
  </div>
  <div class="fld">
    <label class="cbf__label" for="${id}-phone">Your mobile number</label>
    <div class="field__box${inside ? ' field__box--btn' : ''}">
      <span class="cc">+91</span>
      <input id="${id}-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" data-ph-m="Your number" maxlength="11" aria-describedby="${id}-help">
      ${inside ? btn : ''}
    </div>
    <p class="err" role="alert" hidden>${ic('alert', 'i--16')}<span></span></p>
    <p class="helper" id="${id}-help">We use it only to call you about care.</p>
  </div>
  <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  ${inside ? '' : btn}
  ${!orCall ? '' : variant === 'card' ? `<p class="orcall" style="justify-content:center">Or call now: <a href="${TEL}">${PHONE}</a></p>` : `<p class="orcall">Or call now: <a href="${TEL}">${PHONE}</a></p>`}
</form>`;
}

const finalCallback = (kicker, title, text, id = 'fin') => `
<section class="sec" id="callback">
  <div class="wrap">
    <div class="band on-dark rv">
      <span class="decor" style="left:900px;top:-140px;width:320px;height:320px"></span><span class="decor" style="left:-60px;bottom:-80px;width:200px;height:200px"></span>
      <div class="band__text"><span class="eyebrow">Talk to us</span><h2 class="h-2">${esc(title)}</h2><p class="lead">${esc(text)}</p></div>
      <div class="band__form">${callbackForm({ id, variant: 'band' })}</div>
    </div>
  </div>
</section>`;

const crumbs = (items) => `<nav class="crumb" aria-label="Breadcrumb">${items.map((it, i) => {
  const last = i === items.length - 1;
  return (i ? '<span aria-hidden="true">/</span>' : '') + (last ? `<span aria-current="page">${esc(it[1])}</span>` : `<a href="${it[0]}">${esc(it[1])}</a>`);
}).join('')}</nav>`;

const pageHead = (cr, title, sub) => `
<section class="page-head"><div class="wrap">${crumbs(cr)}<h1 class="h-1">${esc(title)}</h1>${sub ? `<p class="lead">${esc(sub)}</p>` : ''}</div></section>`;

const faqItems = (items, openFirst = true, idp = 'f') => items.map(([q, a], i) => `
<div class="faq${openFirst && i === 0 ? ' is-open' : ''}">
  <h3><button class="faq__q" type="button" aria-expanded="${openFirst && i === 0}" aria-controls="${idp}${i}"><span>${esc(q)}</span><span class="faq__ic">${ic('plus', 'i--18 i-plus')}${ic('minus', 'i--18 i-minus')}</span></button></h3>
  <div class="faq__a" id="${idp}${i}"${openFirst && i === 0 ? '' : ' hidden'}>${esc(a)}</div>
</div>`).join('');

const tile = (s, extra = '') => `
<a class="tile rv" href="${s.file}"${extra}>
  <span class="tile__ic">${ic(s.icon, 'i--26')}</span>
  <div class="tile__t"><h3>${esc(s.name)}</h3><p>${esc(s.blurb)}</p></div>
  <div class="tile__bottom"><span>${esc(s.meta)}</span><i>${ic('arrow-up-right')}</i></div>
</a>`;

/* Video box. With a link in tools/data.mjs (VIDEOS) it plays in place when tapped; without one it stays a placeholder. */
const vid = (key, title) => {
  const v = VIDEOS[key] || {};
  const attrs = v.src ? ` data-video="${esc(v.src)}" data-title="${esc(title)}"${v.poster ? ` data-poster="${esc(v.poster)}"` : ''}` : '';
  const bg = v.poster ? ` style="background-image:url('${esc(v.poster)}')"` : '';
  return `<div class="vid${v.poster ? ' vid--poster' : ''}"${attrs}${bg}><button type="button" aria-label="${v.src ? 'Play video: ' + esc(title) : 'Video coming soon'}"${v.src ? '' : ' disabled'}>${ic('play', 'i--28')}</button>${v.src ? '' : `<span>Video: ${esc(title)}</span>`}</div>`;
};

const steps = (arr) => `<div class="steps ${arr.length === 3 ? 'steps--3' : ''}">${arr.map(([t, p], i) => `<div class="step rv"><b>0${i + 1}</b><div><h3>${esc(t)}</h3><p>${esc(p)}</p></div></div>`).join('')}</div>`;

function page({ file, title, desc, active, body, bodyClass = '' }) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#0f5c3f">
  <link rel="icon" href="assets/img/logo-mark.png">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="${bodyClass}">
${sprite}
<a class="skip" href="#main">Skip to content</a>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
${tabbar(active)}
${dialog}
<script src="js/main.js" defer></script>
</body>
</html>
`;
  writeFileSync(join(ROOT, file), html);
  console.log('wrote', file);
}

/* ---------- HOME ---------- */
const quick = [['hand-heart', 'Caretaker', 0], ['stethoscope', 'Nurse', 1], ['bed', 'Ward boy', 2], ['heart', 'Elderly', 3], ['baby', 'Baby', 4], ['ribbon', 'Cancer', 5], ['factory', 'Industrial', 6]];
const homeSteps = [['We meet them in person', 'Our team talks to every caretaker before they work with a family.'], ['We check their ID', 'We check Aadhaar and other documents.'], ['Trained for patient care', 'Bathing, feeding, lifting and medicines on time.'], ['Another person if needed', 'If someone cannot come, we send another trained person.']];
const dos = ['Bathing, dressing and personal hygiene', 'Feeding and medicines on time', 'Help with walking and turning in bed', "Keeping the patient's room clean", 'Company through the day or night'];

page({
  file: 'index.html', active: 'home', bodyClass: 'home',
  title: 'BestaCare · Trained care for your family, at home',
  desc: 'Caretakers, nurses and attendants for day, night or 24 hours in Navi Mumbai. Tell us about the patient and we call you back within 5 minutes.',
  body: `
<section class="hero">
  <div class="wrap hero__in">
    <div class="hero__text">
      <span class="eyebrow">Navi Mumbai · Home and hospital care</span>
      <h1 class="h-display">Trained care for your family, <em>at home</em></h1>
      <p class="lead">Caretakers, nurses and attendants for day, night or 24 hours. Tell us about the patient and we call you back.</p>
      <div class="ticks"><span class="tick">${ic('circle-check')}Male and female staff</span><span class="tick">${ic('circle-check')}12 or 24 hour shifts</span><span class="tick">${ic('circle-check')}Home or hospital</span></div>
      ${callbackForm({ id: 'hero', variant: 'hero' })}
    </div>
    <div class="stage">
      <div class="stage__photo"><img src="${photo('care')}"${pos('care')} alt="A BestaCare caretaker helping an elderly patient at home" fetchpriority="high"></div>
      <div class="hero-m-title" aria-hidden="true"><span class="promise">${ic('clock', 'i--18')}Call back in 5 minutes</span><p class="hero-m-h">Trained care for your family, at home</p></div>
      <div class="float" style="left:-48px;top:470px"><span class="circle">${ic('clock')}</span><div><strong>Call back</strong><span>within 5 minutes</span></div></div>
      <div class="float" style="left:300px;top:32px"><span class="circle">${ic('star')}</span><div><strong>0.0 on Google</strong><span>Rating to add</span></div></div>
    </div>
  <div class="quick" aria-label="What do you need?">
    <div class="quick__head"><span>What do you need?</span><a href="services.html">See all</a></div>
    <div class="quick__row">${quick.map(([i, l, n]) => `<a href="${services[n].file}"><span class="circle">${ic(i, 'i--26')}</span>${l}</a>`).join('')}</div>
  </div>
  </div>
</section>

<section class="stats">
  <div class="wrap stats__row">
    <!-- TODO: replace these placeholder numbers with real figures before launch -->
    <div class="stat"><strong>0.0</strong><span>Google rating</span></div>
    <div class="stat"><strong>00</strong><span>Years of care</span></div>
    <div class="stat"><strong>0,000</strong><span>Families helped</span></div>
    <div class="stat"><strong>7</strong><span>Kinds of care</span></div>
  </div>
</section>

<section class="sec" style="padding-top:32px">
  <div class="wrap" style="display:flex;flex-direction:column;gap:40px;align-items:center">
    <div class="heading heading--center rv"><span class="eyebrow">Our services</span><h2 class="h-2">How can we help?</h2><p class="lead">Choose a service to see what is included.</p></div>
    <div class="tiles" style="width:100%">${tile(services[0])}${tile(services[1])}${tile(services[2]).replace('class="tile rv"', 'class="tile tile--m rv"')}${tile(services[3])}</div>
    <a class="btn btn--primary btn--lg btn--m-outline" href="services.html">View all 7 services ${ic('arrow-right')}</a>
  </div>
</section>

<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap"><div class="band on-dark rv">
    <div class="band__text"><span class="eyebrow">Watch</span><h2 class="h-2">See how we care</h2><p class="lead">A short video from our team. See who comes to your home and what they do in a day.</p></div>
    ${vid('home', 'How BestaCare works')}
  </div></div>
</section>

<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap" style="display:flex;flex-direction:column;gap:24px">
    <div class="heading rv"><span class="eyebrow">Our people</span><h2 class="h-2">How we choose our caretakers</h2></div>
    ${steps(homeSteps)}
  </div>
</section>

<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap" style="display:flex;flex-direction:column;gap:24px">
    <h2 class="h-2 rv">What a caretaker does</h2>
    <div class="split rv">
      <div class="split__do"><h3 class="h-3">They do</h3>${dos.map((d) => `<div class="li">${ic('circle-check')}<span>${esc(d)}</span></div>`).join('')}</div>
      <div class="split__dont"><h3 class="h-3">They do not</h3>
        ${services[0].dont.map((d) => `<div class="li">${ic('circle-x')}<span>${esc(d)}</span></div>`).join('')}
        <div class="note">${ic('info')}<span>Need injections or drips? Choose a home nurse.</span></div>
        <a class="btn btn--link" href="${services[1].file}">See home nurse ${ic('arrow-right')}</a>
      </div>
    </div>
  </div>
</section>

<section class="sec sec--soft">
  <div class="wrap faq-row">
    <div class="faq-head rv"><span class="eyebrow">FAQs</span><h2 class="h-2">Common questions</h2><p class="lead">Still not sure? Call us and ask. A person answers.</p><a class="btn btn--link" href="faqs.html">See all FAQs ${ic('arrow-right')}</a></div>
    <div class="faq-list" data-accordion>${faqItems(homeFaqs, true, 'hf')}</div>
  </div>
</section>

${finalCallback('Talk to us', 'Talk to a care advisor', 'Tell us about the patient. We suggest the right care and tell you the price on the call.')}

<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap"><div class="work-card rv">
    <span class="circle circle--56">${ic('briefcase', 'i--22')}</span>
    <div><h3 class="h-3">Are you a caretaker or nurse?</h3><p class="muted">Work with us. Apply in 2 minutes and we call you about jobs.</p></div>
    <a class="btn btn--outline btn--lg" href="work-with-us.html">Apply to work with us</a>
  </div></div>
</section>`,
});

/* ---------- SERVICES ---------- */
page({
  file: 'services.html', active: 'services',
  title: 'Our care services · BestaCare', desc: 'Seven kinds of care at home or in hospital: patient caretaker, home nurse, ward boy, elderly care, baby nanny, cancer patient care and industrial nursing.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'Our care services']], 'Our care services', 'Seven kinds of care, at home or in hospital. Choose one to see what is included.')}
<section class="sec">
  <div class="wrap">
    <div class="tiles tiles--4 tiles--lg tiles--list">
      ${services.map((s) => tile(s)).join('')}
      <div class="tile tile--cta rv"><span class="tile__ic">${ic('help', 'i--26')}</span><h3>Not sure what you need?</h3><p>Tell us about the patient. We help you choose.</p><button class="btn btn--call btn--block" type="button" data-open-callback>${ic('phone')}Call me back</button></div>
    </div>
    <p class="note rv" style="margin-top:24px;width:auto;display:inline-flex;background:var(--bg-soft)">${ic('info')}Price depends on the patient's needs. We tell you on the call.</p>
  </div>
</section>
${finalCallback('', 'Not sure what you need?', 'Tell us about the patient. We help you choose the right care.')}`,
});

/* ---------- SERVICE DETAIL ---------- */
const shiftOpts = [['sun', '12 hour day', 'Daytime care'], ['moon', '12 hour night', 'Someone awake through the night'], ['clock', '24 hour', 'Day and night, stays with the patient']];
services.forEach((s, idx) => {
  const others = [1, 2, 3].map((k) => services[(idx + k) % services.length]);
  const w = s.who1;
  const stepsArr = [['We meet them in person', `Our team talks to every ${w} before they work with a family.`], ['We check their ID', 'We check Aadhaar and other documents.'], ['We check past work', 'We ask where they have worked before.']];
  page({
    file: s.file, active: 'services',
    title: `${s.name} · BestaCare`, desc: s.sub,
    body: `
<section class="hero service-hero">
  <div class="wrap hero__in">
    <div class="hero__text">
      ${crumbs([['index.html', 'Home'], ['services.html', 'Services'], ['', s.name]])}
      <div style="display:flex;align-items:center;gap:16px"><span class="circle circle--56" style="width:64px;height:64px">${ic(s.icon, 'i--28')}</span><h1 class="h-1">${esc(s.name)}</h1></div>
      <p class="lead">${esc(s.sub)}</p>
      <div class="chips">${s.ticks.map((t) => `<span class="tickchip">${ic('check', 'i--16')}${esc(t)}</span>`).join('')}</div>
      <p class="muted price-note" style="display:flex;gap:8px;align-items:center">${ic('info', 'i--18')}Price depends on the patient's needs. We tell you on the call.</p>
      ${callbackForm({ id: 'hero', variant: 'hero', forLine: `For: ${s.name}` })}
    </div>
    <div class="stage">
      <div class="stage__photo"><img src="${photo(s.photo)}"${pos(s.photo)} alt="${esc(s.name)}, sample photo" fetchpriority="high"></div>
            <div class="hero-m-title" aria-hidden="true"><div class="hero-m-row"><span class="circle">${ic(s.icon)}</span><span class="promise">${ic('clock', 'i--18')}Call back in 5 min</span></div><p class="hero-m-h">${esc(s.name)}</p><p class="hero-m-sub">${esc(s.ticks.slice(0, 2).join(' · '))}</p></div>
      <div class="float" style="left:-48px;top:470px"><span class="circle">${ic('circle-check')}</span><div><strong>${esc(s.float[0])}</strong><span>${esc(s.float[1])}</span></div></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap"><div class="band on-dark rv">
    <div class="band__text"><span class="eyebrow">Watch</span><h2 class="h-2">${esc(s.video)}</h2><p class="lead">A short video from our team.</p></div>
    ${vid(s.slug, s.video)}
  </div></div>
</section>

<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap" style="display:flex;flex-direction:column;gap:24px">
    <h2 class="h-2 rv">What is included</h2>
    <div class="split rv">
      <div class="split__do"><h3 class="h-3">What we do</h3>${s.do.map((d) => `<div class="li">${ic('circle-check')}<span>${esc(d)}</span></div>`).join('')}</div>
      <div class="split__dont"><h3 class="h-3">What we do not do</h3>${s.dont.map((d) => `<div class="li">${ic('circle-x')}<span>${esc(d)}</span></div>`).join('')}</div>
    </div>
  </div>
</section>

<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap" style="display:flex;flex-direction:column;gap:24px">
    <h2 class="h-2 rv">Who it is for</h2>
    <div class="who rv">${s.forWho.map(([i, t]) => `<div><span class="circle">${ic(i)}</span>${esc(t)}</div>`).join('')}</div>
  </div>
</section>

<section class="sec sec--soft" data-shifts data-service="${esc(s.name)}">
  <div class="wrap">
    <div class="heading rv"><span class="eyebrow">Shifts</span><h2 class="h-2">Choose a shift</h2><p class="lead">Pick what you need. We send it with your request, so the call is quicker.</p></div>
    <div class="shifts" role="radiogroup" aria-label="Shift">
      ${shiftOpts.map(([i, t, d], k) => `<label class="shift"><input type="radio" name="shift" value="${esc(t)}"${k === 2 ? ' checked' : ''}><span class="shift__card"><span class="circle">${ic(i)}</span><span class="shift__radio"></span><span class="shift__t"><h3>${t}</h3><p>${d}</p></span></span></label>`).join('')}
    </div>
    <div class="shift__sum"><span>${ic('circle-check')}<span data-shift-summary>For: ${esc(s.name)} · 24 hour</span></span><a class="btn btn--primary btn--lg" href="#callback" data-ask-shift>Ask about this shift ${ic('arrow-right')}</a></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="heading rv"><span class="eyebrow">Our people</span><h2 class="h-2">How we choose our ${s.whoPlural}</h2></div>
    <div style="margin-top:24px">${steps(stepsArr)}</div>
    <div class="replace rv"><span class="circle circle--56">${ic('refresh', 'i--22')}</span><div><h3>If the ${w} cannot come</h3><p>Call us. We send another trained person as quickly as we can.</p></div></div>
  </div>
</section>

<section class="sec sec--soft">
  <div class="wrap faq-row">
    <div class="faq-head rv"><span class="eyebrow">FAQs</span><h2 class="h-2">Questions about ${esc(s.name.toLowerCase())}</h2></div>
    <div class="faq-list" data-accordion>${faqItems(s.faqs, true, 'sf')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap" style="display:flex;flex-direction:column;gap:32px">
    <h2 class="h-2 rv">Other services</h2>
    <div class="tiles tiles--sm">${others.map((o) => tile(o)).join('')}</div>
  </div>
</section>

${finalCallback('Talk to us', 'Talk to a care advisor', `Tell us about the patient. We suggest the right ${w} and tell you the price on the call.`)}`,
  });
});

/* ---------- FAQS ---------- */
page({
  file: 'faqs.html', active: 'faqs',
  title: 'Questions families ask · BestaCare', desc: 'Clear answers about cost, staff, shifts and changes to home care from BestaCare.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'FAQs']], 'Questions families ask', 'Clear answers about cost, staff, shifts and changes.')}
<section class="sec">
  <div class="wrap">
    <div class="faq-row">
      <div class="topics" data-topics><h2>Topics</h2>
        <button class="topic" type="button" aria-pressed="true" data-topic="all">All questions</button>
        ${faqTopics.map(([t], i) => `<button class="topic" type="button" aria-pressed="false" data-topic="t${i}">${esc(t)}</button>`).join('')}
      </div>
      <div class="faq-list" data-accordion>
        ${faqTopics.map(([t, items], i) => `<h2 class="faq-group" data-group="t${i}">${esc(t)}</h2>${items.map(([q, a], k) => `<div class="faq${i === 0 && k === 0 ? ' is-open' : ''}" data-group="t${i}"><h3><button class="faq__q" type="button" aria-expanded="${i === 0 && k === 0}" aria-controls="q${i}-${k}"><span>${esc(q)}</span><span class="faq__ic">${ic('plus', 'i--18 i-plus')}${ic('minus', 'i--18 i-minus')}</span></button></h3><div class="faq__a" id="q${i}-${k}"${i === 0 && k === 0 ? '' : ' hidden'}>${esc(a)}</div></div>`).join('')}`).join('')}
      </div>
    </div>
    <div class="ask rv"><div><h3 class="h-3">Still have a question?</h3><p class="muted">Call us and ask. A person answers.</p></div><a class="btn btn--call btn--lg" href="${TEL}">${ic('phone')}Call ${PHONE}</a></div>
  </div>
</section>`,
});

/* ---------- CONTACT ---------- */
page({
  file: 'contact.html', active: 'contact',
  title: 'Contact · BestaCare', desc: 'Call, WhatsApp or ask for a call back. A person at BestaCare answers.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'Contact']], 'Talk to us', 'Call, WhatsApp or ask for a call back. A person answers.')}
<section class="sec">
  <div class="wrap contact-row">
    <div class="ways">
      <div class="way rv"><span class="circle circle--56">${ic('phone', 'i--22')}</span><div><small>Main number</small><strong>${PHONE}</strong></div><a class="btn btn--outline" href="${TEL}">Call</a></div>
      <div class="way rv"><span class="circle circle--56">${ic('phone', 'i--22')}</span><div><small>Second number</small><strong>${PHONE2}</strong></div><a class="btn btn--outline" href="tel:+916387405700">Call</a></div>
      <div class="way rv"><span class="circle circle--56">${ic('message', 'i--22')}</span><div><small>WhatsApp</small><strong>${PHONE}</strong></div><a class="btn btn--outline" href="${WA}">Message</a></div>
      <p class="note note--line rv">${ic('info')}<span>No need to visit an office. Call or WhatsApp us and we come to you.</span></p>
    </div>
    <div class="card cb-card rv" data-cb-card>
      <div class="dlg__head"><span class="circle circle--48">${ic('phone', 'i--22')}</span><h2 class="h-3" style="flex:1">Ask for a call back</h2></div>
      <span class="promise" style="align-self:flex-start">${ic('clock', 'i--18')}We call you back within 5 minutes.</span>
      <div><p class="small" style="margin-bottom:8px">Service <span class="opt">(optional)</span></p>
        <div class="chips" data-single data-name="service">${services.map((s) => `<button class="chip" type="button" aria-pressed="false" data-value="${esc(s.name)}">${ic('check')}${esc(s.name.replace(' and hospital attendant', '').replace('Baby nanny and newborn care', 'Baby care').replace('Cancer patient care', 'Cancer care'))}</button>`).join('')}</div></div>
      ${callbackForm({ id: 'contact', variant: 'aside', label: 'Call me back', orCall: false })}
    </div>
  </div>
</section>`,
});

/* ---------- ABOUT ---------- */
page({
  file: 'about.html', active: 'about',
  title: 'About BestaCare', desc: 'BestaCare gives patient care at home from Navi Mumbai. A person answers, we meet every caretaker, and we stay in touch.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'About']], 'About BestaCare', 'Patient care at home, from Navi Mumbai.')}
<section class="sec" style="padding-block:72px">
  <div class="wrap" style="display:flex;gap:64px;align-items:center;flex-wrap:wrap">
    <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:16px;align-items:flex-start"><span class="eyebrow">Our story</span><h2 class="h-2">Why BestaCare started</h2>
      <p class="owner-note">${ic('file-text')}Owner to add: the BestaCare story. Why it started, and who it helps.</p></div>
    <div class="team-photo" style="width:520px;max-width:100%;height:380px"><img src="${photo('train')}"${pos('train')} alt="Sample photo" loading="lazy"></div>
  </div>
</section>
<section class="sec sec--soft">
  <div class="wrap" style="display:flex;gap:40px;align-items:center;flex-wrap:wrap">
    <div class="ph-box ph-box--round">${ic('users', 'i--28')}<span>Photo of Sharif Khan</span></div>
    <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:16px;align-items:flex-start"><span class="quote-ic">${ic('quote', 'i--28')}</span><h2 class="h-3">A note from our owner</h2>
      <p class="owner-note">${ic('file-text')}Owner to add: a short note from Sharif Khan to families.</p><p class="small">Sharif Khan, Owner</p></div>
  </div>
</section>
<section class="sec">
  <div class="wrap" style="display:flex;flex-direction:column;gap:32px">
    <div class="heading"><span class="eyebrow">Our values</span><h2 class="h-2">How we work</h2></div>
    <div class="tiles tiles--4 values" style="gap:16px">${[['A person answers', 'You talk to our team, not a machine.', 'phone'], ['We meet every caretaker', 'No one goes to a family before we meet them.', 'user'], ['We stay in touch', 'If something is not right, call us. We fix it.', 'refresh'], ['Your choice matters', 'Ask for a male or female caretaker.', 'users']].map(([h, p, i]) => `<div class="tile rv"><span class="tile__ic">${ic(i, 'i--22')}</span><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap" style="display:flex;flex-direction:column;gap:32px">
    <h2 class="h-2">Our team</h2>
    <div class="tiles tiles--4 team-grid" style="gap:16px">${[1, 2, 3, 4].map(() => `<div><div class="ph-box">${ic('users', 'i--28')}<span>Photo</span></div><p style="font-weight:600;margin-top:12px">Team member name</p><p class="muted">Role</p></div>`).join('')}</div>
    <p class="owner-note">${ic('file-text')}Owner to add: real names, roles and photos of the team.</p>
  </div>
</section>
${finalCallback('Talk to us', 'Talk to our team', 'Tell us about the patient. We call you back.')}`,
});

/* ---------- OUR CARETAKERS ---------- */
page({
  file: 'caretakers.html', active: '',
  title: 'The people we send to your home · BestaCare', desc: 'Trained caretakers, nurses and attendants. BestaCare meets every one of them before they work with a family.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'Our caretakers']], 'The people we send to your home', 'Trained caretakers, nurses and attendants. We meet every one of them before they work with a family.')}
<section class="sec" style="padding-block:56px"><div class="wrap"><div class="team-photo"><img src="${photo('team')}"${pos('team')} alt="Sample photo of the BestaCare team" loading="lazy"></div></div></section>
<section class="sec--tight" style="padding-bottom:88px">
  <div class="wrap" style="display:flex;flex-direction:column;gap:32px">
    <div class="heading"><span class="eyebrow">Who we send</span><h2 class="h-2">Choose the right person</h2></div>
    <div class="tiles tiles--4 tiles--sm tiles--list">${services.map((s) => tile(s)).join('')}</div>
  </div>
</section>
<section class="sec sec--soft"><div class="wrap">
  <div class="heading"><span class="eyebrow">Our people</span><h2 class="h-2">How we choose them</h2></div>
  <div style="margin-top:24px">${steps([['We meet them in person', 'Our team talks to every caretaker before they work with a family.'], ['We check their ID', 'We check Aadhaar and other documents.'], ['We check past work', 'We ask where they have worked before.'], ['Trained for patient care', 'Bathing, feeding, lifting and medicines on time.']])}</div>
</div></section>
<section class="sec"><div class="wrap"><div class="pref rv"><span class="circle circle--56">${ic('users', 'i--22')}</span><div><h3>Male or female caretaker</h3><p class="muted">You can ask for either. Tell us when we call and we will match your request.</p></div></div></div></section>
${finalCallback('Talk to us', 'Tell us about the patient', 'We suggest the right person and tell you the price on the call.')}`,
});

/* ---------- CARE GUIDES ---------- */
const guideCats = ['All', 'Bed care', 'Elderly care', 'After surgery', 'Newborn care', 'Cancer care'];
page({
  file: 'care-guides.html', active: '',
  title: 'Simple guides for families · BestaCare', desc: 'Short, plain guides to help you care for someone at home.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'Care guides']], 'Simple guides for families', 'Short, plain guides to help you care for someone at home.')}
<section class="sec" style="padding-top:56px">
  <div class="wrap">
    <div class="chips chips--scroll" data-guide-filter>${guideCats.map((c, i) => `<button class="chip" type="button" aria-pressed="${i === 0}" data-cat="${c}">${ic('check')}${c}</button>`).join('')}</div>
    <div class="guides">${guides.map((g) => `
      <a class="guide rv" href="care-guide-${g.slug}.html" data-cat="${esc(g.cat)}">
        <div class="guide__ph"><img src="${photo(g.photo)}"${pos(g.photo, true)} alt="" loading="lazy"></div>
        <span class="tagpill">${esc(g.cat)}</span><h3>${esc(g.title)}</h3><p>${esc(g.desc)}</p>
        <span class="btn btn--link">Read guide ${ic('arrow-right')}</span>
      </a>`).join('')}</div>
  </div>
</section>
${finalCallback('Talk to us', 'Need a trained person at home?', 'Tell us about the patient. We call you back.')}`,
});

/* ---------- CARE GUIDE ARTICLES ---------- */
guides.forEach((g) => {
  const full = g.slug === 'bedsores';
  page({
    file: `care-guide-${g.slug}.html`, active: '',
    title: `${g.title} · BestaCare`, desc: g.desc,
    body: `
<section class="sec" style="padding-block:40px 88px">
  <div class="wrap article-row">
    <article class="article">
      ${crumbs([['index.html', 'Home'], ['care-guides.html', 'Care guides'], ['', g.title]])}
      <h1 class="h-1">${esc(g.title)}</h1>
      <p class="lead">${esc(g.desc)}</p>
      <p class="small muted" style="display:flex;gap:8px;align-items:center">${ic('clock', 'i--18')}${esc(g.read)}</p>
      <div class="article__photo"><img src="${photo(g.photo)}"${pos(g.photo, true)} alt="" fetchpriority="high"></div>
      ${full ? `<div class="keypts"><h2 class="h-3">Key points</h2>${['Change the patient’s position often, as your doctor or nurse advises', 'Keep the skin clean and dry', 'Look at heels, hips and back every day', 'Call your doctor if the skin turns red or breaks'].map((t) => `<div class="li">${ic('circle-check')}<span>${t}</span></div>`).join('')}</div>` : ''}
      <p class="owner-note">${ic('file-text')}${full ? 'Full guide to be written. The owner or a nurse adds the full text here.' : 'Guide to be written. The owner or a nurse adds the text here.'}</p>
      <p class="disclaimer">${ic('info')}This guide is general information, not medical advice. Ask your doctor about your patient.</p>
    </article>
    <aside class="aside"><div class="card card--dark on-dark"><h2 class="h-3">Need help at home?</h2><p>A trained caretaker or nurse can do this for you.</p>${callbackForm({ id: 'aside', variant: 'band' })}</div></aside>
  </div>
</section>`,
  });
});

/* ---------- WORK WITH US ---------- */
const chipGroup = (name, items, selected) => `<div class="chips" data-single data-name="${name}">${items.map((c) => `<button class="chip" type="button" aria-pressed="${c === selected}" data-value="${c}">${ic('check')}${c}</button>`).join('')}</div>`;
const uploads = [['aadhaar', 'Aadhaar card', true, 'Add Aadhaar card', 'You can add more than one file', true], ['pan', 'PAN card', false, 'Add PAN card', 'One file', false], ['certs', 'Certificates', false, 'Add certificates', 'You can add more than one file', true], ['photo', 'Full-size photo', true, 'Add full-size photo', 'Photo only, standing, face clear', false]];
page({
  file: 'work-with-us.html', active: '',
  title: 'Work with BestaCare', desc: 'Are you a caretaker, nurse, ward boy or baby nanny? Apply here and BestaCare calls you about jobs.',
  body: `
${pageHead([['index.html', 'Home'], ['', 'Work with us']], 'Work with BestaCare', 'Are you a caretaker, nurse, ward boy or baby nanny? Apply here and we call you about jobs.')}
<section class="sec" id="apply">
  <div class="wrap work-row" data-apply>
    <aside class="next"><h2 class="h-3">What happens next</h2><ol>${['You send this form', 'We call you on your mobile', 'We meet you and check your documents', 'We call you when a family needs you'].map((t, i) => `<li><b>${i + 1}</b><span>${t}</span></li>`).join('')}</ol></aside>
    <form class="jobform card" novalidate data-jobform>
      <div class="fld"><label class="lab" for="j-name">Your name <span>(required)</span></label><input class="input" id="j-name" name="name" type="text" placeholder="Full name" autocomplete="name"><p class="err" role="alert" hidden>${ic('alert', 'i--16')}<span></span></p></div>
      <div class="fld"><label class="lab" for="j-phone">Mobile number</label><div class="field__box"><span class="cc">+91</span><input id="j-phone" name="phone" type="tel" inputmode="numeric" placeholder="98765 43210" maxlength="11" autocomplete="tel-national"></div><p class="err" role="alert" hidden>${ic('alert', 'i--16')}<span></span></p><p class="helper">We use it only to call you about care.</p></div>
      <div class="fld"><span class="lab" id="role-l">Role <span>(required)</span></span>${chipGroup('role', ['Caretaker', 'Nurse', 'Ward boy', 'Baby nanny'], '')}<p class="err" role="alert" hidden>${ic('alert', 'i--16')}<span></span></p></div>
      <div class="fld"><span class="lab">Experience <span>(optional)</span></span>${chipGroup('experience', ['Less than 1 year', '1 to 3 years', '3 to 5 years', 'More than 5 years'], '')}</div>
      <div class="fld"><label class="lab" for="j-area">Where you live <span>(optional)</span></label><input class="input" id="j-area" name="area" type="text" placeholder="Area, for example Vashi"></div>
      <div><h3 class="h-3">Your documents</h3><p class="muted">Photo or PDF. Up to 5 MB each.</p></div>
      ${uploads.map(([k, t, req, add, hint, multi]) => `
      <div class="up" data-upload="${k}" data-required="${req}">
        <span class="lab small">${t} <span class="muted">(${req ? 'required' : 'optional'})</span></span>
        <div class="files"></div>
        <label class="drop"><span class="drop__ic">${ic('upload', 'i--22')}</span><span><b>${add}</b><span>${hint}</span></span><input type="file" accept="image/*,application/pdf"${multi ? ' multiple' : ''}></label>
        <p class="err" role="alert" hidden>${ic('alert', 'i--16')}<span></span></p>
      </div>`).join('')}
      <p class="privacy-line">${ic('shield')}We keep your documents private and delete them if you ask.</p>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="err" role="alert" data-submit-err hidden>${ic('alert', 'i--16')}<span></span></p>
      <button class="btn btn--call btn--lg btn--block" type="submit">Send my application ${ic('arrow-right')}</button>
    </form>
    <div class="sent" data-sent hidden>
      <span class="sent__tick">${ic('check', 'i--28')}</span><h2 class="h-2">Application sent</h2>
      <p class="lead" data-sent-text></p>
      <div class="keep"><h3 class="h-3">Keep these ready</h3><div class="li">${ic('circle-check')}<span>Your Aadhaar card</span></div><div class="li">${ic('circle-check')}<span>A full-size photo</span></div><div class="li">${ic('circle-check')}<span>Certificates, if you have them</span></div></div>
      <a class="btn btn--call btn--lg btn--block" href="index.html">Back to home</a>
    </div>
  </div>
</section>`,
});

/* ---------- PRIVACY AND TERMS ---------- */
const legal = [['What we collect', 'Your name and mobile number when you ask for a call back. For job applications, your documents and photo.'], ['How we use it', 'Only to call you about care or about a job. We do not sell your details.'], ['How long we keep it', null, 'Owner to add: how long data is kept'], ['Your documents', 'We store job documents privately, never in public. We delete them if you ask.'], ['Payment', null, 'Owner to add: payment terms'], ['Cancellation', null, 'Owner to add: cancellation notice'], ['Ask about your data', `Call ${PHONE}. We tell you what we hold and delete it if you ask.`]];
page({
  file: 'privacy-terms.html', active: '',
  title: 'Privacy and terms · BestaCare', desc: 'How BestaCare uses your details, in plain words.',
  body: `
<div class="wrap draft-wrap"><p class="draft">${ic('alert', 'i--18')}Draft. A lawyer must review this page before launch.</p></div>
${pageHead([['index.html', 'Home'], ['', 'Privacy and terms']], 'Privacy and terms', 'How we use your details, in plain words.')}
<section class="sec">
  <div class="wrap legal-row">
    <nav class="otp" aria-label="On this page"><h2>On this page</h2>${legal.map(([t], i) => `<a href="#l${i}">${t}</a>`).join('')}</nav>
    <div class="legal-text">
      <p class="owner-note">${ic('file-text')}Owner to add: last updated date</p>
      ${legal.map(([t, p, note], i) => `<section id="l${i}"><h2>${t}</h2>${p ? `<p class="muted">${esc(p)}</p>` : `<p class="owner-note">${ic('file-text')}${note}</p>`}</section>`).join('')}
    </div>
  </div>
</section>`,
});
