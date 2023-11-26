import {Moves, PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame} from './checkers';

export class CheckersAI extends Player{
    private game: CheckersGame;
    private depth: number

    constructor(name: string, color: PieceColor, game: CheckersGame, depth: number) {
        super(name, color);
        this.game = game;
        // for now the AI will only have search depth 1 for a simple AI
        this.depth = depth;
    }

    /**
     * Calculates a score for the AI based on number of regular and king pieces it has opposed to the user
     * @param {CheckersGame} game - Current state of the game 
     * @returns {number} - The score calculated
     */
    public evaluateState(game: CheckersGame): number {
        let score = 0;
        let aiPieceCount = game.players[1].numOfPieces, playerPieceCount = game.players[0].numOfPieces;
        let aiKingCount = game.players[1].numOfKings, playerKingCount = game.players[0].numOfKings;

        score += aiPieceCount - playerPieceCount;
        score += (aiKingCount - playerKingCount) * 2;

        return score;
    }

    public minimax(game: CheckersGame, depth: number, isMaximizingPlayer: boolean): [number, Moves | null] {

        console.log(`Minimax called with depth: ${depth}, maximizing player: ${isMaximizingPlayer}`);

        // Initialise checks
        let bestEvalScore: number; 
        let bestMove: Moves | null = null;
        let checkColor: PieceColor = isMaximizingPlayer ? PieceColor.Black : PieceColor.Red;

        // Base case 
        if (depth === 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            console.log(`Base case reached with score: ${score}`);
            return [score, null];
        }

        // For maximizing the score
        if (isMaximizingPlayer) {
            bestEvalScore = -Infinity;
        }
        // For minimizing the score 
        else {
            bestEvalScore = Infinity;
        }

        // Iterate over the board and check possible moves for each piece and their evaluation score
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === checkColor) {
                    const moves = game.possibleMoves(row, col);
                    // check each move
                    moves.forEach(move => {
                        if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                            // simulate move for each piece 
                            const [capturedPieces, wasPromoted, finalRow, finalCol] = game.simulateMove(move.startRow, move.startCol, move.endRow, move.endCol);
                            // recursive call

                            console.log(`Evaluating move: Start(${move.startRow}, ${move.startCol}) to End(${move.endRow}, ${move.endCol})`);
                            const [evaluatedScore] = this.minimax(game, depth - 1, !isMaximizingPlayer);
                            console.log(`Evaluated move: Start(${move.startRow}, ${move.startCol}) to End(${move.endRow}, ${move.endCol}), Score: ${evaluatedScore}`);

                            // board back to original state
                            game.undoSimulation(move.startRow, move.endRow, finalRow, finalCol, capturedPieces, wasPromoted)

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
            console.log(`Returning from minimax: Best Move: Start(${(bestMove as Moves).startRow}, ${(bestMove as Moves).startCol}) to End(${(bestMove as Moves).endRow}, ${(bestMove as Moves).endCol}), Score: ${bestEvalScore}`);
        } else {
            console.log(`Returning from minimax: No best move found, Score: ${bestEvalScore}`);
        }        
        return [bestEvalScore, bestMove];
    }
}