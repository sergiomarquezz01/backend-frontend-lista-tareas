
const API_URL = 'http://127.0.0.1/LISTA-TAREAS-PROYECTO/backend/api.php';


export async function fetchCategories() {
    try {
       
        const response = await fetch(`${API_URL}?resource=categories`, { method: 'GET' });
        
        if (!response.ok) throw new Error('Error al cargar las categorías.');
        
        return await response.json();
    } catch (error) {
        throw new Error('Error de conexión al cargar las categorías. ¿Wamp está activo?');
    }
}