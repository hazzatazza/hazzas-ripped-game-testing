(function() {
    // 1. Force the SDK options to 'yes' so the game thinks it's allowed
    window['GMSOFT_OPTIONS'] = window['GMSOFT_OPTIONS'] || {};
    window['GMSOFT_OPTIONS']['allow_play'] = 'yes';
    window['GMSOFT_OPTIONS']['allow_host'] = 'yes';

    // 2. The "Nuclear" function to remove the overlay elements
    const removeSplash = () => {
        // IDs and Classes found in the obfuscated source 
        const selectors = [
            '#gamePlayermw1jclueedb9wbbpdztq', 
            '.gamePlayerSplash', 
            '.gamePlayerLoadingAnim',
            '#theGameBox > div' 
        ];

        selectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                console.log('Removing splash element:', selector);
                el.remove();
            }
        });

        // Restore body visibility if the CSS hid it
        document.body.style.overflow = 'auto';
        document.body.style.visibility = 'visible';
    };

    // Run immediately and then every 100ms for 3 seconds to catch late injections
    removeSplash();
    let checkCount = 0;
    const interval = setInterval(() => {
        removeSplash();
        checkCount++;
        if (checkCount > 30) clearInterval(interval);
    }, 100);

    // 3. Fake the "Ready" event so the game starts 
    document.dispatchEvent(new CustomEvent('gmsoftSdkReady'));
    console.log("Brain lines engaged: Splash screen suppressed.");
})();
