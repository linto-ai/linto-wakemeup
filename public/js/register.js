document.addEventListener("DOMContentLoaded", function (event) {

    const boutonFemme = document.getElementById("femme");
    const boutonHomme = document.getElementById("homme");
    boutonFemme.addEventListener('click', setGender);
    boutonHomme.addEventListener('click', setGender);
    var genre;

    const btnSubmit = document.getElementById('postregister');

    btnSubmit.onclick = function (e) {
        e.preventDefault();
        if (isvalidForm()) {
            sendForm();
        }

    };


    btnSubmit.addEventListener("keyup", function (e) {

        e.preventDefault();

        if (event.keyCode === 13) {

            if (isvalidForm()) {
                sendForm();
            }
        }
    });

    function isvalidForm() {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        if (!!firstName && !!lastName && !!genre) {
            return true;
        }
        return false;
    }
    async function sendForm() {


        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const userInfo = {
            lastName: lastName.value,
            firstName: firstName.value,
            gender: genre
        };
        let checkAuth = await axios('/register', {
            method: 'post',
            data: userInfo
        });

        if (checkAuth.data.status == "success") {
            window.location.href = '/accueil';
        } else if (checkAuth.data.status == "found") {

            alert("utilisateur deja enregistre")
        } else {
            console.log(checkAuth.data);
        }

    }

    if (!!getCookie("nom") && !!getCookie("prenom")) {
        console.log("prenom:", getCookie("nom"));
        console.log("nom:", getCookie("prenom"));
        sendAuth(getCookie("nom"), getCookie("prenom"));
    }




    function setGender(e) {
        console.log(e.target.id);
        genre = e.target.id;
        console.log("OP CHANGEMENT GENRE", genre);
        if (genre === "femme") {
            if (!boutonFemme.classList.contains("active")) {
                boutonFemme.classList.add("active");
                boutonFemme.classList.remove("disabled");
            }
            if (boutonHomme.classList.contains("active")) {
                boutonHomme.classList.remove("active");
                boutonHomme.classList.add("disabled");
            }
        }

        if (genre === "homme") {
            if (!boutonHomme.classList.contains("active")) {
                boutonHomme.classList.add("active");
                boutonHomme.classList.remove("disabled");
            }
            if (boutonFemme.classList.contains("active")) {
                boutonFemme.classList.remove("active");
                boutonFemme.classList.add("disabled");
            }
        }
    }
});