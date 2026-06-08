// Creates the admin profile in Firestore for an existing Firebase Auth user
// Run: node fix-admin.mjs <email> <password> <name>
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0",
  authDomain: "la-grandezza.firebaseapp.com",
  projectId: "la-grandezza",
  storageBucket: "la-grandezza.firebasestorage.app",
  messagingSenderId: "497136272235",
  appId: "1:497136272235:web:08761f5f23098cd65b022e",
};

const [,, email, password, name = "Lewis Mwangi"] = process.argv;
if (!email || !password) {
  console.error("Usage: node fix-admin.mjs <email> <password> [name]");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log(`Signing in as ${email}...`);
const cred = await signInWithEmailAndPassword(auth, email, password);
const uid = cred.user.uid;
console.log("✅ Signed in, UID:", uid);

// Check existing admins to determine role
const snap = await getDocs(collection(db, "admins"));
const role = snap.empty ? "super" : "admin";

const account = {
  id: uid,
  name,
  email: email.toLowerCase(),
  role,
  createdAt: new Date().toISOString(),
};

await setDoc(doc(db, "admins", uid), account);
console.log(`✅ Admin profile saved: ${name} (${role})`);
console.log("\nDone! You can now log in at /admin/login");
process.exit(0);
