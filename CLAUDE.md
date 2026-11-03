# Repository rules

- Plain JavaScript Chrome Manifest V3 extension. Load `extension/`, not repository root.
- No remote executable code, analytics, credentials, session cookies, real account fixtures, or signed media URLs in commits.
- Run `npm test`, `npm run check`, and `npm run package` before shipping.
- Never equate a mocked UI/download test with actual Instagram compatibility or successful file delivery.
- Undocumented Instagram endpoint and web app ID are unverified compatibility assumptions; keep failures visible and partial scans labeled.
- Keep this file, CLAUDE.md, and README limitations consistent when behavior changes.
- Public GitHub repository: hada0127/instagram-media-downloader. Artifacts contain only extension runtime files.
