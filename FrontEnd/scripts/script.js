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
const category_filter = []; // Permet de stocker les differents filtres 

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
    idCategory = event.target.id;
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
        const modal = document.getElementById('modale');
        const openModalBtn = document.getElementById('openModalBtn');
        const returnModalBtn = document.getElementById('returnModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
    
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            createModalViewArticle();
        });

        returnModalBtn.addEventListener('click', function() {
            createModalViewArticle();
        });
    
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            create_view_articles();
    
        });

        document.addEventListener('keydown', function(event){
            if (event.key === "Escape" && modal.style.display === "flex") {
                modal.style.display = 'none';
                create_view_articles();
            }
        });

        document.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                create_view_articles();
            }
        });

        modal.addEventListener('click',function(event) {
            if (event.target === document.getElementById('js_modalConfirm')) {
                document.getElementById('js_modalConfirm').remove();
                createModalViewArticle();
            }
        });

    });
}



function checkIfUserIsLoggedIn() {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
}

function logoutUser() {
    localStorage.removeItem('authToken');
    let buttonLogger = document.querySelector('.loger');
    buttonLogger.removeEventListener('click',logoutUser)
    
    document.location.href = "./FrontEnd/index.html";
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

/*** Gestion Modal ***/

async function createModalViewArticle(message) {
    const r = await fetch_data();
    let modalContentBody = document.querySelector('.modal__content__body');
    let modalTitle = document.querySelector('.modal__content__title');
    let returnModalBtn = document.querySelector('.modal__content__btn__return');
    let submitBtnModal = document.getElementById('addModalBtn');
    let errorMessage = document.getElementById('infoMessage');

    if (message) {
        errorMessage.textContent = message;
    }else{
        errorMessage.textContent = "";
    }

    submitBtnModal.value = "Ajouter une photo";
    submitBtnModal.addEventListener('click', createModalViewAddPicture);
    submitBtnModal.removeEventListener("click",addPictureBdd);
    submitBtnModal.style.backgroundColor = "#1D6154";
    returnModalBtn.style.display = 'none';
    modalTitle.textContent = "Galerie photo";
    modalContentBody.innerHTML = '';

    r.forEach(element => {
        let container_article = document.createElement('figure');
        let img_article = document.createElement('img');
        let iconDelete = document.createElement('i');

        img_article.src = element.imageUrl;
        iconDelete.classList.add('fa-solid');
        iconDelete.classList.add('fa-trash-can');
        iconDelete.setAttribute('id', element.id);
        iconDelete.addEventListener('click', deleteModalImg)
        
        container_article.appendChild(img_article);
        container_article.appendChild(iconDelete);

        modalContentBody.append(container_article);
    })
}

async function deleteModalImg(event) {
    let modal = document.querySelector('.modal__content__body');
    let modalValideRemove = document.createElement('div');
    modalValideRemove.setAttribute('id', 'js_modalConfirm');
    let createValideModalContent = document.createElement('div');
    createValideModalContent.setAttribute('id', 'js_modalConfirmContente');
    createValideModalContent.textContent = "Êtes-vous sûr de vouloir supprimer l'image ?";
    let BTNYes = document.createElement('p');
    BTNYes.textContent = "Oui";
    BTNYes.addEventListener('click', async () => {
        try {
            let r = await fetch(`http://localhost:5678/api/works/${event.target.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.authToken}`,
                },
            });
            if (r.ok){
                let infoMessage = "Image supprimer avec succes !";
                createModalViewArticle(infoMessage);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    });
    let BTNNo = document.createElement('p');
    BTNNo.textContent = "Non";
    BTNNo.addEventListener('click', function() {
        modalValideRemove.remove();
        createModalViewArticle();
    })

    createValideModalContent.appendChild(BTNYes);
    createValideModalContent.appendChild(BTNNo);

    modalValideRemove.appendChild(createValideModalContent);

    modal.appendChild(modalValideRemove);
}

function previouImg(e){
    let [picture] = e.files;
    if(picture){
        let changeImg = document.querySelector('.fileLabelInput');
        let createImg = document.createElement('img');
        let inputSave = document.getElementById('fileInput');
        let errorFile = document.getElementById('infoMessage');

        errorFile.textContent = "";
        let selectFile = inputSave.files[0];
        // on test si l'image est correct
        const allowedExtensions = ['.jpg', '.png'];
        const fileExtension = selectFile.name.toLowerCase().substring(selectFile.name.lastIndexOf('.'));
        const maxSizeInBytes = 4 * 1024 * 1024; // 4 Mo
        
        if (!allowedExtensions.includes(fileExtension)) {
            errorFile.textContent = 'Veuillez sélectionner un fichier avec une extension .jpg ou .png.';
            fileInput.value = '';
            return;

        }
        if (selectFile.size > maxSizeInBytes) {
            errorFile.textContent = 'La taille du fichier ne doit pas dépasser 4 Mo.';
            fileInput.value = '';
            return;

        }
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
    // modifie le contenu du bouton submit
    let submitBtnModal = document.getElementById('addModalBtn');
    submitBtnModal.value = "Valider";
    submitBtnModal.removeEventListener('click', createModalViewAddPicture);
    submitBtnModal.style.backgroundColor = "gray";

    let errorFile = document.getElementById('infoMessage');
    errorFile.textContent = "";
    
    // creation du formulaire
    let createFormPicture = document.createElement('form');
    // ajout de l'input pour l'image
    /*
    let createLabelImage = document.createElement('label');
    createLabelImage.classList.add('fileLabelInput');

    let iconLabelImage = document.createElement('i');
    iconLabelImage.classList.add('fa-regular');
    iconLabelImage.classList.add('fa-image');

    let labelBtnAdd = document.createElement('div');
    labelBtnAdd.classList.add('jsBtnAdd');
    labelBtnAdd.textContent = "+ Ajouter photo";

    let labelInfoImage = document.createElement('div');
    labelInfoImage.textContent = "jpg, png : 4mo max";

    let createInputImage = document.createElement('input');
    createInputImage.type = "file";
    createInputImage.accept = ".pdf, .png";
    createInputImage.size = "4194304";
    createInputImage.setAttribute('onchange', 'previouImg(this)');
    createInputImage.setAttribute('id', "fileInput");
    createInputImage.addEventListener('change', checkFields);
    
    createLabelImage.appendChild(createInputImage);
    createLabelImage.appendChild(iconLabelImage);
    createLabelImage.appendChild(labelBtnAdd)
    createLabelImage.appendChild(labelInfoImage);
    */


    let filesInput = `
        <label class="fileLabelInput" for="fileInput">
            <i class="fa-regular fa-image"></i>
            <p class="jsBtnAdd">+ Ajouter photo</p>
            <p>jpg, png : 4mo max</p>
        </label>
        <input type="file" size="4194304" id="fileInput" accept=".pdf, .png" onchange="previouImg(this)">
        `;
    createFormPicture.insertAdjacentHTML('beforeEnd', filesInput);
    

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
        option.setAttribute('id', element.id);
        option.textContent = element.name;
        createInputCategory.appendChild(option);
    });


    //createFormPicture.append(createLabelImage);
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
        submitBtn.addEventListener("click",addPictureBdd);
    }else{
        submitBtn.style.backgroundColor = "gray";
        submitBtn.removeEventListener("click",addPictureBdd);
    }
}

async function addPictureBdd() {
    let fileInput = document.getElementById('fileInput');
    let titleInput = document.getElementById('add__title');
    let categoryInput = document.getElementById('add__category');
    
    let categoryId = categoryInput.selectedOptions[0].id;

    try {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', parseInt(categoryId));
    
        const r = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.authToken}`,
            },
        });
        if (r.ok) {
            let infoMessage = "Image ajouter avec succes !";
            createModalViewArticle(infoMessage);
        }
    } catch (error) {
        console.error('Erreur inattendue :', error);
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


/*** Gestion formulaire de contact ***/
let formContact = document.getElementById('formContact');
let submitBtn = document.getElementById('submitBtn').addEventListener('click', contacte)

function contacte(e) {
    e.preventDefault();
}


/*** fin de gestion de formulaire ***/