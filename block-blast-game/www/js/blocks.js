// Block shapes definitions (similar to Block Blast)
const BLOCK_SHAPES = [
    // Single block
    [[1]],
    
    // 2x1 blocks
    [[1, 1]],
    [[1], [1]],
    
    // 3x1 blocks
    [[1, 1, 1]],
    [[1], [1], [1]],
    
    // 2x2 square
    [[1, 1], [1, 1]],
    
    // L shapes
    [[1, 0], [1, 0], [1, 1]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1], [0, 1], [0, 1]],
    
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    
    // T shapes
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    
    // 3x3 square
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    
    // Plus shape
    [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    
    // Zigzag shapes
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
    [[0, 1], [1, 1], [1, 0]],
    
    // Small L shapes (2x2)
    [[1, 0], [1, 1]],
    [[0, 1], [1, 1]],
    [[1, 1], [1, 0]],
    [[1, 1], [0, 1]],
    
    // Line of 4
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
    
    // Line of 5
    [[1, 1, 1, 1, 1]],
    [[1], [1], [1], [1], [1]],
];

// Block colors
const BLOCK_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
    '#F8B739', // Orange
];

class Block {
    constructor(shape) {
        this.shape = shape;
        this.color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        this.used = false;
    }

    getWidth() {
        return this.shape[0].length;
    }

    getHeight() {
        return this.shape.length;
    }

    draw(ctx, cellSize, padding = 2) {
        const width = this.getWidth();
        const height = this.getHeight();

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (this.shape[row][col] === 1) {
                    const x = col * cellSize;
                    const y = row * cellSize;

                    // Draw shadow
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillRect(x + padding, y + padding + 2, cellSize - padding * 2, cellSize - padding * 2);

                    // Draw block with gradient
                    const gradient = ctx.createLinearGradient(x, y, x, y + cellSize);
                    gradient.addColorStop(0, this.color);
                    gradient.addColorStop(1, this.darkenColor(this.color, 20));
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2);

                    // Draw highlight
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x + padding, y + padding, cellSize - padding * 2, (cellSize - padding * 2) / 3);

                    // Draw border
                    ctx.strokeStyle = this.darkenColor(this.color, 30);
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2);
                }
            }
        }
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

// Generate random blocks
function generateRandomBlocks(count = 3) {
    const blocks = [];
    for (let i = 0; i < count; i++) {
        const randomShape = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
        blocks.push(new Block(randomShape));
    }
    return blocks;
}
