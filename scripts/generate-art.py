"""
Génère les visuels d'ambiance du portfolio (procéduraux, 100 % originaux, libres de droits).
Ce sont des visuels TEMPORAIRES : remplace-les par tes propres images dans public/images/.

Usage : npm run images   (nécessite python3, numpy et Pillow)
"""
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)
W, H = 1600, 1000


def noise(h, w, scale, octaves=5, seed=0, persistence=0.5):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gh = max(2, int(h / scale * 2 ** o) + 2)
        gw = max(2, int(w / scale * 2 ** o) + 2)
        grid = rng.random((gh, gw)).astype(np.float32)
        img = Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += np.asarray(img, np.float32) / 255 * amp
        total += amp
        amp *= persistence
    return acc / total


def lerp(a, b, t):
    return a + (b - a) * t


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def vgrad(stops, h=H, w=W):
    y = np.linspace(0, 1, h)[:, None]
    out = np.zeros((h, 1, 3), np.float32)
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = (y >= p0) & (y <= p1)
        t = np.clip((y - p0) / max(p1 - p0, 1e-6), 0, 1)
        col = lerp(hexc(c0)[None, :], hexc(c1)[None, :], t)
        out[m[:, 0]] = col[m[:, 0]][:, None, :]
    return np.repeat(out, w, axis=1)


def blend(img, color, mask):
    m = mask[..., None]
    return img * (1 - m) + hexc(color)[None, None, :] * m if isinstance(color, str) else img * (1 - m) + color * m


def glow(img, cx, cy, r, color, strength=1.0, h=H, w=W):
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    g = np.exp(-d * d) * strength
    return img + hexc(color)[None, None, :] * g[..., None]


def ridge(seed, base, amp, rough, w=W, h=H):
    rng = np.random.default_rng(seed)
    n = noise(1, w, rough, 6, seed)[0]
    n2 = np.abs(np.sin(np.linspace(0, rng.uniform(2, 5) * math.pi, w) + rng.uniform(0, 6)))
    line = base - (n * 0.7 + n2 * 0.3) * amp
    yy = np.arange(h)[:, None]
    return np.clip((yy - line[None, :]) / 2.0, 0, 1).astype(np.float32)


def shape_mask(draw_fn, blur=0, w=W, h=H):
    im = Image.new("L", (w, h), 0)
    draw_fn(ImageDraw.Draw(im))
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(im, np.float32) / 255


def fog(img, seed, y0, y1, color, strength, scale=380):
    n = noise(H, W, scale, 5, seed)
    y = np.linspace(0, 1, H)[:, None]
    band = np.clip(1 - np.abs((y - (y0 + y1) / 2) / ((y1 - y0) / 2)), 0, 1) ** 1.4
    return blend(img, color, np.clip(band * (0.35 + n * 0.9) * strength, 0, 1))


def finish(img, name, seed=0, vignette=0.55, warm=True):
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    img = img * (1 - np.clip(d - 0.45, 0, 1)[..., None] * vignette)
    if warm:  # étalonnage : ombres chaudes, hautes lumières dorées
        lum = img.mean(axis=2, keepdims=True)
        img = img + (hexc("#1a120a") * (1 - lum) * 0.25) + hexc("#2a1d08") * np.clip(lum - 0.55, 0, 1) * 0.6
    rng = np.random.default_rng(seed + 99)
    img = img + (rng.random((H, W, 1)).astype(np.float32) - 0.5) * 0.05
    arr = (np.clip(img, 0, 1) * 255).astype(np.uint8)
    im = Image.fromarray(arr, "RGB")
    im.save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=80, method=6)
    im.resize((800, 500), Image.LANCZOS).save(os.path.join(OUT, f"{name}-sm.webp"), "WEBP", quality=78, method=6)
    print("✓", name)


# 1 — Les crêtes lointaines : chaîne de montagnes, soleil pâle, brume
def peaks():
    img = vgrad([(0, "#0d0c0b"), (0.45, "#3a3328"), (0.62, "#8c7550"), (1, "#14110d")])
    img = glow(img, 1050, 470, 220, "#e9c983", 0.9)
    img = glow(img, 1050, 470, 60, "#fff1cf", 0.9)
    layers = [("#6b5e4b", 560, 260, 300), ("#4a4133", 640, 220, 220), ("#2b261f", 730, 200, 160), ("#13110e", 850, 180, 120)]
    for i, (c, base, amp, rough) in enumerate(layers):
        img = blend(img, c, ridge(10 + i, base, amp, rough))
        img = fog(img, 30 + i, base / H - 0.06, base / H + 0.08, "#a79576", 0.55 - i * 0.1)
    finish(img, "relic-peaks", 1)


