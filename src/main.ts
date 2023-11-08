/*
Creating a class for move generation
*/

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
/* 
Class representing Checkers Pieces
Class will have properties of the color of the piece as well as tracking whether or not it is a King piece (when it has reached the opposite end of the board)
*/
class CheckersPiece {
    public color: PieceColor;
    public isKing: boolean;

    constructor(color: PieceColor, isKing:boolean = false){
        this.color = color;
        this.isKing = isKing;
    }
}


// Class representing the Checkers board
class CheckersBoard {
    private board: (CheckersPiece | null)[][] = [];

    constructor(){
        this.initializeBoard();
        console.log(this.board);
    }

    // start of game board method
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

    // position of piece
    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }

    // method to see if piece is being placed in the board and if the destination square is empty
    private validateMove(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // check to see if attempted move will place piece outside board
        if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            return false;
        }

        const destinationSquare = this.getPiece(endRow, endCol);
        // there's a piece there already
        if (destinationSquare !== null) {
            return false;
        }
        return true;

        // will add more conditions over time, need to see if this works at least
        // important conditions: capturing enemy pieces, nailing this is crucial
        // first two arguments for now will remain unused.
    }

    public possibleMoves(row: number, col: number): Moves[] {
        const piece = this.getPiece(row, col);
        const moves: Moves[] = [];

        if (piece !== null) {
            // black will move by a positive number
            // red by negative
            const direction = piece.color === PieceColor.Black ? 1: -1;
            const startRow = row;
            const startCol = col;

            const potentialMovesArr = [
                {endRow: startRow + direction, endCol: startCol - 1},
                {endRow: startRow + direction, endCol: startCol + 1}
            ];

            for (const move of potentialMovesArr) {
                if (this.validateMove(startRow, startCol, move.endRow, move.endCol)) {
                    moves.push(new Moves(startRow, startCol, move.endRow, move.endCol));
                }
            }

            // need to add potential moves to king pieces - future implementation
        }
        return moves;
    }

    public movePiece(startRow: number, startCol: number, endRow: number, endCol: number): void {
        const piece = this.getPiece(startRow, startCol);
        let bool = this.validateMove(startRow, startCol, endRow, endCol);
        if (bool !== false) {
            if (piece !== null) {
                this.board[startRow][startCol] = null;
                this.board[endRow][endCol] = piece;
    
                // need to account for a piece capture and king pieces
            }
        }
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