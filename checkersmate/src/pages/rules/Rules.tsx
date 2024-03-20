import { useEffect } from "react";
import { useStyle } from "../../context/StyleContext.tsx";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.tsx";
import "../../css/rules.css";
import CheckersBoard from "../../assets/img/checkers-board.png";
import RedBase from "../../assets/img/redBase.png";
import BlackBase from "../../assets/img/blackBase.png";
import RedKing from "../../assets/img/redKing.png";
import BlackKing from "../../assets/img/blackKing.png";
import ChainCaptures from "../../assets/img/chain-captures.png";
import KingPromotion from "../../assets/img/king-promotion.png";
import backgroundImage from "../../assets/img/background.png";

export default function Rules() {
  const { changeBodyBackground } = useStyle();
  useEffect(() => {
    // set background
    changeBodyBackground(backgroundImage);

    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);
  return (
    <>
      {/* Intro Section */}
      <div className="intro">
        <div className="intro-container">
          <div className="container">
            <h1>The Thrilling World of CheckersMate!</h1>
          </div>
        </div>
      </div>
      {/* Rules Section */}
      <div className="rules">
        <div className="rules-container">
          <div className="container">
            <div className="board">
              <h3>The Board: A Battlefield of Strategy</h3>
              <div className="row">
                <div className="col-text">
                  <ul>
                    <li>
                      Picture a classic 8x8 checkerboard. That's your arena.
                    </li>
                    <li>Each player commands an army of 12 brave pieces.</li>
                    <li>
                      The mission? To capture or block all enemy pieces. Lose
                      your army, and it's game over!
                    </li>
                    <li>
                      Stalemate Scenario: If neither side can move, it's a
                      showdown of scores. If you're tied, it's a noble draw.
                    </li>
                    <li>
                      Take your Time: With no ticking clock, every move can be a
                      masterstroke. Plot wisely!
                    </li>
                    <li>
                      Currently only 2 modes in the game:
                      <ul>
                        <li>Local multiplayer</li>
                        <li>Play vs the AI</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="col">
                  <img src={CheckersBoard} alt="" />
                </div>
              </div>
            </div>
            <div className="movement">
              <h3>The Art of Movement: Your Tactical Playbook</h3>
              <div className="row">
                <div className="col-text">
                  <ul>
                    <li>
                      Rookie Rules: Initially, your pieces march diagonally
                      forward - red charges upwards, black descends.
                    </li>
                    <li>
                      No Crashing: Pieces can't leapfrog directly onto an
                      occupied square. Respect personal space!
                    </li>
                    <li>
                      The Capture Crusade: Spot an enemy piece diagonally ahead
                      with an empty square behind it? Jump over and claim your
                      victory!
                    </li>
                    <li>
                      Chain Captures: If your piece can continue its capture
                      spree, keep the momentum! Jump until you can jump no more,
                      then pass the torch.
                    </li>
                    <li>
                      Job Promotion? Reach the farthest row, and your piece
                      ascends to royalty. Welcome to Kinghood!
                    </li>
                    <li>
                      Royalty Powers: Kings reign supreme. They stride both
                      forward and backward, capturing with regal authority in
                      any direction.
                    </li>
                  </ul>
                </div>
                <div className="col">
                  <div className="row-regular-pieces">
                    <img src={RedBase} alt="" />
                    <img src={BlackBase} alt="" />
                  </div>
                  <div className="row-king-pieces">
                    <img className="red-king" src={RedKing} alt="" />
                    <img className="black-king" src={BlackKing} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="scores">
              <h3>Scores: The Glory Points</h3>
              <div className="row">
                <div className="col">
                  <ul>
                    <li>Conquer a Pawn: +1 point. Every capture counts.</li>
                    <img className="captures" src={ChainCaptures} alt="" />
                    <li>
                      Dethrone a King: +2 points. A victory worthy of extra
                      honor.
                    </li>
                    <img className="promotion" src={KingPromotion} alt="" />
                  </ul>
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
}
