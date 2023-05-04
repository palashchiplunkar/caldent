// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1WE0SwVq2OA1GbGudSZaH63EdwjZtgJc",
  authDomain: "caldent-91065.firebaseapp.com",
  projectId: "caldent-91065",
  storageBucket: "caldent-91065.appspot.com",
  messagingSenderId: "474446756384",
  appId: "1:474446756384:web:4b024034df054314869a45"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);