// Sets CORS configuration for Firebase Storage bucket
// Run: node set-cors.mjs

import admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";

const projectId = "la-grandezza";
const bucketName = "la-grandezza.firebasestorage.app";

// Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS env var)
admin.initializeApp({
  projectId: projectId,
});

const storage = new Storage({ projectId });
const bucket = storage.bucket(bucketName);

const corsConfiguration = [
  {
    origin: [
      "https://la-grandezza-portal.vercel.app",
      "http://localhost:8080",
      "http://localhost:8081", 
      "http://localhost:8082",
      "https://la-grandezza-portal-git-main-lewis-projects-6eb496b8.vercel.app",
      "https://la-grandezza-portal-8q0h1o2kf-lewis-projects-6eb496b8.vercel.app",
    ],
    method: ["GET", "HEAD", "DELETE", "POST", "PUT", "PATCH", "OPTIONS"],
    responseHeader: ["Content-Type", "x-goog-meta-*", "Authorization"],
    maxAgeSeconds: 3600,
  },
];

console.log("Setting CORS for bucket:", bucketName);
bucket.setCorsConfiguration(corsConfiguration)
  .then(() => {
    console.log("✅ CORS configuration set successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Failed to set CORS:", err);
    process.exit(1);
  });
