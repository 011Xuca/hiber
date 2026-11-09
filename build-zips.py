# Uso: python build-zips.py  ->  dist/hiber-<navegador>-<version>.zip (corre build-firefox.js primero).
# Las tiendas actualizan solas al subir un zip con la "version" del manifest mayor; subí además la misma
# version.txt a GitHub (main) para que el aviso "NEW" de la extension coincida.
import os, subprocess, zipfile
subprocess.run(['node', 'build-firefox.js'], check=True)
FILES = ['manifest.json', 'defaults.js', 'background.js', 'content.js', 'main.js', 'yt.js', 'popup.html', 'popup.js', 'logo.svg']
v = open('version.txt').read().strip()
os.makedirs('dist', exist_ok=True)
def pack(name, root):
    with zipfile.ZipFile(f'dist/hiber-{name}-{v}.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for f in FILES: z.write(os.path.join(root, f), f)
        for d in ('icons', '_locales'):
            for p, _, fs in os.walk(os.path.join(root, d)):
                for f in fs:
                    full = os.path.join(p, f); z.write(full, os.path.relpath(full, root).replace(os.sep, '/'))
for n in ('chrome', 'edge', 'opera'): pack(n, '.')
pack('firefox', 'firefox')
