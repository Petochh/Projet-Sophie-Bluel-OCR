async function fetch_data() {
    const r = await fetch('http://localhost:5678/api/works',{
        headers: {
            "Accept": "application/json",
        }
    })
    if (r.ok === true) {
        return r.json();
    }
    throw new Error('Impossible de contacter le serveur')
}

async function article_view() {
    const articles = await fetch_data();
    const gallery = document.querySelector('.gallery');

    articles.forEach(element => {
        console.log(element.title);
        let container_article = document.createElement('figure')
        let img_article = document.createElement('img');
        let title_article = document.createElement('figcaption');
        title_article.innerText = element.title;
        img_article.src = element.imageUrl;
        container_article.appendChild(img_article);
        container_article.appendChild(title_article);
        gallery.append(container_article);
    });
}

article_view();