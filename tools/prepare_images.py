"""Turns the raw Instagram slides in assets/ig into the web images in public/img.

Lifetouch sets most album photos on a white, sage or blush mat with the couple's names underneath.
TRIM ids lose the mat (and the names with it); PLAIN ids are full-bleed photos and stay as shot.
"""
import os
import sys
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'ig')
OUT = os.path.join(ROOT, 'public', 'img')
THUMB_WIDTH = 760  # for frames that never fill the screen (tunnel, ring, small reel frames)

PLAIN = """
DX4tztVE3Tn_01 DYBu7cRoPOG_03 DYBu7cRoPOG_08 DYBu7cRoPOG_18 DaFDQVUoAhK_10
""".split()
TRIM = """
DYBu7cRoPOG_06 DYBu7cRoPOG_11
DX4tztVE3Tn_03 DX4tztVE3Tn_07 DX4tztVE3Tn_10 DX4tztVE3Tn_12 DX4tztVE3Tn_14
DXD-1V3k4_l_02 DXD-1V3k4_l_06 DXD-1V3k4_l_18
DWqSLmCEzOC_08 DWqSLmCEzOC_12 DWqSLmCEzOC_13 DWqSLmCEzOC_14 DWqSLmCEzOC_19
DbnNz63IEqd_07 DbnNz63IEqd_08 DbnNz63IEqd_11 DbnNz63IEqd_13
DaFDQVUoAhK_02 DaFDQVUoAhK_12 DaFDQVUoAhK_14 Da261m2IFYQ_12 Da261m2IFYQ_15
DJMHcruT_aK_03 DJMHcruT_aK_12 DJMHcruT_aK_13 DJMHcruT_aK_15 DJMHcruT_aK_17
""".split()
FULL_SIZE = {'DX4tztVE3Tn_01'}  # the hero photo fills the screen


def is_mat(colour):
    lo, hi = min(colour), max(colour)
    paper = lo > 150 and hi - lo < 42  # white, sage and blush mats are all pale and low in saturation
    black = hi < 30
    return paper or black


def trim(im):
    """Crops to the photo inside a uniform mat; images without one come back unchanged."""
    w, h = im.size
    small = im.resize((w // 4, h // 4), Image.BILINEAR)
    sw, sh = small.size
    corner = small.crop((0, 0, 6, 6)).resize((1, 1), Image.BOX).getpixel((0, 0))
    if not is_mat(corner):
        return im
    # distance from the mat colour, thresholded: 255 wherever the photo (or caption text) is
    diff = ImageChops.difference(small, Image.new('RGB', small.size, corner)).convert('L').point(lambda v: 255 if v > 26 else 0)
    px = diff.load()
    rows = [sum(1 for x in range(sw) if px[x, y]) / sw for y in range(sh)]
    cols = [sum(1 for y in range(sh) if px[x, y]) / sh for x in range(sw)]
    edge = lambda seq: next((i for i, v in enumerate(seq) if v > 0.42), 0)
    top, left = edge(rows), edge(cols)
    bottom, right = sh - edge(rows[::-1]), sw - edge(cols[::-1])
    if (right - left) < sw * 0.3 or (bottom - top) < sh * 0.3:
        return im
    # step inside the hairline that frames the photo
    pad_x, pad_y = int((right - left) * 0.014) + 1, int((bottom - top) * 0.014) + 1
    return im.crop(((left + pad_x) * 4, (top + pad_y) * 4, (right - pad_x) * 4, (bottom - pad_y) * 4))


def main(out=OUT, max_side=1800):
    os.makedirs(os.path.join(out, 't'), exist_ok=True)
    total = 0
    for name in PLAIN + TRIM:
        im = Image.open(os.path.join(SRC, f'{name}.jpg')).convert('RGB')
        if name in TRIM:
            im = trim(im)
        if name not in FULL_SIZE:
            im.thumbnail((max_side, max_side), Image.LANCZOS)
        path = os.path.join(out, f'{name}.webp')
        im.save(path, 'WEBP', quality=84 if name in FULL_SIZE else 80, method=6)
        total += os.path.getsize(path)
        thumb = im.copy()
        thumb.thumbnail((THUMB_WIDTH, THUMB_WIDTH * 2), Image.LANCZOS)
        thumb.save(os.path.join(out, 't', f'{name}.webp'), 'WEBP', quality=76, method=6)
        print(name, im.size)
    print('images', len(PLAIN + TRIM), 'MB', round(total / 1e6, 1))


if __name__ == '__main__':
    main(*sys.argv[1:2])
