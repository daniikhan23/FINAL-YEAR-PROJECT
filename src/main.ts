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