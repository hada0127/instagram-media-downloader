# Toolbar icons

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
