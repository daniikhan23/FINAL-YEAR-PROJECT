import React from "react";
import { Link } from "react-router-dom";
import "../../css/navbar-styling.css";

const Navbar = () => {
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
                <Link to="/signup">Sign Up</Link>
              </button>
            </li>
            <li>
              <button>
                <Link to="/login">Login</Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
