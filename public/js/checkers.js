export var State;
(function (State) {
    State[State["inProgress"] = 0] = "inProgress";
    State[State["gameFinished"] = 1] = "gameFinished";
})(State || (State = {}));
export class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.capturedPieces = 0;
        this.numOfPieces = 12;
        this.numOfKings = 0;
    }
    updateCapturedPieces(count) {
        this.capturedPieces += count;
    }
    updateScore(score) {
        this.score += score;
    }
    deepCopyPlayer() {
        let copiedPlayer = new Player(this.name, this.color);
        copiedPlayer.numOfPieces = this.numOfPieces;
        copiedPlayer.numOfKings = this.numOfKings;
        return copiedPlayer;
    }
}
export var PieceColor;
(function (PieceColor) {
    PieceColor["Black"] = "black";
    PieceColor["Red"] = "red";
})(PieceColor || (PieceColor = {}));
export class CheckersPiece {
    constructor(color, isKing = false) {
        this.color = color;
        this.isKing = isKing;
    }
    makeKing() {
        this.isKing = true;
    }
    deepCopyPiece() {
        const copiedPiece = new CheckersPiece(this.color, this.isKing);
        return copiedPiece;
    }
}
export class Moves {
    constructor(startRow, startCol, endRow, endCol) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
}
export class CheckersBoard {
    constructor() {
        this.board = [];
        this.initializeBoard();
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
export class CheckersGame {
    constructor(playerOne, playerTwo) {
        this.board = new CheckersBoard().board;
        this.players = [playerOne, playerTwo];
        this.currentState = State.inProgress;
        this.currentPlayer = playerOne;
        this.winner = null;
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
            return this.validateBlack(startRow, startCol, endRow, endCol, destinationSquare);
        }
        else if ((piece === null || piece === void 0 ? void 0 : piece.color) === PieceColor.Red && piece.isKing === false) {
            return this.validateRed(startRow, startCol, endRow, endCol, destinationSquare);
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
    validateBlack(startRow, startCol, endRow, endCol, destinationSquare) {
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
    validateRed(startRow, startCol, endRow, endCol, destinationSquare) {
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
                if (this.promoteToKing(endRow, endCol) === true) {
                    piece.makeKing();
                    this.currentPlayer.numOfKings += 1;
                }
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
            }
        }
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
        if (this.currentPlayer === this.players[0]) {
            this.players[1].numOfPieces -= 1;
        }
        else {
            this.players[0].numOfPieces -= 1;
        }
    }
    promoteToKing(row, col) {
        const piece = this.getPiece(row, col);
        if ((piece === null || piece === void 0 ? void 0 : piece.color) == PieceColor.Red && row == 0) {
            return true;
        }
        else if ((piece === null || piece === void 0 ? void 0 : piece.color) == PieceColor.Black && row == 7) {
            return true;
        }
        else {
            return false;
        }
        ;
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
        if (player.numOfPieces === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    noValidMoves() {
        let validMoves = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer.color) {
                    if (this.possibleMoves(row, col).length > 0) {
                        validMoves++;
                    }
                }
            }
        }
        if (validMoves === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    checkEndOfGame() {
        if (this.noPiecesLeft(this.players[0])) {
            this.currentState = State.gameFinished;
            this.winner = this.players[1];
        }
        else if (this.noPiecesLeft(this.players[1])) {
            this.currentState = State.gameFinished;
            this.winner = this.players[0];
        }
        else if (this.noValidMoves()) {
            this.currentState = State.gameFinished;
            if (this.players[0].score > this.players[1].score) {
                this.winner = this.players[0];
            }
            else if (this.players[0].score < this.players[1].score) {
                this.winner = this.players[1];
            }
            else {
                this.winner = null;
            }
        }
    }
    setAI(aiPlayer) {
        this.players[1] = aiPlayer;
    }
    simulateMove(startRow, startCol, endRow, endCol) {
        const piece = this.getPiece(startRow, startCol);
        let capturedPieces = [];
        let wasPromoted = false;
        let currentRow = startRow, currentCol = startCol;
        let moveRow = endRow, moveCol = endCol;
        if (piece && this.validateMove(startRow, startCol, endRow, endCol)) {
            let canContinueCapture = true;
            while (canContinueCapture) {
                if (this.canCapture(currentRow, currentCol, moveRow, moveCol)) {
                    const middleRow = Math.floor((currentRow + moveRow) / 2);
                    const middleCol = Math.floor((currentCol + moveCol) / 2);
                    const capturedPiece = this.getPiece(middleRow, middleCol);
                    if (capturedPiece) {
                        capturedPieces.push({ piece: capturedPiece, row: middleRow, col: middleCol });
                        this.board[middleRow][middleCol] = null;
                        this.board[currentRow][currentCol] = null;
                        this.board[moveRow][moveCol] = piece;
                        if (piece.isKing === false) {
                            if (this.promoteToKing(moveRow, moveCol) === true) {
                                piece.makeKing();
                                wasPromoted = true;
                            }
                        }
                        currentRow = moveRow;
                        currentCol = moveCol;
                        const nextCaptures = this.chainCaptures(moveRow, moveCol);
                        canContinueCapture = nextCaptures.length > 0;
                        if (canContinueCapture) {
                            moveRow = nextCaptures[0].endRow;
                            moveCol = nextCaptures[0].endCol;
                        }
                    }
                }
                else {
                    this.board[currentRow][currentCol] = null;
                    this.board[moveRow][moveCol] = piece;
                    currentRow = moveRow;
                    currentCol = moveCol;
                    if (piece.isKing === false) {
                        if (this.promoteToKing(moveRow, moveCol) === true) {
                            piece.makeKing();
                            wasPromoted = true;
                        }
                    }
                    canContinueCapture = false;
                }
            }
        }
        return [capturedPieces, wasPromoted, currentRow, currentCol];
    }
    moveAI(startRow, startCol, endRow, endCol) {
        const piece = this.getPiece(startRow, startCol);
        let capturedAlready = false;
        if (piece && piece.color === this.currentPlayer.color) {
            if (this.validateMove(startRow, startCol, endRow, endCol)) {
                if (piece !== null) {
                    const middleRow = Math.floor((startRow + endRow) / 2);
                    const middleCol = Math.floor((startCol + endCol) / 2);
                    if (this.canCapture(startRow, startCol, endRow, endCol)) {
                        if (this.currentPlayer === this.players[0]) {
                            this.players[1].numOfPieces -= 1;
                        }
                        else {
                            this.players[0].numOfPieces -= 1;
                        }
                        this.board[middleRow][middleCol] = null;
                        capturedAlready = true;
                    }
                    else {
                        capturedAlready = false;
                    }
                }
                this.board[startRow][startCol] = null;
                this.board[endRow][endCol] = piece;
                if (this.promoteToKing(endRow, endCol) === true) {
                    piece.makeKing();
                    this.currentPlayer.numOfKings += 1;
                }
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
            }
        }
    }
    undoSimulation(startRow, startCol, finalRow, finalCol, capturedPieces, wasPromoted) {
        const piece = this.getPiece(finalRow, finalCol);
        this.board[finalRow][finalCol] = null;
        this.board[startRow][startCol] = piece;
        capturedPieces.forEach((capturedPiece) => {
            this.board[capturedPiece.row][capturedPiece.col] = capturedPiece.piece;
        });
        if (wasPromoted && piece) {
            piece.isKing = false;
        }
    }
    deepCopyGame() {
        const copiedGame = new CheckersGame(this.players[0].deepCopyPlayer(), this.players[1].deepCopyPlayer());
        copiedGame.board = this.board.map(row => row.map(piece => piece ? piece.deepCopyPiece() : null));
        copiedGame.currentPlayer = this.currentPlayer;
        copiedGame.currentState = this.currentState;
        copiedGame.winner = this.winner ? this.winner.deepCopyPlayer() : null;
        return copiedGame;
    }
}
//# sourceMappingURL=checkers.js.map