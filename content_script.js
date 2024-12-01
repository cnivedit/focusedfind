/* chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "filterSearchResults") {
    const keywords = message.keywords;
    const results = document.querySelectorAll("a h3"); // Search result titles (Google-specific)
    console.log("reached");
    results.forEach((result) => {
      const parent = result.closest("div"); // The result container
      const text = result.innerText.toLowerCase();
      const isRelevant = keywords.some(keyword => text.includes(keyword.toLowerCase()));

      if (!isRelevant) {
        console.log(result.innerText);
        parent.style.display = "none"; // Hide irrelevant results
      }

    });
  }
}); */

document.addEventListener("DOMContentLoaded", () => {
  console.log("fired");
  chrome.runtime.sendMessage({ action: "fetchKeywords" });

  const searchInput = document.querySelector('[name="q"]');
  console.log(searchInput);

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (event) => {
      console.log("search input");
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = event.target.value;
        console.log("call llm");
        chrome.runtime.sendMessage({ action: "userSearchQuery", query });
      }, 200);
    });
  }
});
