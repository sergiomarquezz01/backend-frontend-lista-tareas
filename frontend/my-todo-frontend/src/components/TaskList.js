import React from 'react';
import TaskItem from './TaskItem';


function TaskList({ title, tasks, onToggle, onDelete, onStartEdit, emptyMessage }) { 
    if (!tasks || tasks.length === 0) {
        return (
            <div className="task-list-container">
                <h2>{title}</h2>
                <p className="empty-message">{emptyMessage}</p>
            </div>
        );
    }
    
    return (
        <div className="task-list-container">
            <h2>{title}</h2>
            <ul className="task-list">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onStartEdit={onStartEdit}
                    />
                ))}
            </ul>
        </div>
    );
}

export default TaskList;