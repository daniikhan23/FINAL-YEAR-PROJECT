import React from "react";
import { CheckersPiece, Moves, PieceColor } from "./checkersGame";
import { Square } from "./Square";
import { Piece } from "./Piece";

export interface Position {
  row: number;
  col: number;
}

type OnPieceDroppedFunction = (
  item: { color: PieceColor; position: Position },
  position: Position
) => void;

interface BoardProps {
  board: (CheckersPiece | null)[][];
  onPieceDropped: OnPieceDroppedFunction;
  selectedPiece: Position;
  possibleMoves: Moves[];
  handleCellClick: Function;
  lastMove: { from: Position; to: Position };
  isCurrentPlayerTurn: (pieceColor: PieceColor) => boolean;
}

/**
 * Represents the game board of the checkers game.
 * This component renders a grid of Square components, each potentially containing a Piece component.
 *
 * @param {BoardProps} props - The props for the Board component.
 * @param {(CheckersPiece | null)[][]} props.board - A 2D array representing the state of the game board.
 * @param {OnPieceDroppedFunction} props.onPieceDropped - Function to call when a piece is dropped on a square.
 * @param {Position} props.selectedPiece - The currently selected piece's position.
 * @param {Moves[]} props.possibleMoves - An array of possible moves for the selected piece.
 * @param {Function} props.handleCellClick - Function to call when a cell (square) is clicked.
 * @param {{ from: Position; to: Position }} props.lastMove - The last move made in the game.
 * @param {boolean} props.isCurrentPlayerTurn - Function to determine if it's the current player's turn based on the piece color.
 * @returns {React.ReactElement} - A React element representing the game board with squares and pieces.
 */
export const Board: React.FC<BoardProps> = ({
  board,
  onPieceDropped,
  selectedPiece,
  possibleMoves,
  handleCellClick,
  lastMove,
  isCurrentPlayerTurn,
}) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((col, colIndex) => {
            const isPossibleMove = possibleMoves.some(
              (move) => move.endRow === rowIndex && move.endCol === colIndex
            );
            const isLastMoveEnd =
              lastMove.to.row === rowIndex && lastMove.to.col === colIndex;
            const isLastMoveStart =
              lastMove.from.row === rowIndex && lastMove.from.col === colIndex;

            return (
              <Square
                key={colIndex}
                position={{ row: rowIndex, col: colIndex }}
                onPieceDropped={onPieceDropped}
                isPossibleMove={isPossibleMove}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                isSelected={
                  selectedPiece.row === rowIndex &&
                  selectedPiece.col === colIndex
                }
                isLastMoveStart={isLastMoveStart}
                isLastMoveEnd={isLastMoveEnd}
              >
                {col && (
                  <Piece
                    color={col.color}
                    position={{ row: rowIndex, col: colIndex }}
                    isSelected={
                      selectedPiece.row === rowIndex &&
                      selectedPiece.col === colIndex
                    }
                    isKing={col.isKing}
                    isCurrentPlayerTurn={isCurrentPlayerTurn(col.color)}
                  />
                )}
              </Square>
            );
          })}
        </div>
      ))}
    </div>
  );
};
