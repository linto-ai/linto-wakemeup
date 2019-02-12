document.addEventListener("DOMContentLoaded", function (event) {
    const btnSubmit = document.getElementById('postlogin');

    // On click "Submit" form
    btnSubmit.onclick = function (e) {
        e.preventDefault();
        if (isvalidForm()) {
            sendForm();
        }

    };

    // On keyup "ENTER"
    btnSubmit.addEventListener("keyup", function (e) {
        // Cancel the default action, if needed
        e.preventDefault();
        // Number 13 is the "Enter" key on thekeyboard
        if (event.keyCode === 13) {
            // Trigger the button element with a click
            if (isvalidForm()) {
                sendForm();
            }
        }
    });

    function isvalidForm() {
        const firstName = document.getElementById('formName');
        const lastName = document.getElementById('formLastname');
        if (firstName.value.length > 0 && lastName.value.length > 0) {
            return true;
        }
        return false;
    }

    async function sendAuth(lastName, firstName) {
        const userInfo = {
            lastName: lastName,
            firstName: firstName
        }
        let checkAuth = await axios('/checkLogin', {
            method: 'post',
            data: userInfo
        })

        if (checkAuth.data.status == "success") {
            window.location.href = '/accueil'
        } else {
            console.log(checkAuth.data);
        }


    }
    async function sendForm() {

        const form = document.getElementById('userForm');
        const firstName = document.getElementById('formName');
        const lastName = document.getElementById('formLastname');
        const userInfo = {
            lastName: lastName.value,
            firstName: firstName.value
        }
        let checkAuth = await axios('/checkLogin', {
            method: 'post',
            data: userInfo
        })

        if (checkAuth.data.status == "success") {
            window.location.href = '/accueil'
        } else {
            console.log(checkAuth.data)
        }

    }

    if (!!getCookie("nom") && !!getCookie("prenom")) {
        console.log("prenom:", getCookie("nom"));
        console.log("nom:", getCookie("prenom"));
        sendAuth(getCookie("nom"), getCookie("prenom"));
    }


});