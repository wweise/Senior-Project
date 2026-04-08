console.log("script.js loaded");

// GLOBAL VARIABLES
let allFilms = [];
let genreChart = null;

// ----------------------------------------------------
// LOAD FILMS FROM BACKEND
// ----------------------------------------------------
function loadFilms() {
    console.log("loadFilms() called");

    $.ajax({
        url: "/users",   // IMPORTANT: this is your real backend route
        method: "GET",
        success: function(response) {
            console.log("AJAX SUCCESS:", response);

            if (!response.success) {
                $("#movieList").html("<p>Error loading films.</p>");
                return;
            }

            allFilms = response.data;
            displayFilms(allFilms);
        },
        error: function(xhr, status, error) {
            console.log("AJAX ERROR:", status, error);
            $("#movieList").html("<p>Failed to connect to server.</p>");
        }
    });
}

// ----------------------------------------------------
// DISPLAY FILMS
// ----------------------------------------------------
function displayFilms(films) {
    const movieList = $("#movieList");
    movieList.empty();

    if (films.length === 0) {
        movieList.html("<p>No films found.</p>");
        return;
    }

    films.forEach(film => {
        movieList.append(`
            <div class="placeholder-card">
                <h3>${film.title}</h3>
                <p><strong>Genre:</strong> ${film.genre ?? "N/A"}</p>
                <p><strong>Year:</strong> ${film.year ?? "N/A"}</p>
                <p><strong>Director:</strong> ${film.director ?? "N/A"}</p>
            </div>
        `);
    });
}

// ----------------------------------------------------
// SEARCH FUNCTIONALITY
// ----------------------------------------------------
document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    const filtered = allFilms.filter(film =>
        (film.title ?? "").toLowerCase().includes(query) ||
        (film.genre ?? "").toLowerCase().includes(query) ||
        (film.director ?? "").toLowerCase().includes(query)
    );

    displayFilms(filtered);
});

// ENTER key support
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
        const key = e.key || e.keyCode;
        if (key === "Enter" || key === 13) {
            e.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });
}

// ----------------------------------------------------
// GENRE ANALYTICS
// ----------------------------------------------------
function loadGenreAnalytics() {
    $.get("/analytics/genres", function(response) {
        if (!response.success) {
            console.log("Error loading analytics");
            return;
        }

        const labels = response.data.map(item => item.genre);
        const values = response.data.map(item => item.filmCount);

        const ctx = document.getElementById("genreChart").getContext("2d");

        if (genreChart) {
            genreChart.destroy();
        }

        genreChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Number of Films per Genre",
                    data: values,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    });
}

const analyticsBtn = document.getElementById("loadAnalyticsBtn");
if (analyticsBtn) {
    analyticsBtn.addEventListener("click", loadGenreAnalytics);
}

// ----------------------------------------------------
// INITIAL PAGE LOAD
// ----------------------------------------------------
$(document).ready(function() {
    loadFilms();
});
