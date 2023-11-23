import { CheckersBoard, CheckersPiece, PieceColor } from "../checkers";
describe('CheckersBoard', () => {
    let board;
    beforeEach(() => {
        board = new CheckersBoard();
    });
    test('Board should be correctly initialized', () => {
        var _a;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row < 3 && (row + col % 2 === 1)) {
                    expect(board.getPiece(row, col)).toBeInstanceOf(CheckersPiece);
                    expect((_a = board.getPiece(row, col)) === null || _a === void 0 ? void 0 : _a.color).toBe(PieceColor.Black);
                    expect(board.getPiece(row, col)).toBe(!null);
                }
            }
        }
    });
});
//# sourceMappingURL=board.test.js.map