let dirty = false, st = null, style = null, obs = null;
const paused = new Set();

// Formulario con texto escrito: el background no duerme esta pestaña.
addEventListener('input', (e) => { if (!e.target.closest?.('[type=search]')) dirty = true; }, true);
addEventListener('submit', () => { dirty = false; }, true);

// También cuenta como "ocupada" si algo está sonando o reproduciendo.
const playing = () => navigator.mediaSession?.playbackState === 'playing'
  || [...document.querySelectorAll('video,audio')].some((m) => !m.paused && !m.ended);
chrome.runtime.onMessage.addListener((m, _, reply) => { if (m === 'dirty') reply({ dirty, playing: playing() }); if (m === 'pip') togglePip(); if (m === 'mem') reply(performance.memory?.usedJSHeapSize || 0); });

function apply() {
  const s = st;
  const yt = /(^|\.)youtube\.com$/.test(location.hostname);
  const calm = s.on && s.motion && !yt; // en YouTube las animaciones apagadas dejan colgados sus diálogos (fondo gris)
  let css = '';
  if (s.on && s.cpu) css += '*,*::before,*::after{box-shadow:none!important;text-shadow:none!important;backdrop-filter:none!important;filter:none!important;will-change:auto!important}';
  // Duración 0 (no "none"): no se ve movimiento y los elementos no quedan ocultos a mitad de animación.
  if (calm) css += '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:0s!important;transition-delay:0s!important;scroll-behavior:auto!important}';
  // Anuncios: lo que la red no alcanza a bloquear se oculta.
  if (s.on && s.trackers) css += 'ins.adsbygoogle,[id^=google_ads],[id*=div-gpt-ad],iframe[src*="doubleclick.net"],iframe[src*="googlesyndication.com"],.adsbygoogle,.ad-banner,[data-ad-slot],[data-google-query-id],a[href*="afu.php?zoneid="],iframe[src*="afu.php?zoneid="]{display:none!important}'; // sin .adsbox: es el cebo típico de los detectores de bloqueadores
  // (enlaces/iframes con la firma de pop-unders: suelen ser la capa trampa misma)
  // YouTube: oculta lo que quede de anuncios (el grueso lo corta yt.js). Sin .ytp-ad-module: ahí vive "Saltar", que solo anda con un clic real.
  // #player-ads solo dentro de la página de video: YouTube pone uno suelto de cebo y, si sale oculto, lo anota como bloqueador.
  if (s.on && s.ytads && yt) css += '#masthead-ad,ytd-watch-flexy #player-ads,.ytp-ad-overlay-container,ytd-ad-slot-renderer,ytd-in-feed-ad-layout-renderer,ytd-banner-promo-renderer,ytd-promoted-sparkles-web-renderer,ytd-display-ad-renderer,ytd-statement-banner-renderer,ytd-companion-slot-renderer,ytd-player-legacy-desktop-watch-ads-renderer,ytd-enforcement-message-view-model,tp-yt-paper-dialog:has(ytd-enforcement-message-view-model){display:none!important}#movie_player.ad-showing video{opacity:0!important}';
  const h = document.documentElement;
  h.dataset.hiberYt = s.on && s.ytads ? '1' : '0';
  h.dataset.hiberPop = s.on && s.trackers ? '1' : '0';
  h.dataset.hiberVq = s.on && s.vq ? '1' : '';
  h.dataset.hiberVqa = s.on && s.vqa ? '1' : '';
  h.dataset.hiberMotion = calm ? '1' : '';
  h.dataset.hiberMobile = s.on && s.mobile ? '1' : '';
  if (!style) { style = document.createElement('style'); (document.head || document.documentElement).append(style); }
  style.textContent = css;
  lazy();
}

// Imágenes cargan recién al acercarse; decodificación fuera del hilo principal.
const PRE = 'link[rel=prefetch],link[rel=prerender],link[rel=preconnect],link[rel=dns-prefetch]';
const tweak = (n) => {
  if (n.nodeType !== 1) return;
  // Solo imágenes: a un iframe con src puesto después lo vemos con src vacío y un embed de video quedaba diferido.
  if (st.lazy) for (const e of n.matches('img') ? [n] : n.querySelectorAll?.('img') || []) {
    if (!e.hasAttribute('loading')) e.loading = 'lazy'; // e.loading devuelve "auto" aunque falte el atributo
    e.decoding = 'async';
  }
  // Anuncio disfrazado ("Sign in / verify you're human"): iframe con srcdoc de la plantilla de esa red (habla con la página por postMessage {$G$:1}).
  if (st.trackers) for (const e of n.matches('iframe[srcdoc]') ? [n] : n.querySelectorAll?.('iframe[srcdoc]') || []) if (/[$]G[$]\s*:\s*1/.test(e.getAttribute('srcdoc'))) e.remove();
  if (st.preload) for (const e of n.matches(PRE) ? [n] : n.querySelectorAll?.(PRE) || []) e.remove();
};
function lazy() {
  const on = st.on && (st.lazy || st.preload || st.trackers);
  if (on && !obs) {
    obs = new MutationObserver((ms) => ms.forEach((m) => (m.type === 'attributes' ? tweak(m.target) : m.addedNodes.forEach(tweak))));
    obs.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['srcdoc'] });
    tweak(document.documentElement);
  } else if (!on && obs) { obs.disconnect(); obs = null; }
}

