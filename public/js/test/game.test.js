import { PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame } from "../checkers";
describe('CheckersGame', () => {
    let game;
    let playerOne;
    let playerTwo;
    beforeEach(() => {
        playerOne = new Player("Dani", PieceColor.Red);
        playerTwo = new Player("Khan", PieceColor.Black);
        game = new CheckersGame(playerOne, playerTwo, false);
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
    test('promoteToKing and makeKing should promote a piece to king at the end of the board', () => {
        game.board[0][1] = game.getPiece(5, 0);
        expect(game.promoteToKing(0, 1)).toBe(true);
        game.board[7][0] = game.getPiece(1, 0);
        expect(game.promoteToKing(7, 0)).toBe(true);
        expect(game.promoteToKing(6, 3)).toBe(false);
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
        game.players[0].numOfPieces = 0;
        game.checkEndOfGame();
        expect(game.noPiecesLeft(game.players[0])).toBe(true);
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBe(game.players[1]);
        game = new CheckersGame(playerOne, playerTwo, false);
        game.currentState = State.gameFinished;
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBeNull();
        game.players[0].numOfPieces = 12;
        game.players[1].numOfPieces = 0;
        game.currentState = State.inProgress;
        game.winner = null;
        game.checkEndOfGame();
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBe(game.players[0]);
        game.players[0].numOfPieces = 0;
        game.players[1].numOfPieces = 12;
        game.currentState = State.inProgress;
        game.winner = null;
        game.checkEndOfGame();
        expect(game.currentState).toBe(State.gameFinished);
        expect(game.winner).toBe(game.players[1]);
    });
    test('isVulnerable should correctly determine a piece that can be captured', () => {
        game.movePiece(5, 0, 4, 1);
        game.movePiece(2, 3, 3, 2);
        expect(game.isVulnerable(3, 2)).toBe(true);
        expect(game.isVulnerable(5, 6)).toBe(false);
        expect(game.isVulnerable(4, 1)).toBe(true);
    });
    test('Check if individual pieces capture status has changed', () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.getPiece(row, col);
                if (piece) {
                    expect(piece.captureStatus).toBe(false);
                }
            }
        }
        game.movePiece(5, 2, 4, 3);
        game.movePiece(2, 5, 3, 4);
        expect((_a = game.getPiece(4, 3)) === null || _a === void 0 ? void 0 : _a.captureStatus).toBe(true);
        game.movePiece(5, 6, 4, 7);
        expect((_b = game.getPiece(3, 4)) === null || _b === void 0 ? void 0 : _b.captureStatus).toBe(true);
        expect((_c = game.getPiece(0, 1)) === null || _c === void 0 ? void 0 : _c.captureStatus).toBe(false);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(4, 3, 2, 5);
        expect((_d = game.getPiece(2, 5)) === null || _d === void 0 ? void 0 : _d.captureStatus).toBe(false);
        expect((_e = game.getPiece(1, 6)) === null || _e === void 0 ? void 0 : _e.captureStatus).toBe(true);
        expect((_f = game.getPiece(1, 4)) === null || _f === void 0 ? void 0 : _f.captureStatus).toBe(true);
        expect((_g = game.getPiece(4, 7)) === null || _g === void 0 ? void 0 : _g.captureStatus).toBe(false);
        expect((_h = game.getPiece(0, 1)) === null || _h === void 0 ? void 0 : _h.captureStatus).toBe(false);
        game = new CheckersGame(new Player("Khan", PieceColor.Red), new Player("Sudhan", PieceColor.Black), false);
        game.movePiece(5, 6, 4, 7);
        game.movePiece(2, 5, 3, 6);
        game.movePiece(6, 5, 5, 6);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(7, 4, 6, 5);
        game.movePiece(1, 2, 2, 1);
        game.movePiece(5, 4, 4, 3);
        game.movePiece(0, 3, 1, 2);
        expect((_j = game.getPiece(4, 7)) === null || _j === void 0 ? void 0 : _j.captureStatus).toBe(true);
        game.movePiece(4, 7, 2, 5);
        expect((_k = game.getPiece(2, 5)) === null || _k === void 0 ? void 0 : _k.captureStatus).toBe(true);
        game.movePiece(2, 5, 0, 3);
        expect((_l = game.getPiece(0, 3)) === null || _l === void 0 ? void 0 : _l.captureStatus).toBe(false);
    });
});
//# sourceMappingURL=game.test.js.map