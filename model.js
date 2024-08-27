export default class GameModel {
    initializeGame() {
        this.grid = Array(5).fill([]).map(() => Array(5).fill(0));
        this.score = 0;
        this.movedTiles = [];
        this.addRandomTile();
        this.addRandomTile();
    }

    addRandomTile() {
        let emptyCells = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 3 : 9;
            this.movedTiles.push({ row: randomCell.row, col: randomCell.col, new: true });
        }
    }

    /*
    moveLeft() {
        this.movedTiles = [];
        let moved = false;

        for (let row = 0; row < 5; row++) {
            let newRow = Array(5).fill(0);
            let index = 0;
            for (let col = 0; col < 5; col++) {
                // Check if the tile in question has contents
                if (this.grid[row][col] !== 0) {
                    // Check for sequences of three identical adjacent tiles
                    if (
                        col < 3 &&
                        this.grid[row][col] === this.grid[row][col + 1] &&
                        this.grid[row][col] === this.grid[row][col + 2]
                    ) {
                        // Merge together the three identical tiles
                        newRow[index] = this.grid[row][col] * 3;
                        this.score += newRow[index];  // Update the score
                        this.movedTiles.push({ row, col: index, merged: true });

                        // Skip the next two columns as they have been merged into the first one
                        col += 2;
                        index++;
                    } else {
                        // Normal tile shift
                        if (newRow[index] === 0) {
                            newRow[index] = this.grid[row][col];
                        } else {
                            index++;
                            newRow[index] = this.grid[row][col];
                        }
                    }
                    moved = true;
                }
            }

            // Update the row in the grid
            for (let col = 0; col < 5; col++) {
                if (this.grid[row][col] !== newRow[col]) {
                    this.movedTiles.push({ row, col });
                }
                this.grid[row][col] = newRow[col];
            }
        }
        return moved;
    }

     */

    moveLeft() {
        this.movedTiles = [];
        let moved = false;

        for (let row = 0; row < 5; row++) {
            // Shift all the non-zero tiles left
            let newRow = this.grid[row].filter(value => value !== 0);
            while (newRow.length < 5) newRow.push(0);
            if (newRow !== this.grid[row]) {  // If the tiles have been shifted, the state of the board has changed
                moved = true;
            }

            // Step 2: Merge three identical tiles
            for (let col = 0; col < 3; col++) {
                if (newRow[col] !== 0 && newRow[col] === newRow[col + 1] && newRow[col] === newRow[col + 2]) {
                    newRow[col] = newRow[col] * 3;  // Merge three tiles into one with triple the value
                    newRow[col + 1] = 0;  // Clear the next two tiles
                    newRow[col + 2] = 0;
                    this.score += newRow[col];  // Update score
                    this.movedTiles.push({ row, col, merged: true });
                    moved = true;
                }
            }

            // Step 3: Shift all non-zero tiles left again after merging
            newRow = newRow.filter(value => value !== 0);
            while (newRow.length < 5) newRow.push(0);

            // Update the row in the grid
            for (let col = 0; col < 5; col++) {
                if (this.grid[row][col] !== newRow[col]) {
                    this.movedTiles.push({ row, col });
                }
                this.grid[row][col] = newRow[col];
            }
        }

        return moved;
    }


    moveRight() {
        this.grid = this.grid.map(row => row.reverse());
        let moved = this.moveLeft();
        this.grid = this.grid.map(row => row.reverse());
        return moved;
    }

    // For moveUp() and moveDown()
    transposeGrid() {
        this.grid = this.grid.reduce((prev, next) =>
            next.map((item, i) =>
                (prev[i] || []).concat(next[i])
            ), []);
    }

    moveUp() {
        this.transposeGrid();
        let moved = this.moveLeft()
        this.transposeGrid();
        return moved;
    }

    moveDown() {
        this.transposeGrid();
        let moved = this.moveRight();
        this.transposeGrid();
        return moved;
    }

    /*
    mergeCells() {
        let directions = [
            { x: -1, y: 0 },  // Above
            { x: 0, y: -1 },  // Left
            { x: 1, y: 0 },  // Below
            { x: 0, y: 1 }  // Right
        ];
        this.movedTiles = [];
        let moved = false;

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.grid[row][col] !== 0) {

                }
            }
        }
    }
     */

    canMove() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                // If there are any empty tiles, there are still valid moves that can be made
                if (this.grid[row][col] === 0) {
                    return true;
                }

                // If the grid is full, check for adjacent lines of three - needed if no merge
                if (row < 3) {
                    if (this.grid[row][col] === this.grid[row + 1][col] &&
                    this.grid[row][col] === this.grid[row + 2][col]) {
                        return true;
                    }
                }
                if (col < 3) {
                    if (this.grid[row][col] === this.grid[row][col + 1] &&
                    this.grid[row][col] === this.grid[row][col + 2]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
