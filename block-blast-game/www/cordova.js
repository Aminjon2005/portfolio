// Cordova.js stub for browser testing
// This is a placeholder file for testing in browser
// The real cordova.js is injected by Cordova during build

console.log('Cordova.js stub loaded - for browser testing only');

// Mock cordova object for browser testing
if (typeof cordova === 'undefined') {
    window.cordova = {
        version: '12.0.0-dev',
        platformId: 'browser'
    };
}

// Mock device object for browser testing
if (typeof device === 'undefined') {
    window.device = {
        platform: 'Browser',
        version: '1.0.0',
        uuid: 'browser-test-device',
        model: 'Browser',
        manufacturer: 'Browser'
    };
}

// Dispatch deviceready event for browser testing
setTimeout(function() {
    const event = new Event('deviceready');
    document.dispatchEvent(event);
    console.log('deviceready event dispatched (browser mode)');
}, 100);
