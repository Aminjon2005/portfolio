/**
 * Appodeal Integration для Block Blast Game
 * Этот файл содержит интеграцию с Appodeal SDK для показа рекламы
 */

class AppodealManager {
    constructor() {
        this.isInitialized = false;
        this.adLoaded = false;
        this.appodealKey = 'YOUR_APPODEAL_APP_KEY'; // Замените на ваш ключ Appodeal
        this.init();
    }

    /**
     * Инициализация Appodeal SDK
     */
    init() {
        try {
            // Проверяем, загружен ли Appodeal SDK
            if (typeof Appodeal !== 'undefined') {
                this.initializeAppodeal();
            } else {
                // Если SDK не загружен, загружаем его
                this.loadAppodealSDK();
            }
        } catch (error) {
            console.error('Ошибка инициализации Appodeal:', error);
            this.showFallbackAd();
        }
    }

    /**
     * Загрузка Appodeal SDK
     */
    loadAppodealSDK() {
        const script = document.createElement('script');
        script.src = 'https://s3-us-west-2.amazonaws.com/appodeal-js-sdk/2.0.0/appodeal.min.js';
        script.onload = () => {
            this.initializeAppodeal();
        };
        script.onerror = () => {
            console.error('Не удалось загрузить Appodeal SDK');
            this.showFallbackAd();
        };
        document.head.appendChild(script);
    }

    /**
     * Инициализация Appodeal с настройками
     */
    initializeAppodeal() {
        try {
            // Настройки Appodeal
            const appodealSettings = {
                appKey: this.appodealKey,
                adTypes: ['interstitial', 'banner', 'rewarded'],
                testMode: true, // Установите false для продакшена
                onInitializationFinished: (errors) => {
                    if (errors && errors.length > 0) {
                        console.error('Ошибки инициализации Appodeal:', errors);
                        this.showFallbackAd();
                    } else {
                        console.log('Appodeal успешно инициализирован');
                        this.isInitialized = true;
                        this.preloadAds();
                    }
                }
            };

            // Инициализация
            Appodeal.initialize(appodealSettings);

            // Настройка коллбэков
            this.setupCallbacks();

        } catch (error) {
            console.error('Ошибка при инициализации Appodeal:', error);
            this.showFallbackAd();
        }
    }

    /**
     * Настройка коллбэков для рекламы
     */
    setupCallbacks() {
        // Коллбэк для загрузки межстраничной рекламы
        Appodeal.setInterstitialCallbacks({
            onLoaded: () => {
                console.log('Межстраничная реклама загружена');
                this.adLoaded = true;
            },
            onFailedToLoad: (error) => {
                console.error('Ошибка загрузки межстраничной рекламы:', error);
                this.showFallbackAd();
            },
            onShown: () => {
                console.log('Межстраничная реклама показана');
            },
            onClosed: () => {
                console.log('Межстраничная реклама закрыта');
                this.adLoaded = false;
                this.preloadAds(); // Предзагружаем следующую рекламу
            },
            onClicked: () => {
                console.log('Пользователь кликнул по рекламе');
            }
        });

        // Коллбэк для наградной рекламы
        Appodeal.setRewardedVideoCallbacks({
            onLoaded: () => {
                console.log('Наградная реклама загружена');
            },
            onFailedToLoad: (error) => {
                console.error('Ошибка загрузки наградной рекламы:', error);
            },
            onShown: () => {
                console.log('Наградная реклама показана');
            },
            onClosed: (finished) => {
                console.log('Наградная реклама закрыта, завершена:', finished);
                if (finished) {
                    this.giveReward();
                }
            },
            onRewarded: (amount, currency) => {
                console.log('Пользователь получил награду:', amount, currency);
                this.giveReward();
            }
        });

        // Коллбэк для баннерной рекламы
        Appodeal.setBannerCallbacks({
            onLoaded: () => {
                console.log('Баннерная реклама загружена');
            },
            onFailedToLoad: (error) => {
                console.error('Ошибка загрузки баннерной рекламы:', error);
            },
            onShown: () => {
                console.log('Баннерная реклама показана');
            },
            onClicked: () => {
                console.log('Пользователь кликнул по баннеру');
            }
        });
    }

