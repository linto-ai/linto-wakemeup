document.addEventListener("DOMContentLoaded", function (event) {
    const listen = document.getElementById('listen');
    const valid = document.getElementById('valid');
    const invalid = document.getElementById('invalid');
    var isValid = false;
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
        getAudio();
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

        console.log(document.cookie);

        let checkAuth = await axios('/getAudio', {
            method: 'get',
            headers: {
                data: "dieuEstGrand"
            },
            responseType: "blob"
        });
        console.log(checkAuth.blob);

    };
});