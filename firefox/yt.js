// Anuncios de YouTube. Corre en el mundo de la página; se apaga con <html data-hiber-yt="0"> (lo pone content.js).
// YouTube anota como bloqueador (y entonces pausa o muestra el cartel) estos trucos, probado en nov 2026:
// tocar JSON.parse/Response.json (los prueba con respuestas de mentira), sacar el preroll de la respuesta,
// el clic por código en "Saltar" (event.isTrusted), adelantar el anuncio y acelerarlo a más de x2.5.
// Por eso no se filtra nada: el anuncio se corta con la API del propio reproductor y, si no toma, corre silenciado, tapado y a x2.
// YouTube cambia seguido: si deja de andar, es lo primero que hay que revisar.
(() => {
  const on = () => document.documentElement?.dataset.hiberYt !== '0';

  // Calidad automática: la más alta que aprovecha la pantalla; con red buena se fija como piso (si no, YouTube arranca bajo), con red floja solo como tope.
  // shortcut: la red sale de navigator.connection (solo Chrome, valores aproximados); sin eso se asume buena.
  const QS = [[2160, 'hd2160'], [1440, 'hd1440'], [1080, 'hd1080'], [720, 'hd720'], [0, 'large']];
  const auto = () => {
    const px = screen.height * (devicePixelRatio || 1), c = navigator.connection;
    const q = QS.find(([h]) => px >= h - 40)[1];
    return { q, good: !c || (c.effectiveType === '4g' && (!c.downlink || c.downlink >= 5)) };
  };
  const cap = () => (document.documentElement.dataset.hiberVq === '1' ? 'large' : 'highres');
  const setQ = (mp) => {
    if (document.documentElement.dataset.hiberVqa !== '1' || cap() === 'large') return mp.setPlaybackQualityRange?.('tiny', cap());
    const { q, good } = auto();
    mp.setPlaybackQualityRange?.(good ? q : 'tiny', q);
  };

  // Ventana flotante: baja a 360p mientras está abierta y vuelve al tope normal al cerrarla (lo avisa content.js).
  document.addEventListener('hiber-pip', (e) => {
    const mp = document.getElementById('movie_player');
    if (e.detail) mp?.setPlaybackQualityRange?.('tiny', 'medium');
    else if (mp) setQ(mp);
  });

  // Si aparece un anuncio se corta; mientras tanto va silenciado y a x2 (content.js lo tapa y deja "Saltar" a la vista para un clic real).
  let resume = 0, orphan = 0, wasMuted = null, capped = '', stuck = 0, last = -1;
  setInterval(() => {
    // Tope de calidad (480p): menos RAM, GPU y datos. Se fija una vez por video.
    const mp = (document.documentElement.dataset.hiberVq === '1' || document.documentElement.dataset.hiberVqa === '1') && document.getElementById('movie_player');
    const id = mp?.getVideoData?.().video_id;
    if (id && id !== capped) { capped = id; setQ(mp); }
    const p = on() && document.querySelector('.html5-video-player.ad-showing');
    const v = (p || document.getElementById('movie_player') || document).querySelector('video'); // el del reproductor, no una vista previa
    // Cartel "los bloqueadores de anuncios no están permitidos": deja todo gris, sin clics y el video pausado. Se saca el cartel y se reanuda.
    const enf = on() && document.querySelector('ytd-enforcement-message-view-model');
    if (enf) { (enf.closest('tp-yt-paper-dialog') || enf).remove(); document.getElementById('movie_player')?.playVideo?.(); resume = 12; }
    // Fondo gris huérfano: el cartel (o cualquier diálogo) ya no está a la vista pero su fondo sigue tapando y bloqueando clics.
    const bd = on() && [...document.querySelectorAll('tp-yt-iron-overlay-backdrop')].find((b) => b.opened);
    if (bd && ![...document.querySelectorAll('tp-yt-paper-dialog[opened]')].some((d) => d.getClientRects().length)) {
      if (++orphan >= 2 || enf) {
        document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach((b) => b.remove());
        document.body.style.overflow = '';
        document.getElementById('movie_player')?.playVideo?.();
        v?.play().catch(() => {});
        orphan = 0;
      }
    } else orphan = 0;
    // Cargar al arrancar es normal (readyState < 3 sin pausa): solo si lleva ~5s sin avanzar lo re-busca en el mismo segundo.
    // Nunca adelanta: cada seek tira el buffer y antes eso trababa más y se comía segundos del inicio.
    if (!p && on() && v && !v.paused && v.readyState < 3 && v.currentTime === last) { if (++stuck >= 20) { stuck = 0; v.currentTime = v.currentTime; v.play().catch(() => {}); } } else stuck = 0;
    last = v ? v.currentTime : -1;
    if (!p) {
      if (wasMuted !== null && v) { v.muted = wasMuted; v.playbackRate = 1; v.play().catch(() => {}); resume = 12; }
      // Tras cortar el anuncio el video real queda frenado hasta que alguien le da play: se reintenta ~3s.
      else if (resume > 0 && v) { resume--; if (v.paused && !v.ended) v.play().catch(() => {}); }
      wasMuted = null; return;
    }
    if (!v) return;
    // cancelPlayback (API pública) descarta el módulo de anuncios y frena; el bloque de arriba le da play al video real.
    if (wasMuted === null) { wasMuted = v.muted; p.cancelPlayback?.(); }
    v.muted = true;
    v.playbackRate = 2; // si el corte no toma: más de x2.5 YouTube lo cuenta como anomalía
  }, 250);
})();
