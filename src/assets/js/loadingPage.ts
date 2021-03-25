

function updateStore() {
    console.log("Update");
}

document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("Phase 1: Checking Connection");
    try {
        await ApiConnector.loadConfig();
        window.location.href = "display.html"
    }catch (e) {
        document.getElementById('inputContainer').hidden = false
    }

});