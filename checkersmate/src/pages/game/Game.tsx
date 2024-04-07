import { useEffect, useState, useRef } from "react";
import { useStyle } from "../../context/StyleContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/game-styling.css";
import {
  CheckersPiece,
  PieceColor,
  State,
  Player,
  CheckersGame,
  Moves,
  CheckersBoard,
} from "../../components/game/checkersGame";
import { CheckersAI } from "../../components/game/checkersAI";
import { Board, Position } from "../../components/game/Board";
import GameFinished from "../../components/game/GameFinished";
import GameInfo from "../../components/game/GameInfo";
import AIAnalysis from "../../components/game/AIAnalysis";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import backgroundImage from "../../assets/img/background.png";
import blackKing from "../../assets/img/blackKingCustom.png";
import redKing from "../../assets/img/redKingCustom.png";
import flagWorld from "../../assets/img/flagOfTheWorld.jpg";
import { GiArtificialIntelligence } from "react-icons/gi";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useAuth } from "../../context/UserAuthContext";
import ReactCountryFlag from "react-country-flag";
import MoveSound from "../../assets/audio/move-sound.mp3";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Represents the profile data of a player including username, country, win/loss/draw record, and ratings.
 */
interface ProfileData {
  username: string;
  country: string;
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  rating: {
    normal: number;
    enforcedJumps: number;
  };
}

/**
 * Represents a move from one board position to another.
 */
interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

/**
 * The Game component orchestrates the logic and presentation of a checkers game. It manages game state,
 * handles user interactions, and renders the game board, AI analysis, game information, and game completion components.
 * This component leverages various hooks for state management and effects to handle game logic, AI moves,
 * resizing for responsive design, fetching user profile data, and updating user ratings after a game concludes.
 * It also incorporates drag-and-drop functionality for piece movement.
 *
 **/
