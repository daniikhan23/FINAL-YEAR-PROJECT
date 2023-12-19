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
        score += aiPieceCount - playerPieceCount;
        score += (aiKingCount - playerKingCount) * 2;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = game.getPiece(row, col);
                if (piece) {
                    if (col >= 2 && col <= 5 && row >= 2 && row <= 5) {
                        score += (piece.color === PieceColor.Black ? 1 : -1);
                    }
                }
            }
        }
        return score;
    }
    minimax(game, depth, alpha, beta, isMaximizingPlayer) {
        console.log(`Minimax called with depth: ${depth}, isMaximizingPlayer: ${isMaximizingPlayer}`);
        let bestScore;
        let bestMove = null;
        let checkColor = isMaximizingPlayer ? PieceColor.Black : PieceColor.Red;
        game.checkEndOfGame();
        console.log(`After checkEndOfGame, current game state: ${game.currentState}`);
        if (depth === 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            console.log(`Base case reached! Score = ${score}, Game State: ${game.currentState}`);
            return [score, null];
        }
        bestScore = isMaximizingPlayer ? -Infinity : Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === checkColor) {
                    const moves = game.possibleMoves(row, col);
                    for (const move of moves) {
                        if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                            const gameCopy = game.deepCopyGame();
                            gameCopy.moveAI(move.startRow, move.startCol, move.endRow, move.endCol);
                            console.log(`Considering move: (${move.startRow},${move.startCol}) to (${move.endRow},${move.endCol})`);
                            const [evaluatedScore] = this.minimax(gameCopy, depth - 1, alpha, beta, !isMaximizingPlayer);
                            if (isMaximizingPlayer) {
                                if (evaluatedScore > bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                    alpha = Math.max(alpha, bestScore);
                                }
                            }
                            else {
                                if (evaluatedScore < bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                    beta = Math.min(beta, bestScore);
                                }
                            }
                            if (beta <= alpha) {
                                console.log(`Inner - Pruning occurs at depth ${depth} with alpha: ${alpha} and beta: ${beta}`);
                                break;
                            }
                        }
                    }
                }
                if (beta <= alpha) {
                    console.log(`Outer - Pruning occurs at depth ${depth} with alpha: ${alpha} and beta: ${beta}`);
                    break;
                }
            }
        }
        console.log(`Minimax decision at depth ${depth} - Best Score: ${bestScore}, Best Move: (${bestMove === null || bestMove === void 0 ? void 0 : bestMove.startRow}, ${bestMove === null || bestMove === void 0 ? void 0 : bestMove.startCol}) to (${bestMove === null || bestMove === void 0 ? void 0 : bestMove.endRow}, ${bestMove === null || bestMove === void 0 ? void 0 : bestMove.endCol})`);
        return [bestScore, bestMove];
    }
    minimaxTwo(game, depth, maximizingPlayer) {
        game.checkEndOfGame();
        if (depth == 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
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
                                const [evaluatedScore] = this.minimaxTwo(gameCopy, depth - 1, false);
                                if (evaluatedScore > bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                }
                            }
                        }
                    }
                }
            }
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
                                const [evaluatedScore] = this.minimaxTwo(gameCopy, depth - 1, false);
                                if (evaluatedScore < bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                }
                            }
                        }
                    }
                }
            }
        }
        return [bestScore, bestMove];
    }
    makeMove() {
        if (this.game.currentState === State.gameFinished) {
            console.log("Game is finished. AI cannot make a move.");
            this.game.changeTurn();
        }
        else {
            const [score, move] = this.minimaxTwo(this.game, this.depth, true);
            if (move) {
                this.game.movePiece(move === null || move === void 0 ? void 0 : move.startRow, move === null || move === void 0 ? void 0 : move.startCol, move === null || move === void 0 ? void 0 : move.endRow, move === null || move === void 0 ? void 0 : move.endCol);
                console.log(`AI moved from: (${move === null || move === void 0 ? void 0 : move.startRow}, ${move === null || move === void 0 ? void 0 : move.startCol}) to (${move === null || move === void 0 ? void 0 : move.endRow}, ${move === null || move === void 0 ? void 0 : move.endCol})`);
                console.log(`Evaluated Score of move: ${score}`);
            }
            else {
                console.log(`${this.game.players[1].name} has no valid moves!`);
            }
        }
    }
}
//# sourceMappingURL=checkers-ai.js.map