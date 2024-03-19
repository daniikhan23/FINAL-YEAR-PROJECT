import { useEffect, useState, useCallback } from "react";
import { useStyle } from "../../context/StyleContext";
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
}

const Piece: React.FC<PieceProps> = ({ color, position, isSelected }) => {
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
      className={`piece-${color} ${isSelected ? "piece-selected" : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    ></div>
  );
};

interface SquareProps {
  position: { row: number; col: number };
  onPieceDropped: (
    item: { color: PieceColor; position: { row: number; col: number } },
    position: { row: number; col: number }
  ) => void;
  onClick?: () => void;
  isPossibleMove?: boolean;
  children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({
  position,
  onPieceDropped,
  onClick,
  isPossibleMove,
  children,
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

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`board-col ${isPossibleMove ? "possible-move" : ""}`}
      style={{
        backgroundColor: isOver ? "#e3f7cd" : "",
      }}
    >
      {children}
    </div>
  );
};

const Game = () => {
  const playerOne = new Player("Player 1", PieceColor.Red);
  const playerTwo = new Player("Player 2", PieceColor.Black);
  const [checkersGame, setCheckersGame] = useState(
    new CheckersGame(playerOne, playerTwo, false)
  );
  const [history, setHistory] = useState<(CheckersPiece | null)[][]>(
    checkersGame.board
  );
  const [gameStatus, setGameStatus] = useState("");
  const [possibleMoves, setPossibleMoves] = useState<Moves[] | []>([]);
  const [selectedPiece, setSelectedPiece] = useState({ row: -1, col: -1 });
  const forceUpdate = useForceUpdate();

  const onPieceDropped = (
    item: { color: PieceColor; position: { row: number; col: number } },
    newPosition: { row: number; col: number }
  ) => {
    // Check move validity
    const isValidMove = checkersGame.validateMove(
      item.position.row,
      item.position.col,
      newPosition.row,
      newPosition.col
    );

    if (isValidMove) {
      // Make the move
      checkersGame.movePiece(
        item.position.row,
        item.position.col,
        newPosition.row,
        newPosition.col
      );
      setCheckersGame(checkersGame);
      forceUpdate();
    }
  };

  const { changeBodyBackground } = useStyle();
  useEffect(() => {
    // set background
    changeBodyBackground("#363430");
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  const renderBoard = () => {
    return checkersGame.board.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((col, colIndex) => {
          const isPossibleMove = possibleMoves.some(
            (move) => move.endRow === rowIndex && move.endCol === colIndex
          );
          return (
            <Square
              key={colIndex}
              position={{ row: rowIndex, col: colIndex }}
              onPieceDropped={onPieceDropped}
              isPossibleMove={isPossibleMove}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {col && (
                <Piece
                  color={col.color}
                  position={{ row: rowIndex, col: colIndex }}
                  isSelected={
                    selectedPiece.row === rowIndex &&
                    selectedPiece.col === colIndex
                  }
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
              <h3>Opponent</h3>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="board">{renderBoard()}</div>
            </DndProvider>
            <div className="player-card">
              <h3>Player</h3>
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
