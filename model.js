export default class GameModel {
    initializeGame() {
        this.grid = Array(5).fill([]).map(() => Array(5).fill(0));
        this.score = 0;
        this.ninesGenerated = 0;  // To be used for validating imported JSON files
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
            let randomRoll = Math.random();
            if (randomRoll < 0.9) {
                this.grid[randomCell.row][randomCell.col] = 3;
            } else {
                this.grid[randomCell.row][randomCell.col] = 9;
                this.ninesGenerated++;
            }
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

                /*
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
                 */
            }
        }
        return false;
    }

    static isValidGameState(gameState) {
        /*
        There are three requirements:
        1. Property validation: there needs to be properties for grid, score and ninesGenerated
        2. Basic validation: grid size needs to be 5x5, and the values present in the grid need to be possible
        3. Grid/score comparison: score has to work out with the numbers in the grid and the number of nines generated
         */

        // Used for evaluating whether array entries are valid
        function isPowerofThreeorZero(num) {
            if (num === 0) return true;  // For empty tiles
            if (num < 1) return false;
            while (num % 3 === 0) num /= 3;
            return num === 1;
        }

        const oneOverLog3 = 1 / Math.log(3);  // Faster to precalculate this value in advance
        // Calculates the maximum expected number of points that could be added to the score from the generation of num
        function pointsToMake(num) {
            if (num === 0) return 0;  // Needed since log(0) is undefined
            let log3num = Math.round(Math.log(num) * oneOverLog3);
            return num * (log3num - 1);
        }

        // In case there are any errors referencing the expected properties
        try {
            // Check if the grid given is a 5x5 array, and if the contents seem valid
            if (!Array.isArray(gameState.grid) || gameState.grid.length !== 5) return false;
            // Keep track of what the score should be assuming that no nines are generated
            let scoreCalculation = 0;
            for (let row of gameState.grid) {
                if (!Array.isArray(row) || row.length !== 5) return false;

                // Check if each element is an integer and either 0 or a power of three
                for (let cell of row) {
                    if (!Number.isInteger(cell) || !isPowerofThreeorZero(cell)) return false;
                    scoreCalculation += pointsToMake(cell);
                }
            }

            // Account for the score loss from nines having been generated when new tiles are added
            const scoreLossFromNines = gameState.ninesGenerated * 9;
            // Return whether the score is as expected
            console.log(scoreCalculation - scoreLossFromNines);
            return scoreCalculation - scoreLossFromNines === gameState.score ? true : false;
        } catch {
            return false;
        }
    }
}
