import { useEffect } from "react";
import "../../css/game-start.css";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";
import redKing from "../../assets/img/redKing.png";
import blackKing from "../../assets/img/blackKing.png";

const GameStart = () => {
  const { changeBodyBackground } = useStyle();
  useEffect(() => {
    // set background
    changeBodyBackground(backgroundImage);

    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);
  return (
    <>
      <div className="game-start">
        <div className="game-start-container">
          <div className="img-header">
            <img src={redKing} alt="" className="redking" />
            <img src={blackKing} alt="" className="blackking" />
          </div>
          <div className="main">
            <h5>Choose Game Mode:</h5>
            <h5>place a dropdown here</h5>
            <h5 className="player1">Player 1:</h5>
            <h5>username</h5>
            <h5 className="player2">Player 2:</h5>
            <h5>opponent name</h5>
            <button>Local Play</button>
            <button>Play vs AI</button>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default GameStart;
