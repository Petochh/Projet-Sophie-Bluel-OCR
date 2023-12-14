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

    if (!checkIfUserIsLoggedIn()) {
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
    }else{
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
                if (idarticle==element.category.id) {
                    let container_article = document.createElement('figure')
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
                let container_article = document.createElement('figure')
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
    create_view_articles();
}

async function button_log(event) {
    let mail = document.querySelector('#mail');
    let passwd = document.querySelector('#passwd');
    const regex_mail = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";
    
    event.preventDefault();
    
    if (mail.value !== "" && passwd.value !== "") {
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
                console.error('Erreur de connexion:', r.status, r.statusText);
            }
        } catch (error) {
            console.error('Erreur inattendue:', error);
        }
    }
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
    let change_etat = document.querySelector('.loger');
    if (change_etat) {
        change_etat.textContent = 'Logout';
        change_etat.href = '';
        change_etat.addEventListener('click', function(){logoutUser()})
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('modale');

    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';

    })
})