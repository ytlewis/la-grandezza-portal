// Deploys Firestore rules via Firebase REST API (no CLI login needed)
// node deploy-rules.mjs
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0",
  authDomain: "la-grandezza.firebaseapp.com",
  projectId: "la-grandezza",
  storageBucket: "la-grandezza.firebasestorage.app",
  messagingSenderId: "497136272235",
  appId: "1:497136272235:web:08761f5f23098cd65b022e",
};

const PROJECT_ID = "la-grandezza";
const EMAIL = "gathaiyalewis1122@gmail.com";
const PASSWORD = "Lewis001!";

const RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teamMembers/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /portfolioItems/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /services/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /packages/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /config/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /admins/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == id;
    }
    match /testimonials/{id} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    match /bookings/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}`;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Signing in...");
const cred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
const token = await cred.user.getIdToken();
console.log("✅ Authenticated");

// Deploy rules via Firebase Rules REST API
const url = `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`;
const body = {
  source: {
    files: [{
      name: "firestore.rules",
      content: RULES,
    }]
  }
};

const rulesetRes = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

if (!rulesetRes.ok) {
  const err = await rulesetRes.text();
  console.error("❌ Failed to create ruleset:", err);
  process.exit(1);
}

const ruleset = await rulesetRes.json();
console.log("✅ Ruleset created:", ruleset.name);

// Now release the ruleset to the default Firestore database
const releaseUrl = `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/cloud.firestore`;
const releaseBody = { name: `projects/${PROJECT_ID}/releases/cloud.firestore`, rulesetName: ruleset.name };

const releaseRes = await fetch(releaseUrl, {
  method: "PATCH",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(releaseBody),
});

if (!releaseRes.ok) {
  const err = await releaseRes.text();
  // Try PUT if PATCH fails
  const putRes = await fetch(releaseUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(releaseBody),
  });
  if (!putRes.ok) {
    console.error("❌ Failed to release ruleset:", await putRes.text());
    process.exit(1);
  }
  console.log("✅ Rules deployed (PUT)");
} else {
  console.log("✅ Rules deployed (PATCH)");
}

console.log("\n🎉 Firestore rules are live!");
process.exit(0);
