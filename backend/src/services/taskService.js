// backend/src/services/taskService.js

let tasks = [
    { id: 1, text: "Configuración Inicial del entorno Node/Express", completed: true },
    { id: 2, text: "Diseño y aplicación de la arquitectura de Servicios/Controladores", completed: true },
    { id: 3, text: "Implementación del hook useReducer en el Frontend", completed: true },
    { id: 4, text: "Creación del CSS Futurista (Dark Neumorphism)", completed: true },
    { id: 5, text: "Definición de rutas RESTful para CRUD (In-Memory)", completed: true },
    { id: 6, text: "Implementar validación de datos de entrada en el Backend", completed: false },
    { id: 7, text: "Optimizar el rendimiento de la lista de tareas grandes", completed: false },
    { id: 8, text: "Añadir paginación simulada en la API (opcional)", completed: false },
    { id: 9, text: "Crear un componente modal para confirmación de borrado", completed: false },
    { id: 10, text: "Refactorizar estilos usando CSS Modules o Styled Components", completed: false },
    { id: 11, text: "Añadir transiciones suaves a la adición/eliminación de tareas", completed: false },
    { id: 12, text: "Test unitarios básicos para las funciones del Service", completed: false },
    { id: 13, text: "Asegurar la accesibilidad (ARIA attributes) en TaskList", completed: false },
    { id: 14, text: "Implementar un filtro por texto en el Frontend", completed: false },
    { id: 15, text: "Mejorar la gestión de errores visuales para el usuario", completed: false },
    { id: 16, text: "Añadir soporte para 'Enter' al crear nuevas tareas", completed: false },
    { id: 17, text: "Revisión de rendimiento con React Profiler", completed: false },
    { id: 18, text: "Crear documentación de la API con Swagger simulado", completed: false },
    { id: 19, text: "Diseñar un logo futurista para el encabezado", completed: false },
    { id: 20, text: "Revisar la compatibilidad en distintos navegadores (cross-browser)", completed: false },
];

let nextId = 21;

const getAllTasks = () => tasks;

const addTask = (text) => {
    const newTask = {
        id: nextId++,
        text: text,
        completed: false,
    };
    tasks.push(newTask);
    return newTask;
};

const toggleTask = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return null; 
    }

    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    return tasks[taskIndex];
};

const deleteTask = (id) => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return tasks.length < initialLength; 
};

const clearCompletedTasks = () => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => !task.completed);
    return tasks.length < initialLength;
};

module.exports = {
    getAllTasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
};