# 검증 기록 — 2026-11-03

대상: v0.1.0 runtime, macOS, Node v24.19.0.

## 실행 증거

- `npm test`: exit 0, tests 12 / pass 12 / fail 0.
- `npm run check`: exit 0, collector/media/background/popup 구문 검사 성공.
- `npm run package`: exit 0, `dist/insta-pick-0.1.0.zip` 생성.
- `unzip -l dist/insta-pick-0.1.0.zip`: manifest와 JS/CSS/HTML 7개만 포함. 테스트 파일·사용자 데이터 없음.

브라우저 실행: `ego-browser nodejs`로 `tests/ui-fixture.html`을 연 뒤 게시물 읽기 → 2번 선택 해제 → 선택 저장 → 전체 저장 → 2번 개별 저장. 모든 라운드 exit 0.

실제 출력:

```text
saved: [ [ '1', '3' ], [ '1', '2', '3' ], [ '2' ] ]
states: [ '저장 완료 ✓', '저장 완료 ✓', '저장 완료 ✓' ]
finish_ok: true
spaces_remaining: 0
```

위 상태는 **모의 Chrome API 응답**이며 실제 파일 저장 결과가 아니다. UI의 선택 전달과 상태 렌더링만 입증한다.

- ego_version: 0.6.1.13 / guide 2.1.0
- ego_space_name: instagram-downloader-20261103
- ego_space_id: 22
- finish_ok: true (정확히 한 번 실행)
- spaces_remaining: 0 (종료 직후 조회)
- handoff: false
- 사용자 전면 앱 변화: unverified. 전면화 명령 실행 안 함.
- Ego Lite 업데이트 안내 감지, 업그레이드 실행 안 함.

## 코드 검토

명세: 사진/영상 분리, 개별·다중 선택·전체 요청, 캐러셀 순서와 부분 목록 경고를 확인했다.
품질: 외부 URL 허용 목록, 파일 이름 정리, 영상 표지 오인 방지, 항목별 실패 격리를 확인했다.
발견 후 수정: 반복 JSON의 중복이 빠진 영상을 가리는 문제, 팝업 종료로 부분 목록이 사라지는 문제, 재수집 중복 ID.

## 아직 확인하지 않은 항목

- Chrome에 실제 확장을 설치한 뒤 Instagram 로그인 세션으로 수집 및 다운로드.
- Instagram 현행 비공식 API·웹 앱 ID의 호환성.
- CDN의 실제 파일 응답, 파일 내용과 영상 재생, 만료 URL의 Chrome 처리.
- 실제 브라우저에서 팝업 종료 후 세션 캐시와 다운로드 생명주기.

위 항목은 PASS로 간주하지 않는다. 로그인 계정이나 게시물을 자동으로 선택해 테스트하지 않았다.

## 수동 연동 확인

1. README대로 `extension/`을 Chrome에 설치한다.
2. 본인 또는 저장 권한이 있는 사진 1장 게시물, 여러 장 사진, 사진·영상 혼합 게시물, 릴스를 각각 연다.
3. 게시물 읽기 후 항목 수와 미디어 종류를 원 게시물과 비교한다.
4. 개별·선택·전체 저장을 각각 누르고 `chrome://downloads`의 완료 상태와 저장 파일 내용을 확인한다.
5. 부분 목록 경고가 나오면 다음 장으로 이동 후 다시 읽어 중복 없이 누적되는지 확인한다.
6. 다운로드 도중 팝업을 닫고 Chrome 다운로드 내역에서 완료 여부를 확인한다.

## 추가 설치 확인 — 2026-11-03

사용자의 명시적 Chrome 설치 요청에 따라 `orca computer`로 Chrome의 `chrome://extensions`에서 개발자 모드를 켜고 로컬 `extension/` 폴더를 로드했다. 설치 폴더는 이동하거나 삭제하지 않는다.

확인 명령: `orca computer get-app-state --app com.google.Chrome --window-id 9920 --no-screenshot --json` (exit 0). 실제 접근성 출력:

