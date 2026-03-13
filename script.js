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