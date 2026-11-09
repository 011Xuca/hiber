// Corre en el mundo de la página. content.js marca <html data-hiber-motion / data-hiber-mobile>.
(() => {
  const on = (k) => document.documentElement?.dataset[k] === '1';
  const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';

  // Animaciones por JS (Web Animations): terminan al instante.
  const animate = Element.prototype.animate;
  Element.prototype.animate = function (...a) {
    const r = animate.apply(this, a);
    if (on('hiberMotion')) try { r.finish(); } catch { r.cancel(); } // infinitas: finish() falla
    return r;
  };
  // Muchos sitios respetan "reducir movimiento": se lo decimos.
  const mm = window.matchMedia;
  window.matchMedia = function (q) {
    const r = mm.call(this, q);
    if (on('hiberMotion') && /prefers-reduced-motion/.test(q)) {
      return Object.defineProperty(r, 'matches', { value: /reduce/.test(q) && !/no-preference/.test(q) });
    }
    return r;
  };

  // Modo celu también del lado de JS (el servidor ya lo ve por el encabezado).
  const fake = (proto, key, val) => {
    const d = proto && Object.getOwnPropertyDescriptor(proto, key);
    if (d?.get) Object.defineProperty(proto, key, { ...d, get() { return on('hiberMobile') ? val : d.get.call(this); } });
  };
  fake(Navigator.prototype, 'userAgent', UA);
  fake(Navigator.prototype, 'platform', 'Linux armv8l');
  fake(Navigator.prototype, 'maxTouchPoints', 5);
  fake(window.NavigatorUAData?.prototype, 'mobile', true);

  // Anti pop-ups, prudente: ante la duda deja pasar. Solo frena VENTANAS NUEVAS hacia un sitio ajeno (nunca redirecciones ni formularios), si:
  // - el destino es una red de anuncios/pop-unders conocida, o
  // - viene de un iframe de reproductor de otro sitio (streamwish, mega...): ahí cualquier clic (play, pantalla completa, la X) abría anuncios.
  //   Widgets de comentarios/login/pagos no tienen <video>: no les aplica. YouTube/Vimeo/etc. quedan afuera (sus "compartir" son legítimos).
  // - hace un instante tocaste el video, el fondo o una capa invisible encima de todo, no un botón/enlace real.
  //   Login, pagos y "compartir" siempre salen de un control visible: pasan.
  // También frena el clic en un <a> invisible que tapa la pantalla (capa trampa) hacia otro sitio.
  // Lo apaga content.js con data-hiber-pop="0" (en iframes de otro sitio content.js no corre: ahí queda encendido).
  // Mismos dominios de anuncios que TRACKERS en background.js (sin los de estadísticas).
  const AD = /(^|\.)(subduepaler\.cyou|agl003\.com|slunkenfulgora\.click|catrck\.net|refpa[0-9]+\.[a-z]+|doubleclick\.net|googlesyndication\.com|adnxs\.com|popads\.net|propellerads\.com|exoclick\.com|juicyads\.com|trafficjunky\.net|adsterra\.com|popcash\.net|clickadu\.com|hilltopads\.net|adcash\.com|monetag\.com|propu\.sh|onclickads\.net|bidvertiser\.com|adskeeper\.com|mgid\.com|tsyndicate\.com|realsrv\.com|a-ads\.com|richads\.com|ero-advertising\.com|effectivegatecpm\.com|profitableratecpm\.com|highperformanceformat\.com|dolohen\.com|acscdn\.com|adsco\.re|cdn4ads\.com|trafficstars\.com|popunder\.net|073m\.com|ay267\.com|painamour\.com|exosrv\.com|magsrv\.com|pemsrv\.com|galaksion\.com|evadav\.com|clickaine\.com|adspyglass\.com|popmyads\.com)$/;
  const popOn = () => document.documentElement?.dataset.hiberPop !== '0';
  // shortcut: últimas 2 partes del dominio ("com.ar" cuenta como un sitio): deja pasar de más, nunca bloquea de más.
  const site = (u) => { try { return new URL(u).hostname.split('.').slice(-2).join('.'); } catch { return ''; } };
  const own = site(self.origin), ao = location.ancestorOrigins;
  const top = window === window.top ? own : site(ao?.length ? ao[ao.length - 1] : document.referrer);
  const CTRL = 'a,button,input,select,textarea,label,summary,[role=button],[role=link],[role=menuitem],[role=tab],[onclick],[tabindex]';
  const PLAYER = 'video,.jwplayer,.plyr,.video-js';
  const EMBED = /(^|\.)(youtube(-nocookie)?\.com|vimeo\.com|dailymotion\.com|twitch\.tv|facebook\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|spotify\.com|soundcloud\.com|google\.com)$/;
  let clicked = null, at = 0, x = 0, y = 0;
  addEventListener('pointerdown', (e) => { clicked = e.composedPath?.()[0] || e.target; at = Date.now(); x = e.clientX; y = e.clientY; }, true);
  // Capa trampa: sin contenido visible y transparente, o fija tapando media pantalla. Los controles de formulario nunca lo son.
  const overlay = (el) => {
    if (!(el instanceof Element) || el.matches('input,select,textarea,button,label,iframe,video') || el.textContent.trim() || el.querySelector('img,svg,video,canvas,picture,iframe')) return false;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return +cs.opacity < 0.1 || (cs.position === 'fixed' && r.width * r.height >= innerWidth * innerHeight / 2);
  };
  const isCtrl = (el) => {
    if (!(el instanceof Element)) return false;
    const c = el.closest(CTRL);
    return c ? !overlay(c) : !overlay(el) && getComputedStyle(el).cursor === 'pointer';
  };
  const isAd = (u) => AD.test(u.hostname) || /\/afu\.php\?.*zoneid=/.test(u.href); // afu.php?zoneid=: firma de Monetag/Propeller en dominios que rotan
  const bad = (url) => {
    if (!popOn() || !own || url == null || url === '') return false;
    let u;
    try { u = new URL(url, location.href); } catch { return false; }
    if (!/^https?:$/.test(u.protocol)) return false; // about:blank, blob:, data:, mailto: pasan
    if (isAd(u)) return true; // antes que "mismo sitio": el script puede correr en un iframe de la propia red de anuncios
    const s = site(u.href);
    if (s === own || s === top) return false;
    const a = clicked?.closest?.('a[href]');
    if (a?.href === u.href && !overlay(a)) return false; // el enlace (visible) que tocaste
    if (!top) return false; // sin saber el sitio de la página, deja pasar
    if (own !== top && !EMBED.test(location.hostname) && document.querySelector(PLAYER)) return true;
    return Date.now() - at < 1000 && !isCtrl(clicked);
  };
  // Si el anuncio salió de una capa trampa, se la vuelve transparente al mouse (si no, como el anuncio "no abrió", queda tapando el play)
  // y el clic se reenvía a lo que el usuario veía debajo. Solo capas que de verdad intentaron abrir un anuncio.
  const defuse = () => {
    let t = clicked, n = 0;
    for (let i = 0; i < 3 && t && !overlay(t); i++) t = t.parentElement;
    if (!overlay(t)) return;
    clicked = null; // un solo reenvío por toque
    while (overlay(t) && n++ < 5) { t.style.setProperty('pointer-events', 'none', 'important'); t = document.elementFromPoint(x, y); }
    if (t) setTimeout(() => t.click(), 0);
  };
  const block = (url) => { const b = bad(url); if (b && Date.now() - at < 1000) defuse(); return b; };
  // Ventana de mentira: el script cree que abrió (y saca su capa) pero no pasa nada.
  const decoy = () => ({ closed: false, close() { this.closed = true; }, focus() {}, blur() {}, postMessage() {}, opener: null,
    location: { href: '', assign() {}, replace() {} }, document: { open() {}, write() {}, writeln() {}, close() {} } });
  const open = window.open;
  window.open = function (url, ...r) {
    return block(url) ? decoy() : open.call(this, url, ...r);
  };
  // Truco clásico: <a> suelto (sin insertar en la página) al que se le hace click() o dispatchEvent(click) por código.
  const loose = (a) => !a.isConnected && !a.hasAttribute('download') && block(a.href);
  const aclick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (!loose(this)) return aclick.call(this);
  };
  // Otro truco: <form target=_blank> hacia el anuncio enviado por código. Solo destinos de anuncio: un formulario real nunca va ahí.
  const fsubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function () {
    let u;
    try { u = new URL(this.action, location.href); } catch { return fsubmit.call(this); }
    if (!(popOn() && isAd(u))) return fsubmit.call(this);
  };
  const disp = EventTarget.prototype.dispatchEvent;
  HTMLAnchorElement.prototype.dispatchEvent = function (ev) {
    return ev?.type === 'click' && loose(this) ? false : disp.call(this, ev);
  };
  // Pop-under "clic en cualquier parte": listener de clic puesto en window/document/<html>/<body> cuyo propio código abre una ventana
  // sin mirar qué tocaste. Los delegadores legítimos (React, Vue, jQuery, botones de compartir) siempre miran e.target, así que no coinciden.
  // Ese listener no se registra: el clic funciona normal y ni siquiera parpadea una ventana.
  const POP_EV = /^(click|mousedown|mouseup|pointerdown|pointerup|touchstart|touchend|auxclick)$/;
  const fnSrc = Function.prototype.toString;
  const popper = (t, type, fn) => {
    if (typeof fn !== 'function' || !POP_EV.test(type) || !(t === window || t === document || t === document.documentElement || t === document.body) || !popOn()) return false;
    let c;
    try { c = fnSrc.call(fn); } catch { return false; }
    return c.length < 3000 && /\b(?:window|self|top|globalThis)\s*(?:\.\s*open|\[\s*["']open["']\s*\])\s*\(/.test(c)
      && !/target|closest|matches|composedPath|srcElement/.test(c);
  };
  const ael = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, ...r) {
    if (!popper(this, type, fn)) return ael.call(this, type, fn, ...r);
  };
  // Lo mismo para document.onclick = ... / body.onmousedown = ...
  for (const o of [window, Document.prototype, HTMLElement.prototype]) for (const k of ['onclick', 'onmousedown', 'onpointerdown']) {
    const d = Object.getOwnPropertyDescriptor(o, k);
    if (d?.set && d.configurable) Object.defineProperty(o, k, { ...d, set(v) { if (!popper(this, k.slice(2), v)) d.set.call(this, v); } });
  }
  // Enlace trampa (capa invisible o destino de anuncio): navegación nativa (no pasa por window.open), se corta acá.
  addEventListener('click', (e) => {
    const a = (e.composedPath?.()[0] || e.target)?.closest?.('a[href]');
    let u;
    try { u = a && new URL(a.href); } catch { return; }
    if (u && !a.hasAttribute('download') && (overlay(a) || isAd(u)) && block(a.href)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
})();
