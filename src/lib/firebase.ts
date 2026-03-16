import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const configured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (!configured) {
  console.error("[Firebase] ❌ Env vars missing — data will NOT sync across devices.");
} else {
  console.log("[Firebase] ✅ Config loaded, project:", firebaseConfig.projectId);
}

const app = configured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const db = app ? getFirestore(app) : null;

if (db) {
  console.log("[Firebase] ✅ Firestore instance created");
} else {
  console.error("[Firebase] ❌ Firestore is null — all writes will be localStorage only");
}
