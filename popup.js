const TXT = {
  es: {
    upd: (v) => `Hay una versión nueva (${v}). Descargala acá`,
    active: 'Activa', tag: 'Duerme lo que no usás y recorta lo que pesa.',
    gSleep: 'Dormir pestañas', gGuard: 'Control de recursos', gRam: 'RAM máxima', gCpu: 'CPU máxima', gHint: 'La RAM es una estimación de las pestañas (Chrome); la CPU es la de TODO el equipo (juegos y otras apps incluidas), no solo la del navegador: se actúa si pasa el tope 3 min seguidos y solo con pestañas inactivas. Mínimo 1 GB y 1%. Si se pasa duerme pestañas y avisa; si queda imposible o el navegador se cuelga, se desactiva solo.', gSpeed: 'Rendimiento', gAds: 'Anuncios', gSites: 'Sitios',
    sleepAfter: 'Dormir tras', timeHint: 'Elegí el tiempo que quieras (mínimo 10 segundos). Se revisa cada ~30 s.',
    units: { s: 'segundos', m: 'minutos', h: 'horas' },
    never: 'Estos sitios nunca se duermen', always: 'Estos sitios siempre se duermen (aunque suenen)', wlHint: 'uno por línea, ej: youtube.com',
    lang: 'Idioma', theme: 'Tema', system: 'Sistema', light: 'Claro', dark: 'Oscuro',
    social: 'Mis redes', donate: 'Donar en Ko-fi', reload: 'Recargar extensión',
    lstInfo: (n, d) => `${n} dominios, ${d}`,
    stats: (f, t, d) => `${f} de ${t} GB libres · ${d} pestañas dormidas`, statsNoMem: (d) => `${d} pestañas dormidas`,
    tipsTitle: (b, n) => `Tips para ${b} (${n})`, noTips: 'Ya tenés todo bien configurado.',
    levels: { tranqui: 'Ligero', normal: 'Equilibrado', afondo: 'Intensivo', celu: 'Móvil', mano: 'Personalizado' },
    toggles: {
      discard: ['Dormir pestañas', 'Se duermen si no suenan ni reproducen. Recargan al hacerles clic.'],
      cpu: ['Menos efectos', 'Saca sombras, transparencias y filtros.'],
      motion: ['Sin animaciones', 'Elimina transiciones y movimiento, también los hechos con JavaScript.'],
      gramOn: ['Limitador de RAM', 'Duerme pestañas antes de que se pase del tope de abajo.'],
      gcpuOn: ['Limitador de CPU', 'Duerme pestañas si la CPU se pasa del tope de abajo.'],
      ghard: ['Límite estricto', 'Al llegar al tope duerme también las pestañas con sonido o video.'],
      pip: ['Video flotante', 'Botón sobre los videos (y Alt+P) para verlos en una ventanita sobre otras apps.'],
      lazy: ['Carga diferida', 'Las imágenes cargan al verlas.'],
      preload: ['Deshabilitar precarga de páginas', 'El navegador no baja páginas que quizá nunca abrís.'],
      bgvideo: ['Frenar videos de fondo', 'Pausa los videos mudos si cambiás de pestaña.'],
      fonts: ['Fuentes del sistema', 'No descarga tipografías de las webs.'],
      images: ['Sin imágenes', 'Las páginas cargan solo texto.'],
      mobile: ['Versión celu', 'Pide la web móvil, que suele ser más liviana.'],
      trackers: ['Bloquear anuncios', 'Corta publicidad y rastreadores, y oculta banners.'],
      lists: ['Lista pública de anuncios', 'Suma miles de dominios de publicidad conocidos (lista de Peter Lowe). Se actualiza sola cada 3 días.'],
      ytads: ['Anuncios de YouTube', 'Corta el anuncio al empezar el video; si no puede, va silenciado y a x2. YouTube cambia seguido y puede fallar.'],
      twads: ['Anuncios de Twitch', 'Silencia el anuncio mientras dura y saca los de la portada. En los canales no se pueden quitar con calidad completa.'],
      tw360: ['Twitch en 360p sin anuncios', 'Necesita "Anuncios de Twitch". Pide todos los directos en 360p, que vienen sin anuncios. Pierde calidad en todos los canales.'],
      vqa: ['YouTube: calidad automática', 'Fija la calidad más alta que aprovecha tu pantalla y tu red (red floja: solo la usa de tope).'],
      vq: ['YouTube a 480p máx.', 'Usa menos RAM, GPU y datos. Baja la nitidez.'],
    },
  },
  en: {
    upd: (v) => `New version available (${v}). Download it here`,
    active: 'On', tag: 'Sleeps what you don\'t use and trims what\'s heavy.',
    gSleep: 'Sleep tabs', gGuard: 'Resource control', gRam: 'Max RAM', gCpu: 'Max CPU', gHint: 'RAM is an estimate for tabs (Chrome); CPU is for the WHOLE computer (games and other apps included), not just the browser: it acts only if over the limit for 3 minutes straight, and only on idle tabs. Minimum 1 GB and 1%. Going over puts tabs to sleep and notifies you; if the limits are impossible or the browser hangs, it turns itself off.', gSpeed: 'Performance', gAds: 'Ads', gSites: 'Sites',
    sleepAfter: 'Sleep after', timeHint: 'Pick any time you like (10 seconds minimum). Checked every ~30 s.',
    units: { s: 'seconds', m: 'minutes', h: 'hours' },
    never: 'These sites never sleep', always: 'These sites always sleep (even with sound)', wlHint: 'one per line, e.g. youtube.com',
    lang: 'Language', theme: 'Theme', system: 'System', light: 'Light', dark: 'Dark',
    social: 'My socials', donate: 'Donate on Ko-fi', reload: 'Reload extension',
    lstInfo: (n, d) => `${n} domains, ${d}`,
    stats: (f, t, d) => `${f} of ${t} GB free · ${d} sleeping tabs`, statsNoMem: (d) => `${d} sleeping tabs`,
    tipsTitle: (b, n) => `Tips for ${b} (${n})`, noTips: 'Everything is already set up well.',
    levels: { tranqui: 'Light', normal: 'Balanced', afondo: 'Intensive', celu: 'Mobile', mano: 'Custom' },
    toggles: {
      discard: ['Sleep tabs', 'Sleep when silent and not playing. Reload when clicked.'],
      cpu: ['Fewer effects', 'Removes shadows, transparency and filters.'],
      motion: ['No animations', 'Removes transitions and movement, including JavaScript ones.'],
      gramOn: ['RAM limiter', 'Puts tabs to sleep before going over the limit below.'],
      gcpuOn: ['CPU limiter', 'Puts tabs to sleep if CPU goes over the limit below.'],
      ghard: ['Hard limit', 'At the limit, also puts tabs with sound or video to sleep.'],
      pip: ['Floating video', 'Button over videos (and Alt+P) to watch them in a small window above other apps.'],
      lazy: ['Lazy loading', 'Images load when seen.'],
      preload: ['Disable page preloading', 'The browser won\'t fetch pages you may never open.'],
      bgvideo: ['Stop background video', 'Pauses muted videos when you switch tabs.'],
      fonts: ['System fonts', 'Doesn\'t download web typefaces.'],
      images: ['No images', 'Pages load text only.'],
      mobile: ['Phone version', 'Asks for the mobile site, usually lighter.'],
      trackers: ['Block ads', 'Cuts ads and trackers, and hides banners.'],
      lists: ['Public ad list', 'Adds thousands of known ad domains (Peter Lowe list). Updates itself every 3 days.'],
      ytads: ['YouTube ads', 'Cuts the ad when the video starts; if it cannot, it plays muted at 2x. YouTube changes often and this can break.'],
      twads: ['Twitch ads', 'Mutes the ad while it lasts and removes the ones on the home page. On channels they cannot be removed at full quality.'],
      tw360: ['Twitch 360p without ads', 'Needs "Twitch ads". Requests every stream at 360p, which comes without ads. Lowers quality on every channel.'],
      vqa: ['YouTube: auto quality', 'Sets the highest quality your screen and network can use (weak network: only as a cap).'],
      vq: ['YouTube 480p max', 'Uses less RAM, GPU and data. Lowers sharpness.'],
    },
  },
};
const GROUPS = { sleep: ['discard'], guard: ['gramOn', 'gcpuOn', 'ghard'], speed: ['pip', 'motion', 'cpu', 'lazy', 'preload', 'bgvideo', 'fonts', 'images', 'mobile', 'vqa', 'vq'], ads: ['trackers', 'lists', 'ytads', 'twads', 'tw360'] };

