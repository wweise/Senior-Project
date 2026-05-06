// ===============================
//  Add Film – REAL Backend Version
// ===============================

// Add crew row (optional UI feature)
function addCrewRow() {
    const container = document.getElementById("crewContainer");
    const div = document.createElement("div");
    div.className = "crew-row";
    div.innerHTML = `
        <input type="text" placeholder="Crew Name" class="crew-name">
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

// ===============================
//  Submit Film to REAL API
// ===============================
document.querySelector(".form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Build the film object EXACTLY matching your database fields
    const filmData = {
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        year: document.getElementById("year").value,
        run_time: document.getElementById("time").value,
        description: "",   // optional field
        course: "",        // optional field
        film_url: ""       // optional field
    };

    try {
        const response = await fetch("http://wweise.it.pointpark.edu:3000/addFilm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filmData)
        });

        const result = await response.json();
        console.log("Server response:", result);

        alert("Film added successfully!");

        // Reset form + crew rows
        this.reset();
        document.getElementById("crewContainer").innerHTML = "";
        addCrewRow();

    } catch (err) {
        console.error("Error adding film:", err);
        alert("Failed to add film.");
    }
});

// Start with one crew row (optional)
addCrewRow();
