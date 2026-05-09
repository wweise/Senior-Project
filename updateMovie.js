document.querySelector(".form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect form values
    const filmId = document.getElementById("filmId").value;
    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;
    const runTime = document.getElementById("runTime").value;

    //Validation
    if (!filmId || !title || !genre || !year || !runTime) {
        alert("Please complete all fields.");
        return;
    }

    // Build object EXACTLY matching your database fields
    const filmData = {
        film_id: filmId,
        title: title,
        genre: genre,
        year: year,
        run_time: runTime,
        description: "",
        course: "",
        film_url: ""
    };

    try {
        const response = await fetch("http://ncasey.it.pointpark.edu:3000/films", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filmData)
        });

        const result = await response.json();
        console.log("Server response:", result);

        if (!result.success) {
            alert("Update failed. Check console.");
            return;
        }

        alert("Film updated successfully!");

    } catch (err) {
        console.error("Error updating film:", err);
        alert("Failed to update film.");
    }
});