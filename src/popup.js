document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const statusDiv = document.getElementById('status');

    // Default to true if not set
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== false;
        toggle.checked = isEnabled;
        updateStatus(isEnabled);
    });

    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ enabled: isEnabled }, () => {
            updateStatus(isEnabled);
        });
    });

    function updateStatus(isEnabled) {
        if (isEnabled) {
            statusDiv.textContent = 'Active';
            statusDiv.classList.add('active');
        } else {
            statusDiv.textContent = 'Inactive';
            statusDiv.classList.remove('active');
        }
    }
});
