/* 
0 represents no pieces
-1 represents opponent pieces
1 represents user pieces
*/

let board_start = [
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
]

// getting all rows from the grid
const rows = document.querySelectorAll('.board-container .row')

// looping through each of the rows and their individual columns to store the correct value from the array index
rows.forEach((row, rowIndex) => {
    const cols = row.querySelectorAll('.col');
    cols.forEach((col, colIndex) => {
        if (board_start[rowIndex][colIndex] === 1) {
            // 1 to represent user pieces
            col.innerText = '1'; 
        } else if (board_start[rowIndex][colIndex] === -1) {
            // -1 to represent opponent pieces
            col.innerText = '-1'; 
        } else {
            // '' to represent empty squares
            col.innerText = ''; 
        }
    });
});