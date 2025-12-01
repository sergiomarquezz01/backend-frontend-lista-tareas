import React, { useState, useEffect } from 'react';
import { useTaskReducer } from './hooks/useTaskReducer';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskEditForm from './components/TaskEditForm'; 
import './App.css';


const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
  
    return savedTheme ? savedTheme === 'dark' : true; 
};


function App() {
    const { 
        tasks, 
        loading, 
        error, 
        addTask,        
        toggleTask, 
        deleteTask, 
        clearCompletedTasks,
        updateTask, 
    } = useTaskReducer(); 

    const [editingTask, setEditingTask] = useState(null); 


    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

   
    useEffect(() => {
       
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
        

        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };



    const handleStartEdit = (task) => {
        setEditingTask(task);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const handleSaveEdit = async (updatedTaskData) => {
        try {
            await updateTask(updatedTaskData); 
            setEditingTask(null);
        } catch (err) {
            console.error("Error al guardar la edición:", err);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="loading-state">Cargando tareas...</div>;
        }
        if (error) {
            return <div className="error-state">ERROR: {error}</div>;
        }
        if (editingTask) {
            return (
                <TaskEditForm 
                    task={editingTask}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            );
        }
        return (
            <TaskList 
                tasks={tasks} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onStartEdit={handleStartEdit} 
            />
        );
    };


    return (
        <div className="App">
            <header>
                <h1>Lista de Tareas (Dev Project)</h1>
                
                {/* 5. 🎯 BOTÓN PARA ACTIVAR/DESACTIVAR EL MODO OSCURO */}
                <button className="theme-toggle-button" onClick={toggleTheme}>
                    {isDarkMode ? '🌞 Modo Claro' : '🌙 Modo Oscuro'}
                </button>
            </header>
            
            {!editingTask && <TaskForm onAddTask={addTask} />}
            
            <main>
                {renderContent()}
            </main>

            <footer>
                <p>Tareas completadas: {tasks.filter(t => t.completed).length} de {tasks.length}</p>
                <button 
                    onClick={clearCompletedTasks} 
                    disabled={tasks.filter(t => t.completed).length === 0 || editingTask}
                    className="clear-button"
                >
                    Limpiar completadas
                </button>
            </footer>
        </div>
    );
}

export default App;