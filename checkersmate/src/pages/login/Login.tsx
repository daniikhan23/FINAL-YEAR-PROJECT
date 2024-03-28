import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../config/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/login.css";
import RedKing from "../../assets/img/redKing.png";
import BlackKing from "../../assets/img/blackKing.png";
import { Link } from "react-router-dom";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Provides a login interface for users to access their CheckersMate account.
 * Users can enter their email and password to log in. The form also provides links
 * to sign up for a new account or to reset the password.
 */
const Login = () => {
  // State hooks for managing user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Context hook for changing body background
  const { changeBodyBackground } = useStyle();

  /**
   * Sets the background image on component mount and reverts it back on unmount.
   */
  useEffect(() => {
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  /**
   * Attempts to log the user in with the provided email and password.
   * On success, navigates to the homepage. On failure, displays an error message.
   */
  const loginUser = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          toast.success("User logged in successfully!");
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(`Error logging in: ${errorCode} - ${errorMessage}`);
        });
    } else {
      toast.error("Please enter a valid email and password!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main">
        <form
          className="main-login-container"
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
        >
          <div className="main-header">
            <h3>Login to your CheckersMate account!</h3>
          </div>
          <div className="main-central-img">
            <img src={BlackKing} alt="" className="black" />
            <img src={RedKing} alt="" className="red" />
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
          </div>
          <div className="flex-container">
            <div className="main-central-btn">
              <button type="submit">Login</button>
            </div>
            <div className="signup-btn">
              <button>
                <Link className="signup-link" to="/signup">
                  Don't have an account?
                </Link>
              </button>
              <button>
                <Link className="signup-link" to="/reset-password">
                  Reset Password
                </Link>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
