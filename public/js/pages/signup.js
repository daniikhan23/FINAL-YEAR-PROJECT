import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const signUpUser = () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordRepeatInput = document.getElementById("password-repeat");
    if (emailInput && passwordInput && passwordRepeatInput) {
        const email = emailInput.value;
        console.log(email);
        const password = passwordInput.value;
        console.log(password);
        const passwordRepeat = passwordRepeatInput.value;
        console.log(passwordRepeat);
        if (password === passwordRepeat) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                const user = userCredential.user;
                console.log("User created successfully with email: ", user.email);
            })
                .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === "auth/email-already-in-use") {
                    console.error("Error signing up: Email already in use.");
                }
                else {
                    console.error("Error signing up:", errorMessage);
                }
            });
        }
        else {
            console.error("Passwords do not match.");
        }
    }
};
const signUpButton = document.querySelector(".main .main-container .main-central-btn");
signUpButton === null || signUpButton === void 0 ? void 0 : signUpButton.addEventListener("click", signUpUser);
//# sourceMappingURL=signup.js.map