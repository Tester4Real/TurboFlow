# TurboFlow

TurboFlow is an unpacked Chrome extension for batch generation workflows on Google Flow.

This repository version is local-only:

- no TurboFlow account sign-in
- no TurboFlow membership or subscription checks
- no TurboFlow backend API calls
- no checkout, payment, or portal integration

The extension uses the Google Flow page that is already open in your browser, so usage is limited by the Google account and Flow access you are signed in with.

## Install

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder.
5. Open Google Flow and use the TurboFlow side panel.

## Permissions

The extension is scoped to `https://labs.google/*` and uses Chrome permissions for the side panel, page scripting, local storage, tabs, downloads, and the active tab.

## Notes

This is the cleaned source for direct GitHub publishing. The extension still contains bundled JavaScript assets from the original build, but the account, membership, checkout, and external TurboFlow server paths have been removed or replaced with local no-op behavior.
