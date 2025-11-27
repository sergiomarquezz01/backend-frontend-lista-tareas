// backend/server.js

const express = require('express');
const cors = require('cors');
const taskController = require('./src/controllers/taskController'); 
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.get('/api/tasks', taskController.getTasks);
app.post('/api/tasks', taskController.createTask);
app.put('/api/tasks/:id', taskController.updateTask);
app.delete('/api/tasks/:id', taskController.removeTask);

app.delete('/api/tasks/completed', taskController.clearCompleted);

app.listen(PORT, () => {
    console.log(`Backend profesional corriendo en http://localhost:${PORT}`);
});