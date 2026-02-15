const putFormEl = document.querySelector('.form');

putFormEl.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(putFormEl);
    const data = Object.fromEntries(formData);

    // Validate fields

    if(!data.id || !data.title.trim() || !data.genre.trim() || !data.year.trim() || !data.runTime.trim() || !data.director.trim() || !data.producer.trim() || !data.screenWriter.trim() || !data.cinematographer.trim() || !data.editor.trim()) {
        $.toaster({priority : 'danger', title : 'Error', message : 'Fields were not properly validated.'})
    }

    //console.log(`PUT Request to: `); ** This will connect to the API

    try {
        const response = await fetch(``, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: data.title,
                genre: data.genre,
                year: data.year,
                runTime: data.runTime, 
                director: data.director,
                producer: data.producer,
                screenWriter: data.screenWriter,
                cinematographer: data.cinematographer,
                editor: data.editor
            }),  
        });

        if(!response.ok) {
            throw new Error(`Failed to update: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Server Response:", result);

        $.toaster({priority: 'Success', title: 'Movie Update', message: 'Your movie entry has been successfully updated!'});
    }
    catch (error) {
        console.error("Error updating item:", error);
        $.toaster({priority: 'danger', title: 'Error', message: 'Something went wrong while trying to update your movie entry.'});
    }
});