/* ==========================================================================
   Shared clinic-template core (copied into each template's assets/).
   Reads window.CLINIC (clinic.config.js) and fills the page:
     data-clinic="path.to.value"   text from the settings (e.g. "name", "location.blurb")
     data-clinic-address / -address-inline / -hours, data-maps-link
     data-phone-link, data-phone-label, data-email-link, data-wa-link (data-wa-text)
     data-rating, data-review-count, data-google-reviews, data-year
     data-brand-wordmark, data-brand-home, data-brand-logo
     [data-quotes] + <template data-quote-template> for reviews ({{quote}} {{name}} {{detail}})
     [data-open-text] / [data-open-dot] for the live opening status
   and provides helpers on window.Clinic: dialog(), stepper(), phone helpers, burst().
   ========================================================================== */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  // language from <html lang>; Portuguese pages get Portuguese labels, euro format and +351 numbers
  const PT = /^pt/i.test(document.documentElement.lang);
  const S = PT ? { of: 'de', review: 'Rever', next: 'Continuar', showReview: 'Mostrar avaliação', hi: 'Olá', ask: 'gostaria de marcar uma consulta.' } : { of: 'of', review: 'Review', next: 'Continue', showReview: 'Show review', hi: 'Hi', ask: "I'd like to ask about an appointment." };
  const euro = new Intl.NumberFormat(PT ? 'pt-PT' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const C = window.CLINIC || {};
  const get = (o, p) => p.split('.').reduce((v, k) => (v == null ? v : v[k]), o);

  const CONFIG = {
    name: C.name || 'Dental Clinic',
    shortName: C.shortName || C.name || 'Clinic',
    tagline: C.tagline ?? '',
    area: C.area || '',
    phone: get(C, 'contact.phone') || '',
    phoneLabel: get(C, 'contact.phoneLabel') || '',
    whatsapp: get(C, 'contact.whatsapp') || '',
    email: get(C, 'contact.email') || '',
    address: get(C, 'address.lines') || [],
    mapsQuery: get(C, 'address.mapsQuery') || '',
    timeZone: C.timeZone || 'Europe/Dublin',
    hours: C.hours || {},
    rating: get(C, 'reviews.rating') || 5,
    reviewCount: get(C, 'reviews.count') || 0,
    reviewsUrl: get(C, 'reviews.url') || 'https://www.google.com/maps',
    reviews: get(C, 'reviews.items') || [],
    logo: get(C, 'brand.logo') || '',
    raw: C,
  };

  /* ---------- time ---------- */
  const fmtHour = h => { const hr = Math.floor(h), m = Math.round((h - hr) * 60), ap = hr >= 12 ? 'pm' : 'am', h12 = ((hr + 11) % 12) + 1; return m ? `${h12}:${String(m).padStart(2, '0')}${ap}` : `${h12}${ap}`; };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function now() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value]));
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday), hour: +parts.hour + +parts.minute / 60 };
  }
  // { open, closesAt, next: { day, dayName, when: 'today'|'tomorrow'|'Monday', at } }
  function openState(hours = CONFIG.hours) {
    const { day, hour } = now(), today = hours[day];
    if (today && hour >= today[0] && hour < today[1]) return { open: true, closesAt: today[1], hour, day };
    for (let i = 0; i < 8; i++) {
      const d = (day + i) % 7, h = hours[d];
      if (!h || (i === 0 && hour >= h[0])) continue;
      return { open: false, hour, day, next: { day: d, dayName: DAYS[d], when: i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d], at: h[0] } };
    }
    return { open: false, hour, day };
  }
  function hoursSummary(hours = CONFIG.hours) {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], groups = [];
    [1, 2, 3, 4, 5, 6, 0].forEach(d => {
      const hrs = hours[d], key = hrs ? hrs.join('-') : 'closed', last = groups[groups.length - 1];
      if (last && last.key === key) last.days.push(d); else groups.push({ key, hrs, days: [d] });
    });
    return groups.filter(g => g.hrs).map(g => `${g.days.length > 1 ? `${names[g.days[0]]}–${names[g.days[g.days.length - 1]]}` : names[g.days[0]]} ${fmtHour(g.hrs[0])}–${fmtHour(g.hrs[1])}`);
  }

  /* ---------- settings → page ---------- */
  function bind() {
    const simple = { name: CONFIG.name, shortName: CONFIG.shortName, tagline: CONFIG.tagline, area: CONFIG.area };
    $$('[data-clinic]').forEach(el => {
      const key = el.dataset.clinic, val = key in simple ? simple[key] : get(C, key);
      if (val != null && val !== '') el.textContent = val; else if (key === 'tagline') el.hidden = true;
    });
    $$('[data-brand-wordmark]').forEach(el => (el.textContent = CONFIG.shortName));
    $$('[data-brand-home]').forEach(a => a.setAttribute('aria-label', `${CONFIG.name}, home`));
    if (CONFIG.logo) {
      $$('[data-brand-logo]').forEach(img => { img.src = CONFIG.logo; img.alt = CONFIG.name; img.classList.remove('hidden'); });
      $$('[data-brand-home] [data-brand-wordmark], [data-brand-home] [data-clinic="tagline"]').forEach(el => (el.hidden = true));
    }
    if (CONFIG.address.length) {
      $$('[data-clinic-address]').forEach(el => (el.innerHTML = CONFIG.address.map(esc).join('<br />')));
      $$('[data-clinic-address-inline]').forEach(el => (el.textContent = CONFIG.address.join(', ')));
    }
    $$('[data-clinic-hours]').forEach(el => { const l = hoursSummary(); el.innerHTML = l.length > 2 ? `${esc(l[0])}<br />${l.slice(1).map(esc).join(' · ')}` : l.map(esc).join('<br />'); });
    if (CONFIG.mapsQuery) $$('[data-maps-link]').forEach(a => (a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.mapsQuery)));
    if (CONFIG.phone) $$('[data-phone-link]').forEach(a => (a.href = 'tel:' + CONFIG.phone));
    if (CONFIG.phoneLabel) $$('[data-phone-label]').forEach(el => (el.textContent = CONFIG.phoneLabel));
    if (CONFIG.email) $$('[data-email-link]').forEach(a => { a.href = 'mailto:' + CONFIG.email; if (!a.children.length) a.textContent = CONFIG.email; });
    $$('[data-wa-link]').forEach(a => (a.href = waLink(a.dataset.waText || `${S.hi} ${CONFIG.name}, ${S.ask}`)));
    $$('[data-rating]').forEach(el => (el.textContent = Number(CONFIG.rating).toFixed(1)));
    $$('[data-review-count]').forEach(el => (el.textContent = CONFIG.reviewCount));
    $$('[data-google-reviews]').forEach(a => { a.href = CONFIG.reviewsUrl; a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
    const tpl = $('template[data-quote-template]'), wrap = $('[data-quotes]');
    if (tpl && wrap && CONFIG.reviews.length) {
      wrap.innerHTML = CONFIG.reviews.map((r, i) => tpl.innerHTML.replace(/\{\{(\w+)\}\}/g, (_, k) => esc(r[k] || '')).replace('class="quote', `class="quote${i ? '' : ' is-active'}`)).join('');
    }
    const demoName = document.documentElement.dataset.demoName;
    if (demoName) document.title = document.title.replace(demoName, CONFIG.name);
  }
  const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

  function liveStatus() {
    const textEl = $('[data-open-text]'), dot = $('[data-open-dot]');
    if (!textEl) return;
    const render = () => {
      const s = openState();
      textEl.textContent = s.open ? `Open now until ${fmtHour(s.closesAt)}` : s.next ? `Closed now · opens ${s.next.when} at ${fmtHour(s.next.at)}` : textEl.textContent;
      dot && dot.classList.toggle('is-open', s.open);
      document.documentElement.classList.toggle('clinic-open', s.open);
    };
    render(); setInterval(render, 60000);
  }

  /* ---------- nav, action bar, reveal ---------- */
  function chrome() {
    const nav = $('[data-nav]'), mab = $('[data-mab]');
    let ticking = false;
    const on = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { nav && nav.classList.toggle('is-scrolled', scrollY > 20); mab && mab.classList.toggle('is-shown', scrollY > 120 || innerWidth < 768); ticking = false; });
    };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); on();
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('[data-reveal]').forEach(el => io.observe(el));
  }

  function quotes() {
    const qs = $$('.quote'), dotsWrap = $('[data-quote-dots]');
    if (!qs.length || !dotsWrap) return;
    let qi = 0, t = 0, paused = false;
    dotsWrap.innerHTML = qs.map((_, i) => `<button type="button" class="dot h-2.5 w-2.5 rounded-full bg-ink/20" aria-label="${S.showReview} ${i + 1}" ${i ? '' : 'aria-current="true"'}></button>`).join('');
    const dots = $$('.dot', dotsWrap);
    const show = i => { qi = (i + qs.length) % qs.length; qs.forEach((q, j) => { q.classList.toggle('is-active', j === qi); q.setAttribute('aria-hidden', j !== qi); }); dots.forEach((d, j) => (j === qi ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'))); };
    const restart = () => { clearInterval(t); if (!reduce.matches && qs.length > 1) t = setInterval(() => { if (!paused && !document.hidden) show(qi + 1); }, 7000); };
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); restart(); }));
    const host = qs[0].parentElement.parentElement;
    ['pointerenter', 'focusin'].forEach(ev => host.addEventListener(ev, () => (paused = true)));
    ['pointerleave', 'focusout'].forEach(ev => host.addEventListener(ev, () => (paused = false)));
    show(0); restart();
  }

  /* ---------- dialog: spring in, quick out, drag-to-close sheet on phones ---------- */
  function dialog(root, { onOpen } = {}) {
    const dlg = root, panel = $('[data-sheet-panel]', root), scrim = $('[data-sheet-scrim]', root), grab = $('[data-sheet-grab]', root);
    const isSheet = () => matchMedia('(max-width: 639px)').matches;
    let last = null, closing = false;
    function open(trigger, ctx) {
      last = trigger || document.activeElement; closing = false;
      onOpen && onOpen(ctx || {}, trigger);
      dlg.showModal(); window.__lenis && window.__lenis.stop();
      document.body.classList.add('modal-open'); document.documentElement.style.overflow = 'hidden';
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      if (!reduce.matches) panel.animate(isSheet() ? [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }] : [{ transform: 'translateY(28px) scale(.94)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 620, easing: 'cubic-bezier(.22,1.2,.36,1)' });
    }
    function close() {
      if (closing || !dlg.open) return; closing = true;
      const sheet = isSheet(), from = getComputedStyle(panel).transform;
      const done = () => { dlg.close(); panel.style.transform = ''; window.__lenis && window.__lenis.start(); document.body.classList.remove('modal-open'); document.documentElement.style.overflow = ''; last && last.focus && last.focus({ preventScroll: true }); };
      if (reduce.matches) return done();
      scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
      const a = panel.animate(sheet ? [{ transform: from === 'none' ? 'translateY(0)' : from }, { transform: 'translateY(100%)' }] : [{ transform: 'none', opacity: 1 }, { transform: 'translateY(12px) scale(.97)', opacity: 0 }], { duration: sheet ? 260 : 180, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' });
      a.onfinish = () => { done(); a.cancel(); scrim.getAnimations().forEach(x => x.cancel()); };
    }
    $$('[data-sheet-close]', root).forEach(b => b.addEventListener('click', close));
    scrim.addEventListener('click', close);
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    if (grab) {
      let drag = null;
      grab.addEventListener('pointerdown', e => { if (!isSheet() || e.target.closest('button')) return; drag = { y0: e.clientY, dy: 0, lastY: e.clientY, lastT: performance.now(), v: 0 }; grab.setPointerCapture(e.pointerId); panel.getAnimations().forEach(a => a.cancel()); });
      grab.addEventListener('pointermove', e => { if (!drag) return; const raw = e.clientY - drag.y0; drag.dy = raw < 0 ? -Math.sqrt(-raw) * 2 : raw; const t = performance.now(); drag.v = (e.clientY - drag.lastY) / Math.max(1, t - drag.lastT); drag.lastY = e.clientY; drag.lastT = t; panel.style.transform = `translateY(${drag.dy}px)`; });
      const release = () => { if (!drag) return; const { dy, v } = drag; drag = null; if (dy > panel.offsetHeight * 0.28 || v > 0.55) return close(); const a = panel.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], { duration: 480, easing: 'cubic-bezier(.22,1.2,.36,1)' }); panel.style.transform = ''; a.onfinish = () => a.cancel(); };
      grab.addEventListener('pointerup', release); grab.addEventListener('pointercancel', release);
    }
    return { open, close, el: dlg };
  }

  /* ---------- multi-step form inside a dialog ---------- */
  function stepper(root, { validate = () => true, onEnter = () => {} } = {}) {
    const form = $('form', root), stepsEl = $('[data-steps]', root), steps = $$('[data-step]', root);
    const progress = $('[data-progress]', root), count = $('[data-count]', root), back = $('[data-back]', root), next = $('[data-next]', root), nextLabel = $('[data-next-label]', root);
    const scroller = $('[data-lenis-prevent]', root);
    let step = 0;
    function go(n, { focus = true } = {}) {
      const fromH = stepsEl.offsetHeight, animate = root.open && n !== step && !reduce.matches;
      step = n;
      steps.forEach((s, i) => { s.classList.toggle('is-active', i === n); s.classList.toggle('is-past', i < n); s.classList.toggle('is-future', i > n); s.toggleAttribute('inert', i !== n); });
      if (progress) progress.style.transform = `scaleX(${(n + 1) / steps.length})`;
      if (count) count.textContent = `${n + 1} ${S.of} ${steps.length}`;
      if (back) back.style.visibility = n === 0 ? 'hidden' : 'visible';
      if (next) next.style.display = n === steps.length - 1 ? 'none' : '';
      if (nextLabel) nextLabel.textContent = n === steps.length - 2 ? (nextLabel.dataset.reviewLabel || S.review) : (nextLabel.dataset.label || S.next);
      onEnter(n);
      if (animate) { const toH = stepsEl.offsetHeight; if (fromH !== toH) stepsEl.animate([{ height: fromH + 'px', overflow: 'hidden' }, { height: toH + 'px', overflow: 'hidden' }], { duration: 520, easing: 'cubic-bezier(.22,1.2,.36,1)' }); }
      if (focus) setTimeout(() => { const t = steps[n].querySelector('input:checked, input:not([type=hidden]), textarea, a[data-send]'); t && t.focus({ preventScroll: true }); }, 60);
      if (scroller) scroller.scrollTop = 0;
    }
    function fail(key, input) {
      const msg = $(`[data-error="${key}"]`, root); msg && msg.classList.remove('hidden');
      input && input.setAttribute('aria-invalid', 'true');
      const s = steps[step]; s.classList.remove('shake'); void s.offsetWidth; s.classList.add('shake');
      return false;
    }
    function clear() { $$('[data-error]', root).forEach(e => e.classList.add('hidden')); $$('[aria-invalid]', root).forEach(i => i.removeAttribute('aria-invalid')); }
    form.addEventListener('submit', e => { e.preventDefault(); clear(); if (step < steps.length - 1 && validate(step, { fail, form, data: new FormData(form) }) !== false) go(step + 1); });
    back && back.addEventListener('click', () => { clear(); go(Math.max(0, step - 1)); });
    return { go, fail, clear, get step() { return step; }, steps, form };
  }

  /* ---------- contact fields ---------- */
  const digits = v => v.replace(/[^\d+]/g, '');
  function normalisePhone(v) {
    let d = digits(v); if (d.startsWith('00')) d = '+' + d.slice(2);
    if (PT) { if (d.startsWith('+351')) d = d.slice(4); if (d.startsWith('+')) return d; return d.length === 9 ? `+351 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : d; }
    if (d.startsWith('+353')) d = '0' + d.slice(4); if (d.startsWith('+')) return d; return d.length >= 9 ? `+353 ${d.slice(1, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : d;
  }
  function formatPhoneInput(input) {
    input.addEventListener('input', () => { const raw = input.value; if (/^[\d\s]*$/.test(raw) && raw.replace(/\s/g, '').length <= 10) { const d = raw.replace(/\s/g, ''); const f = [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' '); if (f !== raw) input.value = f; } });
  }
  // validates the usual contact fields: name, phone, email (optional), consent
  function checkContact(root, fail) {
    let ok = true, first = null;
    const name = $('[name=name]', root), phone = $('[name=phone]', root), email = $('[name=email]', root), consent = $('[name=consent]', root);
    if (name && name.value.trim().length < 2) { fail('name', name); ok = false; first = first || name; }
    if (phone && digits(phone.value).replace('+', '').length < 9) { fail('phone', phone); ok = false; first = first || phone; }
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { fail('email', email); ok = false; first = first || email; }
    if (consent && !consent.checked) { fail('consent'); ok = false; first = first || consent; }
    first && first.focus();
    return ok;
  }

  /* ---------- confetti-free "done" pop: a soft ring burst ---------- */
  function burst(host, x, y, n = 12, colours = ['--c-accent', '--c-alt', '--c-ink']) {
    if (reduce.matches || !host.animate) return;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('span'), a = (i / n) * Math.PI * 2, r = 50 + Math.random() * 60;
      Object.assign(d.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: '8px', height: '8px', borderRadius: '50%', background: `rgb(var(${colours[i % colours.length]}))`, pointerEvents: 'none', zIndex: 5 });
      host.appendChild(d);
      d.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px)) scale(.4)`, opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => d.remove();
    }
  }

  /* ---------- motion: Lenis + GSAP headline reveals and parallax (enhancement only) ---------- */
  function motion() {
    if (!window.gsap || !window.ScrollTrigger || reduce.matches) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]'); if (!a || a.hasAttribute('data-open')) return;
        const id = a.getAttribute('href'), target = id.length > 1 && document.querySelector(id); if (!target) return;
        e.preventDefault(); lenis.scrollTo(target, { offset: id === '#top' ? 0 : -72, duration: 1.3 });
      });
    }
    const ease = getComputedStyle(document.documentElement).getPropertyValue('--split-ease').trim() || 'expo.out';
    $$('[data-split]').forEach((h, i) => {
      const text = h.textContent.trim().replace(/\s+/g, ' ');
      h.setAttribute('aria-label', text);
      h.innerHTML = text.split(' ').map(w => `<span class="split-line" aria-hidden="true"><span class="split-word">${w}</span></span>`).join(' ');
      const words = h.querySelectorAll('.split-word'), hero = h.dataset.split === 'hero';
      gsap.from(words, Object.assign({ yPercent: 115, duration: hero ? 1.2 : 1, ease, stagger: hero ? 0.06 : 0.045 }, hero ? { delay: 0.1 } : { scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));
    });
    $$('[data-parallax]').forEach(img => gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    addEventListener('load', () => ScrollTrigger.refresh());
  }

  window.Clinic = { CONFIG, $, $$, esc, euro, reduce, fmtHour, openState, hoursSummary, waLink, dialog, stepper, normalisePhone, formatPhoneInput, checkContact, burst, digits };
  bind(); liveStatus(); chrome(); quotes();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', motion); else motion();
})();
