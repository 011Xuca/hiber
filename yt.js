// Bloqueo de anuncios de YouTube. Corre en el mundo de la página (como los scriptlets de uBlock Origin).
// Se apaga con <html data-hiber-yt="0"> (lo pone content.js). Ausente = encendido, para no llegar tarde.
// YouTube cambia seguido: si deja de andar, es lo primero que hay que revisar.
(() => {
  const on = () => document.documentElement?.dataset.hiberYt !== '0';
  const AD_KEYS = ['adPlacements', 'playerAds', 'adSlots', 'adBreakHeartbeatParams'];

  // 1) Saca los datos de anuncios de las respuestas del reproductor antes de que YouTube los lea.
  const prune = (o) => {
    if (o && typeof o === 'object' && on()) {
      for (const k of AD_KEYS) if (k in o) delete o[k];
      if (o.playerResponse) prune(o.playerResponse);
    }
    return o;
  };
  const parse = JSON.parse;
  JSON.parse = function (...a) { return prune(parse.apply(this, a)); };
  const json = Response.prototype.json;
  Response.prototype.json = function () { return json.call(this).then(prune); };
  let init;
  try {
    Object.defineProperty(window, 'ytInitialPlayerResponse', { configurable: true, get: () => init, set: (v) => { init = prune(v); } });
  } catch { /* otra extensión ya lo definió */ }

  // 2) Plan B: si igual aparece un anuncio, lo silencia, lo adelanta al final y toca "Saltar".
  let wasMuted = null, capped = '', stuck = 0;
  setInterval(() => {
    // Tope de calidad (480p): menos RAM, GPU y datos. Se fija una vez por video.
    const mp = document.documentElement.dataset.hiberVq === '1' && document.getElementById('movie_player');
    const id = mp?.getVideoData?.().video_id;
    if (id && id !== capped) { capped = id; mp.setPlaybackQualityRange?.('tiny', 'large'); }
    const p = on() && document.querySelector('.html5-video-player.ad-showing');
    const v = document.querySelector('.html5-video-player video');
    // Con el bloqueo puesto el video a veces queda cargando para siempre: si lleva ~2s trabado, lo adelanta 1s.
    if (!p && on() && v && !v.paused && v.readyState < 3) { if (++stuck >= 8) { stuck = 0; v.currentTime += 1; } } else stuck = 0;
    if (!p) { if (wasMuted !== null && v) { v.muted = wasMuted; v.playbackRate = 1; v.currentTime += 1; } wasMuted = null; return; }
    if (!v) return;
    if (wasMuted === null) wasMuted = v.muted;
    v.muted = true;
    if (isFinite(v.duration) && v.duration > 0) { v.playbackRate = 16; v.currentTime = v.duration; }
    document.querySelectorAll('.ytp-skip-ad-button,.ytp-ad-skip-button,.ytp-ad-skip-button-modern,.ytp-ad-skip-button-container button').forEach((b) => b.click());
  }, 250);
})();