```text
항목 Insta Pick · 사진과 영상 저장
텍스트, Value: 0.1.0
전환 (settable) 켜짐, 확장 프로그램 사용 설정됨, Value: 1
```

이는 설치·활성화 확인이며 Instagram 수집·실제 다운로드 검증을 의미하지 않는다. 파일 선택 창에서 백그라운드 입력이 거부되어 사전 안내 후 `--restore-window`로 경로를 지정했다. 다른 확장이나 사용자 탭은 변경하지 않았다.

## v0.2.0 화면 버튼 검증 — 2026-11-03

- `npm test`: exit 0, tests 15 / pass 15 / fail 0.
- `npm run check`, `npm run package`: exit 0, `dist/insta-pick-0.2.0.zip` 생성.
- `ego-browser nodejs`로 `tests/inline-fixture.html`에서 두 번째 사진 → 현재 항목 저장, 세 번째 영상 → 현재 항목 저장, 게시물 전체 저장을 실행했다. 요청 배열 실출력: `saved: [["2"], ["3"], ["1","2","3"]]`.
- 모의 게시물 동적 추가 후 `toolbarCount: 2`, 제거 후 `toolbarCount: 1` 확인. 초기 버튼 수는 1. 실제 CDN 파일 다운로드를 뜻하지 않는다.
- ego_version: 0.6.1.13 / guide 2.1.0, ego_space_name: harness-qa-browser-headless-insta-inline-20261103, ego_space_id: 23, 각 라운드 exit 0, finish_ok: true, spaces_remaining: 0, handoff: false. 전면 앱 변화 unverified. 업데이트 실행 안 함.

사용자가 설치를 요청한 Chrome의 로컬 확장을 다시 로드했다. `orca computer click ... --element-index 447` 후 실제 목록 출력에서 `0.2.0`, `켜짐, 확장 프로그램 사용 설정됨, Value: 1` 확인.

이어 이번 실행에서 만든 탭으로 Instagram 피드를 열었다. `orca computer get-app-state --app com.google.Chrome --window-id 9920 --no-screenshot --json` (exit 0)의 실제 출력에서 각 게시물의 버튼을 확인했다(개인 게시물 내용은 기록하지 않음):

```text
텍스트, Value: ↘ Insta Pick
버튼 현재 항목 저장
버튼 게시물 전체 저장
```

피드에서 위 버튼 묶음 3개가 관찰되었다. 이 확인은 사용자가 지정한 Chrome 설치본의 실제 표시 확인이며 ego 하네스 PASS로 대체하지 않는다. 실제 게시물 파일 다운로드는 아직 검증하지 않았다. 임의의 피드 콘텐츠를 다운로드하지 않았다.

## v0.2.1 — 릴스 실측·파일명·아이콘

최종 사용자 결정은 호버 없이 항상 표시, 일반 게시물은 즐겨찾기 왼쪽 두 아이콘, 릴스는 좋아요 위 한 아이콘이다. 중간 호버 버전 검증은 최종 동작으로 간주하지 않는다.

### 재현과 수정

실제 Chrome에서 사용자 제공 릴스의 저장 버튼을 눌렀을 때 `HTTP 400`을 재현했다. ego에서 해당 화면 DOM을 조사했더니 main의 첫 `/reels/` 링크가 `/reels/audio/...`였다. 기존 정규식은 이를 미디어 코드로 취급했다. 정확한 게시물 경로로 수집하면 `{type:video, complete:true}`가 반환되었다.

추가 실측: video는 blob 소스이며 poster가 없고, 그 뒤 흐린 배경 img가 video보다 약간 크다. 기존 화면 선택기는 그 img를 선택했다. 이 상황을 단위 테스트에서 실패시킨 뒤 수정했다. 최종 페이지 버튼의 요청 대상은 제공된 릴스의 영상 한 개·index 1이었다. 다음 릴스로 이동해도 활성 카드의 버튼 묶음은 한 개였다.

