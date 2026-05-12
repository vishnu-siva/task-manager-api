const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

module.exports = app;
