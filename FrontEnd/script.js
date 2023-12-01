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

fetch_data().then(test => console.log(test))

async function article_view() {
    const jsonData = await fetch_data();
    const items = jsonData.items;
    const gallery = document.querySelector('gallery');

    items.forEach(item => {
        const createDiv = document.createElement('div');
        createDiv.textContent = item.title;

        gallery.appendChild(createDiv);
    });
}

article_view();