### 파일과 이름

실제 미디어 요청 결과: HTTP 200, content-type `video/mp4`, 4,000,296 bytes, MP4 `ftyp` 시그니처.

설치본 갱신 후 다운로드 폴더에 존재하는 해당 예제 파일에 `ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -show_entries format=duration,size -of json <downloaded-file>`를 실행했다(exit 0):

```json
{"video":"h264","width":1080,"height":720,"audio":"aac","duration":"12.512698","size":"4000296"}
```

파일명은 실제 본문의 앞 10자 + `_01.mp4` 형식임을 확인했다. 사용자 파일은 보존했다. 이는 예제 1건에 대한 검증이며 모든 Instagram 영상 포맷을 보장하지 않는다. CDN 서명 URL과 개인 계정 정보는 기록하지 않았다.

### 화면

- 이미지젠 내장 도구로 생성한 투명 PNG 2개를 런타임 자산으로 사용. [프롬프트 및 경로](icon-prompts.md).
- 실제 릴스 DOM에 최종 코드를 적용해 `icons:1`, 마우스가 밖에 있을 때 `opacity:1`, 좋아요와의 가로 중심선 차이 0, 좋아요 위 간격 16 CSS px 확인. 이미지 로드 확인 및 스크린샷 시각 검토 완료(검증용 임시 스크린샷은 삭제).
- 일반 게시물 모의 화면에서 `icons:2`, `opacity:1`, 아이콘 이미지 로드 완료. 즐겨찾기 바로 왼쪽 배치와 두 번째 사진/세 번째 영상/전체 선택 요청 `[["2"],["3"],["1","2","3"]]` 확인.
- ego_space_name: harness-qa-browser-auth-insta-reel-20261103, ego_space_id:25, ego_version:0.6.1.13. 마지막 finish 정확히 1회 완료. 첫 조회 잔여 1 → 직후 재조회 `spaces_remaining:0`. handoff:false. 전면 비점유는 unverified.
- 중간 영상 선택 대기는 1회 timeout(exit 1)이었으며 상태를 읽어 배경 이미지 오인 원인을 확인한 후 수정했다. 최종 버튼 대상·레이아웃 확인 라운드는 exit 0.
- Chrome 설치본은 최종 파일 변경 후 다시 로드했고 `0.2.1`, `켜짐, 확장 프로그램 사용 설정됨, Value:1`을 확인했다. 갱신용으로 만든 Chrome 창은 닫았다.

최종 검사: `npm test` exit 0 (21 passed, 0 failed), `npm run check` exit 0, `npm run package` exit 0. `sips -g hasAlpha` 두 PNG 모두 yes. ZIP에 런타임 파일 12개(이미지 포함)만 들어 있음을 확인했다.

## v0.2.2 — 아이콘 형태와 크기 통일

사용자 수정: 다른 문서 모양 대신 같은 트레이/줄기에서 화살촉 한 줄·두 줄로 구분한다. 이미지젠으로 단일 저장 아이콘을 참조해 전체 저장 아이콘을 다시 생성했다. 실제 PNG의 알파 영역을 측정해 둘 다 22 CSS px의 시각적 크기 및 공통 중심에 맞췄다. 원본 픽셀은 수정하지 않았다. 측정 재현: `python3 scripts/measure-icons.py`.

브라우저 모의 화면의 실제 출력: nativeIconBox=24, opacity=1, 이미지 둘 다 loaded=true, 버튼 중심 x=[890,930,969]. 첫 두 버튼 사이 40px, 즐겨찾기까지 39px(경계선에 의한 1px 차이). 스크린샷을 읽어 같은 트레이와 한 줄/두 줄 화살촉, 즐겨찾기와의 크기·정렬을 확인했다.

