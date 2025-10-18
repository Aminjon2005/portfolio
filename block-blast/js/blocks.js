// Определения блоков для игры Block Blast
class BlockShapes {
    static shapes = {
        // Одиночный блок
        single: [
            [1]
        ],
        
        // Линии
        line2: [
            [1, 1]
        ],
        line3: [
            [1, 1, 1]
        ],
        line4: [
            [1, 1, 1, 1]
        ],
        line5: [
            [1, 1, 1, 1, 1]
        ],
        
        // Вертикальные линии
        vline2: [
            [1],
            [1]
        ],
        vline3: [
            [1],
            [1],
            [1]
        ],
        vline4: [
            [1],
            [1],
            [1],
            [1]
        ],
        vline5: [
            [1],
            [1],
            [1],
            [1],
            [1]
        ],
        
        // Квадраты
        square2x2: [
            [1, 1],
            [1, 1]
        ],
        square3x3: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ],
        
        // L-образные блоки
        lShape1: [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        lShape2: [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        lShape3: [
            [1, 1],
            [1, 0],
            [1, 0]
        ],
        lShape4: [
            [1, 1],
            [0, 1],
            [0, 1]
        ],
        
        // Большие L-образные блоки
        bigL1: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1]
        ],
        bigL2: [
            [0, 0, 1],
            [0, 0, 1],
            [1, 1, 1]
        ],
        bigL3: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0]
        ],
        bigL4: [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1]
        ],
        
        // T-образные блоки
        tShape1: [
            [1, 1, 1],
            [0, 1, 0]
        ],
        tShape2: [
            [0, 1],
            [1, 1],
            [0, 1]
        ],
        tShape3: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        tShape4: [
            [1, 0],
            [1, 1],
            [1, 0]
        ],
        
        // Z-образные блоки
        zShape1: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        zShape2: [
            [0, 1],
            [1, 1],
            [1, 0]
        ],
        zShape3: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        zShape4: [
            [1, 0],
            [1, 1],
            [0, 1]
        ],
        
        // Угловые блоки
        corner1: [
            [1, 1],
            [1, 0]
        ],
        corner2: [
            [1, 1],
            [0, 1]
        ],
        corner3: [
            [1, 0],
            [1, 1]
        ],
        corner4: [
            [0, 1],
            [1, 1]
        ],
        
        // Специальные формы
        plus: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        
        // Маленькие фигуры
        dot2x1: [
            [1],
            [1]
        ],
        
        // Сложные формы
        stair1: [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 1]
        ],
        stair2: [
            [0, 0, 1],
            [0, 1, 1],
            [1, 1, 0]
        ]
    };
    
    // Цвета для разных типов блоков
    static colors = [
        '#FF6B6B', // Красный
        '#4ECDC4', // Бирюзовый
        '#45B7D1', // Голубой
        '#96CEB4', // Зеленый
        '#FFEAA7', // Желтый
        '#DDA0DD', // Сливовый
        '#98D8C8', // Мятный
        '#F7DC6F', // Золотой
        '#BB8FCE', // Лавандовый
        '#85C1E9'  // Небесно-голубой
    ];
    
    // Получить случайную форму блока
    static getRandomShape() {
        const shapeNames = Object.keys(this.shapes);
        const randomName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
        return {
            name: randomName,
            shape: this.shapes[randomName],
            color: this.colors[Math.floor(Math.random() * this.colors.length)]
        };
    }
    
    // Получить набор из 3 случайных блоков (как в оригинальной игре)
    static getRandomBlockSet() {
        return [
            this.getRandomShape(),
            this.getRandomShape(),
            this.getRandomShape()
        ];
    }
    
    // Получить размеры блока
    static getBlockDimensions(shape) {
        return {
            width: shape[0].length,
            height: shape.length
        };
    }
    
    // Проверить, можно ли разместить блок в указанной позиции
    static canPlaceBlock(grid, shape, startX, startY) {
        const dimensions = this.getBlockDimensions(shape);
        
        // Проверяем границы
        if (startX + dimensions.width > grid[0].length || 
            startY + dimensions.height > grid.length ||
            startX < 0 || startY < 0) {
            return false;
        }
        
        // Проверяем коллизии
        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                if (shape[y][x] === 1 && grid[startY + y][startX + x] !== 0) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Разместить блок на сетке
    static placeBlock(grid, shape, startX, startY, blockId = 1) {
        const dimensions = this.getBlockDimensions(shape);
        
        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                if (shape[y][x] === 1) {
                    grid[startY + y][startX + x] = blockId;
                }
            }
        }
    }
    
    // Получить все возможные позиции для размещения блока
    static getPossiblePositions(grid, shape) {
        const positions = [];
        const gridHeight = grid.length;
        const gridWidth = grid[0].length;
        const dimensions = this.getBlockDimensions(shape);
        
        for (let y = 0; y <= gridHeight - dimensions.height; y++) {
            for (let x = 0; x <= gridWidth - dimensions.width; x++) {
                if (this.canPlaceBlock(grid, shape, x, y)) {
                    positions.push({ x, y });
                }
            }
        }
        
        return positions;
    }
    
    // Повернуть блок на 90 градусов по часовой стрелке
    static rotateShape(shape) {
        const rows = shape.length;
        const cols = shape[0].length;
        const rotated = [];
        
        for (let x = 0; x < cols; x++) {
            rotated[x] = [];
            for (let y = rows - 1; y >= 0; y--) {
                rotated[x][rows - 1 - y] = shape[y][x];
            }
        }
        
        return rotated;
    }
    
    // Отразить блок по горизонтали
    static flipHorizontal(shape) {
        return shape.map(row => [...row].reverse());
    }
    
    // Отразить блок по вертикали
    static flipVertical(shape) {
        return [...shape].reverse();
    }
    
    // Получить все возможные вариации блока (повороты и отражения)
    static getAllVariations(shape) {
        const variations = new Set();
        let current = shape;
        
        // Добавляем исходную форму и все повороты
        for (let i = 0; i < 4; i++) {
            variations.add(JSON.stringify(current));
            current = this.rotateShape(current);
        }
        
        // Добавляем отражения
        const flippedH = this.flipHorizontal(shape);
        current = flippedH;
        for (let i = 0; i < 4; i++) {
            variations.add(JSON.stringify(current));
            current = this.rotateShape(current);
        }
        
        const flippedV = this.flipVertical(shape);
        current = flippedV;
        for (let i = 0; i < 4; i++) {
            variations.add(JSON.stringify(current));
            current = this.rotateShape(current);
        }
        
        return Array.from(variations).map(v => JSON.parse(v));
    }
}

// Класс для работы с отдельным блоком
class GameBlock {
    constructor(shape, color, id) {
        this.shape = shape;
        this.color = color;
        this.id = id;
        this.isUsed = false;
        this.canBePlaced = true;
    }
    
    // Проверить, можно ли разместить блок на сетке
    canPlace(grid) {
        return BlockShapes.getPossiblePositions(grid, this.shape).length > 0;
    }
    
    // Разместить блок на сетке
    place(grid, x, y) {
        if (BlockShapes.canPlaceBlock(grid, this.shape, x, y)) {
            BlockShapes.placeBlock(grid, this.shape, x, y, this.id);
            this.isUsed = true;
            return true;
        }
        return false;
    }
    
    // Получить размеры блока
    getDimensions() {
        return BlockShapes.getBlockDimensions(this.shape);
    }
    
    // Клонировать блок
    clone() {
        return new GameBlock(
            this.shape.map(row => [...row]),
            this.color,
            this.id
        );
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlockShapes, GameBlock };
}