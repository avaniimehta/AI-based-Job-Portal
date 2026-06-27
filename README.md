# 💼 CareerNest- AI based JobPortal

A complete job portal with **React frontend** + **Node.js/Express backend** + **MySQL database**.

---

## Features
- **Job Seekers**: Register, browse jobs, apply, track application status, manage profile
- **Admins**: Post/edit/delete jobs, manage all applications & update statuses, view all users, analytics dashboard with charts

---

## Tech Stack
| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 19, Vite, React Router, Recharts |
| Backend  | Node.js, Express, Socket.IO       |
| Database | MySQL 8                           |
| Auth     | JWT + bcrypt                      |

---

## 🚀 How to Run

### Step 1 — Set up MySQL

Make sure MySQL is running, then:

```bash
mysql -u root -p < database.sql
```

This creates the `jobportal` database, all tables, and seeds sample data.

---

### Step 2 — Configure Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your MySQL password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jobportal
JWT_SECRET=any_long_random_string
PORT=5000
```

Install and start:
```bash
npm install
npm run dev       # development (auto-restart)
# or
npm start         # production
```

Backend runs on → http://localhost:5000

---

### Step 3 — Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → http://localhost:5173

---

## 🔑 Default Login Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@jobportal.com    | admin123  |

Register a new account for job seeker access.

---

## 📁 Project Structure

```
jobportal/
├── database.sql              ← Run this first!
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── config/db.js
│   ├── middleware/auth.js
│   └── routes/
│       ├── auth.js
│       ├── jobs.js
│       ├── applications.js
│       ├── users.js
│       └── stats.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/AuthContext.jsx
        ├── utils/api.js
        ├── components/Navbar.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── student/
            │   ├── Jobs.jsx
            │   ├── MyApplications.jsx
            │   └── Profile.jsx
            └── admin/
                ├── Dashboard.jsx
                ├── Jobs.jsx
                ├── Applications.jsx
                └── Users.jsx
```
