import { fetch_data, fetch_category } from './cog/constantsApi.js';
import { authLog, logoutUser, checkIfUserIsLoggedIn } from './cog/authCog.js';
import { createModalViewArticle } from './cog/modalCog.js';

/**** Creation & Gestion filtres ****/
const modal = document.getElementById('modale');
let category_filter = []; // Permet de stocker les differents filtres 

/* Créer les bouton de filtre + les ecoute des bouttons */
function create_view_filters(name, id) {
    const filter_gallery = document.querySelector('.filter__gallery');

    if (!checkIfUserIsLoggedIn()) { // si l'utilisateur n'est pas connecter on créer les filtres
        if (!category_filter.includes(name)) {
            let button_filter = document.createElement('p');
    
            button_filter.innerText = name;
            button_filter.setAttribute('id', id);
            button_filter.classList.add('filter__button');
            button_filter.addEventListener('click', article_view_filter);
    
            category_filter.push(name);
            filter_gallery.appendChild(button_filter);

            if (id==0){
                button_filter.classList.add('selected')
            }
        }
    }else{ // si l'utilisateur est connecter on ajoute bouton modifier
        let modifie_button = document.querySelector('.portfolio__title__modifie');

        modifie_button.style.display = 'inline-block';
    }
}

/* Execution des filtres */
function article_view_filter(event) {
    let idCategory = event.target.id;
    // supprime la class "selected" de l'ancienne appel
    let filter_buttons = document.querySelectorAll('.filter__button');
    filter_buttons.forEach(element => {
        element.classList.remove('selected');
    });

    const current_selected = document.getElementById(idCategory);
    if (current_selected){
        current_selected.classList.add('selected')
    }

    switch (idCategory){
        case '0':
        case '1':
        case '2':
        case '3':
            create_view_articles(idCategory);
            break;
    }
}
/**** FIN Creation & Gestion filtres ****/

/**** Creation & Gestion artciles ****/
async function create_view_articles(idarticle) {
    const articles = await fetch_data();
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    articles.forEach(element => {
        let container_article = document.createElement('figure');
        let img_article = document.createElement('img');
        let title_article = document.createElement('figcaption');

        title_article.innerText = element.title;
        img_article.src = element.imageUrl;

        container_article.appendChild(img_article);
        container_article.appendChild(title_article);
        
        if (
            idarticle === '1' ||
            idarticle === '2' ||
            idarticle === '3'
            ) {
                if (idarticle == element.category.id) {
                    gallery.append(container_article);
                }
            }else{
                gallery.append(container_article);
                create_view_filters('Tous', "0");
                create_view_filters(element.category.name, element.category.id);
            }
    })
}
/**** FIN Creation & Gestion articles ****/
if (window.location.pathname === "/FrontEnd/index.html") {
    create_view_articles();
    setupEventListener();
}else if (window.location.pathname === "/FrontEnd/login.html") {
    document.getElementById('btn__submit').addEventListener('click', authLog);
}

function setupEventListener() {
    const openModalBtn = document.getElementById('openModalBtn');
    const returnModalBtn = document.getElementById('returnModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    openModalBtn.addEventListener("click", handleModalOpen);
    returnModalBtn.addEventListener("click", handleModalOpen);
    closeModalBtn.addEventListener("click", handleModalClose);

    document.getElementById('submitBtnContact').addEventListener('click', contacte);
    document.addEventListener("keydown", function(event){
        if (event.key === "Escape" && modal.style.display === "flex"){
            handleModalClose();
        }
    });
    document.addEventListener("click", function (event){
        if (event.target === modal) {
            handleModalClose();
        }
    });

    modal.addEventListener('click', function(event){
        if (event.target === document.getElementById('js_modalConfirm')) {
            document.getElementById('js_modalConfirm').remove();
            createModalViewArticle();
        }
    });
}

function handleModalOpen() {
    createModalViewArticle();
    modal.style.display = "flex";
}

function handleModalClose() {
    create_view_articles();
    modal.style.display = "none";
}

if (checkIfUserIsLoggedIn()) {
    let loginLogout = document.querySelector('.loger');
    let editBar = document.querySelector('.EditHeader');
    let bodyElement = document.body;

    if (loginLogout) {
        bodyElement.style.marginTop = "100px"
        editBar.style.display = "flex";
        loginLogout.textContent = 'Logout';
        loginLogout.href = '';
        loginLogout.addEventListener('click',logoutUser)
    }
}

/*** Gestion formulaire de contact ***/
function contacte(e) {
    const formContact = document.getElementById("formContact");
    const nameInput = document.getElementById("name");
    const mailInput = document.getElementById("email");
    const textInput = document.getElementById("message");
    e.preventDefault();
    
    const msgContact = document.getElementById("submitBtnContact");
    const existMsg = document.getElementById("contactInfo");

    if (existMsg) {
        existMsg.remove();
    }

    if (nameInput.value !== "" && mailInput.value !== "" && textInput.value !== "") {
        msgContact.insertAdjacentHTML("beforebegin", "<p id='contactInfo'>Message envoyer.</p>");
        formContact.reset();
    }else{
        msgContact.insertAdjacentHTML("beforebegin", "<p id='contactInfo'>Veuillez remplir tous les champs.</p>");
    }
}
/*** fin de gestion de formulaire ***/