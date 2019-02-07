document.addEventListener("DOMContentLoaded", function (event) {
    const listen = document.getElementById('listen');

    // On click "Submit" form
    listen.onclick = function (e) {
        e.preventDefault();

        getAudio();
    };
    async function getAudio(alreadyListened) {

        console.log(document.cookie);

        let checkAuth = await axios('/getAudio', {
            method: 'get',
            headers: {
                data: "dieuEstGrand"
            },
            responseType: "stream"
        });


    };
});