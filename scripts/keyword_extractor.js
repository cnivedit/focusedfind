async function getTabKeywords() {
    const tabs = await chrome.tabs.query({});
    let keywords = [];

    for (let tab of tabs) {
        try {
            if (tab.url.startsWith("chrome://")) {
                continue;
            }
            const tabContent = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText,
            });

            if (tabContent[0]?.result) {
                keywords.push(...tabContent[0].result.split(/\s+/).slice(0, 50));
            }
        } catch (error) {
            console.error(`Error processing tab ${tab.id}:`, error);
        }
    }

    return keywords;
}