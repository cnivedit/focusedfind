chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "session" && changes.keywords) {
        const updatedKeywords = changes.keywords.newValue || [];
        updateKeywords(updatedKeywords);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await new Promise((resolve, reject) => {
            chrome.storage.session.get(["keywords"], (data) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(data);
                }
            });
        });

        const keywords = data.keywords || [];

        if (keywords.length > 0) {
            console.log("Loaded keywords:", keywords);
            updateKeywords(keywords);
        } else {
            console.log("No keywords found.");
            document.getElementById('keywords').textContent = "No keywords available.";
        }
    } catch (error) {
        console.error("Error retrieving keywords:", error);
    }
});

async function updateKeywords(updatedKeywords) {
    const list = document.getElementById("keywords");
        
    list.innerHTML = "";

    updatedKeywords.forEach((keyword) => {
        const li = document.createElement("li");
        li.textContent = keyword;
        list.appendChild(li);
    });
}