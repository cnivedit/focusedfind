chrome.runtime.onInstalled.addListener(() => {
    console.log("FocusedFind installed.");
  });
  
  // Function to get keywords from open tabs
  async function getTabKeywords() {
    const tabs = await chrome.tabs.query({}); // Get all open tabs
    let keywords = [];
    for (let tab of tabs) {
      if (tab.url && tab.url.startsWith("http")) {
        const tabContent = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => document.body.innerText // Extract visible text
        });
        if (tabContent[0]?.result) {
          keywords.push(...tabContent[0].result.split(/\s+/).slice(0, 50)); // Limit to 50 words per tab
        }
      }
    }
    return keywords;
  }
  