import { PieceColor, State, Player } from './checkers.js';
export class CheckersAI extends Player {
    constructor(name, color, game, depth) {
        super(name, color);
        this.game = game;
        this.depth = depth;
    }
    evaluateState(game) {
        let score = 0;
        let aiPieceCount = game.players[1].numOfPieces, playerPieceCount = game.players[0].numOfPieces;
        let aiKingCount = game.players[1].numOfKings, playerKingCount = game.players[0].numOfKings;
        score += aiPieceCount * 25 - playerPieceCount * 25;
        score += (aiKingCount * 50 - playerKingCount * 50);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = game.getPiece(row, col);
                if (piece) {
                    if (col >= 2 && col <= 5 && row >= 2 && row <= 5) {
                        score += (piece.color === PieceColor.Black ? 10 : -10);
                    }
                    if (game.chainCaptures(row, col)) {
                        score += (piece.color === PieceColor.Black ? 200 : -200);
                    }
                }
            }
        }
        if (game.capturesPossible()) {
            score -= 100;
        }
        return score;
    }
    minimax(game, depth, alpha, beta, maximizingPlayer) {
        game.checkEndOfGame();
        if (depth == 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            console.log(`Base case reached, depth: ${depth}, score: ${score}`);
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
                                console.log(`Maximizing call - move: (${move.startRow}, ${move.startCol}), (${move.endRow}, ${move.endCol}), depth: ${depth}`);
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
                                console.log(`Minimizing call - move: (${move.startRow}, ${move.startCol}), (${move.endRow}, ${move.endCol}), depth: ${depth}`);
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
    }
}
//# sourceMappingURL=checkers-ai.js.map