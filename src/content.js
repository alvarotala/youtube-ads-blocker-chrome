console.log("YouTube Ad Blocker: Content script loaded.");

function skipVideoAds() {
    // Check if we are in an ad state
    const player = document.querySelector('.html5-video-player');

    // Broaden ad detection: check for ad container or ad-showing class
    const adShowing = player?.classList.contains('ad-showing') || document.querySelector('.ad-showing') || document.querySelector('.video-ads');

    if (adShowing) {
        const video = document.querySelector('video');
        if (video && !isNaN(video.duration)) {
            // Mute and speed up to skip unskippable ads
            video.muted = true;
            video.playbackRate = 16.0;
        }

        // Expanded list of known skip button selectors
        const skipButtonSelectors = [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-skip-ad-button',
            '.videoAdUiSkipButton',
            '.ytp-ad-text.ytp-ad-skip-button-text',
            '[id^="visit-advertiser"]' // Sometimes the container itself helps identify context
        ];

        // Try to find the button
        let skipButton = null;
        for (const selector of skipButtonSelectors) {
            skipButton = document.querySelector(selector);
            if (skipButton) break;
        }

        if (skipButton) {
            // Simulate a native click event for better compatibility
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            skipButton.dispatchEvent(clickEvent);
            skipButton.click(); // Fallback to standard click
            console.log("YouTube Ad Blocker: Skipped ad using selector:", skipButton.className);

            // Re-check immediately for consecutive ads
            setTimeout(checkAds, 100);
        }
    }
}

function removeDisplayAds() {
    // Specific removal for elements that might slip through CSS
    const adSelectors = [
        '.ytp-ad-overlay-container',
        '.ytp-ad-message-container',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-display-ad-renderer',
        '#masthead-ad',
        'ytd-banner-promo-renderer',
        'ytd-ad-slot-renderer', // Added generic ad slot
        'ytd-in-feed-ad-layout-renderer' // Added feed ad renderer
    ];

    adSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });
}

let isEnabled = true;

function checkAds() {
    if (!isEnabled) return;

    skipVideoAds();
    removeDisplayAds();
}

// Check initial state
chrome.storage.local.get(['enabled'], (result) => {
    isEnabled = result.enabled !== false;
});

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && 'enabled' in changes) {
        isEnabled = changes.enabled.newValue;
    }
});

// Observer to watch for DOM changes (navigation, ads loading)
const observer = new MutationObserver((mutations) => {
    checkAds();
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Also run periodically just in case
setInterval(checkAds, 500);

