# MeetMind — AI Meeting Assistant 🤖

MeetMind is a full-stack AI-powered meeting assistant designed to help users **manage meetings, collaborate with others, organize meeting information, and turn meeting data into useful AI-powered insights**.

The platform brings meeting management, AI assistance, meeting analytics, files, tasks, and meeting-related information together in one modern web application.

MeetMind was developed as a **full-stack capstone project** using React, Node.js, Express, MongoDB, AI services, and third-party meeting integrations.

---

## 🌐 Live Project

### Frontend

**Live Application:**
https://meet-mind-ai-assistant.vercel.app/

### Backend API

**Backend:**
Add your Render backend URL here.

---

# ✨ Features

## 🔐 Authentication & User Management

MeetMind provides a secure authentication system for users.

* User registration
* User login
* JWT-based authentication
* Protected routes
* Authenticated API requests
* User profile management
* User settings
* Secure logout functionality

---

## 📅 Meeting Management

Users can manage their meetings from one centralized platform.

* Create meetings
* View personal meetings
* Update meetings
* Delete meetings
* View individual meeting details
* Schedule meetings
* Meeting status tracking
* Meeting codes
* Join meetings using a meeting code

---

## 🎥 Google Meet Integration

MeetMind supports meeting workflows connected to **Google Meet**.

The application is designed to connect meeting information with the MeetMind backend and process meeting-related data through the configured meeting integration.

This allows MeetMind to connect the meeting experience with AI-powered functionality.

---

## 🔗 Nylas Integration

MeetMind uses the Nylas integration for meeting-related workflows and webhook communication.

The backend can receive meeting events through webhooks and associate those events with MeetMind meetings.

The general workflow is:

```text
Google Meet
     │
     ▼
Nylas
     │
     ▼
Webhook Event
     │
     ▼
MeetMind Backend
     │
     ▼
Meeting Data
     │
     ▼
AI Processing
     │
     ├── Summary
     ├── Action Items
     ├── Analysis
     └── AI Chat
```

---

# 🤖 AI Meeting Assistant

One of the main features of MeetMind is its AI-powered meeting assistant.

Users can interact with AI to better understand meeting information.

### AI capabilities include:

* AI-generated meeting summaries
* Meeting analysis
* AI-powered questions and answers
* AI meeting chat
* Action-item generation
* Meeting insights
* Conversation-style AI interaction

The AI assistant is designed as a **chat-based experience**, allowing users to ask questions and continue a conversation instead of receiving only a single response.

Example workflow:

```text
User asks a question
        ↓
AI Chat Interface
        ↓
Frontend API Request
        ↓
MeetMind Backend
        ↓
AI Service
        ↓
AI Response
        ↓
Chat Interface
```

---

# 💬 AI Chat

MeetMind includes an interactive AI chat interface for meeting-related questions.

The chat experience is designed to work similarly to a modern conversational AI interface:

* User messages appear in the conversation
* AI responses appear below the corresponding question
* The conversation can continue with multiple questions
* The chat area automatically scrolls as new messages are added
* Users can review previous messages during the conversation

This allows users to interact naturally with their meeting information.

---

# 📋 AI Meeting Summaries

MeetMind can generate AI-powered summaries to help users quickly understand the important information discussed during a meeting.

Summaries can help reduce the time required to review long meeting information.

---

# 📌 Meeting Tasks & Action Items

MeetMind provides task-related functionality for meeting productivity.

Users can organize tasks connected to meetings and keep track of important actions that need to be completed.

Future AI improvements can further automate action-item detection and assignment.

---

# 📁 Meeting Files

MeetMind supports meeting-related file management.

Users can organize important files and resources associated with meetings so that meeting information is kept together in one place.

---

# 📊 Meeting Analytics

MeetMind provides analytics and visual insights related to meeting information.

The frontend uses charts and visual components to make meeting information easier to understand.

Analytics can help users review meeting activity and productivity.

---

# ⚙️ User Settings

