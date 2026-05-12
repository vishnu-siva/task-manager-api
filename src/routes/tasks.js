const express = require('express');
const Task = require('../models/Task');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes below require a valid JWT token
router.use(protect);

// GET /api/tasks — get all tasks for logged-in user (optional ?status= filter)
router.get('/', async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks — create a new task
router.post('/', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    dueDate,
  });

  res.status(201).json(task);
});

// GET /api/tasks/:id — get a single task
router.get('/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

// PUT /api/tasks/:id — update a task
router.put('/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const { title, description, status, priority, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  const updated = await task.save();
  res.json(updated);
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted' });
});

module.exports = router;
