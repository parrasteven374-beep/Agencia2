(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var desktop = matchMedia('(min-width: 900px)').matches;
  var hasG = !!(window.gsap && window.ScrollTrigger);

  $('#yr').textContent = new Date().getFullYear();

  /* ---------- Aviso +18 ---------- */
  var gate = $('#gate'), yes = $('#gate-yes');
  var started = false, lenis = null;
  var behind = $$('.top, main, .foot, .skip');
  function setInert(on) { behind.forEach(function (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); }); }
  function openGate() { setInert(true); if (yes) yes.focus(); }
  function accept() {
    try { sessionStorage.setItem('ok18', '1'); } catch (e) {}
    root.classList.add('ok');
    setInert(false);
    var m = $('#inicio');
    if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: true }); }
    start();
  }
  if (yes) yes.addEventListener('click', accept);
  if (!root.classList.contains('ok')) openGate();

  /* ---------- Acordeón de servicios ---------- */
  var img = $('#svc-img');
  $$('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) return;
      $$('.acc-btn').forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
        b.parentNode.classList.toggle('is-open', on);
      });
      if (img) {
        img.style.opacity = '0';
        setTimeout(function () {
          img.src = btn.dataset.img;
          img.alt = btn.dataset.alt || '';
          img.style.opacity = '1';
        }, reduce ? 0 : 180);
      }
    });
  });

  /* ---------- Carrusel arrastrable ---------- */
  var rail = $('.rail');
  var cursor = $('.cursor'), cursorLbl = cursor && $('span', cursor);
  var cx = null, cy = null;
  if (rail) {
    var down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
      rail.classList.add('drag');
      if (cursorLbl) cursorLbl.textContent = 'Suelta';
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      moved = Math.abs(e.clientX - sx);
      rail.scrollLeft = sl - (e.clientX - sx);
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; rail.classList.remove('drag');
      if (cursorLbl) cursorLbl.textContent = 'Arrastrar';
    });
  }

  /* ---------- Contacto (sin datos en el HTML) ---------- */
  var wa = $('#wa');
  if (wa) wa.addEventListener('click', function () {
    var n = (wa.dataset.w || '').replace(/\D/g, '');
    if (n) { window.open('https://wa.me/' + n + '?text=' + encodeURIComponent('¡Hola Umbra! Quiero contactarlos 🙌'),'_blank', 'noopener,noreferrer'); }
    else { var c = $('#contacto'); if (c) c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); $('#form input[name=nombre]').focus({ preventScroll: true }); }
  });
  var form = $('#form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('.form-msg', form);
    var ok = form.nombre.value.trim() && form.contacto.value.trim() && form.adulto.checked;
    if (!ok) { msg.textContent = 'Completa tu nombre, cómo contactarte y confirma que eres mayor de 18 años.'; return; }
    // El formulario se envía por WhatsApp al número de data-w.
    var n = (form.dataset.w || '').replace(/\D/g, '');
    var texto = '¡Hola Umbra! Quiero contactarlos.\n\n' +
      'Nombre o alias: ' + form.nombre.value.trim() + '\n' +
      'Contacto preferido: ' + form.contacto.value.trim() + '\n' +
      'Mensaje: ' + (form.mensaje.value.trim() || '(sin mensaje)') + '\n' +
      'Mayor de 18 años: sí';
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(texto), '_blank', 'noopener,noreferrer');
    msg.textContent = 'Te abrimos WhatsApp para que envíes el mensaje.';
    form.reset();
  });

  /* ---------- Animación ---------- */
  if (!hasG) { return; }
  root.classList.add('anim');
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  function splitWords(el) {
    var txt = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = txt.map(function (w) { return '<span class="w" aria-hidden="true"><span>' + w + '</span></span>'; }).join(' ');
    return $$('.w>span', el);
  }

  function start() {
    if (started || !hasG) return; started = true;
    if (reduce) return;

    if (desktop) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var t = $(a.getAttribute('href'));
          if (!t) return;
          e.preventDefault();
          lenis.scrollTo(t, { offset: 0, duration: 1.4 });
        });
      });
    }

    var mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', function () {
      var scenes = $$('.scene');
      var count = scenes.length;
      gsap.set(scenes.slice(1), { autoAlpha: 0 });
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=' + (count * 70) + '%', scrub: 0.6, pin: true, anticipatePin: 1 }
      });
      tl.to('.hero-hint', { autoAlpha: 0, duration: 0.15 }, 0.05);
      scenes.forEach(function (s, i) {
        var im = $('img', s), copy = $('.scene-copy', s);
        if (i > 0) {
          tl.to(s, { autoAlpha: 1, duration: 0.5 }, i * 1 - 0.4);
          tl.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1 }, i * 1 - 0.4);
          tl.fromTo(copy, { yPercent: 8, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4 }, i * 1 - 0.1);
        }
        if (i < count - 1) tl.to(copy, { autoAlpha: 0, yPercent: -6, duration: 0.25 }, i + 0.3);
      });
      tl.to('.hero-progress span', { scaleX: 1, duration: count - 0.4 }, 0);
      return function () { gsap.set(scenes, { clearProps: 'all' }); };
    });

    // Titulares: palabras con máscara
    $$('.split').forEach(function (h, i) {
      var words = splitWords(h);
      var hero = !!h.closest('.hero');
      gsap.from(words, {
        yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.07,
        delay: hero ? 0.25 : 0,
        scrollTrigger: hero ? null : { trigger: h, start: 'top 85%', once: true }
      });
    });

    // Imágenes: revelado con clip-path y zoom-out
    $$('.imgr').forEach(function (el) {
      var im = $('img', el);
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, {
        clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
      gsap.fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Textos secundarios: solo opacidad
    $$('.lead:not(.scene-copy .lead), .quote-by, .steps li').forEach(function (el) {
      gsap.from(el, { opacity: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    gsap.from('.scene[data-scene="1"] .lead, .scene[data-scene="1"] .btn, .scene[data-scene="1"] .kicker', { autoAlpha: 0, duration: 1, delay: 0.7, stagger: 0.12, ease: 'power2.out' });

    // Línea del proceso: se dibuja con el scroll
    var route = $('#route');
    if (route) {
      var len = route.getTotalLength();
      gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
      var nodes = $$('.node');
      gsap.set(nodes, { autoAlpha: 0.25 });
      gsap.to(route, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.chart', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } });
      nodes.forEach(function (n, i) {
        gsap.to(n, { autoAlpha: 1, duration: 0.4, scrollTrigger: { trigger: '.chart', start: 'top ' + (72 - i * 7) + '%', toggleActions: 'play none none reverse' } });
      });
    }

    // Cursor con etiqueta (solo carrusel, solo puntero fino)
    if (fine && cursor && rail) {
      cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
      cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
      rail.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
      });
      rail.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') { cx(e.clientX); cy(e.clientY); } });
      rail.addEventListener('pointerleave', function () { gsap.to(cursor, { opacity: 0, scale: 0.4, duration: 0.3 }); });
    }

    // Botones magnéticos (solo CTA principal y contacto)
    if (fine && desktop) {
      $$('.magnetic').forEach(function (b) {
        var qx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' });
        var qy = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          qx((e.clientX - (r.left + r.width / 2)) * 0.25);
          qy((e.clientY - (r.top + r.height / 2)) * 0.35);
        });
        b.addEventListener('pointerleave', function () { qx(0); qy(0); });
      });
    }

    ScrollTrigger.refresh();
  }

  if (root.classList.contains('ok')) {
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
  }
})();
