importScripts('scripts/autofill_assistant.js');

chrome.runtime.onInstalled.addListener(() => {
    console.log("FocusedFind installed.");
    createSession();
});

chrome.runtime.onMessage.addListener(async (message, sender, senderResponse) => {
    if (message.action == "fetchKeywords") {
        try {
            const keywords = await getTabKeywords();
            console.log("Extracted keywords from other tabs:", keywords);

            await saveKeywordsToSessionStorage(keywords);
        
        } catch (error) {
            console.error("Error fetching keywords: ", error);
        }
    }
});

async function getTabKeywords() {
    const tabs = await chrome.tabs.query({});
    let keywords = [];

    for (let tab of tabs) {
        try {
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

async function saveKeywordsToSessionStorage(keywords) {
    try {
    
        const result = await chrome.storage.session.get("keywords");
        const existingKeywords = result.keywords || [];

        const updatedKeywords = [...new Set([...existingKeywords, ...keywords])];

        await chrome.storage.session.set({ keywords: updatedKeywords });

        console.log("Keywords saved to session storage:", updatedKeywords);
    } catch (error) {
        console.error("Error saving keywords to session storage:", error);
    }
}

async function getKeywordsFromSessionStorage() {
    try {
        const result = await chrome.storage.session.get("keywords");
        return result.keywords || [];
    } catch (error) {
        console.error("Error retrieving keywords from session storage:", error);
        return [];
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, senderResponse) => {
    if (message.action === "userSearchQuery") {
         queryLLM(message);
    }
});