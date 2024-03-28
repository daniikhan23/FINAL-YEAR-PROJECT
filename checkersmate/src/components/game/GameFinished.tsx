import React from "react";
import { CheckersAI } from "./checkersAI";
import { Player } from "./checkersGame";
import ReactCountryFlag from "react-country-flag";
import { GiArtificialIntelligence } from "react-icons/gi";
import redKing from "../../assets/img/redKingCustom.png";
import blackKing from "../../assets/img/blackKingCustom.png";
import flagWorld from "../../assets/img/flagOfTheWorld.jpg";

interface GameFinishedProps {
  winner: Player | null;
  players: [Player, Player | CheckersAI];
  gameMode: boolean;
  onReplayClick: () => void;
  onChangeModeClick: () => void;
  userCountry: string;
}

/**
 * Displays the game over screen with the winner, scores, and an option to replay or change the game mode.
 *
 * @param {GameFinishedProps} props - The props for the GameFinished component.
 * @param {Player | null} props.winner - The winner of the game. `null` if the game is a draw.
 * @param {[Player, Player | CheckersAI]} props.players - The players of the game.
 * @param {boolean} props.gameMode - The mode of the game (true for forced captures, false for normal).
 * @param {() => void} props.onReplayClick - Function to call when the replay button is clicked.
 * @param {() => void} props.onChangeModeClick - Function to call when changing the game mode.
 * @param {string} props.userCountry - The country code of the user.
 * @returns {React.ReactElement} - A React element displaying the game over screen.
 */
const GameFinished: React.FC<GameFinishedProps> = ({
  winner,
  players,
  gameMode,
  onReplayClick,
  onChangeModeClick,
  userCountry,
}) => {
  return (
    <>
      <div className="game-backdrop"></div>
      <div className="game-finished">
        <img
          className="winner"
          src={winner === players[0] ? redKing : blackKing}
          alt=""
        />
        <h3>{winner ? `Winner: ${winner?.name}` : `It's a draw!`}</h3>
        <h3>Game Mode: {gameMode ? "Forced Captures" : "Normal"}</h3>
        <div className="player-names">
          <h4>
            {userCountry && (
              <ReactCountryFlag
                countryCode={userCountry}
                svg
                style={{ marginRight: "10px" }}
                title={userCountry}
              />
            )}
            {players[0].name}
          </h4>
          <div className="row-player-two">
            {players[1].isAI ? (
              <GiArtificialIntelligence />
            ) : (
              <img className="flag-world" src={flagWorld} alt="" />
            )}
            <h4>{players[1].name ? players[1].name : "Player Two"}</h4>
          </div>
        </div>
        <div className="player-scores">
          <h4>Score: {players[0].score}</h4>
          <h4>Score: {players[1].score}</h4>
        </div>
        <div className="captured-pieces">
          <h4>Pieces Captured: {players[0].capturedPieces}</h4>
          <h4>Pieces Captured: {players[1].capturedPieces}</h4>
        </div>
        <div className="replay-buttons">
          <h4>Would you like to play again?</h4>
          <button className="mp-btn" onClick={onReplayClick}>
            Replay Match
          </button>
          <button className="ai-btn" onClick={onChangeModeClick}>
            Try a different mode?
          </button>
        </div>
      </div>
    </>
  );
};

export default GameFinished;
