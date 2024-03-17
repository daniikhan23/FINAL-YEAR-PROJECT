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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { changeBodyBackground } = useStyle();

  useEffect(() => {
    changeBodyBackground(
      "https://t4.ftcdn.net/jpg/03/01/15/31/360_F_301153137_tQ3LWLbIduOkLWsssWIhQHu2BG99kRRU.jpg"
    );
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

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
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default Login;
