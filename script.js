console.log("Student Film Database Loaded");

// Simulated server JSON (mock API)
const MOCK_FILMS = [
    {
        title: "Shadows on Fifth",
        director: "Emily Carter",
        genre: "Drama",
        year: 2023,
        description: "A reflective story about life in downtown Pittsburgh."
    },
    {
        title: "Steel City Nights",
        director: "Marcus Hill",
        genre: "Action",
        year: 2022,
        description: "A fast-paced student action film set in Pittsburgh."
    },
    {
        title: "The Last Frame",
        director: "Sarah Nguyen",
        genre: "Documentary",
        year: 2024,
        description: "A documentary exploring the struggles of film students."
    },
    {
        title: "Echoes of Tomorrow",
        director: "Emily Carter",
        genre: "Sci-Fi",
        year: 2023,
        description: "A futuristic short film about memory and identity."
    }
];

// Simulated API call
function fakeApiSearch(query) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = MOCK_FILMS.filter(film =>
                film.title.toLowerCase().includes(query) ||
                film.director.toLowerCase().includes(query) ||
                film.genre.toLowerCase().includes(query) ||
                film.year.toString().includes(query)
            );
            resolve(results);
        }, 400);
    });
}

// Render film cards
function renderResults(films) {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";

    if (films.length === 0) {
        container.innerHTML = `<p class="placeholder-text">No films found. Try another search.</p>`;
        return;
    }

    films.forEach(film => {
        const card = document.createElement("div");
        card.classList.add("film-card");

        card.innerHTML = `
            <h3>${film.title}</h3>
            <p><strong>Director:</strong> ${film.director}</p>
            <p><strong>Genre:</strong> ${film.genre}</p>
            <p><strong>Year:</strong> ${film.year}</p>
            <p class="description">${film.description}</p>
        `;

        container.appendChild(card);
    });
}

// Unified search handler
async function handleSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    console.log("Searching for:", query);

    const results = await fakeApiSearch(query);
    renderResults(results);
}

// Button click
document.getElementById("searchBtn").addEventListener("click", handleSearch);

// ENTER key support
document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});
