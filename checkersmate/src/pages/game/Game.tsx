import { useEffect, useState } from "react";
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
            <div
              key={colIndex}
              className={`board-col ${col ? "-occupied" : ""} ${
                isPossibleMove ? "possible-move" : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {col && (
                <div
                  className={`piece-${col.color} ${
                    selectedPiece.row === rowIndex &&
                    selectedPiece.col === colIndex
                      ? "piece-selected"
                      : ""
                  }`}
                ></div>
              )}
            </div>
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
            <div className="board">{renderBoard()}</div>
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
