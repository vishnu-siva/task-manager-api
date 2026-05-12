import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const STATUSES = ['all', 'pending', 'in-progress', 'completed']
const PRIORITIES = ['low', 'medium', 'high']

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' })
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const user = localStorage.getItem('user')

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login')
    else fetchTasks()
  }, [filter])

  const fetchTasks = async () => {
    const params = filter !== 'all' ? { status: filter } : {}
    const res = await api.get('/tasks', { params })
    setTasks(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) {
      await api.put(`/tasks/${editId}`, form)
    } else {
      await api.post('/tasks', form)
    }
    setForm({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' })
    setEditId(null)
    setShowForm(false)
    fetchTasks()
  }

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    })
    setEditId(task._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const statusColor = { pending: '#f59e0b', 'in-progress': '#3b82f6', completed: '#10b981' }

  return (
    <div className="dashboard">
      <header className="navbar">
        <h1>Task Manager</h1>
        <div className="nav-right">
          <span>Hi, {user}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="main">
        <div className="toolbar">
          <div className="filters">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' }) }}>
            + New Task
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editId ? 'Edit Task' : 'New Task'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Task title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['pending', 'in-progress', 'completed'].map((s) => <option key={s}>{s}</option>)}
                </select>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="empty">No tasks found. Click "+ New Task" to get started.</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className="badge" style={{ background: statusColor[task.status] }}>{task.status}</span>
                </div>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-meta">
                  <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                  {task.dueDate && <span className="due">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
                <div className="task-actions">
                  <button onClick={() => handleEdit(task)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
