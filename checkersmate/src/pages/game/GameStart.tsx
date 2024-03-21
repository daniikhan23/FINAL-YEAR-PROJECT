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
          <img src={redKing} alt="" className="redking" />
          <img src={blackKing} alt="" className="blackking" />
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default GameStart;
