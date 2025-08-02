// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAn0EKgniF1nXP8hA93z_8b8frdQKTtYys",
  authDomain: "upgrade-db8e7.firebaseapp.com",
  projectId: "upgrade-db8e7",
  storageBucket: "upgrade-db8e7.appspot.com",  // fixed here
  messagingSenderId: "636800868884",
  appId: "1:636800868884:web:ad6b28721a881cacdffd01",
  measurementId: "G-FL479MWW38",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider };
