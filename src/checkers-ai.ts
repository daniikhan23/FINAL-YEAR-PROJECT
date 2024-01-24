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
    
        // Basic score based on piece count and kings
        score += aiPieceCount * 500 - playerPieceCount * 500;
        score += aiKingCount * 1000 - playerKingCount * 1000;
    
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = game.getPiece(row, col);
                if (piece) {
                    // Central control
                    if (col >= 2 && col <= 5 && row >= 2 && row <= 5) {
                        score += (piece.color === PieceColor.Black ? 30 : -30);
                    }
    
                    // Boundary safety
                    if (col === 0 || col === 7) {
                        score += (piece.color === PieceColor.Black ? 75 : -75);
                    }
    
                    // Pieces close to being promoted
                    if (piece.color === PieceColor.Black && row >= 3 && piece.isKing === false) {
                        score += row * 20;
                    } else if (piece.color === PieceColor.Red && row <= 3 && piece.isKing === false) {
                        score -= (7 - row) * 20;
                    }
    
                    // Chain capture moves 
                    if (game.chainCaptures(row, col)) {
                        score += (piece.color === PieceColor.Black ? 250 : -250);
                    }
                }
            }
        }
    
        // Single capture
        if (game.capturesPossible()) {
            score += (game.currentPlayer.color === PieceColor.Black ? 150 : -150);
        }
        return score;
    }

    public openingSet(): Map<string, Moves[]> {
        const openings = new Map<string, Moves[]>();

        openings.set("Old Fourteenth", [
            new Moves(5, 2, 4, 3), // red or players move
            new Moves(2, 3, 3, 2), // black or ai's move
            new Moves(6, 1, 5, 2), // red or players move
            new Moves(2, 5, 3, 6), // black or ai's move
            new Moves(7, 0, 6, 1) // red or players move
        ]);
    
        return openings;
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
    public minimax(game: CheckersGame, depth: number, alpha: number, beta:number, maximizingPlayer: boolean): [number, Moves | null]{

        game.checkEndOfGame();

        if (depth == 0 || game.currentState === State.gameFinished) {
            let score = this.evaluateState(game);
            console.log(`Base case reached, depth: ${depth}, score: ${score}`);
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
            const [score, move] = this.minimax(this.game, this.depth, -Infinity, Infinity, true);
            // Validate move first
            if (move) {
                // Then move the piece
                this.game.movePiece(move?.startRow, move?.startCol, move?.endRow, move?.endCol);
                console.log(`AI moved from: (${move?.startRow}, ${move?.startCol}) to (${move?.endRow}, ${move?.endCol})`);
                console.log(`Evaluated Score of move: ${score}`);
            }
            else {
                console.log( `${this.game.players[1].name} has no valid moves!`);
                this.game.changeTurn();
            }
        }
    }
}