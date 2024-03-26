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

interface Position {
  row: number;
  col: number;
}

interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

// will have to change this when making responsive
const SQUARE_SIZE = 70;

const animateAIMove = (
  startPosition: Position,
  endPosition: Position,
  callback: () => void
) => {
  const pieceElement = document.querySelector(
    `.piece-selector-for-${startPosition.row}-${startPosition.col}`
  ) as HTMLElement | null;

  if (!pieceElement) return;

  const deltaX = (endPosition.col - startPosition.col) * SQUARE_SIZE;
  const deltaY = (endPosition.row - startPosition.row) * SQUARE_SIZE;

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

const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
};

interface PieceProps {
  color: PieceColor;
  position: { row: number; col: number };
  isSelected: boolean;
  isKing: boolean;
}

interface SquareProps {
  position: { row: number; col: number };
  onPieceDropped: (
    item: { color: PieceColor; position: { row: number; col: number } },
    position: { row: number; col: number }
  ) => void;
  onClick?: () => void;
  isPossibleMove?: boolean;
  children?: React.ReactNode;
  isSelected?: boolean;
  isLastMoveStart?: boolean;
  isLastMoveEnd?: boolean;
}

const Square: React.FC<SquareProps> = ({
  position,
  onPieceDropped,
  onClick,
  isPossibleMove,
  isSelected,
  children,
  isLastMoveStart,
  isLastMoveEnd,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item: any, monitor) => {
      const typedItem = item as {
        color: PieceColor;
        position: { row: number; col: number };
      };
      onPieceDropped(typedItem, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let backgroundColor = "";
  if (isOver) {
    backgroundColor = "#dead59";
  } else if (isLastMoveStart) {
    // backgroundColor = "#dead59";
    backgroundColor = "#579669";
  } else if (isLastMoveEnd) {
    // backgroundColor = "#dead59";
    backgroundColor = "#579669";
  }

  const squareStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`board-col ${isPossibleMove ? "possible-move" : ""} ${
        isSelected ? "selected" : ""
      }`}
      style={squareStyle}
    >
      {children}
    </div>
  );
};

