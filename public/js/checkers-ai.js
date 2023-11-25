import { PieceColor, Player } from './checkers';
export class CheckersAI extends Player {
    constructor(name, color, game) {
        super(name, color);
        this.game = game;
        this.depth = 1;
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
}
//# sourceMappingURL=checkers-ai.js.map