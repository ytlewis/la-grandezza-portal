import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── Wipe ALL legacy localStorage keys on every load ───────────────────────────
// This ensures deleted Firebase users can't log in via cached localStorage
// and removes any stale user data from old auth system
const LEGACY_KEYS = [
  "lg_admins",
  "lg_admin_session",
  "lg_current_admin",
  "lg_users",          // UserAuthContext stored user accounts here
  "lg_user_session",
];
LEGACY_KEYS.forEach(k => localStorage.removeItem(k));

// ── Bundle version — bump to force hard reload on all devices ─────────────────
const BUNDLE_VERSION = "v6-memory-cache";
if (localStorage.getItem("lg_bundle") !== BUNDLE_VERSION) {
  localStorage.setItem("lg_bundle", BUNDLE_VERSION);
  // Force a hard reload to pick up the latest bundle (clears browser cache)
  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    // Only reload on non-root to avoid infinite loop on first visit
  }
  // Clear session storage too
  sessionStorage.clear();
}

createRoot(document.getElementById("root")!).render(<App />);
