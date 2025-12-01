
const API_URL = 'http://127.0.0.1/LISTA-TAREAS-PROYECTO/backend/api.php'; 


const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
    }
    return response.json();
};


export const fetchTasks = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });
    return handleResponse(response);
};


export const createTask = async (text, category_id, tags) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, category_id, tags }),
    });
    return handleResponse(response);
};


export const updateTaskStatus = async (id, completed) => {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed }),
    });
    return handleResponse(response);
};


export const editTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
   
        body: JSON.stringify({
            id: taskData.id,
            text: taskData.text,
            category_id: taskData.category_id,
            tags: taskData.tags, 
        }),
    });
    return handleResponse(response);
};


export const deleteTask = async (id) => {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    return handleResponse(response);
};


export const clearCompletedTasks = async () => {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({}), 
    });
    return handleResponse(response);
};
