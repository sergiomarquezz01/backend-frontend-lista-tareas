import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../services/CategoryService';
import { fetchTags } from '../services/TagService'; 

function TaskForm({ onAddTask }) {
    const [text, setText] = useState('');
    const [categories, setCategories] = useState([]); 
    const [tags, setTags] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

  
    useEffect(() => {
        async function loadFormData() {
            try {
                const fetchedCategories = await fetchCategories();
                const fetchedTags = await fetchTags();

                setCategories(fetchedCategories);
                setTags(fetchedTags);

                if (fetchedCategories.length > 0) {
                    setSelectedCategoryId(''); 
                }
                
                setError(null);
            } catch (err) {
              
                setError("Error al cargar categorías/etiquetas: " + err.message);
            } finally {
                
                setLoading(false);
            }
        }
        loadFormData();
    }, []);


    const handleTagChange = (tagId) => {
        const id = parseInt(tagId);
        
        setSelectedTagIds(prevIds => {
            if (prevIds.includes(id)) {
                return prevIds.filter(prevId => prevId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

     
        const finalCategoryId = selectedCategoryId === '' ? null : parseInt(selectedCategoryId);

        onAddTask(text, finalCategoryId, selectedTagIds); 

        setText('');
        setSelectedTagIds([]);
        setSelectedCategoryId(''); 
    };

  
    if (loading) return <div className="loading">Cargando categorías y etiquetas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-input-group">
                {/* 1. Campo de texto */}
                <input
                    type="text"
                    placeholder="Añadir una nueva tarea..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                
                {/* 2. Selector de Categoría (Usa categories) */}
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

                {/* 3. Botón Añadir */}
                <button type="submit" disabled={!text.trim()}>
                    AÑADIR
                </button>
            </div>
            
            {/* 4. Selector de Etiquetas (Usa tags) */}
            <div className="tags-selection-panel">
                <p className="tags-title">Etiquetas:</p>
                <div className="tags-checkbox-group">
                    {tags.map(tag => (
                        <label key={tag.id} className="tag-checkbox-label">
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={selectedTagIds.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                            />
                            <span>{tag.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </form>
    );
}

export default TaskForm;