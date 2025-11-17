# Privacy Policy

Effective date: 2025-11-16

This policy explains what data the "Upload to ImgBB" extension processes, how it is used, and your choices.

## Summary
- The extension only acts when you explicitly choose the “Rehost image” context‑menu action.
- Your API key and optional expiration setting are stored in Chrome’s sync storage, scoped to your Google/Chrome profile on devices you’re signed into with sync enabled.
- No analytics, advertising, or tracking libraries are included.

## Data the extension processes
When you use the extension, it may process the following data strictly to perform the requested upload:
- API key: The ImgBB API key you provide in the popup UI.
- Optional expiration (in seconds): If you set one, it is sent to ImgBB as the `expiration` parameter.
- Image content: The image you right‑click to rehost is fetched and converted to base64, then uploaded to ImgBB.
- Optional filename: When derivable from the image URL, a filename may be included in the upload payload.

The extension does not collect or store your browsing history, cookies, or page content unrelated to the selected image.

## How your data is used
- API key and optional expiration are used only to authenticate and parameterize uploads to ImgBB.
- Image data is transmitted directly to ImgBB’s upload API to complete the rehosting you requested.
- After a successful upload, the extension may open the `url_viewer` returned by ImgBB in a new tab for your convenience.

## Storage and retention
- API key and optional expiration are stored via `chrome.storage.sync` so they can sync across your Chrome profile. You can remove or change them at any time from the popup UI or by removing the extension.
- The extension does not store uploaded images or responses beyond what Chrome may keep in standard runtime memory or developer logs during the current session.

## Permissions used
- contextMenus: to show the “Rehost image” option when you right‑click an image.
- storage: to save your API key and optional expiration in Chrome sync storage.
- <all_urls> (host permissions): to fetch the image data from the page so it can be uploaded when you request it.

## Network requests and third parties
When you choose “Rehost image,” the extension sends a multipart/form‑data POST request to ImgBB’s API endpoint (by default `https://api.imgbb.com/1/upload`) including:
- `key`: your API key
- `image`: the base64‑encoded image
- `filename` (optional)
- `expiration` (optional, if you configured it)

Data sent to ImgBB is governed by ImgBB’s own terms and privacy practices. This extension is not affiliated with ImgBB and does not control their systems.

## Logging and diagnostics
- The extension writes basic success/error logs to the background service worker console to aid troubleshooting. These logs are local to your browser and are not transmitted to us.
- No remote telemetry or analytics are performed.

## Security
- API keys are stored using Chrome’s extension storage mechanism and are not transmitted anywhere except to ImgBB when you initiate an upload.
- The extension avoids adding extra headers like a fixed Content‑Type for uploads and relies on the browser to construct proper multipart boundaries.

## Your choices and controls
- You can edit or remove your API key and expiration at any time via the popup UI.
- You may uninstall the extension to stop all processing and remove stored settings from your browser.

## Children’s privacy
This extension is a utility for general audiences and does not knowingly collect personal information from children.

## Changes to this policy
If this policy changes, we will update this document. Your continued use of the extension after changes indicates acceptance of the updated policy.

## Contact
For questions or concerns, please use the support contact listed on the Chrome Web Store listing or open an issue in the project repository.
