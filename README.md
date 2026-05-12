# Task Manager API

A RESTful API for managing tasks and users, built with **Node.js**, **Express**, and **MongoDB Atlas**.

## Tech Stack

| Tech | Purpose |
|------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database (NoSQL) |
| Mongoose | MongoDB object modeling |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |

## Project Structure

```
src/
├── config/db.js       # MongoDB connection
├── middleware/auth.js # JWT authentication guard
├── models/
│   ├── User.js        # User schema
│   └── Task.js        # Task schema
└── routes/
    ├── auth.js        # Register & Login
    └── tasks.js       # Task CRUD operations
server.js              # Entry point
```

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your MongoDB Atlas URI and a JWT secret.

### 3. Run the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Tasks (requires `Authorization: Bearer <token>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (add `?status=pending` to filter) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: Register

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Example: Create Task

```json
POST /api/tasks
Authorization: Bearer <your_token>

{
  "title": "Build the API",
  "description": "Complete the task manager project",
  "priority": "high",
  "status": "in-progress",
  "dueDate": "2026-06-01"
}
```

## Task Fields

| Field | Type | Options |
|-------|------|---------|
| title | String | required |
| description | String | optional |
| status | String | `pending`, `in-progress`, `completed` |
| priority | String | `low`, `medium`, `high` |
| dueDate | Date | optional |
