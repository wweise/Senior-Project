const backend = {
    films: [],
    people: [],
    roles: [],
    filmCrew: []
};

//Add a delay to simulation response (recommended via Michael Panik blog and Medium)
function fakeApi(response) {
  return new Promise(resolve => {
    setTimeout(() => resolve(response), 300);
  });
}

//Add crew rows
function addCrewRow() {
    const container = document.getElementById("crewContainer");
    const div = document.createElement("div");
    div.className = "crew-row";
    div.innerHTML = `
    <input type="text" placeholder="Crew Name" class="crew-name" required>
    <select class="crew-role">
        <option>Director</option>
        <option>Producer</option>
        <option>Screenwriter</option>
        <option>Editor</option>
        <option>Cinematographer</option>
    </select>
    `;
    container.appendChild(div);
}

function getOrCreatePerson(name) {
  let person = backend.people.find(p => p.name === name);
  if (!person) {
    person = { id: backend.people.length + 1, name };
    backend.people.push(person);
  }
  return person;
}

function getOrCreateRole(roleName) {
  let role = backend.roles.find(r => r.name === roleName);
  if (!role) {
    role = { id: backend.roles.length + 1, roleName };
    backend.roles.push(role);
  }
  return role;
}

document.querySelector(".form").addEventListener("submit", async function(e) {
    e.preventDefault(); //prevents page from reloading

    const film = {
        id: backend.films.length + 1,
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        year: document.getElementById("time").value
    };

    backend.films.push(film);

    //Push crew rows
    const crewRows = document.querySelectorAll(".crew-row");
    crewRows.forEach(row => {
        const name = row.querySelector(".crew-name").value;
        const roleName = row.querySelector(".crew-role").value;

        if (!name) return;

        const person = getOrCreatePerson(name);
        const role = getOrCreateRole(roleName);

        backend.filmCrew.push({
            filmId: film.id,
            personId: person.id,
            roleId: role.id
        });
    });

    await fakeApi(film);

    console.log("Simulated Database: ", backend);
    alert("Film submitted successfully!");

    this.reset();
    document.getElementById("crewContainer").innerHTML = "";
    addCrewRow();
});

addCrewRow();