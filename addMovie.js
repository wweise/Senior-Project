document.addEventListener("DOMContentLoaded", () => {
    addCrewRow(); // start with one crew row
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

//Make function globally accessible
window.addCrewRow = addCrewRow;

//Form submission
document.querySelector(".form").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {

        //Create film
        const film = {
            title: document.getElementById("title").value,
            year: document.getElementById("year").value,
            run_time: document.getElementById("time").value,
            description: document.getElementById("description")?.value || "",
            genre: document.getElementById("genre").value,
            course: document.getElementById("course")?.value || "",
            film_url: document.getElementById("film_url")?.value || ""
        };

        const filmRes = await fetch("/films", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(film)
        });

        const savedFilm = await filmRes.json();


        //Process crew rows
        const crewRows = document.querySelectorAll(".crew-row");

        for (const row of crewRows) {
            const name = row.querySelector(".crew-name").value;
            const roleName = row.querySelector(".crew-role").value;

            if (!name) continue;


            //Create or get roles
            const roleRes = await fetch("/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_name: roleName })
            });

            const role = await roleRes.json();


            //Create or get student
            let student = null;

            // 1. Try to find existing student
            const lookupRes = await fetch(`/students?name=${encodeURIComponent(name)}`);
            student = await lookupRes.json();

            // 2. If not found → create new student
            if (!student) {
            const studentRes = await fetch("/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: name.split(" ")[0] || name,
              last_name: name.split(" ").slice(1).join(" ") || "",
              major: "",
              graduation_year: null
              })
            });

            student = await studentRes.json();
            }


            //Link film crew
            await fetch("/film-crew", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    film_id: savedFilm.film_id,
                    student_id: student.student_id,
                    role_id: role.role_id
                })
            });
        }

        //Success message and cleanup
        alert("Film submitted successfully!");

        this.reset();
        document.getElementById("crewContainer").innerHTML = "";
        addCrewRow();

    } catch (err) {
        console.error("Submission error:", err);
        alert("Error submitting film. Check console.");
    }
});