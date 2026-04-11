import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "stitchlyn-70ef0.firebaseapp.com",
  projectId: "stitchlyn-70ef0",
  storageBucket: "stitchlyn-70ef0.firebasestorage.app",
  messagingSenderId: "263256532900",
  appId: "1:263256532900:web:e247b58b211cac121cc331"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}