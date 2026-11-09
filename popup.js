const TXT = {
  es: {
    upd: (v) => `Hay una versión nueva (${v}). Descargala acá`,
    active: 'activa', tag: 'Duerme lo que no usás y recorta lo que pesa.',
    gSleep: 'Dormir pestañas', gSpeed: 'Rendimiento', gAds: 'Anuncios', gSites: 'Sitios',
    sleepAfter: 'Dormir tras', timeHint: 'Elegí el tiempo que quieras (mínimo 10 segundos). Se revisa cada ~30 s.',
    units: { s: 'segundos', m: 'minutos', h: 'horas' },
    never: 'Estos sitios nunca se duermen', always: 'Estos sitios siempre se duermen (aunque suenen)', wlHint: 'uno por línea, ej: youtube.com',
    lang: 'Idioma', theme: 'Tema', system: 'Sistema', light: 'Claro', dark: 'Oscuro',
    social: 'Mis redes', donate: 'Donar en Ko-fi',
    sweep: 'Dormir las demás ahora', sweeping: 'Durmiendo…', swept: (n) => `Listo, ${n} a dormir`, none: 'No había nada para dormir',
    stats: (f, t, d) => `${f} de ${t} GB libres · ${d} pestañas dormidas`, statsNoMem: (d) => `${d} pestañas dormidas`,
    tipsTitle: (b, n) => `Tips para ${b} (${n})`, noTips: 'Ya tenés todo bien configurado.',
    levels: { tranqui: 'Tranqui', normal: 'Normal', afondo: 'A fondo', celu: 'Celu', mano: 'A mano' },
    toggles: {
      discard: ['Dormir pestañas', 'Se duermen si no suenan ni reproducen. Recargan al hacerles clic.'],
      cpu: ['Menos efectos', 'Saca sombras, transparencias y filtros.'],
      motion: ['Sin animaciones', 'Elimina transiciones y movimiento, también los hechos con JavaScript.'],
      lazy: ['Carga diferida', 'Las imágenes cargan al verlas.'],
      preload: ['Deshabilitar precarga de páginas', 'El navegador no baja páginas que quizá nunca abrís.'],
      bgvideo: ['Frenar videos de fondo', 'Pausa los videos mudos si cambiás de pestaña.'],
      fonts: ['Fuentes del sistema', 'No descarga tipografías de las webs.'],
      images: ['Sin imágenes', 'Las páginas cargan solo texto.'],
      mobile: ['Versión celu', 'Pide la web móvil, que suele ser más liviana.'],
      trackers: ['Bloquear anuncios', 'Corta publicidad y rastreadores, y oculta banners.'],
      ytads: ['Anuncios de YouTube', 'Los saca o los salta al instante. YouTube cambia seguido y puede fallar.'],
      vq: ['YouTube a 480p máx.', 'Usa menos RAM, GPU y datos. Baja la nitidez.'],
    },
  },
  en: {
    upd: (v) => `New version available (${v}). Download it here`,
    active: 'on', tag: 'Sleeps what you don\'t use and trims what\'s heavy.',
    gSleep: 'Sleep tabs', gSpeed: 'Performance', gAds: 'Ads', gSites: 'Sites',
    sleepAfter: 'Sleep after', timeHint: 'Pick any time you like (10 seconds minimum). Checked every ~30 s.',
    units: { s: 'seconds', m: 'minutes', h: 'hours' },
    never: 'These sites never sleep', always: 'These sites always sleep (even with sound)', wlHint: 'one per line, e.g. youtube.com',
    lang: 'Language', theme: 'Theme', system: 'System', light: 'Light', dark: 'Dark',
    social: 'My socials', donate: 'Donate on Ko-fi',
    sweep: 'Sleep the others now', sweeping: 'Sleeping…', swept: (n) => `Done, ${n} put to sleep`, none: 'Nothing to sleep',
    stats: (f, t, d) => `${f} of ${t} GB free · ${d} sleeping tabs`, statsNoMem: (d) => `${d} sleeping tabs`,
    tipsTitle: (b, n) => `Tips for ${b} (${n})`, noTips: 'Everything is already set up well.',
    levels: { tranqui: 'Chill', normal: 'Normal', afondo: 'Full', celu: 'Phone', mano: 'Custom' },
    toggles: {
      discard: ['Sleep tabs', 'Sleep when silent and not playing. Reload when clicked.'],
      cpu: ['Fewer effects', 'Removes shadows, transparency and filters.'],
      motion: ['No animations', 'Removes transitions and movement, including JavaScript ones.'],
      lazy: ['Lazy loading', 'Images load when seen.'],
      preload: ['Disable page preloading', 'The browser won\'t fetch pages you may never open.'],
      bgvideo: ['Stop background video', 'Pauses muted videos when you switch tabs.'],
      fonts: ['System fonts', 'Doesn\'t download web typefaces.'],
      images: ['No images', 'Pages load text only.'],
      mobile: ['Phone version', 'Asks for the mobile site, usually lighter.'],
      trackers: ['Block ads', 'Cuts ads and trackers, and hides banners.'],
      ytads: ['YouTube ads', 'Removes them or skips them instantly. YouTube changes often and this can break.'],
      vq: ['YouTube 480p max', 'Uses less RAM, GPU and data. Lowers sharpness.'],
    },
  },
};
const GROUPS = { sleep: ['discard'], speed: ['motion', 'cpu', 'lazy', 'preload', 'bgvideo', 'fonts', 'images', 'mobile', 'vq'], ads: ['trackers', 'ytads'] };

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
let s, L, browser = 'chrome';
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
  document.querySelectorAll('[data-ph]').forEach((e) => { e.placeholder = L[e.dataset.ph]; });
  const cur = current();
  $('levels').innerHTML = Object.entries(L.levels)
    .map(([k, t]) => `<button data-l="${k}" class="${k === cur ? 'on' : ''}">${t}</button>`).join('');
  for (const [g, keys] of Object.entries(GROUPS)) {
    $('g_' + g).innerHTML = keys.map((k) => { const [t, d] = L.toggles[k];
      return `<label class="row"><span><b>${t}</b><small>${d}</small></span><input type="checkbox" data-k="${k}" ${s[k] ? 'checked' : ''}></label>`; }).join('');
  }
  $('on').checked = s.on;
  $('mins').value = +(s.secs / U[s.unit]).toFixed(2);
  opts('unit', Object.entries(L.units), s.unit);
  $('wl').value = s.whitelist.join('\n');
  $('sl').value = s.sleepList.join('\n');
  opts('lang', [['system', L.system], ['es', 'Español'], ['en', 'English']], s.lang);
  opts('theme', [['system', L.system], ['light', L.light], ['dark', L.dark]], s.theme);
  $('sweep').textContent = L.sweep;
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
$('wl').onchange = (e) => { s.whitelist = lines(e.target.value); save(); };
$('sl').onchange = (e) => { s.sleepList = lines(e.target.value); save(); };
$('lang').onchange = (e) => { s.lang = e.target.value; save(); render(); };
$('theme').onchange = (e) => { s.theme = e.target.value; save(); render(); };
$('sweep').onclick = async () => {
  $('sweep').textContent = L.sweeping;
  const n = await chrome.runtime.sendMessage('sweep');
  $('sweep').textContent = n ? L.swept(n) : L.none;
  stats();
};

Promise.all([chrome.storage.local.get(['s', 'upd']), detect()]).then(([r, b]) => {
  browser = b;
  s = { ...D, ...r.s };
  render();
  if (r.upd && newer(r.upd, chrome.runtime.getManifest().version)) {
    $('upd').textContent = L.upd(r.upd);
    $('upd').href = `https://github.com/${REPO}/releases/latest`;
    $('upd').hidden = false;
  }
});
