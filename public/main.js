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
        this.board = new CheckersBoard().board;
        this.players = [playerOne, playerTwo];
        this.currentState = State.inProgress;
        this.currentPlayer = playerOne;
    }
    changeTurn() {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
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
        const piece = this.getPiece(startRow, startCol);
        let capturedAlready = false;
        if (piece && piece.color === this.currentPlayer.color) {
            if (this.validateMove(startRow, startCol, endRow, endCol)) {
                if (piece !== null) {
                    const middleRow = Math.floor((startRow + endRow) / 2);
                    const middleCol = Math.floor((startCol + endCol) / 2);
                    const enemyPiece = this.getPiece(middleRow, middleCol);
                    if (this.canCapture(startRow, startCol, endRow, endCol)) {
                        this.handlePieceCapture(enemyPiece);
                        this.board[middleRow][middleCol] = null;
                        capturedAlready = true;
                    }
                    else {
                        capturedAlready = false;
                    }
                }
                this.board[startRow][startCol] = null;
                this.board[endRow][endCol] = piece;
                this.promoteToKing(endRow, endCol);
                const nextCaptures = this.chainCaptures(endRow, endCol);
                if (nextCaptures && capturedAlready === true) {
                    if (nextCaptures.length > 0) {
                        return;
                    }
                    else {
                        this.changeTurn();
                    }
                }
                else {
                    this.changeTurn();
                }
                this.checkForEndGame();
                if (this.currentState === State.gameFinished) {
                    console.log(`${this.currentPlayer.name} has lost the game :/`);
                }
                else {
                    console.log(`${this.currentPlayer.name}'s turn now`);
                }
            }
        }
        console.log(this.board);
    }
    handlePieceCapture(piece) {
        if ((piece === null || piece === void 0 ? void 0 : piece.isKing) === true) {
            this.currentPlayer.updateScore(2);
            this.currentPlayer.updateCapturedPieces(1);
        }
        else {
            this.currentPlayer.updateScore(1);
            this.currentPlayer.updateCapturedPieces(1);
        }
    }
    promoteToKing(row, col) {
        const piece = this.getPiece(row, col);
        if ((piece === null || piece === void 0 ? void 0 : piece.color) == PieceColor.Red && row == 0) {
            piece.makeKing();
            console.log("This is your kingdom, my lord");
        }
        else if ((piece === null || piece === void 0 ? void 0 : piece.color) == PieceColor.Black && row == 7) {
            piece.makeKing();
            console.log("This is your kingdom, my lord");
        }
    }
    chainCaptures(row, col) {
        const moves = this.possibleMoves(row, col);
        const captureMoves = moves.filter(move => Math.abs(move.startRow - move.endRow) === 2);
        return captureMoves.map(move => ({ endRow: move.endRow, endCol: move.endCol }));
    }
    capturesPossible() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer.color) {
                    const moves = this.possibleMoves(row, col);
                    if (moves.some(move => Math.abs(move.startRow - move.endRow) === 2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    noPiecesLeft(player) {
        let numPieces = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece !== null && piece.color === player.color) {
                    numPieces++;
                }
            }
        }
        if (numPieces === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    noValidMoves() {
        let movePossible = true;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.getPiece(row, col) !== null) {
                    if (this.possibleMoves(row, col) === null) {
                        movePossible = false;
                    }
                    else {
                        movePossible = true;
                    }
                }
            }
        }
        return movePossible;
    }
    checkForEndGame() {
        if (this.noPiecesLeft(this.currentPlayer) && this.noValidMoves() === false) {
            this.currentState = State.gameFinished;
            console.log(`${this.currentPlayer.name} has lost the game :/`);
        }
    }
}
const pieceEventListeners = new Map();
const playerOne = new Player("Red", PieceColor.Red);
const playerTwo = new Player("Black", PieceColor.Black);
const game = new CheckersGame(playerOne, playerTwo);
const rows = document.querySelectorAll('.board-container .container .row');
function populateBoard() {
    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll('.col');
        cols.forEach((col, colIndex) => {
            const piece = game.getPiece(rowIndex, colIndex);
            if (piece) {
                const pieceDiv = document.createElement('div');
                if (piece.isKing === true) {
                    pieceDiv.classList.add(piece.color === PieceColor.Black ? 'black-piece-king' : 'red-piece-king');
                }
                else {
                    pieceDiv.classList.add(piece.color === PieceColor.Black ? 'black-piece' : 'red-piece');
                }
                col.appendChild(pieceDiv);
                pieceDiv.addEventListener("click", selectPiece.bind(null, rowIndex, colIndex, pieceDiv));
            }
        });
    });
}
function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(highlightedElement => {
        const highlighted = highlightedElement;
        highlighted.classList.remove('highlight');
        const moveListener = pieceEventListeners.get(highlighted);
        if (moveListener) {
            highlighted.removeEventListener("click", moveListener);
            pieceEventListeners.delete(highlighted);
        }
    });
}
function selectPiece(rowIndex, colIndex, pieceDiv) {
    const piece = game.getPiece(rowIndex, colIndex);
    clearHighlights();
    document.querySelectorAll('.black-piece, .red-piece').forEach(p => {
        p.classList.remove('selected');
    });
    pieceDiv.classList.toggle('selected');
    if (piece && piece.color === game.currentPlayer.color) {
        console.log(piece);
        const moves = game.possibleMoves(rowIndex, colIndex);
        console.log(moves);
        if (moves.length > 0) {
            moves.forEach(move => {
                const targetCell = document.querySelector(`.col[data-row='${move.endRow}'][data-col='${move.endCol}']`);
                if (targetCell) {
                    targetCell.classList.add('highlight');
                    const existingListener = pieceEventListeners.get(targetCell);
                    if (existingListener) {
                        targetCell.removeEventListener('click', existingListener);
                    }
                    const moveListener = () => {
                        executeMove(rowIndex, colIndex, move.endRow, move.endCol, pieceDiv);
                    };
                    targetCell.addEventListener('click', moveListener);
                    pieceEventListeners.set(targetCell, moveListener);
                }
            });
        }
    }
    else {
        console.log(`It's not ${piece === null || piece === void 0 ? void 0 : piece.color}'s turn.`);
    }
}
function executeMove(startRow, startCol, endRow, endCol, pieceDiv) {
    const piece = game.getPiece(startRow, startCol);
    if (piece && piece.color === game.currentPlayer.color) {
        game.movePiece(startRow, startCol, endRow, endCol);
        updateBoardDOM();
        const pieceAtEnd = game.getPiece(endRow, endCol);
        const pieceAtStart = game.getPiece(startRow, startCol);
        if (!pieceAtStart && pieceAtEnd) {
            console.log(`${piece.color} piece has moved from (${startRow}, ${startCol}) to (${endRow}, ${endCol})`);
        }
    }
}
function updateBoardDOM() {
    clearHighlights();
    rows.forEach((row) => {
        row.querySelectorAll('.col').forEach((col) => {
            if (col.firstChild) {
                const pieceDiv = col.firstChild;
                const existingListener = pieceEventListeners.get(pieceDiv);
                if (existingListener) {
                    pieceDiv.removeEventListener('click', existingListener);
                    pieceEventListeners.delete(pieceDiv);
                }
                col.removeChild(col.firstChild);
            }
        });
    });
    populateBoard();
}
populateBoard();
//# sourceMappingURL=main.js.map