// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4Y9BN25cxZxX3ODVDa5_iczoAicw8vWI",
  authDomain: "netflix-clone-c05df.firebaseapp.com",
  projectId: "netflix-clone-c05df",
  storageBucket: "netflix-clone-c05df.firebasestorage.app",
  messagingSenderId: "317310377165",
  appId: "1:317310377165:web:5567763aea3d6b46c01d84",
  measurementId: "G-2QJB2HNFHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app); // added Firestore
