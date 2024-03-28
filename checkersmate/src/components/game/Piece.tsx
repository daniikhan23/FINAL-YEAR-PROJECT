import React from "react";
import { useDrag } from "react-dnd";
import { PieceColor } from "./checkersGame";

interface PieceProps {
  color: PieceColor;
  position: { row: number; col: number };
  isSelected: boolean;
  isKing: boolean;
  isCurrentPlayerTurn: boolean;
}

/**
 * Represents a draggable piece in the checkers game.
 * This component uses the useDrag hook from react-dnd to enable drag-and-drop functionality.
 *
 * @param {PieceProps} props - The props for the Piece component.
 * @param {PieceColor} props.color - The color of the piece (black or red).
 * @param {{ row: number; col: number }} props.position - The current position of the piece on the board.
 * @param {boolean} props.isSelected - Indicates if the piece is selected.
 * @param {boolean} props.isKing - Indicates if the piece isa king.
 * @param {boolean} props.isCurrentPlayerTurn - Indicates if it's the current player's turn.
 * @returns {React.ReactElement} - A React element representing the draggable piece.
 */
export const Piece: React.FC<PieceProps> = ({
  color,
  position,
  isSelected,
  isKing,
  isCurrentPlayerTurn,
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
      } ${isCurrentPlayerTurn ? "-turn" : ""}
      piece-selector-for-${position.row}-${position.col}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
};
