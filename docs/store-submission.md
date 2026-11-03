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

Status: preparation; submission status must be read back from the dashboard before claiming review submission.
