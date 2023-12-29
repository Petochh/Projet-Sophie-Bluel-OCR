import { fetch_data, fetch_category, fetch_delete, fetch_add_img } from "./constantsApi.js";

const modalContentBody = document.querySelector('.modal__content__body');
const modalTitle = document.querySelector('.modal__content__title');
const returnModalBtn = document.querySelector('.modal__content__btn__return');
const submitBtnModal = document.getElementById('addModalBtn');
const errorMessage = document.getElementById('infoMessage');


export async function createModalViewArticle(message) {
    const data = await fetch_data();
    
    errorMessage.textContent = message || "";
    // Modification du bouton general
    submitBtnModal.value = "Ajouter une photo";
    submitBtnModal.addEventListener('click', createModalViewAddPicture);
    submitBtnModal.removeEventListener("click",addPictureBdd);
    submitBtnModal.style.backgroundColor = "#1D6154";
    // on enleve le bouton retours
    returnModalBtn.style.display = 'none';
    // on change le nom de la "page"
    modalTitle.textContent = "Galerie photo";
    // on reset le contenu
    modalContentBody.innerHTML = '';

    data.forEach(element => {
        const container_article = createArticleContainer(element);
        modalContentBody.append(container_article);
    })
}

// creation des conteneur 
function createArticleContainer(element) {
    const container_article = document.createElement('figure');
    const img_article = document.createElement('img');
    const iconDelete = document.createElement('i');

    img_article.src = element.imageUrl;
    iconDelete.classList.add('fa-solid');
    iconDelete.classList.add('fa-trash-can');
    iconDelete.setAttribute('id', element.id);
    iconDelete.addEventListener('click', deleteModalImg);
    
    container_article.appendChild(img_article);
    container_article.appendChild(iconDelete);

    return container_article;
}

export async function deleteModalImg(event) {
    const confirmModal = createConfirmModal();
    modalContentBody.appendChild(confirmModal);
    
    const BTNYes = confirmModal.querySelector('#js_BTNYes');
    const BTNNo = confirmModal.querySelector('#js_BTNNo');

    BTNYes.addEventListener('click', async () => {
        let r = await fetch_delete(event);
        if (r){
            createModalViewArticle(r)
        }
    });

    BTNNo.addEventListener('click', () => {
        confirmModal.remove();
        createModalViewArticle();
    });
}

// creation boite yes/no
function createConfirmModal() {
    const confirmModal = document.createElement('div');
    confirmModal.setAttribute('id', 'js_modalConfirm');

    const confirmModalContent = document.createElement('div');
    confirmModalContent.setAttribute('id', 'js_modalConfirmContente');

    confirmModalContent.textContent = "Êtes-vous sûr de vouloir supprimer l'image ?";

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("js_containerBtn")

    const BTNYes = document.createElement('p');
    BTNYes.textContent = "Oui";
    BTNYes.setAttribute('id', 'js_BTNYes');

    const BTNNo = document.createElement('p');
    BTNNo.textContent = "Non";
    BTNNo.setAttribute('id', 'js_BTNNo');

    btnContainer.appendChild(BTNYes);
    btnContainer.appendChild(BTNNo);

    confirmModalContent.appendChild(btnContainer)

    confirmModal.appendChild(confirmModalContent);

    return confirmModal;
}

function previouImg(e) {
    let [picture] = e.target.files;
    if(picture){
        let changeImg = document.querySelector('.fileLabelInput');
        let createImg = document.createElement('img');
        let inputSave = document.getElementById('add_file');
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
        checkFields();
    }
}

export async function createModalViewAddPicture() {
    // ajout du bouton return
    returnModalBtn.style.display = "block";
    // modifie le titre de la modal
    modalTitle.textContent = "Ajout photo";
    // vide le contenu de la modal
    modalContentBody.innerHTML = '';
    // modifie le contenu du bouton submit
    submitBtnModal.value = "Valider";
    submitBtnModal.removeEventListener('click', createModalViewAddPicture);
    submitBtnModal.style.backgroundColor = "gray";

    errorMessage.textContent = "";
    
    // creation du formulaire
    let createFormPicture = document.createElement('form');

    createFormPicture.append(createFileLabel());
    createFormPicture.append(createFileInput());
    createFormPicture.append(createTitleLabel());
    createFormPicture.append(createTitleInput());
    createFormPicture.append(createCategoriesLabel());
    createFormPicture.append(createCategoriesInput());

    modalContentBody.append(createFormPicture);
}

