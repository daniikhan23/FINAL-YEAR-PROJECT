import {Moves, PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame} from './checkers.js';

/**
 * A class for the AI player extending the regular player class
 * Has methods for a heuristic evaluation, the minimax algorithm and a method that makes the move
 * returned by minimax
 */
export class CheckersAI extends Player{
    private game: CheckersGame;
    private depth: number

    constructor(name: string, color: PieceColor, game: CheckersGame, depth: number) {
        super(name, color);
        this.game = game;
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

    /**
     * Minimax Algorithm used in Checkers game to find best move.
     * 
     * This is a recursive function that evaluates the state of the game to find the optimal move for the current player,
     * looking ahead, at a certain specified depth. It aims to maximize it's own gain from a move being made, and 
     * minimize the gain of the user. 
     * 
     * @param {CheckersGame} game - Current state of the Checkers game
     * @param {number} depth - Depth to which game is evaluated
     * @param {boolean} isMaximizingPlayer - The player maximizing, true for AI(Black player) and false for the user(Red)
     * @returns {[number, Moves | null]} Tuple that contains best evaluation score and best move
     */
    public minimax(game: CheckersGame, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): [number, Moves | null] {

        console.log(`Minimax called with depth: ${depth}, isMaximizingPlayer: ${isMaximizingPlayer}`);
    
        let bestScore: number; 
        let bestMove: Moves | null = null;
        let checkColor: PieceColor = isMaximizingPlayer ? PieceColor.Black : PieceColor.Red;

        game.checkEndOfGame();

        console.log(`After checkEndOfGame, current game state: ${game.currentState}`);

    
        if (depth === 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            console.log(`Base case reached! Score = ${score}, Game State: ${game.currentState}`);
            return [score, null];
        }
    
        // Maximizing Player = -Infinity, Minimzing = Infinity
        bestScore = isMaximizingPlayer ? -Infinity : Infinity;
        
        // Iterate through the board to find the pieces of the current player
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === checkColor) {
                    const moves = game.possibleMoves(row, col);
                    for (const move of moves) {
                        if (game.validateMove(move.startRow, move.startCol, move.endRow, move.endCol)) {
                            // Create a deep copy of the game for simulating the move
                            const gameCopy = game.deepCopyGame();

                            gameCopy.moveAI(move.startRow, move.startCol, move.endRow, move.endCol);

                            console.log(`Considering move: (${move.startRow},${move.startCol}) to (${move.endRow},${move.endCol})`);
                            
                            const [evaluatedScore] = this.minimax(gameCopy, depth - 1, alpha, beta, !isMaximizingPlayer);
                            
                            // Assign scores depending on whether it's maximzing or minimizing turn
                            if (isMaximizingPlayer) {
                                if (evaluatedScore > bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                    alpha = Math.max(alpha, bestScore);
                                    // console.log(`alpha = ${alpha}`);
                                }
                            } else {
                                if (evaluatedScore < bestScore) {
                                    bestScore = evaluatedScore;
                                    bestMove = move;
                                    beta = Math.min(beta, bestScore);
                                    // console.log(`beta = ${beta}`);
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
        console.log(`Minimax decision at depth ${depth} - Best Score: ${bestScore}, Best Move: (${bestMove?.startRow}, ${bestMove?.startCol}) to (${bestMove?.endRow}, ${bestMove?.endCol})`);

        return [bestScore, bestMove];
    }

    // new minimax experiment W.I.P
    public minimaxTwo(game: CheckersGame, depth: number, maximizingPlayer: boolean): [number, Moves | null]{

        game.checkEndOfGame();

        if (depth == 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            return [score, null]; 
        }

        let bestScore: number = maximizingPlayer ? -Infinity : Infinity;
        let bestMove: Moves | null = null;

        if (maximizingPlayer) {
            for (let row = 0; row < 8; row ++) {
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
        } else {
            for (let row = 0; row < 8; row ++) {
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

    /**
     * Method for the AI to make a move using the minimax algorithm to get the 'best' move and using that.
     */
    public makeMove(): void {
        if (this.game.currentState === State.gameFinished) {
            console.log("Game is finished. AI cannot make a move.");
            this.game.changeTurn();
        }
        else {
            // Call minimax to get move to make
            const [score, move] = this.minimaxTwo(this.game, this.depth, true);
            // Validate move first
            if (move) {
                // Then move the piece
                this.game.movePiece(move?.startRow, move?.startCol, move?.endRow, move?.endCol);
                console.log(`AI moved from: (${move?.startRow}, ${move?.startCol}) to (${move?.endRow}, ${move?.endCol})`);
                console.log(`Evaluated Score of move: ${score}`);
            }
            else {
                console.log( `${this.game.players[1].name} has no valid moves!`);
            }
        }
    }
}