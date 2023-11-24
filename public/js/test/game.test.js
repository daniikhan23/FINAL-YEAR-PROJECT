import { PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame } from "../checkers";
describe('CheckersGame', () => {
    let game;
    let playerOne;
    let playerTwo;
    beforeEach(() => {
        playerOne = new Player("Dani", PieceColor.Red);
        playerTwo = new Player("Khan", PieceColor.Black);
        game = new CheckersGame(playerOne, playerTwo);
    });
    test('Game should be initialized correctly', () => {
        expect(game.players[0]).toBe(playerOne);
        expect(game.players[1]).toBe(playerTwo);
        expect(game.currentState).toBe(State.inProgress);
        expect(game.currentPlayer).toBe(playerOne);
        expect(game.board).toBeDefined();
        expect(game.board.length).toBe(8);
        expect(game.winner).toBeNull();
        game.board.forEach(row => expect(row.length).toBe(8));
    });
    test('changeTurn() should always choose the correct player', () => {
        expect(game.currentPlayer).toBe(playerOne);
        game.changeTurn();
        expect(game.currentPlayer).toBe(playerTwo);
        game.changeTurn();
        expect(game.currentPlayer).toBe(playerOne);
    });
    test('getPiece() should return the correct piece at a given coordinate', () => {
        var _a, _b;
        expect(game.getPiece(0, 1)).toBeInstanceOf(CheckersPiece);
        expect((_a = game.getPiece(0, 1)) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Black);
        expect(game.getPiece(5, 0)).toBeInstanceOf(CheckersPiece);
        expect((_b = game.getPiece(5, 0)) === null || _b === void 0 ? void 0 : _b.color).toBe(PieceColor.Red);
        expect(game.getPiece(3, 3)).toBeNull();
    });
    test('Ensure pieces are king or not correctly', () => {
        var _a, _b;
        expect((_a = game.getPiece(0, 1)) === null || _a === void 0 ? void 0 : _a.isKing).toBe(false);
        expect((_b = game.getPiece(5, 0)) === null || _b === void 0 ? void 0 : _b.isKing).toBe(false);
        const piece = new CheckersPiece(PieceColor.Red, false);
        piece.makeKing();
        expect(piece.isKing).toBe(true);
    });
    test('movePiece should correctly handle valid and invalid moves', () => {
        expect(() => game.movePiece(5, 0, 4, 1)).not.toThrow();
        expect(game.getPiece(4, 1)).toBeInstanceOf(CheckersPiece);
        game.board = new CheckersBoard().board;
        game.movePiece(5, 0, 6, 1);
        expect(game.getPiece(5, 0)).toBeInstanceOf(CheckersPiece);
        game.board = new CheckersBoard().board;
        game.movePiece(0, 1, 5, 7);
        expect(game.getPiece(5, 7)).toBeNull();
    });
    test('promoteToKing should promote a piece to king at the end of the board', () => {
        var _a, _b, _c;
        game.board[0][1] = game.getPiece(5, 0);
        game.promoteToKing(0, 1);
        expect((_a = game.getPiece(0, 1)) === null || _a === void 0 ? void 0 : _a.isKing).toBe(true);
        game.board[7][0] = game.getPiece(1, 0);
        game.promoteToKing(7, 0);
        expect((_b = game.getPiece(7, 0)) === null || _b === void 0 ? void 0 : _b.isKing).toBe(true);
        game.promoteToKing(6, 3);
        expect((_c = game.getPiece(6, 3)) === null || _c === void 0 ? void 0 : _c.isKing).toBe(false);
    });
    test('Capturing mechanics should work correctly, including chain captures, score and captured piece updates', () => {
        var _a, _b, _c;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                game.board[row][col] = null;
            }
        }
        game.board[4][1] = new CheckersPiece(PieceColor.Black);
        game.board[5][0] = new CheckersPiece(PieceColor.Red);
        game.movePiece(5, 0, 3, 2);
        expect(game.getPiece(4, 1)).toBeNull();
        expect(game.getPiece(3, 2)).toBeInstanceOf(CheckersPiece);
        expect((_a = game.getPiece(3, 2)) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Red);
        expect(game.players[0].capturedPieces).toBe(1);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                game.board[row][col] = null;
            }
        }
        game.changeTurn();
        const kingPiece = new CheckersPiece(PieceColor.Black);
        kingPiece.isKing = true;
        game.board[5][1] = kingPiece;
        game.board[6][0] = new CheckersPiece(PieceColor.Red);
        game.board[3][1] = new CheckersPiece(PieceColor.Black);
        game.movePiece(6, 0, 4, 2);
        expect(game.getPiece(5, 1)).toBeNull();
        expect(game.getPiece(4, 2)).toBeInstanceOf(CheckersPiece);
        expect((_b = game.getPiece(4, 2)) === null || _b === void 0 ? void 0 : _b.color).toBe(PieceColor.Red);
        expect(game.players[0].capturedPieces).toBe(2);
        expect(game.players[0].score).toBe(3);
        game.movePiece(4, 2, 2, 0);
        expect(game.getPiece(3, 1)).toBeNull();
        expect(game.getPiece(2, 0)).toBeInstanceOf(CheckersPiece);
        expect((_c = game.getPiece(2, 0)) === null || _c === void 0 ? void 0 : _c.color).toBe(PieceColor.Red);
        expect(game.players[0].capturedPieces).toBe(3);
        expect(game.players[0].score).toBe(4);
    });
    test('possibleMoves should return all valid moves for a piece or none if there are none', () => {
        let moves = game.possibleMoves(5, 0);
        expect(moves).toBeInstanceOf(Array);
        expect(moves.length).toBeGreaterThan(0);
        expect(moves.length).toBe(1);
        moves = game.possibleMoves(0, 1);
        expect(moves).toBeInstanceOf(Array);
        expect(moves.length).toBe(0);
        moves = game.possibleMoves(5, 6);
        expect(moves).toBeInstanceOf(Array);
        expect(moves.length).toBeGreaterThan(0);
        expect(moves.length).toBe(2);
    });
    test('Endgame conditions should be correctly detected', () => {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece && piece.color === PieceColor.Red) {
                    game.board[row][col] = null;
                }
            }
        }
        game.checkEndOfGame();
        expect(game.noPiecesLeft(game.players[0])).toBe(true);
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBe(game.players[1]);
        game = new CheckersGame(playerOne, playerTwo);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row > 0 && row < 4 && (row + col) % 2 === 1) {
                    game.board[row][col] = new CheckersPiece(PieceColor.Black);
                }
                else if (row >= 4 && row < 7 && (row + col) % 2 === 1) {
                    game.board[row][col] = new CheckersPiece(PieceColor.Red);
                }
                else {
                    game.board[row][col] = null;
                }
            }
        }
        game.players[0].score = 0;
        game.players[1].score = 0;
        game.checkEndOfGame();
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBeNull();
        game.players[0].score = 1;
        game.players[1].score = 0;
        game.currentState = State.inProgress;
        game.winner = null;
        game.checkEndOfGame();
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBe(game.players[0]);
        game.players[0].score = 0;
        game.players[1].score = 1;
        game.currentState = State.inProgress;
        game.winner = null;
        game.checkEndOfGame();
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBe(game.players[1]);
    });
});
//# sourceMappingURL=game.test.js.map