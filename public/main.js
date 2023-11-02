"use strict";
let board_start = [
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
];
const rows = document.querySelectorAll('.board-container .row');
rows.forEach((row, rowIndex) => {
    const cols = row.querySelectorAll('.col');
    cols.forEach((col, colIndex) => {
        if (board_start[rowIndex][colIndex] === 1) {
            col.textContent = '1';
        }
        else if (board_start[rowIndex][colIndex] === -1) {
            col.textContent = '-1';
        }
        else {
            col.textContent = '';
        }
    });
});
//# sourceMappingURL=main.js.map