import { PieceColor, Player, CheckersGame } from "../checkers";
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
        ai = new CheckersAI('Zero', PieceColor.Black, game);
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
});
//# sourceMappingURL=checkers-ai.test.js.map