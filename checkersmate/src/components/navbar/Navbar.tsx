import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "../../css/navbar-styling.css";

const Navbar = () => {
  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successful");
      })
      .catch((error) => {
        toast.error(`Logout failed: ${error.message}`);
      });
  };
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="container">
          <div className="home">
            <button>
              <Link to="/">CheckersMate</Link>
            </button>
          </div>
          <ul className="list">
            <li>
              <button>
                <Link to="/rules">Rules</Link>
              </button>
            </li>
            <li>
              <button>
                <Link to="/game">Game</Link>
              </button>
            </li>
            <li>
              <button>
                <Link to="/about">About</Link>
              </button>
            </li>
            <li>
              <button>
                <Link to="/profile">Profile</Link>
              </button>
            </li>
            <li>
              <button onClick={logout}>
                <Link to="#">Log Out</Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
