import { useState, useEffect, ChangeEvent } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../../css/game-start.css";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";
import redKing from "../../assets/img/redKing.png";
import blackKing from "../../assets/img/blackKing.png";
import { useAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

/**
 * The GameStart component allows users to configure and start a new game.
 * Users can select the game mode, specify the player names, and choose between local play and playing against an AI.
 * It fetches the current user's username from Firebase Firestore and sets it as Player 1.
 * The background image for the component is set on mount and reset on unmount.
 *
 * Uses `useNavigate` from `react-router-dom` to navigate to the game page with selected options.
 */
const GameStart = () => {
  // State to hold player usernames and game mode.
  const [playerOneUser, setPlayerOneUser] = useState("");
  const [playerTwoUser, setPlayerTwoUser] = useState("");

  // false for Normal, true for Forced Captures.
  const [gameMode, setGameMode] = useState(false);

  // Context and Firestore initialization for user authentication and data fetching.
  const { currentUser } = useAuth();
  const db = getFirestore();
  const { changeBodyBackground } = useStyle();
  const navigate = useNavigate();

  /**
   * Fetches the current user's username from Firestore and updates the component state.
   * Additionally, sets the background image for the page.
   */
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

  /**
   * Navigates to the game page with selected game options.
   *
   * @param {boolean} vsAI - Determines if the game will be played against an AI.
   */
  const startGame = (vsAI: boolean) => {
    navigate("/game", {
      state: {
        playerOneUser,
        playerTwoUser: vsAI ? "Minimax A/B 5" : playerTwoUser,
        gameMode,
      },
    });
  };

  /**
   * Handles changes to the game mode selection.
   *
   * @param {ChangeEvent<HTMLSelectElement>} event - The change event on the game mode select element.
   */
  const handleGameModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGameMode(event.target.value !== "Normal");
  };

  /**
   * Updates the state with the second player's name as entered in the input field.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event on the player two name input field.
   */
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
    </>
  );
};

export default GameStart;
