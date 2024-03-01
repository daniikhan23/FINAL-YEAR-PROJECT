import {
  Moves,
  PieceColor,
  CheckersPiece,
  CheckersBoard,
  State,
  Player,
  CheckersGame,
} from "../components/checkersGame";
import { CheckersAI } from "../components/checkersAI";

describe("CheckersGame", () => {
  let game: CheckersGame, ai: CheckersAI;

  beforeEach(() => {
    game = new CheckersGame(
      new Player("Player 1", PieceColor.Red),
      new Player("AI", PieceColor.Black),
      false
    );
    ai = new CheckersAI("Zero", PieceColor.Black, game, 1); // depth set to 1 for simplicity
    game.setAI(ai);
  });

  // // Tests for initialisation of AI player
  test("Check if AI has been correctly initialised to player 2", () => {
    expect(game.players[1]).toBeInstanceOf(CheckersAI);
    expect(game.players[1]).toBe(ai);
    expect(game.players[1].name).toBe("Zero");
    expect(game.players[1].color).toBe(PieceColor.Black);
  });
  test("Evaluation of the initial game state should result in a score of 0", () => {
    expect(ai.heuristic(game)).toBe(0);
  });
  test("AI should have greater number of pieces than the player", () => {
    // red turn
    game.movePiece(5, 2, 4, 1);
    // black turn
    game.movePiece(2, 1, 3, 0);
    // red turn
    game.movePiece(5, 6, 4, 7);
    // black turn
    game.movePiece(3, 0, 5, 2);
    expect(ai.heuristic(game)).toBe(1);
  });
  test("Player should have maore pieces than the AI", () => {
    // red turn
    game.movePiece(5, 6, 4, 7);
    // black turn
    game.movePiece(2, 5, 3, 6);
    // red turn
    game.movePiece(4, 7, 2, 5);
    expect(ai.heuristic(game)).toBe(-1);
  });

  // Tests for Move Simulation:
  // Move Simulation Tests
  test("Basic move without captures", () => {
    // red turn
    game.movePiece(5, 6, 4, 7);
    // ai/black turn
    const [capturedPieces, wasPromoted] = game.simulateMove(2, 1, 3, 0);
    expect(capturedPieces).toHaveLength(0);
    expect(wasPromoted).toBe(false);
  });
  test("Singular capture scenarios should work appropriately", () => {
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
  test("Chain Captures", () => {
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
    expect(game.board[2][3]).toBeNull();
    expect(game.board[3][4]).toBeNull();
    expect(game.board[4][5]).toBeNull();
    expect(game.board[5][6]).toBeNull();
    expect(game.board[6][7]).not.toBeNull();
  });
  test("Chain Captures leading to Piece Promotion", () => {
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
    expect(game.board[1][0]).toBeNull();
    expect(game.board[2][1]).toBeNull();
    expect(game.board[3][2]).toBeNull();
    expect(game.board[4][3]).toBeNull();
    expect(game.board[5][4]).toBeNull();
    expect(game.board[6][5]).toBeNull();
    expect(game.board[7][6]).not.toBeNull();
    expect(game.board[7][6]).toBeInstanceOf(CheckersPiece);
    expect(game.board[7][6]?.color).toBe(PieceColor.Black);
    expect(game.board[7][6]?.isKing).toBe(true);
  });
  // Undo Move Simulation Tests
  test("Undo: Basic move without captures", () => {
    // red turn
    game.movePiece(5, 6, 4, 7);
    // ai/black turn
    const piece = game.getPiece(2, 1);
    const [capturedPieces, wasPromoted] = game.simulateMove(2, 1, 3, 0);

    game.undoSimulation(2, 1, 3, 0, capturedPieces, wasPromoted);

    expect(game.board[3][0]).toBeNull();
    expect(piece).toBe(game.board[2][1]);
    expect(piece?.isKing).toBe(false);
    expect(piece?.color).toBe(PieceColor.Black);
  });
  test("Undo: Singular capture scenarios should work appropriately", () => {
    // red turn
    game.movePiece(5, 6, 4, 7);
    // ai/black turn
    game.movePiece(2, 1, 3, 0);
    // red turn
    game.movePiece(5, 2, 4, 1);
    //ai/black turn
    const piece = game.getPiece(3, 0);
    const [capturedPieces, wasPromoted] = game.simulateMove(3, 0, 5, 2);

    game.undoSimulation(3, 0, 5, 2, capturedPieces, wasPromoted);
    expect(game.board[5][2]).toBeNull();
    expect(piece).toBe(game.board[3][0]);
    expect(piece?.isKing).toBe(false);
    expect(piece?.color).toBe(PieceColor.Black);
    expect(game.board[4][1]).toBeInstanceOf(CheckersPiece);
    expect(game.board[4][1]?.color).toBe(PieceColor.Red);
  });
  test("Undo: Chain Captures", () => {
    game.movePiece(5, 6, 4, 5); //red turn
    game.movePiece(2, 1, 3, 0); //black turn
    game.movePiece(4, 5, 3, 4); // red turn
    game.movePiece(1, 0, 2, 1); //black turn
    // red turn
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
    expect(piece?.color).toBe(PieceColor.Black);
    expect(game.board[3][4]?.color).toBe(PieceColor.Red);
    expect(game.board[5][6]?.color).toBe(PieceColor.Red);
  });
  test("Undo: Chain Captures leading to Piece Promotion", () => {
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
    expect(piece?.color).toBe(PieceColor.Black);
    expect(piece?.isKing).toBe(false);

    expect(game.board[2][1]?.color).toBe(PieceColor.Red);
    expect(game.board[4][3]?.color).toBe(PieceColor.Red);
    expect(game.board[6][5]?.color).toBe(PieceColor.Red);
  });
  // Tests for Deep Copies
  test("Test game deep copy", () => {
    const newGame = game.deepCopyGame();
    expect(newGame.board).toStrictEqual(game.board);

    expect(newGame.players[0].name).toBe(game.players[0].name);
    expect(newGame.players[0].color).toBe(game.players[0].color);
    expect(newGame.players[0].score).toBe(game.players[0].score);
    expect(newGame.players[0].capturedPieces).toBe(
      game.players[0].capturedPieces
    );
    expect(newGame.players[0].numOfPieces).toBe(game.players[0].numOfPieces);
    expect(newGame.players[0].numOfKings).toBe(game.players[0].numOfKings);

    expect(newGame.players[1].name).toBe(game.players[1].name);
    expect(newGame.players[1].color).toBe(game.players[1].color);
    expect(newGame.players[1].score).toBe(game.players[1].score);
    expect(newGame.players[1].capturedPieces).toBe(
      game.players[1].capturedPieces
    );
    expect(newGame.players[1].numOfPieces).toBe(game.players[1].numOfPieces);
    expect(newGame.players[1].numOfKings).toBe(game.players[1].numOfKings);

    expect(newGame.currentState).toBe(game.currentState);
    expect(newGame.currentPlayer).toBe(game.currentPlayer);
    expect(newGame.winner).toBe(game.winner);
  });
  // Tests for Minimax:
  test("Basic Move Test for starting board", () => {
    // player-red turn
    game.movePiece(5, 0, 4, 1);
    //ai-black turn
    const [, aiMove] = ai.minimax(game, 1, -Infinity, Infinity, true);
    const expectedMoves = [
      new Moves(2, 1, 3, 0),
      new Moves(2, 1, 3, 2),
      new Moves(2, 3, 3, 2),
      new Moves(2, 3, 3, 4),
      new Moves(2, 5, 3, 3),
      new Moves(2, 5, 3, 7),
      new Moves(2, 7, 3, 6),
    ];

    const isValidMove = expectedMoves.some(
      (expectedMove) =>
        expectedMove.startRow === aiMove?.startRow &&
        expectedMove.startCol === aiMove?.startCol &&
        expectedMove.endRow === aiMove?.endRow &&
        expectedMove.endCol === aiMove?.endCol
    );

    expect(isValidMove).toBe(true);
  });
  // // Simple Capture Move Scenarios
  test("1. Capture Move Test", () => {
    // player-red turn
    game.movePiece(5, 4, 4, 5);
    //ai-black turn
    game.movePiece(2, 7, 3, 6);
    // player-red turn
    game.movePiece(5, 6, 4, 7);

    const [, aiMove] = ai.minimax(game, 1, -Infinity, Infinity, true);

    console.log(game.board);

    const expectedMoves = [
      new Moves(2, 1, 3, 0),
      new Moves(2, 1, 3, 2),
      new Moves(2, 3, 3, 2),
      new Moves(2, 3, 3, 4),
      new Moves(2, 5, 3, 4),
      new Moves(3, 6, 5, 4),
      new Moves(1, 6, 2, 7),
    ];

    const isValidMove = expectedMoves.some(
      (expectedMove) =>
        expectedMove.startRow === aiMove?.startRow &&
        expectedMove.startCol === aiMove?.startCol &&
        expectedMove.endRow === aiMove?.endRow &&
        expectedMove.endCol === aiMove?.endCol
    );

    expect(isValidMove).toBe(true);
    // game.movePiece(3, 6, 5, 4);
    // console.log(ai.evaluateState(game));
    // console.log(`Number of Red Pieces: ${game.players[0].numOfPieces}`);
    // console.log(`Number of Black Pieces: ${game.players[1].numOfPieces}`);
  });
  test("2. Capture Move Test", () => {
    // player-red turn
    game.movePiece(5, 4, 4, 3);
    //ai-black turn
    game.movePiece(2, 1, 3, 2);
    // player-red turn
    game.movePiece(5, 6, 4, 7);

    const [, aiMove] = ai.minimax(game, 2, -Infinity, Infinity, true);
    const expectedMoves = [
      new Moves(1, 0, 2, 1),
      new Moves(1, 2, 2, 1),
      new Moves(2, 3, 3, 4),
      new Moves(2, 5, 3, 4),
      new Moves(2, 5, 3, 6),
      new Moves(2, 7, 3, 6),
      new Moves(3, 2, 4, 1),
      new Moves(3, 2, 5, 4),
    ];

    const isValidMove = expectedMoves.some(
      (expectedMove) =>
        expectedMove.startRow === aiMove?.startRow &&
        expectedMove.startCol === aiMove?.startCol &&
        expectedMove.endRow === aiMove?.endRow &&
        expectedMove.endCol === aiMove?.endCol
    );

    expect(isValidMove).toBe(true);
  });
  test("3. Capture Move Test", () => {
    // player-red turn
    game.movePiece(5, 2, 4, 1);
    //ai-black turn
    game.movePiece(2, 1, 3, 0);
    // player-red turn
    game.movePiece(5, 6, 4, 5);
    //ai-black turn
    game.movePiece(2, 3, 3, 4);
    //player-red turn
    game.movePiece(5, 4, 4, 3);
    //ai-black turn

    const [, aiMove] = ai.minimax(game, 2, -Infinity, Infinity, true);
    const expectedMoves = [
      new Moves(1, 0, 2, 1),
      new Moves(1, 2, 2, 1),
      new Moves(1, 2, 2, 3),
      new Moves(1, 4, 2, 3),
      new Moves(2, 5, 3, 6),
      new Moves(2, 7, 3, 6),
      new Moves(3, 0, 5, 2),
      new Moves(3, 4, 5, 2),
      new Moves(3, 4, 5, 6),
    ];

    const isValidMove = expectedMoves.some(
      (expectedMove) =>
        expectedMove.startRow === aiMove?.startRow &&
        expectedMove.startCol === aiMove?.startCol &&
        expectedMove.endRow === aiMove?.endRow &&
        expectedMove.endCol === aiMove?.endCol
    );

    expect(isValidMove).toBe(true);
  });
  // Chain Capture Scenarios and Promotion Scenarios
  test("Chain Capture Move Test", () => {
    // player-red turn
    game.movePiece(5, 6, 4, 5);
    //ai-black turn
    game.movePiece(2, 1, 3, 0);
    // player-red turn
    game.movePiece(4, 5, 3, 4);
    //black turn
    game.movePiece(1, 0, 2, 1);
    // red turn
    game.movePiece(6, 7, 5, 6);

    let [, aiMove] = ai.minimax(game, 1, -Infinity, Infinity, true);
    let expectedMoves = [
      new Moves(0, 1, 1, 0),
      new Moves(2, 1, 3, 2),
      new Moves(2, 3, 3, 2),
      new Moves(2, 3, 4, 5),
      new Moves(2, 5, 4, 3),
      new Moves(2, 5, 3, 6),
      new Moves(2, 7, 3, 6),
    ];

    let isValidMove = expectedMoves.some(
      (expectedMove) =>
        expectedMove.startRow === aiMove?.startRow &&
        expectedMove.startCol === aiMove?.startCol &&
        expectedMove.endRow === aiMove?.endRow &&
        expectedMove.endCol === aiMove?.endCol
    );
    expect(isValidMove).toBe(true);

    game.movePiece(2, 3, 4, 5);

    [, aiMove] = ai.minimax(game, 2, -Infinity, Infinity, true);
    expectedMoves = [
      new Moves(0, 1, 1, 0),
      new Moves(1, 2, 2, 3),
      new Moves(1, 4, 2, 3),
      new Moves(2, 1, 3, 2),
      new Moves(2, 5, 3, 4),
      new Moves(2, 5, 3, 6),
      new Moves(2, 7, 3, 6),
      new Moves(3, 0, 4, 1),
      new Moves(4, 5, 6, 7),
    ];
    isValidMove = expectedMoves.some(
      (expectedMove) =>
        expectedMove.startRow === aiMove?.startRow &&
        expectedMove.startCol === aiMove?.startCol &&
        expectedMove.endRow === aiMove?.endRow &&
        expectedMove.endCol === aiMove?.endCol
    );

    expect(isValidMove).toBe(true);
  });
  // makeMove() using minimax
  test("AI should correctly make a simple move", () => {
    // red turn
    game.movePiece(5, 0, 4, 1);
    //black/ai turn
    ai.makeMove();
    console.log(game.board);
  });
  test("AI should capture opposing piece", () => {
    // red turn
    game.movePiece(5, 6, 4, 7);
    // ai/black turn
    game.movePiece(2, 1, 3, 0);
    // red turn
    game.movePiece(5, 2, 4, 1);
    //black/ai turn
    ai.makeMove();
    console.log(game.board);
    expect(game.players[0].numOfPieces).toBe(11);
  });
  test("AI should chain capture", () => {
    // player-red turn
    game.movePiece(5, 6, 4, 5);
    //ai-black turn
    game.movePiece(2, 1, 3, 0);
    // player-red turn
    game.movePiece(4, 5, 3, 4);
    //black turn
    game.movePiece(1, 0, 2, 1);
    // red turn
    game.movePiece(6, 7, 5, 6);
    //black/ai turn
    ai.makeMove();
    ai.makeMove();
    expect(game.players[0].numOfPieces).toBe(10);
    expect(ai.heuristic(game)).toBe(2);
  });
});
