// frontend/src/App.js

import React from 'react';
import './App.css'; 
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { useTaskReducer } from './hooks/useTaskReducer'; 

function App() {

  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    toggleTask, 
    deleteTask, 
    clearCompletedTasks 
  } = useTaskReducer();

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="App">
      <header className="App-header">
        <h1>✅ Lista de Tareas Diarias </h1>
        <p className="task-summary">
          **{pendingTasks.length}** Pendientes | **{completedTasks.length}** Completadas
        </p>
      </header>

      <TaskForm onAddTask={addTask} />

      {/* Manejo de errores de nivel profesional */}
      {error && <div className="error-message">Error: {error}</div>}
      
      {loading ? (
        <div className="loading">Cargando tareas...</div>
      ) : (
        <>
          <section className="task-section">
            <h2>Tareas Pendientes</h2>
            <TaskList tasks={pendingTasks} onToggle={toggleTask} onDelete={deleteTask} />
            {pendingTasks.length === 0 && <p className="empty-message">🎉 ¡No tienes tareas pendientes!</p>}
          </section>

          <section className="task-section completed-tasks">
            <div className="section-header">
                <h2>Tareas Completadas</h2>
                {/* 🌟 BOTÓN DE LIMPIEZA PROFESIONAL */}
                {completedTasks.length > 0 && (
                    <button 
                        className="clear-button" 
                        onClick={clearCompletedTasks}
                    >
                        🗑️ Limpiar ({completedTasks.length})
                    </button>
                )}
            </div>
            <TaskList tasks={completedTasks} onToggle={toggleTask} onDelete={deleteTask} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;