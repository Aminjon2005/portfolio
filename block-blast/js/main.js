// Главный файл приложения Block Blast
class BlockBlastApp {
    constructor() {
        this.isInitialized = false;
        this.game = null;
        this.adManager = null;
        this.uiManager = null;
        this.soundManager = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Ждем загрузки DOM
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Показываем загрузчик
            this.showInitialLoader();
            
            // Инициализируем компоненты
            await this.initializeComponents();
            
            // Настраиваем интеграцию с рекламой
            this.setupAdIntegration();
            
            // Настраиваем звуковые эффекты в игре
            this.setupSoundIntegration();
            
            // Настраиваем обработчики событий игры
            this.setupGameEventHandlers();
            
            // Скрываем загрузчик
            this.hideInitialLoader();
            
            // Запускаем фоновую музыку
            this.startBackgroundMusic();
            
            this.isInitialized = true;
            console.log('Block Blast app initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showErrorMessage('Ошибка загрузки игры. Пожалуйста, обновите страницу.');
        }
    }
    
    // Показать начальный загрузчик
    showInitialLoader() {
        const loader = document.createElement('div');
        loader.id = 'initial-loader';
        loader.className = 'loader show';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Загрузка Block Blast...</div>
            </div>
        `;
        document.body.appendChild(loader);
    }
    
    // Скрыть начальный загрузчик
    hideInitialLoader() {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.classList.remove('show');
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }
    
    // Инициализировать компоненты
    async initializeComponents() {
        // Менеджеры уже созданы в соответствующих файлах
        this.adManager = window.adManager;
        this.uiManager = window.uiManager;
        this.soundManager = window.soundManager;
        
        // Ждем инициализации Appodeal (если доступен)
        if (this.adManager && !this.adManager.getInitializationStatus()) {
            await new Promise(resolve => {
                const checkInit = () => {
                    if (this.adManager.getInitializationStatus()) {
                        resolve();
                    } else {
                        setTimeout(checkInit, 100);
                    }
                };
                setTimeout(checkInit, 1000); // Максимум 1 секунда ожидания
                setTimeout(resolve, 1000); // Продолжаем даже если не инициализировался
            });
        }
        
        // Настраиваем тестовый режим для разработки
        if (this.adManager && window.location.hostname === 'localhost') {
            this.adManager.setTestMode(true);
        }
    }
    
    // Настроить интеграцию с рекламой
    setupAdIntegration() {
        if (!this.adManager) return;
        
        // Показываем баннер в главном меню
        const showMenuBanner = () => {
            if (this.uiManager.currentScreen === 'main-menu') {
                setTimeout(() => {
                    this.adManager.showBanner('bottom');
                }, 1000);
            }
        };
        
        // Скрываем баннер при входе в игру
        const hideMenuBanner = () => {
            this.adManager.hideBanner();
        };
        
        // Подписываемся на события UI
        document.addEventListener('screenChanged', (e) => {
            if (e.detail.screen === 'main-menu') {
                showMenuBanner();
            } else {
                hideMenuBanner();
            }
        });
        
        // Показываем баннер при первой загрузке
        showMenuBanner();
    }
    
    // Настроить интеграцию звуков
    setupSoundIntegration() {
        if (!this.soundManager) return;
        
        // Добавляем звуковые эффекты к кнопкам
        document.querySelectorAll('.menu-btn, .icon-btn, .modal-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.soundManager.playSound('button');
            });
        });
    }
    
    // Настроить обработчики событий игры
    setupGameEventHandlers() {
        // Создаем кастомные события для интеграции компонентов
        
        // Событие размещения блока
        document.addEventListener('blockPlaced', (e) => {
            if (this.soundManager) {
                this.soundManager.playSound('place');
            }
            
            if (this.uiManager) {
                this.uiManager.vibrate(50);
            }
        });
        
        // Событие очистки линии
        document.addEventListener('lineCleared', (e) => {
            if (this.soundManager) {
                this.soundManager.playSound('lineClear');
            }
            
            if (this.uiManager) {
                this.uiManager.vibrate([100, 50, 100]);
                
                // Создаем эффект частиц
                const canvas = document.getElementById('game-board');
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    this.uiManager.createParticleEffect(centerX, centerY, '#FFD700', 15);
                }
            }
        });
        
        // Событие комбо
        document.addEventListener('comboAchieved', (e) => {
            if (this.soundManager) {
                this.soundManager.playSound('combo');
            }
            
            if (this.uiManager) {
                this.uiManager.vibrate([100, 50, 100, 50, 100]);
            }
        });
        
        // Событие повышения уровня
        document.addEventListener('levelUp', (e) => {
            if (this.soundManager) {
                this.soundManager.playSound('levelUp');
            }
            
            if (this.uiManager) {
                this.uiManager.vibrate([200, 100, 200]);
                this.uiManager.showNotification(`Уровень ${e.detail.level}!`, 'success');
            }
            
            // Показываем рекламу каждые 5 уровней
            if (this.adManager && e.detail.level % 5 === 0) {
                this.adManager.showInterstitial();
            }
        });
        
        // Событие окончания игры
        document.addEventListener('gameOver', (e) => {
            if (this.soundManager) {
                this.soundManager.playSound('gameOver');
                this.soundManager.stopBackgroundMusic();
            }
            
            if (this.uiManager) {
                this.uiManager.vibrate([300, 200, 300, 200, 300]);
            }
            
            // Показываем межстраничную рекламу
            if (this.adManager) {
                setTimeout(() => {
                    this.adManager.showInterstitial(() => {
                        console.log('Game over ad completed');
                    });
                }, 2000);
            }
        });
        
        // Событие ошибки размещения блока
        document.addEventListener('placementError', (e) => {
            if (this.soundManager) {
                this.soundManager.playSound('error');
            }
            
            if (this.uiManager) {
                this.uiManager.vibrate(200);
            }
        });
        
        // Событие начала игры
        document.addEventListener('gameStarted', (e) => {
            if (this.soundManager) {
                this.soundManager.startBackgroundMusic();
            }
        });
        
        // Событие паузы игры
        document.addEventListener('gamePaused', (e) => {
            if (this.soundManager) {
                if (e.detail.paused) {
                    this.soundManager.stopBackgroundMusic();
                } else {
                    this.soundManager.startBackgroundMusic();
                }
            }
        });
    }
    
    // Запустить фоновую музыку
    startBackgroundMusic() {
        if (this.soundManager && this.uiManager.currentScreen === 'main-menu') {
            // Запускаем музыку с задержкой, чтобы пользователь мог взаимодействовать с страницей
            setTimeout(() => {
                this.soundManager.startBackgroundMusic();
            }, 2000);
        }
    }
    
    // Показать сообщение об ошибке
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h2>Ошибка</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="menu-btn">Перезагрузить</button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            text-align: center;
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    // Получить статистику игры
    getGameStats() {
        const bestScore = localStorage.getItem('blockBlastBestScore') || 0;
        const gamesPlayed = localStorage.getItem('blockBlastGamesPlayed') || 0;
        const totalScore = localStorage.getItem('blockBlastTotalScore') || 0;
        
        return {
            bestScore: parseInt(bestScore),
            gamesPlayed: parseInt(gamesPlayed),
            totalScore: parseInt(totalScore),
            averageScore: gamesPlayed > 0 ? Math.floor(totalScore / gamesPlayed) : 0
        };
    }
    
    // Сохранить статистику игры
    saveGameStats(score) {
        const currentBest = parseInt(localStorage.getItem('blockBlastBestScore') || 0);
        const gamesPlayed = parseInt(localStorage.getItem('blockBlastGamesPlayed') || 0);
        const totalScore = parseInt(localStorage.getItem('blockBlastTotalScore') || 0);
        
        if (score > currentBest) {
            localStorage.setItem('blockBlastBestScore', score);
        }
        
        localStorage.setItem('blockBlastGamesPlayed', gamesPlayed + 1);
        localStorage.setItem('blockBlastTotalScore', totalScore + score);
    }
    
    // Сбросить статистику
    resetStats() {
        localStorage.removeItem('blockBlastBestScore');
        localStorage.removeItem('blockBlastGamesPlayed');
        localStorage.removeItem('blockBlastTotalScore');
        
        if (this.uiManager) {
            this.uiManager.loadBestScore();
            this.uiManager.showNotification('Статистика сброшена', 'success');
        }
    }
    
    // Экспортировать сохранение
    exportSave() {
        const saveData = {
            bestScore: localStorage.getItem('blockBlastBestScore'),
            gamesPlayed: localStorage.getItem('blockBlastGamesPlayed'),
            totalScore: localStorage.getItem('blockBlastTotalScore'),
            soundEnabled: localStorage.getItem('soundEnabled'),
            musicEnabled: localStorage.getItem('musicEnabled'),
            vibrationEnabled: localStorage.getItem('vibrationEnabled'),
            timestamp: Date.now()
        };
        
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `block-blast-save-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
    
    // Импортировать сохранение
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Восстанавливаем данные
                    Object.keys(saveData).forEach(key => {
                        if (key !== 'timestamp' && saveData[key] !== null) {
                            localStorage.setItem(key, saveData[key]);
                        }
                    });
                    
                    // Обновляем UI
                    if (this.uiManager) {
                        this.uiManager.loadBestScore();
                    }
                    
                    if (this.soundManager) {
                        this.soundManager.loadSettings();
                    }
                    
                    resolve(saveData);
                } catch (error) {
                    reject(new Error('Неверный формат файла сохранения'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Ошибка чтения файла'));
            };
            
            reader.readAsText(file);
        });
    }
}

