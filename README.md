# AI-based-Job-Portal
AI-powered Job Portal built with React, Node.js, MySQL, and Ollama LLM that provides intelligent job recommendations, AI-generated job descriptions, secure authentication, and job management features.

# 🤖 AI-Based Job Portal

An AI-powered Job Portal that connects job seekers with recruiters using intelligent job recommendations and AI-generated job descriptions.

The project integrates a Large Language Model (LLM) using Ollama to enhance the recruitment experience through smart recommendations and automated content generation.

---

## Features

### User

- User Registration & Login
- Secure Authentication
- Browse Available Jobs
- Search Jobs
- Apply for Jobs
- View Job Details
- AI-Based Job Recommendation
- Responsive UI

### Admin

- Admin Login
- Add Jobs
- Edit Jobs
- Delete Jobs
- Manage Job Listings
- AI Job Description Generator

### AI Features

- Personalized Job Recommendations
- AI-generated Job Descriptions
- Semantic Matching using LLM
- Intelligent Career Assistance

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Artificial Intelligence

- Ollama
- Mistral LLM
- Phi LLM (optional)

### Other Tools

- XAMPP
- Git
- GitHub
- VS Code

---

## Project Structure

AI-Based-Job-Portal

backend/
frontend/
database/
screenshots/

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/AI-Based-Job-Portal.git
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jobportal
JWT_SECRET=your_secret_key
OLLAMA_URL=http://localhost:11434
```

Run backend

```bash
npm start
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### Database

Import

```
database/jobportal.sql
```

using phpMyAdmin or MySQL.

---

### Install Ollama

Download Ollama

https://ollama.com

Pull model

```bash
ollama pull mistral
```

Run model

```bash
ollama run mistral
```

---

##  Screenshots

| Home | Login |
|------|-------|
| ![](screenshots/home.png) | ![](screenshots/login.png) |

| AI Recommendation | Admin Dashboard |
|-------------------|-----------------|
| ![](screenshots/ai-recommendation.png) | ![](screenshots/admin-dashboard.png) |

---

## Future Enhancements

- Resume Parser
- AI Resume Ranking
- Interview Question Generator
- Email Notifications
- Resume Matching
- Chatbot Support
- Company Dashboard
- Video Interview Integration

---

## Author

**Avani Mehta**

BCA Final Year Student

AI & Machine Learning Enthusiast

---

## License

MIT License