    /**
     * Предзагрузка рекламы
     */
    preloadAds() {
        if (this.isInitialized) {
            try {
                Appodeal.cache('interstitial');
                Appodeal.cache('rewarded');
            } catch (error) {
                console.error('Ошибка предзагрузки рекламы:', error);
            }
        }
    }

    /**
     * Показ межстраничной рекламы
     */
    showInterstitialAd() {
        if (this.isInitialized && this.adLoaded) {
            try {
                Appodeal.show('interstitial');
                return true;
            } catch (error) {
                console.error('Ошибка показа межстраничной рекламы:', error);
                this.showFallbackAd();
                return false;
            }
        } else {
            console.log('Реклама не загружена, показываем заглушку');
            this.showFallbackAd();
            return false;
        }
    }

    /**
     * Показ наградной рекламы
     */
    showRewardedAd() {
        if (this.isInitialized) {
            try {
                Appodeal.show('rewarded');
                return true;
            } catch (error) {
                console.error('Ошибка показа наградной рекламы:', error);
                this.showFallbackAd();
                return false;
            }
        } else {
            this.showFallbackAd();
            return false;
        }
    }

    /**
     * Показ баннерной рекламы
     */
    showBannerAd(containerId) {
        if (this.isInitialized) {
            try {
                Appodeal.show('banner', containerId);
                return true;
            } catch (error) {
                console.error('Ошибка показа баннерной рекламы:', error);
                this.showFallbackBanner(containerId);
                return false;
            }
        } else {
            this.showFallbackBanner(containerId);
            return false;
        }
    }

    /**
     * Скрытие баннерной рекламы
     */
    hideBannerAd() {
        try {
            Appodeal.hide('banner');
        } catch (error) {
            console.error('Ошибка скрытия баннерной рекламы:', error);
        }
    }

    /**
     * Показ заглушки рекламы
     */
    showFallbackAd() {
        const adContainer = document.getElementById('ad-container');
        if (adContainer) {
            adContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>🎯 Реклама Appodeal</h3>
                    <p>Здесь будет показана реклама</p>
                    <button onclick="appodealManager.showInterstitialAd()" 
                            style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Показать рекламу
                    </button>
                </div>
            `;
            adContainer.style.background = '#e3f2fd';
            adContainer.style.color = '#1976d2';
            adContainer.style.border = '2px dashed #1976d2';
        }
    }

    /**
     * Показ заглушки баннерной рекламы
     */
    showFallbackBanner(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <small>Баннерная реклама Appodeal</small>
                </div>
            `;
        }
    }

    /**
     * Выдача награды пользователю
     */
    giveReward() {
        // Здесь можно добавить логику выдачи награды
        console.log('Выдаем награду пользователю');
        
        // Пример: дополнительные очки или бонусы
        if (typeof window.gameInstance !== 'undefined') {
            window.gameInstance.addBonusPoints(100);
        }
        
        // Показываем уведомление
        this.showRewardNotification();
    }

    /**
     * Показ уведомления о награде
     */
    showRewardNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = '🎉 Получен бонус +100 очков!';
        
        document.body.appendChild(notification);
        
        // Автоматически убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Проверка готовности рекламы
     */
    isAdReady() {
        return this.isInitialized && this.adLoaded;
    }

    /**
     * Получение статистики рекламы
     */
    getAdStats() {
        return {
            initialized: this.isInitialized,
            adLoaded: this.adLoaded,
            timestamp: new Date().toISOString()
        };
    }
}

// Создаем глобальный экземпляр менеджера рекламы
window.appodealManager = new AppodealManager();

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);