import {Moves, PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame} from './checkers';

export class CheckersAI extends Player{
    private game: CheckersGame;
    private depth: number

    constructor(name: string, color: PieceColor, game: CheckersGame) {
        super(name, color);
        this.game = game;
        // for now the AI will only have search depth 1 for a simple AI
        this.depth = 1;
    }

    /**
     * Calculates a score for the AI based on number of regular and king pieces it has opposed to the user
     * @param {CheckersGame} game - Current state of the game 
     * @returns {number} - The score calculated
     */
    public evaluateState(game: CheckersGame): number {
        let score = 0;
        let aiPieceCount = 0, playerPieceCount = 0;
        let aiKingCount = 0, playerKingCount = 0;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece) {
                    // for the AI
                    if (piece.color === PieceColor.Black) {
                        aiPieceCount++;
                        if (piece.isKing === true) {
                            aiKingCount++;
                        }
                    } 
                    // for the player
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