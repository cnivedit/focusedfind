chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "filterSearchResults") {
      const keywords = message.keywords;
      const results = document.querySelectorAll("a h3"); // Search result titles (Google-specific)
      
      results.forEach((result) => {
        const parent = result.closest("div"); // The result container
        const text = result.innerText.toLowerCase();
        const isRelevant = keywords.some(keyword => text.includes(keyword.toLowerCase()));
        
        if (!isRelevant) {
          parent.style.display = "none"; // Hide irrelevant results
        }
      });
    }
  });
  