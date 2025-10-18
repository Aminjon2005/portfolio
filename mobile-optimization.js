/**
 * Mobile Optimization для Block Blast Game
 * Оптимизация для мобильных устройств
 */

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.init();
    }

    /**
     * Определение мобильного устройства
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    /**
     * Инициализация мобильной оптимизации
     */
    init() {
        if (this.isMobile) {
            this.setupMobileViewport();
            this.setupTouchControls();
            this.optimizeForMobile();
            this.setupSwipeGestures();
            this.preventZoom();
        }
    }

    /**
     * Настройка viewport для мобильных устройств
     */
    setupMobileViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }
    }

    /**
     * Настройка сенсорного управления
     */
    setupTouchControls() {
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            gameBoard.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
            gameBoard.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        }
    }

    /**
     * Обработка начала касания
     */
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    /**
     * Обработка движения касания
     */
    handleTouchMove(e) {
        e.preventDefault();
    }

    /**
     * Обработка окончания касания
     */
    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
        
        this.handleTouchAction();
    }

    /**
     * Обработка действия касания
     */
    handleTouchAction() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Если движение слишком маленькое, считаем это кликом
        if (distance < 10) {
            this.handleTap();
        } else {
            this.handleSwipe(deltaX, deltaY);
        }
    }

    /**
     * Обработка тапа
     */
    handleTap() {
        const element = document.elementFromPoint(this.touchEndX, this.touchEndY);
        if (element && element.classList.contains('cell')) {
            element.click();
        }
    }

    /**
     * Обработка свайпа
     */
    handleSwipe(deltaX, deltaY) {
        const minSwipeDistance = 50;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        if (absDeltaX > minSwipeDistance || absDeltaY > minSwipeDistance) {
            if (absDeltaX > absDeltaY) {
                // Горизонтальный свайп
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            } else {
                // Вертикальный свайп
                if (deltaY > 0) {
                    this.handleSwipeDown();
                } else {
                    this.handleSwipeUp();
                }
            }
        }
    }

    /**
     * Настройка жестов свайпа
     */
    setupSwipeGestures() {
        // Добавляем визуальную обратную связь для свайпов
        this.addSwipeFeedback();
    }

    /**
     * Добавление визуальной обратной связи
     */
    addSwipeFeedback() {
        const style = document.createElement('style');
        style.textContent = `
            .swipe-feedback {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(76, 175, 80, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 1.2rem;
                z-index: 1000;
                pointer-events: none;
                animation: swipeFeedback 1s ease-out forwards;
            }
            
            @keyframes swipeFeedback {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Обработка свайпа вправо
     */
    handleSwipeRight() {
        this.showSwipeFeedback('→');
        // Можно добавить логику для поворота блока
    }

    /**
     * Обработка свайпа влево
     */
    handleSwipeLeft() {
        this.showSwipeFeedback('←');
        // Можно добавить логику для поворота блока
    }

    /**
     * Обработка свайпа вверх
     */
    handleSwipeUp() {
        this.showSwipeFeedback('↑');
        // Можно добавить логику для быстрого размещения
    }

    /**
     * Обработка свайпа вниз
     */
    handleSwipeDown() {
        this.showSwipeFeedback('↓');
        // Можно добавить логику для быстрого размещения
    }

    /**
     * Показ обратной связи свайпа
     */
    showSwipeFeedback(direction) {
        const feedback = document.createElement('div');
        feedback.className = 'swipe-feedback';
        feedback.textContent = direction;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1000);
    }

    /**
     * Оптимизация для мобильных устройств
     */
    optimizeForMobile() {
        this.addMobileStyles();
        this.optimizeGameBoard();
        this.addMobileControls();
        this.optimizePerformance();
    }

    /**
     * Добавление мобильных стилей
     */
    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                body {
                    font-size: 14px;
                    -webkit-text-size-adjust: 100%;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .game-container {
                    padding: 10px;
                    margin: 5px;
                    border-radius: 15px;
                }
                
                .game-title {
                    font-size: 1.8rem;
                    margin-bottom: 15px;
                }
                
                .score-board {
                    padding: 8px;
                    margin-bottom: 15px;
                }
                
                .score-value {
                    font-size: 1.1rem;
                }
                
                .game-board {
                    gap: 1px;
                    padding: 5px;
                }
                
                .cell {
                    min-height: 25px;
                    min-width: 25px;
                }
                
                .next-blocks {
                    margin-bottom: 15px;
                }
                
                .next-block-preview {
                    width: 40px;
                    height: 40px;
                }
                
                .game-controls {
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .btn {
                    padding: 10px 16px;
                    font-size: 0.9rem;
                    flex: 1;
                    min-width: 80px;
                }
                
                .ad-container {
                    margin: 15px 0;
                    min-height: 80px;
                    font-size: 0.9rem;
                }
                
                #sound-controls {
                    top: 5px;
                    right: 5px;
                    padding: 8px;
                    font-size: 0.8rem;
                }
                
                .game-over-content {
                    padding: 20px;
                    max-width: 280px;
                }
                
                .game-over h2 {
                    font-size: 1.5rem;
                }
            }
            
            @media (max-width: 480px) {
                .game-container {
                    padding: 8px;
                    margin: 2px;
                }
                
                .game-title {
                    font-size: 1.5rem;
                }
                
                .score-board {
                    padding: 6px;
                }
                
                .score-value {
                    font-size: 1rem;
                }
                
                .cell {
                    min-height: 20px;
                    min-width: 20px;
                }
                
                .next-block-preview {
                    width: 30px;
                    height: 30px;
                }
                
                .btn {
                    padding: 8px 12px;
                    font-size: 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Оптимизация игрового поля
     */
    optimizeGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            // Добавляем класс для мобильных устройств
            gameBoard.classList.add('mobile-optimized');
            
            // Увеличиваем область касания
            const cells = gameBoard.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.style.minHeight = '30px';
                cell.style.minWidth = '30px';
            });
        }
    }

    /**
     * Добавление мобильных элементов управления
     */
    addMobileControls() {
        // Добавляем кнопки для мобильных устройств
        const mobileControls = document.createElement('div');
        mobileControls.id = 'mobile-controls';
        mobileControls.style.cssText = `
            display: ${this.isMobile ? 'flex' : 'none'};
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        `;
        
        mobileControls.innerHTML = `
            <button class="btn btn-secondary" id="rotateBtn" style="flex: 1; min-width: 80px;">
                Повернуть
            </button>
            <button class="btn btn-secondary" id="hintBtn" style="flex: 1; min-width: 80px;">
                Подсказка
            </button>
        `;
        
        const gameControls = document.querySelector('.game-controls');
        if (gameControls) {
            gameControls.appendChild(mobileControls);
        }
        
        // Добавляем обработчики для мобильных кнопок
        this.setupMobileButtonHandlers();
    }

    /**
     * Настройка обработчиков мобильных кнопок
     */
    setupMobileButtonHandlers() {
        const rotateBtn = document.getElementById('rotateBtn');
        const hintBtn = document.getElementById('hintBtn');
        
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.rotateCurrentBlock();
            });
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.showHint();
            });
        }
    }

    /**
     * Поворот текущего блока
     */
    rotateCurrentBlock() {
        if (window.gameInstance && window.gameInstance.rotateBlock) {
            window.gameInstance.rotateBlock();
        } else {
            // Fallback - показываем уведомление
            this.showMobileNotification('Функция поворота в разработке');
        }
    }

    /**
     * Показ подсказки
     */
    showHint() {
        if (window.gameInstance && window.gameInstance.showHint) {
            window.gameInstance.showHint();
        } else {
            this.showMobileNotification('Попробуйте заполнить строки или столбцы!');
        }
    }

    /**
     * Показ мобильного уведомления
     */
    showMobileNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            text-align: center;
            max-width: 80%;
            animation: mobileNotification 2s ease-out forwards;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    /**
     * Оптимизация производительности
     */
    optimizePerformance() {
        // Отключаем анимации на слабых устройствах
        if (this.isLowEndDevice()) {
            this.disableAnimations();
        }
        
        // Оптимизируем частоту обновления
        this.optimizeFrameRate();
    }

    /**
     * Определение слабого устройства
     */
    isLowEndDevice() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !gl || navigator.hardwareConcurrency < 4;
    }

    /**
     * Отключение анимаций
     */
    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Оптимизация частоты кадров
     */
    optimizeFrameRate() {
        // Ограничиваем частоту обновления для экономии батареи
        let lastUpdate = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        
        const originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            const now = Date.now();
            if (now - lastUpdate >= frameInterval) {
                lastUpdate = now;
                return originalRequestAnimationFrame(callback);
            }
            return originalRequestAnimationFrame(() => {
                window.requestAnimationFrame(callback);
            });
        };
    }

    /**
     * Предотвращение зума
     */
    preventZoom() {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Получение информации об устройстве
     */
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            orientation: window.orientation || 0
        };
    }
}

// Добавляем CSS анимации для мобильных уведомлений
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
    @keyframes mobileNotification {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
`;
document.head.appendChild(mobileStyle);

// Создаем глобальный экземпляр мобильного оптимизатора
window.mobileOptimizer = new MobileOptimizer();