// Расширяем игровую логику для интеграции с событиями
if (typeof BlockBlastGame !== 'undefined') {
    const originalTryPlaceBlock = BlockBlastGame.prototype.tryPlaceBlock;
    BlockBlastGame.prototype.tryPlaceBlock = function(blockIndex, gridX, gridY) {
        const result = originalTryPlaceBlock.call(this, blockIndex, gridX, gridY);
        
        if (result) {
            // Отправляем событие успешного размещения
            document.dispatchEvent(new CustomEvent('blockPlaced', {
                detail: { blockIndex, gridX, gridY, score: this.score }
            }));
            
            // Сохраняем статистику
            if (window.app) {
                window.app.saveGameStats(this.score);
            }
        } else {
            // Отправляем событие ошибки размещения
            document.dispatchEvent(new CustomEvent('placementError', {
                detail: { blockIndex, gridX, gridY }
            }));
        }
        
        return result;
    };
    
    const originalClearLines = BlockBlastGame.prototype.clearLines;
    BlockBlastGame.prototype.clearLines = function(lines) {
        originalClearLines.call(this, lines);
        
        // Отправляем событие очистки линий
        document.dispatchEvent(new CustomEvent('lineCleared', {
            detail: { lines, score: this.score, combo: this.combo }
        }));
        
        // Проверяем комбо
        if (this.combo > 1.5) {
            document.dispatchEvent(new CustomEvent('comboAchieved', {
                detail: { combo: this.combo, score: this.score }
            }));
        }
    };
    
    const originalCheckLevelUp = BlockBlastGame.prototype.checkLevelUp;
    BlockBlastGame.prototype.checkLevelUp = function() {
        const oldLevel = this.level;
        originalCheckLevelUp.call(this);
        
        if (this.level > oldLevel) {
            document.dispatchEvent(new CustomEvent('levelUp', {
                detail: { level: this.level, score: this.score }
            }));
        }
    };
    
    const originalGameOver = BlockBlastGame.prototype.gameOver;
    BlockBlastGame.prototype.gameOver = function() {
        originalGameOver.call(this);
        
        document.dispatchEvent(new CustomEvent('gameOver', {
            detail: { score: this.score, level: this.level, linesCleared: this.linesCleared }
        }));
    };
    
    const originalTogglePause = BlockBlastGame.prototype.togglePause;
    BlockBlastGame.prototype.togglePause = function() {
        const wasPaused = this.isPaused;
        originalTogglePause.call(this);
        
        document.dispatchEvent(new CustomEvent('gamePaused', {
            detail: { paused: this.isPaused, wasPaused }
        }));
    };
}

// Инициализируем приложение
window.app = new BlockBlastApp();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlockBlastApp;
}