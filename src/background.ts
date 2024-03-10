// src/background.ts

import { Messages } from "./messages";

console.log('loading mylo code background script');

/*
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    console.log('history state updated poggers', details);
    chrome.runtime.sendMessage({ type: Messages.HistoryStateUpdated, details });
});

chrome.webNavigation.onCompleted.addListener((details) => {
    console.log('navigation completed', details);
    chrome.runtime.sendMessage({ type: Messages.NavigationCompleted, details });
});
*/