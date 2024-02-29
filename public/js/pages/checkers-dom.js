import { PieceColor, State, Player, CheckersGame } from '../components/checkers.js';
import { CheckersAI } from '../components/checkers-ai.js';
const pieceEventListeners = new Map();
let game;
const startLocalGameBtn = document.querySelector('.initial-screen .initial-screen-container .container .name-entry #startGameButton');
startLocalGameBtn === null || startLocalGameBtn === void 0 ? void 0 : startLocalGameBtn.addEventListener('click', startLocalGame);
const startAIGameBtn = document.querySelector('.initial-screen .initial-screen-container .container .name-entry #startAIGameButton');
startAIGameBtn === null || startAIGameBtn === void 0 ? void 0 : startAIGameBtn.addEventListener('click', startAIGame);
let enforcedJumpCheck;
const checkBox = document.querySelector('.initial-screen .initial-screen-container .container .name-entry #enforcedJumps');
checkBox === null || checkBox === void 0 ? void 0 : checkBox.addEventListener('change', (event) => {
    const target = event.target;
    if (target.checked) {
        enforcedJumpCheck = true;
        console.log(`Jumps: ${enforcedJumpCheck}`);
    }
    else {
        enforcedJumpCheck = false;
        console.log(`Jumps: ${enforcedJumpCheck}`);
    }
});
const restartLocalGameButton = document.getElementById('restartLocalGameButton');
const restartAIGameButton = document.getElementById('restartAIGameButton');
const endOfGameSection = document.querySelector('.end-of-game-section');
const winnerAnnouncement = document.getElementById('winnerAnnouncement');
const playerOneFinalName = document.getElementById('playerOneFinalName');
const playerOneFinalScore = document.getElementById('playerOneFinalScore');
const playerOneFinalCaptured = document.getElementById('playerOneFinalCaptured');
const playerTwoFinalName = document.getElementById('playerTwoFinalName');
const playerTwoFinalScore = document.getElementById('playerTwoFinalScore');
const playerTwoFinalCaptured = document.getElementById('playerTwoFinalCaptured');
const playerOneName = document.querySelector('.player-one .container .name');
const playerOneScore = document.querySelector('.player-one .container .score');
const playerOneCaptured = document.querySelector('.player-one .container .captured');
const playerOneTurn = document.querySelector('.player-one .container .turn');
const playerTwoName = document.querySelector('.player-two .container .name');
const playerTwoScore = document.querySelector('.player-two .container .score');
const playerTwoCaptured = document.querySelector('.player-two .container .captured');
const playerTwoTurn = document.querySelector('.player-two .container .turn');
const rows = document.querySelectorAll('.board-container .container .row');
function startLocalGame() {
    const playerOneName = document.getElementById('playerOneName').value || 'Player 1';
    const playerTwoName = document.getElementById('playerTwoName').value || 'Player 2';
    const playerOne = new Player(playerOneName, PieceColor.Red);
    const playerTwo = new Player(playerTwoName, PieceColor.Black);
    game = new CheckersGame(playerOne, playerTwo, enforcedJumpCheck);
    updateScoreCard();
    document.querySelector('.initial-screen').style.display = 'none';
    document.querySelector('.main').style.display = 'block';
    populateBoard();
}
function startAIGame() {
    const playerOneName = document.getElementById('playerOneName').value || 'Player 1';
    const playerTwoName = 'Minimax-A/B';
    const playerOne = new Player(playerOneName, PieceColor.Red);
    const playerTwo = new Player(playerTwoName, PieceColor.Black);
    game = new CheckersGame(playerOne, playerTwo, enforcedJumpCheck);
    const ai = new CheckersAI(playerTwoName, PieceColor.Black, game, 5);
    game.setAI(ai);
    updateScoreCard();
    document.querySelector('.initial-screen').style.display = 'none';
    document.querySelector('.main').style.display = 'block';
    populateBoard();
}
restartLocalGameButton.addEventListener('click', () => {
    endOfGameSection.style.display = 'none';
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
    startLocalGame();
});
restartAIGameButton.addEventListener('click', () => {
    endOfGameSection.style.display = 'none';
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
    startAIGame();
});
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
        if (game.players[1] instanceof CheckersAI) {
            while (game.currentPlayer === game.players[1]) {
                game.players[1].makeMove();
                updateBoardDOM();
            }
        }
        const pieceAtEnd = game.getPiece(endRow, endCol);
        const pieceAtStart = game.getPiece(startRow, startCol);
        if (!pieceAtStart && pieceAtEnd) {
            console.log(`${piece.color} piece has moved from (${startRow}, ${startCol}) to (${endRow}, ${endCol})`);
        }
    }
}
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
    }
    else {
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
//# sourceMappingURL=checkers-dom.js.map