// Tips: [¿aplica con esta config?, es, en]. Solo aparecen los que todavía no aprovechás.
const COMMON = [
  [(s) => !s.discard, 'Activá "Dormir pestañas" acá: es lo que más memoria libera.', 'Turn on "Sleep tabs" here: it frees the most memory.'],
  [(s) => !s.trackers, 'Activá "Bloquear anuncios": menos red y menos CPU.', 'Turn on "Block ads": less network and CPU.'],
  [(s) => !s.ytads, 'Si mirás mucho YouTube, activá "Anuncios de YouTube".', 'If you watch a lot of YouTube, turn on "YouTube ads".'],
  [(s) => !s.preload, 'Activá "Deshabilitar precarga de páginas": el navegador deja de bajar páginas que no abrís.', 'Turn on "Disable page preloading": the browser stops fetching pages you don\'t open.'],
  [(s) => !s.motion, 'Activá "Sin animaciones": menos CPU y GPU.', 'Turn on "No animations": less CPU and GPU.'],
  [(s) => !s.images, 'Probá "Sin imágenes": las fotos son lo que más pesa en casi toda web.', 'Try "No images": photos are the heaviest part of most pages.'],
  [() => true, 'Cada extensión instalada gasta RAM: dejá solo las que usás.', 'Every installed extension uses RAM: keep only the ones you use.'],
];
const BROWSER_TIPS = {
  chrome: [
    [() => true, 'Ajustes › Sistema: apagá "Seguir ejecutando aplicaciones en segundo plano al cerrar Chrome".', 'Settings › System: turn off "Continue running background apps when Chrome is closed".'],
    [() => true, 'Ajustes › Rendimiento: activá "Ahorro de memoria" (Memory Saver); complementa a "Dormir pestañas" de Hiber.', 'Settings › Performance: turn on "Memory Saver"; it complements Hiber\'s "Sleep tabs".'],
    [() => true, 'Ajustes › Rendimiento (o Privacidad › Cookies): activá "Precargar páginas" (Preload pages) para que navegar se sienta más rápido.', 'Settings › Performance (or Privacy › Cookies): turn on "Preload pages" to make browsing feel faster.'],
    [() => true, 'chrome://flags/#override-cpu-performance-tier: dejalo en "Don\'t override" (no lo fuerces) para que Chrome use el nivel real de tu CPU.', 'chrome://flags/#override-cpu-performance-tier: keep it on "Don\'t override" so Chrome uses your CPU\'s real tier.'],
    [() => true, 'Shift+Esc abre el administrador de tareas de Chrome: ahí ves qué pestaña o extensión pesa.', 'Shift+Esc opens Chrome\'s task manager: see which tab or extension is heavy.'],  ],
  edge: [
    [() => true, 'Configuración › Sistema y rendimiento: desactivá "Aumento de rendimiento de inicio" y "Seguir ejecutando extensiones y aplicaciones en segundo plano".', 'Settings › System and performance: turn off "Startup boost" and "Continue running background extensions and apps".'],
    [(s) => !s.discard, 'En esa misma pantalla activá "Pestañas en suspensión" (o "Dormir pestañas" de Hiber).', 'On that same page turn on "Sleeping tabs" (or Hiber\'s "Sleep tabs").'],
    [() => true, 'Shift+Esc: administrador de tareas del navegador. Apagá la barra lateral y Copilot si no los usás.', 'Shift+Esc: browser task manager. Turn off the sidebar and Copilot if you don\'t use them.'],
  ],
  brave: [
    [(s) => s.trackers, 'Brave Shields ya bloquea anuncios y rastreadores: con Shields en "Agresivo" podés apagar "Bloquear anuncios" acá para no duplicar.', 'Brave Shields already blocks ads and trackers: with Shields on "Aggressive" you can turn off "Block ads" here to avoid doubling up.'],
    [(s) => s.ytads, 'Brave también corta anuncios de YouTube. Si ves algo raro en YouTube, apagá "Anuncios de YouTube" acá.', 'Brave also blocks YouTube ads. If YouTube acts weird, turn off "YouTube ads" here.'],
    [() => true, 'brave://settings: sacá Rewards, News, Talk, Wallet, VPN y Leo de la barra lateral y de la página nueva: menos procesos.', 'brave://settings: remove Rewards, News, Talk, Wallet, VPN and Leo from the sidebar and new tab page: fewer processes.'],
    [(s) => !s.discard, 'brave://settings/system: activá "Ahorro de memoria" (o "Dormir pestañas" de Hiber).', 'brave://settings/system: turn on "Memory Saver" (or Hiber\'s "Sleep tabs").'],
  ],
  opera: [
    [() => true, 'Si usás Opera GX: en GX Control poné un límite de RAM/CPU y activá "Hot Tabs Killer". Hiber lo complementa.', 'If you use Opera GX: in GX Control set a RAM/CPU limit and turn on "Hot Tabs Killer". Hiber complements it.'],
    [(s) => s.trackers, 'Opera trae su propio bloqueador (Ajustes › Bloqueador de anuncios). Con uno solo alcanza: si activás el de Opera, apagá "Bloquear anuncios" acá.', 'Opera has its own blocker (Settings › Ad blocker). One is enough: if you turn Opera\'s on, turn off "Block ads" here.'],
    [() => true, 'Apagá GX Corner, los sonidos/música de fondo, Fast Action Links y la VPN gratis si no los usás.', 'Turn off GX Corner, background sounds/music, Fast Action Links and the free VPN if you don\'t use them.'],
    [() => true, 'Shift+Esc: administrador de tareas del navegador.', 'Shift+Esc: browser task manager.'],
  ],
  firefox: [
    [() => true, 'about:processes es el administrador de tareas de Firefox: ahí ves qué pestaña pesa.', 'about:processes is Firefox\'s task manager: see which tab is heavy.'],
    [() => true, 'about:preferences#general › Rendimiento: desmarcá "Usar la configuración de rendimiento recomendada" y bajá el límite de procesos de contenido.', 'about:preferences#general › Performance: untick "Use recommended performance settings" and lower the content process limit.'],
    [(s) => s.trackers, 'about:preferences#privacy: la Protección antirrastreo "Estricta" complementa a Hiber.', 'about:preferences#privacy: "Strict" Enhanced Tracking Protection complements Hiber.'],
    [() => true, 'Firefox no deja abrir sus ajustes desde una extensión: andá a esas direcciones a mano.', 'Firefox won\'t let extensions open its settings: visit those addresses yourself.'],
  ],
};

