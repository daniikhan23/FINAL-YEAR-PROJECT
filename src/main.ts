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

    validMove(board: CheckersBoard): boolean {
        // if move is valid then return true and let the move proceed
        // in whatever function that this will be used in.
        return true; // for now
    }
}


/* 
Class representing Checkers Pieces
Class will have properties of the color of the piece as well as tracking whether or not it is a King piece (when it has reached the opposite end of the board)
*/
class CheckersPiece {
    public color: string;
    public isKing: boolean;

    constructor(color: string, isKing:boolean = false){
        this.color = color;
        this.isKing = isKing;
    }
}


// Class representing the Checkers board
class CheckersBoard {
    private board: (CheckersPiece | null)[][] = [];

    constructor(){
        this.initializeBoard();
    }

    // start of game board method
    private initializeBoard(): void {
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece('black');
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    this.board[row][col] = new CheckersPiece('red');
                }
                else {
                    this.board[row][col] = null;
                }
            }
        }
    }

    // get exact position of a checkers piece, in the absence of one
    // return null, this is to ensure each piece is starting in its correct 
    // place
    public getPiece(row: number, col: number): CheckersPiece | null {
        return this.board[row][col];
    }
}

// DOM Manipulation to show the board on the webpage

const checkersBoard = new CheckersBoard();
const rows = document.querySelectorAll('.board-container .row')!;

rows.forEach((row, rowIndex) => {
    const cols = row.querySelectorAll('.col')!;
    cols.forEach((col, colIndex) => {
        const piece: CheckersPiece | null = checkersBoard.getPiece(rowIndex, colIndex);
        if (piece) {
            if (piece.color === 'black') {
                const blackPiece = document.createElement('div');
                blackPiece.classList.add('black-piece');
                col.appendChild(blackPiece);
            }
            else if (piece.color == 'red') {
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

console.log(checkersBoard.getPiece(0,1));
console.log(checkersBoard.getPiece(0,2));
console.log(checkersBoard.getPiece(0,3));
console.log(checkersBoard.getPiece(0,4));