# 2 — Le monolithe : pierre dressée dans la brume, liseré doré
def monolith():
    img = vgrad([(0, "#060606"), (0.5, "#1c1915"), (1, "#0a0908")])
    img = glow(img, 800, 380, 420, "#5a4a2e", 0.7)
    img = fog(img, 3, 0.45, 0.95, "#5b544a", 0.8, 300)
    stone = shape_mask(lambda d: d.polygon([(720, 900), (742, 260), (800, 170), (858, 250), (880, 900)], fill=255), 1)
    rim = shape_mask(lambda d: d.polygon([(800, 170), (858, 250), (880, 900), (868, 900), (846, 255)], fill=255), 3)
    tex = noise(H, W, 40, 4, 7)
    img = blend(img, np.stack([tex * 0.12 + 0.03] * 3, -1), stone)
    img = img + hexc("#d8b46a")[None, None, :] * rim[..., None] * 0.55
    img = blend(img, "#0b0a09", np.clip(np.linspace(-2.6, 1.2, H)[:, None] * np.ones((1, W)), 0, 1))
    img = fog(img, 5, 0.75, 1.05, "#3c3832", 0.9, 260)
    finish(img, "relic-monolith", 2)


# 3 — La colonnade brisée : perspective de colonnes en ruine
def colonnade():
    img = vgrad([(0, "#0b0a09"), (0.55, "#4a4030"), (0.7, "#7c6a4c"), (1, "#100e0b")])
    img = glow(img, 800, 640, 360, "#d9b977", 0.55)
    rng = random.Random(4)
    for side in (-1, 1):
        for i in range(7):
            t = i / 6
            x = 800 + side * lerp(720, 70, t ** 0.8)
            wcol = lerp(120, 14, t ** 0.8)
            top = lerp(-40, 520, t ** 0.9)
            bottom = lerp(1000, 690, t ** 0.9)
            broken = rng.random() < 0.35
            tt = top + (bottom - top) * rng.uniform(0.25, 0.55) if broken else top
            shade = lerp(0.03, 0.32, t)
            m = shape_mask(lambda d: d.rectangle([x - wcol / 2, tt, x + wcol / 2, bottom], fill=255), 0.6 + t * 2)
            img = blend(img, np.array([shade, shade * 0.92, shade * 0.8]), m)
    floor = shape_mask(lambda d: d.polygon([(0, 1000), (760, 690), (840, 690), (1600, 1000)], fill=255), 2)
    img = blend(img, np.array([0.05, 0.045, 0.04]), floor * 0.85)
    img = fog(img, 9, 0.55, 0.8, "#b5a17c", 0.45, 200)
    finish(img, "relic-colonnade", 3)


# 4 — La grande porte : arche monumentale, lumière derrière
def gate():
    img = vgrad([(0, "#070707"), (1, "#14120f")])
    inner = shape_mask(lambda d: (d.rectangle([640, 380, 960, 1000], fill=255), d.ellipse([640, 220, 960, 540], fill=255)), 2)
    light = vgrad([(0, "#f4dfae"), (0.6, "#c99a52"), (1, "#5a3f1f")])
    img = blend(img, light, inner)
    img = glow(img, 800, 600, 260, "#e8c27a", 0.6)
    tex = noise(H, W, 30, 5, 11)
    wall = 1 - inner
    img = img * (1 - wall[..., None] * 0.35) + np.stack([tex * 0.09] * 3, -1) * wall[..., None]
    fig = shape_mask(lambda d: (d.ellipse([786, 812, 814, 842], fill=255), d.polygon([(780, 840), (820, 840), (830, 960), (770, 960)], fill=255)), 0.8)
    img = blend(img, "#0a0806", fig)
    stairs = shape_mask(lambda d: [d.rectangle([600 - k * 40, 960 + k * 10, 1000 + k * 40, 968 + k * 10], fill=255) for k in range(5)], 1)
    img = img + hexc("#a07e46")[None, None, :] * stairs[..., None] * 0.2
    img = fog(img, 13, 0.7, 1.0, "#6b5a3e", 0.5)
    finish(img, "relic-gate", 4)


