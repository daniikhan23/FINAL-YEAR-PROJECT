import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useStyle } from "../../context/StyleContext";
import { useLocation } from "react-router-dom";
import "../../css/game-styling.css";
import {
  CheckersPiece,
  PieceColor,
  State,
  Player,
  CheckersGame,
  Moves,
} from "../../components/game/checkersGame";
import { CheckersAI } from "../../components/game/checkersAI";
import regularBlack from "../../assets/img/blackBase.png";
import regularRed from "../../assets/img/redBase.png";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer, toast } from "react-toastify";
import backgroundImage from "../../assets/img/background.png";

interface Position {
  row: number;
  col: number;
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
  const AI = state.playerTwoUser === "AI";
  const playerOne = new Player(state.playerOneUser, PieceColor.Red);
  const playerTwo = new Player(state.playerTwoUser, PieceColor.Black);
  const [checkersGame, setCheckersGame] = useState(
    new CheckersGame(playerOne, playerTwo, state.gameMode)
  );
  const [history, setHistory] = useState<(CheckersPiece | null)[][]>(
    checkersGame.board
  );
  const [gameStatus, setGameStatus] = useState("");
  const [possibleMoves, setPossibleMoves] = useState<Moves[] | []>([]);
  const [selectedPiece, setSelectedPiece] = useState({ row: -1, col: -1 });
  const [lastMove, setLastMove] = useState({
    from: { row: -1, col: -1 },
    to: { row: -1, col: -1 },
  });
  const forceUpdate = useForceUpdate();

  // handling AI move and animation asynchronously
  async function handleAIMove() {
    if (checkersGame.players[1] instanceof CheckersAI) {
      while (checkersGame.currentPlayer === checkersGame.players[1]) {
        const aiMove = await checkersGame.players[1].makeMove();
        console.log(aiMove);

        if (aiMove) {
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
          setLastMove({
            from: { row: aiMove.startRow, col: aiMove.startCol },
            to: { row: aiMove.endRow, col: aiMove.endCol },
          });
          const newGame = checkersGame.deepCopyGame();
          setCheckersGame((checkersGame) => checkersGame);
          setHistory((currentHistory) => {
            const newBoardState: (CheckersPiece | null)[][] = newGame.board.map(
              (row) =>
                row.map((piece) => (piece ? piece.deepCopyPiece() : null))
            );
            return [
              ...currentHistory,
              newBoardState,
            ] as (CheckersPiece | null)[][];
          });
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
          "AI",
          PieceColor.Black,
          checkersGame,
          5
        );
        checkersGame.setAI(aiPlayer);
      }
    }
    handleAIMove();
  }, [AI, playerOne, state.gameMode]);

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

  const { changeBodyBackground } = useStyle();
  useEffect(() => {
    // set background
    changeBodyBackground(backgroundImage);

    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  const renderBoard = () => {
    return checkersGame.board.map((row, rowIndex) => (
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
    if (selectedPiece.row !== -1 && isPossibleMove) {
      checkersGame.movePiece(
        selectedPiece.row,
        selectedPiece.col,
        rowIndex,
        colIndex
      );
      setLastMove({
        from: { row: selectedPiece.row, col: selectedPiece.col },
        to: { row: rowIndex, col: colIndex },
      });
      // Refresh the state to reflect the move
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]);
      const newGame = checkersGame.deepCopyGame();
      setCheckersGame((checkersGame) => checkersGame);
      setHistory((currentHistory) => {
        const newBoardState: (CheckersPiece | null)[][] = newGame.board.map(
          (row) => row.map((piece) => (piece ? piece.deepCopyPiece() : null))
        );
        return [...currentHistory, newBoardState] as (CheckersPiece | null)[][];
      });
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

      if (piece && isValidMove) {
        checkersGame.movePiece(startRow, startCol, endRow, endCol);
        setLastMove({
          from: { row: startRow, col: startCol },
          to: { row: endRow, col: endCol },
        });
        setSelectedPiece({ row: -1, col: -1 });
        setPossibleMoves([]);
        const newGame = checkersGame.deepCopyGame();
        setCheckersGame((checkersGame) => checkersGame);
        setHistory((currentHistory) => {
          const newBoardState: (CheckersPiece | null)[][] = newGame.board.map(
            (row) => row.map((piece) => (piece ? piece.deepCopyPiece() : null))
          );
          return [
            ...currentHistory,
            newBoardState,
          ] as (CheckersPiece | null)[][];
        });
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

  return (
    <>
      <div className="game">
        <div className="game-container">
          <div className="ai-analysis">
            <h5>AI analysis</h5>
          </div>
          <div className="main">
            <div className="opponent-card">
              <h5>{state.playerTwoUser}</h5>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="board">{renderBoard()}</div>
            </DndProvider>
            <div className="player-card">
              <h5>{state.playerOneUser}</h5>
            </div>
          </div>
          <div className="history">
            <h5>History</h5>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default Game;
