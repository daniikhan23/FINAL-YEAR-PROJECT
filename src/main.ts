class Moves {
    public startRow: number;
    public startCol: number;
    public endRow: number;
    public endCol: number;

    constructor(startRow: number, startCol: number, endRow: number, endCol: number) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
}

enum PieceColor {
    Black = 'black',
    Red = 'red'
}

class CheckersPiece {
    public color: PieceColor;
    public isKing: boolean;

    constructor(color: PieceColor, isKing:boolean = false){
        this.color = color;
        this.isKing = isKing;
    }

    public makeKing(): void {
        this.isKing = true;
    }
}

class CheckersBoard {
    private board: (CheckersPiece | null)[][] = [];

    constructor(){
        this.initializeBoard();
        console.log(this.board);
    }

    private initializeBoard(): void {
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece(PieceColor.Black);
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece(PieceColor.Red);
                }
                else {
                    this.board[row][col] = null;
                }
            }
        }
    }

    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }

    private validateMove(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // check to see if attempted move will place piece outside board
        if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            return false;
        }

        const destinationSquare = this.getPiece(endRow, endCol);
        const piece = this.getPiece(startRow, startCol);

        if (piece?.color === PieceColor.Black && piece.isKing === false) {
            return this.validateBlack(startRow, startCol, endRow, endCol, destinationSquare, piece);
        }
        else if (piece?.color === PieceColor.Red && piece.isKing === false) {
            return this.validateRed(startRow, startCol, endRow, endCol, destinationSquare, piece);
        }

        if (piece?.isKing === true) {
            if (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 1) {
                if (destinationSquare !== null) {
                    return false;
                }
                return true;
            } 
            else if (Math.abs(startRow - endRow) == 2 && Math.abs(startCol - endCol) == 2) {
                return this.canCapture(startRow, startCol, endRow, endCol);
            }
        }

        return false;
    }

    private validateBlack(startRow: number, startCol: number, endRow: number, endCol: number, destinationSquare: CheckersPiece | null, piece: CheckersPiece): boolean {
        if (endRow - startRow === 1 && Math.abs(startCol - endCol) === 1) {
            if (destinationSquare !== null) {
                return false;
            }
            return true;
        }
        else if (endRow - startRow === 2 && Math.abs(startCol - endCol) === 2) {
            return this.canCapture(startRow, startCol, endRow, endCol);
        }
        return false;
    }

    private validateRed(startRow: number, startCol: number, endRow: number, endCol: number, destinationSquare: CheckersPiece | null, piece: CheckersPiece): boolean {
        if (endRow - startRow === -1 && Math.abs(startCol - endCol) === 1) {
            if (destinationSquare !== null) {
                return false;
            }
            return true;
        }
        else if (endRow - startRow === -2 && Math.abs(startCol - endCol) === 2) {
            return this.canCapture(startRow, startCol, endRow, endCol);
        }
        return false;
    }

    public possibleMoves(row: number, col: number): Moves[] {
        const piece = this.getPiece(row, col);
        const moves: Moves[] = [];

        if (piece !== null) {
                const direction = piece.color === PieceColor.Black ? 1: -1;
                const startRow = row;
                const startCol = col;
            if (piece.isKing === false) {
                // black will move by a positive number
                // red by negative
                const potentialMovesArr = [
                    {endRow: startRow + direction, endCol: startCol - 1},
                    {endRow: startRow + direction, endCol: startCol + 1},
                    // capture moves
                    {endRow: startRow + 2 * direction, endCol: startCol - 2},
                    {endRow: startRow + 2 * direction, endCol: startCol + 2}
                ];

                for (const move of potentialMovesArr) {
                    if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                        moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                    }
                }
                // for king pieces
            } else {
                const startRow = row;
                const startCol = col;

                const potentialMovesArr = [
                    {endRow: startRow + 1, endCol: startCol - 1},
                    {endRow: startRow + 1, endCol: startCol + 1},
                    {endRow: startRow - 1, endCol: startCol - 1},
                    {endRow: startRow - 1, endCol: startCol + 1},
                    // capture moves
                    {endRow: startRow + 2 , endCol: startCol - 2},
                    {endRow: startRow + 2 , endCol: startCol + 2},
                    {endRow: startRow - 2 , endCol: startCol - 2},
                    {endRow: startRow - 2 , endCol: startCol + 2}
                ];
                for (const move of potentialMovesArr) {
                    if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                        moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                    }
                }
            }
        }
        return moves;
    }

    private canCapture(startRow:number, startCol:number, endRow:number, endCol: number): boolean {
        if (Math.abs(startRow - endRow) == 2 && Math.abs(startCol - endCol) == 2) {
            const middleRow = (startRow + endRow) / 2;
            const middleCol = (startCol + endCol) / 2;

            const middlePiece = this.getPiece(middleRow, middleCol);
            const currentPiece = this.getPiece(startRow, startCol);

            if (currentPiece !== null && middlePiece !== null) {
                if (middlePiece.color !== currentPiece.color) {
                    const destinationSquare = this.getPiece(endRow, endCol);
                    if (destinationSquare === null) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public movePiece(startRow: number, startCol: number, endRow: number, endCol: number): void {
        if (this.validateMove(startRow, startCol, endRow, endCol)) {
            const piece = this.getPiece(startRow, startCol);
            if (piece !== null) {
                if (this.canCapture(startRow, startCol, endRow, endCol)) {
                    const middleRow = (startRow + endRow) / 2;
                    const middleCol = (startCol + endCol) / 2;
                    this.board[middleRow][middleCol] = null;
                }
            }
            this.board[startRow][startCol] = null;
            this.board[endRow][endCol] = piece;
        }

        if (this.getPiece(endRow, endCol)?.color == PieceColor.Red && endRow == 0) {
            this.getPiece(endRow, endCol)?.makeKing();
        } 
        else if (this.getPiece(endRow, endCol)?.color == PieceColor.Black && endRow == 7) {
            this.getPiece(endRow, endCol)?.makeKing();
        }
    }
}

// game state management
enum State {
    inProgress,
    gameFinished
}

// a class representing a player
class Player {
    public name: string;
    public color: PieceColor;
    public score: number;
    public capturedPieces: number;

    constructor(name: string, color: PieceColor) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.capturedPieces = 0;
    }

    // update how many pieces are captured by a player
    // this could be removed unless there is a separate functionality to the update score method
    updateCapturedPieces(): void {
        this.capturedPieces += 1;
    }

    // update the score of a player
    updateScore(score:number): void {
        this.score += score;
    }

    // display the score of a player
    displayScore(): number {
        return this.score;
    }
}

// class for handling the actual game state and player turns
class CheckersGame {
    private board: CheckersBoard;
    private players: [Player, Player];
    private currentState: State;
    private currentPlayer: Player;

    constructor(playerOne: Player, playerTwo: Player) {
        this.board = new CheckersBoard();
        this.players = [playerOne, playerTwo];
        this.currentState = State.inProgress;
        this.currentPlayer = playerOne;
    }

    // a method to change the turn of a player
    public changeTurn(): void {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1]: this.players[0];
    }

    // a method to perform a move on the board
    // the return type is boolean as eventually when the game is playable on the webpage
    // the user will need feedback as to whether a certain move is possible or not
    
    public makeMove(move: Moves): boolean {
        const piece = this.board.getPiece(move.startRow, move.startCol);
        if (piece && piece.color === this.currentPlayer.color) {
            if (move.endRow !== null && move.endCol !== null) {
            this.board.movePiece(move.startRow, move.startCol, move.endRow, move.endCol);
            this.changeTurn();
            return true;
            }
        }
        return false;
    }
}


// DOM Manipulation to show the board on the webpage
const checkersBoard = new CheckersBoard();
const rows = document.querySelectorAll('.board-container .row')!;

function startBoard() {
    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll('.col')!;
        cols.forEach((col, colIndex) => {
            const piece: CheckersPiece | null = checkersBoard.getPiece(rowIndex, colIndex);
            if (piece) {
                if (piece.color === PieceColor.Black) {
                    const blackPiece = document.createElement('div');
                    blackPiece.classList.add('black-piece');
                    col.appendChild(blackPiece);
                }
                else if (piece.color === PieceColor.Red) {
                    const redPiece = document.createElement('div');
                    redPiece.classList.add('red-piece');
                    col.appendChild(redPiece);
                }
            }
            else {
                const emptySquare = document.createElement('div');
                emptySquare.classList.add('empty-square');
                col.appendChild(emptySquare);
            }
        });
    });
}
startBoard();