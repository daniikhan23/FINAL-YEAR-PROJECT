"use strict";
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
    }
    initializeBoard() {
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece('black');
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece('red');
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
}
const checkersBoard = new CheckersBoard();
const rows = document.querySelectorAll('.board-container .row');
rows.forEach((row, rowIndex) => {
    const cols = row.querySelectorAll('.col');
    cols.forEach((col, colIndex) => {
        const piece = checkersBoard.getPiece(rowIndex, colIndex);
        if (piece) {
            if (piece.color === 'black') {
                const blackPiece = document.createElement('div');
                blackPiece.classList.add('black-piece');
                col.appendChild(blackPiece);
            }
            else if (piece.color == 'red') {
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
console.log(checkersBoard.getPiece(0, 1));
console.log(checkersBoard.getPiece(0, 2));
console.log(checkersBoard.getPiece(0, 3));
console.log(checkersBoard.getPiece(0, 4));
;
//# sourceMappingURL=main.js.map