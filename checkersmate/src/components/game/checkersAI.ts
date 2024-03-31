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
    const gamePhase = this.getGamePhase(game);
    let score = 0;
    // Heuristic Component Scores
    const scorePawn = gamePhase === "endgame" ? 20 : "midgame" ? 15 : 10;
    const scoreKing = gamePhase === "endgame" ? 30 : "midgame" ? 25 : 20;
    const scoreSafePawn = 1.5;
    const scoreSafeKing = 2;
    const scoreMovablePawn = 1.1;
    const scoreMovableKing = 1.85;
    const scoreDistanceToPromotionLine = 0.1;
    const scoreUnoccupiedOnPromotionLine = 0.5;
    const scoreDefenderPiece = 2;
    const scoreCentralPawn = 3;
    const scoreCentralKing = 5;
    const scoreAttackingPawn = 2.5;
    const scoreDiagonalPawn = 2;
    const scoreDiagonalKing = 4;
    const scoreDoubleDiagonalPawn = 2;
    const scoreDoubleDiagonalKing = 4;
    const scoreLonerPawn = -1;
    const scoreLonerKing = -0.5;
    const trianglePattern = 1.5;
    const bridgePattern = 3;
    const dogPattern = 4.5;

    let trianglePatterns = 0;
    let lonerPawns = 0;
    let lonerKings = 0;

    game.board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece) {
          // Component 1 & 2: Number of pawns and kings
          let baseScore = piece.isKing ? scoreKing : scorePawn;
          score += piece.color === PieceColor.Black ? baseScore : -baseScore;
          // Component 3 & 4: Safe pawns and kings
          const safe = this.isPieceSafe(rowIndex, colIndex, piece, game.board);
          // AI player
          if (safe && piece.color === this.color) {
            score += piece.isKing ? scoreSafeKing : scoreSafePawn;
          } else if (!safe && piece.color !== this.color) {
            score -= piece.isKing ? scoreSafeKing : scoreSafePawn;
          }
          // 5. Number of moveable pawns (i.e. able to perform a move other than capturing).
          // 6. Number of moveable kings. Parameters 5 and 6 are calculated taking no notice of
          //    capturing priority;
          const moves = game.possibleMoves(rowIndex, colIndex);
          const nonCapturingMoves = moves.filter(
            (move) => Math.abs(move.startRow - move.endRow) === 1
          );
          if (piece.color === this.color) {
            if (nonCapturingMoves.length > 0) {
              if (piece.isKing) {
                score += scoreMovableKing * nonCapturingMoves.length;
              } else {
                score += scoreMovablePawn * nonCapturingMoves.length;
              }
            }
          } else {
            if (nonCapturingMoves.length > 0) {
              if (piece.isKing) {
                score -= scoreMovableKing * nonCapturingMoves.length;
              } else {
                score -= scoreMovablePawn * nonCapturingMoves.length;
              }
            }
          }
          // 7. Aggregated distance of the pawns to promotion line
          if (!piece.isKing) {
            if (piece.color !== this.color) {
              const distanceToPromotion = rowIndex;
              score -= scoreDistanceToPromotionLine * distanceToPromotion;
            } else {
              const distanceToPromotion = 7 - rowIndex;
              score += scoreDistanceToPromotionLine * distanceToPromotion;
            }
          }

          // 17 && 18. Number of loner pawns and kings
          if (this.isLoner(rowIndex, colIndex, game.board)) {
            if (piece.isKing) {
              lonerKings += piece.color === this.color ? 1 : -1;
            } else {
              lonerPawns += piece.color === this.color ? 1 : -1;
            }
          }

          // 19. Triangle Pattern
          if (piece.color === this.color) {
            if (this.isTrianglePattern(rowIndex, colIndex, game.board)) {
              trianglePatterns++;
            }
          } else {
            if (this.isTrianglePattern(rowIndex, colIndex, game.board)) {
              trianglePatterns--;
            }
          }
        }
      });
    });

    // Component 8: Number of unoccupied fields on promotion line
    const redPromotionCols = [1, 3, 5, 7];
    const blackPromotionCols = [0, 2, 4, 6];

    // Calculate empty or own piece in promotion lines
    let blackPromotionLineEmpty = blackPromotionCols.reduce((acc, col) => {
      const cell = game.board[7][col];
      if (cell === null || (cell && cell.color === PieceColor.Black)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    let redPromotionLineEmpty = redPromotionCols.reduce((acc, col) => {
      const cell = game.board[0][col];
      if (cell === null || (cell && cell.color === PieceColor.Red)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (this.color === PieceColor.Black) {
      score += scoreUnoccupiedOnPromotionLine * blackPromotionLineEmpty; // Promotion line for Black
      score -= scoreUnoccupiedOnPromotionLine * redPromotionLineEmpty; // Red's promotion line
    } else {
      score += scoreUnoccupiedOnPromotionLine * redPromotionLineEmpty; // Promotion line for Red
      score -= scoreUnoccupiedOnPromotionLine * blackPromotionLineEmpty; // Red's promotion line
    }

    // Component 9: Number of defender pieces
    // Determine the number of defender pieces
    let blackDefenders = 0;
    let redDefenders = 0;

    // Check the two uppermost rows for Black defenders
    for (let row = 0; row < 2; row++) {
      game.board[row].forEach((piece, col) => {
        if (piece && piece.color === PieceColor.Black) {
          blackDefenders++;
        }
      });
    }

    // Check the two lowermost rows for Red defenders
    for (let row = 6; row < 8; row++) {
      game.board[row].forEach((piece, col) => {
        if (piece && piece.color === PieceColor.Red) {
          redDefenders++;
        }
      });
    }

    if (this.color === PieceColor.Black) {
      score += scoreDefenderPiece * blackDefenders; // Reward for having Black defenders
      score -= scoreDefenderPiece * redDefenders; // Penalize for opponent's Red defenders
    } else {
      score += scoreDefenderPiece * redDefenders; // Reward for having Red defenders
      score -= scoreDefenderPiece * blackDefenders; // Penalize for opponent's Black defenders
    }

    // 10. Number of attacking pawns
    // Detmine number of attacking pieces
    let blackAttackingPawns = 0;
    let redAttackingPawns = 0;

    // Count Black attacking pawns in the top 3 rows
    for (let row = 2; row < 5; row++) {
      game.board[row].forEach((piece) => {
        if (piece && piece.color === PieceColor.Black && !piece.isKing) {
          blackAttackingPawns++;
        }
      });
    }

    // Count Red attacking pawns in the bottom 3 rows
    for (let row = 3; row < 6; row++) {
      game.board[row].forEach((piece) => {
        if (piece && piece.color === PieceColor.Red && !piece.isKing) {
          redAttackingPawns++;
        }
      });
    }

    if (this.color === PieceColor.Black) {
      score += scoreAttackingPawn * blackAttackingPawns; // Reward for having Black attacking pawns
      score -= scoreAttackingPawn * redAttackingPawns; // Penalize for opponent's Red attacking pawns
    } else {
      score += scoreAttackingPawn * redAttackingPawns; // Reward for having Red attacking pawns
      score -= scoreAttackingPawn * blackAttackingPawns; // Penalize for opponent's Black attacking pawns
    }

    // Components 11 & 12: Central pawns and kings
    const centralPositions = [
      [2, 3],
      [2, 5],
      [3, 2],
      [3, 4],
      [4, 3],
      [4, 5],
      [5, 2],
      [5, 4],
    ];

    let centralPawns = 0;
    let centralKings = 0;

    centralPositions.forEach(([row, col]) => {
      const piece = game.board[row][col];
      if (piece) {
        if (piece.isKing) {
          // Count centrally positioned kings
          centralKings += piece.color === this.color ? 1 : -1;
        } else {
          // Count centrally positioned pawns
          centralPawns += piece.color === this.color ? 1 : -1;
        }
      }
    });

    score += scoreCentralPawn * centralPawns;
    score += scoreCentralKing * centralKings;

    // EXPERIMENTAL
    // 13 & 14. Number of pawns and kings positioned on the main diagonal
    let diagonalPawns = 0;
    let diagonalKings = 0;

    const mainDiagonal = [
      [0, 7],
      [1, 6],
      [2, 5],
      [3, 4],
      [4, 3],
      [5, 2],
      [6, 1],
      [7, 0],
    ];

    for (let i = 0; i < 8; i++) {
      const piece = game.board[i][i];
      if (piece) {
        if (piece.isKing) {
          diagonalKings += piece.color === this.color ? 1 : -1;
        } else {
          diagonalPawns += piece.color === this.color ? 1 : -1;
        }
      }
    }

    score += scoreDiagonalPawn * diagonalPawns;
    score += scoreDiagonalKing * diagonalKings;

    // 15 && 16. Number of pawns and kings situated on double diagonal
    const doubleDiagonalOne = [
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 3],
      [5, 4],
      [6, 5],
      [7, 6],
    ];
    const doubleDiagonalTwo = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ];

    // Count pawns and kings on these positions
    const doubleDiagonals = doubleDiagonalOne.concat(doubleDiagonalTwo);

    let doubleDiagonalPawns = 0;
    let doubleDiagonalKings = 0;

    doubleDiagonals.forEach(([row, col]) => {
      const piece = game.board[row][col];
      if (piece && piece.color === this.color) {
        if (piece.isKing) {
          doubleDiagonalKings++;
        } else {
          doubleDiagonalPawns++;
        }
      } else if (piece && piece.color !== this.color) {
        if (piece.isKing) {
          doubleDiagonalKings--;
        } else {
          doubleDiagonalPawns--;
        }
      }
    });

    score += scoreDoubleDiagonalPawn * doubleDiagonalPawns;
    score += scoreDoubleDiagonalKing * doubleDiagonalKings;

    score += scoreLonerPawn * lonerPawns;
    score += scoreLonerKing * lonerKings;

    score += trianglePatterns * trianglePattern;

    // 20. Bridge pattern
    if (this.RedBridgePattern(game)) {
      score -= bridgePattern * 5;
    } else if (this.BlackBridgePattern(game)) {
      score += bridgePattern * 5;
    }

    // 21. Dog pattern
    if (this.RedDogPattern(game)) {
      score -= dogPattern * 5;
    } else if (this.BlackDogPattern(game)) {
      score += dogPattern * 5;
    }

    return score;
  }

  private getGamePhase(game: CheckersGame): "opening" | "midgame" | "endgame" {
    const totalPieces = game.board
      .flat()
      .filter((piece) => piece !== null).length;
    if (totalPieces > 20) return "opening";
    else if (totalPieces > 10) return "midgame";
    else return "endgame";
  }

  public RedDogPattern(game: CheckersGame): boolean {
    const pieceOne = game.getPiece(6, 7);
    const pieceTwo = game.getPiece(7, 6);

    if (pieceOne && pieceTwo) {
      if (
        !(pieceOne.isKing && pieceTwo.isKing) &&
        pieceOne.color === PieceColor.Red &&
        pieceTwo.color === PieceColor.Red
      ) {
        return true;
      }
    }
    return false;
  }

  public BlackDogPattern(game: CheckersGame): boolean {
    const pieceOne = game.getPiece(0, 1);
    const pieceTwo = game.getPiece(1, 0);

    if (pieceOne && pieceTwo) {
      if (
        !(pieceOne.isKing && pieceTwo.isKing) &&
        pieceOne.color === PieceColor.Black &&
        pieceTwo.color === PieceColor.Black
      ) {
        return true;
      }
    }
    return false;
  }

  public BlackBridgePattern(game: CheckersGame): boolean {
    const pieceOne = game.getPiece(0, 1);
    const pieceTwo = game.getPiece(0, 5);

    if (!pieceOne?.isKing && !pieceTwo?.isKing) {
      if (
        pieceOne &&
        pieceTwo &&
        pieceOne.color === PieceColor.Black &&
        pieceTwo.color === PieceColor.Black
      ) {
        return true;
      }
    }
    return false;
  }

  public RedBridgePattern(game: CheckersGame): boolean {
    const pieceOne = game.getPiece(7, 2);
    const pieceTwo = game.getPiece(7, 6);

    if (!pieceOne?.isKing && !pieceTwo?.isKing) {
      if (
        pieceOne &&
        pieceTwo &&
        pieceOne.color === PieceColor.Red &&
        pieceTwo.color === PieceColor.Red
      ) {
        return true;
      }
    }
    return false;
  }

  public isTrianglePattern(
    row: number,
    col: number,
    board: (CheckersPiece | null)[][]
  ): boolean {
    const trianglePosition = [
      [
        [-1, -1],
        [-1, 1],
        [-2, 0],
      ],
    ];

    const piece = board[row][col];
    if (!piece) return false;

    // Check if a triangle pattern exists around the piece
    for (const positions of trianglePosition) {
      const isPattern = positions.every(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        return (
          newRow >= 0 &&
          newRow < 8 &&
          newCol >= 0 &&
          newCol < 8 &&
          board[newRow][newCol] &&
          board[newRow][newCol]?.color === piece.color
        );
      });

      if (isPattern) {
        return true;
      }
    }

    return false;
  }

  public isLoner(
    row: number,
    col: number,
    board: (CheckersPiece | null)[][]
  ): boolean {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    return directions.every(([dr, dc]) => {
      const newRow = row + dr,
        newCol = col + dc;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        return board[newRow][newCol] === null;
      }
      return true;
    });
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
