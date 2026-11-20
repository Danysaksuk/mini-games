// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Add a Web App → copy the firebaseConfig values below
// 4. Enable Realtime Database → start in TEST mode
// 5. Set USE_FIREBASE = true
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ⚠️  Set to true AFTER filling in your Firebase config above
const USE_FIREBASE = false;
