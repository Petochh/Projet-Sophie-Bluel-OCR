async function fetch_data() {
    const r = await fetch('http://localhost:5678/api/works',{
        headers: {
            "Accept": "application/json",
        }
    })
    if (r.ok === true) {
        return r.json();
    }
}


/**** Creation & Gestion filtres ****/
const category_filter = [];

/* Créer les bouton de filtre + les ecoute des bouttons */
async function create_view_filters(name, id) {
    const filter_gallery = document.querySelector('.filter__gallery');

    if (!checkIfUserIsLoggedIn()) { // si l'utilisateur n'est pas connecter on créer les filtre
        if (!category_filter.includes(name)) {
            let button_filter = document.createElement('p');
    
            button_filter.innerText = name;
            button_filter.setAttribute('id', id);
            button_filter.classList.add('filter__button');
            button_filter.addEventListener('click', function(event){
                article_view_filter(event.target.id);
            });
    
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
async function article_view_filter(idarticle) {
    update_dots();
    const current_selected = document.getElementById(idarticle);
    if (current_selected){
        current_selected.classList.add('selected')
    }

    switch (idarticle){
        
        case '0':
        case '1':
        case '2':
        case '3':
            create_view_articles(idarticle);
            break;
    }
}

/* Gestion class selected filtre */
function update_dots() {
    let filter_buttons = document.querySelectorAll('.filter__button');
    filter_buttons.forEach(element => {
        element.classList.remove('selected');
    });
}
/**** FIN Creation & Gestion filtres ****/

/**** Creation & Gestion artciles ****/
async function create_view_articles(idarticle) {
    const articles = await fetch_data();
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    
    articles.forEach(element => {
        switch (idarticle){
            case '1':
            case '2':
            case '3':
                if (idarticle == element.category.id) {
                    let container_article = document.createElement('figure');
                    let img_article = document.createElement('img');
                    let title_article = document.createElement('figcaption');
        
                    title_article.innerText = element.title;
                    img_article.src = element.imageUrl;
        
                    container_article.appendChild(img_article);
                    container_article.appendChild(title_article);
                    gallery.append(container_article);
                }
                break;
            default:
                let container_article = document.createElement('figure');
                let img_article = document.createElement('img');
                let title_article = document.createElement('figcaption');
        
                title_article.innerText = element.title;
                img_article.src = element.imageUrl;
        
                container_article.appendChild(img_article);
                container_article.appendChild(title_article);
                gallery.append(container_article);
                create_view_filters('Tous', 0);
                create_view_filters(element.category.name, element.category.id);
                break;
        }
    })
}
/**** FIN Creation & Gestion articles ****/


if (window.location.pathname === "/FrontEnd/index.html") { 
    // Verifie si on est sur la page d'acceuil pour charger article
    create_view_articles();

    // Ajout d'une ecoute sur le btn modifier si il est present
    document.addEventListener('DOMContentLoaded', function() {
        const openModalBtn = document.getElementById('openModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modal = document.getElementById('modale');
    
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            createModalViewArticle();
        });
    
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
    
        })
    })
}



function checkIfUserIsLoggedIn() {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
}

function logoutUser() {
    localStorage.removeItem('authToken');
    let buttonLogger = document.querySelector('.loger');
    buttonLogger.removeEventListener('click', function(){logoutUser()})
    
    document.location.href = "./FrontEnd/index.html";
}

if (checkIfUserIsLoggedIn()) {
    let loginLogout = document.querySelector('.loger');
    if (loginLogout) {
        loginLogout.textContent = 'Logout';
        loginLogout.href = '';
        loginLogout.addEventListener('click', function(){logoutUser()})
    }
}

/*** Gestion Modal ***/

async function createModalViewArticle() {
    const r = await fetch_data();
    let article = document.querySelector('.modal__content__gallery');
    let modalTitle = document.querySelector('.modal__content__title');

    modalTitle.textContent = "Galerie photo";
    article.innerHTML = '';
    i = 0;

    r.forEach(element => {
        let container_article = document.createElement('figure');
        let img_article = document.createElement('img');
        let iconDelete = document.createElement('i');

        img_article.src = element.imageUrl;
        iconDelete.classList.add('fa-solid');
        iconDelete.classList.add('fa-trash-can');
        iconDelete.setAttribute('id', i);
        iconDelete.addEventListener('click', function(event){console.log('Supprime element : ' + event.target.id);})
        
        container_article.appendChild(img_article);
        container_article.appendChild(iconDelete);

        article.append(container_article);
        i++
    })
}

function createModalViewAddPicture() {
    let returnBtnModal = document.querySelector('.modal__content__btn__return');
    let modalTitle = document.querySelector('.modal__content__title');
    let modalContent = document.querySelector('.modal__content__gallery');
    let createInputTitle = document.createElement('input');

    modalTitle.textContent = "Ajout photo";
    returnBtnModal.style.display = "block";

}

/*** Fin Gestion Modal ***/

/*** Gestion de connexion ***/

async function button_log(event) {
    let mail = document.querySelector('#mail');
    let passwd = document.querySelector('#passwd');
    
    event.preventDefault(); // Annule l'effet du bouton 
    
    if (mail.value !== "" && passwd.value !== "") {
        if (!checkMailValide(mail.value)){
            let errMessage = "E-mail non valide.";
            createMsgErr(errMessage);
        }else{
            try {
                const r = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: mail.value,
                        password: passwd.value,
                    }),
                });
                
                if (r.ok) {
                    const data = await r.json();
                    localStorage.setItem('authToken', data.token);
                    document.location.href = "/FrontEnd/index.html";
                } else {
                    let errMessage = "Mot de passe ou e-mail incorrect.";
                    createMsgErr(errMessage);
                }
            } catch (error) {
                console.error('Erreur inattendue:', error);
            }
        }
    }else{
        let errMessage = "Vous devez remplir tous les champs."
        createMsgErr(errMessage);
    }
}


function checkMailValide(mail) {
    const regex_mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return regex_mail.test(mail);
}

function createMsgErr(errMessage) {
    let msgErr = document.querySelector('.error__message')
    if(!msgErr) {
        const formLogin = document.querySelector('form');
        const MsgAppendAfterPass = document.getElementById('btn__submit');
        let createMsgErr = document.createElement('p');
        createMsgErr.classList.add('error__message');
        createMsgErr.textContent = errMessage;
    
        formLogin.insertBefore(createMsgErr, MsgAppendAfterPass);
    }else{
        msgErr.textContent = errMessage;
    }
}

/*** Fin de Gestion de connexion ***/