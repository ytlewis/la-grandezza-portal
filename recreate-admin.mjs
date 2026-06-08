// Run AFTER deleting the user from Firebase Console
// node recreate-admin.mjs
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0",
  authDomain: "la-grandezza.firebaseapp.com",
  projectId: "la-grandezza",
  storageBucket: "la-grandezza.firebasestorage.app",
  messagingSenderId: "497136272235",
  appId: "1:497136272235:web:08761f5f23098cd65b022e",
};

const email = "gathaiyalewis1122@gmail.com";
const password = "Lewis001!";
const name = "Lewis Mwangi";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let uid;
try {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  uid = cred.user.uid;
  console.log("✅ Firebase Auth account created, UID:", uid);
} catch (e) {
  if (e.code === "auth/email-already-in-use") {
    // Try signing in — maybe password was already reset
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      uid = cred.user.uid;
      console.log("✅ Signed in to existing account, UID:", uid);
    } catch {
      console.error("❌ Account exists but password is wrong.");
      console.error("   Go to: https://console.firebase.google.com/project/la-grandezza/authentication/users");
      console.error("   Delete the user gathaiyalewis1122@gmail.com, then run this script again.");
      process.exit(1);
    }
  } else {
    throw e;
  }
}

const snap = await getDocs(collection(db, "admins"));
const role = snap.empty ? "super" : "admin";

await setDoc(doc(db, "admins", uid), {
  id: uid, name, email: email.toLowerCase(), role,
  createdAt: new Date().toISOString(),
});

console.log(`✅ Admin profile saved: ${name} (${role})`);
console.log("\n🎉 Done! Log in at /admin/login");
console.log(`   Email:    ${email}`);
console.log(`   Password: ${password}`);
process.exit(0);
