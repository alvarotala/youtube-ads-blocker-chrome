console.log("YouTube Ad Blocker: Content script loaded.");

function skipVideoAds() {
    // Check if we are in an ad state
    const player = document.querySelector('.html5-video-player');

    // More precise ad detection.
    // '.ad-showing' on the player is the most reliable.
    // '.video-ads' exists even when no ads are playing (it's the container), so checking it alone is dangerous.
    // Check if '.video-ads' has 'ad-showing' or specific children.
    const adShowing = player?.classList.contains('ad-showing') || document.querySelector('.ad-showing');

    const video = document.querySelector('video');
    if (!video) return;

    if (adShowing) {
        if (!isNaN(video.duration)) {
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
            '[id^="visit-advertiser"]'
        ];

        // Try to find the button
        let skipButton = null;
        for (const selector of skipButtonSelectors) {
            skipButton = document.querySelector(selector);
            if (skipButton) break;
        }

        if (skipButton) {
            // Simulate a native click event
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            skipButton.dispatchEvent(clickEvent);
            skipButton.click();
            console.log("YouTube Ad Blocker: Skipped ad using selector:", skipButton.className);

            // Re-check immediately
            setTimeout(checkAds, 100);
        }
    } else {
        // IMPORTANT: Reset state if no ad is showing
        if (video.playbackRate === 16.0) {
            video.playbackRate = 1.0;
        }
        // Be careful unmuting, user might have muted the video themselves.
        // Only unmute if we are sure we muted it? Hard to track.
        // For now, let's just assume if it's 16x speed it was us.
        // We'll leave mute state alone for now to avoid annoying the user if they wanted it muted,
        // or we could track if we muted it. Simpler: just reset speed.
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

