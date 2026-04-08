/*
// Hardcoded  film data  I just wanted to use until we got the student film data for testing purposes.
const films = [
  {
    id: 1,
    title: "A Quiet Place",
    genre: "Horror",
    year: 2018,
    director: "John Krasinski"
  },
  {
    id: 2,
    title: "Inception",
    genre: "Science Fiction",
    year: 2010,
    director: "Christopher Nolan"
  },
  {
    id: 3,
    title: "Pirates of the Caribbean: The Curse of the Black Pearl",
    genre: "Action Adventure",
    year: 2003,
    director: "Gore Verbinski"
  }
];

const moviesSection = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// This is a function that makes the movies show up on the page.
function displayFilms(filmList) {
  moviesSection.innerHTML = "";

  if (filmList.length === 0) {
    moviesSection.innerHTML = "<p>No films found.</p>";
    return;
  }

  filmList.forEach(film => {
    const filmCard = document.createElement("div");
    filmCard.className = "placeholder-card";

    filmCard.innerHTML = `
      <h3>${film.title}</h3>
      <p><strong>Genre:</strong> ${film.genre}</p>
      <p><strong>Year:</strong> ${film.year}</p>
      <p><strong>Director:</strong> ${film.director}</p>
    `;

    moviesSection.appendChild(filmCard);
  });
}

// Shows all films when the page loads
displayFilms(films);

// This makes you get a result when you click the search button for what you typed
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();

  const filteredFilms = films.filter(film =>
    film.title.toLowerCase().includes(query) ||
    film.genre.toLowerCase().includes(query) ||
    film.director.toLowerCase().includes(query)
  );

  displayFilms(filteredFilms);
});

*/