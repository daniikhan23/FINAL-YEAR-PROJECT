import { Moves, PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame } from "../checkers";
import { CheckersAI } from "../checkers-ai";

describe('CheckersGame', () => {
    let game: CheckersGame;
    let playerOne: Player;
    let playerTwo: Player;

    beforeEach(() => {
        playerOne = new Player("Dani", PieceColor.Red);
        playerTwo = new Player("Khan", PieceColor.Black);
        game = new CheckersGame(playerOne, playerTwo);
    });

    test('Check if AI has been correctly initialised to player 2', () => {
        const aiPlayer = new CheckersAI('Zero', PieceColor.Black, game);
        game.setAI(aiPlayer);
    
        expect(game.players[1]).toBeInstanceOf(CheckersAI);
        expect(game.players[1]).toBe(aiPlayer);
        expect(game.players[1].name).toBe('Zero');
        expect(game.players[1].color).toBe(PieceColor.Black);
    });
});
