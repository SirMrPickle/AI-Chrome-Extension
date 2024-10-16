document.addEventListener("DOMContentLoaded", function () {
    const improveBtn = document.getElementById("improve-btn");
    const explainBtn = document.getElementById("explain-btn");
    const expandBtn = document.getElementById("expand-btn");
    const consolidateBtn = document.getElementById("consolidate-btn");
    const answerBtn = document.getElementById("answer-btn");
    const inputText = document.getElementById("input-text");
    const sentencesSlider = document.getElementById("sentences-slider");
    const sliderValue = document.getElementById("sentence-count");
    const temperatureSlider = document.getElementById("temperature-slider");
    const temperatureValue = document.getElementById("temperature-value");
    const exampleCheckbox = document.getElementById("example-checkbox");
    const copyCheckbox = document.getElementById("copy-checkbox");

    // Update slider value display
    sentencesSlider.addEventListener("input", function () {
        sliderValue.textContent = sentencesSlider.value;
    });

    // Update temperature value display
    temperatureSlider.addEventListener("input", function () {
        temperatureValue.textContent = temperatureSlider.value;
    });

    // Function to fetch the API key from the key file
    async function getApiKey() {
        try {
            const response = await fetch(chrome.runtime.getURL('key'));
            if (!response.ok) throw new Error('Failed to load API key');
            const apiKey = await response.text();
            return apiKey.trim();
        } catch (error) {
            console.error("Error loading API key:", error);
            alert("Failed to load API key. Please check the key file.");
            return null;
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log("Text copied to clipboard.");
            alert("Text copied to clipboard!");
        }).catch(err => {
            console.error("Error copying text: ", err);
            alert("Failed to copy text.");
        });
    }

    // Function to fetch data from the Cohere API
    async function fetchData(action) {
        console.log("Fetching data with action:", action);

        const text = inputText.value;
        console.log("Input text:", text);

        const numSentences = sentencesSlider.value;
        console.log("Number of sentences requested:", numSentences);

        const temperature = parseFloat(temperatureSlider.value);
        console.log("Temperature:", temperature);

        const exampleBool = exampleCheckbox.checked;

        let userPrompt;
        if (!exampleBool) {
            userPrompt = `Please ${action} the following text within ${numSentences} sentence(s): "${text}". Focus on conciseness and clarity.`;
        } else {
            userPrompt = `Please provide an example and ${action} the following text within ${numSentences} sentence(s): "${text}". Ensure the example illustrates the key point effectively.`;
        }

        const apiUrl = "https://api.cohere.ai/v1/generate";

        const apiKey = await getApiKey();
        if (!apiKey) return;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "command",
                    prompt: userPrompt,
                    max_tokens: 256 * numSentences,
                    temperature: temperature
                })
            });

            console.log("API response status:", response.status);
            const data = await response.json();
            console.log("API response data:", data);

            if (response.ok) {
                const result = data.generations[0].text;
                if (copyCheckbox.checked) {
                    copyToClipboard(result);
                }
                alert(result);
            } else {
                alert("Error: " + data.message);
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