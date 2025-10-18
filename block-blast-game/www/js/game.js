// Game Board Class
class GameBoard {
    constructor(size = 8) {
        this.size = size;
        this.grid = [];
        this.cellSize = 0;
        this.canvas = null;
        this.ctx = null;
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.currentBlocks = [];
        this.soundEnabled = true;
        this.gameOver = false;

        this.init();
    }

    init() {
        // Initialize empty grid
        this.grid = Array(this.size).fill(null).map(() => 
            Array(this.size).fill(null)
        );
    }

    setupCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Calculate cell size based on canvas container
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth - 20; // Account for padding
        const canvasSize = Math.min(containerWidth, 450);
        
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        this.cellSize = canvasSize / this.size;
        
        this.draw();
    }

    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                // Draw cell background
                this.ctx.fillStyle = this.grid[row][col] ? this.grid[row][col] : '#ffffff';
                this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);

                // Draw cell with shadow if filled
                if (this.grid[row][col]) {
                    const gradient = this.ctx.createLinearGradient(x, y, x, y + this.cellSize);
                    gradient.addColorStop(0, this.grid[row][col]);
                    gradient.addColorStop(1, this.darkenColor(this.grid[row][col], 20));
                    
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);

                    // Highlight
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, (this.cellSize - 2) / 3);
                }

                // Draw grid lines
                this.ctx.strokeStyle = '#e0e0e0';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
            }
        }
    }

    canPlaceBlock(block, startRow, startCol) {
        const height = block.getHeight();
        const width = block.getWidth();

        // Check boundaries
        if (startRow < 0 || startCol < 0 || 
            startRow + height > this.size || 
            startCol + width > this.size) {
            return false;
        }

        // Check if cells are empty
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (block.shape[row][col] === 1) {
                    if (this.grid[startRow + row][startCol + col] !== null) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    placeBlock(block, startRow, startCol) {
        if (!this.canPlaceBlock(block, startRow, startCol)) {
            return false;
        }

        const height = block.getHeight();
        const width = block.getWidth();

        // Place block on grid
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (block.shape[row][col] === 1) {
                    this.grid[startRow + row][startCol + col] = block.color;
                }
            }
        }

        block.used = true;

        // Calculate score for placing block
        const blockCells = height * width;
        this.addScore(blockCells);

        this.draw();
        this.checkAndClearLines();

        return true;
    }

    checkAndClearLines() {
        const linesToClear = [];

        // Check rows
        for (let row = 0; row < this.size; row++) {
            if (this.grid[row].every(cell => cell !== null)) {
                linesToClear.push({ type: 'row', index: row });
            }
        }

        // Check columns
        for (let col = 0; col < this.size; col++) {
            let filled = true;
            for (let row = 0; row < this.size; row++) {
                if (this.grid[row][col] === null) {
                    filled = false;
                    break;
                }
            }
            if (filled) {
                linesToClear.push({ type: 'col', index: col });
            }
        }

        if (linesToClear.length > 0) {
            this.clearLines(linesToClear);
        }
    }

    clearLines(lines) {
        // Animate clearing
        const clearedCells = new Set();

        lines.forEach(line => {
            if (line.type === 'row') {
                for (let col = 0; col < this.size; col++) {
                    clearedCells.add(`${line.index}-${col}`);
                }
            } else {
                for (let row = 0; row < this.size; row++) {
                    clearedCells.add(`${row}-${line.index}`);
                }
            }
        });

        // Flash animation
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            clearedCells.forEach(cell => {
                const [row, col] = cell.split('-').map(Number);
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                this.ctx.fillStyle = flashCount % 2 === 0 ? '#FFD700' : this.grid[row][col];
                this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
            });

            flashCount++;
            if (flashCount > 4) {
                clearInterval(flashInterval);
                
                // Clear the lines
                lines.forEach(line => {
                    if (line.type === 'row') {
                        this.grid[line.index].fill(null);
                    } else {
                        for (let row = 0; row < this.size; row++) {
                            this.grid[row][line.index] = null;
                        }
                    }
                });

                // Add bonus score
                const bonus = lines.length * this.size * 10;
                this.addScore(bonus);

                this.draw();
            }
        }, 100);
    }

    addScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
            document.getElementById('best-score').textContent = this.bestScore;
        }

        // Animate score
        const scoreElement = document.getElementById('score');
        scoreElement.classList.add('highlight');
        setTimeout(() => scoreElement.classList.remove('highlight'), 500);
    }

    hasValidMove(blocks) {
        for (let block of blocks) {
            if (block.used) continue;

            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.size; col++) {
                    if (this.canPlaceBlock(block, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    saveBestScore() {
        localStorage.setItem('blockBlastBestScore', this.bestScore.toString());
    }

    loadBestScore() {
        const saved = localStorage.getItem('blockBlastBestScore');
        return saved ? parseInt(saved) : 0;
    }

    reset() {
        this.init();
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = '0';
        document.getElementById('best-score').textContent = this.bestScore;
        this.draw();
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}
