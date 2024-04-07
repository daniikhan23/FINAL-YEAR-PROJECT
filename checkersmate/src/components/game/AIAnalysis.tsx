import React from "react";
import { Moves } from "../../components/game/checkersGame";

interface AIAnalysisProps {
  minimaxDepth: number;
  numOfPositions: number;
  aiMoveTime: number;
  playerTwoMoves: Moves[];
  evaluatedScore: number;
}

const colToLetter = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Displays analysis and metrics used by the AI during the game, including the last move made,
 * the number of positions analyzed, and the time taken for analysis.
 *
 * @param {AIAnalysisProps} props - The props for the AIAnalysis component.
 * @param {number} props.minimaxDepth - The depth used by the minimax algorithm.
 * @param {number} props.numOfPositions - The number of positions analyzed by the AI.
 * @param {number} props.aiMoveTime - The time taken by the AI to make a move, in milliseconds.
 * @param {Moves[]} props.playerTwoMoves - An array of moves made by player two (the AI).
 * @param {number} props.evaluatedScore - The score evaluated by the AI for its move.
 * @returns {React.ReactElement} - A React element displaying the AI analysis information.
 */
const AIAnalysis: React.FC<AIAnalysisProps> = ({
  minimaxDepth,
  numOfPositions,
  aiMoveTime,
  playerTwoMoves,
  evaluatedScore,
}) => {
  const formatLastMove = () => {
    const lastMove = playerTwoMoves[playerTwoMoves.length - 1];
    if (!lastMove) return "N/A";
    return `(${colToLetter[lastMove.startCol]}${lastMove.startRow + 1}) to (${
      colToLetter[lastMove.endCol]
    }${lastMove.endRow + 1})`;
  };

  return (
    <div className="ai-analysis">
      <div className="header">
        <h5>AI analysis</h5>
      </div>
      <div className="info">
        <h6>Minimax Depth: {minimaxDepth}</h6>
        <h6>Number of positions analysed: {numOfPositions}</h6>
        <h6>Time Taken: {aiMoveTime} ms</h6>
        <h6>Chosen Move: {formatLastMove()}</h6>
        <h6>Evaluated Score of Move: {evaluatedScore.toFixed(2)}</h6>
      </div>
      <div className="heuristic">
        <h5>AI's Prioritisation Metric</h5>
        <h6>Piece Differential (Kings, Pawns)</h6>
        <h6>Piece Safety and Mobility</h6>
        <h6>Opponent's Possible Captures: - No. of Captures available</h6>
        <h6>Distances to Promotion and almost promoted pieces</h6>
        <h6>Central Pieces</h6>
        <h6>Attacking and Defending Pieces</h6>
        <h6>Loner Pieces</h6>
        <h6>Defensive Structures (Bridge, Dog, Triangle)</h6>
        <h6>Priorities change in early, mid to endgame</h6>
      </div>
    </div>
  );
};

export default AIAnalysis;
