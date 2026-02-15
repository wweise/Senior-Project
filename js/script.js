console.log("Student Film Database Loaded");

// Placeholder search handler
document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    console.log("Searching for:", query);

    // Later: fetch(`/api/movies?search=${query}`)
});
