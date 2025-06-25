// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiJjkQtvFbe0nyo6av2T6PRwV6fYW7b-M",
  authDomain: "quizrush-78cd7.firebaseapp.com",
  projectId: "quizrush-78cd7",
  storageBucket: "quizrush-78cd7.firebasestorage.app",
  messagingSenderId: "61656558352",
  appId: "1:61656558352:web:06dc1721262511e1b21395",
  measurementId: "G-FS3GQ495QX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
