# Chrome Web Store submission

Package: v0.2.10. Listing text source: store-listings.json (40 locales matching Translate Switch; popup/button UI remains Korean). Primary language: English. Category: Tools. Visibility: public, free. Do not claim original/4K quality, unrestricted downloading, official affiliation, support for Stories/live/profile-wide collection, or guaranteed Instagram compatibility.

References for structure only (not copied): Turbo Downloader for Instagram and Media Downloader for Instagram. Our descriptions state the implemented selection modes and limitations. Listing screenshots show the actual popup's initial state with explanatory text; no third-party Instagram photos are used.

Privacy URL: https://github.com/hada0127/instagram-media-downloader/blob/main/PRIVACY.md
Support URL: https://github.com/hada0127/instagram-media-downloader/issues
Homepage: https://github.com/hada0127/instagram-media-downloader

## Single purpose

Save Instagram photo/video items that the user owns or has permission to download, directly to their computer, individually or as selected items from a post.

## Permission explanations

- activeTab: Access the currently active Instagram post when the user opens the popup and requests a scan. No unrelated browsing is inspected.
- scripting: Run the bundled media collector in that Instagram tab after the user clicks the popup scan button. All executable code is packaged locally.
- downloads: Start user-requested photo/video downloads and report the status of those downloads in the popup.
- storage: Keep the collected popup media list (post URL, caption and media metadata/URLs) in chrome.storage.session for the current browser session; no analytics or persistent cloud storage.
- Instagram site access: Bundled content scripts add save controls to Instagram posts and Reels, identify the current media item, and read visible post information for the item-count badge. Files are downloaded only after a save action.

## Data handling declarations

The extension processes website content (captions, media/thumbnail URLs, media metadata) and current Instagram post URLs locally. Disclose website content and web history/current URLs if the dashboard asks about collected/handled data even when it stays on-device. Do not copy competitors' blanket “no data collected or used” claim. No unrelated browsing history, analytics, passwords/cookie values, health/payment/financial data or private communications are intentionally collected. Captions can incidentally include personal information; see privacy policy. No sale, advertising use, unrelated transfers or creditworthiness use. No remote code. Network JSON/media are data, not executable code.

## Review instructions

1. Open Instagram in a normal reviewer-controlled account and refresh after installing. No special paid account or developer test credentials are required. The extension has no separate login.
2. Open a photo/video post you own or are authorized to download. Inline buttons appear beside the bookmark; a complete single video has one save button. Multi-item posts also offer whole-post saving with an item count.
3. Open a Reel or click a feed video to expand it. A save button appears above Like. The interface is currently Korean; “현재 항목 저장” means save current item and “게시물 전체 저장” means save whole post.
4. Alternatively open the extension popup and click “게시물 읽어 오기” (read post), select items and use “선택 저장” (save selected) or “전체 저장” (save all). Files go to Chrome's default download folder.
5. Check Chrome download history for completion. Incomplete/unsupported collections display an error instead of pretending a whole post was saved. Instagram may require login and may change its endpoints.

Status (2026-11-03): submitted for review. Dashboard readback: “상태: 검토 대기 중” and “초안이 검토 대기 중입니다”. Not approved/published yet. Automatic publication after approval was checked in the submit dialog. Free/public, all available regions selected.

Item ID: eccbhihhmghhdfcjjcfmjceombbfmhbd
Package revision: f8b2988 (v0.2.10)
ZIP SHA-256: 05b95c10f3946af13958e8e75f8bd61f58fc0e9a7b72562fab966c327697d429

40 localized descriptions were read back after reload and matched docs/store-listings.json (checked:40, matched:40, mismatches:[]). The console uses iw internally for the displayed he locale; manifest locale remains he. Both website content and current-URL/web-history handling were declared; the no-sale/unrelated-use/creditworthiness certifications were selected. Remote code: No. Privacy URL read back and publicly returned HTTP 200. Review instructions saved without credentials; reviewers use their own authorized Instagram session.

Mac ego-browser nodejs, ego 0.6.1.13/guide 2.1.0. Space: harness-qa-upload-insta-store-20261103 (32). Initial Google reauthentication was handed to the user, then resumed after confirmation. Final upload/save/readback/submission/status rounds exited 0. Intermediate selector/transition waits failed; DOM inspection showed delayed menu transitions and some unsaved locales. Missing descriptions were saved with observation of each new saving→saved transition, then all 40 were matched after reload. Final submission confirmation: “검토를 위해 확장 프로그램을(를) 제출함”, followed by the pending-review status above.

finish_ok:true, called once; spaces_remaining:0 on immediate follow-up query. No browser tabs or local HTTP server left running for this task. Foreground non-interference unverified. Ego upgrade notice observed; no upgrade performed.
