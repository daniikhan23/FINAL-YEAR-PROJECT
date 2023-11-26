import { PieceColor, State, Player } from './checkers';
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
        return score;
    }
    minimax(game, depth, isMaximizingPlayer) {
        console.log(`Minimax called with depth: ${depth}, maximizing player: ${isMaximizingPlayer}`);
        let bestEvalScore;
        let bestMove = null;
        let checkColor = isMaximizingPlayer ? PieceColor.Black : PieceColor.Red;
        if (depth === 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            console.log(`Base case reached with score: ${score}`);
            return [score, null];
        }
        if (isMaximizingPlayer) {
            bestEvalScore = -Infinity;
        }
        else {
            bestEvalScore = Infinity;
        }
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === checkColor) {
                    const moves = game.possibleMoves(row, col);
                    moves.forEach(move => {
                        if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                            const [capturedPieces, wasPromoted, finalRow, finalCol] = game.simulateMove(move.startRow, move.startCol, move.endRow, move.endCol);
                            console.log(`Evaluating move: Start(${move.startRow}, ${move.startCol}) to End(${move.endRow}, ${move.endCol})`);
                            const [evaluatedScore] = this.minimax(game, depth - 1, !isMaximizingPlayer);
                            console.log(`Evaluated move: Start(${move.startRow}, ${move.startCol}) to End(${move.endRow}, ${move.endCol}), Score: ${evaluatedScore}`);
                            game.undoSimulation(move.startRow, move.endRow, finalRow, finalCol, capturedPieces, wasPromoted);
                            if (isMaximizingPlayer && evaluatedScore > bestEvalScore) {
                                console.log(`Updating best move: Start(${move.startRow}, ${move.startCol}) to End(${move.endRow}, ${move.endCol}), New Best Score: ${evaluatedScore}`);
                                bestEvalScore = evaluatedScore;
                                bestMove = move;
                            }
                            else if (!isMaximizingPlayer && evaluatedScore < bestEvalScore) {
                                console.log(`Updating best move: Start(${move.startRow}, ${move.startCol}) to End(${move.endRow}, ${move.endCol}), New Best Score: ${evaluatedScore}`);
                                bestEvalScore = evaluatedScore;
                                bestMove = move;
                            }
                        }
                    });
                }
            }
        }
        if (bestMove) {
            console.log(`Returning from minimax: Best Move: Start(${bestMove.startRow}, ${bestMove.startCol}) to End(${bestMove.endRow}, ${bestMove.endCol}), Score: ${bestEvalScore}`);
        }
        else {
            console.log(`Returning from minimax: No best move found, Score: ${bestEvalScore}`);
        }
        return [bestEvalScore, bestMove];
    }
}
//# sourceMappingURL=checkers-ai.js.map