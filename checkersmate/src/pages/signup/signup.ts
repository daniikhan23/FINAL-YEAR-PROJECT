import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../config/firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle signup
const signUpUser = () => {
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const passwordRepeatInput = document.getElementById(
    "password-repeat"
  ) as HTMLInputElement;

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
          // Signed in
          const user = userCredential.user;
          console.log("User created successfully with email: ", user.email);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/email-already-in-use") {
            console.error("Error signing up: Email already in use.");
            // Optionally, inform the user in the UI that the email is already in use.
          } else {
            console.error("Error signing up:", errorMessage);
          }
        });
    } else {
      console.error("Passwords do not match.");
    }
  }
};

const signUpButton = document.querySelector(
  ".main .main-container .main-central-btn"
);

signUpButton?.addEventListener("click", signUpUser);
