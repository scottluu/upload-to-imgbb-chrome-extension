Upload to ImgBB — Rehost images from any page with a right‑click

Overview
- Instantly rehost images you find on the web to ImgBB. Right‑click any image and choose “Rehost image” — the extension uploads it to ImgBB and opens the viewer link in a new tab so you can share it immediately.

Why it’s useful
- Fast sharing: No need to save files locally or visit an upload page.
- Works almost everywhere: Supports normal image URLs and embedded data URLs.
- Privacy‑conscious: Only uploads when you explicitly choose the context‑menu action.

Key features
- Right‑click → “Rehost image” on any image element.
- Automatic base64 conversion and upload to ImgBB.
- Opens the resulting viewer URL in a new tab on success.
- Mandatory API key check to prevent accidental failed uploads.
- Optional expiration setting (e.g., 60 to 15,552,000 seconds, or -1 for never) passed to ImgBB when configured.

How it works
1. You configure your ImgBB API key in the extension’s popup once.
2. Right‑click any image on the web and select “Rehost image.”
3. The extension fetches the image, converts it to base64, and uploads it to ImgBB via their API.
4. After a successful upload, a new tab opens with the image’s viewer URL so you can copy/share it.

Setup required
- An ImgBB API key is required to upload. Open the extension popup, paste your key, and save.
- Optionally, set an expiration value (in seconds). Use -1 for never expire.

Permissions explained
- contextMenus: Adds the “Rehost image” item when you right‑click an image.
- storage: Saves your API key and optional expiration preference in Chrome sync storage.
- <all_urls> (host permissions): Allows the extension to fetch images from the pages you browse in order to rehost them.

Troubleshooting
- “Missing API key” error: Open the popup and save your ImgBB API key.
- CORS or upload errors: Ensure your key is valid and you have a stable connection. Check the extension’s service worker console (chrome://extensions → Details → Inspect views) for logs.
- No viewer link opened: Some responses may not include the expected field. The extension will log a warning if that happens.

Open source
- This extension is built with React + Vite and a Manifest V3 service worker. See the project README for build and development instructions.

Disclaimer
- This project is not affiliated with ImgBB. Use is subject to ImgBB’s terms and your API plan.
