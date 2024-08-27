import GameModel from './model.js';
import GameView from "./view.js";

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        // Initialize the game
        this.initializeGame();

        // Set up the restart button properly
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', this.initializeGame.bind(this));
    }

    initializeGame() {
        this.model.initializeGame();
        this.view.updateGrid(this.model.grid, this.model.movedTiles);
        this.view.updateScore(this.model.score);
    }

    async addRandomTile() {
        this.model.addRandomTile();
        this.view.updateGrid(this.model.grid, this.model.movedTiles);
        await this.sleepNow(300);
    }

    async mergeCells() {
        let merged = this.model.mergeCells();
        while (merged) {
            await this.sleepNow(200);
            this.view.updateGrid(this.model.grid, this.model.movedTiles);
            this.view.updateScore(this.model.score);
            merged = this.model.mergeCells();
            if (!merged) {
                break;
            }
        }
    }

    handleKeyPress(event) {
        let moved = false;
        console.log('Key press');

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                moved = this.model.moveUp();
                break;
            case 'ArrowDown':
            case 's':
                moved = this.model.moveDown();
                break;
            case 'ArrowLeft':
            case 'a':
                moved = this.model.moveLeft();
                break;
            case 'ArrowRight':
            case 'd':
                moved = this.model.moveRight();
                break;
        }

        if (moved) {
            this.view.updateGrid(this.model.grid, this.model.movedTiles);
            this.view.updateScore(this.model.score);

            // Add and merge cells on appropriate actual delays
            this.addRandomTile();
            this.mergeCells();

            if (!this.model.canMove()) {
                console.log('Game over!');
                document.removeEventListener('keydown', this.handleKeyPress.bind(this));
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
