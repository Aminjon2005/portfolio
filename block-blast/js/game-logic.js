// Основная игровая логика Block Blast
class BlockBlastGame {
    constructor(canvasId, gridSize = 10) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;
        this.cellSize = this.canvas.width / gridSize;
        
        // Игровое состояние
        this.grid = this.createEmptyGrid();
        this.currentBlocks = [];
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.combo = 1;
        this.isGameOver = false;
        this.isPaused = false;
        
        // Настройки очков
        this.baseScore = 10;
        this.lineBonus = 100;
        this.comboMultiplier = 1.5;
        
        // Прогресс уровня
        this.levelProgress = 0;
        this.levelTarget = 1000;
        
        // Анимации
        this.animations = [];
        this.particles = [];
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.generateNewBlocks();
        this.render();
        this.setupEventListeners();
    }
    
    // Создать пустую сетку
    createEmptyGrid() {
        const grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                grid[y][x] = 0;
            }
        }
        return grid;
    }
    
    // Генерировать новые блоки
    generateNewBlocks() {
        this.currentBlocks = [];
        const blockSet = BlockShapes.getRandomBlockSet();
        
        for (let i = 0; i < 3; i++) {
            const blockData = blockSet[i];
            const block = new GameBlock(blockData.shape, blockData.color, i + 1);
            this.currentBlocks.push(block);
        }
        
        this.updateBlockPreviews();
        this.checkGameOver();
    }
    
    // Обновить превью блоков
    updateBlockPreviews() {
        for (let i = 0; i < 3; i++) {
            const canvas = document.getElementById(`block${i + 1}`);
            if (canvas && this.currentBlocks[i]) {
                this.renderBlockPreview(canvas, this.currentBlocks[i]);
            }
        }
    }
    
    // Отрендерить превью блока
    renderBlockPreview(canvas, block) {
        const ctx = canvas.getContext('2d');
        const cellSize = Math.min(canvas.width, canvas.height) / Math.max(
            block.getDimensions().width,
            block.getDimensions().height
        ) * 0.8;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (block.isUsed) {
            ctx.globalAlpha = 0.3;
        } else if (!block.canBePlaced) {
            ctx.globalAlpha = 0.5;
        } else {
            ctx.globalAlpha = 1;
        }
        
        const offsetX = (canvas.width - block.getDimensions().width * cellSize) / 2;
        const offsetY = (canvas.height - block.getDimensions().height * cellSize) / 2;
        
        for (let y = 0; y < block.shape.length; y++) {
            for (let x = 0; x < block.shape[y].length; x++) {
                if (block.shape[y][x] === 1) {
                    const cellX = offsetX + x * cellSize;
                    const cellY = offsetY + y * cellSize;
                    
                    this.drawCell(ctx, cellX, cellY, cellSize, block.color);
                }
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Нарисовать ячейку
    drawCell(ctx, x, y, size, color, isEmpty = false) {
        if (isEmpty) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, y, size, size);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.strokeRect(x, y, size, size);
        } else {
            // Основной цвет
            ctx.fillStyle = color;
            ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
            
            // Градиент для объема
            const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
            
            // Граница
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
        }
    }
    
    // Основной рендер игры
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рендерим сетку
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cellX = x * this.cellSize;
                const cellY = y * this.cellSize;
                
                if (this.grid[y][x] === 0) {
                    this.drawCell(this.ctx, cellX, cellY, this.cellSize, '#333', true);
                } else {
                    const blockIndex = this.grid[y][x] - 1;
                    const color = blockIndex >= 0 && blockIndex < this.currentBlocks.length 
                        ? this.currentBlocks[blockIndex].color 
                        : '#FF6B6B';
                    this.drawCell(this.ctx, cellX, cellY, this.cellSize, color);
                }
            }
        }
        
        // Рендерим анимации
        this.renderAnimations();
        
        // Рендерим частицы
        this.renderParticles();
    }
    
    // Попытаться разместить блок
    tryPlaceBlock(blockIndex, gridX, gridY) {
        if (blockIndex < 0 || blockIndex >= this.currentBlocks.length) {
            return false;
        }
        
        const block = this.currentBlocks[blockIndex];
        if (block.isUsed) {
            return false;
        }
        
        if (BlockShapes.canPlaceBlock(this.grid, block.shape, gridX, gridY)) {
            // Размещаем блок
            BlockShapes.placeBlock(this.grid, block.shape, gridX, gridY, blockIndex + 1);
            block.isUsed = true;
            
            // Начисляем очки за размещение
            const blockSize = this.calculateBlockSize(block.shape);
            const points = blockSize * this.baseScore * this.combo;
            this.addScore(points);
            
            // Создаем частицы
            this.createPlacementParticles(gridX, gridY, block.getDimensions());
            
            // Проверяем и очищаем линии
            this.checkAndClearLines();
            
            // Проверяем, все ли блоки использованы
            if (this.currentBlocks.every(b => b.isUsed)) {
                setTimeout(() => {
                    this.generateNewBlocks();
                }, 500);
            } else {
                this.updateBlockAvailability();
            }
            
            this.render();
            return true;
        }
        
        return false;
    }
    
    // Вычислить размер блока (количество ячеек)
    calculateBlockSize(shape) {
        let size = 0;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    size++;
                }
            }
        }
        return size;
    }
    
    // Проверить и очистить заполненные линии
    checkAndClearLines() {
        const linesToClear = [];
        
        // Проверяем горизонтальные линии
        for (let y = 0; y < this.gridSize; y++) {
            let isFull = true;
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x] === 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                linesToClear.push({ type: 'horizontal', index: y });
            }
        }
        
        // Проверяем вертикальные линии
        for (let x = 0; x < this.gridSize; x++) {
            let isFull = true;
            for (let y = 0; y < this.gridSize; y++) {
                if (this.grid[y][x] === 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                linesToClear.push({ type: 'vertical', index: x });
            }
        }
        
        if (linesToClear.length > 0) {
            this.clearLines(linesToClear);
        } else {
            this.combo = 1; // Сбрасываем комбо если нет очищенных линий
        }
    }
    
    // Очистить линии
    clearLines(lines) {
        // Анимация очистки
        lines.forEach(line => {
            this.createLineClearAnimation(line);
        });
        
        // Очищаем линии
        lines.forEach(line => {
            if (line.type === 'horizontal') {
                for (let x = 0; x < this.gridSize; x++) {
                    this.grid[line.index][x] = 0;
                }
            } else {
                for (let y = 0; y < this.gridSize; y++) {
                    this.grid[y][line.index] = 0;
                }
            }
        });
        
        // Начисляем очки
        const linesCount = lines.length;
        this.linesCleared += linesCount;
        
        let bonus = linesCount * this.lineBonus * this.combo;
        if (linesCount > 1) {
            bonus *= linesCount; // Дополнительный бонус за множественные линии
        }
        
        this.addScore(bonus);
        this.combo = Math.min(this.combo * this.comboMultiplier, 10); // Максимальное комбо x10
        
        // Показываем комбо
        if (this.combo > 1) {
            this.showComboIndicator();
        }
        
        // Создаем частицы
        this.createLineClearParticles(lines);
        
        // Проверяем уровень
        this.checkLevelUp();
    }
    
    // Добавить очки
    addScore(points) {
        this.score += Math.floor(points);
        this.levelProgress += Math.floor(points);
        this.updateScoreDisplay();
    }
    
    // Обновить отображение счета
    updateScoreDisplay() {
        const scoreElement = document.getElementById('current-score');
        const levelElement = document.getElementById('current-level');
        const progressElement = document.getElementById('progress-fill');
        const comboElement = document.getElementById('combo-text');
        
        if (scoreElement) scoreElement.textContent = this.score.toLocaleString();
        if (levelElement) levelElement.textContent = this.level;
        if (comboElement) comboElement.textContent = `Комбо: x${this.combo.toFixed(1)}`;
        
        if (progressElement) {
            const progress = Math.min((this.levelProgress / this.levelTarget) * 100, 100);
            progressElement.style.width = `${progress}%`;
        }
    }
    
    // Проверить повышение уровня
    checkLevelUp() {
        if (this.levelProgress >= this.levelTarget) {
            this.level++;
            this.levelProgress = 0;
            this.levelTarget = Math.floor(this.levelTarget * 1.5);
            
            // Показываем уведомление о новом уровне
            this.showLevelUpNotification();
        }
    }
    
    // Обновить доступность блоков
    updateBlockAvailability() {
        this.currentBlocks.forEach(block => {
            if (!block.isUsed) {
                block.canBePlaced = block.canPlace(this.grid);
            }
        });
        this.updateBlockPreviews();
    }
    
    // Проверить окончание игры
    checkGameOver() {
        const availableBlocks = this.currentBlocks.filter(block => !block.isUsed);
        
        for (const block of availableBlocks) {
            if (block.canPlace(this.grid)) {
                return false;
            }
        }
        
        if (availableBlocks.length > 0) {
            this.gameOver();
            return true;
        }
        
        return false;
    }
    
    // Окончание игры
    gameOver() {
        this.isGameOver = true;
        
        // Сохраняем лучший результат
        const bestScore = localStorage.getItem('blockBlastBestScore') || 0;
        if (this.score > bestScore) {
            localStorage.setItem('blockBlastBestScore', this.score);
        }
        
        // Показываем экран окончания игры
        setTimeout(() => {
            this.showGameOverScreen();
        }, 1000);
        
        // Показываем рекламу
        if (window.adManager) {
            window.adManager.showInterstitial(() => {
                console.log('Game over ad finished');
            });
        }
    }
    
    // Показать экран окончания игры
    showGameOverScreen() {
        document.getElementById('final-score').textContent = this.score.toLocaleString();
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('lines-cleared').textContent = this.linesCleared;
        
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('game-over-screen').classList.add('active');
    }
    
    // Перезапустить игру
    restart() {
        this.grid = this.createEmptyGrid();
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.combo = 1;
        this.levelProgress = 0;
        this.levelTarget = 1000;
        this.isGameOver = false;
        this.isPaused = false;
        this.animations = [];
        this.particles = [];
        
        this.generateNewBlocks();
        this.updateScoreDisplay();
        this.render();
    }
    
    // Пауза/возобновление
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            document.getElementById('pause-screen').classList.add('active');
        } else {
            document.getElementById('pause-screen').classList.remove('active');
        }
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Клики по превью блоков
        for (let i = 1; i <= 3; i++) {
            const canvas = document.getElementById(`block${i}`);
            if (canvas) {
                canvas.addEventListener('click', () => {
                    this.selectBlock(i - 1);
                });
            }
        }
        
        // Клики по игровому полю
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const gridX = Math.floor(x / this.cellSize);
            const gridY = Math.floor(y / this.cellSize);
            
            if (this.selectedBlockIndex !== undefined) {
                this.tryPlaceBlock(this.selectedBlockIndex, gridX, gridY);
                this.selectedBlockIndex = undefined;
                this.updateBlockPreviews();
            }
        });
    }
    
    // Выбрать блок
    selectBlock(index) {
        if (this.currentBlocks[index] && !this.currentBlocks[index].isUsed) {
            this.selectedBlockIndex = index;
            this.updateBlockPreviews();
        }
    }
    
    // Создать анимацию очистки линии
    createLineClearAnimation(line) {
        // Реализация анимации очистки линии
        console.log('Line clear animation for:', line);
    }
    
    // Создать частицы при размещении блока
    createPlacementParticles(x, y, dimensions) {
        // Реализация частиц при размещении
        console.log('Placement particles at:', x, y);
    }
    
    // Создать частицы при очистке линий
    createLineClearParticles(lines) {
        // Реализация частиц при очистке линий
        console.log('Line clear particles for:', lines);
    }
    
    // Показать индикатор комбо
    showComboIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'combo-indicator';
        indicator.textContent = `COMBO x${this.combo.toFixed(1)}!`;
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }
    
    // Показать уведомление о новом уровне
    showLevelUpNotification() {
        console.log('Level up to:', this.level);
    }
    
    // Рендерить анимации
    renderAnimations() {
        // Реализация рендеринга анимаций
    }
    
    // Рендерить частицы
    renderParticles() {
        // Реализация рендеринга частиц
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlockBlastGame;
}