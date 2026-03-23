/**
 * FULL DE-OBFUSCATED SDK - BYPASS VERSION
 * Removes site-lock, redirects, and splash screens.
 */

(function() {
    // --- 1. CONFIGURATION & STATE ---
    let hostindex = 1;
    let list_api_host = ['https://api.azgames.io/', 'https://api.1games.io/']; [cite: 1]
    let api_host = list_api_host[hostindex - 1]; [cite: 1]
    
    window['GMSOFT_OPTIONS'] = window['GMSOFT_OPTIONS'] || {};
    let config = window['GMSOFT_OPTIONS'];

    // Force default "Safe" values
    config['allow_play'] = 'yes'; [cite: 1]
    config['allow_host'] = 'yes'; [cite: 1]
    config['debug_mode'] = 'yes'; [cite: 1]
    config['adsDebug'] = true; [cite: 1]
    config['enable_ads'] = false; [cite: 1]

    let _gameId = config['gameId'] || ""; [cite: 1]

    // --- 2. CORE FUNCTIONS ---

    // The original site-lock check: modified to always return false (no lock)
    function isDiffHost() { 
        return false; 
    }

    // Check if on GameDistribution domain
    function isHostOnGDSDK() {
        try {
            let hostParts = window.location.hostname.split('.'); [cite: 1]
            let domain = hostParts.slice(-2).join('.'); [cite: 1]
            return domain === 'gamedistribution.com'; [cite: 1]
        } catch (e) { return false; }
    }

    // Synchronous GET for settings
    function httpGet(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false); [cite: 1]
        xmlHttp.send(null); [cite: 1]
        return xmlHttp.responseText; [cite: 1]
    }

    // Initializer: Fetches remote config but overrides locking mechanisms
    function initSDK() {
        let now = new Date();
        let timestamp = now.getTime() + now.getTimezoneOffset() * 60000; [cite: 1]
        let currentUrl = window.location.href;

        let apiUrl = api_host + 'ajax/infov3'; [cite: 1]
        let gdHostFlag = isHostOnGDSDK() ? 1 : 0; [cite: 1]
        
        // Data string for the API 
        let query = 'd=' + window.location.hostname + '&gid=' + _gameId + '&ts=' + timestamp + '&gdh=no&hn=' + gdHostFlag;
        let encoded = btoa(query); [cite: 1]
        let requestUrl = apiUrl + '?params=' + encoded; [cite: 1]

        try {
            let response = httpGet(requestUrl);
            const data = JSON.parse(response); [cite: 1]

            // Apply API settings while ignoring locks
            if (data['enable_ads']) config['enable_ads'] = (data['enable_ads'] === 'yes'); [cite: 1]
            if (data['pub_id']) config['pub_id'] = data['pub_id']; [cite: 1]
            
            // CRITICAL: Always override these to prevent the splash screen logic from triggering
            config['allow_play'] = 'yes';
            config['allow_host'] = 'yes';
            
        } catch (err) {
            console.warn("SDK Fetch failed, using local bypass defaults.");
        }

        // Trigger the "Ready" event for the game brain
        document.dispatchEvent(new CustomEvent('gmsoftSdkReady')); [cite: 1]
        console.log("SDK Bypass: Ready.");
    }

    // --- 3. THE SPLASH KILLER ---
    // This looks for the specific HTML elements the original code injects 
    function killSplash() {
        const lockElements = [
            '#gamePlayermw1jclueedb9wbbpdztq', 
            '.gamePlayerSplash', 
            '.gamePlayerLoadingAnim',
            '.gamePlayerBg'
        ];
        
        lockElements.forEach(selector => {
            let el = document.querySelector(selector);
            if (el) el.remove();
        });

        // Ensure body stays visible
        document.body.style.overflow = 'auto';
        document.body.style.visibility = 'visible';
    }

    // Run the killer repeatedly to catch late injections
    const killerInterval = setInterval(killSplash, 100);
    setTimeout(() => clearInterval(killerInterval), 5000);

    // --- 4. EXECUTION ---
    initSDK();

})();
