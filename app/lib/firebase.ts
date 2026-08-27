import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBW9yS4wPDE2H1f6sOV_N_Uhw36YeKeU5s",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "base-atom-web.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "base-atom-web",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "base-atom-web.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "559594098178",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:559594098178:web:bd7fa8b4e336f2e83ee11b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-X7XGH84EGE"
};

// Singleton para Next.js / Turbopack
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;