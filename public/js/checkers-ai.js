import { PieceColor, State, Player } from './checkers';
export class CheckersAI extends Player {
    constructor(name, color, game, depth) {
        super(name, color);
        this.game = game;
        this.depth = depth;
    }
    evaluateState(game) {
        let score = 0;
        let aiPieceCount = 0, playerPieceCount = 0;
        let aiKingCount = 0, playerKingCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece) {
                    if (piece.color === PieceColor.Black) {
                        aiPieceCount++;
                        if (piece.isKing === true) {
                            aiKingCount++;
                        }
                    }
                    else {
                        playerPieceCount++;
                        if (piece.isKing === true) {
                            playerKingCount++;
                        }
                    }
                }
            }
        }
        score += aiPieceCount - playerPieceCount;
        score += (aiKingCount - playerKingCount) * 2;
        return score;
    }
    minimax(game, depth, isMaximizingPlayer) {
        if (depth === 0 || game.currentState === State.gameFinished) {
            return [this.evaluateState(game), null];
        }
        let bestEvalScore;
        let bestMove = null;
        let checkColor = isMaximizingPlayer ? PieceColor.Black : PieceColor.Red;
        if (game.currentPlayer === game.players[1]) {
            isMaximizingPlayer = true;
            bestEvalScore = -Infinity;
        }
        else {
            isMaximizingPlayer = false;
            bestEvalScore = Infinity;
        }
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === checkColor) {
                    const moves = game.possibleMoves(row, col);
                    moves.forEach(move => {
                        const [capturedPieces, wasPromoted, finalRow, finalCol] = game.simulateMove(move.startRow, move.startCol, move.endRow, move.endCol);
                        const [evaluatedScore, evaluatedMove] = this.minimax(game, depth - 1, !isMaximizingPlayer);
                        game.undoSimulation(move.startRow, move.endRow, finalRow, finalCol, capturedPieces, wasPromoted);
                        if (isMaximizingPlayer && evaluatedScore > bestEvalScore) {
                            bestEvalScore = evaluatedScore;
                            bestMove = move;
                        }
                        else if (!isMaximizingPlayer && evaluatedScore < bestEvalScore) {
                            bestEvalScore = evaluatedScore;
                            bestMove = move;
                        }
                    });
                }
            }
        }
        return [bestEvalScore, bestMove];
    }
}
//# sourceMappingURL=checkers-ai.js.map