/**
 * De-obfuscated Game SDK Loader
 * Site-lock and Host-validation removed.
 */

let hostIndex = 1;
let listApiHosts = ['https://api.azgames.io/', 'https://api.1games.io/'];
let apiHost = listApiHosts[hostIndex - 1];

// Configuration Setup
config['gdHost'] = isHostOnGDSDK();
window['GMDEBUG'] = {};
window['GMDEBUG']['LOADED SDK'] = Date.now();
window['GMSOFT_OPTIONS'] = config;

// Default Settings
window['GMSOFT_OPTIONS']['enable_ads'] = false;
window['GMSOFT_OPTIONS']['enableAds'] = false;
window['GMSOFT_OPTIONS']['pub_id'] = '';
window['GMSOFT_OPTIONS']['unlockTimer'] = 60;
window['GMSOFT_OPTIONS']['timeShowInter'] = 60;
window['GMSOFT_OPTIONS']['domainHost'] = window.location.hostname;
window['GMSOFT_OPTIONS']['debug_mode'] = 'no';
window['GMSOFT_OPTIONS']['timeShowReward'] = 5;
window['GMSOFT_OPTIONS']['adsDebug'] = true;
window['GMSOFT_OPTIONS']['promotion'] = null;
window['GMSOFT_OPTIONS']['allow_play'] = 'no';

let gameId = window['GMSOFT_OPTIONS']['gameId'];

/**
 * Main Initialization function
 * Fetches game configuration from the API
 */
function initSDK() {
    let now = new Date();
    let timestamp = now.getTime() + now.getTimezoneOffset() * 60000;
    let currentHostname = window.location.hostname;

    let apiUrl = apiHost + 'ajax/infov3';
    let isDifferentHost = false; // Forced to false to bypass site-lock

    let gdHostFlag = config['gdHost'] ? 1 : 0;
    
    // Construct data string for API
    let queryData = 'd=' + currentHostname + '&gid=' + gameId + '&ie=' + window.location.hostname + '&ts=' + timestamp + '&gdh=' + 'no' + '&hn=' + gdHostFlag;
    let encodedData = btoa(queryData);
    let fullRequestUrl = apiUrl + '?params=' + encodedData;

    // Fetch config from server
    let responseText = httpGet(fullRequestUrl);
    const apiResponse = JSON.parse(responseText);

    window['GMDEBUG']['LOADED_SDK_SUCCESS'] = Date.now();
    window['responseText'] = responseText;
    window['GMDEBUG']['site_info'] = apiResponse;

    // Apply API settings to local config
    if (typeof apiResponse['enable_ads'] !== 'undefined' && apiResponse['enable_ads'] !== '') {
        window['GMSOFT_OPTIONS']['enable_ads'] = (apiResponse['enable_ads'] == 'yes');
    }

    if (typeof apiResponse['debug_mode'] !== 'undefined') {
        if (apiResponse['debug_mode'] == 'yes') {
            window['GMSOFT_OPTIONS']['adsDebug'] = 'yes';
        } else {
            window['GMSOFT_OPTIONS']['adsDebug'] = 'no';
            // Disable console logging if debug is off
            console.log = function() {};
            console.warn = function() {};
            console.error = function() {};
            alert = function() {};
        }
    }

    if (typeof apiResponse['unlock_time'] !== 'undefined') {
        window['GMSOFT_OPTIONS']['unlockTimer'] = apiResponse['unlock_time'];
    }

    // Force allow_play to 'yes' to prevent overlay locks
    window['GMSOFT_OPTIONS']['allow_play'] = 'yes';

    console.log("SDK Initialized - Site Lock Bypassed");
    
    // Notify the game that the SDK is ready
    document.dispatchEvent(new CustomEvent('gmsoftSdkReady'));
}

/**
 * Helper: Synchronous GET Request
 */
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); 
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

/**
 * Helper: Checks if hosted on GameDistribution
 */
function isHostOnGDSDK() {
    let parts = window.location.hostname.split('.');
    let domain = parts.slice(-2).join('.');
    return domain == 'gamedistribution.com';
}

// Start the process
initSDK();

/**
 * Ad Integration Logic
 */
if (window['GMSOFT_OPTIONS']['enable_ads'] === true) {
    if (window['GMSOFT_OPTIONS']['sdkType'] == 'h5') {
        window['GMDEBUG']['ADS'] = 'H5 SDK integration.';
        var script = document.createElement('script');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('data-ad-frequency-hint', '30s');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + window['GMSOFT_OPTIONS']['pub_id'];
        document.head.appendChild(script);
        
        window['adsbygoogle'] = window['adsbygoogle'] || [];
        var afg = {
            adBreak: function(o) { adsbygoogle.push(o); },
            ready: false
        };
        window['afg'] = afg;
    }
}
