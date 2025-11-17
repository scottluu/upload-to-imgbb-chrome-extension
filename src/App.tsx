import { useEffect, useState } from "react";
import "./App.css";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [expiresIn, setExpiresIn] = useState<number | undefined>(undefined);
  const [hideApiKey, setHideApiKey] = useState(true);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  // Load existing API key from chrome storage
  useEffect(() => {
    try {
      chrome.storage.sync.get(["apiKey"], (res) => {
        if (res && typeof res.apiKey === "string") {
          setApiKey(res.apiKey);
        }
      });
      chrome.storage.sync.get(["expiresIn"], (res) => {
        if (res && typeof res.expiresIn === "number") {
          setExpiresIn(res.expiresIn);
        }
      });
    } catch (e) {
      // noop for non-extension environments
    }
  }, []);

  const saveApiKey = () => {
    setStatus("saving");
    try {
      chrome.storage.sync.set({ apiKey: apiKey.trim() }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to save API key:",
            chrome.runtime.lastError.message,
          );
          setStatus("error");
          return;
        }
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
      });
    } catch (e) {
      console.error(
        "Saving API key is only available in extension context.",
        e,
      );
      setStatus("error");
    }
  };
  const saveExpiresIn = () => {
    setStatus("saving");
    try {
      chrome.storage.sync.set({ expiresIn: expiresIn }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to save expires in:",
            chrome.runtime.lastError.message,
          );
          setStatus("error");
          return;
        }
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
      });
    } catch (e) {
      console.error(
        "Saving Expires In is only available in extension context.",
        e,
      );
      setStatus("error");
    }
  };

  return (
    <>
      <div></div>
      <h1>Upload to Imgbb</h1>
      <div className="card" style={{ textAlign: "left" }}>
        <h2>API key configuration</h2>
        <p style={{ marginTop: 0 }}>
          This extension requires an{" "}
          <a href={"https://api.imgbb.com/"} target={"_blank"}>
            ImgBB API key
          </a>{" "}
          to upload images. Enter your key below and click Save.
        </p>
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <button
            onClick={() => setHideApiKey((prevState) => !prevState)}
            style={{ fontSize: "xx-small" }}
          >
            {hideApiKey ? (
              <VisibilityOffRoundedIcon />
            ) : (
              <VisibilityRoundedIcon />
            )}
          </button>
          <input
            type={hideApiKey ? "password" : "text"}
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button onClick={saveApiKey} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && <span style={{ color: "green" }}>Saved</span>}
          {status === "error" && (
            <span style={{ color: "crimson" }}>Failed to save</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#777" }}>
          Note: Uploads will be blocked until an API key is set. The key is
          stored using chrome.storage.sync.
        </p>
        <h2>Expiration configuration</h2>
        <p style={{ marginTop: 0 }}>
          Set an optional expiry in seconds. -1 for never expires, 60-15552000
        </p>
        <input
          type={"number"}
          placeholder="Set optional expiry"
          value={expiresIn ?? -1}
          onChange={(e) => setExpiresIn(Number.parseInt(e.target.value))}
          style={{ width: "100%", boxSizing: "border-box" }}
          disabled={status === "saving"}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button
            onClick={saveExpiresIn}
            disabled={
              status === "saving" ||
              (expiresIn !== undefined &&
                ((expiresIn < 60 && expiresIn !== -1) || expiresIn > 15552000))
            }
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && <span style={{ color: "green" }}>Saved</span>}
          {status === "error" && (
            <span style={{ color: "crimson" }}>Failed to save</span>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
