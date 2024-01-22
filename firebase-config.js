// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-MRVk43y9sdBc4RnC-vg67g8INOHLs-g",
  authDomain: "todoapp-dd451.firebaseapp.com",
  projectId: "todoapp-dd451",
  storageBucket: "todoapp-dd451.appspot.com",
  messagingSenderId: "106986604594",
  appId: "1:106986604594:web:c0b14047febcd4beb6d42b",
  measurementId: "G-47ZWPWEX17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)