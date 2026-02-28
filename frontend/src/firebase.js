// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0SyMnF6UpGltwVR7VGClgdrx1YfHYIBY",
  authDomain: "careeradvisor-85f16.firebaseapp.com",
  projectId: "careeradvisor-85f16",
  storageBucket: "careeradvisor-85f16.firebasestorage.app",
  messagingSenderId: "455617911913",
  appId: "1:455617911913:web:e414cfa853e91f6e6356f8",
  measurementId: "G-FZYE8P462X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);