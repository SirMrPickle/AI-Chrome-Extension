document.addEventListener("DOMContentLoaded", function () {
    const improveBtn = document.getElementById("improve-btn");
    const explainBtn = document.getElementById("explain-btn");
    const expandBtn = document.getElementById("expand-btn");
    const consolidateBtn = document.getElementById("consolidate-btn");
    const answerBtn = document.getElementById("answer-btn");
    const inputText = document.getElementById("input-text");
    const sentencesSlider = document.getElementById("sentences-slider");
    const sliderValue = document.getElementById("sentence-count");

    // Update slider value display
    sentencesSlider.addEventListener("input", function () {
        sliderValue.textContent = sentencesSlider.value;
    });

    // Function to fetch the API key from the key file
    async function getApiKey() {
        try {
            const response = await fetch(chrome.runtime.getURL('key')); // Fetching the key from the key file
            if (!response.ok) throw new Error('Failed to load API key');
            const apiKey = await response.text();
            return apiKey.trim(); // Remove any whitespace
        } catch (error) {
            console.error("Error loading API key:", error);
            alert("Failed to load API key. Please check the key file.");
            return null;
        }
    }

    // Function to fetch data from the Cohere API
    async function fetchData(action) {
        console.log("Fetching data with action:", action); // Debug statement

        const text = inputText.value; // Use input text
        console.log("Input text:", text); // Debug statement

        const numSentences = sentencesSlider.value;
        console.log("Number of sentences requested:", numSentences); // Debug statement

        // Cohere API URL
        const apiUrl = "https://api.cohere.ai/v1/generate";

        // Get API key from key file
        const apiKey = await getApiKey();
        if (!apiKey) return; // If the API key is not loaded, exit the function

        // Prepare the user prompt
        const userPrompt = `${action} this: ${text}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}` // Include API key in the request headers
                },
                body: JSON.stringify({
                    model: "command", // Use the medium model for the free account
                    prompt: userPrompt,
                    max_tokens: 256 * numSentences, // Adjust max tokens based on the number of sentences
                    temperature: 0.7, // Adjust temperature as needed
                })
            });

            console.log("API response status:", response.status); // Debug statement
            const data = await response.json();
            console.log("API response data:", data); // Debug statement

            if (response.ok) {
                alert(data.generations[0].text); // Display the response in an alert
            } else {
                alert("Error: " + data.message); // Display error message from API
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching data. Please try again.");
        }
    }

    // Event listeners for buttons
    improveBtn.addEventListener("click", () => fetchData("improve"));
    explainBtn.addEventListener("click", () => fetchData("explain"));
    expandBtn.addEventListener("click", () => fetchData("expand"));
    consolidateBtn.addEventListener("click", () => fetchData("consolidate"));
    answerBtn.addEventListener("click", () => fetchData("answer"));
});