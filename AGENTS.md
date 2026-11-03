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