- ego_space_name: harness-qa-browser-headless-insta-matched-icons-20261103
- ego_space_id: 26; ego_version: 0.6.1.13; 실행 exit 0
- finish_ok:true; spaces_remaining:0; handoff:false; 전면 비점유 unverified
- 검증용 스크린샷은 시각 확인 후 삭제했다.
- 최종 Chrome 설치본 다시 로드: `0.2.2`, `켜짐, 확장 프로그램 사용 설정됨, Value:1`. 갱신 전용 창 종료.


## 0.2.3 final icon refinement — 2026-11-03

- Built-in image_gen output inspected: single arrowhead shifted left, two thicker stepped right strokes. Runtime PNG replaced; CSS regenerated from measured alpha bounds (196,230,1058,1069), fitting a 22px glyph.
- npm test: 21 passed, 0 failed. npm run check and npm run package: exit 0, dist/insta-pick-0.2.3.zip.
- Earlier stepped variant fixture: ego_space_name=harness-qa-browser-headless-insta-final-icons-20261103, spaceId=27, icons=2, loaded=true, opacity=1; finish_ok=true, spaces_remaining=0. Final refinement inspected as an asset, no new browser QA run.
- Chrome page confirms 0.2.3 enabled after reload click; AXPress returned unverified/accessibility_action_unasserted, so actual new-asset loading in Instagram remains unverified. Refresh Instagram tabs.

## 0.2.4 — close-set shafts

Built-in generated PNG visually inspected: longer, closely grouped right shafts, one arrowhead. Measured alpha bounds (195,230,1059,1069); CSS canvas 31.931px. `npm test`: 21 passed, 0 failed; `npm run check` and `npm run package`: exit 0. Chrome reload changed displayed version from 0.2.3 to 0.2.4, enabled. Instagram rendering of this asset not independently re-tested.

## v0.2.5 — numeric badge

- npm test: 21 passed, 0 failed; npm run check and npm run package exit 0.
- Mac ego-browser nodejs (exit 0), ego 0.6.1.13, space 29, ego_space_name=harness-qa-browser-headless-insta-badge-20261103. Fixture displayed badge 3 and accessible label 게시물 전체 3개 저장; click produced saved=[[1,2,3]] (string IDs). Screenshot dist/badge-qa.png visually inspected, removed after verification. This is mocked download selection, not real file delivery.
- finish_ok=true, spaces_remaining=0, handoff=false. Foreground non-interference unverified. Final badge not verified on real Instagram.
- Chrome reload readback changed 0.2.4 to 0.2.5 and remained enabled. Refresh Instagram pages.

## v0.2.6 — default download folder

Changed existing filename expectations to basenames: npm test first failed four filename tests against old Instagram/post paths. Removed the directory prefix in filename(); npm test then passed all 21 tests. npm run check and npm run package exited 0. Chrome reload readback changed 0.2.5 to 0.2.6, enabled. No new real media download performed; filesystem delivery is not re-verified. Existing files remain in their original directories.

## v0.2.7 — feed singleton video (2026-11-03)

- Source baseline: 8f96ca8; local v0.2.7 working tree. macOS ego 0.6.1.13, guide 2.1.0.
- Reproduction: serve repository with `python3 -m http.server 8769 --bind 127.0.0.1`, open `/tests/inline-fixture.html?mode=single-video` using `ego-browser nodejs`. Before fix: `{visibleButtons:2,badge:'1'}`. After fix: `{visibleButtons:1}`, mock save `[["3"]]`. Default mixed carousel: `{carouselButtons:2}`, mock whole-post save `[["1","2","3"]]`. These are selection tests, not file delivery.
- One reload initially reused cached JS (wait timeout, exit 1; inspection confirmed old source). Disabled cache for the test page through CDP and reloaded; subsequent verification rounds exit 0.
- Separate report of missing button on the dedicated reel page remains unresolved: on a live Instagram reel, locally injected runtime with downloads disabled showed `{buttonCount:1,gap:16,centerDelta:0,hit:true}`. Home → Reels navigation also showed `{reelToolbars:1}`. This does not verify Chrome's installed extension or the user's specific reel. Requested its URL.
- `npm test`: exit 0, tests 21 / pass 21 / fail 0. `npm run check`: exit 0. `npm run package`: exit 0, `dist/insta-pick-0.2.7.zip`.
- ego_space_name: harness-qa-browser-headless-insta-single-20261103-fix; ego_space_id:30; finish_ok:true (once); spaces_remaining:0 after immediate follow-up query; handoff:false; foreground non-interference unverified. Ego update notice observed; no upgrade performed.
- Local HTTP server stopped. Chrome extension has not been reloaded for v0.2.7. No commit, push or release performed in this continuation.


