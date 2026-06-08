# Vercel Environment Variables Setup

## Problem
The admin signup is failing because Firebase environment variables are not set in Vercel's deployment.

## Solution
Set the following environment variables in your Vercel project dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project (la-grandezza-portal or la-grandezzaevents)
3. Go to **Settings** → **Environment Variables**
4. Add each of these variables:

```
VITE_FIREBASE_API_KEY = AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0
VITE_FIREBASE_AUTH_DOMAIN = la-grandezza.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = la-grandezza
VITE_FIREBASE_STORAGE_BUCKET = la-grandezza.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 497136272235
VITE_FIREBASE_APP_ID = 1:497136272235:web:08761f5f23098cd65b022e
```

## Steps
1. Click "Add New" for each variable
2. Enter the name (e.g., VITE_FIREBASE_API_KEY)
3. Enter the value from above
4. Make sure it's available for "Production", "Preview", and "Development"
5. Click Save
6. After adding all variables, redeploy your project

## Redeploy
After setting all environment variables:
- Go to **Deployments** tab
- Click the three dots (...) on your latest deployment
- Select **Redeploy**

Or push a new commit to trigger automatic redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

## Verify
Once redeployed, try signing up again at:
- https://la-grandezzaevents.vercel.app/admin/login
- or https://la-grandezza-portal.vercel.app/admin/login
