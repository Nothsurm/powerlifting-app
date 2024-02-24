// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "powerlifting-app-89b88.firebaseapp.com",
  projectId: "powerlifting-app-89b88",
  storageBucket: "powerlifting-app-89b88.appspot.com",
  messagingSenderId: "116227415780",
  appId: "1:116227415780:web:0d47a7852cb9498f75d6f1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);