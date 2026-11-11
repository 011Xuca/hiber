if (typeof importScripts === 'function') importScripts('defaults.js'); // Firefox lo carga desde el manifest

const TRACKERS = ['subduepaler.cyou', 'agl003.com', 'slunkenfulgora.click', 'doubleclick.net', 'googlesyndication.com', 'google-analytics.com', 'googletagservices.com',
  'adservice.google.com', 'connect.facebook.net', 'hotjar.com', 'scorecardresearch.com', 'taboola.com',
  'outbrain.com', 'adnxs.com', 'criteo.com', 'quantserve.com', 'amazon-adsystem.com', 'mixpanel.com', 'clarity.ms',
  'adsrvr.org', 'pubmatic.com', 'rubiconproject.com', 'openx.net', 'casalemedia.com', 'moatads.com', '2mdn.net',
  'mathtag.com', 'bat.bing.com', 'ads.twitter.com', 'analytics.tiktok.com', 'snap.licdn.com', 'segment.io',
  'fullstory.com', 'krxd.net', 'bluekai.com', 'demdex.net', 'smartadserver.com', 'yieldmo.com', 'adform.net', 'advertising.com',
  'adcolony.com', 'applovin.com', 'bidswitch.net', 'contextweb.com', 'lijit.com', 'media.net', 'revcontent.com',
  'sharethrough.com', 'sovrn.com', 'teads.tv', 'triplelift.com', 'zedo.com', 'adroll.com', 'crazyegg.com', 'mouseflow.com',
  'heapanalytics.com', 'popads.net', 'propellerads.com', 'exoclick.com', 'juicyads.com', 'trafficjunky.net', 'adsterra.com', '073m.com',
  'popcash.net', 'clickadu.com', 'hilltopads.net', 'adcash.com', 'monetag.com', 'propu.sh', 'onclickads.net', 'bidvertiser.com',
  'adskeeper.com', 'mgid.com', 'tsyndicate.com', 'realsrv.com', 'a-ads.com', 'richads.com', 'ero-advertising.com',
  'effectivegatecpm.com', 'profitableratecpm.com', 'highperformanceformat.com', 'dolohen.com', 'acscdn.com', 'adsco.re', 'cdn4ads.com', 'trafficstars.com', 'popunder.net', 'ay267.com', 'painamour.com', 'catrck.net', 'histats.com', 'exosrv.com', 'magsrv.com', 'pemsrv.com', 'galaksion.com', 'evadav.com', 'clickaine.com', 'adspyglass.com', 'popmyads.com'];
const POPUNDER = ['catrck.net', 'exosrv.com', 'magsrv.com', 'popmyads.com', 'clickaine.com', '073m.com', 'ay267.com', 'painamour.com', 'popads.net', 'propellerads.com', 'popcash.net', 'clickadu.com', 'hilltopads.net', 'onclickads.net', 'popunder.net', 'propu.sh', 'realsrv.com', 'exoclick.com', 'juicyads.com'];
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const RULE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Rutas típicas de anuncios (complementa la lista de dominios).
// Sin "/ads/" genérico ni xhr/other: cortaban manifiestos y APIs de reproductores (el video no cargaba hasta recargar).
const AD_PATH = '^https?://[^/]+/.*(/pagead/|/adserver/|/adframe|/banner[_-]?ads?/|/doubleclick/)';

const get = async () => ({ ...D, ...(await chrome.storage.local.get('s')).s });

