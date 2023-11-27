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
        let bestScore;
        let bestMove = null;
        let checkColor = isMaximizingPlayer ? PieceColor.Black : PieceColor.Red;
        if (depth === 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            return [score, null];
        }
        bestScore = isMaximizingPlayer ? -Infinity : Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === checkColor) {
                    const moves = game.possibleMoves(row, col);
                    moves.forEach(move => {
                        if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                            const gameCopy = game.deepCopyGame();
                            gameCopy.movePiece(move.startRow, move.startCol, move.endRow, move.endCol);
                            const [evaluatedScore] = this.minimax(gameCopy, depth - 1, !isMaximizingPlayer);
                            if (isMaximizingPlayer && evaluatedScore > bestScore) {
                                bestScore = evaluatedScore;
                                bestMove = move;
                            }
                            else if (!isMaximizingPlayer && evaluatedScore < bestScore) {
                                bestScore = evaluatedScore;
                                bestMove = move;
                            }
                        }
                    });
                }
            }
        }
        console.log(`Score: ${bestScore}`);
        console.log(`Best Move:`);
        console.log(bestMove);
        return [bestScore, bestMove];
    }
}
//# sourceMappingURL=checkers-ai.js.map