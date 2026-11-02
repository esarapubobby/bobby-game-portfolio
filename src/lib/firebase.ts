import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDxLmD53jwyKnNK82GPB7UqAVsmfMCS19w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bobby-portfolio-b9f84.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bobby-portfolio-b9f84",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bobby-portfolio-b9f84.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "656115197298",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:656115197298:web:200d24a0a452e0f22469eb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JZYM4V7P48",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your_project_id' &&
  !firebaseConfig.apiKey.includes('your_firebase')
);

// Prevent multiple initialization across hot module reloads
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Initialize Analytics conditionally and only when supported in browser
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported()
    .then((yes) => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Graceful fallback for adblockers or unsupported environments
      analytics = null;
    });
}

export { app, auth, db, analytics, firebaseConfig };
