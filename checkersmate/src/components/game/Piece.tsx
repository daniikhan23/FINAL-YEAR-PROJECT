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
