// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqMoy7EJDCqUATOmOfz0L7xxh9_rla2Gc",
  authDomain: "tchidash-fd7aa.firebaseapp.com",
  projectId: "tchidash-fd7aa",
  storageBucket: "tchidash-fd7aa.appspot.com",
  messagingSenderId: "694475827722",
  appId: "1:694475827722:web:60ab9ee30f226d13c04df3",
  measurementId: "G-YN929R7DYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);