"""Print CSS sizing from PNG alpha bounds (Pillow; asset maintenance only).

Run after replacing an icon, then copy the printed .one/.all rules into inline.js.
PNG pixels are never rewritten. A 22px painted glyph matches the visual inset
of Instagram's 24px toolbar icons; 22px is a design choice, not a benchmark.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
for key in ('one', 'all'):
    path = root / 'extension' / 'assets' / f'download-{key}.png'
    im = Image.open(path).convert('RGBA')
    # Ignore barely visible alpha fringe when measuring the actual glyph.
    left, top, right, bottom = im.getchannel('A').point(lambda a: 255 if a > 32 else 0).getbbox()
    scale = 22 / max(right-left, bottom-top)
    dx = (im.width/2 - (left+right)/2) * scale
    dy = (im.height/2 - (top+bottom)/2) * scale
    print(f'/* {key}: canvas={im.size}, alpha>32 bounds={(left, top, right, bottom)} */')
    print(f'.{key} img{{width:{im.width*scale:.3f}px;height:{im.height*scale:.3f}px;transform:translate({dx:.3f}px,{dy:.3f}px)}}')
