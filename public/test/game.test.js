import { PieceColor, CheckersPiece, State, Player, CheckersGame } from "../checkers";
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
});
//# sourceMappingURL=game.test.js.map