// Lista pública de anuncios (Peter Lowe, formato hosts): solo datos, nunca código. Se baja cada ~3 días y se vuelve reglas de bloqueo.
const LIST_URL = 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext';
const LIST_MAX = 20000, LIST_CHUNK = 1000, LIST_MIN = 100, LIST_DAYS = 3;
const LIST_IDS = Array.from({ length: 100 }, (_, i) => 1000 + i); // aparte de RULE_IDS
// Nunca se bloquean (ni ellos, ni sus subdominios, ni un dominio "padre"): aunque la lista venga mal, no rompe sitios grandes, CDNs, logins, pagos ni reproductores.
const SAFE = ['youtube.com', 'youtube-nocookie.com', 'ytimg.com', 'googlevideo.com', 'google.com', 'gstatic.com', 'googleapis.com',
  'googleusercontent.com', 'recaptcha.net', 'hcaptcha.com', 'facebook.com', 'fbcdn.net', 'instagram.com', 'whatsapp.com', 'twitter.com',
  'x.com', 'twimg.com', 'microsoft.com', 'microsoftonline.com', 'live.com', 'apple.com', 'icloud.com', 'github.com', 'githubusercontent.com',
  'cloudflare.com', 'jsdelivr.net', 'unpkg.com', 'amazonaws.com', 'cloudfront.net', 'akamaihd.net', 'akamaized.net', 'fastly.net',
  'amazon.com', 'paypal.com', 'stripe.com', 'mercadopago.com', 'mercadolibre.com', 'wikipedia.org', 'jquery.com', 'bootstrapcdn.com',
  'discord.com', 'reddit.com', 'twitch.tv', 'vimeo.com', 'spotify.com', 'netflix.com', 'linkedin.com', 'yahoo.com', 'bing.com',
  'jwplayer.com', 'jwpcdn.com', 'zencdn.net', 'mega.nz', 'mega.io'];
