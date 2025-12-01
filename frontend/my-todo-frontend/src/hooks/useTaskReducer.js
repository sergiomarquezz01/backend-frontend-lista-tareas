import { useReducer, useEffect, useCallback, useState } from 'react';
import { 
    fetchTasks, 
    createTask, 
    updateTaskStatus, 
    deleteTask, 
    clearCompletedTasks,
    editTask 
} from '../services/TaskService';


function taskReducer(tasks, action) {
    switch (action.type) {
        case 'SET_TASKS':
           
            return action.payload; 
        case 'ADD_TASK':
          
            return [action.payload, ...tasks]; 
        case 'TOGGLE_TASK':
      
            return tasks.map(task =>
                task.id === action.payload.id ? { ...task, completed: action.payload.completed } : task
            );
        case 'REMOVE_TASK':
       
            return tasks.filter(task => task.id !== action.payload);
        case 'CLEAR_COMPLETED':
            
            return tasks.filter(task => !task.completed);
        case 'UPDATE_TASK':
           
            return tasks.map(task => 
                task.id === action.payload.id ? action.payload : task
            );
        default:
            return tasks;
    }
}


export function useTaskReducer() {
    const [tasks, dispatch] = useReducer(taskReducer, []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const loadTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTasks();
            dispatch({ type: 'SET_TASKS', payload: data });
        } catch (err) {
            console.error("Error al cargar tareas:", err);
            setError("Error al cargar tareas: " + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

   
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    
    

    const addTask = async (text, category_id, tags) => {
        try {
         
            await createTask(text, category_id, tags);
            
            await loadTasks(); 

            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };


    const toggleTask = async (id, completed) => {
        try {
            
            await updateTaskStatus(id, completed);
            
            dispatch({ type: 'TOGGLE_TASK', payload: { id, completed } });
            
            setError(null);
        } catch (err) {
            setError(err.message);
           
            loadTasks(); 
        }
    };

    const removeTask = async (id) => {
        try {
            await deleteTask(id);
            dispatch({ type: 'REMOVE_TASK', payload: id });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const clearTasks = async () => {
        try {
            await clearCompletedTasks();
            dispatch({ type: 'CLEAR_COMPLETED' });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

 
    const updateTask = async (updatedTaskData) => {
        try {
            await editTask(updatedTaskData);
            
            await loadTasks(); 
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };


    return {
        tasks,
        loading,
        error,
        addTask, 
        toggleTask,
        deleteTask: removeTask, 
        clearCompletedTasks: clearTasks, 
        updateTask,
        dispatch, 
        setError, 
    };
}