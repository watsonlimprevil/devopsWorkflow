const API_URL = import.meta.env.VITE_API_URL;

export async function api(path , options ={}){
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type' : 'application/json',
        ...(token ? {Authorization : `Bearer ${token}`} : {})
    }

    const res = await fetch(`${API_URL}${path}` , {
        ...options,
        headers
    })

    return res.json();
}