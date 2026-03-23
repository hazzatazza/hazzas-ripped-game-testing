/**
 * BRAIN LINES TOTAL NEUTRALIZER
 * Blocks "ban-game" events and forces site-lock bypass.
 */
(function() {
    // 1. Force the internal config to think everything is perfect
    window['GMSOFT_OPTIONS'] = {
        'gameId': 'brain-lines',
        'allow_play': 'yes',
        'allow_host': 'yes',
        'enable_ads': false,
        'debug_mode': 'no',
        'adsDebug': false,
        'unlockTimer': 0
    };

    // 2. Kill the "Calling Home" (Blocking the Ban-Game requests)
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('ban-game') || url.includes('event.azgame.io')) {
            console.log('Intercepted and blocked ban-game report:', url);
            return; // Don't even send it
        }
        return originalOpen.apply(this, arguments);
    };

    // 3. Bypass the host check function directly
    window.isDiffHost = function() { return false; };
    window.isHostOnGDSDK = function() { return true; };

    // 4. Force delete the splash screen if it exists
    const killElements = () => {
        const ids = ['#gamePlayermw1jclueedb9wbbpdztq', '.gamePlayerSplash', '.gamePlayerLoadingAnim'];
        ids.forEach(id => {
            const el = document.querySelector(id);
            if (el) {
                el.style.display = 'none';
                el.remove();
            }
        });
        document.body.style.overflow = 'auto';
        document.body.style.visibility = 'visible';
    };

    // Run repeatedly to ensure the "ban" overlay can't come back
    setInterval(killElements, 50);

    // 5. Tell the game the SDK is ready so it starts loading levels
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('gmsoftSdkReady'));
        console.log("Bypass active: Game should start now.");
    }, 500);
})();
