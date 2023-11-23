import { CheckersBoard, CheckersPiece, PieceColor } from "../checkers";

describe('CheckersBoard', () => {
    let board: CheckersBoard;

    beforeEach(() => {
        board = new CheckersBoard();
    })

    test('Board should be correctly initialized', () => {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col % 2 === 1)) {
                    expect(board.getPiece(row, col)).toBeInstanceOf(CheckersPiece);
                    expect(board.getPiece(row, col)?.color).toBe(PieceColor.Black);
                }
            }
        }
    })
})