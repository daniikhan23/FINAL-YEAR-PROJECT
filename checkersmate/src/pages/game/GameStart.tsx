import { useState, useEffect, ChangeEvent } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../../css/game-start.css";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";
import redKing from "../../assets/img/redKing.png";
import blackKing from "../../assets/img/blackKing.png";
import { useAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

const GameStart = () => {
  const [playerOneUser, setPlayerOneUser] = useState("");
  const [playerTwoUser, setPlayerTwoUser] = useState("");
  const [gameMode, setGameMode] = useState(false);
  const { currentUser } = useAuth();
  const db = getFirestore();
  const { changeBodyBackground } = useStyle();
  const navigate = useNavigate();
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

  const startGame = (vsAI: boolean) => {
    navigate("/game", {
      state: {
        playerOneUser,
        playerTwoUser: vsAI ? "Minimax A/B 5" : playerTwoUser,
        gameMode,
      },
    });
  };

  const handleGameModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGameMode(event.target.value !== "Normal");
  };

  const handlePlayerTwoName = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayerTwoUser(event.target.value);
  };

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
            <select
              value={gameMode ? "Forced Captures" : "Normal"}
              onChange={handleGameModeChange}
            >
              <option value="Normal">Normal</option>
              <option value="Forced Captures">Forced Captures</option>
            </select>
            <h4 className="player1">Player 1:</h4>
            <h5>{playerOneUser}</h5>
            <h4 className="player2">Player 2:</h4>
            <input
              type="text"
              value={playerTwoUser}
              onChange={handlePlayerTwoName}
              placeholder="Enter name"
              required
            />
            <button onClick={() => startGame(false)}>Local Play</button>
            <button onClick={() => startGame(true)}>Play vs AI</button>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default GameStart;
