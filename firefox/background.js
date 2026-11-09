if (typeof importScripts === 'function') importScripts('defaults.js'); // Firefox lo carga desde el manifest

const TRACKERS = ['doubleclick.net', 'googlesyndication.com', 'google-analytics.com', 'googletagservices.com',
  'adservice.google.com', 'connect.facebook.net', 'hotjar.com', 'scorecardresearch.com', 'taboola.com',
  'outbrain.com', 'adnxs.com', 'criteo.com', 'quantserve.com', 'amazon-adsystem.com', 'mixpanel.com', 'clarity.ms',
  'adsrvr.org', 'pubmatic.com', 'rubiconproject.com', 'openx.net', 'casalemedia.com', 'moatads.com', '2mdn.net',
  'mathtag.com', 'bat.bing.com', 'ads.twitter.com', 'analytics.tiktok.com', 'snap.licdn.com', 'segment.io',
  'fullstory.com', 'krxd.net', 'bluekai.com', 'demdex.net', 'smartadserver.com', 'yieldmo.com', 'adform.net', 'advertising.com',
  'adcolony.com', 'applovin.com', 'bidswitch.net', 'contextweb.com', 'lijit.com', 'media.net', 'revcontent.com',
  'sharethrough.com', 'sovrn.com', 'teads.tv', 'triplelift.com', 'zedo.com', 'adroll.com', 'crazyegg.com', 'mouseflow.com',
  'heapanalytics.com', 'popads.net', 'propellerads.com', 'exoclick.com', 'juicyads.com', 'trafficjunky.net', 'adsterra.com'];
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const RULE_IDS = [1, 2, 3, 4, 5];
// Rutas típicas de anuncios (complementa la lista de dominios).
// Sin "/ads/" genérico ni xhr/other: cortaban manifiestos y APIs de reproductores (el video no cargaba hasta recargar).
const AD_PATH = '^https?://[^/]+/.*(/pagead/|/adserver/|/adframe|/banner[_-]?ads?/|/doubleclick/)';

const get = async () => ({ ...D, ...(await chrome.storage.local.get('s')).s });

async function applyRules() {
  const s = await get();
  const add = [];
  if (s.on) {
    if (s.trackers) add.push({ id: 1, action: { type: 'block' },
      condition: { requestDomains: TRACKERS, resourceTypes: ['script', 'image', 'xmlhttprequest', 'sub_frame', 'ping', 'other'] } });
    if (s.trackers) add.push({ id: 5, action: { type: 'block' },
      condition: { regexFilter: AD_PATH, resourceTypes: ['script', 'image', 'sub_frame'] } });
    if (s.fonts) add.push({ id: 2, action: { type: 'block' }, condition: { resourceTypes: ['font'] } });
    if (s.images) add.push({ id: 3, action: { type: 'block' }, condition: { resourceTypes: ['image'] } });
    if (s.mobile) add.push({ id: 4, action: { type: 'modifyHeaders', requestHeaders: [
      { header: 'user-agent', operation: 'set', value: MOBILE_UA },
      { header: 'sec-ch-ua-mobile', operation: 'set', value: '?1' }] },
      condition: { resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'] } });
  }
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: RULE_IDS, addRules: add });
  // Sin precarga/predicción de red de Chrome (ahorra datos y CPU).
  try {
    const np = chrome.privacy.network.networkPredictionEnabled;
    await (s.on && s.preload ? np.set({ value: false }) : np.clear({}));
  } catch { /* este navegador no deja tocarlo */ }
}

// force=true: ignora el tiempo de inactividad (botón "dormir ahora").
// Se duerme si no suena ni reproduce. "Nunca" gana; "siempre" duerme aunque suene. Formularios sin guardar: nunca.
async function sweep(force) {
  const s = await get();
  if (!s.on || (!s.discard && !force)) return 0;
  const tabs = await chrome.tabs.query({ active: false, discarded: false, pinned: false, url: ['http://*/*', 'https://*/*'] });
  const has = (list, t) => list.some((h) => t.url.includes(h));
  let n = 0;
  for (const t of tabs) {
    if (!force && Date.now() - t.lastAccessed < s.secs * 1000) continue;
    if (has(s.whitelist, t)) continue;
    const must = has(s.sleepList, t);
    if (!must && (t.audible || !t.autoDiscardable)) continue;
    const r = await chrome.tabs.sendMessage(t.id, 'dirty').catch(() => ({}));
    if (r?.dirty || (!must && r?.playing)) continue;
    await chrome.tabs.discard(t.id);
    n++;
  }
  return n;
}

// Chrome no deja auto-instalar una extensión fuera del Store: solo avisamos que hay versión nueva.
async function checkUpdate() {
  if (REPO.startsWith('USUARIO')) return;
  try {
    const v = (await (await fetch(`https://raw.githubusercontent.com/${REPO}/main/version.txt`, { cache: 'no-store' })).text()).trim();
    await chrome.storage.local.set({ upd: v });
    chrome.action.setBadgeText({ text: newer(v, chrome.runtime.getManifest().version) ? 'NEW' : '' });
  } catch { /* sin red: se reintenta en el próximo ciclo */ }
}

const start = () => {
  chrome.alarms.create('sweep', { periodInMinutes: 0.5 });
  chrome.alarms.create('update', { periodInMinutes: 720 });
  applyRules();
  checkUpdate();
};
chrome.runtime.onInstalled.addListener(start);
chrome.runtime.onStartup.addListener(start);
chrome.alarms.onAlarm.addListener((a) => (a.name === 'sweep' ? sweep(false) : checkUpdate()));
chrome.storage.onChanged.addListener((c) => c.s && applyRules());
chrome.runtime.onMessage.addListener((m, _, reply) => {
  if (m === 'sweep') { sweep(true).then(reply); return true; }
});
