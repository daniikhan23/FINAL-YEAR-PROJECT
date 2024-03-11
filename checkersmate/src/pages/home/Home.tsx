import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.tsx";
import "../../css/home-styling.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserGroup, faChessKing } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faChessKing } from "@fortawesome/free-regular-svg-icons";
import { faBarsProgress } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      {/*Header Section*/}
      <Navbar />
      {/* Intro Section */}
      <div className="intro">
        <div className="intro-container">
          <div className="container-fluid">
            <h1>Welcome to CheckersMate!</h1>
          </div>
        </div>
      </div>
      <div className="divider">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="title">Discover</h2>
              <div className="col">
                <h2 className="title-color">Checkers</h2>
              </div>
            </div>
            <div className="col">
              <div className="border-center">
                <span className="border-start"> </span>
              </div>
            </div>
            <div className="col">
              <p className="description">
                Why waste time and energy playing Chess, when Checkers is the
                next best thing?
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Cards Section */}
      <div className="cards">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card">
                <FontAwesomeIcon
                  icon={faUserGroup}
                  fontSize="200px"
                  style={{
                    color: "black",
                    margin: "10px",
                    marginBottom: "30px",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">Local Play</h5>
                  <p className="card-text">
                    Enjoy a relaxing match with a friend or just a really
                    competitive one if that's your thing...
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <FontAwesomeIcon
                  icon={faAndroid}
                  fontSize="200px"
                  style={{
                    color: "black",
                    margin: "10px",
                    marginBottom: "30px",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">Play Against the AI</h5>
                  <p className="card-text">
                    Discover the power of minimax and beat it, if you dare.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="card">
                <FontAwesomeIcon
                  icon={faChessKing}
                  fontSize="200px"
                  style={{
                    color: "black",
                    margin: "10px",
                    marginBottom: "30px",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">Become a King of the Game</h5>
                  <p className="card-text">
                    Take your piece to the end of the board and take complete
                    control.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <FontAwesomeIcon
                  icon={faBars}
                  fontSize="200px"
                  style={{
                    color: "black",
                    margin: "10px",
                    marginBottom: "30px",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">Stay tuned for more</h5>
                  <p className="card-text">
                    Many exciting updates coming in the next year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default Home;
