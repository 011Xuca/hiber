// Anuncios de Twitch. Corre en el mundo de la página; se apaga con <html data-hiber-yt="0"> (el mismo interruptor que YouTube).
// Twitch pega los anuncios dentro del stream, así que no se pueden bloquear por red. Probado (nov 2026): embed, popout, autoplay,
// picture-by-picture y sus variantes ios/android traen anuncio; solo autoplay+android viene sin anuncio, pero con tope de 360p.
// Por eso en la portada se usa siempre y en los canales solo durante el corte (ver abajo); si eso falla, el anuncio se silencia.
// Twitch cambia esto seguido: si deja de andar, revisar primero acá.
(() => {
  const on = () => document.documentElement?.dataset.hiberYt !== '0';
  // Mientras la playlist del directo trae un corte ("stitched"), el reproductor recibe la de un pedido autoplay/android
  // (sin anuncio, hasta 360p); al terminar vuelve a la normal. El reproductor baja las playlists desde un Worker: se envuelve.
  const subs = {}, workers = [];
  const tell = (d) => workers.forEach((w) => w.postMessage({ hiberTw: d }));
  const fetch0 = window.fetch;
  window.fetch = function (input, init) {
    try {
      if (on() && typeof init?.body === 'string' && init.body.includes('PlaybackAccessToken')) {
        const b = JSON.parse(init.body);
        const live = [].concat(b).find((q) => q?.variables?.isLive && q.variables.login && q.variables.playerType !== 'frontpage');
        if (live && document.documentElement.dataset.hiberTw !== '1') {
          const v = { ...live.variables, playerType: 'autoplay', platform: 'android' };
          fetch0.call(window, input, { ...init, body: JSON.stringify({ ...live, variables: v }) }).then((r) => r.json()).then((j) => {
            const t = [].concat(j)[0]?.data?.streamPlaybackAccessToken;
            if (t) tell(subs[v.login.toLowerCase()] = { login: v.login.toLowerCase(), token: t.value, sig: t.signature });
          }).catch(() => {});
        }
        for (const q of [].concat(b)) if (q?.variables?.playerType === 'frontpage' || (q?.variables?.playerType && document.documentElement.dataset.hiberTw === '1')) Object.assign(q.variables, { playerType: 'autoplay', platform: 'android' });
        init = { ...init, body: JSON.stringify(b) };
      }
    } catch { /* cuerpo raro: se manda tal cual */ }
    return fetch0.call(this, input, init);
  };
  const inWorker = () => {
    const f0 = self.fetch, subs = {}, wait = {}, hls = {};
    addEventListener('message', (e) => {
      const d = e.data?.hiberTw;
      if (!d) return;
      e.stopImmediatePropagation();
      subs[d.login] = d;
      (wait[d.login] || []).forEach((r) => r());
    });
    const ad = (t) => t.includes('stitched');
    const best = (t, base) => {
      const L = t.split('\n'), v = [];
      for (let i = 0; i < L.length; i++) if (L[i].startsWith('#EXT-X-STREAM-INF')) v.push({ h: +(/RESOLUTION=\d+x(\d+)/.exec(L[i]) || [0, 0])[1], u: new URL(L[i + 1].trim(), base).href });
      return v.sort((a, b) => b.h - a.h)[0]?.u;
    };
    const backup = async (login) => {
      if (!subs[login]) await new Promise((r) => { (wait[login] ||= []).push(r); setTimeout(r, 3000); });
      const s = subs[login], m = hls[login];
      if (!s || !m) return null;
      if (!s.media) {
        const u = new URL(m); u.searchParams.set('token', s.token); u.searchParams.set('sig', s.sig);
        s.media = best(await (await f0(u.href)).text(), u.href);
      }
      const r = s.media && await f0(s.media);
      if (!r?.ok) { s.media = null; return null; }
      return r.text();
    };
    // Cada segmento del anuncio se cambia por el de la alternativa en la misma posición (contando desde el final): la numeración
    // sigue siendo la del directo, así el reproductor no se traba al volver. Se sacan las marcas del anuncio y el prefetch.
    const splice = (t, b) => {
      const alt = [], B = b.split('\n');
      B.forEach((l, i) => l.startsWith('#EXTINF') && alt.push([l, B[i + 1]]));
      const L = t.split('\n'), at = [];
      L.forEach((l, i) => l.startsWith('#EXTINF') && at.push(i));
      let skip = 0;
      at.forEach((i, k) => {
        if (L[i].includes(',live')) return;
        const s = alt[alt.length - (at.length - k)];
        if (s) [L[i], L[i + 1]] = s; else { L[i] = L[i + 1] = null; skip++; }
      });
      return L.filter((l) => l !== null && !/^#EXT-X-TWITCH-PREFETCH|^#EXT-X-DATERANGE:.*(stitched|twitch-ad|quartile)/.test(l))
        .join('\n').replace(/#EXT-X-MEDIA-SEQUENCE:(\d+)/, (m, n) => '#EXT-X-MEDIA-SEQUENCE:' + (+n + skip));
    };
    let cur = '';
    self.fetch = async function (input, init) {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (!url.includes('.m3u8')) return f0.call(this, input, init);
      const r = await f0.call(this, input, init);
      const login = (/\/channel\/hls\/([^/.?]+)\.m3u8/.exec(url) || [])[1];
      if (login) { cur = login.toLowerCase(); hls[cur] = url; return r; }
      if (!cur || !r.ok) return r;
      let t = await r.text();
      if (ad(t)) {
        const b = await backup(cur).catch(() => null);
        t = splice(t, b && !ad(b) ? b : ''); // sin alternativa: se sacan los segmentos del anuncio (la imagen queda quieta)
      }
      return new Response(t, { status: r.status, statusText: r.statusText, headers: r.headers });
    };
  };
  const W = window.Worker;
  window.Worker = class extends W {
    constructor(url, opts) {
      let u = url;
      try { if (on() && opts?.type !== 'module') u = URL.createObjectURL(new Blob([`(${inWorker})();importScripts(${JSON.stringify(new URL(url, location.href).href)});`], { type: 'text/javascript' })); } catch { u = url; }
      super(u, opts);
      if (u !== url) { workers.push(this); Object.values(subs).forEach((d) => this.postMessage({ hiberTw: d })); }
    }
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
