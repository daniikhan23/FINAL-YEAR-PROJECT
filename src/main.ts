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