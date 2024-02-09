import { Moves, PieceColor, State, Player } from './checkers.js';
export class CheckersAI extends Player {
    constructor(name, color, game, depth) {
        super(name, color);
        this.game = game;
        this.depth = depth;
        this.openings = this.openingSet();
        this.currentOpening = null;
    }
    heuristic(game) {
        let score = 0;
        let aiPieceCount = game.players[1].numOfPieces, playerPieceCount = game.players[0].numOfPieces;
        let aiKingCount = 0, playerKingCount = 0;
        score += aiPieceCount * 15 - playerPieceCount * 15;
        score -= this.countOpponentCapturesPossible(PieceColor.Red, game);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = game.getPiece(row, col);
                if (piece) {
                    if (piece.color === PieceColor.Black && piece.isKing === true) {
                        aiKingCount++;
                    }
                    else if (piece.color === PieceColor.Red && piece.isKing === true) {
                        playerKingCount++;
                    }
                    if (col >= 2 && col <= 5 && row >= 3 && row <= 4) {
                        score += (piece.color === PieceColor.Black ? 2.5 : -2.5);
                    }
                    if (row >= 3 && row <= 4 && col < 2 && col > 5) {
                        score += (piece.color === PieceColor.Black ? 0.5 : -0.5);
                    }
                    if (game.numOfTurns < 15) {
                        if (piece.color === PieceColor.Black && row === 0) {
                            if (col === 1 || col === 5) {
                                score += 10;
                            }
                        }
                        else if (piece.color === PieceColor.Red && row === 7) {
                            if (col === 2 || col === 6) {
                                score -= 10;
                            }
                        }
                    }
                    if (row >= 1 && row <= 6 && col >= 1 && col <= 6) {
                        let backwardRow = piece.color === PieceColor.Black ? row - 1 : row + 1;
                        let leftProtectionPiece = game.getPiece(backwardRow, col - 1);
                        let rightProtectionPiece = game.getPiece(backwardRow, col + 1);
                        if (leftProtectionPiece && leftProtectionPiece.color === piece.color) {
                            score += (piece.color === PieceColor.Black ? 3 : -3);
                        }
                        if (rightProtectionPiece && rightProtectionPiece.color === piece.color) {
                            score += (piece.color === PieceColor.Black ? 3 : -3);
                        }
                    }
                    if (game.numOfTurns < 15) {
                        if (piece.color === PieceColor.Black) {
                            if (row === 0) {
                                if (col === 1 || col === 3 || col == 5) {
                                    score += 5;
                                }
                            }
                            if (row === 1) {
                                if (col === 2 || col === 4) {
                                    score += 5;
                                }
                            }
                            if (row === 2) {
                                if (col === 3) {
                                    score += 5;
                                }
                            }
                        }
                    }
                    if (!game.isVulnerable(row, col)) {
                        score += (piece.color === PieceColor.Black ? -3 : 3);
                    }
                }
            }
        }
        score += aiKingCount * 20 - playerKingCount * 20;
        return score;
    }
    countOpponentCapturesPossible(color, game) {
        let captureCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === color) {
                    const moves = game.possibleMoves(row, col);
                    captureCount += moves.filter(move => Math.abs(move.startRow - move.endRow) === 2).length;
                }
            }
        }
        return captureCount;
    }
    openingSet() {
        const openings = new Map();
        openings.set("Old Fourteenth", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(7, 0, 6, 1)
        ]);
        openings.set("Alma", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(7, 2, 6, 1)
        ]);
        openings.set("Centre", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(4, 3, 3, 4)
        ]);
        openings.set("Glasgow", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(5, 2, 4, 1)
        ]);
        openings.set("Laird and Lady", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(5, 6, 4, 7),
            new Moves(3, 6, 4, 5),
            new Moves(5, 4, 3, 6),
            new Moves(2, 7, 4, 5)
        ]);
        openings.set("Black Doctor", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(5, 6, 4, 7),
            new Moves(3, 6, 4, 5),
            new Moves(5, 4, 3, 6),
            new Moves(3, 2, 5, 4),
            new Moves(6, 3, 4, 5)
        ]);
        openings.set("Laird and Lady Refused", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(5, 6, 4, 7),
            new Moves(1, 6, 2, 5)
        ]);
        openings.set("Glasgow-Whilter", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 6),
            new Moves(5, 6, 4, 5),
            new Moves(1, 6, 2, 5),
            new Moves(5, 2, 4, 1),
            new Moves(1, 4, 2, 3)
        ]);
        openings.set("Nailor", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(1, 4, 2, 3),
        ]);
        openings.set("Tillicoultry", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(2, 5, 3, 4),
        ]);
        openings.set("Will o' the Wisp", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(5, 6, 4, 7),
        ]);
        openings.set("Defiance", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(5, 6, 4, 5),
            new Moves(1, 2, 2, 3),
        ]);
        openings.set("Fife", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(5, 6, 4, 5),
            new Moves(2, 5, 3, 6),
            new Moves(6, 7, 5, 6)
        ]);
        openings.set("Souter", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(5, 6, 4, 5),
            new Moves(2, 5, 3, 6),
            new Moves(6, 5, 5, 6)
        ]);
        openings.set("Whilter-I", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(5, 6, 4, 5),
            new Moves(2, 5, 3, 6),
            new Moves(6, 3, 5, 2)
        ]);
        openings.set("Whilter-II", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 3, 5, 2)
        ]);
        openings.set("Whilter-Exchange", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 3, 5, 2),
            new Moves(2, 5, 3, 4)
        ]);
        openings.set("Maid of the Mill", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(3, 6, 4, 7),
            new Moves(4, 3, 3, 4)
        ]);
        openings.set("Douglas", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(3, 6, 4, 7),
            new Moves(7, 0, 6, 1),
            new Moves(1, 6, 2, 5)
        ]);
        openings.set("Pioneer", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 2),
            new Moves(6, 1, 5, 2),
            new Moves(1, 6, 2, 5)
        ]);
        openings.set("White Dyke", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 5, 3, 6),
            new Moves(6, 1, 5, 2),
            new Moves(3, 6, 4, 5)
        ]);
        openings.set("Wagram", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 5, 3, 6),
            new Moves(5, 6, 4, 7),
            new Moves(2, 1, 3, 0)
        ]);
        openings.set("Boston", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 5, 3, 6),
            new Moves(5, 6, 4, 7),
            new Moves(3, 6, 4, 5)
        ]);
        openings.set("Dyke", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 5, 3, 6),
            new Moves(4, 3, 3, 2)
        ]);
        openings.set("Cross", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 4)
        ]);
        openings.set("Waterloo", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 3, 3, 4),
            new Moves(6, 1, 5, 2),
            new Moves(3, 4, 4, 5)
        ]);
        openings.set("Ayrshire Lassie", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 1, 3, 0),
            new Moves(6, 1, 5, 2),
            new Moves(1, 0, 2, 1)
        ]);
        openings.set("Switcher", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 7, 3, 6)
        ]);
        openings.set("Single Corner", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 5, 3, 4)
        ]);
        openings.set("Second Double Corner", [
            new Moves(5, 2, 4, 3),
            new Moves(2, 1, 3, 2)
        ]);
        openings.set("Bristol", [
            new Moves(5, 2, 4, 1),
            new Moves(2, 1, 3, 0),
            new Moves(4, 1, 3, 2)
        ]);
        openings.set("Paisley", [
            new Moves(5, 2, 4, 1),
            new Moves(2, 1, 3, 2)
        ]);
        openings.set("Bristol-Cross", [
            new Moves(5, 2, 4, 1),
            new Moves(2, 3, 3, 4)
        ]);
        return openings;
    }
    identifyOpening() {
        let foundOpening = false;
        if (this.game.numOfTurns < Math.max(...Array.from(this.openings.values()).map(o => o.length))) {
            for (const [name, moves] of this.openings) {
                if (this.game.playerOneMoves.length <= moves.length / 2) {
                    const sequenceMatch = this.game.playerOneMoves.every((move, index) => {
                        return moves[index * 2].equals(move);
                    });
                    if (sequenceMatch) {
                        this.currentOpening = name;
                        foundOpening = true;
                        break;
                    }
                }
            }
        }
        if (!foundOpening) {
            this.currentOpening = null;
        }
    }
    minimax(game, depth, alpha, beta, maximizingPlayer) {
        game.checkEndOfGame();
        if (depth == 0 || game.currentState === State.gameFinished) {
            let score = this.heuristic(game);
            return [score, null];
        }
        let bestScore = maximizingPlayer ? -Infinity : Infinity;
        let bestMove = null;
        if (maximizingPlayer) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = game.getPiece(row, col);
                    if (piece && piece.color === PieceColor.Black) {
                        const moves = game.possibleMoves(row, col);
                        for (const move of moves) {
                            if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                                const gameCopy = game.deepCopyGame();
                                gameCopy.moveAI(move.startRow, move.startCol, move.endRow, move.endCol);
                                const [evaluatedScore] = this.minimax(gameCopy, depth - 1, alpha, beta, false);
                                alpha = Math.max(alpha, evaluatedScore);
                                if (beta <= alpha) {
                                    bestMove = move;
                                    bestScore = evaluatedScore;
                                    break;
                                }
                                if (evaluatedScore > bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                }
                            }
                        }
                    }
                }
            }
            return [bestScore, bestMove];
        }
        else {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = game.getPiece(row, col);
                    if (piece && piece.color === PieceColor.Red) {
                        const moves = game.possibleMoves(row, col);
                        for (const move of moves) {
                            if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                                const gameCopy = game.deepCopyGame();
                                gameCopy.moveAI(move.startRow, move.startCol, move.endRow, move.endCol);
                                const [evaluatedScore] = this.minimax(gameCopy, depth - 1, alpha, beta, true);
                                beta = Math.min(beta, evaluatedScore);
                                if (beta <= alpha) {
                                    bestMove = move;
                                    bestScore = evaluatedScore;
                                    break;
                                }
                                if (evaluatedScore < bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                }
                            }
                        }
                    }
                }
            }
            return [bestScore, bestMove];
        }
    }
    makeMove() {
        if (this.game.currentState === State.gameFinished) {
            console.log("Game is finished. AI cannot make a move.");
            this.game.changeTurn();
        }
        else {
            this.identifyOpening();
            if (this.currentOpening) {
                const move = this.getOpeningMove();
                if (move) {
                    this.game.movePiece(move.startRow, move.startCol, move.endRow, move.endCol);
                }
                else {
                    this.playMinimaxMove();
                }
            }
            else if (this.game.numOfTurns === 1 && this.game.getPiece(3, 4) === null) {
                this.game.movePiece(2, 5, 3, 4);
            }
            else if (this.game.numOfTurns === 3 && this.game.getPiece(2, 5) === null) {
                this.game.movePiece(1, 6, 2, 5);
            }
            else if (this.game.numOfTurns === 5 && this.game.getPiece(1, 6) === null) {
                this.game.movePiece(0, 7, 1, 6);
            }
            else {
                this.playMinimaxMove();
            }
        }
    }
    playMinimaxMove() {
        const [score, move] = this.minimax(this.game, this.depth, -Infinity, Infinity, true);
        if (move) {
            this.game.movePiece(move === null || move === void 0 ? void 0 : move.startRow, move === null || move === void 0 ? void 0 : move.startCol, move === null || move === void 0 ? void 0 : move.endRow, move === null || move === void 0 ? void 0 : move.endCol);
            console.log(`AI moved from: (${move === null || move === void 0 ? void 0 : move.startRow}, ${move === null || move === void 0 ? void 0 : move.startCol}) to (${move === null || move === void 0 ? void 0 : move.endRow}, ${move === null || move === void 0 ? void 0 : move.endCol})`);
            console.log(`Evaluated Score of move: ${score}`);
        }
        else {
            console.log(`${this.game.players[1].name} has no valid moves!`);
            this.game.changeTurn();
        }
    }
    getOpeningMove() {
        if (this.currentOpening) {
            const sequence = this.openings.get(this.currentOpening);
            if (sequence && this.game.numOfTurns < sequence.length) {
                return sequence[this.game.numOfTurns];
            }
        }
        return null;
    }
}
//# sourceMappingURL=checkers-ai.js.map