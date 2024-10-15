// Use browser API if available; otherwise, fallback to chrome API
const api = typeof browser !== "undefined" ? browser : chrome;

// Check if the context menus API is available (specifically for Chrome)
if (api.contextMenus && typeof api.contextMenus.create === "function") {
    // Create context menu items
    api.contextMenus.create({
        id: "context-menu",
        title: "Choose an Action",
        contexts: ["selection"]
    });

    api.contextMenus.create({
        id: "improve",
        title: "Improve this",
        parentId: "context-menu",
        contexts: ["selection"]
    });

    api.contextMenus.create({
        id: "explain",
        title: "Explain this",
        parentId: "context-menu",
        contexts: ["selection"]
    });

    api.contextMenus.create({
        id: "expand",
        title: "Expand on this",
        parentId: "context-menu",
        contexts: ["selection"]
    });

    api.contextMenus.create({
        id: "consolidate",
        title: "Consolidate this",
        parentId: "context-menu",
        contexts: ["selection"]
    });

    api.contextMenus.create({
        id: "answer",
        title: "Answer this",
        parentId: "context-menu",
        contexts: ["selection"]
    });

    // Add listener for context menu actions
    api.contextMenus.onClicked.addListener((info) => {
        const selectedText = info.selectionText;

        // Log selected text for debugging
        console.log("Selected text:", selectedText);
        // You can implement the API fetch here
    });
} else {
    console.error("Context menus API not available.");
}
