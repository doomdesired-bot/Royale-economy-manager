// ==========================================
// script.js - Central Entry Point & Utilities
// ==========================================

// 1. APPLICATION INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    loadLocalState();
    renderUI();
    console.log("Royal Economy Manager initialized successfully!");
});

// 2. KEYBOARD SHORTCUTS FOR QUICK ACTIONS
document.addEventListener('keydown', (e) => {
    // Ignore input if user is inside an input box or textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
    }

    switch(e.key.toLowerCase()) {
        case 'm':
            openMatchModal();
            break;
        case 'r':
            openRollModal();
            break;
        case 'c':
            openCatalogModal();
            break;
        case 't':
            openTowerCatalogModal();
            break;
        case 'escape':
            closeRollModal();
            closeCatalogModal();
            closeTowerCatalogModal();
            closeMatchModal();
            if (typeof closePinModal === 'function') closePinModal();
            break;
    }
});

// 3. SAVE DATA BACKUP & RESTORE UTILITIES
function exportSaveData() {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(globalState));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `clash_royale_save_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Save data exported to JSON!");
    } catch (e) {
        console.error("Export error:", e);
        showToast("Failed to export save data!");
    }
}

function importSaveData(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedState = JSON.parse(e.target.result);
            if (importedState && importedState.players) {
                globalState = importedState;
                saveLocalState();
                renderUI();
                showToast("Save data imported successfully!");
            } else {
                showToast("Invalid save file structure!");
            }
        } catch (err) {
            console.error("Import error:", err);
            showToast("Error reading save file!");
        }
    };
    reader.readAsText(file);
}

// 4. FACTORY RESET HELPER
function resetAllData() {
    if (confirm("Are you sure you want to reset all crowns, decks, and catalog progress? This action cannot be undone!")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}