// Pausa videos sin sonido al ocultar la pestaña y los reanuda al volver (los que suenan no se tocan).
document.addEventListener('visibilitychange', () => {
  if (document.hidden && (!st?.on || !st.bgvideo)) return;
  if (document.hidden) {
    // 1s de espera y sin tocar el video flotante: el PiP automático y los sitios que arrancan mudos no se pausan
    setTimeout(() => document.hidden && document.querySelectorAll('video').forEach((v) => {
      if (!v.paused && (v.muted || v.volume === 0) && v !== document.pictureInPictureElement) { v.pause(); paused.add(v); }
    }), 1000);
  } else {
    paused.forEach((v) => v.play().catch(() => {}));
    paused.clear();
  }
});

const popBest = () => togglePip(); // pop-out automático al cambiar de pestaña
// Al minimizar o cambiar de pestaña/ventana con un video andando, Chrome abre el PiP solo si la página registró este manejador.
// Se vuelve a registrar al dar play porque algunos sitios (YouTube) pisan los manejadores de mediaSession.
const armPip = () => { if (st?.on && st.pip) try { navigator.mediaSession.setActionHandler('enterpictureinpicture', popBest); } catch { /* sin soporte */ } };
document.addEventListener('play', armPip, true);
setInterval(armPip, 3000); // Twitch y otros SPA reemplazan el reproductor al cambiar de canal y pierden el manejador
const load = (s) => {
  st = { ...D, ...s }; apply();
  // Como Opera GX: al cambiar de pestaña con un video andando, se abre solo en ventana flotante (Chrome pide permiso del sitio para esto).
  armPip();
  if (!(st.on && st.pip)) { try { navigator.mediaSession.setActionHandler('enterpictureinpicture', null); } catch { /* sin soporte */ } pipBtn?.remove(); }
};
chrome.storage.local.get('s').then((r) => load(r.s));
chrome.storage.onChanged.addListener((c) => c.s && load(c.s.newValue));

// Botón de video flotante al pasar el mouse por un video (como Opera GX). Un clic real cuenta como gesto del usuario, que PiP exige.
let pipBtn, pipV, pipT;
addEventListener('mousemove', (e) => {
  if (!st?.on || !st.pip || !document.pictureInPictureEnabled || !document.getElementsByTagName('video').length) return;
  const v = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.tagName === 'VIDEO' && n.readyState && n.clientWidth > 420 && !n.disablePictureInPicture);
  clearTimeout(pipT);
  if (!v) { pipT = setTimeout(() => pipBtn?.remove(), 1500); return; }
  if (!pipBtn) {
    pipBtn = document.createElement('button');
    pipBtn.textContent = '\u29c9';
    pipBtn.title = 'Picture-in-picture';
    pipBtn.style.cssText = 'position:fixed;z-index:2147483647;width:34px;height:34px;border:0;border-radius:8px;background:#000b;color:#fff;font:18px sans-serif;cursor:pointer;padding:0';
    pipBtn.onclick = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      togglePip(pipV);
    };
  }
  pipV = v;
  const r = v.getBoundingClientRect();
  pipBtn.style.top = Math.max(r.top, 0) + 8 + 'px';
  pipBtn.style.left = Math.min(r.right, innerWidth) - 42 + 'px';
  if (!pipBtn.isConnected) document.documentElement.append(pipBtn);
}, { passive: true });

// Video flotante: el PiP nativo del navegador (sirve para cualquier <video>: YouTube, Twitch, Kick, TikTok...).
const biggest = () => [...document.querySelectorAll('video')].filter((x) => x.readyState && x.videoWidth)
  .sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
function togglePip(v) {
  if (document.pictureInPictureElement) return document.exitPictureInPicture();
  (v?.isConnected ? v : biggest())?.requestPictureInPicture?.().catch(() => {});
}
// yt.js baja la calidad a 360p mientras el video está flotando.
for (const [e, on] of [['enterpictureinpicture', true], ['leavepictureinpicture', false]]) {
  document.addEventListener(e, () => st?.on && st.pip && document.dispatchEvent(new CustomEvent('hiber-pip', { detail: on })), true);
}
