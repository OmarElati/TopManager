// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "topmanager-5de0d.firebaseapp.com",
  projectId: "topmanager-5de0d",
  storageBucket: "topmanager-5de0d.appspot.com",
  messagingSenderId: "127769817999",
  appId: "1:127769817999:web:9a99f410bf693142e091fa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
