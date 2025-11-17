# React Chrome Extension Template

This is a template for creating a Chrome extension using React and [Vite](https://vitejs.dev/) with TypeScript.


## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Setup

1. Clone or fork the repository :

    ```sh
    # To clone
    git clone https://github.com/5tigerjelly/chrome-extension-react-template
    cd chrome-extension-react-template
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## 🏗️ Development

To start the development server:

```sh
npm run dev
```

This will start the Vite development server and open your default browser.

## 📦 Build 

To create a production build:

```sh
npm run build
```

This will generate the build files in the `build` directory.

## 🔗 Context Menu: Rehost Image

This template has been extended to add a right‑click context menu option on images named "Rehost image". When selected, the extension will:

- Retrieve the image (from the image URL or embedded data URL)
- Convert it to base64
- POST it as multipart/form-data to a configurable endpoint

Configuration:

- Set your upload endpoint in `src/background.ts` by changing the `UPLOAD_URL` constant.
- The payload uses field name `image` with the base64 string as its value, and includes an optional `filename`.

Permissions:

- The manifest includes `contextMenus` and `<all_urls>` host permissions to allow fetching images across sites.

Usage:

1. Build the extension: `npm run build`
2. Load the `build` directory in Chrome via `chrome://extensions` → Load unpacked
3. Right‑click on any image and choose "Rehost image"

## 🔐 Mandatory API Key Configuration

Uploads are blocked until you configure an API key.

How to configure:

1. Click the extension icon to open the popup.
2. In the popup, enter your API key in the "API key configuration" section and click Save.

Details:

- The API key is stored using `chrome.storage.sync` so it can sync across your Chrome profile.
- The background service reads the key before attempting an upload. If it is missing, the upload is aborted and an error is logged in the service worker console.
- For imgbb uploads, the key is sent as a `key` field in the multipart/form‑data payload, together with `image` (base64) and optional `filename`.

## 📂 Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click "Load unpacked" and select the `build` directory.

Your React app should now be loaded as a Chrome extension!

## 🗂️ Project Structure

- `public/`: Contains static files and the `manifest.json`.
- `src/`: Contains the React app source code.
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Contains the project dependencies and scripts.

## License

This project is licensed under the MIT License.