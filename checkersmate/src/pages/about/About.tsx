import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.tsx";
import "../../css/about.css";
import CheckersCoolBoard from "../../assets/img/checkers-cool-board.jpg";
import Picture from "../../assets/img/pix-mate.jpg";

export default function About() {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* About Section */}
      <div className="about">
        <div className="about-container">
          <div className="container">
            <img className="intro-pic" src={CheckersCoolBoard} alt="" />
            <h3>About CheckersMate: A Haven for Strategy Enthusiasts</h3>
            <h5>
              A Passion for Strategy: At the heart of CheckersMate is a
              deep-rooted love for tactical gameplay and the timeless art of
              strategic thinking. Born from this passion is a digital sanctuary
              where the classic game of checkers comes to life.
            </h5>
            <h5>
              Your Digital Checkers Universe: CheckersMate isn't just a website;
              it's a world where checkers enthusiasts converge. This platform
              offers a variety of features to cater to all your checkers needs:
            </h5>
            <div className="lists">
              <ul>
                <li>
                  Home Page: Your gateway to the CheckersMate universe. Here,
                  you'll find updates, news, and fascinating insights into the
                  world of checkers.
                </li>
                <li>
                  The Game Page: This is where the magic happens. Choose your
                  battlefield:
                  <ul>
                    <li>
                      Local 2-Player Mode: Face off against friends or family in
                      a classic duel. Share the device and engage in a battle of
                      wits right at your fingertips.
                    </li>
                    <li>
                      AI Challenger: Ready for a solo adventure? Test your
                      skills against our sophisticated AI opponent. Whether
                      you're a beginner or a seasoned player, our AI adapts to
                      provide a challenging and rewarding experience.
                    </li>
                  </ul>
                </li>
                <li>
                  The Rules Page: New to the game or need a refresher? The
                  comprehensive rules page lays down the law of the land.
                </li>
              </ul>
            </div>
            <h4>
              More Than Just a Game: At CheckersMate, I believe in the power of
              strategy to sharpen minds and bring people together. Whether
              you're here to improve your tactical skills, enjoy a casual game,
              or delve into the rich history and strategy of checkers, you've
              come to the right place.
            </h4>
          </div>
        </div>
      </div>
      {/* About Me Section */}
      <div className="about-me">
        <div className="about-me-container">
          <div className="container">
            <img className="pix-mate" src={Picture} alt="" />
            <h4>A little hello from the creator</h4>
            <p>
              Hello there! I'm Daniyal, a passionate third-year Computer Science
              student at Royal Holloway University of London. CheckersMate is my
              brainchild, born from my final year project themed 'Playing Games
              and Solving Puzzles Using AI'.
            </p>
            <p>
              From the moment I was assigned this project, I knew I wanted to
              create something special. Combining my fascination with AI and a
              growing interest in web development, I embarked on this journey to
              bring you CheckersMate. It's more than just a game; it's a fusion
              of technology, strategy, and fun!
            </p>
            <h4>Why Checkers?</h4>
            <p>
              This project was an exciting opportunity to dive deep into the
              world of AI algorithms, particularly those used in strategic games
              like checkers and chess. The heart of our AI opponent in
              CheckersMate is the Minimax algorithm. Though currently
              straightforward and without alpha-beta pruning, it's a work in
              progress. I'm dedicated to evolving and enhancing it to make your
              AI adversary even more challenging.
            </p>
            <h4>The Joy of Web Development:</h4>
            <p>
              Building CheckersMate has been a thrilling ride in web
              development. It's a field that I've grown to love, and I'm excited
              to keep adding new features and improvements to this site. Stay
              tuned for some exciting updates!
            </p>
            <h4>Looking Ahead:</h4>
            <p>
              I'm captivated by game theory and the algorithms that teach
              computers to play strategic games. It's a fascinating world where
              logic, creativity, and technology intersect. Through CheckersMate,
              I hope to share this passion with you and provide a platform where
              fun and intellect go hand in hand.
            </p>
            <p>
              Thank you for joining me on this adventure. Your support and
              feedback are what fuel my journey in making CheckersMate a haven
              for strategy game lovers everywhere. Let's play, learn, and grow
              together!
            </p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
}
