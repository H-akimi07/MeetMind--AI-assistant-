# MeetMind — AI Meeting Assistant

MeetMind is a full-stack AI-powered meeting assistant designed to help users manage meetings, collaborate with others, and organize meeting information in one place.

The application provides features for creating and joining meetings, managing meeting files and tasks, viewing meeting information, and using AI-powered tools to improve meeting productivity.

## 🚀 Live Project

**Frontend:**
[https://meet-mind-ai-assistant.vercel.app/]

**Backend API:**
Add your Render URL here.

---

## ✨ Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 👤 User profile management
* 📅 Create and manage meetings
* 🤝 Join meetings using a meeting code
* 📁 Meeting file management
* 📝 Meeting tasks
* 🤖 AI-powered meeting features
* 📊 Meeting analytics
* 📋 AI summaries
* ⚙️ User settings
* 📱 Responsive user interface
* 🔒 Protected routes and authenticated API requests

---

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3
* React Router
* Axios
* React Icons
* Framer Motion
* Recharts
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* REST API
* CORS
* dotenv

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 📂 Project Structure

```text
MeetMind/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/H-akimi07/MeetMind--AI-assistant-.git
```

Move into the project:

```bash
cd MeetMind--AI-assistant-
```

---

## 💻 Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## 🖥️ Backend Setup

Open another terminal and go to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

Start the backend:

```bash
npm start
```

The backend will normally run at:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

### Frontend

The frontend uses:

```env
VITE_API_URL=your_backend_api_url
```

For production:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend

The backend uses:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
CLIENT_URL=your_frontend_url
NODE_ENV=production
```

### ⚠️ Security

Never commit your `.env` files to GitHub.

Make sure `.gitignore` includes:

```text
.env
.env.local
.env.production
node_modules/
dist/
```

---

## 🌐 Deployment

### Frontend — Vercel

The React/Vite frontend can be deployed using Vercel.

Recommended settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: frontend
```

Add the frontend environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

### Backend — Render

The Express backend can be deployed using Render.

Recommended settings:

```text
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add these environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

The backend should use the Render-provided port:

```js
const PORT = process.env.PORT || 5000;
```

---

## 🔗 API Overview

The backend provides REST API endpoints for different parts of the application.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Users

```text
GET /api/users/profile
PUT /api/users/profile
```

### Meetings

```text
POST /api/meetings
GET /api/meetings
GET /api/meetings/:id
PUT /api/meetings/:id
DELETE /api/meetings/:id
```

### Meeting Files

```text
POST /api/meetings/:id/files
```

> The exact available endpoints may change as the project continues to develop.

---

## 🔒 Authentication

MeetMind uses **JSON Web Tokens (JWT)** for authentication.

After logging in, the frontend stores the authentication token and uses it when making protected API requests.

Protected requests include an authorization header similar to:

```text
Authorization: Bearer <token>
```

---

## 🧪 Running the Project Locally

You need two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the frontend URL provided by Vite.

---

## 🎨 Design

MeetMind uses a modern, minimal, and professional interface designed for productivity.

The application focuses on:

* Clean dashboard organization
* Responsive layouts
* Easy meeting management
* Clear navigation
* AI-focused functionality
* Professional visual design

---

## 🎯 Project Goals

The main goals of MeetMind are to:

1. Make meeting management easier.
2. Keep meeting information organized.
3. Help users collaborate efficiently.
4. Reduce the time needed to review meeting information.
5. Use AI to improve productivity.
6. Provide a simple and modern user experience.

---

## 🚧 Future Improvements

Possible future features include:

* 🎙️ Real-time meeting transcription
* 🤖 More advanced AI meeting summaries
* 📌 Automatic action-item detection
* 🗣️ Voice-based AI assistant
* 📧 Email notifications
* 📅 Calendar integration
* 🔔 Meeting reminders
* 👥 Advanced team collaboration
* 📈 More detailed analytics
* ☁️ Improved file storage

---

## 👩‍💻 Author

**Samira Hakimi**

MeetMind was developed as a capstone full-stack web application project.

---

## 📄 License

This project is created for educational and portfolio purposes.
