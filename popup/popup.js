chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateKeywords") {
        const keywords = message.keywords;
        const list = document.getElementById("keywords");
        list.innerHTML = "";
        keywords.forEach((keyword) => {
            const li = document.createElement("li");
            li.textContent = keyword;
            list.appendChild(li);
        });
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await chrome.storage.session.get("keywords");
        const keywords = result.keywords || [];

        if (keywords.length > 0) {
            console.log("Loaded keywords:", keywords);
            const list = document.getElementById("keywords");
            keywords.forEach((keyword) => {
                const li = document.createElement("li");
                li.textContent = keyword;
                list.appendChild(li);
            });
        } else {
            console.log("No keywords found.");
            document.getElementById('keywords').textContent = "No keywords available.";
        }
    } catch (error) {
        console.error("Error retrieving keywords:", error);
    }
});