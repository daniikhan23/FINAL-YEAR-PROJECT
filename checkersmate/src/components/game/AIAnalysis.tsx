import React from "react";
import { Moves } from "../../components/game/checkersGame";

interface AIAnalysisProps {
  minimaxDepth: number;
  numOfPositions: number;
  aiMoveTime: number;
  playerTwoMoves: Moves[];
  evaluatedScore: number;
}

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
    return `(${lastMove.startRow + 1}, ${lastMove.startCol + 1}) to (${
      lastMove.endRow + 1
    }, ${lastMove.endCol + 1})`;
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
        <h6>Evaluated Score of Move: {evaluatedScore}</h6>
      </div>
      <div className="heuristic">
        <h5>AI's Prioritisation Metric</h5>
        <h6>Comparison of Kings: Difference x 20</h6>
        <h6>Comparison of regular pieces: Difference x 15</h6>
        <h6>Opponent's Possible Captures: - No. of Captures available</h6>
        <h6>Central box: +/- 3 for every Black/Red Piece</h6>
        <h6>Back Row Guard (For first 10 turns): +/- 10 Black/Red</h6>
        <h6>Basic Piece Protection: +6 per piece protected</h6>
        <h6>Pyramid Formation (For first 15 turns): + 5-15</h6>
        <h6>Vulnerable Pieces: -/+ 6 Black/Red</h6>
        <h6></h6>
      </div>
    </div>
  );
};

export default AIAnalysis;
