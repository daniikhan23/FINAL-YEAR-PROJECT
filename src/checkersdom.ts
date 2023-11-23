import { PieceColor, State, Player, CheckersGame } from './checkers.js';

// DOM Manipulation

/**
 * A map to hold event listeners for each piece on the checkers board.
 */
const pieceEventListeners = new Map<HTMLDivElement, EventListener>();

// Initial setup of players and game instance
const playerOne = new Player("Red", PieceColor.Red);
const playerTwo = new Player("Black", PieceColor.Black);
const game = new CheckersGame(playerOne, playerTwo);
let gameStatus: boolean = false;

// DOM Element References
// Player One
const playerOneName = document.querySelector('.player-one .container .name') as HTMLDivElement;
const playerOneScore = document.querySelector('.player-one .container .score') as HTMLDivElement;
const playerOneCaptured = document.querySelector('.player-one .container .captured') as HTMLDivElement;
const playerOneTurn = document.querySelector('.player-one .container .turn') as HTMLDivElement;

//Player Two
const playerTwoName = document.querySelector('.player-two .container .name') as HTMLDivElement;
const playerTwoScore = document.querySelector('.player-two .container .score') as HTMLDivElement;
const playerTwoCaptured = document.querySelector('.player-two .container .captured') as HTMLDivElement;
const playerTwoTurn = document.querySelector('.player-two .container .turn') as HTMLDivElement;

const rows = document.querySelectorAll('.board-container .container .row')!;

/**
 * Populates the game board on the DOM, showing the current state of the game.
 */
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

/**
 * Clears any highlighted cells and removes event listeners from them.
 */
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

/**
 * Handles the selection of pieces on the DOM, highlights potential move locations, 
 * and adds listeners for move execution if possible.
 * @param {number} rowIndex - The row index of the selected piece.
 * @param {number} colIndex - The column index of the selected piece.
 * @param {HTMLDivElement} pieceDiv - The div element of the selected piece.
 */
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

/**
 * Executes a move on the DOM based on the selected piece and its destination.
 * @param {number} startRow - The starting row of the move.
 * @param {number} startCol - The starting column of the move.
 * @param {number} endRow - The ending row of the move.
 * @param {number} endCol - The ending column of the move.
 */
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

/**
 * Updates the score card of each player and declares the winner if the game has ended.
 */
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

/**
 * Updates the board on the DOM after each move, clearing old pieces and event listeners, 
 * and repopulating with current game state.
 */
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