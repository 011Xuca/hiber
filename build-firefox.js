// Uso: node build-firefox.js  ->  crea la carpeta firefox/ lista para cargar en Firefox.
// Firefox no usa service_worker (usa scripts) y pide un id; el resto de los archivos es el mismo.
const fs = require('fs');
const FILES = ['defaults.js', 'background.js', 'content.js', 'main.js', 'yt.js', 'twitch.js', 'ad_status.js', 'popup.html', 'popup.js', 'logo.svg'];
const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

delete m.minimum_chrome_version;
m.background = { scripts: ['defaults.js', 'background.js'] };
m.browser_specific_settings = { gecko: { id: 'hiber@xuca', strict_min_version: '128.0',
  data_collection_permissions: { required: ['none'] } } };

fs.rmSync('firefox', { recursive: true, force: true });
fs.mkdirSync('firefox');
fs.writeFileSync('firefox/manifest.json', JSON.stringify(m, null, 2));
for (const f of FILES) fs.copyFileSync(f, 'firefox/' + f);
fs.cpSync('icons', 'firefox/icons', { recursive: true });
fs.cpSync('_locales', 'firefox/_locales', { recursive: true });
console.log('firefox/ listo');
