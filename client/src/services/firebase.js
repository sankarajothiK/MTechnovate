import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCfbY_f0eJgOFvtyllSwU4fZW_dSLUPvWU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "m-technovate-attendance.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "m-technovate-attendance",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "m-technovate-attendance.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "50293975206",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:50293975206:web:1a840b192afebfccaeec67"
};

// Initialize Firebase singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
