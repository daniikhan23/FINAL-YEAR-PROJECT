// class to store moves for a piece
class Moves {
    public startRow: number;
    public startCol: number;
    public endRow: number;
    public endCol: number;

    constructor(startRow: number, startCol: number, endRow: number, endCol: number) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
}

enum PieceColor {
    Black = 'black',
    Red = 'red'
}

// class for the properties of a piece
class CheckersPiece {
    public color: PieceColor;
    public isKing: boolean;

    constructor(color: PieceColor, isKing:boolean = false){
        this.color = color;
        this.isKing = isKing;
    }

    public makeKing(): void {
        this.isKing = true;
    }
}

// class for storing and initialising the board
class CheckersBoard {
    public board: (CheckersPiece | null)[][] = [];

    constructor(){
        this.initializeBoard();
        console.log(this.board);
    }

    // method to set the board to its starting state
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

    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }
}

// game state management
enum State {
    inProgress,
    gameFinished
}

// a class representing a player
class Player {
    public name: string;
    public color: PieceColor;
    public score: number;
    public capturedPieces: number;

    constructor(name: string, color: PieceColor) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.capturedPieces = 0;
    }

    // method to keep track of captured pieces of a player
    updateCapturedPieces(count: number): void {
        this.capturedPieces += count;
    }

    // method to update the score of a player
    updateScore(score: number): void {
        this.score += score;
    }
}

// class for handling the actual game state and player turns
class CheckersGame {
    public board: (CheckersPiece | null) [][];
    public players: [Player, Player];
    public currentState: State;
    public currentPlayer: Player;
    public winner: Player | null;

    constructor(playerOne: Player, playerTwo: Player) {
        this.board = new CheckersBoard().board;
        this.players = [playerOne, playerTwo];
        this.currentState = State.inProgress;
        this.currentPlayer = playerOne;
        this.winner = null;
    }

    // a method to change the turn of a player
    public changeTurn(): void {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1]: this.players[0];
    }

    // method that returns a piece at particular coordinate
    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }

    // method to validate move being made
    private validateMove(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // check to see if attempted move will place piece outside board
        if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            return false;
        }
        
        const destinationSquare = this.getPiece(endRow, endCol);
        const piece = this.getPiece(startRow, startCol);

        if (piece?.color === PieceColor.Black && piece.isKing === false) {
            return this.validateBlack(startRow, startCol, endRow, endCol, destinationSquare, piece);
        }
        else if (piece?.color === PieceColor.Red && piece.isKing === false) {
            return this.validateRed(startRow, startCol, endRow, endCol, destinationSquare, piece);
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
    private validateBlack(startRow: number, startCol: number, endRow: number, endCol: number, destinationSquare: CheckersPiece | null, piece: CheckersPiece): boolean {
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
    private validateRed(startRow: number, startCol: number, endRow: number, endCol: number, destinationSquare: CheckersPiece | null, piece: CheckersPiece): boolean {
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

    // method to create an array of possible moves a piece can make 
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

    // method to check if a piece can capture another
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

    // method to actually move the piece
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
                this.promoteToKing(endRow, endCol);
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

    // method that updates players scores and number of captured pieces 
    public handlePieceCapture(piece: CheckersPiece | null): void {
        if (piece?.isKing === true) {
            this.currentPlayer.updateScore(2);
            this.currentPlayer.updateCapturedPieces(1);
        } else {
            this.currentPlayer.updateScore(1);
            this.currentPlayer.updateCapturedPieces(1);
        }
    }

    // method that handles promotion of pieces to king
    public promoteToKing(row: number, col: number): void {
        const piece = this.getPiece(row, col);
        if (piece?.color == PieceColor.Red && row == 0) {
            piece.makeKing();
        } 
        else if (piece?.color == PieceColor.Black && row == 7) {
            piece.makeKing();
        }
        
    }

    // this method checks if a piece can make further captures
    public chainCaptures(row: number, col: number) {
        const moves = this.possibleMoves(row, col);
        const captureMoves = moves.filter(move => Math.abs(move.startRow - move.endRow) === 2);
        return captureMoves.map(move => ({endRow: move.endRow, endCol: move.endCol}));
    }

    // method to see if there's any captures available to a piece
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

    // method to see if a player has run out of pieces
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

    // method to see if a player cannot make a valid move
    public noValidMoves(): boolean {
        let validMoves = true;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.getPiece(row, col) !== null) {
                    if (this.possibleMoves(row, col) === null) {
                        validMoves = false;
                    }
                    else {
                        validMoves = true;
                    }
                }
            }
        }
        return validMoves;
    }

    // method to check if the game is finished and declare winner
    public checkEndOfGame(): void {
        if (this.noPiecesLeft(this.players[0])) {
            this.currentState = State.gameFinished
            this.winner = this.players[1];
        }
        else if (this.noPiecesLeft(this.players[1])) {
            this.currentState = State.gameFinished
            this.winner = this.players[0];
        }
    }
}