Users can manage application preferences and account-related settings through the settings interface.

---

# 📱 Responsive UI

MeetMind is designed with a responsive user interface that works across different screen sizes.

The interface focuses on:

* Clean layouts
* Modern design
* Responsive components
* Easy navigation
* Professional visual hierarchy
* Accessible meeting information
* Smooth user interactions

---

# 🛠️ Technologies Used

## Frontend

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

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* REST API
* CORS
* dotenv

## AI & Integrations

* AI API
* Google Meet
* Nylas
* Webhooks
* AI-generated summaries
* AI-powered chat
* AI meeting analysis

## Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

# 🏗️ Application Architecture

MeetMind follows a full-stack architecture where the React frontend communicates with a Node.js/Express backend through REST APIs.

```text
                   ┌─────────────────────┐
                   │       User          │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   React Frontend    │
                   │       + Vite        │
                   └──────────┬──────────┘
                              │
                         REST API
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Express Backend   │
                   │      Node.js        │
                   └──────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       ┌───────────┐   ┌─────────────┐   ┌────────────┐
       │ MongoDB   │   │ AI Service  │   │   Nylas    │
       │  Atlas    │   │             │   │ Integration│
       └───────────┘   └─────────────┘   └─────┬──────┘
                                               │
                                               ▼
                                         Google Meet
```

---

# 🔄 Main Application Workflow

A typical MeetMind workflow looks like this:

```text
User
 │
 ▼
Register / Login
 │
 ▼
Dashboard
 │
 ├───────────────┐
 │               │
 ▼               ▼
Meetings       AI Assistant
 │               │
 ▼               ▼
Create / Join   Ask Questions
 │               │
 ▼               ▼
Meeting Data    AI Processing
 │               │
 └───────┬───────┘
         │
         ▼
    Meeting Information
         │
         ├── Summary
         ├── Tasks
         ├── Files
         ├── Analytics
         └── AI Insights
```

---

# 📂 Project Structure

```text
MeetMind/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── dashboard.png
│   ├── meetings.png
│   ├── ai-assistant.png
│   └── analytics.png
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/H-akimi07/MeetMind--AI-assistant-.git
```

Move into the project:

```bash
cd MeetMind--AI-assistant-
```

---

# 💻 Frontend Setup

Go to the frontend directory:

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

# 🖥️ Backend Setup

Open another terminal.

Go to the backend directory:

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

# 🔑 Environment Variables

## Frontend

The frontend uses:

```env
VITE_API_URL=your_backend_api_url
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Backend

The backend uses:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_private_jwt_secret

CLIENT_URL=your_frontend_url

NODE_ENV=production
```

If your AI and Nylas integrations require environment variables, configure those separately in your backend environment.

Example:

```env
AI_API_KEY=your_ai_api_key

NYLAS_API_KEY=your_nylas_api_key

NYLAS_CLIENT_ID=your_nylas_client_id

NYLAS_WEBHOOK_SECRET=your_nylas_webhook_secret
```

> Use the exact variable names required by your current backend implementation.

---

# ⚠️ Security

Never commit `.env` files or private API keys to GitHub.

Your `.gitignore` should include:

```text
.env
.env.local
.env.production
node_modules/
dist/
```

Never expose:

* Database credentials
* JWT secrets
* AI API keys
* Nylas API keys
* Webhook secrets
* Other private credentials

---

# 🔗 API Overview

MeetMind uses REST APIs to communicate between the frontend and backend.

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Users

```text
GET /api/users/profile
PUT /api/users/profile
```

## Meetings

```text
POST   /api/meetings
GET    /api/meetings
GET    /api/meetings/:id
PUT    /api/meetings/:id
DELETE /api/meetings/:id
```

## Meeting Notes

```text
PUT /api/meetings/:id/notes
```

## Meeting Files

```text
POST /api/meetings/:id/files
```

> The exact endpoints may change as the project continues to develop.

---

# 🔒 Authentication

