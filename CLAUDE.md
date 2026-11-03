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
