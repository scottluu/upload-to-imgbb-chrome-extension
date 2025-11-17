// Configure your upload endpoint here.
// Replace with your actual endpoint that accepts a form-data field containing base64 image data.
// For imgbb, the API requires an API key. This extension expects you to store it via the popup UI.
const UPLOAD_URL = "https://api.imgbb.com/1/upload";

// Context menu ID constant
const MENU_ID = "rehost_image_context";

chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu entry when right-clicking on images
  chrome.contextMenus.create(
    {
      id: MENU_ID,
      title: "Rehost image",
      contexts: ["image"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed creating context menu:",
          chrome.runtime.lastError.message,
        );
      }
    },
  );
});

// Helper: convert Blob to base64 (without the data:* prefix)
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // result is like: data:image/png;base64,AAAA...
      const commaIdx = result.indexOf(",");
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper: if src is already a data URL, extract base64 payload
function dataUrlToBase64(dataUrl: string): string | null {
  try {
    const commaIdx = dataUrl.indexOf(",");
    if (commaIdx === -1) return null;
    return dataUrl.slice(commaIdx + 1);
  } catch {
    return null;
  }
}

type UploadDataSchema = {
  url_viewer: string;
};

type UploadResponseSchema = {
  data: UploadDataSchema;
};

// Upload base64 image as multipart/form-data
async function uploadBase64(
  base64: string,
  filename?: string,
): Promise<UploadResponseSchema | string> {
  // Read API key from chrome.storage; uploading is blocked if missing
  const apiKey = await new Promise<string | undefined>((resolve) => {
    try {
      chrome.storage.sync.get(["apiKey"], (res) => resolve(res?.apiKey));
    } catch {
      resolve(undefined);
    }
  });

  if (!apiKey) {
    throw new Error(
      "Missing API key. Open the extension popup and set your API key first.",
    );
  }
  const expiresIn = await new Promise<Number | undefined>((resolve) => {
    try {
      chrome.storage.sync.get(["expiresIn"], (res) => resolve(res?.expiresIn));
    } catch {
      resolve(undefined);
    }
  });

  const form = new FormData();
  // Common name for the field is 'image' per many APIs; adjust as needed
  form.append("image", base64);
  if (filename) form.append("filename", filename);
  const params = new URLSearchParams({ key: apiKey });
  if (expiresIn !== undefined) {
    params.set("expiration", expiresIn.toString());
  }

  const res = await fetch(UPLOAD_URL + `?${params.toString()}`, {
    method: "POST",
    body: form,
    // Do not set Content-Type; the browser will set proper multipart boundary
    // mode: 'no-cors' // Uncomment if your endpoint doesn't support CORS and you don't need response
  });

  if (!res.ok) {
    const text = await (async () => {
      try {
        return await res.text();
      } catch {
        return "";
      }
    })();
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text}`);
  }

  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return;
  try {
    const srcUrl = info.srcUrl;
    if (!srcUrl) throw new Error("No image URL found.");

    let base64: string | null = null;
    let filename: string | undefined;

    if (srcUrl.startsWith("data:")) {
      base64 = dataUrlToBase64(srcUrl);
    } else {
      // Attempt to derive a filename
      try {
        const url = new URL(srcUrl);
        filename = url.pathname.split("/").pop() || undefined;
      } catch {}

      // Fetch the image and convert to base64
      const response = await fetch(srcUrl, { credentials: "omit" });
      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.status}`);
      const blob = await response.blob();
      base64 = await blobToBase64(blob);
    }

    if (!base64) throw new Error("Failed to obtain base64 for the image.");

    const result = await uploadBase64(base64, filename);
    console.log("Image rehosted successfully:", result);

    // Try to open the viewer URL in a new tab if provided by the API
    try {
      let viewerUrl: string | undefined;
      if (typeof result === "string") {
        try {
          const parsed = JSON.parse(result as unknown as string);
          viewerUrl = parsed?.data?.url_viewer as string | undefined;
        } catch {
          // result was plain text; ignore
        }
      } else if (result && typeof result === "object") {
        const maybe = result as UploadResponseSchema;
        viewerUrl = maybe?.data?.url_viewer;
      }

      if (viewerUrl) {
        await chrome.tabs.create({ url: viewerUrl });
      } else {
        console.warn("Upload succeeded but no url_viewer found in response.");
      }
    } catch (openErr) {
      console.error("Failed to open viewer URL:", openErr);
    }
  } catch (e) {
    console.error("Rehost image error:", e);
  }
});

// Keep the action click for debugging
chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked", tab);
});
