// backend/src/controllers/taskController.js

const taskService = require('../services/taskService');

const getTasks = (req, res) => {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
};

const createTask = (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: "El campo 'text' es obligatorio." });
    }
    const newTask = taskService.addTask(text);
    res.status(201).json(newTask);
};

const updateTask = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = taskService.toggleTask(id);

    if (!updatedTask) {
        return res.status(404).json({ message: "Tarea no encontrada." });
    }
    res.json(updatedTask);
};

const removeTask = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = taskService.deleteTask(id);

    if (!deleted) {
        return res.status(404).json({ message: "Tarea no encontrada para eliminar." });
    }
    res.status(204).send();
};

const clearCompleted = (req, res) => {
    taskService.clearCompletedTasks();
    res.status(204).send();
};


module.exports = {
    getTasks,
    createTask,
    updateTask,
    removeTask,
    clearCompleted,
};