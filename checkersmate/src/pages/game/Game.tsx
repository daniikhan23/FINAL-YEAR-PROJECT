import { useEffect, useState } from "react";
import { useStyle } from "../../context/StyleContext";
import "../../css/game-styling.css";
import {
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
  const [gameStatus, setGameStatus] = useState("");
  const [possibleMoves, setPossibleMoves] = useState<Moves[] | []>([]);
  const [selectedPiece, setSelectedPiece] = useState({ row: -1, col: -1 });
  const playerOne = new Player("Player 1", PieceColor.Red);
  const playerTwo = new Player("Player 2", PieceColor.Black);
  const [checkersGame, setCheckersGame] = useState(
    new CheckersGame(playerOne, playerTwo, false)
  );
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

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const piece = checkersGame.getPiece(rowIndex, cellIndex);

    if (selectedPiece.row === rowIndex && selectedPiece.col === cellIndex) {
      setSelectedPiece({ row: -1, col: -1 });
      setPossibleMoves([]); // Clear possible moves when deselecting
    } else if (piece && piece.color === checkersGame.currentPlayer.color) {
      setSelectedPiece({ row: rowIndex, col: cellIndex });
      const moves = checkersGame.possibleMoves(rowIndex, cellIndex);
      setPossibleMoves(moves); // Set possible moves for the selected piece
    } else {
      console.log("It's not your turn or invalid selection.");
      setPossibleMoves([]); // Clear possible moves when invalid selection
    }
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
            <div className="board">
              {renderBoard()}
              {/* <div className="board-row">
                <div className="board-col"></div>
                <div className="board-col">1</div>
                <div className="board-col"></div>
                <div className="board-col">2</div>
                <div className="board-col"></div>
                <div className="board-col">3</div>
                <div className="board-col"></div>
                <div className="board-col">4</div>
              </div>
              <div className="board-row">
                <div className="board-col">5</div>
                <div className="board-col"></div>
                <div className="board-col">6</div>
                <div className="board-col"></div>
                <div className="board-col">7</div>
                <div className="board-col"></div>
                <div className="board-col">8</div>
                <div className="board-col"></div>
              </div>
              <div className="board-row">
                <div className="board-col"></div>
                <div className="board-col">9</div>
                <div className="board-col"></div>
                <div className="board-col">10</div>
                <div className="board-col"></div>
                <div className="board-col">11</div>
                <div className="board-col"></div>
                <div className="board-col">12</div>
              </div>
              <div className="board-row">
                <div className="board-col">13</div>
                <div className="board-col"></div>
                <div className="board-col">14</div>
                <div className="board-col"></div>
                <div className="board-col">15</div>
                <div className="board-col"></div>
                <div className="board-col">16</div>
                <div className="board-col"></div>
              </div>
              <div className="board-row">
                <div className="board-col"></div>
                <div className="board-col">17</div>
                <div className="board-col"></div>
                <div className="board-col">18</div>
                <div className="board-col"></div>
                <div className="board-col">19</div>
                <div className="board-col"></div>
                <div className="board-col">20</div>
              </div>
              <div className="board-row">
                <div className="board-col">21</div>
                <div className="board-col"></div>
                <div className="board-col">22</div>
                <div className="board-col"></div>
                <div className="board-col">23</div>
                <div className="board-col"></div>
                <div className="board-col">24</div>
                <div className="board-col"></div>
              </div>
              <div className="board-row">
                <div className="board-col"></div>
                <div className="board-col">25</div>
                <div className="board-col"></div>
                <div className="board-col">26</div>
                <div className="board-col"></div>
                <div className="board-col">27</div>
                <div className="board-col"></div>
                <div className="board-col">28</div>
              </div>
              <div className="board-row">
                <div className="board-col">29</div>
                <div className="board-col"></div>
                <div className="board-col">30</div>
                <div className="board-col"></div>
                <div className="board-col">31</div>
                <div className="board-col"></div>
                <div className="board-col">32</div>
                <div className="board-col"></div>
              </div> */}
            </div>
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
