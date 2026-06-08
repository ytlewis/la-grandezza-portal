// Deletes known Firebase Auth users one by one using their credentials
// Run: node reset-auth.mjs
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, deleteUser } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0",
  authDomain: "la-grandezza.firebaseapp.com",
  projectId: "la-grandezza",
  storageBucket: "la-grandezza.firebasestorage.app",
  messagingSenderId: "497136272235",
  appId: "1:497136272235:web:08761f5f23098cd65b022e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// All known accounts created during development
// Add any others you know about
const knownAccounts = [
  { email: "test@lagrandezza.com", password: "TestPassword123" },
];

// Also accept email+password from command line args
const [,, extraEmail, extraPassword] = process.argv;
if (extraEmail && extraPassword) {
  knownAccounts.push({ email: extraEmail, password: extraPassword });
}

let deleted = 0;

for (const account of knownAccounts) {
  try {
    const cred = await signInWithEmailAndPassword(auth, account.email, account.password);
    await deleteUser(cred.user);
    console.log(`✅ Deleted: ${account.email}`);
    deleted++;
  } catch (e) {
    const code = e.code ?? e.message;
    if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
      console.log(`⏭  Not found (already deleted): ${account.email}`);
    } else {
      console.log(`⚠️  Could not delete ${account.email}: ${code}`);
    }
  }
}

console.log(`\n✅ Done. Deleted ${deleted} user(s).`);
console.log("\nIf you have other accounts to delete, run:");
console.log("  node reset-auth.mjs <email> <password>");
console.log("\nOr delete remaining users at:");
console.log("  https://console.firebase.google.com/project/la-grandezza/authentication/users");
console.log("\nThen go to the live site → /admin/login → Create your Super Admin account.");
process.exit(0);
