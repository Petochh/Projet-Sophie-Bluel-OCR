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

async function fetch_category() {
    const r = await fetch('http://localhost:5678/api/categories',{
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
        const returnModalBtn = document.getElementById('returnModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modal = document.getElementById('modale');
    
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            createModalViewArticle();
        });

        returnModalBtn.addEventListener('click', function() {
            createModalViewArticle();
        })
    
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
    let modalContentBody = document.querySelector('.modal__content__body');
    let modalTitle = document.querySelector('.modal__content__title');
    let returnModalBtn = document.querySelector('.modal__content__btn__return');
    let submitBtnModal = document.getElementById('addModalBtn');

    submitBtnModal.value = "Ajouter une photo";
    submitBtnModal.setAttribute('onclick', 'createModalViewAddPicture()');
    submitBtnModal.style.backgroundColor = "#1D6154";
    returnModalBtn.style.display = 'none';
    modalTitle.textContent = "Galerie photo";
    modalContentBody.innerHTML = '';
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

        modalContentBody.append(container_article);
        i++
    })
}

function previouImg(e){
    let [picture] = e.files;
    if(picture){
        let changeImg = document.querySelector('.fileLabelInput');
        let createImg = document.createElement('img');
        let inputSave = document.getElementById('fileInput');
        createImg.src = URL.createObjectURL(picture);
        createImg.classList.add('previouInpuImg');
        changeImg.innerHTML = '';
        changeImg.append(createImg);
        inputSave.disabled = true;
        changeImg.append(inputSave);
    }
}

async function createModalViewAddPicture() {
    // ajout du bouton return
    let returnBtnModal = document.querySelector('.modal__content__btn__return');
    returnBtnModal.style.display = "block";
    // modifie le titre de la modal
    let modalTitle = document.querySelector('.modal__content__title');
    modalTitle.textContent = "Ajout photo";
    // vide le contenu de la modal
    let modalContent = document.querySelector('.modal__content__body');
    modalContent.innerHTML = '';
    // modifie le contenue du bouton submit
    let submitBtnModal = document.getElementById('addModalBtn');
    submitBtnModal.value = "Valider";
    submitBtnModal.setAttribute('onclick', '');
    submitBtnModal.style.backgroundColor = "gray";
    
    // creation du formulaire
    let createFormPicture = document.createElement('form');
    // ajout de l'input pour l'image
    let createLabelImage = document.createElement('label');
    createLabelImage.classList.add('fileLabelInput');

    let iconLabelImage = document.createElement('i');
    iconLabelImage.classList.add('fa-regular');
    iconLabelImage.classList.add('fa-image');

    let labelBtnAdd = document.createElement('div');
    labelBtnAdd.textContent = "+ Ajouter photo";

    let labelInfoImage = document.createElement('div');
    labelInfoImage.textContent = "jpg, png : 4mo max";

    let createInputImage = document.createElement('input');
    createInputImage.type = "file";
    createInputImage.setAttribute('onchange', 'previouImg(this)');
    createInputImage.setAttribute('id', "fileInput");
    createInputImage.addEventListener('change', checkFields);
    
    createLabelImage.appendChild(createInputImage);
    createLabelImage.appendChild(iconLabelImage);
    createLabelImage.appendChild(labelBtnAdd)
    createLabelImage.appendChild(labelInfoImage);

    // ajout de l'input titre
    let createLabelTitle = document.createElement('label');
    createLabelTitle.textContent = "Titre";
    createLabelTitle.setAttribute("for", "add__title");
    
    let createInputTitle = document.createElement('input');
    createInputTitle.type = "text";
    createInputTitle.setAttribute('id', "add__title");
    createInputTitle.addEventListener('input', checkFields);

    // ajout de l'input categorie
    let createLabelCategory = document.createElement('label');
    createLabelCategory.textContent = "Categorie";
    createLabelCategory.setAttribute('for', "add__category");
    
    let createInputCategory = document.createElement('select');
    createInputCategory.setAttribute('id', "add__category");
    createInputCategory.name = "Categories";
    createInputCategory.addEventListener('change', checkFields);
    
    let optionNul = document.createElement('option');
    optionNul.textContent = '';
    createInputCategory.appendChild(optionNul);

    let optionsCategory = await fetch_category();
    optionsCategory.forEach(element => {
        let option = document.createElement('option');
        option.value = element.name.toLowerCase().replace(/\s/g, '.');
        option.textContent = element.name;
        createInputCategory.appendChild(option);
    });


    createFormPicture.append(createLabelImage);
    createFormPicture.append(createLabelTitle);
    createFormPicture.append(createInputTitle);
    createFormPicture.append(createLabelCategory);
    createFormPicture.append(createInputCategory);

    modalContent.append(createFormPicture);
}

function checkFields() {
    let fileInput = document.getElementById('fileInput');
    let titleInput = document.getElementById('add__title');
    let categoryInput = document.getElementById('add__category');
    let submitBtn = document.getElementById('addModalBtn');

    var fileFilled = fileInput.files.length > 0;
    var titleFilled = titleInput.value.trim() !== '';
    var categoryFilled = categoryInput.value !== '';

    if (fileFilled && titleFilled && categoryFilled){
        submitBtn.style.backgroundColor = "#1D6154";
    }else{
        submitBtn.style.backgroundColor = "gray";
    }
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