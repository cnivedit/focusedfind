importScripts('scripts/autofill_assistant.js', 'scripts/keyword_extractor.js');

chrome.runtime.onInstalled.addListener(() => {
    console.log("FocusedFind installed.");
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

chrome.runtime.onMessage.addListener(async (message, sender, senderResponse) => {
    if (message.action === "userSearchQuery") {
        const suggestions = await queryLLM(message);
        console.log("received sugg: " + suggestions);
        chrome.tabs.sendMessage(sender.tab.id, {action: "displaySuggestions", suggestions: suggestions})
    }
});