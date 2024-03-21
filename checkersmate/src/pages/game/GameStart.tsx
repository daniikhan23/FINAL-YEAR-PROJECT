import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../../css/game-start.css";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";
import redKing from "../../assets/img/redKing.png";
import blackKing from "../../assets/img/blackKing.png";
import { useAuth } from "../../context/UserAuthContext";

const GameStart = () => {
  const [playerOneUser, setPlayerOneUser] = useState("");
  const [playerTwoUser, setPlayerTwoUser] = useState("");
  const [gameMode, setGameMode] = useState(false);
  const { currentUser } = useAuth();
  const db = getFirestore();
  const { changeBodyBackground } = useStyle();
  useEffect(() => {
    const fetchPlayer1Username = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setPlayerOneUser(userData.username);
        }
      }
    };
    fetchPlayer1Username();
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
            <h4>Choose Game Mode:</h4>
            <h5>place a dropdown here</h5>
            <h4 className="player1">Player 1:</h4>
            <h5>{playerOneUser}</h5>
            <h4 className="player2">Player 2:</h4>
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
