# Toolbar icons

## v0.2.4 — closely grouped equal-length strokes

Built-in image_gen edit; runtime output `extension/assets/download-all.png`. User requested the three shafts to share weight and length, tightly grouped with upward steps. Generated asset visually inspected; pixel-perfect equality is not guaranteed by raster generation.

Exact prompt:

> Use case: precise-object-edit. Edit this transparent download-all icon. Preserve the U-shaped tray exactly and keep exactly one arrowhead. Replace the three vertical strokes with a tightly grouped set of THREE PARALLEL VERTICAL STROKES of IDENTICAL LENGTH and IDENTICAL THICKNESS. The leftmost stroke alone attaches to the existing downward arrowhead. The other two plain strokes have NO arrowheads. All three vertical strokes should be about 400px long and 80px thick on this 1254px canvas, with small 30px clear horizontal gaps between their edges. Leftmost center x=477, middle x=587, rightmost x=697. Leftmost top y=360 bottom y=760, middle top y=285 bottom y=685, rightmost top y=210 bottom y=610: a closely packed upward staircase to the right. Adjust the one existing V arrowhead so it connects only to the leftmost shaft and does not touch the middle or right shaft. The strokes are equally long, not short decorative ticks. Uniform rounded caps and near-black line weight. Preserve tray, canvas, alpha transparency, no text, no background, no shadows. Result must read as a tightly packed multiple-download icon at small size.

Final v0.2.3 refinement: arrow shifted left; both right strokes use the arrow shaft weight. Built-in image_gen, transparent PNG, saved to `extension/assets/download-all.png`. Measured alpha bounds: (196,230,1058,1069); CSS regenerated with `scripts/measure-icons.py`.

Exact final edit prompt:

> Use case: precise-object-edit. Edit this transparent download-all toolbar icon. Keep the tray EXACTLY unchanged, same canvas, color, alpha transparency and overall size. Move the complete downward arrow (vertical shaft AND its single V arrowhead together) LEFT by about 85 pixels on this 1254px canvas, preserving its shape and thickness. Thicken BOTH short vertical strokes on its right to EXACTLY MATCH the main arrow shaft thickness (about 78 pixels instead of their current 52). Preserve their rounded caps, their positions and lengths, and the upward step from nearer-right to farther-right. Exactly ONE arrowhead only. No other changes, no background, no shadow, no text. All strokes uniform weight; clean minimal Instagram-compatible icon.

Created with the built-in image_gen tool on 2026-11-03, transparent background. Runtime assets: `extension/assets/download-one.png`, `extension/assets/download-all.png`. Original PNGs copied without raster editing; CSS scales them to toolbar size and adapts monochrome tone to the native action buttons.

Shared prompt, used verbatim for each icon:

> Use case: logo-brand. Asset type: a single production toolbar icon PNG for an Instagram media downloader. A near-black (#111418) monoline outline UI icon, rounded joins and rounded line caps, completely transparent background, no button container, no shadow, no gradient, no text, no border around the image. Square canvas. Glyph occupies the central 80 percent with balanced padding. Design for crisp recognition when rendered at 24 CSS pixels: stroke weight equivalent to 1.8 pixels at 24px. Flat front view, perfectly clean minimal geometry, matching Instagram's familiar black outline heart/comment/bookmark toolbar style.

Single icon appended prompt:

> Subject: SINGLE DOWNLOAD: one downward arrow centered above an open-top U-shaped download tray. Just the arrow and tray. Arrow and tray visually separated. No sheets, no extra arrows.

All icon appended prompt:

> Subject: DOWNLOAD ALL: two slightly overlapping rounded rectangular document outlines with a clearly recognizable downward download arrow in front on the lower center. Two sheets imply multiple items. Bold simple silhouette, no document text lines, no numbers. Same near-black monoline weight throughout.

## Final matched set (v0.2.2)

The user rejected the stacked-document variant. The final all-download icon uses the single-download image as an edit target. Both share the same tray and shaft; the all-download variant has two downward chevrons. Generated with built-in image_gen, transparent background, replacing `extension/assets/download-all.png`.

Exact edit prompt:

> Use case: precise-object-edit. Edit target: the provided single-download toolbar icon. Create its matching DOWNLOAD ALL variant. Keep the exact same U-shaped tray, vertical arrow shaft, overall silhouette bounds, stroke weight, rounded caps, near-black color, transparency, square canvas and placement. The ONLY semantic change: add ONE additional downward V-shaped chevron above the existing downward arrowhead, on the same shaft. The result must have exactly TWO clearly separated downward chevrons stacked vertically, while the single reference has one. Space the two V chevrons enough to read clearly at 24 CSS pixels. Do not introduce sheets, document outlines, badges, circles, backgrounds, shadows, lettering or more arrows. It must look like the same basic icon with one versus two arrowhead lines. Keep authentic alpha transparency.

Both PNG canvases are 1254×1254. Alpha >32 bounds measured from the actual files:

- Single: (199, 232, 1054, 1067).
- All: (198, 231, 1055, 1069).

`python3 scripts/measure-icons.py` reproduces the CSS scale and centering constants (requires Pillow for this asset-maintenance command only). It reads pixels without editing the PNGs. The visual glyph is fitted to 22 CSS px, matching the visual inset inside Instagram's 24px icon box; this size is a design choice. Buttons retain a 40px hit target. The raw transparent image canvas is no longer treated as the icon's visual size.

## Final stepped-line variant (v0.2.3)

The user replaced the double-chevron idea with ONE arrowhead and two short vertical strokes to its right, staggered upward. Built-in image_gen edit of `download-one.png`, saved as `extension/assets/download-all.png`. Alpha bounds (198,232,1055,1068), same CSS size/centering output as v0.2.2. `download-one.png` is unchanged.

Exact edit prompt:

> Use case: precise-object-edit. Edit the provided single-download UI icon into a matching download-all variant. Preserve its EXACT U-shaped tray, central vertical arrow shaft, ONE existing downward arrowhead, stroke thickness, rounded caps, near-black color, transparency, original bounding box and placement. Do NOT add a second arrowhead. ONLY ADD two SHORT VERTICAL PARALLEL LINE SEGMENTS to the RIGHT of the central arrow shaft. The farther-right line sits slightly HIGHER than the nearer-right line, like a subtle upward staircase. These two plain vertical strokes have NO heads and NO horizontal branches. Place both in the empty upper-right area above the existing diagonal arrowhead arm, do not touch or cross the original arrow. Each short line is about one third of the existing vertical shaft's length. Keep the added lines fully INSIDE the existing tray's horizontal bounds and below or level with the existing shaft's top, so overall silhouette size stays identical. Result: one downward download arrow into the same tray, with two short stepped-up parallel vertical accent strokes on its upper right. No sheets, no duplicate trays, no text, no badge, no background, no shadow. Authentic transparent alpha. Must be clean and legible at 24 CSS pixels.
