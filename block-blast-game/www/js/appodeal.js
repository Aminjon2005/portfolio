/**
 * Appodeal Integration for Block Blast Game
 * This file handles all Appodeal ad integrations
 */

const AppodealConfig = {
    // Replace with your actual Appodeal App Keys
    APP_KEY_ANDROID: 'YOUR_ANDROID_APP_KEY_HERE',
    APP_KEY_IOS: 'YOUR_IOS_APP_KEY_HERE',
    
    // Ad types
    INTERSTITIAL: 'interstitial',
    REWARDED_VIDEO: 'rewarded_video',
    BANNER: 'banner',
    
    // Testing mode - set to false for production
    TESTING: true
};

class AppodealManager {
    constructor() {
        this.initialized = false;
        this.adsEnabled = true;
    }

    /**
     * Initialize Appodeal SDK
     * Call this when the app starts (deviceready event in Cordova)
     */
    initialize() {
        if (typeof Appodeal === 'undefined') {
            console.log('Appodeal SDK not available - running in web mode');
            return;
        }

        try {
            // Get the appropriate app key based on platform
            const appKey = this.getAppKey();
            
            // Set testing mode
            if (AppodealConfig.TESTING) {
                Appodeal.setTesting(true);
                Appodeal.setLogLevel(Appodeal.LogLevel.verbose);
            }

            // Configure ad types
            const adTypes = Appodeal.INTERSTITIAL | Appodeal.BANNER | Appodeal.REWARDED_VIDEO;

            // Set callbacks
            this.setupCallbacks();

            // Initialize Appodeal
            Appodeal.initialize(appKey, adTypes);

            // Set auto-cache for interstitials and rewarded videos
            Appodeal.setAutoCache(Appodeal.INTERSTITIAL, true);
            Appodeal.setAutoCache(Appodeal.REWARDED_VIDEO, true);

            // Show banner at the bottom
            Appodeal.show(Appodeal.BANNER_BOTTOM);

            this.initialized = true;
            console.log('Appodeal initialized successfully');

        } catch (error) {
            console.error('Error initializing Appodeal:', error);
        }
    }

    /**
     * Get appropriate app key based on device platform
     */
    getAppKey() {
        if (typeof device !== 'undefined') {
            if (device.platform === 'Android') {
                return AppodealConfig.APP_KEY_ANDROID;
            } else if (device.platform === 'iOS') {
                return AppodealConfig.APP_KEY_IOS;
            }
        }
        return AppodealConfig.APP_KEY_ANDROID; // Default
    }

    /**
     * Setup Appodeal event callbacks
     */
    setupCallbacks() {
        // Interstitial callbacks
        Appodeal.setInterstitialCallbacks({
            onLoaded: (isPrecache) => {
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
            },
            onClick: () => {
                console.log('Interstitial ad clicked');
            }
        });

        // Rewarded video callbacks
        Appodeal.setRewardedVideoCallbacks({
            onLoaded: (isPrecache) => {
                console.log('Rewarded video loaded');
            },
            onFailedToLoad: () => {
                console.log('Rewarded video failed to load');
            },
            onShown: () => {
                console.log('Rewarded video shown');
            },
            onFinished: (amount, currency) => {
                console.log('Rewarded video finished:', amount, currency);
                this.onRewardedVideoComplete(amount, currency);
            },
            onClosed: (finished) => {
                console.log('Rewarded video closed:', finished);
            },
            onClick: () => {
                console.log('Rewarded video clicked');
            }
        });

        // Banner callbacks
        Appodeal.setBannerCallbacks({
            onLoaded: (isPrecache) => {
                console.log('Banner ad loaded');
            },
            onFailedToLoad: () => {
                console.log('Banner ad failed to load');
            },
            onShown: () => {
                console.log('Banner ad shown');
            },
            onClick: () => {
                console.log('Banner ad clicked');
            }
        });
    }

    /**
     * Show interstitial ad
     * Used: After completing a set of blocks, on game over
     */
    showInterstitial() {
        if (!this.initialized || !this.adsEnabled) {
            console.log('Ads not initialized or disabled');
            return;
        }

        if (typeof Appodeal !== 'undefined' && Appodeal.isLoaded(Appodeal.INTERSTITIAL)) {
            Appodeal.show(Appodeal.INTERSTITIAL);
        } else {
            console.log('Interstitial ad not ready');
        }
    }

    /**
     * Show rewarded video ad
     * Used: To get bonus points, extra moves, etc.
     */
    showRewardedVideo(callback) {
        if (!this.initialized || !this.adsEnabled) {
            console.log('Ads not initialized or disabled');
            if (callback) callback(false);
            return;
        }

        this.rewardCallback = callback;

        if (typeof Appodeal !== 'undefined' && Appodeal.isLoaded(Appodeal.REWARDED_VIDEO)) {
            Appodeal.show(Appodeal.REWARDED_VIDEO);
        } else {
            console.log('Rewarded video not ready');
            if (callback) callback(false);
        }
    }

    /**
     * Called when rewarded video is complete
     */
    onRewardedVideoComplete(amount, currency) {
        console.log('Reward granted:', amount, currency);
        
        if (this.rewardCallback) {
            this.rewardCallback(true, amount);
            this.rewardCallback = null;
        }

        // You can grant rewards here, like bonus points
        // Example: gameBoard.addScore(100);
    }

    /**
     * Show banner ad
     */
    showBanner() {
        if (!this.initialized || !this.adsEnabled) return;
        
        if (typeof Appodeal !== 'undefined') {
            Appodeal.show(Appodeal.BANNER_BOTTOM);
        }
    }

    /**
     * Hide banner ad
     */
    hideBanner() {
        if (!this.initialized) return;
        
        if (typeof Appodeal !== 'undefined') {
            Appodeal.hide(Appodeal.BANNER);
        }
    }

    /**
     * Check if ad is loaded and ready to show
     */
    isAdReady(adType) {
        if (!this.initialized || typeof Appodeal === 'undefined') {
            return false;
        }

        const appodealType = this.getAppodealAdType(adType);
        return Appodeal.isLoaded(appodealType);
    }

    /**
     * Get Appodeal ad type constant
     */
    getAppodealAdType(adType) {
        switch (adType) {
            case AppodealConfig.INTERSTITIAL:
                return Appodeal.INTERSTITIAL;
            case AppodealConfig.REWARDED_VIDEO:
                return Appodeal.REWARDED_VIDEO;
            case AppodealConfig.BANNER:
                return Appodeal.BANNER;
            default:
                return Appodeal.INTERSTITIAL;
        }
    }

    /**
     * Toggle ads on/off
     */
    toggleAds(enabled) {
        this.adsEnabled = enabled;
        
        if (!enabled) {
            this.hideBanner();
        } else {
            this.showBanner();
        }
    }
}

// Global instance
let appodealManager = null;

// Initialize when device is ready
document.addEventListener('deviceready', function() {
    console.log('Device ready - initializing Appodeal');
    appodealManager = new AppodealManager();
    appodealManager.initialize();
}, false);

// For web testing (when Cordova is not available)
if (typeof cordova === 'undefined') {
    console.log('Running in web mode - Appodeal will not be initialized');
    appodealManager = new AppodealManager();
}