const $ = (id) => document.getElementById(id);
const U = { s: 1, m: 60, h: 3600 };
let s, L, browser = 'chrome', lstN = 0, lstT = 0;
const BROWSER_NAME = { chrome: 'Chrome / Chromium', edge: 'Edge', brave: 'Brave', opera: 'Opera / Opera GX', firefox: 'Firefox' };

const save = () => chrome.storage.local.set({ s });
const current = () => Object.keys(P).find((l) => Object.keys(P[l]).every((k) => P[l][k] === s[k])) || 'mano';
const pickLang = () => (s.lang === 'system' ? (chrome.i18n.getUILanguage().startsWith('es') ? 'es' : 'en') : s.lang);
const unitFor = (secs) => (secs % 3600 === 0 ? 'h' : secs % 60 === 0 ? 'm' : 's');
const lines = (v) => v.split('\n').map((x) => x.trim()).filter(Boolean);

async function detect() {
  const ua = navigator.userAgent;
  if (/Firefox\//.test(ua)) return 'firefox';
  if (/OPR\//.test(ua)) return 'opera';
  if (/Edg\//.test(ua)) return 'edge';
  if (await navigator.brave?.isBrave?.().catch(() => false)) return 'brave';
  return 'chrome';
}

function opts(sel, items, val) {
  $(sel).innerHTML = items.map(([v, t]) => `<option value="${v}" ${v === val ? 'selected' : ''}>${t}</option>`).join('');
}

function render() {
  const lang = pickLang();
  L = TXT[lang];
  document.documentElement.lang = lang;
  if (s.theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = s.theme;

  document.querySelectorAll('[data-t]').forEach((e) => { e.textContent = L[e.dataset.t]; });
  $('reload').onclick = (e) => { e.preventDefault(); chrome.runtime.reload(); };
  document.querySelectorAll('[data-ph]').forEach((e) => { e.placeholder = L[e.dataset.ph]; });
  const cur = current();
  $('levels').innerHTML = Object.entries(L.levels)
    .map(([k, t]) => `<button data-l="${k}" class="${k === cur ? 'on' : ''}">${t}</button>`).join('');
  for (const [g, keys] of Object.entries(GROUPS)) {
    $('g_' + g).innerHTML = keys.map((k) => { const [t, d0] = L.toggles[k], d = k === 'lists' && lstN ? `${d0} (${L.lstInfo(lstN, new Date(lstT).toLocaleDateString())})` : d0;
      return `<label class="row"><span><b>${t}</b><small>${d}</small></span><input type="checkbox" data-k="${k}" ${s[k] ? 'checked' : ''}></label>`; }).join('');
  }
  $('on').checked = s.on;
  $('gram').value = s.gram; $('gcpu').value = s.gcpu; $('gramv').textContent = s.gram + ' GB'; $('gcpuv').textContent = s.gcpu + '%';
  $('mins').value = +(s.secs / U[s.unit]).toFixed(2);
  opts('unit', Object.entries(L.units), s.unit);
  $('wl').value = s.whitelist.join('\n');
  $('sl').value = s.sleepList.join('\n');
  opts('lang', [['system', L.system], ['es', 'Español'], ['en', 'English']], s.lang);
  opts('theme', [['system', L.system], ['light', L.light], ['dark', L.dark]], s.theme);
  tips(lang === 'es' ? 1 : 2);
  stats();
}

function tips(i) {
  const list = [...(BROWSER_TIPS[browser] || []), ...COMMON].filter(([c]) => c(s)).map((t) => t[i]);
  $('tipsHead').textContent = L.tipsTitle(BROWSER_NAME[browser], list.length);
  $('tipsBody').innerHTML = list.length ? list.map((t) => `<p>${t}</p>`).join('') : `<p>${L.noTips}</p>`;
}

async function stats() {
  const d = (await chrome.tabs.query({ discarded: true })).length;
  try {
    const m = await chrome.system.memory.getInfo();
    const gb = (b) => (b / 2 ** 30).toFixed(1);
    $('stats').textContent = L.stats(gb(m.availableCapacity), gb(m.capacity), d);
    $('gram').max = Math.max(2, Math.floor(m.capacity / 2 ** 30)); $('gram').value = s.gram; // como Opera GX: el slider llega hasta la RAM del equipo
  } catch { $('stats').textContent = L.statsNoMem(d); } // Firefox no tiene system.memory
}

$('levels').onclick = (e) => {
  const l = e.target.dataset.l;
  if (!l) return;
  if (P[l]) { Object.assign(s, P[l]); s.unit = unitFor(s.secs); }
  save(); render();
};
document.body.onchange = (e) => { const k = e.target.dataset.k; if (k) { s[k] = e.target.checked; save(); render(); } };
$('on').onchange = (e) => { s.on = e.target.checked; save(); };
const setTime = () => {
  const v = parseFloat($('mins').value);
  s.unit = $('unit').value;
  s.secs = Math.max(10, Math.round((v > 0 ? v : 1) * U[s.unit]));
  save(); render();
};
$('mins').onchange = $('unit').onchange = setTime;
$('gram').onchange = (e) => { s.gram = Math.max(1, parseFloat(e.target.value) || D.gram); save(); render(); };
$('gcpu').onchange = (e) => { s.gcpu = Math.min(100, Math.max(1, Math.round(parseFloat(e.target.value)) || D.gcpu)); save(); render(); };
$('gram').oninput = (e) => { $('gramv').textContent = e.target.value + ' GB'; };
$('gcpu').oninput = (e) => { $('gcpuv').textContent = e.target.value + '%'; };
$('wl').onchange = (e) => { s.whitelist = lines(e.target.value); save(); };
$('sl').onchange = (e) => { s.sleepList = lines(e.target.value); save(); };
$('lang').onchange = (e) => { s.lang = e.target.value; save(); render(); };
$('theme').onchange = (e) => { s.theme = e.target.value; save(); render(); };

Promise.all([chrome.storage.local.get(['s', 'upd', 'lstN', 'lstT']), detect()]).then(([r, b]) => {
  browser = b;
  lstN = r.lstN || 0; lstT = r.lstT || 0;
  s = { ...D, ...r.s };
  render();
  if (r.upd && newer(r.upd, chrome.runtime.getManifest().version)) {
    $('upd').textContent = L.upd(r.upd);
    $('upd').href = `https://github.com/${REPO}/releases/latest`;
    $('upd').hidden = false;
  }
});

// Si el limitador se apaga solo (guard en background), el popup abierto no debe volver a escribir los valores viejos.
chrome.storage.onChanged.addListener((c) => { if (c.s && s) { s = { ...D, ...c.s.newValue }; render(); } });
