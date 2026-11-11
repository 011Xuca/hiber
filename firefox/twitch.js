// Anuncios de Twitch. Corre en el mundo de la página; se apaga con <html data-hiber-yt="0"> (el mismo interruptor que YouTube).
// Twitch pega los anuncios dentro del stream, así que no se pueden bloquear por red. Probado (nov 2026): embed, popout, autoplay,
// picture-by-picture y sus variantes ios/android traen anuncio; solo autoplay+android viene sin anuncio, pero con tope de 360p.
// Por eso se usa solo en el carrusel de la portada; en los canales el anuncio se silencia y se tapa hasta que termina.
// Twitch cambia esto seguido: si deja de andar, revisar primero acá.
(() => {
  const on = () => document.documentElement?.dataset.hiberYt !== '0';
  const fetch0 = window.fetch;
  window.fetch = function (input, init) {
    try {
      if (on() && typeof init?.body === 'string' && init.body.includes('PlaybackAccessToken')) {
        const b = JSON.parse(init.body);
        for (const q of [].concat(b)) if (q?.variables?.playerType === 'frontpage') Object.assign(q.variables, { playerType: 'autoplay', platform: 'android' });
        init = { ...init, body: JSON.stringify(b) };
      }
    } catch { /* cuerpo raro: se manda tal cual */ }
    return fetch0.call(this, input, init);
  };

  // Durante un anuncio se silencia y se tapa (no se puede saltar); al terminar vuelven el volumen y la imagen.
  let muted = null;
  setInterval(() => {
    const ad = on() && document.querySelector('[data-a-target="video-ad-label"],[data-a-target="video-ad-countdown"],[data-test-selector="ad-banner-default-text"]');
    // Cartel de "Twitch Turbo" sobre el anuncio: solo se oculta el bloque que lo contiene (sin video ni controles adentro).
    if (on()) document.querySelectorAll('[data-a-target="video-ref"] [role="presentation"]').forEach((e) => {
      if (!e.querySelector('video,button,[data-a-target^="player-"]') && /turbo/i.test(e.innerHTML.slice(0, 4000))) e.style.display = 'none';
    });
    const v = document.querySelector('video');
    if (!v) return;
    // Sin tapar la imagen (dejaba la pantalla negra): solo se silencia. Al terminar, en un canal se vuelve a pedir el sonido (el directo entra silenciado).
    document.querySelectorAll('video').forEach((x) => { if (x.style.opacity === '0') x.style.opacity = ''; });
    if (ad) { muted = true; v.muted = true; }
    else if (muted) { muted = null; if (home()) v.muted = true; else { want = Date.now(); armed = true; } }
  }, 500);

  // Sonido: en la portada y el directorio los directos de arriba van silenciados salvo que los desmutees vos (clic real en el ícono);
  // al entrar a un canal (o un video) el directo arranca con sonido.
  const home = () => location.pathname === '/' || location.pathname.startsWith('/directory');
  let click = 0, path = '', want = 0, armed = false;
  const unmute = (v) => { v.muted = false; v.play().catch(() => {}); };
  const allowed = new WeakSet();
  for (const e of ['pointerdown', 'keydown']) addEventListener(e, (ev) => {
    if (!ev.isTrusted) return;
    click = Date.now();
    // Entró silenciado (Chrome no deja desmutear sin un gesto): con el primer clic o tecla del usuario se desmutea.
    if (armed && !home()) setTimeout(() => { armed = false; const v = [...document.querySelectorAll('video')].find((x) => x.muted && x.readyState); if (v) unmute(v); }, 50);
  }, true);
  document.addEventListener('volumechange', (e) => {
    const v = e.target;
    if (!on() || !home() || v.tagName !== 'VIDEO') return;
    if (v.muted) allowed.delete(v);
    else if (Date.now() - click < 800) allowed.add(v); // lo desmuteaste vos
    else v.muted = true;
  }, true);
  setInterval(() => {
    if (!on() || muted) return; // durante un anuncio no se pelea con el silencio
    const vids = document.querySelectorAll('video');
    if (home()) { if (path !== location.pathname) vids.forEach((v) => !v.muted && allowed.add(v)); /* mini-reproductor: sigue con el sonido que tenía */ vids.forEach((v) => { if (!v.muted && !allowed.has(v)) v.muted = true; }); path = location.pathname; return; }
    if (path !== location.pathname) { path = location.pathname; want = Date.now(); armed = true; try { localStorage.setItem('video-muted', '{"default":false}'); } catch { /* sin storage */ } }
    if ([...vids].some((x) => !x.muted && !x.paused)) { want = 0; armed = false; } // ya suena (o lo desmuteaste vos): no se toca más
    // Unos 10s tras entrar: si sigue silenciado se desmutea, pero solo si Chrome lo permite (ya hubo un gesto tuyo o el sitio tiene permiso de autoplay con sonido).
    // Si no, queda armado el desmuteo por el primer clic o tecla (arriba); forzarlo antes haría que Chrome pause el video.
    const v = want && Date.now() - want < 120000 && [...vids].find((x) => x.muted && x.readyState && !x.paused);
    if (v && (navigator.userActivation?.hasBeenActive || navigator.getAutoplayPolicy?.(v) === 'allowed')) { unmute(v); want = 0; armed = false; }
  }, 500);
})();