// DOM Manipulation

// a map to hold event listeners for each piece
const pieceEventListeners = new Map<HTMLDivElement, EventListener>();
const playerOne = new Player("Red", PieceColor.Red);
const playerTwo = new Player("Black", PieceColor.Black);
const game = new CheckersGame(playerOne, playerTwo);
let gameStatus: boolean = false;

const playerOneName = document.querySelector('.player-one .container .name') as HTMLDivElement;
const playerOneScore = document.querySelector('.player-one .container .score') as HTMLDivElement;
const playerOneCaptured = document.querySelector('.player-one .container .captured') as HTMLDivElement;
const playerOneTurn = document.querySelector('.player-one .container .turn') as HTMLDivElement;

const playerTwoName = document.querySelector('.player-two .container .name') as HTMLDivElement;
const playerTwoScore = document.querySelector('.player-two .container .score') as HTMLDivElement;
const playerTwoCaptured = document.querySelector('.player-two .container .captured') as HTMLDivElement;
const playerTwoTurn = document.querySelector('.player-two .container .turn') as HTMLDivElement;

const rows = document.querySelectorAll('.board-container .container .row')!;

// method to show the state of the board on the DOM
function populateBoard() {
    updateScoreCard();
    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll('.col')!;
        cols.forEach((col, colIndex) => {
            const piece = game.getPiece(rowIndex, colIndex);
            if (piece) {
                const pieceDiv = document.createElement('div');
                if (piece.isKing === true) {
                    pieceDiv.classList.add(piece.color === PieceColor.Black ? 'black-piece-king': 'red-piece-king')
                } 
                else {
                    pieceDiv.classList.add(piece.color === PieceColor.Black ? 'black-piece' : 'red-piece');
                }
                col.appendChild(pieceDiv);

                // bind function with correct parameters
                pieceDiv.addEventListener("click", selectPiece.bind(null, rowIndex, colIndex, pieceDiv));
            }
        });
    });
}

// method to clear any highlights on the DOM as well as event listeners
function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(highlightedElement => {
        const highlighted = highlightedElement as HTMLDivElement;
        highlighted.classList.remove('highlight');

        const moveListener = pieceEventListeners.get(highlighted);
        if (moveListener) {
            highlighted.removeEventListener("click", moveListener);
            pieceEventListeners.delete(highlighted);
        } 
    });
}

