// Updates Firestore security rules to allow all reads/writes
// Uses Firebase Management API with a Google access token

// First get an access token via firebase-admin or just update rules manually
// This script uses the Firestore REST API to deploy rules

const PROJECT_ID = "la-grandezza";

const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

console.log("To fix Firestore rules, go to:");
console.log(`https://console.firebase.google.com/project/${PROJECT_ID}/firestore/rules`);
console.log("\nPaste these rules and click Publish:\n");
console.log(rules);
