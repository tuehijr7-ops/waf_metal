// Generates every page of the site from one template:  node tools/build.mjs
// Edit content/config below, run the command, commit the generated .html files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ===================== config ===================== */
const WA_NUMBER = ''; // international digits, no "+" (e.g. '2250700000000'). Empty = WhatsApp buttons hidden.
const EMAIL = 'wafmetal@aisgroupafrica.com', EMAIL2 = 'wafmetal@aviso.ci';
const PHONES = ['(225) 23 52 03 10', '(225) 23 52 37 94'], CELLS = ['(225) 02 50 00 66', '(225) 01 71 26 10'], FAX = '(225) 23 51 15 38';
const ADDRESS = ['Zone industrielle de Yopougon', '26 BP 1404 Abidjan 26'];
const tel = (s) => 'tel:+' + s.replace(/\D/g, '');

/* ===================== content ===================== */
const ICONS = {
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9H21a2 2 0 0 1 0 4h-1.6z"/>',
  therm: '<path d="M14 4v6a4 4 0 0 1-4 0V4"/><path d="M8 4h6"/><path d="M9 10v9a3 3 0 0 0 6 0v-9"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  flame: '<path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.6.4.9 1.2 1.6 1.2.6 0-1.5-1.5-2.5-1.5-4.5 0-1 .8-1.9 1.5-1.5-.5 1 .5 1.5 2 0z"/><path d="M8.5 14.5a3.5 3.5 0 0 0 7 0"/>',
  pump: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  press: '<path d="M12 4v5"/><path d="M12 20v-5"/><rect x="5" y="9" width="14" height="6" rx="1"/>',
  wagon: '<rect x="3" y="8" width="18" height="8" rx="1"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', chev: '<path d="M6 9l6 6 6-6"/>', check: '<path d="M20 6 9 17l-5-5"/>',
  pin: '<path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  fax: '<path d="M6 3h8l4 4v6H6z"/><path d="M6 13H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2"/><path d="M18 13h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2"/><rect x="6" y="17" width="12" height="4"/>',
  wa: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  ruler: '<path d="m3 17 14-14 4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>',
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

const ACTS = [
  { key: 'atelier', file: 'atelier.html', nom: 'Atelier d’usinage', icon: 'gear', thumb: 'atelier.jpg',
    court: 'Pignons, axes, coussinets, crémaillères, roues dentées : pièces mécaniques sur dessin ou modèle.',
    lead: 'Usinage et rectification de pièces mécaniques de précision, réalisées sur dessin ou modèle, en fonte, bronze, aluminium et acier.',
    intro: ['Notre atelier de mécanique générale usine et rectifie les pièces dont vos équipements ont besoin : en fonte, bronze, aluminium ou acier, sur dessin ou sur modèle.', 'Une pièce à fabriquer, une pièce usée à reproduire ? Notre ingénieur-conseil vous guide pour obtenir une pièce de qualité, adaptée à vos contraintes d’utilisation.'],
    partsTitle: 'Toutes pièces mécaniques sur dessin ou modèle',
    parts: ['Roue dentée', 'Crémaillère', 'Pivots', 'Moyeux', 'Galets', 'Flasques', 'Cônes', 'Axes', 'Portées de roulement', 'Prismes', 'Buses', 'Coussinets', 'Pignons', 'Tétons', 'Clavettes', 'Rainures', 'Butées', 'Pistons', 'Goujons', 'Tiges filetées', 'Écrous'],
    shots: [['edith2.jpg', 'Vis d’entraînement'], ['edith4.jpg', 'Roue creuse de réducteur en bronze'], ['edith6.jpg', 'Poupée en bronze'], ['atelier.jpg', 'Roue dentée et pièces d’usinage']] },
  { key: 'chaudiere', file: 'chaudiere.html', nom: 'Chaudières', icon: 'therm', thumb: 'edith7.jpg',
    court: 'Grilles, foyers, cendriers, tuyères et pièces de maintenance pour installations de chauffe.',
    lead: 'Fabrication et maintenance de pièces pour installations de chauffe industrielles : grilles, foyers, cendriers et tuyères.',
    intro: ['Nous fabriquons les pièces d’usure et de structure de vos chaudières, et notre équipe technique mobile intervient sur site pour leur maintenance, dans les normes de sécurité et de qualité en vigueur.', 'Les grilles et barreaux sont coulés dans notre propre fonderie : un seul interlocuteur, de la coulée à la remise en service.'],
    partsTitle: 'Pièces de chaudières',
    parts: ['Fourrures', 'Grilles et barreaux', 'Palier et support', 'Bras de commande', 'Table d’orientation chaudière', 'Tuyères et support', 'Traverses et coussinets', 'Portes et bâtis de foyers', 'Portes et bâtis de cendriers', 'Leviers de basculement', 'Goulottes'],
    shots: [['edith7.jpg', 'Grille de chaudière à pales'], ['edith8.jpg', 'Grille cendrier de chaudière'], ['edith13.jpg', 'Grille de chaudière'], ['edith14.jpg', 'Tuyère arrière']], shotsTitle: 'Pièces de chaudière sorties de notre fonderie' },
  { key: 'chaudron', file: 'chaudron.html', nom: 'Chaudronnerie', icon: 'bolt', thumb: 'edith1.jpg',
    court: 'Turbines en mécano-soudé, treuils, carters rotatifs et ensembles métalliques assemblés.',
    lead: 'Fabrication de pièces et d’assemblages métalliques mécano-soudés pour l’industrie lourde.',
    intro: ['Notre chaudronnerie fabrique des pièces et des ensembles métalliques assemblés : turbines en mécano-soudé, treuils, carters… selon vos plans et vos contraintes d’utilisation.', 'Fonderie, usinage et soudure sont réunis dans la même usine, ce qui simplifie vos commandes et vos délais.'],
    shots: [['edith1.jpg', 'Turbine en mécano soudé'], ['edith5.jpg', 'Treuil'], ['edith3.jpg', 'Rotary carter']] },
  { key: 'fonderie', file: 'fonderie.html', nom: 'Fonderie', icon: 'flame', thumb: 'fonderi.jpg',
    court: 'Grilles et pièces de moulage en fonte, bronze, aluminium, acier et autres métaux.',
    lead: 'Fabrication de pièces moulées par fusion : jets et pièces de moulage en fonte, bronze, aluminium, acier et autres métaux.',
    intro: ['Notre fonderie réalise tout type de pièces de moulage par fusion : fonte, bronze, aluminium, acier et autres métaux.', 'Du barreau de grille au four rotatif, chaque pièce est coulée à Abidjan, dans notre usine de Yopougon.'],
    shots: [['edith7.jpg', 'Grille de chaudière à pales'], ['edith8.jpg', 'Grille cendrier de chaudière'], ['edith9.jpg', 'Console support tuyère'], ['edith10.jpg', 'Barreau intermédiaire grille 22x22'], ['edith11.jpg', 'Barreau intermédiaire grille 143'], ['edith12.jpg', 'Barreau arrière grille 143'], ['edith13.jpg', 'Grille de chaudière'], ['edith14.jpg', 'Tuyère arrière'], ['edith15.jpg', 'Grille PO 49'], ['edith16.jpg', 'Four rotatif'], ['fonderi.jpg', 'Pièces de moulage en fonte, bronze, aluminium et acier']] },
  { key: 'pompe', file: 'pompe.html', nom: 'Pompes', icon: 'pump', thumb: 'pompe.jpg',
    court: 'Corps, impulseurs, turbines, diffuseurs, arbres, bagues et presse-étoupe.',
    lead: 'Fabrication et remise en état de pièces de pompes industrielles : corps, impulseurs, turbines et diffuseurs.',
    intro: ['Nous fabriquons les pièces de vos pompes et assurons leur maintenance sur site, avec notre équipe technique mobile.', 'Fournissez-nous la pièce d’origine ou son dessin : nous vous proposons une pièce de qualité, adaptée à votre usage.'],
    partsTitle: 'Pièces de pompes', parts: ['Corps', 'Impulseurs', 'Turbines', 'Diffuseurs', 'Arbres', 'Bagues', 'Presse-étoupe'], shots: [['pompe.jpg', 'Pièces de pompes']] },
  { key: 'presse', file: 'presse.html', nom: 'Presses', icon: 'press', thumb: 'presse.jpg',
    court: 'Vis d’alimentation, vis de pression P9, cames, roues et vis sans fin, boîtiers de roulement.',
    lead: 'Fabrication de pièces d’usure et de transmission pour presses industrielles.',
    intro: ['Vis, cames, roues et vis sans fin, boîtiers de roulement : nous fabriquons les pièces de transmission et d’usure de vos presses.', 'Notre ingénieur-conseil vous aide à choisir la matière et la conception les mieux adaptées à votre cadence de production.'],
    partsTitle: 'Pièces de presses', parts: ['Bagues', 'Vis d’alimentation', 'Vis de pression P9', 'Cames', 'Roue et vis sans fin', 'Arbres d’entraînement vis', 'Boîtiers de roulement', 'Chapeaux de boîtier'], shots: [['presse.jpg', 'Pièces de presses']] },
  { key: 'wagon', file: 'wagon.html', nom: 'Wagonnets', icon: 'wagon', thumb: null,
    court: 'Roues, paliers, bagues, arbres et pièces de rechange pour wagonnets industriels.',
    lead: 'Fabrication de pièces de rechange pour wagonnets industriels.',
    intro: ['Roues, paliers, bagues, arbres : nous fabriquons les pièces de rechange de vos wagonnets industriels, sur dessin ou sur modèle.', 'Envoyez-nous la pièce usée ou ses cotes, nous vous répondons avec une proposition.'],
    partsTitle: 'Pièces de wagonnets', parts: ['Roues', 'Paliers', 'Bagues', 'Arbres'], shots: [] },
];
const POLES = [
  { nom: 'Fonderie', file: 'fonderie.html', img: 'fonderi.jpg', txt: 'Fabrication de pièces moulées par fusion : fonte, bronze, aluminium, acier.' },
  { nom: 'Chaudronnerie', file: 'chaudron.html', img: 'edith1.jpg', txt: 'Fabrication de pièces et assemblages métalliques mécano-soudés.' },
  { nom: 'Mécanique générale', file: 'atelier.html', img: 'atelier.jpg', txt: 'Usinage et rectification de pièces mécaniques sur dessin ou modèle.' },
];
const REFS = {
  scieries: ['INPROBOIS', 'CIB', 'SCAF', 'SITBAI', 'STBO', 'NSBF', 'GIBT', 'SDMB', 'TRABEX', 'TRANCHIVOIRE', 'THANRY', 'IFEX-CI'],
  huileries: ['SIPEFCI', 'PHCI', 'UNILEVER', 'CEMOI', 'CARGILL COCOA', 'CONDICAF', 'ADAM AFRIQUE', 'PALMAFRIQUE', 'IDH'],
  caoutchouc: ['SAPH', 'CHC', 'SOGB', 'TRCI', 'HEVETEC', 'CC PAKIDIE'],
  autres: ['FILTISAC', 'SOTRA', 'UNIWAX', 'SIR', 'AFRIBACHE', 'IVOIRE COTON', 'SIVEM', 'MIPA', 'FRATERNITE MATIN', 'SITAB', 'BATIM-CI'],
};
const REF_LABEL = { scieries: 'Scieries', huileries: 'Huileries & agro-alimentaire', caoutchouc: 'Sociétés de caoutchouc', autres: 'Autres industries' };
const INTL = [['SOGUIPAH', 'Guinée'], ['SN-SOSUCO', 'Burkina Faso'], ['CODA-SA', 'Bénin'], ['NIOTO', 'Bénin']];

/* ===================== helpers ===================== */
const dims = {};
function dim(file) { // read width/height from the image header so <img> never causes layout shift
  if (dims[file]) return dims[file];
  const b = fs.readFileSync(path.join(ROOT, 'images', file)); let w = 0, h = 0;
  if (b[0] === 0x89) { w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
  else if (b[0] === 0xff && b[1] === 0xd8) { let o = 2; while (o < b.length) { if (b[o] !== 0xff) { o++; continue; } const m = b[o + 1]; if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { h = b.readUInt16BE(o + 5); w = b.readUInt16BE(o + 7); break; } o += 2 + b.readUInt16BE(o + 2); } }
  else if (b.toString('ascii', 0, 3) === 'GIF') { w = b.readUInt16LE(6); h = b.readUInt16LE(8); }
  return (dims[file] = [w, h]);
}
const img = (f, alt, extra = '') => { const [w, h] = dim(f); return `<img src="images/${f}" width="${w}" height="${h}" alt="${alt.replace(/"/g, '&quot;')}" loading="lazy" decoding="async"${extra}>`; };
const phoneLinks = (a) => a.map((p) => `<a href="${tel(p)}">${p}</a>`).join('');
const arrow = ic('arrow');

function header(active, cur) {
  const a = (href, label, k) => `<li><a href="${href}"${active === k ? ' aria-current="page"' : ''}>${label}</a></li>`;
  return `<header class="hdr">
  <div class="wrap">
    <a href="index.html" class="logo-card" aria-label="WAF-METAL, accueil"><img src="images/logo.png" width="436" height="173" alt="WAF-METAL — West Africa Foundry and Metallurgy"></a>
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><i></i></button>
    <ul class="nav" id="nav">
      ${a('index.html', 'Accueil', 'index')}
      ${a('presentation.html', 'Présentation', 'presentation')}
      <li class="has-dd${active === 'act' ? ' current' : ''}">
        <button class="dd-btn" type="button" aria-expanded="false">Activités ${ic('chev')}</button>
        <div class="dd">${ACTS.map((x) => `<a href="${x.file}"${cur === x.key ? ' aria-current="page"' : ''}>${ic(x.icon)}${x.nom}</a>`).join('')}</div>
      </li>
      ${a('ref.html', 'Références', 'ref')}
      <li><a class="btn btn-fire btn-sm" href="contact.html#devis"${active === 'contact' ? ' aria-current="page"' : ''}>Demander un devis ${arrow}</a></li>
    </ul>
  </div>
</header>`;
}

const ctaBand = (title = 'Un projet ? Une panne ? Parlons-en.') => `<section class="sec sec-dark cta">
  <div class="wrap">
    <p class="eyebrow" style="justify-content:center">Devis rapide</p>
    <h2 class="h2" data-split>${title}</h2>
    <p class="lead" data-r>Envoyez-nous votre dessin, votre modèle ou la pièce à remplacer. Notre ingénieur-conseil vous répond avec une proposition adaptée.</p>
    <div class="hero-actions" data-r>
      <a class="btn btn-fire" href="contact.html#devis">Demander un devis ${arrow}</a>
      <a class="btn btn-ghost" href="${tel(PHONES[0])}">${ic('phone')} ${PHONES[0]}</a>
    </div>
    <div class="cta-lines" data-r><a href="mailto:${EMAIL}">${EMAIL}</a><span>${ADDRESS[0]} · Abidjan</span></div>
  </div>
</section>`;

function footer() {
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div><a href="index.html" class="logo-card" style="display:inline-flex" aria-label="WAF-METAL"><img src="images/logo.png" width="436" height="173" alt="WAF-METAL" style="height:42px;width:auto" loading="lazy"></a>
        <p>Fonderie, chaudronnerie et mécanique générale. Pièces industrielles sur mesure, depuis la zone industrielle de Yopougon, à Abidjan.</p></div>
      <div><h4>Navigation</h4><ul><li><a href="index.html">Accueil</a></li><li><a href="presentation.html">Présentation</a></li><li><a href="ref.html">Nos références</a></li><li><a href="contact.html#devis">Demander un devis</a></li></ul></div>
      <div><h4>Activités</h4><ul>${ACTS.map((x) => `<li><a href="${x.file}">${x.nom}</a></li>`).join('')}</ul></div>
      <div><h4>Contact</h4><ul><li>${ADDRESS[0]}<br>${ADDRESS[1]}</li><li>${phoneLinks(PHONES.slice(0, 1))}</li><li><a href="mailto:${EMAIL}">${EMAIL}</a></li></ul></div>
    </div>
    <div class="ftr-bot"><span>© 2026 WAF-METAL — West Africa Foundry and Metallurgy</span><span>Abidjan, Côte d’Ivoire</span></div>
  </div>
</footer>`;
}

function page({ file, title, desc, active, cur, body, hero = '' }) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0f1215">
<link rel="icon" href="images/logo.png">
<link rel="preload" href="assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/barlow-condensed-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')</script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
${header(active, cur)}
<main id="main">
${hero}
${body}
</main>
${footer()}
<script src="assets/vendor/gsap.min.js" defer></script>
<script src="assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log('wrote', file, html.length);
}

const phero = (crumb, h1, lead) => `<section class="phero">
  <canvas class="embers" data-n="28" aria-hidden="true"></canvas>
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span>${crumb}</nav>
    <h1 class="display">${h1}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;

/* ===================== pages ===================== */
// ---- home ----
const nRefs = Object.values(REFS).reduce((a, l) => a + l.length, 0) + INTL.length;
page({
  file: 'index.html', active: 'index',
  title: 'WAF-METAL — Fonderie, chaudronnerie et mécanique générale à Abidjan',
  desc: 'WAF-METAL conçoit, fond, soude et usine vos pièces industrielles sur dessin ou modèle à Abidjan : fonderie, chaudronnerie, mécanique générale, maintenance sur site.',
  hero: `<section class="hero">
  <canvas class="embers" data-n="60" aria-hidden="true"></canvas>
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Fonderie · Chaudronnerie · Mécanique générale</p>
      <h1 class="display">Des pièces industrielles <em class="grad-text">façonnées pour durer</em></h1>
      <p class="lead">Depuis Yopougon, à Abidjan, WAF-METAL fond, soude et usine vos pièces sur dessin ou modèle, et intervient sur site pour la maintenance de vos chaudières, pompes et réducteurs.</p>
      <div class="hero-actions">
        <a class="btn btn-fire" href="contact.html#devis">Demander un devis ${arrow}</a>
        <a class="btn btn-ghost" href="#activites">Voir nos activités</a>
      </div>
      <ul class="hero-points">
        <li>${ic('check')}Pièces sur dessin ou modèle</li><li>${ic('check')}Équipe technique mobile sur site</li><li>${ic('check')}Délais de livraison respectés</li>
      </ul>
    </div>
    <div class="hero-visual">
      <div class="frame"><img src="images/accueil.jpg" width="445" height="483" alt="Fonderie, soudure et usinage dans les ateliers WAF-METAL" fetchpriority="high"></div>
      <div class="tag-card"><span class="ic-sq">${ic('gear')}</span><div><b>Sur dessin ou modèle</b><span>Fonte, bronze, aluminium, acier</span></div></div>
    </div>
  </div>
  <div class="stats"><div class="wrap">
    <div class="stat"><b data-count="${Math.floor(nRefs / 10) * 10}" data-suffix="+">${Math.floor(nRefs / 10) * 10}+</b><span>entreprises clientes</span></div>
    <div class="stat"><b data-count="4">4</b><span>pays en Afrique de l’Ouest</span></div>
    <div class="stat"><b data-count="7">7</b><span>domaines d’expertise</span></div>
  </div></div>
</section>`,
  body: `
<section class="sec" aria-labelledby="t-clients">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Ils nous font confiance</p><h2 class="h2" id="t-clients" data-split>Des industriels de tous les secteurs</h2>
      <p data-r class="lead">Scieries, huileries, caoutchouc, agro-industrie : nos clients comptent sur nous pour garder leurs machines en marche.</p></div>
    <div class="tiles">
      ${Object.entries(REFS).map(([k, l]) => `<a class="tile" href="ref.html#${k}" data-r><b data-count="${l.length}">${l.length}</b><h3>${REF_LABEL[k]}</h3><p>références en Côte d’Ivoire</p></a>`).join('')}
    </div>
    <p data-r style="margin-top:22px;color:var(--muted)">Et à l’international : ${INTL.map(([n, p]) => `${n} (${p})`).join(' · ')}.</p>
  </div>
</section>

<section class="sec sec-alt" aria-labelledby="t-poles">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Nos trois métiers</p><h2 class="h2" id="t-poles" data-split>Une usine, trois <span class="nb">savoir-faire</span></h2></div>
    <div class="poles">
      <div>${POLES.map((p, i) => `<a class="pole" href="${p.file}" data-i="${i}" data-r><span class="n">0${i + 1}</span><div><h3>${p.nom}</h3><p>${p.txt}</p></div><span class="go">${arrow}</span></a>`).join('')}</div>
      <div class="preview" aria-hidden="true">${POLES.map((p) => img(p.img, '')).join('')}</div>
    </div>
  </div>
</section>

<section class="hs" id="activites" aria-labelledby="t-acts">
  <div class="hs-pin">
    <div class="wrap" style="width:100%"><div class="sec-head" style="margin-bottom:0"><p class="eyebrow">Ce que nous fabriquons</p><h2 class="h2" id="t-acts" data-split>Sept domaines, une même exigence</h2></div></div>
    <div class="hs-track">
      ${ACTS.map((x, i) => `<a class="acard" href="${x.file}"><div class="ph">${x.thumb ? img(x.thumb, x.nom).replace('loading="lazy"', 'loading="eager"') : ic(x.icon)}</div><div class="bd"><span class="k">0${i + 1} / 07</span><h3>${x.nom}</h3><p>${x.court}</p><span class="more">Découvrir ${arrow}</span></div></a>`).join('')}
      <a class="acard cta" href="contact.html#devis"><h3>Un besoin sur mesure ?</h3><p>Dessin, modèle ou pièce à remplacer : nous vous répondons avec une proposition.</p><span class="more">Demander un devis ${arrow}</span></a>
    </div>
    <div class="hs-bar" aria-hidden="true"><i></i></div>
  </div>
</section>

<section class="sec sec-dark" aria-labelledby="t-why">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Pourquoi WAF-METAL</p><h2 class="h2" id="t-why" data-split>Moins de risques, plus de disponibilité</h2></div>
    <div class="why" data-r>
      <div><span class="ic-sq">${ic('ruler')}</span><h3>Sur dessin ou modèle</h3><p>Toute pièce mécanique en fonte, bronze, aluminium ou acier, fabriquée d’après votre dessin ou votre modèle.</p></div>
      <div><span class="ic-sq">${ic('chat')}</span><h3>Un ingénieur-conseil</h3><p>À votre écoute pour vous guider vers des pièces de qualité, mieux adaptées à vos contraintes d’utilisation.</p></div>
      <div><span class="ic-sq">${ic('truck')}</span><h3>Équipe technique mobile</h3><p>Maintenance industrielle sur site (chaudières, pompes, réducteurs…) dans les normes de sécurité et de qualité en vigueur.</p></div>
      <div><span class="ic-sq">${ic('clock')}</span><h3>Délais et prix tenus</h3><p>Un respect rigoureux des délais de livraison et un excellent rapport qualité/prix : c’est ce qui fait la satisfaction de nos clients.</p></div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="t-process">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Comment ça marche</p><h2 class="h2" id="t-process" data-split>De votre besoin à la livraison</h2></div>
    <div class="steps">
      <span class="line" aria-hidden="true"></span>
      <div class="step" data-r><h3>Votre besoin</h3><p>Un dessin, un modèle, une pièce usée ou une panne : vous nous contactez.</p></div>
      <div class="step" data-r><h3>Le conseil</h3><p>Notre ingénieur-conseil étudie votre demande et vous propose la solution adaptée.</p></div>
      <div class="step" data-r><h3>La fabrication</h3><p>Fonderie, chaudronnerie ou usinage : la pièce est réalisée dans notre usine de Yopougon, ou l’équipe intervient sur site.</p></div>
      <div class="step" data-r><h3>La livraison</h3><p>Livraison dans les délais convenus, avec un rapport qualité/prix irréprochable.</p></div>
    </div>
  </div>
</section>

<section class="sec-dark" style="padding-block:clamp(26px,3.6vw,52px);overflow:hidden" aria-label="Matériaux travaillés">
  <div class="mq mq-big" aria-hidden="true"><div class="mq-track">${[0, 1].map(() => `<div class="mq-group"><span>Fonte</span><span class="dot">●</span><span>Bronze</span><span class="dot">●</span><span>Aluminium</span><span class="dot">●</span><span>Acier</span><span class="dot">●</span></div>`).join('')}</div></div>
</section>

<section class="sec" aria-labelledby="t-real">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Réalisations</p><h2 class="h2" id="t-real" data-split>Des pièces sorties de nos ateliers</h2></div>
    <div class="shots">
      ${[['edith7.jpg', 'Grille de chaudière à pales'], ['edith10.jpg', 'Barreau intermédiaire grille 22x22'], ['edith14.jpg', 'Tuyère arrière'], ['edith1.jpg', 'Turbine en mécano soudé'], ['edith5.jpg', 'Treuil'], ['edith4.jpg', 'Roue creuse de réducteur en bronze'], ['edith16.jpg', 'Four rotatif'], ['edith2.jpg', 'Vis d’entraînement']].map(([f, c]) => `<figure class="shot" data-r><div class="ph">${img(f, c)}</div><figcaption>${c}</figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec-alt" style="padding-block:clamp(48px,6vw,80px)" aria-label="Quelques références">
  <div class="wrap"><p class="eyebrow">Quelques références</p></div>
  <div class="mq" aria-hidden="true"><div class="mq-track">${[0, 1].map(() => `<div class="mq-group">${[...REFS.huileries, ...REFS.scieries, ...REFS.caoutchouc, ...REFS.autres, ...INTL.map((x) => x[0])].map((n) => `<span class="chip">${n}</span>`).join('')}</div>`).join('')}</div></div>
  <div class="wrap" style="margin-top:30px"><a class="btn btn-line" href="ref.html">Toutes nos références ${arrow}</a></div>
</section>

${ctaBand()}`,
});

// ---- présentation ----
page({
  file: 'presentation.html', active: 'presentation',
  title: 'Présentation | WAF-METAL', desc: 'WAF-METAL : une usine de trois structures — fonderie, chaudronnerie, mécanique générale — à Yopougon, Abidjan.',
  hero: phero('<span aria-current="page">Présentation</span>', 'Une usine, trois grandes structures', 'La rigueur et la qualité au service de l’industrie ouest-africaine.'),
  body: `
<section class="sec"><div class="wrap">
  <div class="act">
    <div class="prose">
      <p class="eyebrow">Qui sommes-nous</p>
      <p><strong>Notre usine est composée de trois grandes structures : la fonderie, la chaudronnerie et la mécanique générale.</strong></p>
      <p>Nous confectionnons tous genres de pièces mécaniques en fonte, bronze, aluminium, acier… Notre service d’ingénieur-conseil, professionnel et dynamique, reste à votre écoute pour vous conseiller et vous guider en vue de vous proposer des pièces de qualité mieux adaptées à vos contraintes d’utilisation.</p>
      <p>Notre équipe technique mobile exécutera et assurera, dans les normes de sécurité et de qualité en vigueur, tous vos travaux de maintenance industrielle (chaudières, pompes, réducteurs…).</p>
      <p>La satisfaction de nos clients conditionne l’existence de notre structure et repose essentiellement sur le respect rigoureux des délais de livraison et l’excellent rapport qualité/prix.</p>
    </div>
    <aside><div class="frame">${img('accueil.jpg', 'Les ateliers WAF-METAL')}</div></aside>
  </div>
  <div class="block"><div class="trio">
    ${[['flame', 'La Fonderie', 'Fabrication de pièces moulées par fusion.', 'fonderie.html'], ['bolt', 'La Chaudronnerie', 'Fabrication de pièces et assemblage métalliques.', 'chaudron.html'], ['gear', 'La Mécanique générale', 'Usinage et rectification de pièces mécaniques.', 'atelier.html']].map(([i, t, p, f]) => `<a class="card" href="${f}" data-r><span class="ic-sq">${ic(i)}</span><h3>${t}</h3><p>${p}</p></a>`).join('')}
  </div></div>
  <div class="block" style="margin-top:clamp(56px,7vw,96px)"><p class="quote" data-r>« La mécanique, c’est d’abord la rigueur. Et si on l’introduisait dans nos entreprises ! »</p></div>
</div></section>
${ctaBand('Parlons de votre projet.')}`,
});

// ---- activities ----
for (const x of ACTS) {
  const others = ACTS.filter((o) => o !== x);
  page({
    file: x.file, active: 'act', cur: x.key,
    title: `${x.nom} | WAF-METAL`, desc: x.lead,
    hero: phero(`<a href="index.html#activites">Activités</a><span>/</span><span aria-current="page">${x.nom}</span>`, x.nom, x.lead),
    body: `
<section class="sec"><div class="wrap act">
  <div>
    <div class="prose">${x.intro.map((p) => `<p>${p}</p>`).join('')}</div>
    ${x.parts ? `<div class="block"><h2 class="h3" style="margin-bottom:20px">${x.partsTitle}</h2><ul class="tags">${x.parts.map((p) => `<li>${p}</li>`).join('')}</ul></div>` : ''}
    ${x.shots.length ? `<div class="block"><h2 class="h3" style="margin-bottom:20px">${x.shotsTitle || 'En images'}</h2><div class="shots${x.shots.length > 4 ? '' : ' big'}">${x.shots.map(([f, c]) => `<figure class="shot" data-r><div class="ph">${img(f, c)}</div><figcaption>${c}</figcaption></figure>`).join('')}</div></div>` : ''}
    ${x.key === 'wagon' ? `<div class="block"><div class="card" data-r style="display:flex;gap:20px;align-items:center"><span class="ic-sq">${ic('wagon')}</span><p style="color:var(--muted)">Envoyez-nous la pièce usée, ses cotes ou une photo : nous vous répondons avec une proposition de fabrication.</p></div></div>` : ''}
  </div>
  <aside>
    <div class="card fire" data-r><h3>Un besoin en ${x.nom.toLowerCase()} ?</h3><p>Envoyez-nous votre dessin ou votre modèle : notre ingénieur-conseil vous répond rapidement.</p><a class="btn btn-sm" href="contact.html?activite=${encodeURIComponent(x.nom)}#devis">Demander un devis ${arrow}</a></div>
    <div class="card" data-r><h3 style="margin-bottom:10px">Autres activités</h3><ul class="links">${others.map((o) => `<li><a href="${o.file}">${ic(o.icon)}${o.nom}</a></li>`).join('')}</ul></div>
  </aside>
</div></section>
${ctaBand()}`,
  });
}

// ---- références ----
page({
  file: 'ref.html', active: 'ref',
  title: 'Nos références | WAF-METAL', desc: 'Plus de 40 entreprises font confiance à WAF-METAL en Côte d’Ivoire, en Guinée, au Burkina Faso et au Bénin.',
  hero: phero('<span aria-current="page">Références</span>', 'Ils nous font confiance', 'Des industriels de Côte d’Ivoire et d’Afrique de l’Ouest nous confient leurs pièces et leur maintenance.'),
  body: `
<section class="sec"><div class="wrap">
  <nav class="snav" aria-label="Secteurs">${Object.keys(REFS).map((k) => `<a href="#${k}">${REF_LABEL[k]}</a>`).join('')}<a href="#afrique">En Afrique</a></nav>
  ${Object.entries(REFS).map(([k, l]) => `<div class="refgroup" id="${k}"><h2 class="h2" data-split>${REF_LABEL[k]} <small>${l.length}</small></h2><ul class="refgrid">${l.map((n) => `<li data-r>${n}</li>`).join('')}</ul></div>`).join('')}
  <div class="refgroup" id="afrique"><h2 class="h2" data-split>En Afrique <small>${INTL.length}</small></h2><ul class="refgrid">${INTL.map(([n, p]) => `<li data-r>${n}<small>${p}</small></li>`).join('')}</ul></div>
</div></section>
${ctaBand()}`,
});

// ---- contact / devis ----
page({
  file: 'contact.html', active: 'contact',
  title: 'Contact et demande de devis | WAF-METAL', desc: 'Contactez WAF-METAL à Abidjan (zone industrielle de Yopougon) ou demandez un devis pour vos pièces de fonderie, chaudronnerie et mécanique générale.',
  hero: phero('<span aria-current="page">Contact</span>', 'Parlons de votre projet', 'Décrivez votre besoin : notre ingénieur-conseil vous répond avec une proposition adaptée.'),
  body: `
<section class="sec"><div class="wrap contact">
  <div class="cinfo">
    <div class="card" data-r><span class="ic-sq">${ic('pin')}</span><div><h3>Adresse</h3><p>${ADDRESS[0]}<br>${ADDRESS[1]}, Côte d’Ivoire</p></div></div>
    <div class="card" data-r><span class="ic-sq">${ic('phone')}</span><div><h3>Téléphone</h3>${phoneLinks(PHONES)}${phoneLinks(CELLS)}</div></div>
    <div class="card" data-r><span class="ic-sq">${ic('fax')}</span><div><h3>Fax</h3><p>${FAX}</p></div></div>
    <div class="card" data-r><span class="ic-sq">${ic('mail')}</span><div><h3>Email</h3><a href="mailto:${EMAIL}">${EMAIL}</a><a href="mailto:${EMAIL2}">${EMAIL2}</a></div></div>
    <div class="mapbox" data-r>${img('situation.jpg', 'Plan de situation de WAF-METAL, zone industrielle de Yopougon')}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Zone industrielle de Yopougon, Abidjan')}" target="_blank" rel="noopener">Ouvrir dans Google Maps ${arrow}</a></div>
  </div>
  <div class="card" id="devis" data-r style="padding:clamp(22px,4vw,40px)">
    <h2 class="h2" style="font-size:clamp(2rem,3.4vw,2.8rem);margin-bottom:8px">Demander un devis</h2>
    <p style="color:var(--muted);margin-bottom:26px">Plus votre description est précise (matière, dimensions, quantité, délai), plus notre réponse sera rapide.</p>
    <form class="quote-form" novalidate>
      <div><label for="f-nom">Votre nom *</label><input id="f-nom" name="nom" required autocomplete="name"></div>
      <div><label for="f-ent">Entreprise</label><input id="f-ent" name="entreprise" autocomplete="organization"></div>
      <div><label for="f-tel">Téléphone / WhatsApp</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
      <div><label for="f-act">Activité concernée</label><select id="f-act" name="activite">${[...ACTS.map((a) => a.nom), 'Autre / je ne sais pas'].map((n) => `<option>${n}</option>`).join('')}</select></div>
      <div class="full"><label for="f-msg">Votre besoin *</label><textarea id="f-msg" name="message" required placeholder="Pièce à fabriquer ou à réparer, matière, dimensions, quantité, délai souhaité…"></textarea></div>
      <div class="full row">
        <button class="btn btn-fire" type="submit">Envoyer par email ${arrow}</button>
        ${WA_NUMBER ? `<a class="btn btn-line" href="#" data-wa="${WA_NUMBER}" target="_blank" rel="noopener">${ic('wa')} Envoyer sur WhatsApp</a>` : ''}
      </div>
      <p class="full" data-status role="status" aria-live="polite"></p>
      <small class="full">Votre message s’ouvre dans votre application email ; joignez-y votre dessin ou modèle avant d’envoyer.</small>
    </form>
  </div>
</div></section>`,
});
