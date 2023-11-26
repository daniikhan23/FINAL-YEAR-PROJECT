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
        return [bestEvalScore, bestMove];
    }
}
//# sourceMappingURL=checkers-ai.js.map