/*** Creation de l'input file ***/
function createFileLabel() {
    const createFileLabel = document.createElement("label");
    createFileLabel.classList.add("fileLabelInput");
    createFileLabel.setAttribute("for", "add_file")

    const iconLabel = document.createElement("i");
    iconLabel.classList.add("fa-regular");
    iconLabel.classList.add("fa-image");

    const btnLabel = document.createElement("div");
    btnLabel.classList.add("jsBtnAdd");
    btnLabel.textContent = "+ Ajouter photo";

    const infoLabel = document.createElement("div");
    infoLabel.textContent = "jpg, png : 4mo max";

    createFileLabel.appendChild(iconLabel)
    createFileLabel.appendChild(btnLabel)
    createFileLabel.appendChild(infoLabel)

    return createFileLabel;
}

function createFileInput() {
    const createFileInput = document.createElement("input");
    createFileInput.type = "file";
    createFileInput.setAttribute("id", "add_file");
    createFileInput.accept = ".pdf, .png";
    createFileInput.size = "4194304";
    createFileInput.addEventListener("change", previouImg);

    return createFileInput;
}
/*** fin Creation de l'input file ***/

/*** Creation de l'input Title ***/
function createTitleLabel() {
    const createLabelTitle = document.createElement("label");

    createLabelTitle.textContent = "Titre";
    createLabelTitle.setAttribute("for", "add__title");

    return createLabelTitle;
}

function createTitleInput() {
    const createInputTitle = document.createElement("input");
    createInputTitle.type = "text";
    createInputTitle.setAttribute("id", "add__title");
    createInputTitle.addEventListener("input", checkFields);

    return createInputTitle;
}
/*** fin Creation de l'input Title ***/

/*** Creation de l'input categories ***/
function createCategoriesLabel() {
    const createCategoriesLabel = document.createElement("label");
    createCategoriesLabel.textContent = "Categories";
    createCategoriesLabel.setAttribute("for", "add__category");

    return createCategoriesLabel;
}

function createCategoriesInput() {
    const createInputCategory = document.createElement('select');
    createInputCategory.setAttribute('id', "add__category");
    createInputCategory.name = "Categories";
    createInputCategory.addEventListener('change', checkFields);
    
    const optionNul = document.createElement('option');
    optionNul.textContent = '';
    createInputCategory.appendChild(optionNul);

    fetch_category().then(optionsCategory => {
        optionsCategory.forEach(element => {
            const option = document.createElement('option');
            option.value = element.name.toLowerCase().replace(/\s/g, '.');
            option.setAttribute('id', element.id);
            option.textContent = element.name;
            createInputCategory.appendChild(option);
        });
    });

    return createInputCategory;
}
/*** fin Creation de l'input categories ***/

export function checkFields() {
    let fileInput = document.getElementById('add_file');
    let titleInput = document.getElementById('add__title');
    let categoryInput = document.getElementById('add__category');

    let fileFilled = fileInput.files.length > 0;
    let titleFilled = titleInput.value.trim() !== '';
    let categoryFilled = categoryInput.value !== '';

    if (fileFilled && titleFilled && categoryFilled){
        submitBtnModal.style.backgroundColor = "#1D6154";
        submitBtnModal.addEventListener("click",addPictureBdd);
    }else{
        submitBtnModal.style.backgroundColor = "gray";
        submitBtnModal.removeEventListener("click",addPictureBdd);
    }
}

export async function addPictureBdd() {
    let fileInput = document.getElementById('add_file');
    let titleInput = document.getElementById('add__title');
    let categoryInput = document.getElementById('add__category');
    
    let categoriesId = categoryInput.selectedOptions[0].id;

    let r = await fetch_add_img(fileInput, titleInput, categoriesId);
    if (r){
        createModalViewArticle(r);
    }
    
}

/*** Fin Gestion Modal ***/