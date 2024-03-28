import React from "react";
import { useDrop } from "react-dnd";
import { PieceColor } from "./checkersGame";

interface SquareProps {
  position: { row: number; col: number };
  onPieceDropped: (
    item: { color: PieceColor; position: { row: number; col: number } },
    position: { row: number; col: number }
  ) => void;
  onClick?: () => void;
  isPossibleMove?: boolean;
  children?: React.ReactNode;
  isSelected?: boolean;
  isLastMoveStart?: boolean;
  isLastMoveEnd?: boolean;
}

/**
 * Represents a single square on the checkers game board.
 * This component uses the useDrop hook from react-dnd to accept piece drops.
 *
 * @param {SquareProps} props - The props for the Square component.
 * @param {{ row: number; col: number }} props.position - The position of the square on the board.
 * @param {Function} props.onPieceDropped - Callback function to be called when a piece is dropped on the square.
 * @param {() => void} [props.onClick] - Optional click handler for the square.
 * @param {boolean} [props.isPossibleMove] - Indicates if the square is a possible move for the selected piece.
 * @param {React.ReactNode} [props.children] - The content of the square, a Piece component or empty.
 * @param {boolean} [props.isSelected] - Indicates if the square is selected.
 * @param {boolean} [props.isLastMoveStart] - Indicates if the square is the start of the last move made.
 * @param {boolean} [props.isLastMoveEnd] - Indicates if the square is the end of the last move made.
 * @returns {React.ReactElement} - A React element representing the square on the game board.
 */
export const Square: React.FC<SquareProps> = ({
  position,
  onPieceDropped,
  onClick,
  isPossibleMove,
  isSelected,
  children,
  isLastMoveStart,
  isLastMoveEnd,
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

  let backgroundColor = "";
  if (isOver) {
    backgroundColor = "#dead59";
  } else if (isLastMoveStart) {
    backgroundColor = "#579669";
  } else if (isLastMoveEnd) {
    backgroundColor = "#579669";
  }

  const squareStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`board-col ${isPossibleMove ? "possible-move" : ""} ${
        isSelected ? "selected" : ""
      }`}
      style={squareStyle}
    >
      {children}
    </div>
  );
};
