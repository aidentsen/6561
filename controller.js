import GameModel from './model.js';
import GameView from "./view.js";

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        // Initialize the game
        this.model.initializeGame();
        this.view.updateGrid(this.model.grid, this.model.movedTiles);
        this.view.updateScore(this.model.score);
    }

    handleKeyPress(event) {
        let moved = false;
        let merged = false;

        switch (event.key) {
            case 'ArrowUp':
            case 'W':
                moved = this.model.moveUp();
                break;
            case 'ArrowDown':
            case 'S':
                moved = this.model.moveDown();
                break;
            case 'ArrowLeft':
            case 'A':
                moved = this.model.moveLeft();
                break;
            case 'ArrowRight':
            case 'D':
                moved = this.model.moveRight();
                break;
        }

        if (moved) {
            this.view.updateGrid(this.model.grid, this.model.movedTiles);
            this.view.updateScore(this.model.score);

            // Delay adding new tile to allow the movement animation to finish
            console.log('Adding new tile...');
            setTimeout(() => {
                this.model.addRandomTile();
                this.view.updateGrid(this.model.grid, this.model.movedTiles);
            }, 200); // 200ms delay matches CSS transition time

            console.log('Finding whether cells have merged');
            merged = this.model.mergeCells();
            while (merged) {
                setTimeout(() => {
                    this.view.updateGrid(this.model.grid, this.model.movedTiles);
                    this.view.updateScore(this.model.score);
                }, 200);
                merged = this.model.mergeCells();
                if (!merged) {
                    break;
                }
            }

            if (!this.model.canMove()) {
                console.log('Game over!');
            }
        }
    }
}

// Start the game
window.onload = function() {
    const gridElement = document.getElementById('grid-container');
    const scoreElement = document.getElementById('score');

    const model = new GameModel();
    const view = new GameView(gridElement, scoreElement);
    new GameController(model, view);
};
