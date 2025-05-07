if (typeof isFirefox === 'undefined') {
    let isFirefox = typeof browser !== 'undefined';
    let browserAPI = isFirefox ? browser : chrome;
}

if (!isFirefox && browserAPI.sidePanel) {
    browserAPI.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}

// Helper function to send messages with browser compatibility
const sendTabMessage = (message) => {
    browserAPI.runtime.sendMessage(message, (response) => {
        if (browserAPI.runtime.lastError) {
            console.log('No receiver for the message or error occurred:', browserAPI.runtime.lastError);
        }
    });
}

// 1. Handle tab activation
browserAPI.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await browserAPI.tabs.get(activeInfo.tabId);
        if (tab.url) {
            sendTabMessage({ type: 'TAB_SWITCH', url: tab.url });
        }
    } catch (error) {
        console.error('Error getting tab info or sending message:', error);
    }
});