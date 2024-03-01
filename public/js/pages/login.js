import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const login = () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            console.log("User logged in successfully");
        })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error logging in:", errorMessage);
        });
    }
};
const loginButton = document.querySelector(".main-central-btn button");
loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", login);
//# sourceMappingURL=login.js.map