import {
  Moves,
  PieceColor,
  CheckersPiece,
  CheckersBoard,
  State,
  Player,
  CheckersGame,
} from "./checkersGame";

/**
 * A class for the AI player extending the regular player class
 * Has methods for a heuristic evaluation, the minimax algorithm and a method that makes the move
 * returned by minimax
 */
export class CheckersAI extends Player {
  private game: CheckersGame;
  private depth: number;
  private openings: Map<string, Moves[]>;
  private currentOpening: string | null;
  public positionsAnalysed: number;

  constructor(
    name: string,
    color: PieceColor,
    isAI: boolean,
    game: CheckersGame,
    depth: number
  ) {
    super(name, color, isAI);
    this.game = game;
    this.depth = depth;
    this.openings = this.openingSet();
    this.currentOpening = null;
    this.positionsAnalysed = 0;
  }

  /**
   * Calculates a score for the AI based on number of regular and king pieces it has opposed to the user
   * @param {CheckersGame} game - Current state of the game
   * @returns {number} - The score calculated
   */

  public heuristic(game: CheckersGame): number {
    let score = 0;
    // Heuristic Component Scores
    const scorePawn = 1;
    const scoreKing = 1.75;
    const scoreSafePawn = 1.25;
    const scoreSafeKing = 2;

    this.game.board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece) {
          // Component 1: Number of pawns and kings
          let baseScore = piece.isKing ? scoreKing : scorePawn;
          score += piece.color === PieceColor.Black ? baseScore : -baseScore;

          // Component 2: Safe pawns and kings
          const safe = this.isPieceSafe(rowIndex, colIndex, piece, game.board);
          // AI player
          if (safe && piece.color === this.color) {
            score += piece.isKing ? scoreSafeKing : scoreSafePawn;
          } else if (!safe && piece.color !== this.color) {
            score -= piece.isKing ? scoreSafeKing : scoreSafePawn;
          }
        }
      });
    });

    return score;
  }

  public isPieceSafe(
    row: number,
    col: number,
    piece: CheckersPiece,
    board: (CheckersPiece | null)[][]
  ): boolean {
    // Edge of the board is always safe
    if (row === 0 || row === 7 || col === 0 || col === 7) {
      return true;
    }

    // Directions for black regular
    let directions = [
      [-1, -1],
      [-1, 1],
    ];

    // If checking for a king, consider all directions
    if (piece.isKing) {
      directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];
    }

    let isSafe = true;

    directions.forEach(([dr, dc]) => {
      // Check for potential capturers from all directions for king pieces
      for (let multiplier = 1; multiplier <= 7; multiplier++) {
        const captureRow = row + dr * multiplier;
        const captureCol = col + dc * multiplier;

        // Break the loop if we go off the board, as further checks aren't needed
        if (
          captureRow < 0 ||
          captureRow > 7 ||
          captureCol < 0 ||
          captureCol > 7
        )
          break;

        const capturePiece = board[captureRow][captureCol];
        // If we encounter a piece, check if it's an opponent's piece
        if (capturePiece) {
          if (capturePiece.color !== piece.color) {
            // If it's an opponent's king or the first piece we encounter in this direction, it's a potential threat
            if (capturePiece.isKing || multiplier === 1) {
              // Check if the capturing move is possible (empty landing spot)
              const landingRow = captureRow + dr;
              const landingCol = captureCol + dc;
              if (
                landingRow >= 0 &&
                landingRow < 8 &&
                landingCol >= 0 &&
                landingCol < 8 &&
                !board[landingRow][landingCol]
              ) {
                isSafe = false;
              } else {
                isSafe = true;
              }
            }
          }
          break; // Stop checking in this direction once any piece is encountered
        }
      }
    });

    return isSafe;
  }

  private countOpponentCapturesPossible(
    color: PieceColor,
    game: CheckersGame
  ): number {
    let captureCount = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.getPiece(row, col);
        if (piece && piece.color === color) {
          const moves = game.possibleMoves(row, col);
          captureCount += moves.filter(
            (move) => Math.abs(move.startRow - move.endRow) === 2
          ).length;
        }
      }
    }
    return captureCount;
  }

  public openingSet(): Map<string, Moves[]> {
    const openings = new Map<string, Moves[]>();

    openings.set("Old Fourteenth", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(7, 0, 6, 1), // red or players move
    ]);
    openings.set("Alma", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(7, 2, 6, 1), // red or players move
    ]);
    openings.set("Centre", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(4, 3, 3, 4), // red or players move
    ]);
    openings.set("Glasgow", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(5, 2, 4, 1), // red or players move
    ]);
    openings.set("Laird and Lady", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(5, 6, 4, 7),
      new Moves(3, 6, 4, 5),
      new Moves(5, 4, 3, 6),
      new Moves(2, 7, 4, 5),
    ]);
    openings.set("Black Doctor", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(5, 6, 4, 7),
      new Moves(3, 6, 4, 5),
      new Moves(5, 4, 3, 6),
      new Moves(3, 2, 5, 4),
      new Moves(6, 3, 4, 5),
    ]);
    openings.set("Laird and Lady Refused", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(5, 6, 4, 7),
      new Moves(1, 6, 2, 5),
    ]);
    openings.set("Glasgow-Whilter", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(5, 6, 4, 5),
      new Moves(1, 6, 2, 5),
      new Moves(5, 2, 4, 1),
      new Moves(1, 4, 2, 3),
    ]);
    openings.set("Nailor", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(1, 4, 2, 3), // black or ai's move
    ]);
    openings.set("Tillicoultry", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2), // red or players move
      new Moves(2, 5, 3, 4), // black or ai's move
    ]);
    openings.set("Will o' the Wisp", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(5, 6, 4, 7), // red or players move
    ]);
    openings.set("Defiance", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(5, 6, 4, 5), // red or players move
      new Moves(1, 2, 2, 3), // black or ai's move
    ]);
    openings.set("Fife", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(5, 6, 4, 5), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(6, 7, 5, 6),
    ]);
    openings.set("Souter", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(5, 6, 4, 5), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(6, 5, 5, 6),
    ]);
    openings.set("Whilter-I", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(5, 6, 4, 5), // red or players move
      new Moves(2, 5, 3, 6), // black or ai's move
      new Moves(6, 3, 5, 2),
    ]);
    openings.set("Whilter-II", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 3, 5, 2),
    ]);
    openings.set("Whilter-Exchange", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 3, 5, 2),
      new Moves(2, 5, 3, 4),
    ]);
    openings.set("Maid of the Mill", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2),
      new Moves(3, 6, 4, 7),
      new Moves(4, 3, 3, 4),
    ]);
    openings.set("Douglas", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2),
      new Moves(3, 6, 4, 7),
      new Moves(7, 0, 6, 1),
      new Moves(1, 6, 2, 5),
    ]);
    openings.set("Pioneer", [
      new Moves(5, 2, 4, 3), // red or players move
      new Moves(2, 3, 3, 2), // black or ai's move
      new Moves(6, 1, 5, 2),
      new Moves(1, 6, 2, 5),
    ]);
    openings.set("White Dyke", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 5, 3, 6),
      new Moves(6, 1, 5, 2),
      new Moves(3, 6, 4, 5),
    ]);
    openings.set("Wagram", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 5, 3, 6),
      new Moves(5, 6, 4, 7),
      new Moves(2, 1, 3, 0),
    ]);
    openings.set("Boston", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 5, 3, 6),
      new Moves(5, 6, 4, 7),
      new Moves(3, 6, 4, 5),
    ]);
    openings.set("Dyke", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 5, 3, 6),
      new Moves(4, 3, 3, 2),
    ]);
    openings.set("Cross", [new Moves(5, 2, 4, 3), new Moves(2, 3, 3, 4)]);
    openings.set("Waterloo", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 3, 3, 4),
      new Moves(6, 1, 5, 2),
      new Moves(3, 4, 4, 5),
    ]);
    openings.set("Ayrshire Lassie", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 1, 3, 0),
      new Moves(6, 1, 5, 2),
      new Moves(1, 0, 2, 1),
    ]);
    openings.set("Switcher", [new Moves(5, 2, 4, 3), new Moves(2, 7, 3, 6)]);
    openings.set("Single Corner", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 5, 3, 4),
    ]);
    openings.set("Second Double Corner", [
      new Moves(5, 2, 4, 3),
      new Moves(2, 1, 3, 2),
    ]);
    openings.set("Bristol", [
      new Moves(5, 2, 4, 1),
      new Moves(2, 1, 3, 0),
      new Moves(4, 1, 3, 2),
    ]);
    openings.set("Paisley", [new Moves(5, 2, 4, 1), new Moves(2, 1, 3, 2)]);
    openings.set("Bristol-Cross", [
      new Moves(5, 2, 4, 1),
      new Moves(2, 3, 3, 4),
    ]);

    return openings;
  }

  public identifyOpening(): void {
    let foundOpening = false;
    if (
      this.game.numOfTurns <
      Math.max(...Array.from(this.openings.values()).map((o) => o.length))
    ) {
      for (const [name, moves] of this.openings) {
        if (this.game.playerOneMoves.length <= moves.length / 2) {
          const sequenceMatch = this.game.playerOneMoves.every(
            (move, index) => {
              return moves[index * 2].equals(move);
            }
          );

          if (sequenceMatch) {
            this.currentOpening = name;
            foundOpening = true;
            break; // Exit the loop once a matching sequence is found
          }
        }
      }
    }
    if (!foundOpening) {
      this.currentOpening = null;
    }
  }

  /**
   * Minimax Algorithm used in Checkers game to find best move.
   *
   * This is a recursive function that evaluates the state of the game to find the optimal move for the current player,
   * looking ahead, at a certain specified depth. It aims to maximize it's own gain from a move being made, and
   * minimize the gain of the user.
   *
   * @param {CheckersGame} game - Current state of the Checkers game
   * @param {number} depth - Depth to which game is evaluated
   * @param {boolean} isMaximizingPlayer - The player maximizing, true for AI(Black player) and false for the user(Red)
   * @returns {[number, Moves | null]} Tuple that contains best evaluation score and best move
   */
  public minimax(
    game: CheckersGame,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): [number, Moves | null] {
    game.checkEndOfGame();

    if (depth == 0 || game.currentState === State.gameFinished) {
      let score = this.heuristic(game);
      return [score, null];
    }

    let bestScore: number = maximizingPlayer ? -Infinity : Infinity;
    let bestMove: Moves | null = null;

    if (maximizingPlayer) {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = game.getPiece(row, col);
          if (piece && piece.color === PieceColor.Black) {
            const moves = game.possibleMoves(row, col);
            this.positionsAnalysed++;
            for (const move of moves) {
              const gameCopy = game.deepCopyGame();

              gameCopy.moveAI(
                move.startRow,
                move.startCol,
                move.endRow,
                move.endCol
              );

              const [evaluatedScore] = this.minimax(
                gameCopy,
                depth - 1,
                alpha,
                beta,
                false
              );

              alpha = Math.max(alpha, evaluatedScore);
              if (beta <= alpha) {
                bestMove = move;
                bestScore = evaluatedScore;
                break;
              }

              if (evaluatedScore > bestScore) {
                bestScore = evaluatedScore;
                bestMove = move;
              }
            }
          }
        }
      }
      return [bestScore, bestMove];
    } else {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = game.getPiece(row, col);
          if (piece && piece.color === PieceColor.Red) {
            const moves = game.possibleMoves(row, col);
            this.positionsAnalysed++;
            for (const move of moves) {
              const gameCopy = game.deepCopyGame();

              gameCopy.moveAI(
                move.startRow,
                move.startCol,
                move.endRow,
                move.endCol
              );

              const [evaluatedScore] = this.minimax(
                gameCopy,
                depth - 1,
                alpha,
                beta,
                true
              );

              beta = Math.min(beta, evaluatedScore);

              if (beta <= alpha) {
                bestMove = move;
                bestScore = evaluatedScore;
                break;
              }

              if (evaluatedScore < bestScore) {
                bestScore = evaluatedScore;
                bestMove = move;
              }
            }
          }
        }
      }
      return [bestScore, bestMove];
    }
  }

  /**
   * Method for the AI to make a move using the minimax algorithm to get the 'best' move and using that.
   */

  public makeMove(): [number, Moves, number] | null {
    let numOfPositions = this.positionsAnalysed;
    if (this.game.currentState === State.gameFinished) {
      this.game.changeTurn();
      return null;
    } else {
      return this.playMinimaxMove();
      // this.identifyOpening();
      // if (this.currentOpening) {
      //   const move = this.getOpeningMove();
      //   if (move) {
      //     return [999, move, 1];
      //   } else {
      //     return this.playMinimaxMove();
      //   }
      //   // Optimal Opening Alternative
      // } else if (
      //   this.game.numOfTurns === 1 &&
      //   this.game.getPiece(3, 4) === null
      // ) {
      //   const move: Moves = new Moves(2, 5, 3, 4);
      //   return [999, move, 1];
      // } else if (
      //   this.game.numOfTurns === 3 &&
      //   this.game.getPiece(2, 5) === null
      // ) {
      //   const move: Moves = new Moves(1, 6, 2, 5);
      //   return [999, move, 1];
      // } else if (
      //   this.game.numOfTurns === 5 &&
      //   this.game.getPiece(1, 6) === null
      // ) {
      //   const move: Moves = new Moves(0, 7, 1, 6);
      //   return [999, move, numOfPositions];
      // } else {
      //   return this.playMinimaxMove();
      // }
    }
  }

  public playMinimaxMove(): [number, Moves, number] | null {
    const [score, move] = this.minimax(
      this.game,
      this.depth,
      -Infinity,
      Infinity,
      true
    );
    const numOfPositions = this.positionsAnalysed;
    this.positionsAnalysed = 0;
    if (move) {
      this.game.movePiece(
        move?.startRow,
        move?.startCol,
        move?.endRow,
        move?.endCol
      );
      return [score, move, numOfPositions];
    } else {
      console.log(`${this.game.players[1].name} has no valid moves!`);
      this.game.changeTurn();
      return null;
    }
  }

  public getOpeningMove(): Moves | null {
    if (this.currentOpening) {
      const sequence = this.openings.get(this.currentOpening);
      if (sequence && this.game.numOfTurns < sequence.length) {
        return sequence[this.game.numOfTurns];
      }
    }
    return null;
  }
}
