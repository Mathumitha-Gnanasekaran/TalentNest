import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbex1TgLJ5_nk2NbPuwPSn-vu4bJw2gO4",
    authDomain: "paf-social-media.firebaseapp.com",
    projectId: "paf-social-media",
    storageBucket: "paf-social-media.appspot.com",
    messagingSenderId: "993550395938",
    appId: "1:993550395938:web:b8e3819aa70d5f927d387b",
    measurementId: "G-X01X4FL7PV"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const FBAuthProvider = new FacebookAuthProvider();

export {auth,provider,FBAuthProvider};