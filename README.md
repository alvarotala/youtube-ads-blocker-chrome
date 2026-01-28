# YouTube Ad Blocker Chrome Extension

A lightweight, transparent Chrome extension designed to block and skip ads on YouTube.

## How It Works

We believe in transparency. This extension uses simple, efficient techniques to improve your viewing experience without heavy resource usage or tracking.

### Video Ads
The extension detects when a video ad is playing by monitoring the video player's state.
1.  **Speed Up**: If an unskippable ad is detected, the playback rate is increased to **16x** and the audio is **muted**. This makes the ad generally pass in less than a second.
2.  **Auto Skip**: If a "Skip Ad" button appears, the extension automatically programmatically clicks it.

### Display Ads
We inject a small CSS stylesheet that hides standard ad containers on the YouTube page (e.g., banner ads, promoted videos in the sidebar).

### Privacy
*   **No Tracking**: This extension does not collect, store, or transmit any user data.
*   **Local Only**: All logic runs locally in your browser.
*   **Permissions**: We only ask for permissions strictly necessary to interact with the YouTube video player (`scripting`, `activeTab`) and to save your preferences (`storage`).

## Installation

Since this extension is not yet in the Chrome Web Store, you can install it manually:

1.  Clone or download this repository.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top right corner).
4.  Click the **Load unpacked** button.
5.  Select the folder containing this project's files (the folder with `manifest.json`).

## Usage

*   **Active Status**: The extension runs automatically on YouTube.
*   **Toggle**: Click the extension icon in your browser toolbar to see the status. You can toggle the blocker **On** or **Off** at any time. A page refresh may be required for changes to take effect.
