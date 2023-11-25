import { Moves, PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame } from "../checkers";
import { CheckersAI } from "../checkers-ai";

describe('CheckersGame', () => {
    let game: CheckersGame;
    let playerOne: Player;
    let playerTwo: Player;
    let ai: CheckersAI;

    beforeEach(() => {
        playerOne = new Player("Dani", PieceColor.Red);
        playerTwo = new Player("Khan", PieceColor.Black);
        game = new CheckersGame(playerOne, playerTwo);
        ai = new CheckersAI('Zero', PieceColor.Black, game);
        game.setAI(ai);
    });

    // Tests for initialisation of AI player
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
        // red turn
        game.movePiece(5, 2, 4, 1);
        // black turn
        game.movePiece(2, 1, 3, 0);
        // red turn
        game.movePiece(5, 6, 4, 7);
        // black turn
        game.movePiece(3, 0, 5, 2);
        expect(ai.evaluateState(game)).toBe(1);
    });
    test('Player should have maore pieces than the AI', () => {
        // red turn
        game.movePiece(5, 6, 4, 7);
        // black turn
        game.movePiece(2, 5, 3, 6);
        // red turn
        game.movePiece(4, 7, 2, 5)
        expect(ai.evaluateState(game)).toBe(-1);
    });

    // Tests for Move Simulation:
    // Move Simulation Tests
    test('Basic move without captures', () => {
        // red turn
        game.movePiece(5, 6, 4, 7);
        // ai/black turn
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 1, 3, 0);
        expect(capturedPieces).toHaveLength(0);
        expect(wasPromoted).toBe(false);
    });
    test('Singular capture scenarios should work appropriately', () => {
        // red turn
        game.movePiece(5, 6, 4, 7);
        // ai/black turn
        game.movePiece(2, 1, 3, 0);
        // red turn
        game.movePiece(5, 2, 4, 1);
        //ai/black turn
        const [capturedPieces, wasPromoted] = game.simulateMove(3, 0, 5, 2);
        expect(capturedPieces).toHaveLength(1);
        expect(wasPromoted).toBe(false);
    });
    test('Chain Captures', () => {
        //red turn
        game.movePiece(5, 6, 4, 5);
        //black turn 
        game.movePiece(2, 1, 3, 0);
        // red turn
        game.movePiece(4, 5, 3, 4);
        //black turn 
        game.movePiece(1, 0, 2, 1);
        // red turn
        game.movePiece(6, 7, 5, 6);
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 3, 4, 5);
        expect(capturedPieces).toHaveLength(2);
        expect(wasPromoted).toBe(false);
    });
    test('Chain Captures leading to Piece Promotion', () => {
        game.movePiece(5, 6, 4, 7); //red turn
        game.movePiece(2, 1, 3, 2); // black turn
        game.movePiece(6, 7, 5, 6); // red turn
        game.movePiece(3, 2, 4, 3); // black turn
        game.movePiece(5, 4, 3, 2); // red turn
        game.movePiece(2, 5, 3, 6); // black turn
        game.movePiece(6, 5, 5, 4); // red turn
        game.movePiece(1, 4, 2, 5); // black turn
        game.movePiece(3, 2, 2, 1); // red turn
        game.movePiece(0, 5, 1, 4); // black turn
        game.movePiece(5, 4, 4, 3); // red turn
        game.movePiece(2, 5, 3, 4); // black turn
        game.movePiece(7, 6, 6, 5); // red turn
        const [capturedPieces, wasPromoted] = game.simulateMove(1, 0, 3, 2);
        expect(capturedPieces).toHaveLength(3);
        expect(wasPromoted).toBe(true);
    });
    // Undo Move Simulation Tests
    test('Undo: Basic move without captures', () => {
        // red turn
        game.movePiece(5, 6, 4, 7);
        // ai/black turn
        const [capturedPieces, wasPromoted] = game.simulateMove(2, 1, 3, 0);
        game.undoSimulation(2, 1, 3, 0, capturedPieces, wasPromoted);
        expect(game.board[3][0]).toBeNull();
    });
});
