import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBP6dHiyDmOJU3LXqUGnFIclGwSWheELr8",
  authDomain: "appinspectoresmovi.firebaseapp.com",
  projectId: "appinspectoresmovi",
  storageBucket: "appinspectoresmovi.firebasestorage.app",
  messagingSenderId: "152035457286",
  appId: "1:152035457286:web:279b8b599af80678c48687",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