const isSafe = (d) => SAFE.some((x) => d === x || d.endsWith('.' + x) || x.endsWith('.' + d));
const parseList = (txt) => {
  const out = new Set();
  for (const line of String(txt).split('\n')) {
    const p = line.replace(/#.*/, '').trim().toLowerCase().split(/\s+/);
    const d = (p.length > 1 ? p[1] : p[0]).replace(/\.$/, '');
    if (!d || d.length > 253 || !/^[a-z0-9.-]+$/.test(d) || !d.includes('.') || /^[0-9.]+$/.test(d)
      || d.startsWith('.') || d.startsWith('-') || d.includes('..') || /^localhost(\.|$)/.test(d) || isSafe(d)) continue;
    out.add(d);
    if (out.size >= LIST_MAX) break;
  }
  return [...out];
};
const chunks = (a) => Array.from({ length: Math.ceil(a.length / LIST_CHUNK) }, (_, i) => a.slice(i * LIST_CHUNK, (i + 1) * LIST_CHUNK));
// Mismos tipos que la regla 1: sin main_frame, media ni font, así páginas, videos y reproductores nunca se cortan.
const listRules = (doms) => chunks(doms).map((c, i) => ({ id: LIST_IDS[i], action: { type: 'block' },
  condition: { requestDomains: c, resourceTypes: ['script', 'image', 'xmlhttprequest', 'sub_frame', 'ping', 'other'] } }));
// Si falla la descarga o viene rara (página de error, casi vacía), queda la lista anterior.
let listBusy = false; // una descarga a la vez (al instalar la piden start y applyRules juntos)
async function refreshList(force) {
  if (listBusy) return;
  listBusy = true;
  try {
    const s = await get(), { lstT = 0 } = await chrome.storage.local.get('lstT');
    if (!s.on || !s.lists || (!force && Date.now() - lstT < LIST_DAYS * 864e5)) return;
    const r = await fetch(LIST_URL, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const lst = parseList(await r.text());
    if (lst.length < LIST_MIN) throw new Error('lista vacía o rara: ' + lst.length);
    await chrome.storage.local.set({ lst, lstN: lst.length, lstT: Date.now() });
    applyRules();
  } catch (e) { console.warn('Hiber: no se pudo actualizar la lista de anuncios', e); } finally { listBusy = false; }
}

// En fila: dos cambios seguidos no se pisan (quitar/agregar de uno mezclado con el otro).
let rulesQ = Promise.resolve();
const applyRules = () => (rulesQ = rulesQ.then(applyRulesNow, applyRulesNow));
async function applyRulesNow() {
  const s = await get();
  const add = [];
  if (s.on) {
    if (s.trackers) add.push({ id: 1, action: { type: 'block' },
      condition: { requestDomains: TRACKERS, resourceTypes: ['script', 'image', 'xmlhttprequest', 'sub_frame', 'ping', 'other'] } });
    // YouTube detecta bloqueadores si ad_status.js no carga y pausa el video: se le devuelve un archivo falso (prioridad 2: gana a la regla de bloqueo).
    if (s.trackers) add.push({ id: 9, priority: 2, action: { type: 'redirect', redirect: { extensionPath: '/ad_status.js' } },
      condition: { urlFilter: '||static.doubleclick.net/instream/ad_status.js', resourceTypes: ['script'] } });
    // YouTube pide este ID de Google al cargar y, si falla, lo anota como bloqueador: se deja pasar solo desde YouTube (gana a la lista).
    if (s.trackers) add.push({ id: 10, priority: 3, action: { type: 'allow' },
      condition: { urlFilter: '||googleads.g.doubleclick.net/pagead/id', initiatorDomains: ['youtube.com'], resourceTypes: ['xmlhttprequest'] } });
    if (s.trackers) add.push({ id: 5, action: { type: 'block' },
      condition: { regexFilter: AD_PATH, resourceTypes: ['script', 'image', 'sub_frame'] } });
    // Pop-unders: la pestaña que abre el anuncio ni llega a cargar (firma afu.php?zoneid= de Monetag/Propeller, dominios que rotan).
    if (s.trackers) add.push({ id: 6, action: { type: 'block' },
      condition: { regexFilter: '^https?://[^/]+/afu[.]php[?].*zoneid=', resourceTypes: ['main_frame', 'sub_frame', 'script'] } });
    if (s.trackers) add.push({ id: 7, action: { type: 'block' },
      condition: { requestDomains: POPUNDER, resourceTypes: ['main_frame'] } });
    // Afiliados de apuestas (refpa1234.com, rotan de número): ni se cargan como página.
    if (s.trackers) add.push({ id: 8, action: { type: 'block' },
      condition: { regexFilter: '^https?://([^/]*[.])?refpa[0-9]+[.][a-z]+/', resourceTypes: ['main_frame', 'sub_frame'] } });
    if (s.fonts) add.push({ id: 2, action: { type: 'block' }, condition: { resourceTypes: ['font'] } });
    if (s.images) add.push({ id: 3, action: { type: 'block' }, condition: { resourceTypes: ['image'] } });
    if (s.mobile) add.push({ id: 4, action: { type: 'modifyHeaders', requestHeaders: [
      { header: 'user-agent', operation: 'set', value: MOBILE_UA },
      { header: 'sec-ch-ua-mobile', operation: 'set', value: '?1' }] },
      condition: { resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'] } });
  }
  // De a una: updateDynamicRules es todo o nada, y una regla rechazada (p. ej. un regex que este navegador no acepta) apagaba todas.
  const dnr = chrome.declarativeNetRequest;
  await dnr.updateDynamicRules({ removeRuleIds: RULE_IDS }).catch((e) => console.warn('Hiber: no se pudieron quitar reglas', e));
  for (const r of add) await dnr.updateDynamicRules({ addRules: [r] }).catch((e) => console.warn('Hiber: regla rechazada', r.id, e));
  // Lista pública: después de las reglas propias, así si el navegador pone un tope más bajo (Firefox) las propias ya están.
  await dnr.updateDynamicRules({ removeRuleIds: LIST_IDS }).catch((e) => console.warn('Hiber: no se pudo quitar la lista', e));
  if (s.on && s.lists) {
    const { lst } = await chrome.storage.local.get('lst');
    if (!lst?.length) refreshList(true); // sin await: refreshList vuelve a pedir applyRules y esperaría a esta misma fila
    for (const r of listRules(lst || [])) {
      const ok = await dnr.updateDynamicRules({ addRules: [r] }).then(() => true, (e) => console.warn('Hiber: tope de reglas, lista recortada', r.id, e));
      if (!ok) break;
    }
  }
  // Sin precarga/predicción de red de Chrome (ahorra datos y CPU).
  try {
    const np = chrome.privacy.network.networkPredictionEnabled;
    await (s.on && s.preload ? np.set({ value: false }) : np.clear({}));
  } catch { /* este navegador no deja tocarlo */ }
}

// force=true: ignora el tiempo de inactividad (botón "dormir ahora").
// Se duerme si no suena ni reproduce. "Nunca" gana; "siempre" duerme aunque suene. Formularios sin guardar: nunca.
async function sweep(force, idle, all) {
  const s = await get();
  if (!s.on || (!s.discard && !force && idle == null)) return 0;
  const tabs = await chrome.tabs.query({ active: false, discarded: false, pinned: false, url: ['http://*/*', 'https://*/*'] });
  const has = (list, t) => list.some((h) => t.url.includes(h));
  let n = 0;
  for (const t of tabs) {
    if (!force && Date.now() - t.lastAccessed < (idle ?? s.secs) * 1000) continue;
    if (has(s.whitelist, t)) continue;
    const must = has(s.sleepList, t);
    if (!must && !all && (t.audible || !t.autoDiscardable)) continue;
    const r = await chrome.tabs.sendMessage(t.id, 'dirty').catch(() => ({})); // pestañas abiertas antes de cargar la extensión no tienen content script: se duermen igual
    if (r?.dirty || (!must && !all && r?.playing)) continue;
    try { await chrome.tabs.discard(t.id); n++; } catch { /* ya dormida o cerrada */ }
  }
  return n;
}

// Chrome no deja auto-instalar una extensión fuera del Store: solo avisamos que hay versión nueva.
async function checkUpdate() {
  if (REPO.startsWith('USUARIO')) return;
  try {
    const v = (await (await fetch(`https://raw.githubusercontent.com/${REPO}/main/version.txt`, { cache: 'no-store' })).text()).trim();
    await chrome.storage.local.set({ upd: v });
    const old = newer(v, chrome.runtime.getManifest().version);
    chrome.action.setBadgeText({ text: old ? '!' : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#d93025' }); // rojo: hay una versión nueva pendiente
    chrome.action.setTitle({ title: old ? `Hiber: actualización pendiente (${v}). Descargala y recargá la extensión.` : 'Hiber' });
  } catch { /* sin red: se reintenta en el próximo ciclo */ }
}

const start = () => {
  chrome.alarms.create('sweep', { periodInMinutes: 0.5 });
  chrome.alarms.create('guard', { periodInMinutes: 0.5 });
  chrome.alarms.create('update', { periodInMinutes: 720 });
  chrome.alarms.create('lists', { periodInMinutes: 720 }); // solo baja la lista si tiene más de 3 días
  applyRules();
  checkUpdate();
  refreshList(false);
};
chrome.runtime.onInstalled.addListener(start);
chrome.runtime.setUninstallURL('https://011xuca.github.io/links/');
chrome.runtime.onStartup.addListener(start);
chrome.alarms.onAlarm.addListener((a) => (a.name === 'sweep' ? sweep(false) : a.name === 'guard' ? guard() : a.name === 'lists' ? refreshList(false) : checkUpdate()));
chrome.storage.onChanged.addListener((c) => c.s && applyRules());
chrome.runtime.onMessage.addListener((m, _, reply) => {
  if (m === 'sweep') { sweep(true).then(reply); return true; }
});

// Pestañas de pop-up: si una pestaña abierta por otra página va a un dominio de pop-unders, se cierra sola (la red ya la bloquea, pero quedaba la pestaña vacía).
const isPop = (u) => { try { const x = new URL(u); return POPUNDER.some((d) => x.hostname === d || x.hostname.endsWith('.' + d)) || /^refpa[0-9]+[.]/.test(x.hostname) || /\/afu\.php\?.*zoneid=/.test(x.pathname + x.search); } catch { return false; } };
const closePop = async (t, u) => {
  if (t.openerTabId == null || !isPop(u)) return; // solo pestañas que abrió una página, nunca una que escribiste vos
  const s = await get();
  if (s.on && s.trackers) chrome.tabs.remove(t.id).catch(() => {});
};
chrome.tabs.onCreated.addListener((t) => closePop(t, t.pendingUrl || t.url));
chrome.tabs.onUpdated.addListener((id, c, t) => { if (c.url) closePop(t, c.url); });

// Video flotante: Alt+P abre/cierra la ventana flotante del video más grande de la pestaña (la abre content.js).
chrome.commands.onCommand.addListener(async (c) => {
  if (c !== 'pip' || !(await get()).pip) return;
  const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (t) chrome.tabs.sendMessage(t.id, 'pip').catch(() => {});
});

// Limitador estilo Opera GX. Una extensión no puede topar el navegador, así que lo compensa:
// - RAM: estima la de las pestañas (heap JS x2, Chrome) y, al 80% del tope, duerme las inactivas hace +1 min; al 100%, todas las inactivas.
// - CPU: uso de todo el equipo; si pasa el tope 2 chequeos seguidos (1 min), duerme pestañas.
// - Si lo ajustado es imposible (4 disparos en 10 min) o el navegador estuvo colgado (chequeo muy tarde con CPU al tope), se desactiva solo y avisa.
const notify = (message) => chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon-128.png', title: 'Hiber', message });
async function guard() {
  const s = await get();
  const now = Date.now();
  const { gt = 0, gh = [], gc = 0, gn = 0 } = await chrome.storage.session.get(['gt', 'gh', 'gc', 'gn']);
  await chrome.storage.session.set({ gt: now }); // se marca siempre: así una pausa larga (notebook suspendida) no parece un cuelgue
  if (!s.on || !(s.gramOn || s.gcpuOn)) return;
  let cpu = 0, heap = 0;
  try { // CPU = diferencia entre dos muestras de tiempos acumulados
    const t = (await chrome.system.cpu.getInfo()).processors.reduce((a, p) => ({ u: a.u + p.usage.total - p.usage.idle, t: a.t + p.usage.total }), { u: 0, t: 0 });
    const { g } = await chrome.storage.session.get('g');
    if (g && t.t > g.t) cpu = ((t.u - g.u) / (t.t - g.t)) * 100;
    await chrome.storage.session.set({ g: t });
  } catch { /* sin API de CPU: solo RAM */ }
  const reset = async (why) => {
    await chrome.storage.session.set({ gh: [], gc: 0 });
    await chrome.storage.local.set({ s: { ...s, gramOn: false, gcpuOn: false, gram: D.gram, gcpu: D.gcpu } });
    notify(why);
  };
  if (gt && now - gt > 120000 && now - gt < 900000 && s.gcpuOn && gc >= 1 && cpu >= s.gcpu) return reset('El navegador se colgó con el limitador activo: lo desactivé y volví los límites a los de fábrica.');
  const tabs = await chrome.tabs.query({ discarded: false, url: ['http://*/*', 'https://*/*'] });
  if (s.gramOn) for (const t of tabs) if (!t.frozen) heap += (await chrome.tabs.sendMessage(t.id, 'mem').catch(() => 0)) || 0;
  const gb = (heap * 2) / 2 ** 30; // shortcut: x2 aproxima el overhead del renderer, sin chrome.processes (solo Chrome dev); subir si queda corto
  const hard = s.gramOn && gb >= s.gram, soft = s.gramOn && gb >= s.gram * 0.8;
  const hot = s.gcpuOn && cpu >= s.gcpu;
  await chrome.storage.session.set({ gc: hot ? gc + 1 : 0 });
  if (!hard && !(hot && gc >= 1)) { if (soft) await sweep(false, 60); return; }
  const hits = [...gh.filter((x) => now - x < 600000), now];
  await chrome.storage.session.set({ gh: hits, gc: 0 }); // tras disparar hacen falta 2 chequeos calientes nuevos
  if (hits.length >= 4) return reset('Los límites son demasiado bajos (se disparaban sin parar): desactivé el limitador. Subilos y volvé a activarlo.');
  const n = await sweep(true, 0, s.ghard); // límite estricto: duerme también las pestañas con sonido o video
  if (now - gn > 300000) {
    await chrome.storage.session.set({ gn: now });
    notify(`${hard ? 'RAM ~' + gb.toFixed(1) + ' GB' : 'CPU ' + Math.round(cpu) + '%'}: ${n} pestañas dormidas.`);
  }
}
