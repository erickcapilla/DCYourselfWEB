// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
//import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'

document.addEventListener('DOMContentLoaded', () => {
  showForm()
  // Get the action to complete.
   //const mode = getParameterByName('mode');
   // Get the one-time code from the query parameter.
   //const actionCode = getParameterByName('oobCode');
   // (Optional) Get the continue URL from the query parameter if available.
   //const continueUrl = getParameterByName('continueUrl');
   // (Optional) Get the language code if available.
   //const lang = getParameterByName('lang') || 'en';
}, false);

const showForm = () => {
  const form_container = document.getElementById('reset_form')
  const install = document.getElementById('install')
  const password = document.getElementById('input_password')

  //form_container.classList.remove('hide')
  //install.classList.add('hide')
  console.log("1");

  const form = document.getElementById('form_reset')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("2");

    const regex = new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,}).*$");

    if(regex.test(password.value)) {
      console.log(password.value);
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
  console.log(actionCode);
  //const actionCode = getParameterByName('oobCode');

  /*const config = {
    'apiKey': "AIzaSyCYD35v9GVFiYDiRjGFaUtWg4DOgBO-47s"
  };

  const app = firebase.initializeApp(config);*/
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBpJu9iidGqD_aGX7ZOSTESM9PWRyjd73M",
    authDomain: "dcyourself.firebaseapp.com",
    projectId: "dcyourself",
    storageBucket: "dcyourself.appspot.com",
    messagingSenderId: "961273128661",
    appId: "1:961273128661:web:fe98c98df591385a09a45c",
    measurementId: "G-3W6H7V0SK2"
  };

  // Initialize Firebase
  //const app = initializeApp(firebaseConfig);
  const app = initializeApp(firebaseConfig)
  //const analytics = getAnalytics(app);
  const auth = getAuth(app);

  handleResetPassword(auth, actionCode, password);
}

function handleResetPassword(auth, actionCode, password) {
  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then((email) => {
    const accountEmail = email;

    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.
    const newPassword = password;

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then((resp) => {
      // Password reset has been confirmed and new password updated.

      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);

      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
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