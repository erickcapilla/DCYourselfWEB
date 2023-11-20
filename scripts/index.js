import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js'

document.addEventListener('DOMContentLoaded', () => {
    showForm()
}, false);

const showForm = () => {
    let params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    console.log(mode);

    const form_container = document.getElementById('reset_form')
    const install = document.getElementById('install')
    const password = document.getElementById('input_password')


    if(!(mode != "resetPassword" || mode == null || mode == undefined || mode == "")) {
        form_container.classList.remove('hide')
        install.classList.add('hide')
    }
    

    const form = document.getElementById('form_reset')
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const regex = new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,}).*$");

        if (regex.test(password.value)) {
            isResetingPassword(password.value);
            password.value = ""
        } else {
            const dialog_password = document.getElementById('dialog_password')
            const dialog_pass_text = document.getElementById('dialog_pass_text')
            const btn_pass = document.getElementById('btn_pass')
            dialog_password.showModal()
            dialog_pass_text.innerText = 'Mínimo de 8 caracteres. Un número, una mayuscula y un caracter especial.'
            btn_pass.addEventListener('click', () => {
                dialog_password.close()
            })
        }

    })
}

const isResetingPassword = (password) => {
    let params = new URLSearchParams(location.search);
    const actionCode = params.get('oobCode');
    
    const firebaseConfig = {
        apiKey: "AIzaSyBpJu9iidGqD_aGX7ZOSTESM9PWRyjd73M",
        authDomain: "dcyourself.firebaseapp.com",
        projectId: "dcyourself",
        storageBucket: "dcyourself.appspot.com",
        messagingSenderId: "961273128661",
        appId: "1:961273128661:web:fe98c98df591385a09a45c",
        measurementId: "G-3W6H7V0SK2"
      };

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app);

    handleResetPassword(auth, actionCode, password);
}

function handleResetPassword(auth, actionCode, password) {
    // Verify the password reset code is valid.
    verifyPasswordResetCode(auth, actionCode).then((email) => {
        // TODO: Show the reset screen with the user's email and ask the user for
        // the new password.
        const newPassword = password;
        // Save the new password.
        confirmPasswordReset(auth, actionCode, newPassword).then((resp) => {
            // Password reset has been confirmed and new password updated
            const dialog = document.getElementById('dialog')
            const dialog_text = document.getElementById('dialog_text')

            dialog.showModal()
            dialog_text.innerText = "La contraseña ha sido modificada correctamente. Regresa a la aplicación e inicia sesión."
        }).catch((error) => {
            // Error occurred during confirmation. The code might have expired or the
            // password is too weak.
            const dialog = document.getElementById('dialog')
            const dialog_text = document.getElementById('dialog_text')

            dialog.showModal()
            dialog_text.innerText = "Ocurrió un error. Intentalo más tarde"
        });
    }).catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        const dialog = document.getElementById('dialog')
        const dialog_text = document.getElementById('dialog_text')

        dialog.showModal()
        dialog_text.innerText = "El link ha expirado. Vuelve a intentarlo"
    });
}