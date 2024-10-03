// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtthshE_5sqmwnJc9JEjOXQWwqdd94fyQ",
  authDomain: "finance-expense-3afad.firebaseapp.com",
  projectId: "finance-expense-3afad",
  storageBucket: "finance-expense-3afad.appspot.com",
  messagingSenderId: "1034719704111",
  appId: "1:1034719704111:web:d7896d300106b58dc802da",
  measurementId: "G-R60DVWHJB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };