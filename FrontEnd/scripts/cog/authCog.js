import { fetch_users } from "./constantsApi.js";

export async function authLog(event) {
    event.preventDefault();

    const mail = document.querySelector('#mail');
    const passwd = document.querySelector('#passwd');

    if (mail.value !== "" && passwd.value !== ""){
        if (!checkMailValidity(mail.value)){
            displayErrorMessage("E-mail non valide.");
        }else{
            const r = await fetch_users(mail, passwd);
            if (r) {
                displayErrorMessage(r);
            }
        }
    }else{
        displayErrorMessage("Vous devez remplir tous les champs.");
    }
}

export function checkIfUserIsLoggedIn() {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
}

function checkMailValidity(mail) {
    const regex_mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return regex_mail.test(mail);
}

export function displayErrorMessage(errMessage) {
    const errorContainer = document.querySelector('.error__message')
    if(!errorContainer){
        const formLogin = document.querySelector('form');
        const submitButton = document.getElementById('btn__submit');
        const errorMessage = document.createElement('p');

        errorMessage.classList.add('error__message');
        errorMessage.textContent = errMessage;
    
        formLogin.insertBefore(errorMessage, submitButton);
    }else{
        errorContainer.textContent = errMessage;
    }
}

export function logoutUser() {
    localStorage.removeItem('authToken');
    let buttonLogger = document.querySelector('.loger');
    buttonLogger.removeEventListener('click',logoutUser)
    
    document.location.href = "./FrontEnd/index.html";
}