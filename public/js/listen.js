document.addEventListener("DOMContentLoaded", function (event) {
    const listen = document.getElementById('listen');
    const valid = document.getElementById('valid');
    const invalid = document.getElementById('invalid');
    var isValid = false;
    var audio = document.getElementById('audio');
    async function sendForm(isValid) {

        const userInfo = {
            'isValid': isValid
        }
        let checkAuth = await axios('/samplevalidity', {
            method: 'post',
            data: userInfo
        })
        // Success > Redirection
        if (checkAuth.data.status == "success") {
            console.log("c 1 fran suxé");
        }
        // Error : show error
        else {
            console.log(checkAuth.data)
        }

    }
    // On click "Submit" form
    listen.onclick = function (e) {
        e.preventDefault();
        console.log("listen");
        getAudio([1, 2, 3]);
    };

    valid.onclick = function (e) {
        isValid = true;
        console.log("valide");
        sendForm(isValid);
    };

    invalid.onclick = function (e) {
        isValid = false;
        console.log("invalide");
        sendForm(isValid);
    };

    async function getAudio(alreadyListened) {
        axios('/getAudio', {
            method: 'GET',
            headers: {
                data: alreadyListened
            },
            responseType: "blob"
        }).then((response) => {

            const url = window.URL.createObjectURL(new Blob([response.data]));
            audio.src = url;
            audio.load();
            audio.play();
            console.log(url);
        });


    };
});