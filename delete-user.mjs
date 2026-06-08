// Deletes a Firebase Auth user by email using the Identity Toolkit REST API
// This uses the "lookup" endpoint to find the UID, then deletes via admin
// Run: node delete-user.mjs <email>
const API_KEY = "AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0";
const PROJECT_ID = "la-grandezza";

const email = process.argv[2];
if (!email) { console.error("Usage: node delete-user.mjs <email>"); process.exit(1); }

// Step 1: Look up the user by email to get their localId (UID)
const lookupRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, continueUri: "https://la-grandezza-portal.vercel.app" }),
  }
);
const lookupData = await lookupRes.json();
console.log("Lookup result:", JSON.stringify(lookupData, null, 2));

// Step 2: Use the signInWithPassword to get idToken (needs password)
// Since we don't have the password, use the admin approach via REST
// The accounts:delete endpoint requires an idToken OR we use the admin SDK

// Alternative: use the Firebase Auth emulator admin endpoint
const deleteRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:delete?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }
);
const deleteData = await deleteRes.json();
console.log("Delete result:", JSON.stringify(deleteData, null, 2));
process.exit(0);
