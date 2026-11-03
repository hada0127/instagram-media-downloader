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

- v0.2.6: save directly in Chrome’s default download directory, without Instagram/post subdirectories. Preserve sanitized caption prefix and sequence; duplicate filenames use Chrome uniquify.

- v0.2.7: 피드의 /p/ 주소도 완전한 단일 영상으로 확인되면 전체 저장을 숨기고 버튼 하나를 즐겨찾기 왼쪽에 배치한다. 여러 장/부분 수집은 기존 두 버튼을 유지한다. 피드 영상을 클릭해 여는 확대 릴스는 main 바깥에 생기므로 영상 검색을 main에 한정하지 않는다. 실제 확대 화면에서 좋아요 위 버튼 하나를 확인했다.

- v0.2.8: 파일명 본문은 이모지·특수문자 제거 후 글자·숫자·공백만 남겨 앞 10자를 쓴다. 키캡 이모지도 통째로 제거한다. 비면 영숫자 게시물 코드로 대체하며 순번 구분용 밑줄과 확장자 점은 유지한다.

- v0.2.9: 이미지젠으로 생성한 확장 앱 아이콘을 manifest icons와 action.default_icon에 연결한다. runtime assets/icon-{16,32,48,128}.png; 원본 docs/assets/app-icon-source.png. 페이지 안 저장 버튼과는 별도 자산이다.

- v0.2.10: 스토어 등록 준비. manifest metadata는 _locales 40개 언어·기본 en, 실제 UI는 한국어. PRIVACY.md와 docs/store-listings.json이 공개 정책·설명 정본이다. 팝업은 기본 다운로드 경로와 비제휴·저장권한 안내를 표시한다. 심사 제출 상태는 콘솔을 읽어 확인하기 전 완료라고 하지 않는다.
