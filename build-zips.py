# Uso: python build-zips.py  ->  dist/hiber-<navegador>-<version>.zip (corre build-firefox.js primero).
# Las tiendas actualizan solas al subir un zip con la "version" del manifest mayor; subí además la misma
# version.txt a GitHub (main) para que el aviso rojo "!" de la extension coincida.
import json, os, re, subprocess, zipfile
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FILES = ['manifest.json', 'defaults.js', 'background.js', 'content.js', 'main.js', 'yt.js', 'twitch.js', 'ad_status.js', 'popup.html', 'popup.js', 'logo.svg']
v = open('version.txt', encoding='utf-8').read().strip()
mv = json.load(open('manifest.json', encoding='utf-8'))['version']
# La version del manifest es la que ven el navegador y las tiendas; version.txt la que lee el aviso de actualizacion.
if v != mv: raise SystemExit(f'version.txt ({v}) no coincide con manifest.json ({mv})')
if not re.search(rf'^## {re.escape(v)}\s*$', open('CHANGELOG.md', encoding='utf-8').read(), re.M): raise SystemExit(f'CHANGELOG.md no tiene "## {v}"')
subprocess.run(['node', 'build-firefox.js'], check=True)
os.makedirs('dist', exist_ok=True)

def refs(m):  # archivos que el manifest necesita: si falta uno, el navegador no carga la extension
    r = set((m.get('icons') or {}).values()) | set(m['action'].get('default_icon', {}).values()) | {m['action']['default_popup']}
    r |= {m['background']['service_worker']} if 'service_worker' in m['background'] else set(m['background']['scripts'])
    for c in m.get('content_scripts', []): r |= set(c.get('js', []) + c.get('css', []))
    for w in m.get('web_accessible_resources', []): r |= set(w['resources'])
    return r | {f'_locales/{m["default_locale"]}/messages.json'}

def pack(name, root):
    out = f'dist/hiber-{name}-{v}.zip'
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in FILES: z.write(os.path.join(root, f), f)
        for d in ('icons', '_locales'):
            for p, _, fs in os.walk(os.path.join(root, d)):
                for f in fs:
                    full = os.path.join(p, f); z.write(full, os.path.relpath(full, root).replace(os.sep, '/'))
    with zipfile.ZipFile(out) as z:
        m = json.loads(z.read('manifest.json'))
        missing = refs(m) - set(z.namelist())
        if m['version'] != v or missing: raise SystemExit(f'{out} mal armado: version {m["version"]}, faltan {sorted(missing)}')
for n in ('chrome', 'edge', 'opera'): pack(n, '.')
pack('firefox', 'firefox')
print(f'dist/ listo: version {v}')
