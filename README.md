# Insta Pick ↘

인스타그램 게시물의 **사진·영상을 한 개씩, 선택한 항목만, 또는 전체 다운로드**하는 Chrome 확장 프로그램입니다.

> **v0.1.0 미리보기 버전** — 자동 테스트와 모의 데이터 브라우저 UI 검증을 완료했습니다. Chrome에 확장을 설치하고 활성화 상태를 확인했습니다. 실제 로그인된 Instagram에서 수집 및 파일 저장은 아직 검증하지 않았습니다. Instagram 비공식 웹 API 변경에 따라 수집이 실패할 수 있습니다.

## 설치

1. [Releases](https://github.com/hada0127/instagram-media-downloader/releases)에서 `insta-pick-0.1.0.zip`을 내려받아 압축을 풉니다.
2. Chrome 주소창에 `chrome://extensions`를 입력합니다.
3. 오른쪽 위 **개발자 모드**를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 누르고 `manifest.json`이 들어 있는 폴더를 선택합니다.
5. 도구 모음의 확장 프로그램 메뉴에서 **Insta Pick**을 고정합니다.

소스를 복제했다면 저장소 루트가 아닌 **`extension/` 폴더**를 선택합니다. Chrome 웹 스토어 배포본은 아닙니다.

## 사용

1. Instagram에 로그인하고 저장할 **게시물 또는 릴스**를 엽니다. `/p/…`, `/reel/…` 형식의 주소에서 사용합니다.
2. 확장 프로그램 → **게시물 읽어 오기**를 누릅니다.
3. **이 항목 저장**으로 하나만 저장하거나 체크박스로 여러 항목을 선택해 **선택 저장**을 누릅니다. **전체 저장**은 읽어 온 목록 전체를 저장합니다.
4. 기본 다운로드 폴더의 `Instagram/게시물번호/`에서 파일을 확인합니다. 사진과 영상은 개별 파일로 저장됩니다.

여러 장 게시물의 전체 데이터를 읽지 못하면 경고와 함께 화면에 로드된 항목만 보여줍니다. 이때 다음 장으로 넘기고 확장 프로그램을 다시 열어 읽으면 같은 탭·게시물 목록에 누적됩니다. 브라우저를 다시 시작하면 임시 목록은 사라집니다.

팝업을 닫아도 이미 시작한 다운로드는 Chrome이 처리합니다. 완료 여부는 `chrome://downloads`에서 확인합니다. Chrome의 ‘다운로드 전에 각 파일의 저장 위치 확인’ 설정에 따라 저장 창이 나타날 수 있습니다.

## 지원 범위와 한계

- 단일 사진, 여러 장 게시물, 사진·영상 혼합 게시물, 직접 MP4 주소를 확인할 수 있는 릴스/영상
- 제공받은 후보 중 가장 큰 해상도를 선택합니다. 원본 업로드 품질을 보장하지 않습니다.
- 여러 계정/프로필 전체 자동 수집, 스토리, 라이브, 스트리밍 조각 결합은 지원하지 않습니다.
- 접근 권한 우회 기능은 없습니다. 현재 로그인으로 열 수 있는 게시물에만 사용합니다.
- `blob:` 영상만 있고 실제 영상 주소가 없으면 저장할 수 없습니다. 영상의 표지 사진을 영상으로 대신 저장하지 않습니다.
- 로그인 만료·요청 제한·CDN 주소 만료 시 게시물을 새로고침하고 다시 읽습니다. 강제 재시도나 인증 우회를 하지 않습니다.
- 자신이 소유하거나 저장 권한이 있는 콘텐츠에 사용해 주세요.

## 개인정보와 권한

외부 수집 서버, 분석 도구, 계정 비밀번호 입력란이 없습니다. 게시물 읽기를 누를 때만 현재 Instagram 탭을 읽습니다. 데이터 요청은 Instagram, 파일 요청은 Instagram/Meta CDN으로 전송됩니다.

| 권한 | 용도 |
| --- | --- |
| `activeTab` | 사용자가 연 현재 탭에 일시적으로 접근 |
| `scripting` | 현재 게시물의 미디어 정보 읽기 |
| `downloads` | 파일 다운로드 및 완료/실패 확인 |
| `storage` | 브라우저 세션 동안 같은 탭의 수집 목록 유지 |

임시 목록에는 게시물 식별자와 미디어 URL이 포함됩니다. 디스크 영구 저장소나 외부 서버로 전송하지 않습니다. 쿠키를 별도로 읽거나 복사하지 않고, Instagram의 같은 출처 요청에 기존 로그인 상태를 사용합니다.

## 개발

Node.js 20 이상, Python 3. 외부 npm 의존성이나 빌드 단계 없이 동작합니다.

```sh
npm test
npm run check
npm run package
```

패키지: `dist/insta-pick-0.1.0.zip`. 상세 구조는 [설계 문서](docs/architecture.md), 검증 범위는 [검증 기록](docs/verification.md)을 참고하세요.

Chrome API 근거: [scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting), [downloads](https://developer.chrome.com/docs/extensions/reference/api/downloads), [storage](https://developer.chrome.com/docs/extensions/reference/api/storage).