MeetMind uses **JSON Web Tokens (JWT)** to authenticate users and protect private API resources.

After logging in, the frontend uses the authentication token when making protected API requests.

Protected requests use an authorization header similar to:

```text
Authorization: Bearer <token>
```

The backend verifies the token before allowing access to protected resources.

---

# 🧪 Running the Project Locally

You need two terminals.

## Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

## Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the URL provided by Vite:

```text
http://localhost:5173
```

---

# ☁️ Deployment

MeetMind is designed for full-stack cloud deployment.

## Frontend — Vercel

The React/Vite frontend can be deployed using Vercel.

Recommended settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: frontend
```

Add:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Backend — Render

The Express backend can be deployed using Render.

Recommended settings:

```text
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add the required environment variables:

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

## Database — MongoDB Atlas

MeetMind uses MongoDB Atlas for cloud database storage.

The backend connects to MongoDB through the `MONGODB_URI` environment variable.

---

# 🎨 Design & User Experience

MeetMind uses a modern, minimal, and professional interface designed around productivity.

The UI focuses on:

* Clean dashboard organization
* Responsive layouts
* Simple navigation
* Meeting-focused workflows
* AI-focused functionality
* Clear information hierarchy
* Interactive components
* Modern animations
* Professional visual design

---

# 🎯 Project Goals

The main goals of MeetMind are to:

1. Make meeting management easier.
2. Keep meeting information organized.
3. Help users collaborate efficiently.
4. Reduce the time needed to review meeting information.
5. Use AI to improve meeting productivity.
6. Provide AI-powered meeting assistance.
7. Connect meeting information with useful tasks and files.
8. Provide a simple, modern, and responsive user experience.

---

# 💡 Why MeetMind?

MeetMind was designed around a simple idea:

> **Meetings should create useful information, not just take time.**

Instead of keeping meeting management, notes, tasks, files, and AI tools separated across different platforms, MeetMind brings these workflows together.

The application combines:

```text
Meetings
   +
AI
   +
Tasks
   +
Files
   +
Analytics
   +
Collaboration
```

into a single platform.

---

# 📚 Key Learning Outcomes

Developing MeetMind provided practical experience with:

* React component development
* React state management
* React Router
* REST API integration
* Axios
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* Protected routes
* API error handling
* Environment variables
* Third-party API integration
* Webhooks
* AI API integration
* Meeting platform integration
* Responsive UI development
* Data visualization
* Cloud deployment
* Frontend/backend communication
* Debugging production applications

---

# 🚧 Future Improvements

Possible future improvements include:

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
* 🔍 Search across meeting transcripts
* 🧠 More advanced AI meeting insights
* 🎥 Additional video meeting platform integrations

---

# 🐛 Development & Error Handling

During development, MeetMind was tested across both frontend and backend environments.

The application includes handling for common issues such as:

* Authentication errors
* Invalid API requests
* Backend errors
* Failed API responses
* Missing meeting records
* Webhook processing issues
* Invalid authentication tokens
* Network errors
* Loading states
* User feedback through toast notifications

---

# 📈 Future Vision

The long-term vision for MeetMind is to become a more intelligent meeting workspace where AI can help users before, during, and after meetings.

The future platform could support:

```text
Before Meeting
     ↓
Agenda + Preparation
     ↓
During Meeting
     ↓
Transcription + AI Assistance
     ↓
After Meeting
     ↓
Summary + Tasks + Insights
     ↓
Follow-up
     ↓
Progress Tracking
```

This would make MeetMind more than a meeting manager—it could become a complete **AI-powered meeting productivity platform**.

---

# 👩‍💻 Author

**Samira Hakimi**

Full-Stack Web Development Capstone Project

**MeetMind — AI Meeting Assistant**

---

# 📄 License

This project was created for **educational, academic, and portfolio purposes**.

---

# ⭐ Project Vision

> **MeetMind turns meetings into organized, searchable, and actionable knowledge using AI.**

If you find the project interesting, feel free to explore the repository and the live application.
