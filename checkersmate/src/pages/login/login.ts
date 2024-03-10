// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { firebaseConfig } from "../../config/firebaseConfig";

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const login = () => {
//   const emailInput = document.getElementById("email") as HTMLInputElement;
//   const passwordInput = document.getElementById("password") as HTMLInputElement;

//   if (emailInput && passwordInput) {
//     const email = emailInput.value;
//     const password = passwordInput.value;

//     // Sign in the user
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         console.log("User logged in successfully");
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.error("Error logging in:", errorMessage);
//       });
//   }
// };

// const loginButton = document.querySelector(".main-central-btn button");
// loginButton?.addEventListener("click", login);
