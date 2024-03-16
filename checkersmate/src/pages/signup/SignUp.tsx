import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../config/firebaseConfig";
import { User } from "firebase/auth";
import { useAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/signup.css";
import RedKing from "../../assets/img/redKing.png";
import BlackKing from "../../assets/img/blackKing.png";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // useEffect(() => {
  //   if (currentUser) {
  //     toast.info("You are already logged in!");
  //     navigate("/");
  //   }
  // }, [currentUser]);

  const signUpUser = async () => {
    if (password !== passwordRepeat) {
      toast.error("Passwords do not match!");
      return;
    }

    const usernameRef = doc(db, "usernames", username);
    const docSnap = await getDoc(usernameRef);
    if (docSnap.exists()) {
      toast.error("Username already taken");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          username,
          email: user.email,
        });

        await setDoc(doc(db, "usernames", username), { userId: user.uid });
        toast.success(`User created successfully with email: ${user.email}`);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        toast.error(`Error signing up: ${error.message}`);
      });
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
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="full-name">
              <b>Full Name</b>
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="Enter Full Name"
              name="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label htmlFor="username">
              <b>Username</b>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter Username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
