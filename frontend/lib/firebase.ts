import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Mock Firebase configuration for preview
const mockFirebaseConfig = {
  apiKey: "AIzaSyCBq2f9NTegEYhUt0kER8_r3x8RTbe_Yms",
  authDomain: "healthybloom-66a92.firebaseapp.com",
  projectId: "healthybloom-66a92",
  storageBucket: "healthybloom-66a92.firebasestorage.app",
  messagingSenderId: "695338518013",
  appId: "1:695338518013:web:31dc1c9340a8c0a3a94594",
  measurementId: "G-99S4EFQ5QH",
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || mockFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || mockFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || mockFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || mockFirebaseConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || mockFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || mockFirebaseConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || mockFirebaseConfig.measurementId,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Get Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }

