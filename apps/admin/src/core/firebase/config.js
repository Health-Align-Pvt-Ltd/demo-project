// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAs3lTcuxipXtuCcTbYt2ffWQnK6ZWi1qE",
  authDomain: "ats2-70396.firebaseapp.com",
  projectId: "ats2-70396",
  storageBucket: "ats2-70396.firebasestorage.app",
  messagingSenderId: "727414773108",
  appId: "1:727414773108:web:d481797b04f38011e5c821",
  measurementId: "G-HTGDV8WW05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Firebase messaging not supported:', error);
  }
}

export { messaging };

// Uncomment for development with Firebase emulators
// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectStorageEmulator(storage, 'localhost', 9199);
// }

export default app;