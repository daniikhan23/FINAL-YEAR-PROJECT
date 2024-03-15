import React, { useState } from "react";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../config/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/signup.css";
import RedKing from "../../assets/img/redKing.png";
import BlackKing from "../../assets/img/blackKing.png";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const signUpUser = () => {
    if (password === passwordRepeat) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success(`User created successfully with email: ${user.email}`);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/email-already-in-use") {
            toast.error("Error signing up: Email already in use.");
          } else {
            toast.error(`Error signing up: ${errorMessage}`);
          }
        });
    } else {
      toast.error("Passwords do not match.");
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Main Signup Form */}
      <div className="main">
        <form
          className="main-container"
          onSubmit={(e) => {
            e.preventDefault();
            signUpUser();
          }}
        >
          <div className="main-header">
            <h3>Create your CheckersMate account.</h3>
          </div>
          <div className="main-central-img">
            <img src={RedKing} alt="" className="red" />
            <img src={BlackKing} alt="" className="black" />
          </div>
          <div className="main-info-forms">
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter Email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="password-repeat">
              <b>Repeat Password</b>
            </label>
            <input
              id="password-repeat"
              type="password"
              placeholder="Repeat Password"
              name="password-repeat"
              required
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
          </div>
          <div className="flex-container">
            <div className="main-central-btn">
              <button type="submit">Sign Up</button>
            </div>
            <div className="login-btn">
              <button>
                <Link className="login-link" to="/login">
                  Login instead
                </Link>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default Signup;
