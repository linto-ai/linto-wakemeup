document.addEventListener("DOMContentLoaded", function (event) {
    const btnSubmit = document.getElementById('postlogin');

    // On click "Submit" form
    btnSubmit.onclick = function (e) {
        e.preventDefault();
        sendForm();
    }

    // On keyup "ENTER"
    btnSubmit.addEventListener("keyup", function (e) {
        // Cancel the default action, if needed
        e.preventDefault();
        // Number 13 is the "Enter" key on thekeyboard
        if (event.keyCode === 13) {
            // Trigger the button element with a click
            sendForm();
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

    async function sendForm() {
        if (isvalidForm()) {
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
            // Success > Redirection
            if (checkAuth.data.status == "success") {
                window.location.href = '/record'
            }
            // Error : show error
            else {
                console.log(checkAuth.data)
            }
        }
    }
});