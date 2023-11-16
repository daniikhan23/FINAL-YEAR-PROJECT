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
    makeKing() {
        this.isKing = true;
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
        const piece = this.getPiece(startRow, startCol);
        if ((piece === null || piece === void 0 ? void 0 : piece.color) === PieceColor.Black && piece.isKing === false) {
            return this.validateBlack(startRow, startCol, endRow, endCol, destinationSquare, piece);
        }
        else if ((piece === null || piece === void 0 ? void 0 : piece.color) === PieceColor.Red && piece.isKing === false) {
            return this.validateRed(startRow, startCol, endRow, endCol, destinationSquare, piece);
        }
        if ((piece === null || piece === void 0 ? void 0 : piece.isKing) === true) {
            if (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 1) {
                if (destinationSquare !== null) {
                    return false;
                }
                return true;
            }
            else if (Math.abs(startRow - endRow) == 2 && Math.abs(startCol - endCol) == 2) {
                return this.canCapture(startRow, startCol, endRow, endCol);
            }
        }
        return false;
    }
    validateBlack(startRow, startCol, endRow, endCol, destinationSquare, piece) {
        if (endRow - startRow === 1 && Math.abs(startCol - endCol) === 1) {
            if (destinationSquare !== null) {
                return false;
            }
            return true;
        }
        else if (endRow - startRow === 2 && Math.abs(startCol - endCol) === 2) {
            return this.canCapture(startRow, startCol, endRow, endCol);
        }
        return false;
    }
    validateRed(startRow, startCol, endRow, endCol, destinationSquare, piece) {
        if (endRow - startRow === -1 && Math.abs(startCol - endCol) === 1) {
            if (destinationSquare !== null) {
                return false;
            }
            return true;
        }
        else if (endRow - startRow === -2 && Math.abs(startCol - endCol) === 2) {
            return this.canCapture(startRow, startCol, endRow, endCol);
        }
        return false;
    }
    possibleMoves(row, col) {
        const piece = this.getPiece(row, col);
        const moves = [];
        if (piece !== null) {
            const direction = piece.color === PieceColor.Black ? 1 : -1;
            const startRow = row;
            const startCol = col;
            if (piece.isKing === false) {
                const potentialMovesArr = [
                    { endRow: startRow + direction, endCol: startCol - 1 },
                    { endRow: startRow + direction, endCol: startCol + 1 },
                    { endRow: startRow + 2 * direction, endCol: startCol - 2 },
                    { endRow: startRow + 2 * direction, endCol: startCol + 2 }
                ];
                for (const move of potentialMovesArr) {
                    if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                        moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                    }
                }
            }
            else {
                const startRow = row;
                const startCol = col;
                const potentialMovesArr = [
                    { endRow: startRow + 1, endCol: startCol - 1 },
                    { endRow: startRow + 1, endCol: startCol + 1 },
                    { endRow: startRow - 1, endCol: startCol - 1 },
                    { endRow: startRow - 1, endCol: startCol + 1 },
                    { endRow: startRow + 2, endCol: startCol - 2 },
                    { endRow: startRow + 2, endCol: startCol + 2 },
                    { endRow: startRow - 2, endCol: startCol - 2 },
                    { endRow: startRow - 2, endCol: startCol + 2 }
                ];
                for (const move of potentialMovesArr) {
                    if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                        moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                    }
                }
            }
        }
        return moves;
    }
    canCapture(startRow, startCol, endRow, endCol) {
        if (Math.abs(startRow - endRow) == 2 && Math.abs(startCol - endCol) == 2) {
            const middleRow = (startRow + endRow) / 2;
            const middleCol = (startCol + endCol) / 2;
            const middlePiece = this.getPiece(middleRow, middleCol);
            const currentPiece = this.getPiece(startRow, startCol);
            if (currentPiece !== null && middlePiece !== null) {
                if (middlePiece.color !== currentPiece.color) {
                    const destinationSquare = this.getPiece(endRow, endCol);
                    if (destinationSquare === null) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    movePiece(startRow, startCol, endRow, endCol) {
        var _a, _b, _c, _d;
        if (this.validateMove(startRow, startCol, endRow, endCol)) {
            const piece = this.getPiece(startRow, startCol);
            if (piece !== null) {
                if (this.canCapture(startRow, startCol, endRow, endCol)) {
                    const middleRow = (startRow + endRow) / 2;
                    const middleCol = (startCol + endCol) / 2;
                    this.board[middleRow][middleCol] = null;
                }
            }
            this.board[startRow][startCol] = null;
            this.board[endRow][endCol] = piece;
        }
        if (((_a = this.getPiece(endRow, endCol)) === null || _a === void 0 ? void 0 : _a.color) == PieceColor.Red && endRow == 0) {
            (_b = this.getPiece(endRow, endCol)) === null || _b === void 0 ? void 0 : _b.makeKing();
        }
        else if (((_c = this.getPiece(endRow, endCol)) === null || _c === void 0 ? void 0 : _c.color) == PieceColor.Black && endRow == 7) {
            (_d = this.getPiece(endRow, endCol)) === null || _d === void 0 ? void 0 : _d.makeKing();
        }
    }
}
var State;
(function (State) {
    State[State["inProgress"] = 0] = "inProgress";
    State[State["gameFinished"] = 1] = "gameFinished";
})(State || (State = {}));
class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.capturedPieces = 0;
    }
    updateCapturedPieces(count) {
        this.capturedPieces += count;
    }
    updateScore(score) {
        this.score += score;
    }
    displayScore() {
        return this.score;
    }
}
class CheckersGame {
    constructor(playerOne, playerTwo) {
        this.board = new CheckersBoard();
        this.players = [playerOne, playerTwo];
        this.currentState = State.inProgress;
        this.currentPlayer = playerOne;
    }
    changeTurn() {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
    makeMove(move) {
        const piece = this.board.getPiece(move.startRow, move.startCol);
        if (piece && piece.color === this.currentPlayer.color) {
            const isCaptureMove = Math.abs(move.startRow - move.endRow) === 2 && Math.abs(move.startCol - move.endCol) === 2;
            if (isCaptureMove) {
                this.handlePieceCapture(move.startRow, move.startCol, move.endRow, move.endCol);
            }
            this.board.movePiece(move.startRow, move.startCol, move.endRow, move.endCol);
            this.changeTurn();
            this.currentPlayer.displayScore();
            return true;
        }
        return false;
    }
    handlePieceCapture(startRow, startCol, endRow, endCol) {
        const middleRow = (startRow + endRow) / 2;
        const middleCol = (startCol + endCol) / 2;
        const piece = this.board.getPiece(middleRow, middleCol);
        if ((piece === null || piece === void 0 ? void 0 : piece.isKing) === true) {
            this.currentPlayer.updateScore(2);
            this.currentPlayer.updateCapturedPieces(1);
        }
        else {
            this.currentPlayer.updateScore(1);
            this.currentPlayer.updateCapturedPieces(1);
        }
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