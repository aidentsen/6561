import GameModel from './model.js';
import GameView from "./view.js";

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

        // Set up the restart button properly
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', this.initializeGame.bind(this));

        // Set up export button
        const exportButton = document.getElementById('export-button');
        exportButton.addEventListener('click', this.exportGameProgress.bind(this));

        // Set up load button
        this.setupLoadButton();

        // Initialize the game
        this.initializeGame();
    }

    initializeGame() {
        // Set up the game in the model
        this.model.initializeGame();

        // Initialise the view
        this.view.updateGrid(this.model.grid, this.model.movedTiles);
        this.view.updateScore(this.model.score);
        this.view.updateText('Play with the arrow keys or WASD!');

        // Set up controls
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.setupTouchControls();
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

        if (moved) this.handleMoved();
    }

    setupTouchControls() {
        let startX, startY, endX, endY;
        const gridContainer = document.getElementById('grid-container');

        // Detect touch start and end
        gridContainer.addEventListener('touchstart', this.handleTouchStart.bind(this));
        gridContainer.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(event) {
        event.preventDefault();
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    }

    handleTouchEnd(event) {
        event.preventDefault();
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
        this.handleSwipe(this.startX, this.startY, endX, endY);
    }

    handleSwipe(startX, startY, endX, endY) {
        const minThreshold = 30;
        const diffX = endX - startX;
        const diffY = endY - startY;
        let moved = false;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > minThreshold) {
                moved = this.model.moveRight();
            } else if (diffX < -minThreshold) {
                moved = this.model.moveLeft();
            }
        } else {
            // Vertical swipe
            if (diffY > minThreshold) {
                moved = this.model.moveDown();
            } else if (diffY < -minThreshold) {
                moved = this.model.moveUp();
            }
        }

        if (moved) this.handleMoved();
    }

    handleMoved() {
        console.log('Event listener triggered');

        this.view.updateGrid(this.model.grid, this.model.movedTiles);
        this.view.updateScore(this.model.score);
        this.view.updateText('Play with the arrow keys or WASD!');

        // Add and merge cells on appropriate actual delays
        this.addRandomTile();
        this.mergeCells();

        if (!this.model.canMove()) {
            this.view.updateText('Game over!');
            document.removeEventListener('keydown', this.handleKeyPress.bind(this));
            const gridContainer = document.getElementById('grid-container');
            gridContainer.removeEventListener('touchstart', this.handleTouchStart.bind(this));
            gridContainer.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        }
    }

    exportGameProgress() {
        // Capture game state
        const gameState = {
            grid: this.model.grid,
            score: this.model.score,
            ninesGenerated: this.model.ninesGenerated
        };

        // Convert game state to JSON
        const jsonString = JSON.stringify(gameState);
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Download JSON
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '6561-game-progress.json';
        a.click();
    }

    setupLoadButton() {
        const loadButton = document.getElementById('load-button');
        const loadInput = document.getElementById('load-input');

        loadButton.addEventListener('click', () => {
            loadInput.click();
        });
        loadInput.addEventListener('change', this.loadGameProgress.bind(this));
    }

    loadGameProgress(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('File accepted');
            const reader = new FileReader();

            reader.onload = (event) => {
                const gameState = JSON.parse(event.target.result);
                const isValidGameState = GameModel.isValidGameState(gameState);  // Static method to validate the game state

                if (isValidGameState) {
                    // Restore the game state
                    this.model.grid = gameState.grid;
                    this.model.score = gameState.score;
                    this.model.ninesGenerated = gameState.ninesGenerated;

                    // Update the view with the restored game state
                    this.view.updateGrid(this.model.grid, this.model.movedTiles);
                    this.view.updateScore(this.model.score);
                } else {
                    this.view.updateText('Invalid game state file');
                }
            };

            reader.readAsText(file);
        }
    }
}

// Start the game
window.onload = function() {
    const gridElement = document.getElementById('grid-container');
    const scoreElement = document.getElementById('score');
    const textElement = document.getElementById('text');

    const model = new GameModel();
    const view = new GameView(gridElement, scoreElement, textElement);
    new GameController(model, view);
};
