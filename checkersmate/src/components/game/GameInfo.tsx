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

const colToLetter = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Displays the game information section including the history of moves and control buttons
 * for replaying the game, navigating through the history of moves, and resigning.
 *
 * @param {GameInfoProps} props - The props for the GameInfo component.
 * @param {Move[]} props.movesHistory - An array of moves made during the game.
 * @param {() => void} props.replayGame - Function to call to replay the game.
 * @param {() => void} props.renderPrevBoard - Function to call to render the previous board state.
 * @param {() => void} props.renderNextBoard - Function to call to render the next board state.
 * @param {() => void} props.renderCurrentBoard - Function to call to render the current board state.
 * @param {() => void} props.resign - Function to call if the player decides to resign.
 * @returns {React.ReactElement} - A React element displaying game information and controls.
 */
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
        <h5>History of Moves:</h5>
        {movesHistory.map((move, index) => (
          <h6 key={index}>
            {index + 1}. ({colToLetter[move.from.col]}, {move.from.row + 1}) to
            ({colToLetter[move.to.col]}, {move.to.row + 1})
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
