import { CheckersAI } from "./checkers-ai";

/**
 * Enum representing the state of the checkers game.
 */
export enum State {
    inProgress,
    gameFinished
}

/**
 * Represents a player in the checkers game.
 */
export class Player {
    public name: string;
    public color: PieceColor;
    public score: number;
    public capturedPieces: number;

     /**
     * Constructs a Player object.
     * @param {string} name - The name of the player.
     * @param {PieceColor} color - The color assigned to the player.
     */
    constructor(name: string, color: PieceColor) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.capturedPieces = 0;
    }

    /**
     * Updates the number of pieces captured by the player.
     * @param {number} count - The number of pieces captured in a move.
     */
    updateCapturedPieces(count: number): void {
        this.capturedPieces += count;
    }

    /**
     * Updates the score of the player.
     * @param {number} score - The score to be added to the player's current score.
     */
    updateScore(score: number): void {
        this.score += score;
    }
}


/**
 * Enum for piece colors in the checkers game.
 */
export enum PieceColor {
    Black = 'black',
    Red = 'red'
}

/**
 * Represents a checkers piece, including its color and king status.
 */
export class CheckersPiece {
    public color: PieceColor;
    public isKing: boolean;

    /**
     * Constructs a CheckersPiece object.
     * @param {PieceColor} color - The color of the piece.
     * @param {boolean} isKing - Indicates if the piece is a king. Default is false.
     */
    constructor(color: PieceColor, isKing:boolean = false){
        this.color = color;
        this.isKing = isKing;
    }

    /**
     * Promotes the piece to a king.
     */
    public makeKing(): void {
        this.isKing = true;
    }
}

/**
 * Class to store the start and end positions of a move in a checkers game.
 */
export class Moves {
    public startRow: number;
    public startCol: number;
    public endRow: number;
    public endCol: number;

    /**
     * Constructs a Moves object.
     * @param {number} startRow - The starting row of the move.
     * @param {number} startCol - The starting column of the move.
     * @param {number} endRow - The ending row of the move.
     * @param {number} endCol - The ending column of the move.
     */
    constructor(startRow: number, startCol: number, endRow: number, endCol: number) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
}

/**
 * Manages the state and initialization of the checkers board.
 */
export class CheckersBoard {
    /**
     * Represents the checkers board as a 2D array.
     */
    public board: (CheckersPiece | null)[][] = [];

    /**
     * Constructs a CheckersBoard object and initializes the board.
     */
    constructor(){
        this.initializeBoard();
        console.log(this.board);
    }

    /**
     * Sets the board to its starting state with pieces positioned.
     */
    private initializeBoard(): void {
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece(PieceColor.Black);
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece(PieceColor.Red);
                }
                else {
                    this.board[row][col] = null;
                }
            }
        }
    }

    /**
     * Retrieves the piece at the specified position on the board.
     * @param {number} row - The row of the piece.
     * @param {number} col - The column of the piece.
     * @returns {CheckersPiece | null} - The piece at the specified position or null if empty.
     */
    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }
}


/**
 * Manages the overall game state of a checkers game, including the board, players, turns, and game progress.
 */
export class CheckersGame {
    public board: (CheckersPiece | null) [][];
    public players: [Player, Player];
    public currentState: State;
    public currentPlayer: Player;
    public winner: Player | null;

    /**
     * Constructs a CheckersGame object.
     * @param {Player} playerOne - The first player.
     * @param {Player} playerTwo - The second player.
     */
    constructor(playerOne: Player, playerTwo: Player) {
        this.board = new CheckersBoard().board;
        this.players = [playerOne, playerTwo];
        this.currentState = State.inProgress;
        this.currentPlayer = playerOne;
        this.winner = null;
    }

