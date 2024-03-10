// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyD3V84zQ95-MVOBE9LNdevIiZQJV2zJVBc",
  authDomain: "checkersmate.firebaseapp.com",
  databaseURL:
    "https://checkersmate-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "checkersmate",
  storageBucket: "checkersmate.appspot.com",
  messagingSenderId: "791442223987",
  appId: "1:791442223987:web:2b89ba8deafed9ea5c0b06",
  measurementId: "G-5XQ5K0FLK3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);