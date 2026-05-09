document.addEventListener("DOMContentLoaded", () => {
    addCrewRow(); //start with one crew row
});


//Add crew row
function addCrewRow() {

    const container = document.getElementById("crewContainer");

    const row = document.createElement("div");
    row.className = "crew-row";

    row.innerHTML = `
        <input type="text" class="crew-name" placeholder="Crew Member Name" required>

        <select class="crew-role">
            <option value="Director">Director</option>
            <option value="Producer">Producer</option>
            <option value="Screenwriter">Screenwriter</option>
            <option value="Editor">Editor</option>
            <option value="Cinematographer">Cinematographer</option>
        </select>
    `;

    container.appendChild(row);
}

window.addCrewRow = addCrewRow;


//Form submission
document.querySelector(".form").addEventListener("submit", async function (e) {

    e.preventDefault();

    try {

        //Film object
        const film = {
            title: document.getElementById("title").value,
            year: document.getElementById("year").value,
            run_time: document.getElementById("time").value,
            description: "",
            genre: document.getElementById("genre").value,
            course: "",
            film_url: ""
        };

        //Create film
        const filmRes = await fetch(
            "http://ncasey.it.pointpark.edu:3000/films",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(film)
            }
        );

        const savedFilm = await filmRes.json();
        const filmId = savedFilm.data.film_id;

        console.log("Film ID:", filmId);

        //Crew loop
        const crewRows = document.querySelectorAll(".crew-row");

        for (const row of crewRows) {

            const name = row.querySelector(".crew-name").value.trim();
            const roleName = row.querySelector(".crew-role").value;

            if (!name) continue;

            //Get or create role
            const roleRes = await fetch(
                "http://ncasey.it.pointpark.edu:3000/roles",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role_name: roleName })
                }
            );

            const role = await roleRes.json();
            const roleId = role.data.role_id;

            //Lookup student
            const lookupRes = await fetch(
                `http://ncasey.it.pointpark.edu:3000/students?name=${encodeURIComponent(name)}`
            );

            const lookup = await lookupRes.json();

            let studentId;

            //Create student if now found
            if (!lookup.data) {

                const studentRes = await fetch(
                    "http://ncasey.it.pointpark.edu:3000/students",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            first_name: name.split(" ")[0] || name,
                            last_name: name.split(" ").slice(1).join(" ") || "",
                            major: "",
                            graduation_year: null
                        })
                    }
                );

                const created = await studentRes.json();
                studentId = created.data.student_id;

            } else {
                studentId = lookup.data.student_id;
            }

            //Link film crew
            await fetch(
                "http://ncasey.it.pointpark.edu:3000/film-crew",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        film_id: filmId,
                        student_id: studentId,
                        role_id: roleId
                    })
                }
            );
        }

        //Success message
        alert("Film submitted successfully!");

        this.reset();

        document.getElementById("crewContainer").innerHTML = "";

        addCrewRow();

    } catch (err) {

        console.error("Submission error:", err);

        alert("Error submitting film. Check console.");
    }
});