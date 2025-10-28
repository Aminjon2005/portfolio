// Main game controller
let gameBoard = null;
let currentBlocks = [];
let pieceCanvases = [];
let draggedBlock = null;
let draggedCanvas = null;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    setupEventListeners();
});

function initGame() {
    // Initialize game board
    gameBoard = new GameBoard(8);
    const boardCanvas = document.getElementById('game-board');
    gameBoard.setupCanvas(boardCanvas);

    // Setup piece canvases
    pieceCanvases = [
        document.getElementById('piece-1'),
        document.getElementById('piece-2'),
        document.getElementById('piece-3')
    ];

    // Generate initial blocks
    generateNewBlocks();

    // Update best score display
    document.getElementById('best-score').textContent = gameBoard.bestScore;
}

function setupEventListeners() {
    // New game button
    document.getElementById('new-game-btn').addEventListener('click', () => {
        if (confirm('Start a new game? Current progress will be lost.')) {
            newGame();
        }
    });

    // Restart button (game over)
    document.getElementById('restart-btn').addEventListener('click', () => {
        newGame();
    });

    // Sound toggle
    const soundBtn = document.getElementById('sound-toggle');
    soundBtn.addEventListener('click', () => {
        gameBoard.soundEnabled = !gameBoard.soundEnabled;
        soundBtn.textContent = gameBoard.soundEnabled ? '🔊 Sound' : '🔇 Sound';
    });

    // Setup drag and drop for pieces
    setupDragAndDrop();

    // Board click/touch for placement
    setupBoardInteraction();
}

function setupDragAndDrop() {
    pieceCanvases.forEach((canvas, index) => {
        // Mouse events
        canvas.addEventListener('mousedown', (e) => startDrag(e, index));
        
        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrag(e.touches[0], index);
        });
    });

    // Global mouse/touch move and up
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);
}

function setupBoardInteraction() {
    const boardCanvas = document.getElementById('game-board');
    
    boardCanvas.addEventListener('click', (e) => {
        if (draggedBlock) {
            tryPlaceBlock(e);
        }
    });

    boardCanvas.addEventListener('touchend', (e) => {
        if (draggedBlock && e.changedTouches.length > 0) {
            tryPlaceBlock(e.changedTouches[0]);
        }
    });
}

function startDrag(e, blockIndex) {
    const block = currentBlocks[blockIndex];
    if (!block || block.used) return;

    draggedBlock = block;
    draggedCanvas = pieceCanvases[blockIndex];
    draggedCanvas.classList.add('dragging');
}

function handleDragMove(e) {
    if (!draggedBlock) return;
    e.preventDefault();
}

function handleDragEnd(e) {
    if (!draggedBlock) return;

    const board = document.getElementById('game-board');
    const rect = board.getBoundingClientRect();
    
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    // Check if dropped on board
    if (clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom) {
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const col = Math.floor(x / gameBoard.cellSize);
        const row = Math.floor(y / gameBoard.cellSize);

        if (gameBoard.placeBlock(draggedBlock, row, col)) {
            draggedCanvas.classList.add('used');
            checkAllBlocksUsed();
        }
    }

    if (draggedCanvas) {
        draggedCanvas.classList.remove('dragging');
    }
    
    draggedBlock = null;
    draggedCanvas = null;
}

function tryPlaceBlock(e) {
    if (!draggedBlock) return;

    const board = document.getElementById('game-board');
    const rect = board.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / gameBoard.cellSize);
    const row = Math.floor(y / gameBoard.cellSize);

    if (gameBoard.placeBlock(draggedBlock, row, col)) {
        draggedCanvas.classList.add('used');
        checkAllBlocksUsed();
    }
}

function generateNewBlocks() {
    currentBlocks = generateRandomBlocks(3);
    
    pieceCanvases.forEach((canvas, index) => {
        canvas.classList.remove('used');
        const block = currentBlocks[index];
        
        // Calculate canvas size
        const maxSize = 100;
        const cellSize = Math.min(maxSize / Math.max(block.getWidth(), block.getHeight()), 30);
        
        canvas.width = block.getWidth() * cellSize;
        canvas.height = block.getHeight() * cellSize;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        block.draw(ctx, cellSize);
    });

    gameBoard.currentBlocks = currentBlocks;

    // Check if game is over
    if (!gameBoard.hasValidMove(currentBlocks)) {
        gameOver();
    }
}

function checkAllBlocksUsed() {
    const allUsed = currentBlocks.every(block => block.used);
    
    if (allUsed) {
        // Show ad before generating new blocks (Appodeal integration point)
        if (typeof Appodeal !== 'undefined') {
            Appodeal.show(Appodeal.INTERSTITIAL);
        }
        
        setTimeout(() => {
            generateNewBlocks();
        }, 500);
    }
}

function gameOver() {
    gameBoard.gameOver = true;
    
    // Show ad on game over
    if (typeof Appodeal !== 'undefined') {
        Appodeal.show(Appodeal.INTERSTITIAL);
    }
    
    // Display game over screen
    document.getElementById('final-score').textContent = gameBoard.score;
    document.getElementById('final-best-score').textContent = gameBoard.bestScore;
    document.getElementById('game-over').classList.remove('hidden');
}

function newGame() {
    document.getElementById('game-over').classList.add('hidden');
    gameBoard.reset();
    generateNewBlocks();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (gameBoard && gameBoard.canvas) {
        gameBoard.setupCanvas(gameBoard.canvas);
    }
});

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => {
    if (draggedBlock) {
        e.preventDefault();
    }
}, { passive: false });