    /**
     * Changes the turn to the next player.
     */
    public changeTurn(): void {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1]: this.players[0];
    }

    /**
     * Retrieves the piece at the specified board coordinates.
     * @param {number} row - The row of the piece.
     * @param {number} col - The column of the piece.
     * @returns {CheckersPiece | null} - The piece at the given position, or null if empty.
     */
    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }

    /**
     * Validates a proposed move for a piece.
     * @param {number} startRow - The starting row of the move.
     * @param {number} startCol - The starting column of the move.
     * @param {number} endRow - The ending row of the move.
     * @param {number} endCol - The ending column of the move.
     * @returns {boolean} - True if the move is valid, false otherwise.
     */
    private validateMove(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // check to see if attempted move will place piece outside board
        if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            return false;
        }
        
        const destinationSquare = this.getPiece(endRow, endCol);
        const piece = this.getPiece(startRow, startCol);

        if (piece?.color === PieceColor.Black && piece.isKing === false) {
            // validate move for the Black piece
            return this.validateBlack(startRow, startCol, endRow, endCol, destinationSquare);
        }
        else if (piece?.color === PieceColor.Red && piece.isKing === false) {
            // validate move for the red piece
            return this.validateRed(startRow, startCol, endRow, endCol, destinationSquare);
        }

        if (piece?.isKing === true) {
            if (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 1) {
                if (destinationSquare !== null) {
                    return false;
                }
                return true;
            } 
            else if (Math.abs(startRow - endRow) == 2 && Math.abs(startCol - endCol) == 2) {
                return this.canCapture(startRow, startCol, endRow, endCol);
            }
        }

        return false;
    }

    // method of validation for black pieces
    private validateBlack(startRow: number, startCol: number, endRow: number, endCol: number, destinationSquare: CheckersPiece | null): boolean {
        if (endRow - startRow === 1 && Math.abs(startCol - endCol) === 1) {
            if (destinationSquare !== null) {
                return false;
            }
            return true;
        }
        else if (endRow - startRow === 2 && Math.abs(startCol - endCol) === 2) {
            return this.canCapture(startRow, startCol, endRow, endCol);
        }
        return false;
    }

    // method of validation for red pieces
    private validateRed(startRow: number, startCol: number, endRow: number, endCol: number, destinationSquare: CheckersPiece | null): boolean {
        if (endRow - startRow === -1 && Math.abs(startCol - endCol) === 1) {
            if (destinationSquare !== null) {
                return false;
            }
            return true;
        }
        else if (endRow - startRow === -2 && Math.abs(startCol - endCol) === 2) {
            return this.canCapture(startRow, startCol, endRow, endCol);
        }
        return false;
    }

    /**
     * Computes the possible moves for a piece at a given board position.
     * @param {number} row - The row of the piece.
     * @param {number} col - The column of the piece.
     * @returns {Moves[]} - An array of possible moves for the piece.
     */ 
    public possibleMoves(row: number, col: number): Moves[] {
        const piece = this.getPiece(row, col);
        const moves: Moves[] = [];

        if (piece !== null) {
            const direction = piece.color === PieceColor.Black ? 1: -1;
            const startRow = row;
            const startCol = col;
            
            // check for regular pieces
            if (piece.isKing === false) {
                const potentialMovesArr = [
                    // regular moves
                    {endRow: startRow + direction, endCol: startCol - 1},
                    {endRow: startRow + direction, endCol: startCol + 1},
                    // capture moves
                    {endRow: startRow + 2 * direction, endCol: startCol - 2},
                    {endRow: startRow + 2 * direction, endCol: startCol + 2}
                ];

                for (const move of potentialMovesArr) {
                    if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                        moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                    }
                }
                // for king pieces
            } else {
                const startRow = row;
                const startCol = col;

                const potentialMovesArr = [
                    // regular moves
                    {endRow: startRow + 1, endCol: startCol - 1},
                    {endRow: startRow + 1, endCol: startCol + 1},
                    {endRow: startRow - 1, endCol: startCol - 1},
                    {endRow: startRow - 1, endCol: startCol + 1},
                    // capture moves
                    {endRow: startRow + 2 , endCol: startCol - 2},
                    {endRow: startRow + 2 , endCol: startCol + 2},
                    {endRow: startRow - 2 , endCol: startCol - 2},
                    {endRow: startRow - 2 , endCol: startCol + 2}
                ];
                for (const move of potentialMovesArr) {
                    if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                        moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                    }
                }
            }
        }
        return moves;
    }

    /**
     * Checks if a piece can capture an opponent's piece.
     * @param {number} startRow - The starting row of the capturing piece.
     * @param {number} startCol - The starting column of the capturing piece.
     * @param {number} endRow - The row where the capture would end.
     * @param {number} endCol - The column where the capture would end.
     * @returns {boolean} - True if a capture is possible, false otherwise.
     */
    private canCapture(startRow:number, startCol:number, endRow:number, endCol: number): boolean {
        if (Math.abs(startRow - endRow) == 2 && Math.abs(startCol - endCol) == 2) {
            const middleRow = (startRow + endRow) / 2;
            const middleCol = (startCol + endCol) / 2;

            const middlePiece = this.getPiece(middleRow, middleCol);
            const currentPiece = this.getPiece(startRow, startCol);

            if (currentPiece !== null && middlePiece !== null) {
                if (middlePiece.color !== currentPiece.color) {
                    const destinationSquare = this.getPiece(endRow, endCol);
                    if (destinationSquare === null) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Moves a piece from one position to another, if the move is valid.
     * @param {number} startRow - The starting row of the piece.
     * @param {number} startCol - The starting column of the piece.
     * @param {number} endRow - The ending row of the move.
     * @param {number} endCol - The ending column of the move.
     * Handles piece captures, chain captures, piece promotions and change of turns. 
     */
    public movePiece(startRow: number, startCol: number, endRow: number, endCol: number): void {
        const piece = this.getPiece(startRow, startCol);
        let capturedAlready = false;
        if (piece && piece.color === this.currentPlayer.color){
            if (this.validateMove(startRow, startCol, endRow, endCol)) {
                if (piece !== null) {
                    const middleRow = Math.floor((startRow + endRow) / 2);
                    const middleCol = Math.floor((startCol + endCol) / 2);
                    const enemyPiece = this.getPiece(middleRow, middleCol);
                    if (this.canCapture(startRow, startCol, endRow, endCol)) {
                        this.handlePieceCapture(enemyPiece);
                        this.board[middleRow][middleCol] = null;
                        capturedAlready = true;
                    }
                    else {
                        capturedAlready = false;
                    }
                }
                this.board[startRow][startCol] = null;
                this.board[endRow][endCol] = piece;

                if (this.promoteToKing(endRow, endCol) === true) {
                    piece.makeKing();
                }

                const nextCaptures = this.chainCaptures(endRow, endCol);
                if (nextCaptures && capturedAlready === true) {
                    if (nextCaptures.length > 0) {
                        return;
                    }
                    else {
                        this.changeTurn();
                    }
                }
                else {
                    this.changeTurn();
                }
            }
        }
    }

    /**
     * Handles the capture of a piece, updating the capturing player's score and captured pieces count.
     * @param {CheckersPiece | null} piece - The piece being captured.
     */ 
    public handlePieceCapture(piece: CheckersPiece | null): void {
        if (piece?.isKing === true) {
            this.currentPlayer.updateScore(2);
            this.currentPlayer.updateCapturedPieces(1);
        } else {
            this.currentPlayer.updateScore(1);
            this.currentPlayer.updateCapturedPieces(1);
        }
    }

    /**
     * Promotes a piece to a king if it reaches the opposite end of the board.
     * @param {number} row - The row of the piece.
     * @param {number} col - The column of the piece.
     * @returns {boolean} - Return whether or not a piece was promoted
     */
    public promoteToKing(row: number, col: number): boolean {
        const piece = this.getPiece(row, col);
        if (piece?.color == PieceColor.Red && row == 0) {
            return true;
        } 
        else if (piece?.color == PieceColor.Black && row == 7) {
            return true;
        }
        else {return false};
    }

    /**
     * Determines if a piece can make additional captures after an initial capture.
     * @param {number} row - The row of the capturing piece.
     * @param {number} col - The column of the capturing piece.
     * @returns {{endRow: number, endCol: number}[]} - An array of potential capture moves.
     */
    public chainCaptures(row: number, col: number) {
        const moves = this.possibleMoves(row, col);
        const captureMoves = moves.filter(move => Math.abs(move.startRow - move.endRow) === 2);
        return captureMoves.map(move => ({endRow: move.endRow, endCol: move.endCol}));
    }

    /**
     * Checks if the current player has any possible captures on the board.
     * @returns {boolean} - True if there are possible captures, false otherwise.
     */
    public capturesPossible(): boolean {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer.color){
                    const moves = this.possibleMoves(row, col);
                    if (moves.some(move => Math.abs(move.startRow - move.endRow) === 2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Determines if a player has run out of pieces on the board.
     * @param {Player} player - The player to check for remaining pieces.
     * @returns {boolean} - True if the player has no pieces left, false otherwise.
     */
    public noPiecesLeft(player: Player) : boolean {
        let numPieces = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece !== null && piece.color === player.color) {
                    numPieces++;
                }
            }
        }
        if (numPieces === 0) {
            return true;
        }
        else {return false;}
    }

    /**
     * Checks if the current player cannot make any valid moves.
     * @returns {boolean} - True if no valid moves are available, false otherwise.
     */
    public noValidMoves(): boolean {
        let validMoves = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer.color) {
                    if (this.possibleMoves(row, col).length > 0) {
                        validMoves++;   
                    }
                }
            }
        }
        if (validMoves === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if the game has ended and determines the winner.
     */
    public checkEndOfGame(): void {
        if (this.noPiecesLeft(this.players[0])) {
            this.currentState = State.gameFinished;
            this.winner = this.players[1];
        }
        else if (this.noPiecesLeft(this.players[1])) {
            this.currentState = State.gameFinished;
            this.winner = this.players[0];
        }
        else if (this.noValidMoves()) {
            this.currentState = State.gameFinished;
            if (this.players[0].score > this.players[1].score){
                this.winner = this.players[0]
            }
            else if (this.players[0].score < this.players[1].score) {
                this.winner = this.players[1];
            }
            else {
                this.winner = null;
            }
        }
    }

    // AI Player Specific Methods:

    public setAI(aiPlayer: CheckersAI): void {
        this.players[1] = aiPlayer;
    }

    public simulateMove(startRow: number, startCol: number, endRow: number, endCol: number): [CheckersPiece [], boolean] {
        const piece = this.getPiece(startRow, startCol);
        // keep track of all captured pieces or none if none are captured
        let capturedPieces: CheckersPiece[] = [];
        let wasPromoted = false;

        if (piece && this.validateMove(startRow, startCol, endRow, endCol)) {
            let currentRow = startRow, currentCol = startCol;
            let moveRow = endRow, moveCol = endCol;
            let canContinueCapture = true;

            while (canContinueCapture) {
                if (this.canCapture(currentRow, currentCol, moveRow, moveCol)) {
                    const middleRow = Math.floor((currentRow + moveRow) / 2);
                    const middleCol = Math.floor((currentCol + moveCol) / 2);
                    const capturedPiece = this.getPiece(middleRow, middleCol);
                    
                    // store captured pieces in this array
                    if (capturedPiece) {
                        capturedPieces.push(capturedPiece);
                        this.board[middleRow][middleCol] = null;
                        this.board[currentRow][currentCol] = null; 
                        this.board[moveRow][moveCol] = piece;

                        if (piece.isKing === false) {
                            if (this.promoteToKing(moveRow, moveCol) === true) {
                                piece.makeKing();
                                wasPromoted = true;
                            }
                        }
                        
                        // update current row and col
                        currentRow = moveRow;
                        currentCol = moveCol;
                        const nextCaptures = this.chainCaptures(moveRow, moveCol);
                        canContinueCapture = nextCaptures.length > 0;

                        if (canContinueCapture) {
                            // assuming ai will choose first capture move
                            moveRow = nextCaptures[0].endRow;
                            moveCol = nextCaptures[0].endCol;
                        }
                    }
                }
                else {
                    canContinueCapture = false;
                    this.board[startRow][startCol] = null;
                    this.board[currentRow][currentCol] = piece;

                    if (piece.isKing === false) {
                        if (this.promoteToKing(moveRow, moveCol) === true) {
                            piece.makeKing();
                            wasPromoted = true;
                        }
                    }
                }
            }        
        }
        // Keep track of capturedPiece if there is one to reverse it in the game state after the simulation
        return [capturedPieces, wasPromoted];
    }
    
    public undoSimulation(startRow: number, startCol: number, endRow: number, endCol: number, capturedPiece: CheckersPiece | null): void {
        // Reverse the position of the piece to what it was before the 'simulated move'
        const piece = this.getPiece(endRow, endCol);
        this.board[endRow][endCol] = null;
        this.board[startRow][startCol] = piece;
        
        if (capturedPiece !== null) {
            // Put the captured piece back in it's place
            const middleRow = Math.floor((startRow + endRow) / 2);
            const middleCol = Math.floor((startCol + endCol) / 2);
            this.board[middleRow][middleCol] = capturedPiece;
        }

        // reverse the AI's piece if it was promoted to King status
        if (piece?.isKing === true) {
            piece.isKing = false;
        }
    }
}