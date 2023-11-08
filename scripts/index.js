document.addEventListener('DOMContentLoaded', () => {
  showForm()
  // Get the action to complete.
   const mode = getParameterByName('mode');
   // Get the one-time code from the query parameter.
   const actionCode = getParameterByName('oobCode');
   // (Optional) Get the continue URL from the query parameter if available.
   const continueUrl = getParameterByName('continueUrl');
   // (Optional) Get the language code if available.
   //const lang = getParameterByName('lang') || 'en';
}, false);

const showForm = () => {
  const form_container = document.getElementById('reset_form')
  const install = document.getElementById('install')
  const password = document.getElementById('input_password')

  // Get the action to complete.
  const mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  const actionCode = getParameterByName('oobCode');
  // (Optional) Get the continue URL from the query parameter if available.
  const continueUrl = getParameterByName('continueUrl');
  // (Optional) Get the language code if available.
  //const lang = getParameterByName('lang') || 'en';

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
      isResetingPassword(auth, actionCode, continueUrl, password.value);
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

const isResetingPassword = (auth, actionCode, continueUrl, password) => {
  const config = {
    'apiKey': "AIzaSyCYD35v9GVFiYDiRjGFaUtWg4DOgBO-47s"
  };

  const app = firebase.initializeApp(config);
  const auth = app.auth();

  handleResetPassword(auth, actionCode, continueUrl, password);
}

function handleResetPassword(auth, actionCode, continueUrl) {
  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then((email) => {
    const accountEmail = email;

    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.
    const newPassword = newPassword;

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