// method to select pieces on the DOM, higghlight their potential locations, and add execute move event listener if possible
function selectPiece(rowIndex: number, colIndex: number, pieceDiv: HTMLDivElement) {
    const piece = game.getPiece(rowIndex, colIndex);
    clearHighlights(); 
            
    // remove previously selected pieces
    document.querySelectorAll('.black-piece, .red-piece').forEach(p => {
        p.classList.remove('selected');
    });
    document.querySelectorAll('.black-piece-king, .red-piece-king').forEach(p => {
        p.classList.remove('selected');
    });
    
    // check player's turn and if piece exists
    if (piece && piece.color === game.currentPlayer.color) {
        pieceDiv.classList.toggle('selected');
        const moves = game.possibleMoves(rowIndex, colIndex);

        // check if any moves available
        if (moves.length > 0) {
            // highlight potential move locations
            moves.forEach(move => {
                const targetCell = document.querySelector(`.col[data-row='${move.endRow}'][data-col='${move.endCol}']`) as HTMLDivElement;
                if (targetCell) {
                    targetCell.classList.add('highlight');

                    // remove any existing listeners
                    const existingListener = pieceEventListeners.get(targetCell);
                    if (existingListener) {
                        targetCell.removeEventListener('click', existingListener);
                    }

                    // add new event listener to move execution
                    const moveListener = () => {
                        executeMove(rowIndex, colIndex, move.endRow, move.endCol);
                    };
                    targetCell.addEventListener('click', moveListener);
                    pieceEventListeners.set(targetCell, moveListener);
                }
            });
        }
    } 
    else {
        console.log(`It's not ${piece?.color}'s turn.`); // maybe remove this now?
    }
}

// method to move the piece on the DOM
function executeMove(startRow: number, startCol: number, endRow: number, endCol: number) {
    const piece = game.getPiece(startRow, startCol);

    if (piece && piece.color === game.currentPlayer.color) {
        // Move the piece and update the DOM
        game.movePiece(startRow, startCol, endRow, endCol);
        updateBoardDOM();

        // Check if the start position is now empty and the end position has a piece, maybe remove this now
        const pieceAtEnd = game.getPiece(endRow, endCol);
        const pieceAtStart = game.getPiece(startRow, startCol);
        if (!pieceAtStart && pieceAtEnd) {
            console.log(`${piece.color} piece has moved from (${startRow}, ${startCol}) to (${endRow}, ${endCol})`);
        }
    }
}

// method to update the score card of each player as well as declare end of game winner
function updateScoreCard() {
    playerOneName.textContent = `Player One: ${playerOne.name}`;
    playerOneScore.textContent = `Score: ${playerOne.score}`;
    playerOneCaptured.textContent = `Captured Pieces: ${playerOne.capturedPieces}`;

    playerTwoName.textContent = 'Player Two: ' + playerTwo.name;
    playerTwoScore.textContent = 'Score: ' + playerTwo.score;
    playerTwoCaptured.textContent = 'Captured Pieces: ' + playerTwo.capturedPieces;

    if (game.currentPlayer === game.players[0]) {
        playerOneTurn.textContent = `Turn: Yes`;
        playerTwoTurn.textContent = `Turn: No`;
    } else {
        playerOneTurn.textContent = `Turn: No`;
        playerTwoTurn.textContent = `Turn: Yes`;
    }

    game.checkEndOfGame();

    if (game.currentState === State.gameFinished) {
        if (game.winner === game.players[0]) {
            playerOneName.textContent = `${game.players[0].name} has won the game!`;
            playerTwoName.textContent = `${game.players[1].name}, you lost homie`;
        }
        else {
            playerOneName.textContent = `${game.players[1].name} has won the game!`;
            playerTwoName.textContent = `${game.players[0].name}, you lost homie`;
        }
        playerOneTurn.textContent = `Game Over`;
        playerTwoTurn.textContent = `Game Over`;
    }
}

// method to update the board after each move
function updateBoardDOM() {
    clearHighlights();
    // iterate through the board
    rows.forEach((row) => {
        row.querySelectorAll('.col').forEach((col) => {
            // remove all existing pieces and event listeners
            if (col.firstChild) {
                const pieceDiv = col.firstChild as HTMLDivElement;
                const existingListener = pieceEventListeners.get(pieceDiv);
                if (existingListener) {
                    pieceDiv.removeEventListener('click', existingListener);
                    pieceEventListeners.delete(pieceDiv);
                }
                col.removeChild(col.firstChild);
            }
        });
    });
    // populate the board with the pieces as well as their event listeners
    populateBoard();
}

populateBoard();