### v0.2.7 follow-up — feed video overlay resolved

The user clarified that the missing button was in the screen opened by clicking a feed video. Direct opening did not reproduce it. A real feed video click reproduced: main video count 3, total video count 4, reel toolbars 0. The overlay video was outside main and not in a role=dialog. Changed the scanner from main video to video, preserving the single-video ancestor and viewport-center checks.

Final ego-browser nodejs live feed → overlay verification (exit 0): {outsideMain:true,buttons:1,gap:16,centerDelta:0,light:true,hit:true}. Screenshot inspected: white download icon above Like on the dark overlay. Closing it removed its toolbar (overlayCleanup:true). Live verification used locally injected runtime with downloads disabled, not Chrome's installed extension. The supplied reel was checked directly; feed-overlay reproduction used another available feed video with the same layout. No real file was downloaded.

Regression fixture ?mode=reel-overlay: video outside main, buttons 1, gap 16, light true; mock save [["3"]]. Final checks: single-video buttons 1/count 1; mixed carousel buttons 2/count 3. npm test 21 passed/0 failed; npm run check and npm run package exit 0. Package v0.2.7.

Mac ego 0.6.1.13/guide 2.1.0; ego_space_name=harness-qa-browser-auth-insta-missing-20261103; ego_space_id=31; finish_ok=true (once); spaces_remaining=0; handoff=false; foreground non-interference unverified. Two intermediate video clicks failed (exit 1: zero-size video, then presentation element intercept); observed screenshot and clicked its visible video surface. Final validation rounds exit 0. Temporary screenshot inspected then removed; local HTTP server stopped. Chrome extension requires reload followed by Instagram page refresh. No push/release performed.


## v0.2.8 — filename text only

Updated filename tests first: npm test exited 1 (19 pass / 2 fail), proving emoji and punctuation were preserved by the old implementation. After filtering: npm test exit 0 (21 pass / 0 fail), npm run check and npm run package exit 0. Tests cover family emoji, flags, skin tones, keycap digits, punctuation-only captions, Japanese/Korean text and sanitized fallback post codes. Symbols are removed before the ten-character limit. Sequence underscore and extension dot remain. Package: dist/insta-pick-0.2.8.zip. No browser download was performed; Chrome reload and Instagram page refresh are required. Existing downloaded files are unchanged.


## v0.2.9 — generated extension app icon

Built-in image_gen output and 128px runtime asset visually inspected. Source copied into docs/assets; sips produced 16/32/48/128px PNGs. Python/Pillow and zipfile validation confirmed each exact dimension, RGBA, manifest icons/action.default_icon path and ZIP inclusion. npm test exit 0 (21 pass, 0 fail), npm run check and npm run package exit 0. No new browser QA; installed Chrome icon appearance requires extension reload and remains unverified. Prompts and alpha limitation recorded in icon-prompts.md.


## v0.2.10 — store submission

Revision f8b2988. npm test 21/21 passed; npm run check, npm run package, git diff --check exit 0. ZIP validated with 56 runtime files including 40 locale message files; descriptions <=132 characters and default locale en. Store screenshot is 1280x800 RGB, showing the actual popup initial state, captured through ego and visually inspected. All 40 remote listing descriptions read back equal to local source after reload. Store submitted 2026-11-03, item eccbhihhmghhdfcjjcfmjceombbfmhbd, status 검토 대기 중. Approval/public availability remain unverified; this is a submission receipt only. See store-submission.md for lifecycle and evidence.
