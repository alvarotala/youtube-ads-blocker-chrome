console.log("YouTube Ad Blocker: Content script loaded.");

function skipVideoAds() {
    // Check if we are in an ad state
    const player = document.querySelector('.html5-video-player');
    if (player && player.classList.contains('ad-showing')) {
        const video = document.querySelector('video');
        if (video) {
            // Mute and speed up to skip unskippable ads
            video.muted = true;
            video.playbackRate = 16.0;
        }

        // Click the skip button if available
        const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
        if (skipButton) {
            skipButton.click();
            console.log("YouTube Ad Blocker: Skipped ad.");
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
        'ytd-banner-promo-renderer'
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
setInterval(checkAds, 1000);

