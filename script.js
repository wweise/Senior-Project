document.addEventListener("DOMContentLoaded", () => {
    loadMovies();

    document.getElementById("searchBtn").addEventListener("click", handleSearch);
    document.getElementById("loadAnalyticsBtn").addEventListener("click", loadAnalytics);
});

// Load films
async function loadMovies() {
    try {
        const res = await fetch("http://ncasey.it.pointpark.edu:3000/movies");
        const result = await res.json();

        const movies = result.data || result;

        displayMovies(movies);

    } catch (err) {
        console.error("Error loading movies:", err);
        document.getElementById("movieList").innerHTML =
            "<p>Error loading films. Check console.</p>";
    }
}

// Display films
function displayMovies(movies) {
    const container = document.getElementById("movieList");
    container.innerHTML = "";

    if (!movies || movies.length === 0) {
        container.innerHTML = "<p>No films found.</p>";
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Genre:</strong> ${movie.genre || "N/A"}</p>
            <p><strong>Year:</strong> ${movie.year || "N/A"}</p>
            <p><strong>Run Time:</strong> ${movie.run_time || "N/A"} mins</p>
        `;

        container.appendChild(card);
    });
}

// Search films
function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".movie-card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? "block" : "none";
    });
}

// Analytics/genres chart
let chartInstance = null;

async function loadAnalytics() {
    try {
        const res = await fetch("http://ncasey.it.pointpark.edu:3000/analytics/genres");
        const result = await res.json();

        const data = result.data || [];

        const labels = data.map(item => item.genre);
        const values = data.map(item => item.total_entries);

        const ctx = document.getElementById("genreChart").getContext("2d");

        // Destroy previous chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Students per Genre",
                    data: values
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

    } catch (err) {
        console.error("Error loading analytics:", err);
    }
}
