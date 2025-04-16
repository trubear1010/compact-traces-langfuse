function tryAutoSelectJSONTab(maxAttempts = 30, intervalMs = 200) {
    let attempts = 0;
    const intervalId = setInterval(() => {
        attempts++;
        // Find all elements that are <button> or have role="tab" and are labeled "JSON"
        const jsonTabs = Array.from(document.querySelectorAll('button, [role="tab"]')).filter((el) =>
            el.textContent.trim().toLowerCase() === "json"
        );
        console.log(`[Trace Compacter] Attempt ${attempts}: Found JSON tab candidates:`, jsonTabs.length, jsonTabs);
        let selected = false;
        jsonTabs.forEach((jsonTab) => {
            const isSelected = jsonTab.getAttribute("aria-selected") === "true";
            if (!isSelected) {
                // Simulate a full click (mousedown + mouseup + click)
                const mouseDownEvent = new MouseEvent("mousedown", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                const mouseUpEvent = new MouseEvent("mouseup", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                const clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                jsonTab.dispatchEvent(mouseDownEvent);
                jsonTab.dispatchEvent(mouseUpEvent);
                jsonTab.dispatchEvent(clickEvent);
            }
            if (jsonTab.getAttribute("aria-selected") === "true") {
                selected = true;
            }
        });
        // Stop interval if successful or max attempts reached
        if ((jsonTabs.length > 0 && selected) || attempts >= maxAttempts) {
            clearInterval(intervalId);
            if (selected) {
                console.log("[Trace Compacter] Successfully auto-selected JSON tab.");
            } else {
                console.log("[Trace Compacter] Max attempts reached. JSON tab not auto-selected.");
            }
        }
    }, intervalMs);
}

// Start the persistent interval on script load
tryAutoSelectJSONTab();
// This approach will not interfere with user tab switching after the first successful auto-select

// ASSUMPTION: Card containers have a class containing 'card'. Adjust selector if needed.
function autoSelectJSONTabInCard(card) {
    // Find all elements that are <button> or have role="tab" and are labeled "JSON" within the card
    const jsonTabs = Array.from(card.querySelectorAll('button, [role="tab"]')).filter((el) =>
        el.textContent.trim().toLowerCase() === "json"
    );
    console.log("[Trace Compacter] Card:", card, "Found JSON tab candidates:", jsonTabs.length, jsonTabs);
    let selected = false;
    jsonTabs.forEach((jsonTab) => {
        const isSelected = jsonTab.getAttribute("aria-selected") === "true";
        if (!isSelected) {
            // Simulate a full click (mousedown + mouseup + click)
            const mouseDownEvent = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            const mouseUpEvent = new MouseEvent("mouseup", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            const clickEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            jsonTab.dispatchEvent(mouseDownEvent);
            jsonTab.dispatchEvent(mouseUpEvent);
            jsonTab.dispatchEvent(clickEvent);
        }
        if (jsonTab.getAttribute("aria-selected") === "true") {
            selected = true;
        }
    });
    return jsonTabs.length > 0 && selected;
}

function observeCard(card) {
    // Only observe if not already observed
    if (card._traceCompacterObserved) return;
    card._traceCompacterObserved = true;
    const observer = new MutationObserver(() => {
        if (autoSelectJSONTabInCard(card)) {
            observer.disconnect();
            console.log("[Trace Compacter] Successfully auto-selected JSON tab in card.");
        }
    });
    observer.observe(card, { childList: true, subtree: true });
    // Initial run in case the tab is already present
    if (autoSelectJSONTabInCard(card)) {
        observer.disconnect();
        console.log("[Trace Compacter] Successfully auto-selected JSON tab in card (initial run).");
    }
}

function observeAllCards() {
    // ASSUMPTION: Card containers have a class containing 'card'. Adjust selector if needed.
    const cards = document.querySelectorAll('[class*="card"]');
    cards.forEach(observeCard);
}

// Observe the document for new cards being added
const globalObserver = new MutationObserver(() => {
    observeAllCards();
});
globalObserver.observe(document.body, { childList: true, subtree: true });

// Initial run for cards already present
observeAllCards();
// This approach attaches a per-card observer for maximum reliability and will not interfere with user tab switching after the first auto-select per card