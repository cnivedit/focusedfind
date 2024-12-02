chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "displaySuggestions") {
    const suggestions = message.suggestions;
    const suggestionBox = document.querySelector('.aajZCb');
    const searchInput = document.querySelector('[name="q"]');
    suggestionBox.innerHTML = "";

    suggestions.forEach((suggestion) => {
      const suggestionItem = document.createElement("li");
      suggestionItem.className = "sbct"; // Mimic Google's suggestion styling
      suggestionItem.innerHTML = `<span>${suggestion}</span>`;

      suggestionItem.addEventListener("click", () => {
        searchInput.value = suggestion;
        searchInput.form.submit();
      });

      suggestionBox.appendChild(suggestionItem);
    });
  }
});

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