const Game = () => {
  const location = useLocation();
  const state = location.state as {
    playerOneUser: string;
    playerTwoUser: string;
    gameMode: boolean;
  };
  const AI = state.playerTwoUser === "Minimax A/B 5";
  const playerTwoName = "Player two";
  const playerOne = new Player(state.playerOneUser, PieceColor.Red);
  const playerTwo = new Player(state.playerTwoUser, PieceColor.Black);
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
  const aiMoveTime = useRef(0);
  const movesHistory = useRef<Move[]>([]);
  const evaluatedScore = useRef(0);
  const aiNumOfPositions = useRef(0);

  const [userCountry, setUserCountry] = useState("");
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const db = getFirestore();
  const forceUpdate = useForceUpdate();

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

  const Piece: React.FC<PieceProps> = ({
    color,
    position,
    isSelected,
    isKing,
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "piece",
      item: { color, position },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`piece-${color}${isKing ? "-king" : ""} ${
          isSelected ? "-selected" : ""
        } ${isCurrentPlayer(color) ? "-turn" : ""}
        piece-selector-for-${position.row}-${position.col}
        `}
        style={{
          opacity: isDragging ? 0.5 : 1,
        }}
      ></div>
    );
  };

  const renderBoard = () => {
    return checkersBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((col, colIndex) => {
          const isPossibleMove = possibleMoves.some(
            (move) => move.endRow === rowIndex && move.endCol === colIndex
          );
          const isLastMoveEnd =
            lastMove.to.row === rowIndex && lastMove.to.col === colIndex;
          return (
            <Square
              key={colIndex}
              position={{ row: rowIndex, col: colIndex }}
              onPieceDropped={onPieceDropped}
              isPossibleMove={isPossibleMove}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              isSelected={
                selectedPiece.row === rowIndex && selectedPiece.col === colIndex
              }
              isLastMoveStart={
                lastMove.from.row === rowIndex && lastMove.from.col === colIndex
              }
              isLastMoveEnd={isLastMoveEnd}
            >
              {col && (
                <Piece
                  color={col.color}
                  position={{ row: rowIndex, col: colIndex }}
                  isSelected={
                    selectedPiece.row === rowIndex &&
                    selectedPiece.col === colIndex
                  }
                  isKing={col.isKing}
                />
              )}
            </Square>
          );
        })}
      </div>
    ));
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
              animateAIMove(
                { row: aiMove.startRow, col: aiMove.startCol },
                { row: aiMove.endRow, col: aiMove.endCol },
                () => resolve()
              );
            });
            console.log(aiMove);

            checkersGame.movePiece(
              aiMove.startRow,
              aiMove.startCol,
              aiMove.endRow,
              aiMove.endCol
            );
            playMoveSound();
            setCapturedRed(checkersGame.players[1].capturedPieces);
            setPlayerTwoScore(checkersGame.players[1].score);
            setLastMove({
              from: { row: aiMove.startRow, col: aiMove.startCol },
              to: { row: aiMove.endRow, col: aiMove.endCol },
            });
            const newGame = checkersGame.deepCopyGame();
            setCheckersGame(checkersGame);
            setCurrentTrackedBoard(checkersBoard);
            const newMove = {
              from: { row: aiMove.startRow, col: aiMove.startCol },
              to: { row: aiMove.endRow, col: aiMove.endCol },
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
          checkersGame,
          5
        );
        checkersGame.setAI(aiPlayer);
      }
    }
    handleAIMove();
  }, [AI, playerOne, state.gameMode]);

  // Handle selection of pieces, highlight potential moves and move pieces
  const handleCellClick = (rowIndex: number, colIndex: number) => {
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
      currentHistoryIndex >= history.length - 1
    ) {
      checkersGame.movePiece(
        selectedPiece.row,
        selectedPiece.col,
        rowIndex,
        colIndex
      );
      playMoveSound();
      setCapturedBlack(checkersGame.players[0].capturedPieces);
      setCapturedRed(checkersGame.players[1].capturedPieces);
      setPlayerOneScore(checkersGame.players[0].score);
      setPlayerTwoScore(checkersGame.players[1].score);
      setLastMove({
        from: { row: selectedPiece.row, col: selectedPiece.col },
        to: { row: rowIndex, col: colIndex },
      });

      // Refresh the state to reflect the move
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]);
      const newGame = checkersGame.deepCopyGame();
      setCheckersGame(checkersGame);
      setCurrentTrackedBoard(checkersBoard);
      const newMove = {
        from: { row: selectedPiece.row, col: selectedPiece.col },
        to: { row: rowIndex, col: colIndex },
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
    } else if (piece && piece.color === checkersGame.currentPlayer.color) {
      // Select the piece and show possible moves
      setSelectedPiece({ row: rowIndex, col: colIndex });
      setPossibleMoves(checkersGame.possibleMoves(rowIndex, colIndex));
    } else {
      // Invalid selection or not the player's turn
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]);
    }
  };

  // Handles drag and drop of pieces to make moves
  const onPieceDropped = (
    item: { color: PieceColor; position: { row: number; col: number } },
    newPosition: { row: number; col: number }
  ) => {
    if (checkersGame.currentPlayer.color === item.color) {
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
        checkersGame.movePiece(startRow, startCol, endRow, endCol);
        playMoveSound();
        setCapturedBlack(checkersGame.players[0].capturedPieces);
        setCapturedRed(checkersGame.players[1].capturedPieces);
        setPlayerOneScore(checkersGame.players[0].score);
        setPlayerTwoScore(checkersGame.players[1].score);
        setLastMove({
          from: { row: startRow, col: startCol },
          to: { row: endRow, col: endCol },
        });
        setSelectedPiece({ row: -1, col: -1 });
        setPossibleMoves([]);
        const newGame = checkersGame.deepCopyGame();
        setCheckersGame(checkersGame);
        setCheckersBoard(checkersGame.board);
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
        forceUpdate();
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

  return (
    <>
      {/* End of game scorecard */}
      {gameStatus === State.gameFinished ? (
        <>
          <div className="game-backdrop"></div>
          <div className="game-finished">
            <img
              className="winner"
              src={
                checkersGame.winner === checkersGame.players[0]
                  ? redKing
                  : blackKing
              }
              alt=""
            />
            <h3>
              {checkersGame.winner
                ? `Winner: ${checkersGame.winner?.name}`
                : `It's a draw!`}
            </h3>
            <h3>
              Game Mode:{" "}
              {checkersGame.forcedJumps ? "Forced Captures" : "Normal"}
            </h3>
            <div className="player-names">
              <h4>
                {userCountry && (
                  <ReactCountryFlag
                    countryCode={userCountry}
                    svg
                    style={{
                      marginRight: "10px",
                    }}
                    title={userCountry}
                  />
                )}
                {checkersGame.players[0].name}
              </h4>
              <div className="row-player-two">
                {checkersGame.players[1] instanceof CheckersAI ? (
                  <GiArtificialIntelligence />
                ) : (
                  <img
                    className="flag-world"
                    src={flagWorld}
                    alt=""
                    height={"45px"}
                    width={"45px"}
                  />
                )}
                <h4>
                  {state.playerTwoUser === ""
                    ? "Player Two"
                    : state.playerTwoUser}
                </h4>
              </div>
            </div>
            <div className="player-scores">
              <h4>Score: {checkersGame.players[0].score}</h4>
              <h4>Score: {checkersGame.players[1].score}</h4>
            </div>
            <div className="captured-pieces">
              <h4>Pieces Captured: {checkersGame.players[0].capturedPieces}</h4>
              <h4>Pieces Captured: {checkersGame.players[1].capturedPieces}</h4>
            </div>
            <div className="replay-buttons">
              <h4>Would you like to play again?</h4>
              <button className="mp-btn" onClick={replayGame}>
                Replay Match
              </button>
              <button className="ai-btn" onClick={differentMode}>
                Try a different mode?
              </button>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="game">
        <div className="game-container">
          {/* AI Analysis conditional section */}
          {checkersGame.players[1] instanceof CheckersAI ? (
            <div className="ai-analysis">
              <div className="header">
                <h5>AI analysis</h5>
              </div>
              <div className="info">
                <h6>Minimax Depth: 5</h6>
                <h6>
                  Number of positions analysed: {aiNumOfPositions.current}
                </h6>
                <h6>Time Taken: {aiMoveTime.current} ms</h6>
                <h6>
                  Chosen Move:{" "}
                  {checkersGame.playerTwoMoves.length > 0
                    ? `(${
                        checkersGame.playerTwoMoves[
                          checkersGame.playerTwoMoves.length - 1
                        ].startRow + 1
                      },
                  ${
                    checkersGame.playerTwoMoves[
                      checkersGame.playerTwoMoves.length - 1
                    ].startCol + 1
                  }) to 
                  (${
                    checkersGame.playerTwoMoves[
                      checkersGame.playerTwoMoves.length - 1
                    ].endRow + 1
                  }, 
                    ${
                      checkersGame.playerTwoMoves[
                        checkersGame.playerTwoMoves.length - 1
                      ].endCol + 1
                    })`
                    : ""}
                </h6>
                <h6>Evaluated Score of Move: {evaluatedScore.current}</h6>
              </div>
              <div className="heuristic">
                <h5>AI's Prioritisation Metric</h5>
                <h6>Comparison of Kings: Difference x 20</h6>
                <h6>Comparison of regular pieces: Difference x 15</h6>
                <h6>
                  Opponent's Possible Captures: - No. of Captures available
                </h6>
                <h6>Central box: +/- 3 for every Black/Red Piece</h6>
                <h6>Back Row Guard (For first 10 turns): +/- 10 Black/Red</h6>
                <h6>Basic Piece Protection: +6 per piece protected</h6>
                <h6>Pyramid Formation (For first 15 turns): + 5-15</h6>
                <h6>Vulnerable Pieces: -/+ 6 Black/Red</h6>
                <h6></h6>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="main">
            <div className="opponent-card">
              <div className="first-col">
                {checkersGame.players[1] instanceof CheckersAI ? (
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
                <div className="board">{renderBoard()}</div>
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
          <div className="game-info">
            <div className="history-section">
              <h5>History of Moves (Row, Column): </h5>
              {movesHistory.current.map((move, index) => (
                <h6 key={index}>
                  {index + 1}. ({move.from.row + 1}, {move.from.col + 1}) to (
                  {move.to.row + 1}, {move.to.col + 1})
                </h6>
              ))}
            </div>
            <div className="buttons">
              <MdOutlineRestartAlt onClick={() => replayGame()} />
              <MdArrowBackIos onClick={() => renderPrevBoard()} />
              <BiCurrentLocation onClick={() => renderCurrentBoard()} />
              <GrNext onClick={() => renderNextBoard()} />
              <FaRegFlag onClick={() => resign()} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
