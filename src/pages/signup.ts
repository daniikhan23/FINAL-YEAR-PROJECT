import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Initialize Firebase
const auth = getAuth();

// Function to handle signup
const signUpUser = () => {
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const passwordRepeatInput = document.getElementById('password-repeat') as HTMLInputElement;

  if (emailInput && passwordInput && passwordRepeatInput) {
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordRepeat = passwordRepeatInput.value;

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
          console.error("Error signing up:", errorMessage);
        });
    } else {
      console.error("Passwords do not match.");
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const signUpButton = document.querySelector('.main-central-btn button');
  signUpButton?.addEventListener('click', signUpUser);
});
