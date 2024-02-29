import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth();
const signUpUser = () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordRepeatInput = document.getElementById('password-repeat');
    if (emailInput && passwordInput && passwordRepeatInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const passwordRepeat = passwordRepeatInput.value;
        if (password === passwordRepeat) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                const user = userCredential.user;
                console.log("User created successfully with email: ", user.email);
            })
                .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error signing up:", errorMessage);
            });
        }
        else {
            console.error("Passwords do not match.");
        }
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.querySelector('.main-central-btn button');
    signUpButton === null || signUpButton === void 0 ? void 0 : signUpButton.addEventListener('click', signUpUser);
});
//# sourceMappingURL=signup.js.map