// frontend/src/components/TaskList.js

import React from 'react';

function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <li 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''}`}
      
          style={{ animation: 'slideIn 0.4s ease-out', animationDelay: `${index * 0.05}s` }}
        >
          <span 
            className="task-text"
            onClick={() => onToggle(task.id)}
          >
            {task.text}
          </span>
          <div className="task-actions">
            <button 
                className="delete-button" 
                onClick={() => onDelete(task.id)}
                title="Eliminar tarea"
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;