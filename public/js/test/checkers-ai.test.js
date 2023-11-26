import { Moves, PieceColor, CheckersPiece, Player, CheckersGame } from "../checkers";
import { CheckersAI } from "../checkers-ai";
describe('CheckersGame', () => {
    let game;
    let playerOne;
    let playerTwo;
    let ai;
    beforeEach(() => {
        playerOne = new Player("Dani", PieceColor.Red);
        playerTwo = new Player("Khan", PieceColor.Black);
        game = new CheckersGame(playerOne, playerTwo);
        ai = new CheckersAI('Zero', PieceColor.Black, game, 2);
        game.setAI(ai);
    });
    test('Check if AI has been correctly initialised to player 2', () => {
        expect(game.players[1]).toBeInstanceOf(CheckersAI);
        expect(game.players[1]).toBe(ai);
        expect(game.players[1].name).toBe('Zero');
        expect(game.players[1].color).toBe(PieceColor.Black);
    });
    test('Evaluation of the initial game state should result in a score of 0', () => {
        expect(ai.evaluateState(game)).toBe(0);
    });
    test('AI should have greater number of pieces than the player', () => {
        game.movePiece(5, 2, 4, 1);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(5, 6, 4, 7);
        game.movePiece(3, 0, 5, 2);
        expect(ai.evaluateState(game)).toBe(1);
    });
    test('Player should have maore pieces than the AI', () => {
        game.movePiece(5, 6, 4, 7);
        game.movePiece(2, 5, 3, 6);
        game.movePiece(4, 7, 2, 5);
        expect(ai.evaluateState(game)).toBe(-1);
    });
    test('Basic move without captures', () => {
        game.movePiece(5, 6, 4, 7);
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 1, 3, 0);
        expect(capturedPieces).toHaveLength(0);
        expect(wasPromoted).toBe(false);
    });
    test('Singular capture scenarios should work appropriately', () => {
        game.movePiece(5, 6, 4, 7);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(5, 2, 4, 1);
        const [capturedPieces, wasPromoted] = game.simulateMove(3, 0, 5, 2);
        expect(capturedPieces).toHaveLength(1);
        expect(wasPromoted).toBe(false);
    });
    test('Chain Captures', () => {
        game.movePiece(5, 6, 4, 5);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(4, 5, 3, 4);
        game.movePiece(1, 0, 2, 1);
        game.movePiece(6, 7, 5, 6);
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 3, 4, 5);
        expect(capturedPieces).toHaveLength(2);
        expect(wasPromoted).toBe(false);
        expect(game.board[2][3]).toBeNull();
        expect(game.board[3][4]).toBeNull();
        expect(game.board[4][5]).toBeNull();
        expect(game.board[5][6]).toBeNull();
        expect(game.board[6][7]).not.toBeNull();
    });
    test('Chain Captures leading to Piece Promotion', () => {
        var _a, _b;
        game.movePiece(5, 6, 4, 7);
        game.movePiece(2, 1, 3, 2);
        game.movePiece(6, 7, 5, 6);
        game.movePiece(3, 2, 4, 3);
        game.movePiece(5, 4, 3, 2);
        game.movePiece(2, 5, 3, 6);
        game.movePiece(6, 5, 5, 4);
        game.movePiece(1, 4, 2, 5);
        game.movePiece(3, 2, 2, 1);
        game.movePiece(0, 5, 1, 4);
        game.movePiece(5, 4, 4, 3);
        game.movePiece(2, 5, 3, 4);
        game.movePiece(7, 6, 6, 5);
        const [capturedPieces, wasPromoted] = game.simulateMove(1, 0, 3, 2);
        expect(capturedPieces).toHaveLength(3);
        expect(wasPromoted).toBe(true);
        expect(game.board[1][0]).toBeNull();
        expect(game.board[2][1]).toBeNull();
        expect(game.board[3][2]).toBeNull();
        expect(game.board[4][3]).toBeNull();
        expect(game.board[5][4]).toBeNull();
        expect(game.board[6][5]).toBeNull();
        expect(game.board[7][6]).not.toBeNull();
        expect(game.board[7][6]).toBeInstanceOf(CheckersPiece);
        expect((_a = game.board[7][6]) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Black);
        expect((_b = game.board[7][6]) === null || _b === void 0 ? void 0 : _b.isKing).toBe(true);
    });
    test('Undo: Basic move without captures', () => {
        game.movePiece(5, 6, 4, 7);
        const piece = game.getPiece(2, 1);
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 1, 3, 0);
        game.undoSimulation(2, 1, 3, 0, capturedPieces, wasPromoted);
        expect(game.board[3][0]).toBeNull();
        expect(piece).toBe(game.board[2][1]);
        expect(piece === null || piece === void 0 ? void 0 : piece.isKing).toBe(false);
        expect(piece === null || piece === void 0 ? void 0 : piece.color).toBe(PieceColor.Black);
    });
    test('Undo: Singular capture scenarios should work appropriately', () => {
        var _a;
        game.movePiece(5, 6, 4, 7);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(5, 2, 4, 1);
        const piece = game.getPiece(3, 0);
        const [capturedPieces, wasPromoted] = game.simulateMove(3, 0, 5, 2);
        game.undoSimulation(3, 0, 5, 2, capturedPieces, wasPromoted);
        expect(game.board[5][2]).toBeNull();
        expect(piece).toBe(game.board[3][0]);
        expect(piece === null || piece === void 0 ? void 0 : piece.isKing).toBe(false);
        expect(piece === null || piece === void 0 ? void 0 : piece.color).toBe(PieceColor.Black);
        expect(game.board[4][1]).toBeInstanceOf(CheckersPiece);
        expect((_a = game.board[4][1]) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Red);
    });
    test('Undo: Chain Captures', () => {
        var _a, _b;
        game.movePiece(5, 6, 4, 5);
        game.movePiece(2, 1, 3, 0);
        game.movePiece(4, 5, 3, 4);
        game.movePiece(1, 0, 2, 1);
        game.movePiece(6, 7, 5, 6);
        const piece = game.getPiece(2, 3);
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 3, 4, 5);
        game.undoSimulation(2, 3, 6, 7, capturedPieces, wasPromoted);
        expect(game.board[2][3]).not.toBeNull();
        expect(game.board[3][4]).not.toBeNull();
        expect(game.board[4][5]).toBeNull();
        expect(game.board[5][6]).not.toBeNull();
        expect(game.board[6][7]).toBeNull();
        expect(piece).toBe(game.board[2][3]);
        expect(piece === null || piece === void 0 ? void 0 : piece.color).toBe(PieceColor.Black);
        expect((_a = game.board[3][4]) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Red);
        expect((_b = game.board[5][6]) === null || _b === void 0 ? void 0 : _b.color).toBe(PieceColor.Red);
    });
    test('Chain Captures leading to Piece Promotion', () => {
        var _a, _b, _c;
        game.movePiece(5, 6, 4, 7);
        game.movePiece(2, 1, 3, 2);
        game.movePiece(6, 7, 5, 6);
        game.movePiece(3, 2, 4, 3);
        game.movePiece(5, 4, 3, 2);
        game.movePiece(2, 5, 3, 6);
        game.movePiece(6, 5, 5, 4);
        game.movePiece(1, 4, 2, 5);
        game.movePiece(3, 2, 2, 1);
        game.movePiece(0, 5, 1, 4);
        game.movePiece(5, 4, 4, 3);
        game.movePiece(2, 5, 3, 4);
        game.movePiece(7, 6, 6, 5);
        const piece = game.getPiece(1, 0);
        const [capturedPieces, wasPromoted] = game.simulateMove(1, 0, 3, 2);
        game.undoSimulation(1, 0, 7, 6, capturedPieces, wasPromoted);
        expect(game.board[1][0]).not.toBeNull();
        expect(game.board[2][1]).not.toBeNull();
        expect(game.board[3][2]).toBeNull();
        expect(game.board[4][3]).not.toBeNull();
        expect(game.board[5][4]).toBeNull();
        expect(game.board[6][5]).not.toBeNull();
        expect(game.board[7][6]).toBeNull();
        expect(piece).toBe(game.board[1][0]);
        expect(piece === null || piece === void 0 ? void 0 : piece.color).toBe(PieceColor.Black);
        expect(piece === null || piece === void 0 ? void 0 : piece.isKing).toBe(false);
        expect((_a = game.board[2][1]) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Red);
        expect((_b = game.board[4][3]) === null || _b === void 0 ? void 0 : _b.color).toBe(PieceColor.Red);
        expect((_c = game.board[6][5]) === null || _c === void 0 ? void 0 : _c.color).toBe(PieceColor.Red);
    });
    test('Basic Move Test for starting board', () => {
        game.movePiece(5, 0, 4, 1);
        const [, aiMove] = ai.minimax(game, 1, true);
        const expectedMoves = [
            new Moves(2, 1, 3, 0), new Moves(2, 1, 3, 2), new Moves(2, 3, 3, 2), new Moves(2, 3, 3, 4),
            new Moves(2, 5, 3, 3), new Moves(2, 5, 3, 7), new Moves(2, 7, 3, 6)
        ];
        const isValidMove = expectedMoves.some(expectedMove => expectedMove.startRow === (aiMove === null || aiMove === void 0 ? void 0 : aiMove.startRow) &&
            expectedMove.startCol === (aiMove === null || aiMove === void 0 ? void 0 : aiMove.startCol) &&
            expectedMove.endRow === (aiMove === null || aiMove === void 0 ? void 0 : aiMove.endRow) &&
            expectedMove.endCol === (aiMove === null || aiMove === void 0 ? void 0 : aiMove.endCol));
        expect(isValidMove).toBe(true);
    });
});
//# sourceMappingURL=checkers-ai.test.js.map