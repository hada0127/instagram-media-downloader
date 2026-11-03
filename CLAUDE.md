# Repository rules

- Plain JavaScript Chrome Manifest V3 extension. Load `extension/`, not repository root.
- No remote executable code, analytics, credentials, session cookies, real account fixtures, or signed media URLs in commits.
- Run `npm test`, `npm run check`, and `npm run package` before shipping.
- Never equate a mocked UI/download test with actual Instagram compatibility or successful file delivery.
- Undocumented Instagram endpoint and web app ID are unverified compatibility assumptions; keep failures visible and partial scans labeled.
- Keep this file, CLAUDE.md, and README limitations consistent when behavior changes.
- Public GitHub repository: hada0127/instagram-media-downloader. Artifacts contain only extension runtime files.

- Local Chrome unpacked installation confirmed on 2026-11-03. Keep `extension/` in place; actual Instagram downloads remain unverified.

- v0.2.0 adds Instagram-only content scripts and per-post inline buttons. Individual saves must match the visible slide; never default to item 1. Inline whole-post saves require a complete collection. Refresh Instagram tabs after reloading the extension.
- Chrome v0.2.0 reload and inline button presence on the real Instagram feed are verified; real file downloads are still unverified.

- v0.2.1 final UX: always-visible icon-only controls; feed has two icons LEFT of Bookmark, reels have one ABOVE Like. No hover gating or colored button boxes. Runtime PNG assets were generated with image_gen; see docs/icon-prompts.md.
- Filenames use sanitized caption's first 10 graphemes + _01 sequence in original post order; empty caption falls back to post code.
- Reject /reels/audio/... as a post. A complete singleton video may identify a blob player with no poster. Prefer a visible video over its overlapping decorative backdrop.
- The user-provided reel sample was verified as a downloaded MP4 with H.264 video and AAC audio; do not generalize that verification to all Instagram formats.
- v0.2.2 icons share the same tray/shaft and differ only by one vs two downward chevrons. Size by measured alpha bounds, not PNG canvas; reproduce CSS with scripts/measure-icons.py.
- v0.2.3 supersedes the double-chevron variant: both icons have ONE arrowhead; all-download adds two short vertical strokes on the upper right, stepped upward. Tray, visual size and placement stay matched.

- Final v0.2.3 refinement: move the all-download arrow left and match the two right strokes to its shaft weight. Re-measure alpha bounds when replacing PNGs.

- v0.2.4 replaces short right ticks with closely grouped, equal-length/weight shaft strokes stepped upward; one arrowhead remains. See docs/icon-prompts.md.

- v0.2.5: 전체 저장도 개별 저장과 같은 기본 다운로드 아이콘을 사용하며 우측 위 숫자 배지로 전체 개수를 표시한다. 화면에 보이는 게시물마다 한 번 정보를 읽으며, 확인되지 않은 개수는 `…`로 표시한다. 릴스는 배지 없이 버튼 하나다.
