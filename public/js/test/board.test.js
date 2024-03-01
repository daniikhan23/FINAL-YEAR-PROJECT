import { CheckersBoard, CheckersPiece, PieceColor } from "../components/checkersGame";
describe('CheckersBoard', () => {
    let checkersBoard;
    beforeEach(() => {
        checkersBoard = new CheckersBoard();
    });
    test('Board should be correctly initialized', () => {
        var _a, _b, _c, _d;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col) % 2 === 1) {
                    expect(checkersBoard.getPiece(row, col)).toBeInstanceOf(CheckersPiece);
                    expect((_a = checkersBoard.getPiece(row, col)) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Black);
                    expect((_b = checkersBoard.getPiece(row, col)) === null || _b === void 0 ? void 0 : _b.isKing).toBe(false);
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    expect(checkersBoard.getPiece(row, col)).toBeInstanceOf(CheckersPiece);
                    expect((_c = checkersBoard.getPiece(row, col)) === null || _c === void 0 ? void 0 : _c.color).toBe(PieceColor.Red);
                    expect((_d = checkersBoard.getPiece(row, col)) === null || _d === void 0 ? void 0 : _d.isKing).toBe(false);
                }
                else {
                    expect(checkersBoard.getPiece(row, col)).toBeNull();
                }
            }
        }
        expect(checkersBoard.board.length).toBe(8);
        checkersBoard.board.forEach(row => {
            expect(row.length).toBe(8);
        });
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
                }
                else if (row > 4 && (row + col) % 2 === 1) {
                    const piece = checkersBoard.getPiece(row, col);
                    if (piece) {
                        if (piece.color === PieceColor.Red) {
                            redPieces++;
                        }
                    }
                }
                else {
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
//# sourceMappingURL=board.test.js.map