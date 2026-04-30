<<<<<<< Updated upstream
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

// Render film cards
function renderResults(films) {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";

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

// Filter films based on search query
function filterFilms(query) {
    return MOCK_FILMS.filter(film =>
        film.title.toLowerCase().includes(query) ||
        film.director.toLowerCase().includes(query) ||
        film.genre.toLowerCase().includes(query) ||
        film.year.toString().includes(query)
    );
}

// Unified search handler
function handleSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    if (query === "") {
        // If search is empty, show all films again
        renderResults(MOCK_FILMS);
        return;
    }

    const results = filterFilms(query);
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

// Show all films on initial page load
renderResults(MOCK_FILMS);
=======
// Elements from the page
const moviesSection = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

var films = []; // this will store films from the database


// this is a Function that shows films on the page
function displayFilms(filmList) {

  moviesSection.innerHTML = "";

  if (filmList.length === 0) {
    moviesSection.innerHTML = "<p>No films found.</p>";
    return;
  }

  filmList.forEach(function(film){

    const filmCard = document.createElement("div");
    filmCard.className = "placeholder-card";

    filmCard.innerHTML =
      "<h3>" + film.title + "</h3>" +
      "<p><strong>Genre:</strong> " + film.genre + "</p>" +
      "<p><strong>Year:</strong> " + film.year + "</p>" +
      "<p><strong>Director:</strong> " + film.director + "</p>";

    moviesSection.appendChild(filmCard);

  });

}


// This gets films from the Node server
function loadFilms(){

  fetch("/movies")
    .then(function(response){
      return response.json();
    })
    .then(function(data){

      films = data; // store database results
      displayFilms(films);

    })
    .catch(function(error){

      console.log("Error loading films:", error);

    });

}


// This ends up giving Search functionality
searchBtn.addEventListener("click", function(){

  const query = searchInput.value.toLowerCase();

  const filteredFilms = films.filter(function(film){

    return (
      film.title.toLowerCase().includes(query) ||
      film.genre.toLowerCase().includes(query) ||
      film.director.toLowerCase().includes(query)
    );

  });

  displayFilms(filteredFilms);

});


// This Load films when page opens
document.addEventListener("DOMContentLoaded", function(){

  loadFilms();

});
>>>>>>> Stashed changes
