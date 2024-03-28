import React from "react";
import { MdOutlineRestartAlt } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { FaRegFlag } from "react-icons/fa6";
import { BiCurrentLocation } from "react-icons/bi";

interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

interface GameInfoProps {
  movesHistory: Move[];
  replayGame: () => void;
  renderPrevBoard: () => void;
  renderNextBoard: () => void;
  renderCurrentBoard: () => void;
  resign: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  movesHistory,
  replayGame,
  renderPrevBoard,
  renderNextBoard,
  renderCurrentBoard,
  resign,
}) => {
  return (
    <div className="game-info">
      <div className="history-section">
        <h5>History of Moves (Row, Column): </h5>
        {movesHistory.map((move, index) => (
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
  );
};

export default GameInfo;
