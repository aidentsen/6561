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

    moveLeft() {
        this.movedTiles = [];
        let moved = false;

        for (let row = 0; row < 5; row++) {
            // Shift all the non-zero tiles left
            let newRow = this.grid[row].filter(value => value !== 0);
            while (newRow.length < 5) newRow.push(0);
            // If the tiles have been shifted, the state of the board has changed
            if (newRow.toString() !== this.grid[row].toString()) {
                // toString() is needed since non-primitive data types like arrays are compared based on reference
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

    mergeCells() {
        // Variable initialisation a la moveLeft()
        this.movedTiles = [];
        let moved = false;

        // The row/col offsets for the four cardinal directions that can be merged in
        let directions = [
            { y: -1, x: 0 },  // Above
            { y: 0, x: -1 },  // Left
            { y: 1, x: 0 },  // Below
            { y: 0, x: 1 }  // Right
        ];

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                // If grid cell has a nonzero value
                if (this.grid[row][col] !== 0) {
                    let sameValueLocations = [];
                    for (let direction of directions) {
                        let newRow = row + direction.y;
                        let newCol = col + direction.x;

                        // Only try to check for locations inside the grid
                        if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
                            if (this.grid[row][col] === this.grid[newRow][newCol]) {
                                sameValueLocations.push({ row: newRow, col: newCol });
                            }

                            // If there are three tiles with the same nonzero value centred on a central tile
                            if (sameValueLocations.length === 2) {
                                // Update values
                                this.grid[row][col] *= 3;
                                this.score += this.grid[row][col];
                                this.movedTiles.push({ row, col, merged: true });
                                moved = true;

                                // Clear the values of the non-central merged tiles
                                for (let location of sameValueLocations) {
                                    this.grid[location.row][location.col] = 0;
                                    this.movedTiles.push({ row: location.row, col: location.col });
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        return moved;
    }

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
