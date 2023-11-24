import { PieceColor, State, Player, CheckersGame } from './checkers.js';
const pieceEventListeners = new Map();
const playerOne = new Player("Red", PieceColor.Red);
const playerTwo = new Player("Black", PieceColor.Black);
const game = new CheckersGame(playerOne, playerTwo);
let gameStatus = false;
const playerOneName = document.querySelector('.player-one .container .name');
const playerOneScore = document.querySelector('.player-one .container .score');
const playerOneCaptured = document.querySelector('.player-one .container .captured');
const playerOneTurn = document.querySelector('.player-one .container .turn');
const playerTwoName = document.querySelector('.player-two .container .name');
const playerTwoScore = document.querySelector('.player-two .container .score');
const playerTwoCaptured = document.querySelector('.player-two .container .captured');
const playerTwoTurn = document.querySelector('.player-two .container .turn');
const rows = document.querySelectorAll('.board-container .container .row');
function populateBoard() {
    updateScoreCard();
    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll('.col');
        cols.forEach((col, colIndex) => {
            const piece = game.getPiece(rowIndex, colIndex);
            if (piece) {
                const pieceDiv = document.createElement('div');
                if (piece.isKing === true) {
                    pieceDiv.classList.add(piece.color === PieceColor.Black ? 'black-piece-king' : 'red-piece-king');
                }
                else {
                    pieceDiv.classList.add(piece.color === PieceColor.Black ? 'black-piece' : 'red-piece');
                }
                col.appendChild(pieceDiv);
                pieceDiv.addEventListener("click", selectPiece.bind(null, rowIndex, colIndex, pieceDiv));
            }
        });
    });
}
function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(highlightedElement => {
        const highlighted = highlightedElement;
        highlighted.classList.remove('highlight');
        const moveListener = pieceEventListeners.get(highlighted);
        if (moveListener) {
            highlighted.removeEventListener("click", moveListener);
            pieceEventListeners.delete(highlighted);
        }
    });
}
function selectPiece(rowIndex, colIndex, pieceDiv) {
    const piece = game.getPiece(rowIndex, colIndex);
    clearHighlights();
    document.querySelectorAll('.black-piece, .red-piece').forEach(p => {
        p.classList.remove('selected');
    });
    document.querySelectorAll('.black-piece-king, .red-piece-king').forEach(p => {
        p.classList.remove('selected');
    });
    if (piece && piece.color === game.currentPlayer.color) {
        pieceDiv.classList.toggle('selected');
        const moves = game.possibleMoves(rowIndex, colIndex);
        if (moves.length > 0) {
            moves.forEach(move => {
                const targetCell = document.querySelector(`.col[data-row='${move.endRow}'][data-col='${move.endCol}']`);
                if (targetCell) {
                    targetCell.classList.add('highlight');
                    const existingListener = pieceEventListeners.get(targetCell);
                    if (existingListener) {
                        targetCell.removeEventListener('click', existingListener);
                    }
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
function executeMove(startRow, startCol, endRow, endCol) {
    const piece = game.getPiece(startRow, startCol);
    if (piece && piece.color === game.currentPlayer.color) {
        game.movePiece(startRow, startCol, endRow, endCol);
        updateBoardDOM();
        const pieceAtEnd = game.getPiece(endRow, endCol);
        const pieceAtStart = game.getPiece(startRow, startCol);
        if (!pieceAtStart && pieceAtEnd) {
            console.log(`${piece.color} piece has moved from (${startRow}, ${startCol}) to (${endRow}, ${endCol})`);
        }
    }
}
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
    }
    else {
        playerOneTurn.textContent = `Turn: No`;
        playerTwoTurn.textContent = `Turn: Yes`;
    }
    game.checkEndOfGame();
    if (game.currentState === State.gameFinished) {
        if (game.winner === game.players[0]) {
            playerOneName.textContent = `${game.players[0].name} has won the game!`;
            playerTwoName.textContent = `${game.players[1].name}, you lost homie`;
        }
        else if (game.winner === game.players[1]) {
            playerOneName.textContent = `${game.players[0].name}, you lost homie`;
            playerTwoName.textContent = `${game.players[1].name} has won the game!`;
        }
        else {
            playerOneName.textContent = 'Game is a draw!';
            playerTwoName.textContent = 'Game is a draw!';
        }
        playerOneTurn.textContent = `Game Over`;
        playerTwoTurn.textContent = `Game Over`;
    }
}
function updateBoardDOM() {
    clearHighlights();
    rows.forEach((row) => {
        row.querySelectorAll('.col').forEach((col) => {
            if (col.firstChild) {
                const pieceDiv = col.firstChild;
                const existingListener = pieceEventListeners.get(pieceDiv);
                if (existingListener) {
                    pieceDiv.removeEventListener('click', existingListener);
                    pieceEventListeners.delete(pieceDiv);
                }
                col.removeChild(col.firstChild);
            }
        });
    });
    populateBoard();
}
populateBoard();
//# sourceMappingURL=checkersdom.js.map