const Game = () => {
  // State for the game setup, fetched from the URL parameters or defaults
  const location = useLocation();
  const state = location.state as {
    playerOneUser: string;
    playerTwoUser: string;
    gameMode: boolean;
  };
  const AI = state.playerTwoUser === "Minimax A/B 5"; // Check if the opponent is AI
  const playerOne = new Player(state.playerOneUser, PieceColor.Red, false);
  let playerTwo;
  if (state.playerTwoUser === "Minimax A/B 5") {
    playerTwo = new Player(state.playerTwoUser, PieceColor.Black, true);
  } else {
    playerTwo = new Player(state.playerTwoUser, PieceColor.Black, false);
  }
  // State initialization for game logic, board, and gameplay elements
  const [checkersGame, setCheckersGame] = useState(
    new CheckersGame(playerOne, playerTwo, state.gameMode)
  );
  const [checkersBoard, setCheckersBoard] = useState<
    (CheckersPiece | null)[][]
  >(checkersGame.board);
  const [currentTrackedBoard, setCurrentTrackedBoard] = useState<
    (CheckersPiece | null)[][]
  >(checkersGame.board);
  const [history, setHistory] = useState<(typeof checkersBoard)[]>([
    checkersGame.board.map((row) =>
      row.map((piece) => (piece ? piece.deepCopyPiece() : null))
    ),
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState(checkersGame.currentState);
  const [possibleMoves, setPossibleMoves] = useState<Moves[] | []>([]);
  const [selectedPiece, setSelectedPiece] = useState({ row: -1, col: -1 });
  const [lastMove, setLastMove] = useState({
    from: { row: -1, col: -1 },
    to: { row: -1, col: -1 },
  });
  const [capturedBlack, setCapturedBlack] = useState(0);
  const [capturedRed, setCapturedRed] = useState(0);
  const [playerOneScore, setPlayerOneScore] = useState(
    checkersGame.players[0].score
  );
  const [playerTwoScore, setPlayerTwoScore] = useState(
    checkersGame.players[1].score
  );
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    country: "",
    record: {
      wins: 0,
      losses: 0,
      draws: 0,
    },
    rating: {
      normal: 0,
      enforcedJumps: 0,
    },
  });

  // State for move animation adjustments and firebase integration
  const [squareSize, setSquareSize] = useState(
    getSquareSize(window.innerWidth)
  );
  const [userCountry, setUserCountry] = useState("");

  /**
   * Determines the square size based on the window width, optimizing for different screen sizes.
   *
   * @param {number} width - The current window width.
   * @returns {number} - The calculated square size.
   */
  function getSquareSize(width: number) {
    if (width < 576) {
      return 40; // Mobile
    } else if (width < 992) {
      return 50; //13ish'
    }
    return 65; // 15'
  }

  /**
   * Attaches an resize event listener to the window to adjust the square size used for animation of moves based on the screen size.
   */
  useEffect(() => {
    function handleResize() {
      setSquareSize(getSquareSize(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Animates the movement of a piece from a start position to an end position.
   *
   * @param {Position} startPosition - The starting position of the piece.
   * @param {Position} endPosition - The ending position of the piece.
   * @param {() => void} callback - A callback function to execute after the animation completes.
   */
  const animateMove = (
    startPosition: Position,
    endPosition: Position,
    callback: () => void
  ) => {
    const pieceElement = document.querySelector(
      `.piece-selector-for-${startPosition.row}-${startPosition.col}`
    ) as HTMLElement | null;

    if (!pieceElement) return;

    const deltaX = (endPosition.col - startPosition.col) * squareSize;
    const deltaY = (endPosition.row - startPosition.row) * squareSize;

    pieceElement.style.setProperty("--endX", `${deltaX}px`);
    pieceElement.style.setProperty("--endY", `${deltaY}px`);

    pieceElement.classList.add("piece-animation");

    pieceElement.addEventListener(
      "animationend",
      () => {
        pieceElement.classList.remove("piece-animation");
        pieceElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        callback();
      },
      { once: true }
    );
  };

  // Refs for handling AI analysis and delay for AI move
  const aiMoveTime = useRef(0);
  const movesHistory = useRef<Move[]>([]);
  const evaluatedScore = useRef(0);
  const aiNumOfPositions = useRef(0);
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const db = getFirestore();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const { changeBodyBackground } = useStyle();

  /**
   * Fetches the country information of the current user and sets the application's background.
   */
  useEffect(() => {
    const fetchPlayer1Country = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserCountry(userData.country);
        }
      }
    };
    fetchPlayer1Country();
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  /**
   * Fetches the profile data of the current user from the database.
   */
  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data() as ProfileData;
          setProfileData(userData);
        }
      }
    };
    fetchProfileData();
  }, [currentUser, db]);

  const isCurrentPlayer = (color: PieceColor) => {
    return checkersGame.currentPlayer.color === color;
  };

  /**
   * Renders the game board component with its current state including the board configuration,
   * selected piece, possible moves, and the last move made.
   *
   * @returns The Board component populated with the current game state.
   */
  const renderBoard = () => {
    return (
      <Board
        board={checkersBoard}
        onPieceDropped={onPieceDropped}
        selectedPiece={selectedPiece}
        possibleMoves={possibleMoves}
        handleCellClick={handleCellClick}
        lastMove={lastMove}
        isCurrentPlayerTurn={isCurrentPlayer}
      />
    );
  };

  /**
   * Handles the logic for an AI move also including timing and animation.
   *
   * @async
   * @example
   * await handleAIMove();
   */
  async function handleAIMove() {
    if (checkersGame.players[1] instanceof CheckersAI) {
      while (checkersGame.currentPlayer === checkersGame.players[1]) {
        const startTime = Date.now();
        const result = await checkersGame.players[1].makeMove();
        const endTime = Date.now();
        aiMoveTime.current = endTime - startTime;
        if (result !== null) {
          const aiMove = result[1];
          evaluatedScore.current = result[0];
          aiNumOfPositions.current = result[2];

          if (aiMove && currentHistoryIndex >= history.length - 1) {
            await delay(1000);
            await new Promise<void>((resolve) => {
              animateMove(
                { row: aiMove.startRow, col: aiMove.startCol },
                { row: aiMove.endRow, col: aiMove.endCol },
                () => resolve()
              );
            });
            handleMove(
              aiMove.startRow,
              aiMove.startCol,
              aiMove.endRow,
              aiMove.endCol
            );
          }
        }
      }
    }
  }

  /**
   * Initializes the AI player if the second player is an AI and handles AI moves.
   */
  useEffect(() => {
    if (!(checkersGame.players[1] instanceof CheckersAI)) {
      if (AI) {
        const aiPlayer = new CheckersAI(
          "Minimax A/B 5",
          PieceColor.Black,
          AI,
          checkersGame,
          5
        );
        checkersGame.setAI(aiPlayer);
      }
    }
    handleAIMove();
  });

  /**
   * Handles the user interaction with the game board when a cell (piece) is clicked.
   * Determines whether to select a piece, move a piece, or show possible moves.
   *
   * @param {number} rowIndex - The row index of the clicked cell (where piece is being moved).
   * @param {number} colIndex - The column index of the clicked cell (where piece is being moved).
   * @async
   */
  async function handleCellClick(rowIndex: number, colIndex: number) {
    // Deselect if the same piece is clicked again
    if (selectedPiece.row === rowIndex && selectedPiece.col === colIndex) {
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]);
      return;
    }
    const piece = checkersGame.getPiece(rowIndex, colIndex);
    const isPossibleMove = isMovePossible(rowIndex, colIndex);
    if (
      selectedPiece.row !== -1 &&
      isPossibleMove &&
      currentHistoryIndex >= history.length - 1 &&
      !(checkersGame.currentPlayer instanceof CheckersAI)
    ) {
      await new Promise<void>((resolve) => {
        animateMove(
          { row: selectedPiece.row, col: selectedPiece.col },
          { row: rowIndex, col: colIndex },
          () => resolve()
        );
      });
      handleMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex);
    } else if (piece && piece.color === checkersGame.currentPlayer.color) {
      // Select the piece and show possible moves
      setSelectedPiece({ row: rowIndex, col: colIndex });
      setPossibleMoves(checkersGame.possibleMoves(rowIndex, colIndex));
    } else {
      // Invalid selection or not the player's turn
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]);
    }
  }

  /**
   * Handles the logic when a piece is dropped onto a new position on the board.
   * Validates the move and updates the game state accordingly.
   *
   * @param {{ color: PieceColor; position: { row: number; col: number }}} item - The dragged piece's information.
   * @param {{ row: number; col: number }} newPosition - The new position where the piece is dropped.
   */
  const onPieceDropped = (
    item: { color: PieceColor; position: { row: number; col: number } },
    newPosition: { row: number; col: number }
  ) => {
    if (
      checkersGame.currentPlayer.color === item.color &&
      !(checkersGame.currentPlayer instanceof CheckersAI)
    ) {
      const startRow = item.position.row;
      const startCol = item.position.col;
      const endRow = newPosition.row;
      const endCol = newPosition.col;
      const piece = checkersGame.getPiece(startRow, startCol);
      setSelectedPiece({ row: startRow, col: startCol });
      const isPossibleMove = checkersGame.possibleMoves(startRow, startCol);
      setPossibleMoves(checkersGame.possibleMoves(startRow, startCol));

      const isValidMove = isPossibleMove.some(
        (move) =>
          move.startRow === startRow &&
          move.startCol === startCol &&
          move.endRow === endRow &&
          move.endCol === endCol
      );

      if (piece && isValidMove && currentHistoryIndex >= history.length - 1) {
        handleMove(startRow, startCol, endRow, endCol);
      }
    }
  };

  /**
   * Checks if the move to the specified position is possible based on the current game state.
   *
   * @param {number} rowIndex - The row index to check for a possible move.
   * @param {number} colIndex - The column index to check for a possible move.
   * @returns {boolean} - True if the move is possible, otherwise false.
   */
  const isMovePossible = (rowIndex: number, colIndex: number) => {
    return possibleMoves.some(
      (move) => move.endRow === rowIndex && move.endCol === colIndex
    );
  };

  /**
   * Initiates a game replay by reloading the page to reset the game state.
   */
  const replayGame = () => {
    window.location.reload();
  };

  /**
   * Navigates the user to Game Start page to select a different game mode.
   */
  const differentMode = () => {
    navigate("/game-start");
  };

  /**
   * Updates the player's rating and game record based on the game outcome.
   *
   * @async
   */
  const handleRatingChange = async () => {
    let updates = {};

    if (checkersGame.forcedJumps === false) {
      if (checkersGame.winner === checkersGame.players[0]) {
        updates = {
          "record.wins": increment(1),
          "rating.normal": increment(checkersGame.players[0].score * 5),
        };
      } else if (checkersGame.winner === checkersGame.players[1]) {
        updates = {
          "record.losses": increment(1),
          "rating.normal": increment(-checkersGame.players[1].score * 5),
        };
      } else {
        updates = {
          "record.draws": increment(1),
        };
      }
    } else {
      if (checkersGame.winner === checkersGame.players[0]) {
        updates = {
          "record.wins": increment(1),
          "rating.enforcedJumps": increment(checkersGame.players[0].score * 5),
        };
      } else if (checkersGame.winner === checkersGame.players[1]) {
        updates = {
          "record.losses": increment(1),
          "rating.enforcedJumps": increment(-checkersGame.players[1].score * 5),
        };
      } else {
        updates = {
          "record.draws": increment(1),
        };
      }
    }

    if (currentUser && Object.keys(updates).length > 0) {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, updates)
        .then(() => {
          toast.success(`Rating and Record updated!`);
        })
        .catch((error) => {
          toast.error(`Failed to update profile: ${error.message}`);
        });
    }
  };

  /**
   * Handles the player's action to resign from the current game.
   */
  const resign = () => {
    checkersGame.currentState = State.gameFinished;
    checkersGame.winner = checkersGame.players[1];
    setGameStatus(checkersGame.currentState);
    handleRatingChange();
  };

  /**
   * Renders the previous board state from the history.
   */
  const renderPrevBoard = () => {
    if (currentHistoryIndex > 0) {
      const prevBoardVersionIndex = currentHistoryIndex - 1;
      setCurrentTrackedBoard(history[prevBoardVersionIndex]);
      setCheckersBoard(history[prevBoardVersionIndex]);
      setCurrentHistoryIndex(prevBoardVersionIndex);
    } else {
      toast.error("Already at the beginning of the game history.");
    }
  };

  /**
   * Renders the next board state from the history or returns to the current state if at the latest state.
   */
  const renderNextBoard = () => {
    if (history.length > 1 && currentHistoryIndex < history.length - 1) {
      const nextBoardVersionIndex = currentHistoryIndex + 1;
      setCurrentTrackedBoard(history[nextBoardVersionIndex]);
      setCheckersBoard(history[nextBoardVersionIndex]);
      setCurrentHistoryIndex(nextBoardVersionIndex);
    } else if (currentHistoryIndex === history.length - 1) {
      renderCurrentBoard();
    } else {
      toast.error("Back at the latest state of the game.");
    }
  };

  /**
   * Renders the current board state based on the latest game state.
   */
  const renderCurrentBoard = () => {
    setCheckersBoard(checkersGame.board);
    setCurrentTrackedBoard(checkersBoard);
    setCurrentHistoryIndex(history.length - 1);
  };

  /**
   * Plays the move sound effect.
   */
  const playMoveSound = () => {
    const sound = new Audio(MoveSound);
    sound
      .play()
      .catch((error) => console.log("Error playing the sound:", error));
  };

  /**
   * Handles the movement of a piece from one position to another.
   * Updates the game related state, including the board and player scores.
   * Also checks for end game situation and updates player scores
   *
   * @param {number} startRow - The starting row of the piece.
   * @param {number} startCol - The starting column of the piece.
   * @param {number} endRow - The ending row of the move.
   * @param {number} endCol - The ending column of the move.
   */
  const handleMove = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => {
    checkersGame.movePiece(startRow, startCol, endRow, endCol);
    playMoveSound();
    setCapturedBlack(checkersGame.players[0].capturedPieces);
    setPlayerOneScore(checkersGame.players[0].score);
    setCapturedRed(checkersGame.players[1].capturedPieces);
    setPlayerTwoScore(checkersGame.players[1].score);
    setLastMove({
      from: { row: startRow, col: startCol },
      to: { row: endRow, col: endCol },
    });
    setSelectedPiece({ row: -1, col: -1 });
    setPossibleMoves([]);
    const newGame = checkersGame.deepCopyGame();
    setCheckersGame(checkersGame);
    setCurrentTrackedBoard(checkersBoard);
    const newMove = {
      from: { row: startRow, col: startCol },
      to: { row: endRow, col: endCol },
    };
    movesHistory.current.push(newMove);
    setHistory((currentHistory) => {
      const newBoardState = newGame.board.map((row) =>
        row.map((piece) => (piece ? piece.deepCopyPiece() : null))
      );
      const newHistory = [...currentHistory, newBoardState];
      setCurrentHistoryIndex(newHistory.length - 1);

      return newHistory;
    });
    checkersGame.checkEndOfGame();
    if (checkersGame.currentState === State.gameFinished) {
      setGameStatus(checkersGame.currentState);
      handleRatingChange();
    }
  };

  return (
    <>
      <ToastContainer />
      {gameStatus === State.gameFinished ? (
        <>
          <GameFinished
            winner={checkersGame.winner}
            players={[checkersGame.players[0], checkersGame.players[1]]}
            gameMode={checkersGame.forcedJumps}
            onReplayClick={replayGame}
            onChangeModeClick={differentMode}
            userCountry={userCountry}
          />
        </>
      ) : (
        ""
      )}
      <div className="game">
        <div className="game-container">
          {checkersGame.players[1].isAI ? (
            <AIAnalysis
              minimaxDepth={5}
              numOfPositions={aiNumOfPositions.current}
              aiMoveTime={aiMoveTime.current}
              playerTwoMoves={checkersGame.playerTwoMoves}
              evaluatedScore={evaluatedScore.current}
            />
          ) : (
            ""
          )}
          <div className="main">
            <div className="opponent-card">
              <div className="first-col">
                {checkersGame.players[1].isAI ? (
                  <GiArtificialIntelligence />
                ) : (
                  <img
                    className="flag-world"
                    src={flagWorld}
                    alt=""
                    height={"35px"}
                    width={"45px"}
                  />
                )}
                <div className="row">
                  <div className="column">
                    <h5>
                      {state.playerTwoUser === ""
                        ? "Player Two"
                        : state.playerTwoUser}
                    </h5>
                  </div>
                  <div className="column-captures">
                    <img className="red-captured" src={redKing} alt="" />
                    <h5>{`+ ${capturedRed}`}</h5>
                  </div>
                </div>
              </div>
              <h5 className="score">Score: {playerTwoScore}</h5>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="col">
                <div>A</div>
                <div>B</div>
                <div>C</div>
                <div>D</div>
                <div>E</div>
                <div>F</div>
                <div>G</div>
                <div>H</div>
              </div>
              <div className="board-container">
                <div className="row-left">
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                </div>
                {renderBoard()}
                <div className="row-right">
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                </div>
              </div>
              <div className="col">
                <div>A</div>
                <div>B</div>
                <div>C</div>
                <div>D</div>
                <div>E</div>
                <div>F</div>
                <div>G</div>
                <div>H</div>
              </div>
            </DndProvider>
            <div className="player-card">
              <div className="first-col">
                <div className="country-flag">
                  {userCountry && (
                    <ReactCountryFlag
                      countryCode={userCountry}
                      svg
                      title={userCountry}
                    />
                  )}
                </div>
                <div className="row">
                  <div className="column">
                    <h5>
                      {`${state.playerOneUser} 
                          (${profileData.rating.normal}/${profileData.rating.enforcedJumps})`}
                    </h5>
                  </div>
                  <div className="column-captures">
                    <img className="black-captured" src={blackKing} alt="" />
                    <h5>{`+${capturedBlack}`}</h5>
                  </div>
                </div>
              </div>
              <h5 className="score">Score: {playerOneScore}</h5>
            </div>
          </div>
          <GameInfo
            movesHistory={movesHistory.current}
            replayGame={replayGame}
            renderPrevBoard={renderPrevBoard}
            renderNextBoard={renderNextBoard}
            renderCurrentBoard={renderCurrentBoard}
            resign={resign}
          />
        </div>
      </div>
    </>
  );
};

export default Game;
