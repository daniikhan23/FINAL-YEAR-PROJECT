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
