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

const category_filter = new Map();
category_filter.set('category__0', 'Tous');

async function article_view() {
    const articles = await fetch_data();
    const gallery = document.querySelector('.gallery');
    const filter_gallery = document.querySelector('.filter__gallery');

    articles.forEach(element => {
        let container_article = document.createElement('figure')
        let img_article = document.createElement('img');
        let title_article = document.createElement('figcaption');
        title_article.innerText = element.title;
        img_article.src = element.imageUrl;
        container_article.appendChild(img_article);
        container_article.appendChild(title_article);
        gallery.append(container_article);

        if (!category_filter.get('category__'+ element.category.id)) {
            let button_filter = document.createElement('p');
            category_filter.set('category__'+ element.category.id, element.category.name);
            button_filter.innerText = element.category.name;
            button_filter.classList.add('filter__button', 'category__'+ element.category.id);
            filter_gallery.appendChild(button_filter);
        }
    });

    Teste();
}

article_view();
console.log(category_filter)


function Teste() {
    for (let i = 0; i < category_filter.size; i++) {
        console.log(category_filter.get('category__'+i))
    }

}

let button_listener = document.querySelectorAll('.filter__button');

button_listener.forEach(function(button, index) {
    button.addEventListener('click', function() {
        // Code à exécuter lors du clic sur un élément 'filter__button'
        console.log('Bouton cliqué !'+ category_filter.get(index));
    });
});