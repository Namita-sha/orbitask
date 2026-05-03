# 🚀 Orbitask

> **Team project & task management — built for real teams, deployed for real use.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://orbitask-git-main-namitas-projects-79f16caf.vercel.app)
[![Backend](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render)](https://orbitask-backend-2d09.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Namita--sha/orbitask-181717?style=for-the-badge&logo=github)](https://github.com/Namita-sha/orbitask)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/atlas)

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| 🖥️ Frontend (Vercel) | https://orbitask-h4o3kiwbq-namitas-projects-79f16caf.vercel.app |
| ⚙️ Backend API (Render) | https://orbitask-backend-2d09.onrender.com |
| 📂 GitHub Repository | https://github.com/Namita-sha/orbitask |

---

## 📸 What is Orbitask?

**Orbitask** is a full-stack project and task management web application with **role-based access control (RBAC)**. It allows teams to organize work, assign tasks, and track progress — all in one place.

Built as a production-ready app using the **MERN stack** (MongoDB, Express, React, Node.js), Orbitask is deployed live and fully functional for public use.

---

## ✨ Key Features

### 🔐 Authentication
- Secure **Signup & Login** using JWT tokens
- Passwords hashed with **bcrypt** (never stored as plain text)
- Tokens last **30 days**, auto-logout on expiry
- **First user** to sign up is automatically assigned the **Admin** role

### 👥 Role-Based Access Control (RBAC)

| Feature | Admin | Member |
|---------|:-----:|:------:|
| Create projects | ✅ | ✅ |
| Delete own projects | ✅ | ✅ |
| Delete any project | ✅ | ❌ |
| Add / remove members | ✅ | ❌ |
| Create tasks | ✅ | ✅ |
| Delete any task | ✅ | ❌ |
| Delete own tasks | ✅ | ✅ |
| View Team page | ✅ | ❌ |

### 📁 Project Management
- Create projects with **name, description, color, priority** and **due date**
- Assign multiple team members per project
- Track overall project progress with **animated progress bars**
- Filter projects by status: **Active, On Hold, Completed**
- Search projects by name

### ✅ Task Management
- Create tasks with **title, description, priority, assignee** and **due date**
- **4-column Kanban board** per project (Todo → In Progress → Review → Done)
- Priority levels: **Low, Medium, High, Critical**
- **Overdue task detection** with red highlighting
- Edit tasks inline by clicking on them

### 📊 Dashboard
- Total projects, total tasks, tasks assigned to you, overdue count
- **Task status breakdown** with animated progress bars
- **Recent activity feed** showing latest 5 tasks

### 👨‍💼 Team Management (Admin only)
- View all registered users
- See each member's role and join date

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests with JWT interceptor |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |
| date-fns | Date formatting and overdue detection |
| Custom CSS | Cosmic gradient design system (blue → purple → pink) |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT creation and verification |
| express-validator | Request input validation |
| cors | Cross-origin request handling |
| dotenv | Environment variable management |

### Database & Deployment
| Tool | Purpose |
|------|---------|
| MongoDB Atlas | Cloud NoSQL database (free tier) |
| Render | Backend deployment |
| Vercel | Frontend deployment |
| GitHub | Version control and CI/CD trigger |

---

## 📁 Project Structure

```
orbitask/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema — name, email, password, role
│   │   ├── Project.js           # Project schema — name, members, status, color, priority
│   │   └── Task.js              # Task schema — title, status, priority, assignee, due date
│   ├── routes/
│   │   ├── auth.js              # POST /signup, POST /login, GET /me, GET /users
│   │   ├── projects.js          # Full CRUD + member add/remove
│   │   └── tasks.js             # Full CRUD + dashboard stats + my tasks
│   ├── middleware/
│   │   └── auth.js              # protect middleware, adminOnly, generateToken
│   ├── server.js                # Express app entry point + MongoDB connection
│   ├── .env                     # Environment variables (not committed to git)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js             # Axios instance — attaches JWT to every request
    │   ├── components/
    │   │   ├── Sidebar.jsx          # Navigation sidebar with role-aware links
    │   │   ├── TaskCard.jsx         # Kanban task card with priority and overdue state
    │   │   ├── ProjectCard.jsx      # Project grid card with progress bar
    │   │   └── ProtectedRoute.jsx   # Redirects unauthenticated users to /login
    │   ├── context/
    │   │   └── AuthContext.jsx      # Global auth state — user, token, login, logout
    │   ├── pages/
    │   │   ├── Login.jsx            # Login form with JWT storage
    │   │   ├── Signup.jsx           # Signup form with role selection
    │   │   ├── Dashboard.jsx        # Stats, task breakdown, recent activity
    │   │   ├── Projects.jsx         # Project grid with search and status filter
    │   │   ├── ProjectDetail.jsx    # Kanban board + member management
    │   │   ├── Tasks.jsx            # My assigned tasks in table view
    │   │   └── Team.jsx             # Admin-only user list
    │   ├── App.jsx                  # Routes + AuthProvider wrapper
    │   ├── App.css                  # Full design system (cosmic gradient theme)
    │   └── main.jsx                 # React DOM entry point
    ├── vercel.json                  # Vercel SPA rewrite rules
    ├── index.html
    └── package.json
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Register new user. First user becomes Admin automatically |
| POST | `/login` | Public | Login and receive JWT token |
| GET | `/me` | Protected | Get currently logged-in user data |
| GET | `/users` | Protected | List all users (used for member assignment) |

### Projects — `/api/projects`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get all projects the user owns or is a member of |
| POST | `/` | Protected | Create a new project |
| GET | `/:id` | Protected | Get a single project's full details |
| PUT | `/:id` | Owner / Admin | Update project name, status, priority etc. |
| DELETE | `/:id` | Owner / Admin | Delete project and all its tasks |
| POST | `/:id/members` | Owner / Admin | Add a user as a member to the project |
| DELETE | `/:id/members/:userId` | Owner / Admin | Remove a member from the project |

### Tasks — `/api/tasks`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Protected | Returns stats for dashboard (counts, status breakdown, recent tasks) |
| GET | `/my` | Protected | Get all tasks assigned to the currently logged-in user |
| GET | `/` | Protected | Get tasks with optional filters: project, status, priority, assignedTo |
| POST | `/` | Protected | Create a new task inside a project |
| PUT | `/:id` | Protected | Update task title, status, priority, assignee, due date |
| DELETE | `/:id` | Owner / Creator / Admin | Delete a task |

---

## ⚙️ Local Setup Guide

### Prerequisites
- **Node.js v18+** → [nodejs.org](https://nodejs.org) → download LTS
- **Git** → [git-scm.com](https://git-scm.com)
- **MongoDB Atlas free account** → [mongodb.com/atlas](https://mongodb.com/atlas)
- **VS Code** → [code.visualstudio.com](https://code.visualstudio.com)

### 1. Clone the repository
```bash
git clone https://github.com/Namita-sha/orbitask.git
cd orbitask
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/orbitask
JWT_SECRET=orbitask_super_secret_jwt_key_2024
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Open your browser at **http://localhost:5173** 🎉

---

## 🚀 Deployment Details

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | Free |

**Environment Variables set on Render:**

```
MONGO_URI     = mongodb+srv://...your atlas uri.../orbitask
JWT_SECRET    = orbitask_super_secret_jwt_key_2024
NODE_ENV      = production
FRONTEND_URL  = https://orbitask-h4o3kiwbq-namitas-projects-79f16caf.vercel.app
```

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment Variable set on Vercel:**

```
VITE_API_URL = https://orbitask-backend-2d09.onrender.com/api
```

The `vercel.json` file in the frontend folder handles SPA routing so page refreshes do not return 404.

---

## 🔒 Environment Variables Reference

### Backend `.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server runs on (Render sets this automatically in production) |
| `MONGO_URI` | Full MongoDB Atlas connection string including database name `/orbitask` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens — keep this private |
| `NODE_ENV` | Set to `development` locally and `production` on Render |
| `FRONTEND_URL` | Your Vercel frontend URL — used for CORS whitelist |

### Frontend `.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your Render backend URL with `/api` appended at the end |

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Blank page on Vercel | Wrong Root Directory | Set Root Directory to `frontend` in Vercel project settings |
| API calls failing | Wrong `VITE_API_URL` | Make sure it ends with `/api` then redeploy on Vercel |
| CORS error in console | `FRONTEND_URL` mismatch on Render | Update `FRONTEND_URL` on Render to exact Vercel URL with no trailing slash |
| MongoDB connection error | Wrong `MONGO_URI` | Re-copy from Atlas, replace `<password>`, add `/orbitask` before `?` |
| Render slow to respond | Free tier sleep after 15 min | First request takes 30–60 seconds to wake up — this is normal on free plan |
| 404 on page refresh | Missing rewrite rules | Make sure `frontend/vercel.json` exists with rewrite config |
| Cannot find module error | Wrong Root Directory on Render | Set Root Directory to `backend` in Render service settings |

---

## 📋 Git Commit History

```
feat: initial project setup with Express server and MongoDB connection
feat: add User model with bcrypt password hashing
feat: add Project and Task mongoose models with relationships
feat: add JWT authentication — signup, login, protect middleware
feat: add project CRUD API with member management and RBAC
feat: add task CRUD API with dashboard stats and overdue detection
feat: setup Vite React frontend with React Router and AuthContext
feat: build Login and Signup pages with validation
feat: build Dashboard with stat cards, task breakdown, activity feed
feat: build Projects page with search, filter and project cards
feat: build ProjectDetail Kanban board with task modals
feat: build My Tasks table page with status and overdue filters
feat: build Admin-only Team page
feat: apply cosmic gradient theme — blue purple pink design system
fix: add vercel.json SPA rewrite rules for frontend routing
fix: update CORS to support multiple origins for deployment
chore: add environment variable configs for Render and Vercel
docs: add complete README with live URLs and setup guide
```

---

## 👩‍💻 Author

**Namita**
- GitHub: [@Namita-sha](https://github.com/Namita-sha)
- Live App: [orbitask on Vercel](https://orbitask-h4o3kiwbq-namitas-projects-79f16caf.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React · Express · Node.js · MongoDB**

[🌐 Live Demo](https://orbitask-h4o3kiwbq-namitas-projects-79f16caf.vercel.app) &nbsp;·&nbsp; [⚙️ API](https://orbitask-backend-2d09.onrender.com) &nbsp;·&nbsp; [📂 GitHub](https://github.com/Namita-sha/orbitask)

</div>
