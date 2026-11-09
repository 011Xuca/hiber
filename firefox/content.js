let dirty = false, st = null, style = null, obs = null;
const paused = new Set();

// Formulario con texto escrito: el background no duerme esta pestaña.
addEventListener('input', (e) => { if (!e.target.closest?.('[type=search]')) dirty = true; }, true);
addEventListener('submit', () => { dirty = false; }, true);

// También cuenta como "ocupada" si algo está sonando o reproduciendo.
const playing = () => navigator.mediaSession?.playbackState === 'playing'
  || [...document.querySelectorAll('video,audio')].some((m) => !m.paused && !m.ended);
chrome.runtime.onMessage.addListener((m, _, reply) => { if (m === 'dirty') reply({ dirty, playing: playing() }); });

function apply() {
  const s = st;
  let css = '';
  if (s.on && s.cpu) css += '*,*::before,*::after{box-shadow:none!important;text-shadow:none!important;backdrop-filter:none!important;filter:none!important;will-change:auto!important}';
  // Duración 0 (no "none"): no se ve movimiento y los elementos no quedan ocultos a mitad de animación.
  if (s.on && s.motion) css += '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:0s!important;transition-delay:0s!important;scroll-behavior:auto!important}';
  // Anuncios: lo que la red no alcanza a bloquear se oculta.
  if (s.on && s.trackers) css += 'ins.adsbygoogle,[id^=google_ads],[id*=div-gpt-ad],iframe[src*="doubleclick.net"],iframe[src*="googlesyndication.com"],.adsbygoogle,.ad-banner,.adsbox,[data-ad-slot],[data-google-query-id]{display:none!important}';
  // YouTube: oculta lo que quede de anuncios (el grueso lo corta yt.js).
  const yt = /(^|\.)youtube\.com$/.test(location.hostname);
  if (s.on && s.ytads && yt) css += '#masthead-ad,#player-ads,.video-ads,.ytp-ad-module,.ytp-ad-overlay-container,ytd-ad-slot-renderer,ytd-in-feed-ad-layout-renderer,ytd-banner-promo-renderer,ytd-promoted-sparkles-web-renderer,ytd-display-ad-renderer,ytd-statement-banner-renderer,ytd-companion-slot-renderer,ytd-player-legacy-desktop-watch-ads-renderer,ytd-enforcement-message-view-model,tp-yt-paper-dialog:has(ytd-enforcement-message-view-model){display:none!important}';
  const h = document.documentElement;
  h.dataset.hiberYt = s.on && s.ytads ? '1' : '0';
  h.dataset.hiberVq = s.on && s.vq ? '1' : '';
  h.dataset.hiberMotion = s.on && s.motion ? '1' : '';
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
  if (st.preload) for (const e of n.matches(PRE) ? [n] : n.querySelectorAll?.(PRE) || []) e.remove();
};
function lazy() {
  const on = st.on && (st.lazy || st.preload);
  if (on && !obs) {
    obs = new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach(tweak)));
    obs.observe(document, { childList: true, subtree: true });
    tweak(document.documentElement);
  } else if (!on && obs) { obs.disconnect(); obs = null; }
}

// Pausa videos sin sonido al ocultar la pestaña y los reanuda al volver (los que suenan no se tocan).
document.addEventListener('visibilitychange', () => {
  if (!st?.on || !st.bgvideo) return;
  if (document.hidden) {
    document.querySelectorAll('video').forEach((v) => {
      if (!v.paused && (v.muted || v.volume === 0)) { v.pause(); paused.add(v); }
    });
  } else {
    paused.forEach((v) => v.play().catch(() => {}));
    paused.clear();
  }
});

const load = (s) => { st = { ...D, ...s }; apply(); };
chrome.storage.local.get('s').then((r) => load(r.s));
chrome.storage.onChanged.addListener((c) => c.s && load(c.s.newValue));
