// Интеграция с Appodeal
class AppodealManager {
    constructor() {
        this.isInitialized = false;
        this.adTypes = {
            INTERSTITIAL: 'interstitial',
            REWARDED_VIDEO: 'rewarded_video',
            BANNER: 'banner'
        };
        this.callbacks = {
            onRewardedVideoFinished: null,
            onInterstitialClosed: null
        };
        
        this.init();
    }

    init() {
        // Проверяем доступность Appodeal SDK
        if (typeof Appodeal !== 'undefined') {
            try {
                // Инициализация Appodeal
                // ВАЖНО: Замените 'YOUR_APP_KEY' на ваш реальный ключ приложения
                const APP_KEY = 'YOUR_APP_KEY_HERE';
                
                // Настройка типов рекламы
                const adTypes = Appodeal.INTERSTITIAL | Appodeal.REWARDED_VIDEO | Appodeal.BANNER;
                
                // Инициализация SDK
                Appodeal.initialize(APP_KEY, adTypes);
                
                // Настройка колбэков
                this.setupCallbacks();
                
                this.isInitialized = true;
                console.log('Appodeal initialized successfully');
                
                // Предзагрузка рекламы
                this.preloadAds();
                
            } catch (error) {
                console.error('Appodeal initialization error:', error);
                this.isInitialized = false;
            }
        } else {
            console.warn('Appodeal SDK not found. Running in test mode.');
            this.isInitialized = false;
        }
    }

    setupCallbacks() {
        if (!this.isInitialized) return;

        // Колбэки для межстраничной рекламы
        Appodeal.setInterstitialCallbacks({
            onLoaded: () => {
                console.log('Interstitial ad loaded');
            },
            onFailedToLoad: () => {
                console.log('Interstitial ad failed to load');
            },
            onShown: () => {
                console.log('Interstitial ad shown');
            },
            onClosed: () => {
                console.log('Interstitial ad closed');
                if (this.callbacks.onInterstitialClosed) {
                    this.callbacks.onInterstitialClosed();
                }
            }
        });

        // Колбэки для видео с вознаграждением
        Appodeal.setRewardedVideoCallbacks({
            onLoaded: () => {
                console.log('Rewarded video loaded');
            },
            onFailedToLoad: () => {
                console.log('Rewarded video failed to load');
            },
            onShown: () => {
                console.log('Rewarded video shown');
            },
            onFinished: (amount, name) => {
                console.log('Rewarded video finished:', amount, name);
                if (this.callbacks.onRewardedVideoFinished) {
                    this.callbacks.onRewardedVideoFinished(amount, name);
                }
            },
            onClosed: (finished) => {
                console.log('Rewarded video closed:', finished);
            }
        });

        // Колбэки для баннеров
        Appodeal.setBannerCallbacks({
            onLoaded: () => {
                console.log('Banner ad loaded');
            },
            onFailedToLoad: () => {
                console.log('Banner ad failed to load');
            },
            onShown: () => {
                console.log('Banner ad shown');
            }
        });
    }

    preloadAds() {
        if (!this.isInitialized) return;

        try {
            // Предзагрузка межстраничной рекламы
            Appodeal.cache(Appodeal.INTERSTITIAL);
            
            // Предзагрузка видео с вознаграждением
            Appodeal.cache(Appodeal.REWARDED_VIDEO);
            
            console.log('Ads preloading started');
        } catch (error) {
            console.error('Error preloading ads:', error);
        }
    }

    // Показать межстраничную рекламу
    showInterstitial(callback = null) {
        if (callback) {
            this.callbacks.onInterstitialClosed = callback;
        }

        if (this.isInitialized && this.isInterstitialLoaded()) {
            try {
                Appodeal.show(Appodeal.INTERSTITIAL);
                return true;
            } catch (error) {
                console.error('Error showing interstitial:', error);
                if (callback) callback();
                return false;
            }
        } else {
            console.log('Interstitial not available, running callback immediately');
            if (callback) callback();
            return false;
        }
    }

    // Показать видео с вознаграждением
    showRewardedVideo(callback = null) {
        if (callback) {
            this.callbacks.onRewardedVideoFinished = callback;
        }

        if (this.isInitialized && this.isRewardedVideoLoaded()) {
            try {
                Appodeal.show(Appodeal.REWARDED_VIDEO);
                return true;
            } catch (error) {
                console.error('Error showing rewarded video:', error);
                if (callback) callback(0, 'error');
                return false;
            }
        } else {
            console.log('Rewarded video not available');
            if (callback) callback(0, 'not_available');
            return false;
        }
    }

    // Показать баннер
    showBanner(position = 'bottom') {
        if (!this.isInitialized) return false;

        try {
            const bannerPosition = position === 'top' ? Appodeal.BANNER_TOP : Appodeal.BANNER_BOTTOM;
            Appodeal.show(bannerPosition);
            return true;
        } catch (error) {
            console.error('Error showing banner:', error);
            return false;
        }
    }

    // Скрыть баннер
    hideBanner() {
        if (!this.isInitialized) return;

        try {
            Appodeal.hide(Appodeal.BANNER);
        } catch (error) {
            console.error('Error hiding banner:', error);
        }
    }

    // Проверить доступность межстраничной рекламы
    isInterstitialLoaded() {
        if (!this.isInitialized) return false;
        
        try {
            return Appodeal.isLoaded(Appodeal.INTERSTITIAL);
        } catch (error) {
            console.error('Error checking interstitial status:', error);
            return false;
        }
    }

    // Проверить доступность видео с вознаграждением
    isRewardedVideoLoaded() {
        if (!this.isInitialized) return false;
        
        try {
            return Appodeal.isLoaded(Appodeal.REWARDED_VIDEO);
        } catch (error) {
            console.error('Error checking rewarded video status:', error);
            return false;
        }
    }

    // Установить тестовый режим (для разработки)
    setTestMode(enabled = true) {
        if (!this.isInitialized) return;
        
        try {
            Appodeal.setTesting(enabled);
            console.log('Appodeal test mode:', enabled ? 'enabled' : 'disabled');
        } catch (error) {
            console.error('Error setting test mode:', error);
        }
    }

    // Установить детский режим (COPPA)
    setChildDirectedTreatment(enabled = false) {
        if (!this.isInitialized) return;
        
        try {
            Appodeal.setChildDirectedTreatment(enabled);
            console.log('Child directed treatment:', enabled ? 'enabled' : 'disabled');
        } catch (error) {
            console.error('Error setting child directed treatment:', error);
        }
    }

    // Получить статус инициализации
    getInitializationStatus() {
        return this.isInitialized;
    }
}

// Создаем глобальный экземпляр менеджера рекламы
window.adManager = new AppodealManager();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppodealManager;
}