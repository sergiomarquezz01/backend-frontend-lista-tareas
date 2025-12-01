import React from 'react';

function TaskItem({ task, onToggle, onDelete, onStartEdit }) { 

    const category = task.category || {};
    const tags = task.tags || [];

    const handleToggle = () => {
      
        onToggle(task.id, !task.completed); 
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            {/* 1. Checkbox */}
            <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggle} 
            />
            
            <div className="task-content">
                <span className="task-text">{task.text}</span>
                
                <div className="task-details">
                    {/* 2. Categoría con color */}
                    {category.name && (
                        <span 
                            className="task-category" 
                            style={{ backgroundColor: category.color || '#ccc' }}
                        >
                            {category.name}
                        </span>
                    )}

                    {/* 3. Etiquetas */}
                    {tags.length > 0 && (
                        <div className="task-tags">
                            {tags.map(tag => (
                                <span key={tag.id} className="task-tag">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="task-actions">
                {/* 4. Botón de Edición (llama a la función en App.js) */}
                <button 
                    className="edit-button" 
                    onClick={() => onStartEdit(task)} 
                    title="Editar Tarea"
                >
                    <span role="img" aria-label="Editar">✏️</span> 
                </button>
                
                {/* 5. Botón de Eliminar */}
                <button onClick={() => onDelete(task.id)} title="Eliminar Tarea">
                    <span role="img" aria-label="Eliminar">🗑️</span>
                </button>
            </div>
        </div>
    );
}

export default TaskItem;