# 5 — L'arbre de lumière : arbre doré procédural, ciel nocturne
def tree():
    img = vgrad([(0, "#08080a"), (0.6, "#17140f"), (1, "#0a0908")])
    img = glow(img, 800, 420, 520, "#5a4520", 0.75)
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    rng = random.Random(7)

    def branch(x, y, ang, length, width, depth):
        if depth == 0 or length < 4:
            return
        x2 = x + math.cos(ang) * length
        y2 = y - math.sin(ang) * length
        d.line([(x, y), (x2, y2)], fill=int(120 + 135 * (1 - depth / 11)), width=max(1, int(width)))
        for _ in range(2 if depth > 3 else 3):
            branch(x2, y2, ang + rng.uniform(-0.55, 0.55), length * rng.uniform(0.68, 0.8), width * 0.68, depth - 1)

    branch(800, 980, math.pi / 2, 210, 26, 11)
    m = np.asarray(im, np.float32) / 255
    halo = np.asarray(im.filter(ImageFilter.GaussianBlur(18)), np.float32) / 255
    img = img + hexc("#f0c76e")[None, None, :] * (m * 0.95 + halo * 1.6)[..., None]
    img = blend(img, "#0c0a08", ridge(21, 960, 60, 300))
    finish(img, "relic-tree", 5)


# 6 — La tour au-dessus des nuages
def tower():
    img = vgrad([(0, "#0a0a0b"), (0.5, "#2c2a28"), (0.68, "#6d6153"), (1, "#1a1814")])
    img = glow(img, 420, 560, 260, "#cfae74", 0.5)
    sea = noise(H, W, 160, 6, 17)
    y = np.linspace(0, 1, H)[:, None]
    clouds = np.clip((y - 0.62) * 6, 0, 1) * (0.55 + sea * 0.6)
    img = blend(img, "#8d8273", np.clip(clouds, 0, 1) * 0.85)
    cliff = shape_mask(lambda d: d.polygon([(1040, 1000), (1090, 640), (1180, 600), (1300, 610), (1360, 700), (1420, 1000)], fill=255), 1.5)
    img = blend(img, "#0d0c0b", cliff)
    tw = shape_mask(lambda d: (d.polygon([(1170, 610), (1186, 260), (1226, 260), (1242, 610)], fill=255), d.polygon([(1178, 262), (1206, 170), (1234, 262)], fill=255)), 1)
    img = blend(img, "#0d0c0b", tw)
    win = shape_mask(lambda d: d.rectangle([1202, 300, 1210, 318], fill=255), 1.5)
    img = img + hexc("#ffcf7a")[None, None, :] * win[..., None] * 1.5
    img = glow(img, 1206, 309, 30, "#d79b3e", 0.35)
    img = fog(img, 19, 0.55, 0.75, "#9a8c78", 0.5, 300)
    finish(img, "relic-tower", 6)


# Portrait temporaire : silhouette au bord d'une falaise (à remplacer par ta photo)
def wanderer():
    img = vgrad([(0, "#0b0a09"), (0.5, "#3d3427"), (0.7, "#a08a62"), (1, "#16130f")])
    img = glow(img, 800, 640, 300, "#f1d79c", 0.8)
    img = blend(img, "#2b261e", ridge(41, 720, 90, 260))
    img = fog(img, 43, 0.62, 0.8, "#b19c74", 0.5)
    cliff = shape_mask(lambda d: d.polygon([(0, 1000), (0, 800), (520, 770), (700, 800), (760, 1000)], fill=255), 1)
    img = blend(img, "#0b0a09", cliff)
    fig = shape_mask(lambda d: (d.ellipse([566, 640, 590, 666], fill=255), d.polygon([(560, 664), (598, 664), (612, 778), (546, 778)], fill=255)), 0.6)
    img = blend(img, "#0b0a09", fig)
    finish(img, "wanderer", 7)


if __name__ == "__main__":
    for fn in (peaks, monolith, colonnade, gate, tree, tower, wanderer):
        fn()
