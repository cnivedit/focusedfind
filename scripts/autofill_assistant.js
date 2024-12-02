let session = null;

async function createSession() {
    try {
        session = await ai.languageModel.create({
            systemPrompt: `You are a friendly, helpful assistant specializing in predicting a user's search 
                intent based on keywords that describe their workflow and context. Provide the predictions in the
                following format
                Suggestions:
                1. Text
                2. Text
                `
        });
        return session;
    } catch (error) {
        console.error("Error creating session:", error);
    }
}

async function getResponse(session, query, keywords) {
    if (!session) {
        session = await createSession();
    }
    const formattedKeywords = keywords.join(", ");
    const prompt = `
            Based on the keywords: ${formattedKeywords}, which describe the user's search context, 
            provide 5 possible search queries the user might enter: ${query}.
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
        if (keywords.length === 0) {
            console.warn("No keywords available in storage.");
            return null;  // Return null if no keywords are found
        }

        console.log("calling llm");

        const result = await getResponse(session, message.query, keywords);
        if (result) {
            console.log("LLM Predictions:", result);
            return parseResponse(result);  // Return the parsed response
        }

    } catch (error) {
        console.error("Error processing user search query:", error);
        return null;  // Return null on error
    }
}

function parseResponse(response) {
    const suggestionsPart = response.split("Suggestions:")[1]?.trim();

    if (!suggestionsPart) {
        console.error("No suggestions found in the response.");
        return [];
    }

    const suggestions = suggestionsPart
        .split(/\n/)
        .map(line => line.trim())
        .filter(line => /^\d+\.\s/.test(line)) // Keep only lines starting with "number. "
        .map(line => line.replace(/^\d+\.\s/, "")); // Remove the "number. " prefix

    return suggestions;
}

