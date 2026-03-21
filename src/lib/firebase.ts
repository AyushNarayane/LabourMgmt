import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyxCehnp3mDL138LN18IpYVb2FVMLaSrE",
  authDomain: "vikas-b201e.firebaseapp.com",
  projectId: "vikas-b201e",
  storageBucket: "vikas-b201e.firebasestorage.app",
  messagingSenderId: "159082034637",
  appId: "1:159082034637:web:ee447e669b57ab162ac084",
};

// Initialize Firebase (prevent re-initialization in dev hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
