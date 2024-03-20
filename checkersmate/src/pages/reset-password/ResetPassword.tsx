import { useState, useEffect, FormEvent } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../config/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/reset-password.css";
import { useStyle } from "../../context/StyleContext";
import RedKing from "../../assets/img/redKing.png";
import BlackKing from "../../assets/img/blackKing.png";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/img/background.png";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { changeBodyBackground } = useStyle();

  useEffect(() => {
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address!");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success(
          "Password reset email sent successfully. Please check your inbox."
        );
      })
      .catch((error) => {
        toast.error(`Error sending password reset email: ${error.message}`);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="main">
        <form
          className="main-reset-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword(e);
          }}
        >
          <div className="main-header">
            <h3>Reset Password</h3>
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
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex-container">
            <div className="main-central-btn">
              <button type="submit">Reset</button>
            </div>
            <button className="main-login-btn">
              <Link to="/">Login instead</Link>
            </button>
          </div>
        </form>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default ResetPassword;
