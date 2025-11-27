// frontend/src/hooks/useTaskReducer.js

import { useReducer, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/tasks';

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload, loading: false };
        case 'ADD_TASK':
            return { ...state, tasks: [action.payload, ...state.tasks] };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case 'REMOVE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload),
            };
        case 'CLEAR_COMPLETED':
            
            return {
                ...state,
                tasks: state.tasks.filter(task => !task.completed),
            };
        case 'LOADING_START':
            return { ...state, loading: true };
        case 'LOADING_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    tasks: [],
    loading: true,
    error: null,
};


export const useTaskReducer = () => {
    const [state, dispatch] = useReducer(taskReducer, initialState);

   
    useEffect(() => {
        const fetchTasks = async () => {
            dispatch({ type: 'LOADING_START' });
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Error al cargar tareas');
                const data = await response.json();
                dispatch({ type: 'SET_TASKS', payload: data });
            } catch (error) {
                dispatch({ type: 'LOADING_FAIL', payload: error.message });
                console.error("Error al cargar tareas:", error);
            }
        };
        fetchTasks();
    }, []);

    
    const addTask = async (text) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const newTask = await response.json();
            dispatch({ type: 'ADD_TASK', payload: newTask });
        } catch (error) {
            console.error("Error al añadir tarea:", error);
        }
    };

    const toggleTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
            const updatedTask = await response.json();
            dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            dispatch({ type: 'REMOVE_TASK', payload: id });
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    const clearCompletedTasks = async () => {
        try {
            await fetch(`${API_URL}/completed`, { method: 'DELETE' });
            dispatch({ type: 'CLEAR_COMPLETED' });
        } catch (error) {
            console.error("Error al limpiar completadas:", error);
        }
    };

    return {
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        addTask,
        toggleTask,
        deleteTask,
        clearCompletedTasks,
    };
};