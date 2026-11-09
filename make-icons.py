"""Genera icons/icon-{16,32,48,128}.png a partir del mismo diseño que logo.svg (luna creciente + estrella sobre degradé celeste)."""
import os
from PIL import Image, ImageDraw, ImageFilter

S = 1024  # se dibuja grande y se achica (antialias)
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('icons', exist_ok=True)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# fondo: degradé diagonal azul noche -> celeste
bg = Image.new('RGB', (S, S))
px = bg.load()
c0, c1, c2 = (7, 24, 46), (14, 90, 150), (56, 189, 248)
for y in range(S):
    for x in range(S):
        t = (x * 0.35 + y * 0.65) / S
        px[x, y] = lerp(c0, c1, t / 0.6) if t < 0.6 else lerp(c1, c2, (t - 0.6) / 0.4)

# luna creciente: círculo menos círculo desplazado
moon = Image.new('L', (S, S), 0)
d = ImageDraw.Draw(moon)
d.ellipse((190, 170, 190 + 600, 170 + 600), fill=255)
cut = Image.new('L', (S, S), 0)
ImageDraw.Draw(cut).ellipse((330, 110, 330 + 560, 110 + 560), fill=255)
moon = Image.composite(Image.new('L', (S, S), 0), moon, cut)

glow = moon.filter(ImageFilter.GaussianBlur(40))
base = bg.convert('RGBA')
base.alpha_composite(Image.merge('RGBA', (*[Image.new('L', (S, S), v) for v in (125, 211, 252)], glow.point(lambda v: int(v * .55)))))
mooncol = Image.new('RGB', (S, S))
mp = mooncol.load()
for y in range(S):
    for x in range(S):
        mp[x, y] = lerp((224, 247, 255), (125, 211, 252), y / S)
base.paste(mooncol, (0, 0), moon)

# estrella de 4 puntas
def star(cx, cy, r, k=0.22):
    pts = []
    import math
    for i in range(8):
        a = math.pi / 4 * i - math.pi / 2
        rr = r if i % 2 == 0 else r * k
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts
ImageDraw.Draw(base).polygon(star(745, 700, 130), fill=(240, 251, 255, 255))
ImageDraw.Draw(base).polygon(star(850, 520, 52), fill=(186, 230, 253, 255))

# esquinas redondeadas
mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=230, fill=255)
base.putalpha(mask)

for n in (16, 32, 48, 128):
    base.resize((n, n), Image.LANCZOS).save(f'icons/icon-{n}.png')
print('icons ok')
