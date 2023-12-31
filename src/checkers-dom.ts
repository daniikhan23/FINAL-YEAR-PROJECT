import { PieceColor, State, Player, CheckersGame } from './checkers.js';
import { CheckersAI } from './checkers-ai.js';

// DOM Manipulation

/**
 * A map to hold event listeners for each piece on the checkers board.
 */
const pieceEventListeners = new Map<HTMLDivElement, EventListener>();
let game: CheckersGame;

//Initial Screen replace with Game Board

const startLocalGameBtn = document.querySelector('.initial-screen .initial-screen-container .container .name-entry #startGameButton');
startLocalGameBtn?.addEventListener('click', startLocalGame);

const startAIGameBtn = document.querySelector('.initial-screen .initial-screen-container .container .name-entry #startAIGameButton');
startAIGameBtn?.addEventListener('click', startAIGame);

const restartLocalGameButton = document.getElementById('restartLocalGameButton') as HTMLButtonElement;
const restartAIGameButton = document.getElementById('restartAIGameButton') as HTMLButtonElement;


// End of Game elements
const endOfGameSection = document.querySelector('.end-of-game-section') as HTMLElement;
const winnerAnnouncement = document.getElementById('winnerAnnouncement') as HTMLDivElement;
const playerOneFinalName = document.getElementById('playerOneFinalName') as HTMLDivElement;
const playerOneFinalScore = document.getElementById('playerOneFinalScore') as HTMLDivElement;
const playerOneFinalCaptured = document.getElementById('playerOneFinalCaptured') as HTMLDivElement;
const playerTwoFinalName = document.getElementById('playerTwoFinalName') as HTMLDivElement;
const playerTwoFinalScore = document.getElementById('playerTwoFinalScore') as HTMLDivElement;
const playerTwoFinalCaptured = document.getElementById('playerTwoFinalCaptured') as HTMLDivElement;

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
 * Starts the Local 2 player game on the DOM, by hiding the initial screen and showing the main game screen
 */
function startLocalGame() {
    const playerOneName = (document.getElementById('playerOneName') as HTMLInputElement).value || 'Player 1';
    const playerTwoName = (document.getElementById('playerTwoName') as HTMLInputElement).value || 'Player 2';

    const playerOne = new Player(playerOneName, PieceColor.Red);
    const playerTwo = new Player(playerTwoName, PieceColor.Black);
    game = new CheckersGame(playerOne, playerTwo)

    // Update UI with player names
    updateScoreCard();

    (document.querySelector('.initial-screen') as HTMLElement).style.display = 'none';
    (document.querySelector('.main') as HTMLElement).style.display = 'block';

    populateBoard();
}

// AI GAME
/**
 * Starts the game against the AI on the DOM, by hiding the initial screen and showing the main game screen
 */
function startAIGame() {
    const playerOneName = (document.getElementById('playerOneName') as HTMLInputElement).value || 'Player 1';
    const playerTwoName = 'Minimax-2';

    const playerOne = new Player(playerOneName, PieceColor.Red);
    const playerTwo = new Player(playerTwoName, PieceColor.Black);
    game = new CheckersGame(playerOne, playerTwo)

    // Create the AI player and set it as player two
    const ai = new CheckersAI(playerTwoName, PieceColor.Black, game, 2);
    game.setAI(ai);

    // Update UI with player names
    updateScoreCard();

    (document.querySelector('.initial-screen') as HTMLElement).style.display = 'none';
    (document.querySelector('.main') as HTMLElement).style.display = 'block';

    populateBoard();
}

/**
 * Restarts the Game to its start state
 */
restartLocalGameButton.addEventListener('click', () => {
    endOfGameSection.style.display = 'none'; 
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
    startLocalGame();
});

/**
 * Restarts the Game to its start state
 */
restartAIGameButton.addEventListener('click', () => {
    endOfGameSection.style.display = 'none'; 
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
    startAIGame();
});

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
}

/**
 * Executes a move on the DOM based on the selected piece and its destination.
 * Also handles AI moves on the DOM
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

        // Ensure currentPlayer is AI before calling makeMove
        if (game.players[1] instanceof CheckersAI) {
            while (game.currentPlayer === game.players[1]) {
            
                game.players[1].makeMove();
                updateBoardDOM();
            }
        }

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
    playerOneName.textContent = `${game.players[0].name}`;
    playerOneScore.textContent = `Score: ${game.players[0].score}`;
    playerOneCaptured.textContent = `Captured Pieces: ${game.players[0].capturedPieces}`;

    playerTwoName.textContent = `${game.players[1].name}`;
    playerTwoScore.textContent = `Score: ${game.players[1].score}`;
    playerTwoCaptured.textContent = `Captured Pieces: ${game.players[1].capturedPieces}`;

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
            playerTwoName.textContent = `${game.players[1].name}, you lost, homie!`;
        }
        else if (game.winner === game.players[1]) {
            playerOneName.textContent = `${game.players[0].name}, you lost, homie!`;
            playerTwoName.textContent = `${game.players[1].name} has won the game!`;
        }
        else {
            playerOneName.textContent = 'Game is a draw!';
            playerTwoName.textContent = 'Game is a draw!';
        }
            playerOneTurn.textContent = ``;
            playerTwoTurn.textContent = ``;
            endOfGameSection.style.display = 'flex';

            winnerAnnouncement.textContent = game.winner ? `Winner: ${game.winner.name}` : "It's a draw!";
    
            playerOneFinalName.textContent = game.players[0].name;
            playerOneFinalScore.textContent = `Score: ${game.players[0].score}`;
            playerOneFinalCaptured.textContent = `Captured Pieces: ${game.players[0].capturedPieces}`;
    
            playerTwoFinalName.textContent = game.players[1].name;
            playerTwoFinalScore.textContent = `Score: ${game.players[1].score}`;
            playerTwoFinalCaptured.textContent = `Captured Pieces: ${game.players[1].capturedPieces}`;
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
