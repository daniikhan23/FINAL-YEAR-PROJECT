import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
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
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useAuth } from "../../context/UserAuthContext";
import ReactCountryFlag from "react-country-flag";
import { MdOutlineRestartAlt } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { FaRegFlag } from "react-icons/fa6";
import { BiCurrentLocation } from "react-icons/bi";
import MoveSound from "../../assets/audio/move-sound.mp3";

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

interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

const Game = () => {
  const location = useLocation();
  const state = location.state as {
    playerOneUser: string;
    playerTwoUser: string;
    gameMode: boolean;
  };
  const AI = state.playerTwoUser === "Minimax A/B 5";
  const playerOne = new Player(state.playerOneUser, PieceColor.Red, false);
  let playerTwo;
  if (state.playerTwoUser === "Minimax A/B 5") {
    playerTwo = new Player(state.playerTwoUser, PieceColor.Black, true);
  } else {
    playerTwo = new Player(state.playerTwoUser, PieceColor.Black, false);
  }
  const [checkersGame, setCheckersGame] = useState(
    new CheckersGame(playerOne, playerTwo, state.gameMode)
  );
  const [checkersBoard, setCheckersBoard] = useState<
    (CheckersPiece | null)[][]
  >(checkersGame.board);
  const [currentTrackedBoard, setCurrentTrackedBoard] = useState<
    (CheckersPiece | null)[][]
  >(checkersGame.board);
  const [history, setHistory] = useState<(typeof checkersBoard)[]>(
    // checkersGame.board
    [
      checkersGame.board.map((row) =>
        row.map((piece) => (piece ? piece.deepCopyPiece() : null))
      ),
    ]
  );
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

  const [squareSize, setSquareSize] = useState(
    getSquareSize(window.innerWidth)
  );
  const [userCountry, setUserCountry] = useState("");

  // Helper function to determine square size
  function getSquareSize(width: number) {
    if (width < 576) {
      return 40; // Mobile
    } else if (width < 992) {
      return 50; //13ish'
    }
    return 65; // 15'
  }

  // for animation on small screen
  useEffect(() => {
    function handleResize() {
      setSquareSize(getSquareSize(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

    // setting css variables for animation
    pieceElement.style.setProperty("--endX", `${deltaX}px`);
    pieceElement.style.setProperty("--endY", `${deltaY}px`);

    // add animation class
    pieceElement.classList.add("piece-animation");

    // ensure piece is visually moved to its new location after the aniamation ends
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
  useEffect(() => {
    const fetchPlayer1Country = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserCountry(userData.country);
          console.log(userCountry);
        }
      }
    };
    fetchPlayer1Country();
    // set background
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

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

  // handling AI move and animation asynchronously
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

  // Ensuring AI initialisation into the game
  useEffect(() => {
    // Check if it's AI's turn and the current player is an instance of CheckersAI
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

  // Handle selection of pieces, highlight potential moves and move pieces
  async function handleCellClick(rowIndex: number, colIndex: number) {
    // Deselect if the same piece is clicked again
    if (selectedPiece.row === rowIndex && selectedPiece.col === colIndex) {
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]);
      return;
    }

    const piece = checkersGame.getPiece(rowIndex, colIndex);
    const isPossibleMove = isMovePossible(rowIndex, colIndex);

    // Execute the move if a piece is selected and the target is a possible move
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

  // Handles drag and drop of pieces to make moves
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
      } else {
        console.log("invalid turn");
      }
    } else {
      console.log("Its not your turn");
    }
  };

  const isMovePossible = (rowIndex: number, colIndex: number) => {
    return possibleMoves.some(
      (move) => move.endRow === rowIndex && move.endCol === colIndex
    );
  };

  const replayGame = () => {
    window.location.reload();
  };

  const differentMode = () => {
    navigate("/game-start");
  };

  const handleRatingChange = async () => {
    console.log(currentUser);
    let updates = {};

    if (checkersGame.forcedJumps === false) {
      if (checkersGame.winner === checkersGame.players[0]) {
        updates = {
          "record.wins": increment(1),
          "rating.normal": increment(checkersGame.players[0].score * 10),
        };
      } else if (checkersGame.winner === checkersGame.players[1]) {
        updates = {
          "record.losses": increment(1),
          "rating.normal": increment(
            Math.min(0, -checkersGame.players[0].score * 10)
          ),
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
          "rating.enforcedJumps": increment(checkersGame.players[0].score * 10),
        };
      } else if (checkersGame.winner === checkersGame.players[1]) {
        updates = {
          "record.losses": increment(1),
          "rating.enforcedJumps": Math.min(
            0,
            -checkersGame.players[0].score * 10
          ),
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
          console.log("Profile updated successfully!");
        })
        .catch((error) => {
          console.log(`Failed to update profile: ${error.message}`);
        });
    }
    console.log("handleRatingChange called");
    console.log(updates);
  };

  const resign = () => {
    checkersGame.currentState = State.gameFinished;
    checkersGame.winner = checkersGame.players[1];
    setGameStatus(checkersGame.currentState);
    handleRatingChange();
  };

  const renderPrevBoard = () => {
    if (currentHistoryIndex > 0) {
      const prevBoardVersionIndex = currentHistoryIndex - 1;
      setCurrentTrackedBoard(history[prevBoardVersionIndex]);
      setCheckersBoard(history[prevBoardVersionIndex]);
      setCurrentHistoryIndex(prevBoardVersionIndex);
    } else {
      console.log("Already at the beginning of the game history.");
    }
  };

  const renderNextBoard = () => {
    if (history.length > 1 && currentHistoryIndex < history.length - 1) {
      const nextBoardVersionIndex = currentHistoryIndex + 1;
      setCurrentTrackedBoard(history[nextBoardVersionIndex]);
      setCheckersBoard(history[nextBoardVersionIndex]);
      setCurrentHistoryIndex(nextBoardVersionIndex);
    } else if (currentHistoryIndex === history.length - 1) {
      renderCurrentBoard();
    } else {
      console.log("Back at the latest state of the game.");
    }
  };

  const renderCurrentBoard = () => {
    setCheckersBoard(checkersGame.board);
    setCurrentTrackedBoard(checkersBoard);
    setCurrentHistoryIndex(history.length - 1);
  };

  const playMoveSound = () => {
    const sound = new Audio(MoveSound);
    sound
      .play()
      .catch((error) => console.log("Error playing the sound:", error));
  };

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
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
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
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
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
