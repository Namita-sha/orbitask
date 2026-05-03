# 🚀 Orbitask

> **Team project & task management — built for real teams, deployed for real use.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Railway-blueviolet?style=for-the-badge)](https://your-frontend.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME/orbitask)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/atlas)

---

## 🌐 Live URL

| Service | URL |
|---------|-----|
| Frontend | `https://your-frontend.up.railway.app` |
| Backend API | `https://your-backend.up.railway.app` |

> ⚠️ Replace these with your actual Railway deployment URLs after deploying.

---

## 📸 What is Orbitask?

Orbitask is a full-stack project and task management web application with **role-based access control**. It allows teams to:

- Create and manage multiple projects
- Assign tasks to team members
- Track task progress using a **Kanban board** (Todo → In Progress → Review → Done)
- View a **real-time dashboard** showing stats, overdue tasks, and recent activity
- Control access through **Admin** and **Member** roles

---

## ✨ Features

### 🔐 Authentication
- Secure Signup & Login using **JWT tokens**
- Passwords hashed with **bcrypt**
- Tokens last 30 days, auto-logout on expiry
- First user to sign up is automatically assigned **Admin** role

### 👥 Role-Based Access Control
| Feature | Admin | Member |
|---------|-------|--------|
| Create projects | ✅ | ✅ |
| Delete projects | ✅ Owner only | ❌ |
| Add/remove members | ✅ | ❌ |
| Create tasks | ✅ | ✅ |
| Delete any task | ✅ | Own tasks only |
| View Team page | ✅ | ❌ |

### 📁 Project Management
- Create projects with name, description, color, priority, and due date
- Assign multiple team members per project
- Track overall project progress with animated progress bars
- Filter projects by status: Active, On Hold, Completed

### ✅ Task Management
- Create tasks with title, description, priority, assignee, and due date
- **4-column Kanban board** per project
- Priority levels: Low, Medium, High, Critical
- Overdue task detection and highlighting

### 📊 Dashboard
- Total projects, total tasks, tasks assigned to you, overdue count
- Task status breakdown with progress visualization
- Recent activity feed

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| date-fns | Date formatting |
| Custom CSS | Cosmic gradient design system |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| express-validator | Input validation |
| cors | Cross-origin requests |
| dotenv | Environment variables |

### Database & Deployment
| Tool | Purpose |
|------|---------|
| MongoDB Atlas | Cloud database (free tier) |
| Railway | Full-stack deployment |
| Git + GitHub | Version control |

---

## 📁 Project Structure

```
orbitask/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password, role)
│   │   ├── Project.js       # Project schema (name, members, status, color)
│   │   └── Task.js          # Task schema (title, status, priority, assignee)
│   ├── routes/
│   │   ├── auth.js          # Signup, Login, /me, /users
│   │   ├── projects.js      # CRUD + member management
│   │   └── tasks.js         # CRUD + dashboard + my tasks
│   ├── middleware/
│   │   └── auth.js          # protect, adminOnly, generateToken
│   ├── server.js            # Express app + MongoDB connection
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios instance with JWT interceptor
    │   ├── components/
    │   │   ├── Sidebar.jsx      # Navigation sidebar
    │   │   ├── TaskCard.jsx     # Kanban task card
    │   │   ├── ProjectCard.jsx  # Project grid card
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectDetail.jsx  # Kanban board
    │   │   ├── Tasks.jsx          # My tasks table
    │   │   └── Team.jsx           # Admin-only
    │   ├── App.jsx
    │   ├── App.css              # Full design system
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Register new user |
| POST | `/login` | Public | Login, get JWT token |
| GET | `/me` | Protected | Get current user |
| GET | `/users` | Protected | List all users |

### Projects — `/api/projects`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get all accessible projects |
| POST | `/` | Protected | Create project |
| GET | `/:id` | Protected | Get single project |
| PUT | `/:id` | Owner/Admin | Update project |
| DELETE | `/:id` | Owner/Admin | Delete project + all its tasks |
| POST | `/:id/members` | Owner/Admin | Add member to project |
| DELETE | `/:id/members/:userId` | Owner/Admin | Remove member |

### Tasks — `/api/tasks`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Protected | Dashboard stats |
| GET | `/my` | Protected | Tasks assigned to current user |
| GET | `/` | Protected | Get tasks (filter by project/status) |
| POST | `/` | Protected | Create task |
| PUT | `/:id` | Protected | Update task |
| DELETE | `/:id` | Owner/Creator/Admin | Delete task |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+ — [Download](https://nodejs.org)
- Git — [Download](https://git-scm.com)
- MongoDB Atlas free account — [Sign up](https://mongodb.com/atlas)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/orbitask.git
cd orbitask
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/orbitask
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Open your browser at `http://localhost:5173` 🎉

---

## 🚀 Deployment (Railway)

### Step 1 — Push to GitHub
```bash
cd orbitask
git init
echo "node_modules/\n.env\ndist/" > .gitignore
git add .
git commit -m "feat: initial Orbitask setup"
git remote add origin https://github.com/YOUR_USERNAME/orbitask.git
git push -u origin main
```

### Step 2 — Deploy Backend on Railway
1. Go to [railway.app](https://railway.app) → sign in with GitHub
2. New Project → Deploy from GitHub repo → select `orbitask`
3. Add Service → GitHub Repo → set **Root Directory** to `backend`
4. Go to **Variables** tab and add:
```
MONGO_URI        = your_mongodb_atlas_uri
JWT_SECRET       = your_secret_key
NODE_ENV         = production
PORT             = 5000
FRONTEND_URL     = https://your-frontend.up.railway.app
```
5. Deploy — copy the generated backend URL

### Step 3 — Deploy Frontend on Railway
1. In same Railway project → New Service → GitHub Repo
2. Set **Root Directory** to `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npx serve dist -l 3000`
5. Add **Variable**:
```
VITE_API_URL = https://your-backend.up.railway.app/api
```
6. Deploy — copy the frontend URL

### Step 4 — Update CORS
Go back to your backend Railway service → Variables → update `FRONTEND_URL` to your actual frontend Railway URL → redeploy.

---

## 🔒 Environment Variables Reference

### Backend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWT tokens | `any_long_random_string` |
| `NODE_ENV` | Environment | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot connect to MongoDB` | Check `MONGO_URI` in `.env` — ensure password has no special characters, or URL-encode them |
| `CORS error in browser` | Make sure `FRONTEND_URL` in backend env exactly matches your frontend URL (no trailing slash) |
| `404 on page refresh` | Add `serve.json` in frontend root: `{"rewrites":[{"source":"**","destination":"/index.html"}]}` |
| `Railway build fails` | Verify Root Directory is set correctly in Railway service settings |
| `Token expired / unauthorized` | Log out and log back in — tokens last 30 days |
| `Cannot find module` | Run `npm install` inside both `backend/` and `frontend/` directories |

---

## 📋 Git Commit History

```
feat: initial project setup with Express, MongoDB, Mongoose models
feat: add JWT authentication - signup, login, /me endpoints
feat: add project CRUD API with member management and RBAC
feat: add task CRUD API with dashboard stats and overdue detection
feat: setup Vite React frontend with routing and auth context
feat: build Login and Signup pages with form validation
feat: build Dashboard page with stat cards and activity feed
feat: build Projects page with search, filter, and project cards
feat: build ProjectDetail page with Kanban board and task modals
feat: build My Tasks table page with status filtering
feat: build Team page for Admin role
feat: apply cosmic gradient theme (blue-purple-pink design system)
chore: add Railway deployment config and README
```

---

## 👨‍💻 Author

**Namit**
- GitHub:(https://github.com/Namita-sha/orbitask)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React, Express, Node.js & MongoDB**

[🌐 Live Demo](https://your-frontend.up.railway.app) · [🐛 Report Bug](https://github.com/YOUR_USERNAME/orbitask/issues) · [✨ Request Feature](https://github.com/YOUR_USERNAME/orbitask/issues)

</div>