/* WAF-METAL — site behaviour. Plain JS for UI, GSAP + ScrollTrigger for motion. */
(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];

  /* ---------- header, mobile menu, dropdown ---------- */
  const hdr = $('.hdr'), nav = $('.nav'), burger = $('.burger');
  const solid = () => hdr.classList.toggle('is-solid', scrollY > 40);
  solid(); addEventListener('scroll', solid, { passive: true });
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open); hdr.classList.toggle('menu-open', open); d.body.style.overflow = open ? 'hidden' : '';
  });
  const closeDd = () => $$('.has-dd.open').forEach((li) => { li.classList.remove('open'); $('.dd-btn', li).setAttribute('aria-expanded', 'false'); });
  $$('.dd-btn').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation(); const li = b.closest('.has-dd'), was = li.classList.contains('open'); closeDd();
    if (!was) { li.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
  }));
  d.addEventListener('click', (e) => { if (!e.target.closest('.has-dd')) closeDd(); });
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDd(); if (nav.classList.contains('is-open')) burger.click(); } });

  /* ---------- quote form: no backend, so it opens the visitor's own email / WhatsApp ---------- */
  const form = $('form.quote-form');
  if (form) {
    const pre = new URLSearchParams(location.search).get('activite'); if (pre && form.activite) form.activite.value = pre;
    const text = () => { const v = Object.fromEntries(new FormData(form)); return { v, body: `Bonjour WAF-METAL,\n\nDemande de devis\nActivité : ${v.activite}\nNom : ${v.nom}\nEntreprise : ${v.entreprise || '-'}\nTéléphone : ${v.tel || '-'}\n\n${v.message}` }; };
    const status = $('[data-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault(); if (!form.reportValidity()) return; const { v, body } = text();
      location.href = 'mailto:wafmetal@aisgroupafrica.com?subject=' + encodeURIComponent('Demande de devis — ' + v.activite) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Votre application email vient de s’ouvrir avec votre demande : il ne reste qu’à l’envoyer. Pensez à joindre votre dessin ou modèle.';
    });
    const wa = $('[data-wa]');
    if (wa) wa.addEventListener('click', (e) => { if (!form.reportValidity()) return e.preventDefault(); wa.href = 'https://wa.me/' + wa.dataset.wa + '?text=' + encodeURIComponent(text().body); });
  }

  /* ---------- 3 métiers: image preview follows the hovered row ---------- */
  const imgs = $$('.preview img');
  $$('.pole').forEach((p) => { const show = () => imgs.forEach((im, i) => im.classList.toggle('on', i === +p.dataset.i)); p.addEventListener('mouseenter', show); p.addEventListener('focusin', show); });
  if (imgs[0]) imgs[0].classList.add('on');

  if (!window.gsap) { d.documentElement.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const split = (el) => { // wrap every word in a mask so it can slide up
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 1) return walk(c); if (c.nodeType !== 3) return;
      const f = d.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) return f.append(t); const w = d.createElement('span'), s = d.createElement('span'); w.className = 'w'; s.textContent = t; w.append(s); f.append(w); });
      c.replaceWith(f);
    });
    walk(el); $$('.grad-text', el).forEach((g) => g.classList.add('split-g')); return $$('.w>span', el);
  };

  /* embers drifting up behind dark heroes */
  const embers = (cv, n) => {
    const ctx = cv.getContext('2d'); let W, H, run = false, raf;
    const P = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.6, v: .05 + Math.random() * .12, a: Math.random() * 6.28, s: .4 + Math.random() }));
    const size = () => { const k = Math.min(devicePixelRatio || 1, 1.5); W = cv.width = cv.clientWidth * k; H = cv.height = cv.clientHeight * k; };
    const tick = (t) => {
      ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
      P.forEach((p) => {
        p.y -= p.v / 60; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
        const x = (p.x + Math.sin(t / 1800 * p.s + p.a) * .02) * W, y = p.y * H, g = p.r * 3.8 * (W / 1400 + .6), al = Math.sin(Math.PI * Math.min(Math.max(p.y, 0), 1)) * .85;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, g); gr.addColorStop(0, `rgba(255,200,140,${al})`); gr.addColorStop(.3, `rgba(255,110,40,${al * .55})`); gr.addColorStop(1, 'rgba(255,80,20,0)');
        ctx.fillStyle = gr; ctx.fillRect(x - g, y - g, g * 2, g * 2);
      });
      if (run) raf = requestAnimationFrame(tick);
    };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { run = e.isIntersecting; cancelAnimationFrame(raf); if (run) raf = requestAnimationFrame(tick); }).observe(cv);
  };

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* hero / page hero entrance */
    const h1 = $('.hero h1, .phero h1');
    if (h1) {
      const words = split(h1), tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: .15 });
      tl.from(words, { yPercent: 118, duration: 1.15, stagger: .07 }, 0)
        .fromTo('.crumbs,.hero .eyebrow', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .8 }, .05)
        .fromTo('.hero .lead,.phero .lead', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .9 }, .55)
        .fromTo('.hero-actions', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .9 }, .7)
        .fromTo('.hero-points', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8 }, .85)
        .fromTo('.hero-visual', { opacity: 0, clipPath: 'inset(0 0 100% 0 round 16px)', y: 30 }, { opacity: 1, clipPath: 'inset(0 0 0% 0 round 16px)', y: 0, duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' }, .35)
        .fromTo('.stats', { opacity: 0 }, { opacity: 1, duration: .9 }, 1.1);
    }
    $$('.embers').forEach((c) => embers(c, c.dataset.n || 46));

    /* section titles: words slide up when they enter */
    $$('[data-split]').filter((e) => !e.closest('.hero,.phero')).forEach((el) => {
      gsap.from(split(el), { yPercent: 118, duration: 1, stagger: .06, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    /* generic fade-ups, staggered per batch */
    ScrollTrigger.batch('[data-r]', { start: 'top 90%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out', overwrite: true,
      // hand the element back to CSS afterwards, otherwise GSAP's inline transform blocks the :hover lift
      onComplete: () => b.forEach((e) => { e.removeAttribute('data-r'); gsap.set(e, { clearProps: 'opacity,transform' }); }) }) });

    /* counters */
    $$('[data-count]').forEach((el) => {
      const to = +el.dataset.count, o = { v: 0 }, suf = el.dataset.suffix || '';
      el.textContent = '0' + suf; // HTML holds the final number (no-JS / reduced motion); count up from 0 when motion is on
      ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v) + suf) }) });
    });

    /* infinite marquees */
    $$('.mq').forEach((m, i) => { const t = $('.mq-track', m); gsap.fromTo(t, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, ease: 'none', duration: m.classList.contains('mq-big') ? 34 : 46, repeat: -1 }); });

    /* process: the line traces itself and each step lights up as it is reached */
    const line = $('.steps .line'), items = $$('.step');
    if (line) {
      gsap.matchMedia().add('(min-width: 901px)', () => { // time-based, so it is visible even though the section is short on a laptop screen
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0);
        items.forEach((s, i) => tl.call(() => s.classList.add('on'), null, i * .5));
      });
      gsap.matchMedia().add('(max-width: 900px)', () => { // tall and stacked on phones: follow the scroll
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: .4 } });
        items.forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 75%', once: true, onEnter: () => s.classList.add('on') }));
      });
    }

    /* the 7 activities: vertical scroll drives a horizontal slide (desktop only; phones swipe) */
    const hs = $('.hs');
    if (hs) gsap.matchMedia().add('(min-width: 1021px)', () => {
      const track = $('.hs-track', hs), bar = $('.hs-bar i', hs), dist = () => Math.max(0, track.scrollWidth - innerWidth) + parseFloat(getComputedStyle(track).paddingRight); // + right gutter so the last card doesn't touch the edge
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hs, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) } });
    });
  });
  addEventListener('load', () => ScrollTrigger.refresh());
  if (d.fonts) d.fonts.ready.then(() => ScrollTrigger.refresh()); // web fonts change text heights: recompute pin/scroll positions
})();
