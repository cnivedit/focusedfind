let session = null;

async function createSession() {
    session = await ai.languageModel.create({
        systemPrompt: "You are a friendly, helpful assistant specialized in predicting user's search given keywords that describe the user's workflow context."
    });
    console.log("LLM session:", session);
}

async function getResponse(session, query, keywords) {
    const formattedKeywords = keywords.join(", ");
    const prompt = `
            Given the keywords: ${formattedKeywords}, which describe the search context,
            provide 5 predictions on what the user is searching for if the user has entered: ${query}
        `;
    console.log(prompt);
    try {
        const result = await session.prompt(prompt);
        return result;
    } catch (error) {
        console.error("Error getting response from LLM:", error);
        return null;
    }
}

async function queryLLM(message) {
    try {
        chrome.storage.session.get(["keywords"], async (data) => {
            const keywords = data.keywords || [];
            if (keywords.length === 0) {
                console.warn("No keywords available in storage.");
                return;
            }
            console.log("calling llm");
            
            const result = await getResponse(session, message.query, keywords);
            if (result) {
                console.log("LLM Predictions:", result);

            }
        });
    } catch (error) {
        console.error("Error processing user search query:", error);

    }
    return true;
}


