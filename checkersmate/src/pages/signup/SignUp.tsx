import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { countries } from "countries-list";
import ReactCountryFlag from "react-country-flag";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../config/firebaseConfig";
import { useAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/signup.css";
import RedKing from "../../assets/img/redKing.png";
import BlackKing from "../../assets/img/blackKing.png";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const countryOptions = Object.entries(countries)
  .map(([code, country]) => ({
    code,
    name: country.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const selectCountryOptions = countryOptions.map(({ code, name }) => ({
  value: code,
  label: (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ReactCountryFlag
        countryCode={code}
        svg
        style={{ marginRight: "10px" }}
      />
      {name}
    </div>
  ),
  searchableLabel: name,
}));

/**
 * Provides a form for users to sign up for a new account. It includes fields for email, full name,
 * username, country, password, and password confirmation. Upon form submission, it attempts to
 * create a new user with Firebase authentication and stores additional user information in Firestore.
 * The form also includes a country selector with flags, using `react-select` and `ReactCountryFlag`.
 * It manages form state with React hooks and uses toast notifications for feedback.
 */
const Signup = () => {
  const [email, setEmail] = useState(""); // Email input state
  const [fullName, setFullName] = useState(""); // Full name input state
  const [username, setUsername] = useState(""); // Username input state
  const [country, setCountry] = useState(""); // Country select state
  const [password, setPassword] = useState(""); // Password input state
  const [passwordRepeat, setPasswordRepeat] = useState(""); // Password repeat input state
  const navigate = useNavigate(); // Hook to navigate between routes
  const { currentUser } = useAuth();

  const { changeBodyBackground } = useStyle(); // Context hook for changing the body background

  /**
   * Sets the background image on component mount and reverts it back to default on unmount.
   */
  useEffect(() => {
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  /**
   * Attempts to sign up a new user with the provided email and password, validates the username
   * uniqueness within Firestore, and then stores user information in Firestore. It navigates
   * the user to the home page upon successful account creation.
   */
  const signUpUser = async () => {
    if (password !== passwordRepeat) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length > 8) {
      // Check if username already exists in FIrestore
      const usernameRef = doc(db, "usernames", username);
      const docSnap = await getDoc(usernameRef);
      if (docSnap.exists()) {
        toast.error("Username already taken");
        return;
      }

      // Attempt to create user with Firebase Auth and store additional information in Firestore
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await setDoc(doc(db, "users", user.uid), {
            fullName,
            username,
            email: user.email,
            country,
            record: { wins: 0, losses: 0, draws: 0 },
            rating: { normal: 0, enforcedJumps: 0 },
          });

          await setDoc(doc(db, "usernames", username), { userId: user.uid });
          toast.success(`User created successfully with email: ${user.email}`);
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          toast.error(`Error signing up: ${error.message}`);
        });
    } else {
      toast.error("Password too short!");
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Main Signup Form */}
      <div className="main">
        <form
          className="main-signup-container"
          onSubmit={(e) => {
            e.preventDefault();
            signUpUser();
          }}
        >
          <div className="main-header">
            <h3>Create your CheckersMate Account</h3>
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
            <label htmlFor="country">
              <b>Country</b>
            </label>
            <Select
              options={selectCountryOptions}
              onChange={(selectedOption) => {
                if (selectedOption !== null) {
                  setCountry(selectedOption.value);
                } else {
                  setCountry("");
                }
              }}
              className="country-select"
              isClearable={true}
              isSearchable={true}
              filterOption={(option, inputValue) => {
                if (
                  option.data &&
                  typeof option.data.searchableLabel === "string"
                ) {
                  return option.data.searchableLabel
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }
                return false;
              }}
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
    </>
  );
};

export default Signup;
