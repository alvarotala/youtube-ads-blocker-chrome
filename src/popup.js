document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');

    // Default to true if not set
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== false;
        toggle.checked = isEnabled;
    });

    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ enabled: isEnabled });
    });
});
