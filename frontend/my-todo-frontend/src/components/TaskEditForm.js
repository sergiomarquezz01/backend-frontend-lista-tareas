import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../services/CategoryService';
import { fetchTags } from '../services/TagService';


function TaskEditForm({ task, onSave, onCancel }) {
    
    // 1. Initial State Setup
    const [text, setText] = useState(task.text);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    // Ensure category ID is converted to string for <select> and defaults to empty if null
    const [selectedCategoryId, setSelectedCategoryId] = useState(task.category ? task.category.id.toString() : ''); 
    
    // Map initial tags to an array of IDs
    const [selectedTagIds, setSelectedTagIds] = useState(task.tags.map(tag => tag.id)); 
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Data Fetching (Categories and Tags)
    useEffect(() => {
        async function loadFormData() {
            try {
                const fetchedCategories = await fetchCategories();
                // 🛑 CORRECTION: Removed duplicate 'await'
                const fetchedTags = await fetchTags(); 

                setCategories(fetchedCategories);
                setTags(fetchedTags);
                setError(null);
            } catch (err) {
                // Log the full error for better debugging
                console.error("Error loading form data:", err); 
                setError("Error al cargar categorías/etiquetas: " + err.message);
            } finally {
                setLoading(false);
            }
        }
        loadFormData();
    }, []); // Empty dependency array ensures this runs only once

    // 3. Handlers
    
    const handleTagChange = (tagId) => {
        const id = parseInt(tagId);
        
        setSelectedTagIds(prevIds => {
            if (prevIds.includes(id)) {
                // Remove ID if already present
                return prevIds.filter(prevId => prevId !== id);
            } else {
                // Add ID if not present
                return [...prevIds, id];
            }
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Prevent submission if text is empty
        if (!text.trim()) return;

        // Build the updated task object for the API
        const updatedTask = {
            ...task,
            text: text,
            
            // Convert back to integer or null before sending to API
            category_id: selectedCategoryId === '' ? null : parseInt(selectedCategoryId),
            
            // Send the array of selected Tag IDs
            tags: selectedTagIds
        };
        
        // Call the external onSave function (e.g., updateTask in App.js)
        onSave(updatedTask);
    };

    // 4. Loading and Error States
    if (loading) return <div className="loading">Cargando datos de edición...</div>;
    if (error) return <div className="error-message">{error}</div>;

    // 5. Render Form
    return (
        <form className="task-edit-form" onSubmit={handleSubmit}>
            <p className="edit-title">Editando Tarea ID: **{task.id}**</p>
            <div className="task-input-group">
                {/* 1. Campo de texto */}
                <input
                    type="text"
                    placeholder="Editar tarea..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                
                {/* 2. Selector de Categoría */}
                <select
                    className="category-select"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                    <option value="">-- Sin Categoría --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 3. Selector de Etiquetas */}
            <div className="tags-selection-panel">
                <p className="tags-title">Etiquetas:</p>
                <div className="tags-checkbox-group">
                    {tags.map(tag => (
                        <label key={tag.id} className="tag-checkbox-label">
                            <input
                                type="checkbox"
                                // Value must be the tag ID for proper handling
                                value={tag.id}
                                
                                // Check if the ID is in the selectedTagIds array
                                checked={selectedTagIds.includes(tag.id)} 
                                
                                // Call handler with the tag ID
                                onChange={() => handleTagChange(tag.id)}
                            />
                            <span>{tag.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            {/* 4. Botones de acción */}
            <div className="edit-actions">
                <button type="submit" className="save-button" disabled={!text.trim()}>
                    GUARDAR CAMBIOS
                </button>
                <button type="button" className="cancel-button" onClick={onCancel}>
                    CANCELAR
                </button>
            </div>
        </form>
    );
}

export default TaskEditForm;