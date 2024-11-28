chrome.runtime.onInstalled.addListener(() => {
    console.log("FocusedFind installed.");
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.includes("google.com/search")) {
        console.log(`Search detected in tab ${tabId} (${tab.url})`);

        try {
            const keywords = await getTabKeywords(tabId); // Pass the current tab ID
            console.log("Extracted keywords from other tabs:", keywords);

            // Save the keywords in session storage
            await saveKeywordsToSessionStorage(keywords);

            // Notify popup or content script about the update
            chrome.runtime.sendMessage({ action: "updateKeywords", keywords });
            chrome.tabs.sendMessage(tabId, { action: "filterSearchResults", keywords });
        } catch (error) {
            console.error("Error fetching keywords or sending message:", error);
        }
    }
});

// Function to get keywords from all tabs except the current one
async function getTabKeywords(currentTabId) {
    const tabs = await chrome.tabs.query({}); // Get all open tabs
    let keywords = [];
    
    for (let tab of tabs) {
        // Skip the current tab
        if (tab.id === currentTabId || !tab.url || !tab.url.startsWith("http")) {
            continue;
        }

        try {
            const tabContent = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText, // Extract visible text
            });

            // Check if we successfully got content from the tab
            if (tabContent[0]?.result) {
                // Add keywords (limit to 50 per tab)
                keywords.push(...tabContent[0].result.split(/\s+/).slice(0, 50));
            }
        } catch (error) {
            console.error(`Error processing tab ${tab.id}:`, error);
        }
    }

    return keywords;
}

// Save keywords to session storage
async function saveKeywordsToSessionStorage(keywords) {
    try {
        // Fetch existing keywords from session storage
        const result = await chrome.storage.session.get("keywords");
        const existingKeywords = result.keywords || [];

        // Merge the new keywords with existing ones (avoiding duplicates)
        const updatedKeywords = [...new Set([...existingKeywords, ...keywords])];

        // Save the updated keywords back to session storage
        await chrome.storage.session.set({ keywords: updatedKeywords });

        console.log("Keywords saved to session storage:", updatedKeywords);
    } catch (error) {
        console.error("Error saving keywords to session storage:", error);
    }
}

// Retrieve keywords from session storage
async function getKeywordsFromSessionStorage() {
    try {
        const result = await chrome.storage.session.get("keywords");
        return result.keywords || [];
    } catch (error) {
        console.error("Error retrieving keywords from session storage:", error);
        return [];
    }
}
