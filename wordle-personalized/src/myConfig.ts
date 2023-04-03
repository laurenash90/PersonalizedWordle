import { initializeApp, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAa7QMS-jkWRN9fLjKtluJLY9EvbKY0NmE",
  authDomain: "wordle-710a6.firebaseapp.com",
  projectId: "wordle-710a6",
  storageBucket: "wordle-710a6.appspot.com",
  messagingSenderId: "355095848343",
  appId: "1:355095848343:web:b1f1d735af713be5b250d2"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);