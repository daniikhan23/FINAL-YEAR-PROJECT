import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
export const firebaseConfig = {
    apiKey: "AIzaSyD3V84zQ95-MVOBE9LNdevIiZQJV2zJVBc",
    authDomain: "checkersmate.firebaseapp.com",
    databaseURL: "https://checkersmate-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "checkersmate",
    storageBucket: "checkersmate.appspot.com",
    messagingSenderId: "791442223987",
    appId: "1:791442223987:web:2b89ba8deafed9ea5c0b06",
    measurementId: "G-5XQ5K0FLK3"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//# sourceMappingURL=firebaseConfig.js.map