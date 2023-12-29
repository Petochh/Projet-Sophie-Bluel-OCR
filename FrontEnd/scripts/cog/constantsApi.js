const API_BASE_URL = "http://localhost:5678/api"

const WORKS_ENDPOINT = "/works";
const CATEGORIES_ENDPOINT = "/categories";
const USERS_LOGIN_ENDPOINT = "/users/login";


export async function fetch_data() {
    try{
        const r = await fetch(`${API_BASE_URL}${WORKS_ENDPOINT}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        if (r.ok){
            return r.json();
        }else{
            throw new Error(`Erreur lors de la requête : ${r.status} ${r.statusText}`);
        }
    }catch (error){
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
        throw error;
    }
}

export async function fetch_category() {
    try{
        const r = await fetch(`${API_BASE_URL}${CATEGORIES_ENDPOINT}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        if (r.ok){
            return r.json();
        }else{
            throw new Error(`Erreur lors de la requête : ${r.status} ${r.statusText}`);
        }
    }catch (error){
        console.error("Une erreur s'est produite lors de la récupération des catégories :", error);
        throw error;
    }
}

export async function fetch_users(mail, passwd) {
    try{
        const r = await fetch(`${API_BASE_URL}${USERS_LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: mail.value,
                password: passwd.value,
            }),
        });
    
        if (r.ok){
            const data = await r.json();
            localStorage.setItem('authToken', data.token);
            document.location.href = "/FrontEnd/index.html";
        }else{
            let ErrorMessage = "Mot de passe ou e-mail incorrect.";
            return ErrorMessage;
        }
    }catch (error){
        console.error('Erreur inattendue:', error);
    }
}

export async function fetch_delete(event) {
    try {
        const r = await fetch(`${API_BASE_URL}${WORKS_ENDPOINT}/${event.target.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.authToken}`,
            },
        });

        if (r.ok) {
            let infoMessage = "Image supprimée avec succès !";
            return infoMessage;
        }
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
    }
}

export async function fetch_add_img(fileInput, titleInput, categoriesId) {
    try {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', parseInt(categoriesId));
    
        const r = await fetch(`${API_BASE_URL}${WORKS_ENDPOINT}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.authToken}`,
            },
        });

        if (r.ok) {
            let infoMessage = "Image ajouter avec succes !";
            return infoMessage;
        }
    } catch (error) {
        console.error('Erreur inattendue :', error);
    }
}