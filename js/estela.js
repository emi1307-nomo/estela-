/* Estela · comportamiento del sitio (sin dependencias).
   Los datos editables (contacto, precios, horarios) están en js/datos.js */
(function () {
  'use strict';
  var D = window.ESTELA || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- medición: deja los eventos listos para Google Analytics / Tag Manager ---------- */
  function medir(evento, datos) {
    window.dataLayer = window.dataLayer || [];
    var o = { event: evento };
    for (var k in datos || {}) o[k] = datos[k];
    window.dataLayer.push(o);
  }

  /* ---------- de dónde viene la consulta (se suma al mensaje) ---------- */
  function origen(v) {
    try { if (v) sessionStorage.setItem('estela-origen', v); return sessionStorage.getItem('estela-origen') || ''; }
    catch (e) { return v || ''; }
  }
  $$('[data-origen]').forEach(function (a) { a.addEventListener('click', function () { origen(a.getAttribute('data-origen')); }); });

  /* ---------- datos de contacto en toda la página ---------- */
  function linkWa(texto) { return 'https://wa.me/' + D.whatsapp + (texto ? '?text=' + encodeURIComponent(texto) : ''); }
  $$('[data-wa]').forEach(function (a) {
    if (!D.whatsapp) { a.hidden = true; return; }
    a.href = linkWa(a.getAttribute('data-wa') || 'Hola Estela, quiero hacer una consulta.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-mail]').forEach(function (a) { if (!D.email) { a.hidden = true; return; } a.href = 'mailto:' + D.email; });
  $$('[data-ig]').forEach(function (a) {
    if (!D.instagram) { (a.closest('li') || a).hidden = true; return; }
    a.href = 'https://www.instagram.com/' + D.instagram + '/'; a.textContent = '@' + D.instagram;
  });
  var textos = { 'wa-num': D.whatsappVisible, 'mail-txt': D.email, ciudad: D.ciudad, respuesta: D.respuesta };
  $$('[data-dato]').forEach(function (el) { var v = textos[el.getAttribute('data-dato')]; if (v) el.textContent = v; });
  $$('[data-precio]').forEach(function (el) { var v = D.precios && D.precios[el.getAttribute('data-precio')]; if (v) el.textContent = v; });

  /* ---------- menú del teléfono ---------- */
  var mBtn = $('.menu-btn'), mNav = $('#menu-movil');
  if (mBtn && mNav) {
    var abrir = function (si) { mBtn.setAttribute('aria-expanded', si ? 'true' : 'false'); mBtn.textContent = si ? 'Cerrar' : 'Menú'; mNav.hidden = !si; };
    mBtn.addEventListener('click', function () { abrir(mNav.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mNav.hidden) { abrir(false); mBtn.focus(); } });
  }

  /* ---------- aparición al bajar ---------- */
  var aparecen = $$('.aparece');
  if ('IntersectionObserver' in window && !quieto) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    aparecen.forEach(function (el) { io.observe(el); });
    setTimeout(function () { aparecen.forEach(function (el) { el.classList.add('visto'); }); }, 3000);
  } else aparecen.forEach(function (el) { el.classList.add('visto'); });

  /* ---------- portada: la luz de la baliza cruza una bio en 3 segundos y la deja clara ---------- */
  var faro = $('.faro');
  if (faro) (function () {
    var mar = $('.mar-frases', faro), claras = $('.claras', mar), vagas = $('.vagas', mar), lect = $('.lectura b', faro);
    var fv = $('.vagas .frase', mar), fc = $('.claras .frase', mar), num = $('.muestra-n', mar), lampara = $('.torre .lampara', mar);
    var PARES = [
      ['Pasión por lo que hacemos', 'Tortas por encargo, con 48 h de aviso'],
      ['Tu mejor versión', 'Kinesiología deportiva en Alta Córdoba'],
      ['Calidad y confianza desde 1984', 'Ferretería de barrio con pedidos por WhatsApp'],
      ['Creamos con el corazón', 'Cerámica de autor para tu mesa'],
      ['Soluciones integrales', 'Contadora para monotributistas']
    ];
    var i = 0, BARRIDO = 3000, desde = 0, hasta = 92;
    function poner(ac, av, haz) { mar.style.setProperty('--ac', ac + 'deg'); mar.style.setProperty('--av', av + 'deg'); mar.style.setProperty('--haz', haz); }
    // ángulo que ocupa la frase vista desde la lámpara (0° = hacia el oeste, como el conic-gradient "from 270deg"):
    // así la luz tarda los 3 segundos enteros en cruzarla
    function medir() {
      var m = mar.getBoundingClientRect(), l = lampara.getBoundingClientRect();
      var ox = l.left + l.width / 2 - m.left, oy = l.top + l.height / 2 - m.top, angs = [];
      mar.style.setProperty('--ox', ox + 'px'); mar.style.setProperty('--oy', oy + 'px');
      var lejos = 0;
      [fv, fc].forEach(function (el) {
        var b = el.getBoundingClientRect();
        [[b.left, b.top], [b.right, b.top], [b.left, b.bottom], [b.right, b.bottom]].forEach(function (p) {
          lejos = Math.max(lejos, Math.hypot(p[0] - m.left - ox, p[1] - m.top - oy));
          var th = (Math.atan2(p[0] - m.left - ox, -(p[1] - m.top - oy)) * 180 / Math.PI + 360) % 360;
          angs.push((th - 270 + 360) % 360);
        });
      });
      mar.style.setProperty('--r1', Math.round(lejos * .5) + 'px'); mar.style.setProperty('--r2', Math.round(lejos * 1.06) + 'px');
      desde = Math.max(0, Math.min.apply(null, angs) - 3);
      hasta = Math.min(150, Math.max.apply(null, angs) + 3);
    }
    function mostrar(n) { fv.textContent = PARES[n][0]; fc.textContent = PARES[n][1]; num.textContent = (n + 1) + ' / ' + PARES.length; }
    if (quieto) { mostrar(0); medir(); poner(180, 180, 0); lect.textContent = 'Se entiende.'; return; }

    var fase = 'espera', t0 = 0, corriendo = false, raf = null;
    function cambiar(f, t) {
      fase = f; t0 = t;
      if (f === 'espera') {
        fc.textContent = PARES[i][1]; num.textContent = (i + 1) + ' / ' + PARES.length;
        claras.style.transition = 'none'; claras.style.opacity = 1;
        medir(); poner(desde, desde, 0);
        void claras.offsetWidth; claras.style.transition = '';
        lect.textContent = '¿Qué vende?';
      } else if (f === 'listo') {
        poner(180, 180, 0); lect.textContent = 'Se entiende.';
      } else if (f === 'vuelve') {
        // la clara se apaga y entra la próxima bio vaga
        i = (i + 1) % PARES.length;
        claras.style.opacity = 0;
        vagas.style.transition = 'none'; vagas.style.opacity = 0; fv.textContent = PARES[i][0]; mar.style.setProperty('--av', '0deg');
        void vagas.offsetWidth; vagas.style.transition = ''; vagas.style.opacity = 1;
      }
    }
    function cuadro(t) {
      raf = null;
      if (!corriendo) return;
      var dt = t - t0;
      if (fase === 'espera' && dt > 1300) cambiar('barrido', t);
      else if (fase === 'barrido') {
        var p = Math.min(1, dt / BARRIDO), a = desde + (hasta - desde) * p;
        poner(a, a, 1);
        lect.textContent = (p * 3).toFixed(1).replace('.', ',') + ' s';
        if (p >= 1) cambiar('listo', t);
      } else if (fase === 'listo' && dt > 3000) cambiar('vuelve', t);
      else if (fase === 'vuelve' && dt > 800) cambiar('espera', t);
      raf = requestAnimationFrame(cuadro);
    }
    function prender(si) {
      if (si === corriendo) return;
      corriendo = si; faro.classList.toggle('encendido', si);
      if (si) { cambiar('espera', performance.now()); raf = requestAnimationFrame(cuadro); }
      else if (raf) cancelAnimationFrame(raf);
    }
    mostrar(0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (fase === 'espera') { medir(); poner(desde, desde, 0); } });
    var tm; addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(function () { medir(); if (fase === 'espera') poner(desde, desde, 0); }, 150); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { prender(es[0].isIntersecting && !document.hidden); }, { threshold: .2 }).observe(faro);
    else prender(true);
    document.addEventListener('visibilitychange', function () { if (document.hidden) prender(false); else { var r = faro.getBoundingClientRect(); prender(r.bottom > 0 && r.top < innerHeight); } });
  })();

  /* ---------- la regla de los tres segundos: la línea va del primer punto al último y se pinta en 3 s reales ---------- */
  $$('.regla').forEach(function (r) {
    var puntos = $$('.punto', r), linea = $('.regla-linea', r);
    function ubicar() {
      if (puntos.length < 2 || !linea) return;
      var base = r.getBoundingClientRect(), a = puntos[0].getBoundingClientRect(), z = puntos[puntos.length - 1].getBoundingClientRect();
      var ax = a.left + a.width / 2 - base.left, ay = a.top + a.height / 2 - base.top;
      var zx = z.left + z.width / 2 - base.left, zy = z.top + z.height / 2 - base.top;
      var vertical = Math.abs(zy - ay) > Math.abs(zx - ax);   // en el celu los pasos van uno abajo del otro
      r.classList.toggle('vertical', vertical);
      linea.style.setProperty('--lx', (vertical ? ax - 1 : ax) + 'px');
      linea.style.setProperty('--ly', (vertical ? ay : ay - 1) + 'px');
      linea.style.setProperty('--lw', (vertical ? 2 : zx - ax) + 'px');
      linea.style.setProperty('--lh', (vertical ? zy - ay : 2) + 'px');
    }
    ubicar();
    addEventListener('resize', ubicar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ubicar);
    var cajaTel = $('.tres-tel'), tel = cajaTel && $('.telefono', cajaTel);
    function seguir() {
      if (!tel) return;
      [0, 1, 2, 3].forEach(function (k) { setTimeout(function () { tel.classList.remove('f0', 'f1', 'f2', 'f3'); tel.classList.add('f' + k); }, quieto ? 0 : k * 1000); });
      setTimeout(function () { cajaTel.classList.add('decide'); }, quieto ? 0 : 3300);
    }
    if (quieto || !('IntersectionObserver' in window)) { r.classList.add('corre'); seguir(); return; }
    var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { ubicar(); r.classList.add('corre'); seguir(); o.disconnect(); } }, { threshold: .5 });
    o.observe(r);
  });

  /* ---------- cómo trabajamos: la corriente de cartas se frena un rato si la tocan ---------- */
  $$('.corriente').forEach(function (cor) {
    var t;
    cor.addEventListener('touchstart', function () { cor.classList.add('pausa'); clearTimeout(t); t = setTimeout(function () { cor.classList.remove('pausa'); }, 5000); }, { passive: true });
  });

  /* ---------- perfiles de Instagram (marcas del test y casos) ---------- */
  var GRILLA_ANTES = ['#c9a27a', '#3b6ea5', '#d94f70', '#e8d44d', '#6f9c6a', '#8e5bbf'];
  var PERFILES = {
    arroyo: { cuenta: 'tallerarroyo.ceramica', nombre: 'Taller Arroyo', inicial: 'A', color: '#8C5A3C',
      antes: 'Creamos con el corazón\nTierra, fuego y amor\nCada pieza cuenta una historia',
      despues: 'Cerámica de autor para tu mesa\nTaller en Córdoba · Envíos a todo el país\nPedidos por WhatsApp ↓',
      opciones: ['Cerámica artesanal para la mesa', 'Talleres de arte para chicos', 'Decoración para eventos'],
      grilla: ['#B5835A', '#E7D3BE', '#8C5A3C', '#D9B99B', '#6E4A33', '#B5835A'] },
    ferro: { cuenta: 'lucia.ferro.estudio', nombre: 'Lucía Ferro Estudio', inicial: 'L', color: '#2F5D7C',
      antes: 'Estrategia • Bienestar • Claridad\nAyudo a personas a conectar con su mejor versión',
      despues: 'Contadora para emprendedores\nOrdeno tus números sin vueltas\nCórdoba y online · Reservá tu consulta ↓',
      opciones: ['Contabilidad para emprendedores', 'Coaching de bienestar', 'Estudio de diseño gráfico'],
      grilla: ['#2F5D7C', '#DCE8EF', '#4F86A8', '#2F5D7C', '#A9C6D8', '#1F3F55'] },
    donteo: { cuenta: 'ferreteria.donteo', nombre: 'Ferretería Don Teo', inicial: 'T', color: '#B88A12',
      antes: 'Desde 1984 acompañándote\nCalidad y confianza.\n¡Visitanos!',
      despues: 'Ferretería de barrio en Alta Córdoba\nCatálogo con precios online\nPedí por WhatsApp y retirá hoy ↓',
      opciones: ['Ferretería de barrio con pedidos por WhatsApp', 'Taller mecánico', 'Venta mayorista de herramientas importadas'],
      grilla: ['#B88A12', '#F0DD9B', '#4A5E68', '#B88A12', '#D3B245', '#2C3A41'] },
    pampa: { cuenta: 'pampa.tejidos', nombre: 'Pampa Tejidos', inicial: 'P', color: '#9A4B3A',
      antes: 'Hecho con amor y paciencia\nCada prenda es única\nConsultas por DM',
      despues: 'Sweaters tejidos a mano en Córdoba\nTalles del S al XXL · Envíos a todo el país\nPedidos por WhatsApp ↓',
      grilla: ['#9A4B3A', '#E9D8C4', '#C98B5E', '#6E2F24', '#D9B99B', '#9A4B3A'] },
    fermento: { cuenta: 'fermento.cba', nombre: 'Fermento Panadería', inicial: 'F', color: '#A8742A',
      antes: 'Pan de verdad\nAmor por lo artesanal\nVení a conocernos',
      despues: 'Panadería de masa madre en Güemes\nDe martes a domingo, de 8 a 14\nEncargá tu pan por WhatsApp ↓',
      grilla: ['#A8742A', '#F1E2C6', '#5B3A1C', '#D7B57A', '#A8742A', '#EADBC0'] },
    kine: { cuenta: 'kinenorte', nombre: 'Kine Norte', inicial: 'K', color: '#1F6F6B',
      antes: 'Tu bienestar es nuestra prioridad\nEquipo de profesionales\nConsultá',
      despues: 'Kinesiología deportiva en Alta Córdoba\nTurnos con y sin obra social\nReservá tu turno online ↓',
      grilla: ['#1F6F6B', '#D6ECEA', '#2E4A5C', '#7FBDB7', '#1F6F6B', '#E8F3F2'] }
  };
  function perfilHTML(p, vista) {
    var grilla = (vista === 'despues' ? p.grilla : GRILLA_ANTES).map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('');
    var bio = esc(vista === 'despues' ? p.despues : p.antes).split('\n').join('<br>');
    return '<div class="contenido"><div class="barra"><span>' + esc(p.cuenta) + '</span><span aria-hidden="true">•••</span></div>' +
      '<div class="cab-perfil"><div class="avatar" style="background:' + p.color + '">' + esc(p.inicial) + '</div><div class="nombre">' + esc(p.nombre) + '</div></div>' +
      '<p class="bio">' + bio + '</p><div class="seguir">Seguir</div><div class="grilla">' + grilla + '</div></div>';
  }
  // teléfonos con "Antes / Después" (casos y portada)
  $$('[data-perfil]').forEach(function (tel) {
    var p = PERFILES[tel.getAttribute('data-perfil')], llaves = tel.parentNode.querySelector('.llaves');
    if (!p) return;
    function ver(v) {
      tel.innerHTML = perfilHTML(p, v);
      if (llaves) $$('button', llaves).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ver') === v); });
    }
    if (llaves) llaves.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ver(b.getAttribute('data-ver')); });
    ver(tel.getAttribute('data-vista') || 'despues');
  });

  /* ---------- testimonios ---------- */
  var voces = $('.voces');
  if (voces) {
    var cita = $('.cita', voces);
    voces.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cita]'); if (!b) return;
      $$('[data-cita]', voces).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $('blockquote', cita).textContent = b.getAttribute('data-cita');
      $('figcaption', cita).textContent = b.getAttribute('data-autor');
      cita.classList.remove('cambia'); void cita.offsetWidth; cita.classList.add('cambia');
    });
  }

  /* ---------- cuenta regresiva circular ---------- */
  function cuentaRegresiva(anillo, segs, fin) {
    var arco = $('.arco', anillo), num = $('b', anillo), C = 119.38, ini = performance.now(), raf, parado = false;
    anillo.hidden = false; arco.style.strokeDashoffset = 0; num.textContent = segs;
    function cuadro(t) {
      if (parado) return;
      var pasado = (t - ini) / 1000, resta = Math.max(0, segs - pasado);
      arco.style.strokeDashoffset = C * Math.min(1, pasado / segs);
      num.textContent = Math.max(1, Math.ceil(resta));
      if (resta <= 0) { if (fin) fin(); return; }
      raf = requestAnimationFrame(cuadro);
    }
    raf = requestAnimationFrame(cuadro);
    return function () { parado = true; cancelAnimationFrame(raf); };
  }

  /* ---------- el test de los 3 segundos ---------- */
  var selector = $('#selector');
  if (selector) (function () {
    var MARCAS = ['arroyo', 'ferro', 'donteo'], actual = 0, cortar = null;
    var tel = $('#telTest'), perfil = $('#perfilTest'), velo = $('#veloTest'), anillo = $('#anilloTest');
    selector.innerHTML = MARCAS.map(function (k, i) { return '<button type="button" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(PERFILES[k].nombre) + '</button>'; }).join('');
    function etapa(n) {
      ['inicio', 'mirando', 'pregunta', 'resultado'].forEach(function (x) { $('#t-' + x).hidden = x !== n; });
      var esp = $('#t-espera'); if (esp) esp.hidden = n === 'pregunta' || n === 'resultado';
      if (n === 'resultado' && innerWidth > 1000) $('#t-inicio').hidden = false;   // en la compu el botón queda para volver a mirar
    }
    function reiniciar() {
      if (cortar) cortar();
      anillo.hidden = true;
      perfil.innerHTML = perfilHTML(PERFILES[MARCAS[actual]], 'antes');
      tel.classList.add('tapado'); velo.hidden = false; velo.textContent = 'Tocá «Mirar 3 segundos»';
      etapa('inicio');
    }
    selector.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      actual = +b.getAttribute('data-i');
      $$('button', selector).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      reiniciar();
    });
    $('#tMirar').addEventListener('click', function () {
      var p = PERFILES[MARCAS[actual]];
      perfil.innerHTML = perfilHTML(p, 'antes');
      tel.classList.remove('tapado'); velo.hidden = true;
      etapa('mirando');
      if (innerWidth <= 1000) tel.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'center' });
      medir('test_iniciado', { marca: p.nombre });
      cortar = cuentaRegresiva(anillo, 3, function () {
        anillo.hidden = true; tel.classList.add('tapado'); velo.hidden = false; velo.textContent = 'Se acabó el tiempo.';
        var ops = p.opciones.map(function (t, i) { return { t: t, ok: i === 0 }; }).sort(function () { return Math.random() - .5; });
        $('#tOpciones').innerHTML = ops.map(function (o) {
          return '<label><input type="radio" name="tq" value="' + (o.ok ? 'si' : 'no') + '"><span>' + esc(o.t) + '</span></label>';
        }).join('');
        etapa('pregunta');
        var primera = $('#tOpciones input'); if (primera) primera.focus({ preventScroll: true });
        $('#t-pregunta').scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
    $('#tOpciones').addEventListener('change', function (e) {
      var ok = e.target.value === 'si', p = PERFILES[MARCAS[actual]];
      $('#tVeredicto').textContent = ok ? 'Lo entendiste. Casi.' : 'Tampoco se entendió.';
      $('#tMensaje').textContent = ok
        ? 'Acertaste porque estabas atento. Un cliente que pasa mirando el celular tiene mucha menos paciencia.'
        : 'Si a vos te pasó con tres segundos y toda tu atención, a un cliente que viene de pasada también. Es un cliente que sigue de largo.';
      $('#tAntes').innerHTML = esc(p.antes).split('\n').join('<br>');
      $('#tDespues').innerHTML = esc(p.despues).split('\n').join('<br>');
      perfil.innerHTML = perfilHTML(p, 'despues'); tel.classList.remove('tapado'); velo.hidden = true;
      origen('Test de 3 segundos (' + p.nombre + ', ' + (ok ? 'acertó' : 'no acertó') + ')');
      medir('test_completado', { marca: p.nombre, acerto: ok });
      etapa('resultado');
      $('#tVeredicto').focus();
    });
    $('#tOtra').addEventListener('click', function () {
      actual = (actual + 1) % MARCAS.length;
      $$('button', selector).forEach(function (x, i) { x.setAttribute('aria-pressed', i === actual); });
      reiniciar();
    });
    reiniciar();
  })();

  /* ---------- revisión rápida de una bio ---------- */
  var bioBtn = $('#bioRevisar');
  if (bioBtn) bioBtn.addEventListener('click', function () {
    var t = $('#bio').value.trim(), out = $('#bioResultado');
    if (!t) { out.innerHTML = '<p class="chiquita" style="margin-top:12px">Pegá primero el texto de tu bio.</p>'; return; }
    var palabras = t.split(/\s+/).filter(Boolean).length;
    var vagas = (t.match(/amante|pasi[oó]n|sue[ñn]os?|momentos?|\bvida\b|coraz[oó]n|\bamor\b|mejor versi[oó]n|historia|inspir|conect|esencia|experiencia|✨|🤍|🌱|🌿/gi) || []).length;
    var chequeos = [
      { n: 'Dice qué hacés', ok: palabras >= 4 && vagas < 2, si: 'Se entiende qué ofrecés.', no: 'Hay frases generales y poco concreto. Nombrá lo que vendés con la palabra que usaría tu cliente.' },
      { n: 'Dice para quién o para qué', ok: /\bpara\b|\bayudo\b|\bayudamos\b/i.test(t), si: 'Se nota a quién le hablás.', no: 'Falta decir para quién es. Probá con «para tu casa», «para emprendedores», «para eventos».' },
      { n: 'Dice dónde', ok: /c[oó]rdoba|\bcba\b|villa [a-záéíóú]+|carlos paz|rosario|buenos aires|\bcaba\b|mendoza|tucum[aá]n|salta|jujuy|argentina|todo el pa[ií]s|online|env[ií]os|barrio|zona/i.test(t), si: 'Se sabe dónde estás o hasta dónde llegás.', no: 'No aparece la ciudad ni si hacés envíos. Es de lo primero que busca un cliente.' },
      { n: 'Dice cómo pedirlo', ok: /whatsapp|wsp|wpp|pedidos?|reserv|turnos?|escrib|\bdm\b|consult|cotiz|presupuesto|compr[aá]|encarg|tienda|link|👇|📩|📲|↓/i.test(t), si: 'Hay un camino claro para contactarte.', no: 'No hay un paso siguiente. Cerrá con una acción: «Pedidos por WhatsApp ↓».' }
    ];
    var puntos = chequeos.filter(function (c) { return c.ok; }).length;
    var frase = ['Hoy se pierde en 3 segundos.', 'Hoy se pierde en 3 segundos.', 'Tu cliente tiene que adivinar.', 'Casi. Falta una pieza.', 'Se entiende en 3 segundos.'][puntos];
    out.innerHTML = '<p class="puntaje">' + puntos + ' de 4 · ' + frase + '</p><ul class="chequeos">' + chequeos.map(function (c) {
      return '<li><span class="marca ' + (c.ok ? 'si' : 'no') + '" aria-hidden="true">' + (c.ok ? '✓' : '!') + '</span><div><strong>' + c.n + '</strong><span class="d">' + (c.ok ? c.si : c.no) + '</span></div></li>';
    }).join('') + '</ul><div class="botonera" style="margin-top:20px"><a class="btn btn-primario" href="contacto.html" data-origen="Revisión de bio (' + puntos + ' de 4)">Que Valentina la mire con vos</a></div>';
    origen('Revisión de bio (' + puntos + ' de 4)');
    medir('bio_revisada', { puntos: puntos });
  });

  /* ---------- formulario: abre WhatsApp con el mensaje armado y manda copia al mail ---------- */
  var form = $('#formConsulta');
  if (form) (function () {
    var cont = $('#horarios');
    if (cont && D.horarios) cont.innerHTML = D.horarios.map(function (h, i) {
      return '<label><input type="radio" name="horario" value="' + esc(h) + '"' + (i === 0 ? '' : '') + '><span>' + esc(h) + '</span></label>';
    }).join('') + '<label><input type="radio" name="horario" value="A coordinar"><span>Otro horario</span></label>';
    if (cont) cont.addEventListener('change', function (e) { medir('horario_elegido', { horario: e.target.value }); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
      var err = $('#formError');
      ['nombre', 'negocio', 'whatsapp'].forEach(function (n) { form.elements[n].removeAttribute('aria-invalid'); });
      if (!f('nombre') || !f('negocio')) {
        err.textContent = 'Completá tu nombre y el de tu negocio.';
        (f('nombre') ? form.elements.negocio : form.elements.nombre).setAttribute('aria-invalid', 'true');
        (f('nombre') ? form.elements.negocio : form.elements.nombre).focus();
        return;
      }
      if (f('whatsapp').replace(/\D/g, '').length < 8) {
        err.textContent = 'Escribí un WhatsApp válido, con código de área.';
        form.elements.whatsapp.setAttribute('aria-invalid', 'true'); form.elements.whatsapp.focus();
        return;
      }
      err.textContent = '';
      var ig = f('instagram').replace(/^@?/, '@');
      var horario = (form.querySelector('input[name="horario"]:checked') || {}).value || 'A coordinar';
      var de = origen();
      var datos = { Nombre: f('nombre'), Negocio: f('negocio'), Instagram: ig === '@' ? 'No indicó' : ig, WhatsApp: f('whatsapp'), 'Quiere resolver': f('necesidad'), Horario: horario };
      if (de) datos['Llegó desde'] = de;
      var texto = 'Hola Estela, quiero pedir el diagnóstico sin costo.\n\n' + Object.keys(datos).map(function (k) { return k + ': ' + datos[k]; }).join('\n');
      var url = linkWa(texto);

      // primero WhatsApp (tiene que abrirse en el mismo toque para que el navegador no lo bloquee)
      var w = D.whatsapp ? window.open(url, '_blank') : null;
      if (w) try { w.opener = null; } catch (x) {}

      // copia al mail por FormSubmit (la primera vez hay que confirmar el mail desde la bandeja de entrada)
      if (D.email && window.fetch) {
        var cuerpo = { _subject: 'Nueva consulta en la web de Estela: ' + datos.Negocio, _template: 'table', _captcha: 'false' };
        for (var k in datos) cuerpo[k] = datos[k];
        fetch('https://formsubmit.co/ajax/' + D.email, {
          method: 'POST', keepalive: true,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(cuerpo)
        }).catch(function () {});
      }

      medir('formulario_enviado', { necesidad: datos['Quiere resolver'], horario: horario });
      form.hidden = true;
      var listo = $('#listo'); listo.hidden = false;
      $('#listoTitulo').textContent = 'Listo, ' + datos.Nombre.split(' ')[0] + '.';
      var lw = $('#listoWa'); if (lw) { lw.href = url; lw.hidden = !D.whatsapp; }
      $('#listoTitulo').focus();
    });
  })();

  /* el año del pie */
  $$('[data-anio]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
