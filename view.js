export default class GameView {
    constructor(gridElement, scoreElement) {
        this.gridElement = gridElement;
        this.scoreElement = scoreElement;
    }

    updateGrid(grid, movedTiles) {
        const cells = this.gridElement.getElementsByClassName('grid-cell');
        this.clearAnimations(cells);

        for (let i = 0; i < cells.length; i++) {
            let row = Math.floor(i / 5);
            let col = i % 5;
            const value = grid[row][col];
            cells[i].textContent = value === 0 ? '' : value;
            cells[i].className = 'grid-cell'; // Reset class

            if (value !== 0) {
                cells[i].classList.add('tile-' + value);

                // Add 'tile-new' class for newly added tiles
                if (movedTiles.some(tile => tile.row === row && tile.col === col && tile.new)) {
                    cells[i].classList.add('tile-new');
                }

                // Add 'tile-merged' class for merged tiles
                if (movedTiles.some(tile => tile.row === row && tile.col === col && tile.merged)) {
                    cells[i].classList.add('tile-merged');
                }
            }
        }
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
    }

    clearAnimations(cells) {
        for (let cell of cells) {
            cell.classList.remove('tile-new', 'tile-merged');
        }
    }
}
