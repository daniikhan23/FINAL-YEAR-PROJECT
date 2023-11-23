import { CheckersBoard, CheckersPiece, PieceColor } from "../checkers";

describe('CheckersBoard', () => {
    let checkersBoard: CheckersBoard;

    beforeEach(() => {
        checkersBoard = new CheckersBoard();
    })

    test('Board should be correctly initialized', () => {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    expect(checkersBoard.getPiece(row, col)).toBeInstanceOf(CheckersPiece);
                    expect(checkersBoard.getPiece(row, col)?.color).toBe(PieceColor.Black);
                    expect(checkersBoard.getPiece(row, col)?.isKing).toBe(false);
                } else if (row > 4 && (row + col) % 2 === 1) {
                    expect(checkersBoard.getPiece(row, col)).toBeInstanceOf(CheckersPiece);
                    expect(checkersBoard.getPiece(row, col)?.color).toBe(PieceColor.Red);
                    expect(checkersBoard.getPiece(row, col)?.isKing).toBe(false);
                } else {
                    expect(checkersBoard.getPiece(row, col)).toBeNull();
                }
            }
        }
        expect(checkersBoard.board.length).toBe(8);
        checkersBoard.board.forEach(row => {
            expect(row.length).toBe(8);
        })
    });
    test('Ensure number of pieces is 12 and the same for Red and Black', () => {
        let blackPieces = 0;
        let redPieces = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    const piece = checkersBoard.getPiece(row, col);
                    if (piece) {
                        if (piece.color === PieceColor.Black) {
                            blackPieces++;
                        }
                    }
                } else if (row > 4 && (row + col) % 2 === 1) {
                    const piece = checkersBoard.getPiece(row, col);
                    if (piece) {
                        if (piece.color === PieceColor.Red) {
                            redPieces++;
                        }
                    }
                } else {
                    expect(checkersBoard.getPiece(row, col)).toBeNull();
                }
            }
        }
        expect(blackPieces).toBe(12);
        expect(redPieces).toBe(12);
    });
    test('Accessing out of bounds should be handled', () => {
        expect(checkersBoard.board[10]).toBeUndefined();
        expect(checkersBoard.board[0][19]).toBeUndefined();
        expect(checkersBoard.board[-1]).toBeUndefined();
    });
});
