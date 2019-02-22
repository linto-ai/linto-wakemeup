document.addEventListener("DOMContentLoaded", function (event) {
    const btnSubmit = document.getElementById('postlogin');

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
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        if (email.value.length > 0 && password.value.length > 0) {
            return true;
        }
        return false;
    }

    async function sendAuth(password, email) {
        const userInfo = {
            password: password,
            email: email
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

        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const userInfo = {
            password: password.value,
            email: email.value
        }
        let checkAuth = await axios('/checkLogin', {
            method: 'post',
            data: userInfo
        })

        if (checkAuth.data.status == "success") {
            window.location.href = '/accueil'
        } else {
            console.log(checkAuth.data)

            alert("wrong credentials")
        }

    }

    if (!!getCookie("hash") && !!getCookie("email")) {
        console.log("email:", getCookie("hash"));
        console.log("hash:", getCookie("email"));
        sendAuth(getCookie("hash"), getCookie("email"));
    }


});