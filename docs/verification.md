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
