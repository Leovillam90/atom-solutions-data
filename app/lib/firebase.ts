import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBW9yS4wPDE2H1f6sOV_N_Uhw36YeKeU5s",
  authDomain: "base-atom-web.firebaseapp.com",
  projectId: "base-atom-web",
  storageBucket: "base-atom-web.firebasestorage.app",
  messagingSenderId: "559594098178",
  appId: "1:559594098178:web:bd7fa8b4e336f2e83ee11b",
  measurementId: "G-X7XGH84EGE"
};

// Evita reinstanciar la App en recargas de Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);