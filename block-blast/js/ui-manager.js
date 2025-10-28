// Менеджер пользовательского интерфейса
class UIManager {
    constructor() {
        this.currentScreen = 'main-menu';
        this.notifications = [];
        this.modals = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadBestScore();
        this.showScreen('main-menu');
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Главное меню
        document.getElementById('play-btn')?.addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.showScreen('settings-screen');
        });
        
        document.getElementById('leaderboard-btn')?.addEventListener('click', () => {
            this.showLeaderboard();
        });
        
        // Игровые кнопки
        document.getElementById('pause-btn')?.addEventListener('click', () => {
            window.game?.togglePause();
        });
        
        document.getElementById('home-btn')?.addEventListener('click', () => {
            this.showConfirmDialog('Вернуться в главное меню?', () => {
                this.backToMenu();
            });
        });
        
        // Пауза
        document.getElementById('resume-btn')?.addEventListener('click', () => {
            window.game?.togglePause();
        });
        
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('menu-btn')?.addEventListener('click', () => {
            this.backToMenu();
        });
        
        // Game Over
        document.getElementById('play-again-btn')?.addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('share-btn')?.addEventListener('click', () => {
            this.shareScore();
        });
        
        document.getElementById('back-menu-btn')?.addEventListener('click', () => {
            this.backToMenu();
        });
        
        // Настройки
        document.getElementById('settings-back-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('sound-toggle')?.addEventListener('change', (e) => {
            window.soundManager?.toggleSound(e.target.checked);
        });
        
        document.getElementById('music-toggle')?.addEventListener('change', (e) => {
            window.soundManager?.toggleMusic(e.target.checked);
        });
        
        document.getElementById('vibration-toggle')?.addEventListener('change', (e) => {
            this.toggleVibration(e.target.checked);
        });
        
        // Клавиатурные сокращения
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Обработка видимости страницы
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && window.game && !window.game.isPaused && !window.game.isGameOver) {
                window.game.togglePause();
            }
        });
    }
    
    // Показать экран
    showScreen(screenId) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Добавляем анимацию появления
            targetScreen.classList.add('fade-in');
            setTimeout(() => {
                targetScreen.classList.remove('fade-in');
            }, 500);
        }
    }
    
    // Начать игру
    startGame() {
        this.showScreen('game-screen');
        
        // Инициализируем игру если еще не создана
        if (!window.game) {
            window.game = new BlockBlastGame('game-board');
        } else {
            window.game.restart();
        }
        
        // Скрываем баннер если показан
        window.adManager?.hideBanner();
    }
    
    // Перезапустить игру
    restartGame() {
        if (window.game) {
            window.game.restart();
        }
        
        this.showScreen('game-screen');
        
        // Показываем рекламу перед началом новой игры (иногда)
        if (Math.random() < 0.3 && window.adManager) {
            window.adManager.showInterstitial();
        }
    }
    
    // Вернуться в меню
    backToMenu() {
        this.showScreen('main-menu');
        
        // Показываем баннер в меню
        setTimeout(() => {
            window.adManager?.showBanner('bottom');
        }, 1000);
    }
    
    // Загрузить лучший результат
    loadBestScore() {
        const bestScore = localStorage.getItem('blockBlastBestScore') || 0;
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            bestScoreElement.textContent = parseInt(bestScore).toLocaleString();
        }
    }
    
    // Показать таблицу лидеров
    showLeaderboard() {
        const bestScore = localStorage.getItem('blockBlastBestScore') || 0;
        
        this.showModal({
            title: 'РЕКОРДЫ',
            content: `
                <div class="leaderboard">
                    <div class="leader-item">
                        <span class="rank">1.</span>
                        <span class="name">Вы</span>
                        <span class="score">${parseInt(bestScore).toLocaleString()}</span>
                    </div>
                </div>
            `,
            buttons: [
                {
                    text: 'ЗАКРЫТЬ',
                    action: () => this.hideModal()
                }
            ]
        });
    }
    
    // Поделиться результатом
    shareScore() {
        const score = window.game?.score || 0;
        const text = `Я набрал ${score.toLocaleString()} очков в Block Blast! Попробуй побить мой рекорд!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Block Blast',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback для браузеров без Web Share API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showNotification('Результат скопирован в буфер обмена!', 'success');
                });
            } else {
                this.showNotification('Ваш результат: ' + score.toLocaleString(), 'success');
            }
        }
        
        // Показываем видео с вознаграждением за шаринг
        window.adManager?.showRewardedVideo((amount, name) => {
            if (amount > 0) {
                this.showNotification('Спасибо за шаринг! +100 очков бонуса!', 'success');
                if (window.game) {
                    window.game.addScore(100);
                }
            }
        });
    }
    
    // Показать уведомление
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Скрываем уведомление
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    
    // Показать модальное окно
    showModal(options) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        
        if (options.title) {
            const title = document.createElement('h3');
            title.className = 'modal-title';
            title.textContent = options.title;
            content.appendChild(title);
        }
        
        if (options.content) {
            const text = document.createElement('div');
            text.className = 'modal-text';
            text.innerHTML = options.content;
            content.appendChild(text);
        }
        
        if (options.buttons) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'modal-buttons';
            
            options.buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.className = `modal-btn ${button.secondary ? 'secondary' : ''}`;
                btn.textContent = button.text;
                btn.addEventListener('click', () => {
                    if (button.action) button.action();
                    this.hideModal();
                });
                buttonsContainer.appendChild(btn);
            });
            
            content.appendChild(buttonsContainer);
        }
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Показываем модальное окно
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // Закрытие по клику на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
        
        this.currentModal = modal;
    }
    
    // Скрыть модальное окно
    hideModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('show');
            setTimeout(() => {
                this.currentModal.remove();
                this.currentModal = null;
            }, 300);
        }
    }
    
    // Показать диалог подтверждения
    showConfirmDialog(message, onConfirm, onCancel = null) {
        this.showModal({
            title: 'ПОДТВЕРЖДЕНИЕ',
            content: message,
            buttons: [
                {
                    text: 'ДА',
                    action: onConfirm
                },
                {
                    text: 'НЕТ',
                    secondary: true,
                    action: onCancel
                }
            ]
        });
    }
    
    // Переключить вибрацию
    toggleVibration(enabled) {
        localStorage.setItem('vibrationEnabled', enabled);
        
        if (enabled && 'vibrate' in navigator) {
            navigator.vibrate(100); // Тестовая вибрация
        }
    }
    
    // Вибрация
    vibrate(pattern = 100) {
        const enabled = localStorage.getItem('vibrationEnabled') !== 'false';
        
        if (enabled && 'vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
    
    // Обработка нажатий клавиш
    handleKeyPress(e) {
        switch (e.code) {
            case 'Escape':
                if (this.currentScreen === 'game-screen' && window.game && !window.game.isGameOver) {
                    window.game.togglePause();
                } else if (this.currentModal) {
                    this.hideModal();
                }
                break;
                
            case 'Space':
                if (this.currentScreen === 'main-menu') {
                    e.preventDefault();
                    this.startGame();
                } else if (this.currentScreen === 'game-screen' && window.game?.isPaused) {
                    e.preventDefault();
                    window.game.togglePause();
                }
                break;
                
            case 'KeyR':
                if (this.currentScreen === 'game-screen' && window.game?.isGameOver) {
                    e.preventDefault();
                    this.restartGame();
                }
                break;
        }
    }
    
    // Обработка изменения размера окна
    handleResize() {
        // Пересчитываем размеры canvas при изменении размера окна
        if (window.game) {
            const canvas = document.getElementById('game-board');
            if (canvas) {
                const container = canvas.parentElement;
                const size = Math.min(container.clientWidth, container.clientHeight) - 20;
                canvas.width = size;
                canvas.height = size;
                window.game.cellSize = size / window.game.gridSize;
                window.game.render();
            }
        }
    }
    
    // Показать загрузчик
    showLoader() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.classList.add('show');
        }, 100);
        
        this.currentLoader = loader;
    }
    
    // Скрыть загрузчик
    hideLoader() {
        if (this.currentLoader) {
            this.currentLoader.classList.remove('show');
            setTimeout(() => {
                this.currentLoader.remove();
                this.currentLoader = null;
            }, 300);
        }
    }
    
    // Создать эффект частиц
    createParticleEffect(x, y, color = '#FFD700', count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            
            const dx = (Math.random() - 0.5) * 200;
            const dy = (Math.random() - 0.5) * 200;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    // Показать подсказку
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 2000);
    }
}

// Создаем глобальный экземпляр менеджера UI
window.uiManager = new UIManager();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}