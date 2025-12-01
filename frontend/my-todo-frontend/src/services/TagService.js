
const API_URL = 'http://127.0.0.1/LISTA-TAREAS-PROYECTO/backend/api.php';


export async function fetchTags() {
    try {
        const response = await fetch(`${API_URL}?resource=tags`, { method: 'GET' });
        
        if (!response.ok) throw new Error('Error al cargar las etiquetas.');
        
        return await response.json();
    } catch (error) {
        throw new Error('Error de conexión al cargar las etiquetas. ¿Wamp está activo?');
    }
}