"use strict";
class Moves {
    constructor(startRow, startCol, endRow, endCol) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
}
var PieceColor;
(function (PieceColor) {
    PieceColor["Black"] = "black";
    PieceColor["Red"] = "red";
})(PieceColor || (PieceColor = {}));
class CheckersPiece {
    constructor(color, isKing = false) {
        this.color = color;
        this.isKing = isKing;
    }
}
class CheckersBoard {
    constructor() {
        this.board = [];
        this.initializeBoard();
        console.log(this.board);
    }
    initializeBoard() {
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece(PieceColor.Black);
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece(PieceColor.Red);
                }
                else {
                    this.board[row][col] = null;
                }
            }
        }
    }
    getPiece(row, col) {
        return this.board[row][col];
    }
    validateMove(startRow, startCol, endRow, endCol) {
        if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            return false;
        }
        const destinationSquare = this.getPiece(endRow, endCol);
        if (destinationSquare !== null) {
            return false;
        }
        return true;
    }
    possibleMoves(row, col) {
        const piece = this.getPiece(row, col);
        const moves = [];
        if (piece !== null) {
            const direction = piece.color === PieceColor.Black ? 1 : -1;
            const startRow = row;
            const startCol = col;
            const potentialMovesArr = [
                { endRow: startRow + direction, endCol: startCol - 1 },
                { endRow: startRow + direction, endCol: startCol + 1 }
            ];
            for (const move of potentialMovesArr) {
                if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                    moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                }
            }
        }
        return moves;
    }
}
const checkersBoard = new CheckersBoard();
const rows = document.querySelectorAll('.board-container .row');
function startBoard() {
    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll('.col');
        cols.forEach((col, colIndex) => {
            const piece = checkersBoard.getPiece(rowIndex, colIndex);
            if (piece) {
                if (piece.color === PieceColor.Black) {
                    const blackPiece = document.createElement('div');
                    blackPiece.classList.add('black-piece');
                    col.appendChild(blackPiece);
                }
                else if (piece.color === PieceColor.Red) {
                    const redPiece = document.createElement('div');
                    redPiece.classList.add('red-piece');
                    col.appendChild(redPiece);
                }
            }
            else {
                const emptySquare = document.createElement('div');
                emptySquare.classList.add('empty-square');
                col.appendChild(emptySquare);
            }
        });
    });
}
startBoard();
//# sourceMappingURL=main.js.map