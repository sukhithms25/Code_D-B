# 🚀 Code_D-B: AI-Based Student Performance Analysis System

Welcome to the backend repository of **Code_D-B**, an advanced, AI-driven educational technology platform designed to seamlessly bridge the gap between student learning trajectories and department-level academic monitoring.

## 🌟 Overview
Code_D-B serves two primary user personas:
- **Students**: Receive personalized AI-generated learning roadmaps, skills parsing from resumes, and dynamic progress monitoring based on GitHub & Leetcode activities.
- **Heads of Departments (HODs)**: Gain access to a powerful surveillance dashboard tracking holistic student performance metrics, calculated via a dynamic scoring system (Coding, Projects, Problem Solving, and Consistency).

## 🛠️ Technology Stack
- **Runtime**: Node.js v20.x
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT with Role-Based Access Control (RBAC)
- **AI Integration**: OpenAI API (for Resume Parsing and Curriculum Generation)
- **Task Scheduling**: Node-cron (for automated reporting and data syncs)
- **Testing**: Jest, Supertest

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/code-db.git
   cd code-db
   ```

2. **Setup Environment Variables:**
   Copy the example config and populate it with your valid API keys:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `OPENAI_API_KEY`, `YOUTUBE_API_KEY`, `MONGODB_URI`, and email credentials are valid.*

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Seed the Database (Optional):**
   Generates mock HODs, students, and test data.
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 📖 API Reference Summary

The API exposes endpoints under `http://localhost:5000/api/v1`.

| Module | Base Route | Key Features |
|--------|------------|--------------|
| **Authentication** | `/auth` | Register, Login, Refresh tokens, Logout |
| **Student** | `/student` | Profile updates, Resume upload, Roadmap gen, Progress tracking |
| **HOD** | `/hod` | View student lists, analytics dashboard, leaderboards, alerts |
| **AI Insights** | `/ai` | Chatbot, Resume skills extraction |
| **Integrations** | `/integrations` | Sync GitHub commits & LeetCode streaks |
| **Notifications** | `/notifications` | Get, read, and mark alerts |

*Please check the postman collection or Swagger docs (if integrated) for full request/response schemas.*

## 🧪 Testing
The testing architecture runs in an isolated, volatile in-memory MongoDB structure.
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚢 Deployment
Ready to be deployed on platforms like **Render**, **Heroku**, or **Vercel** (`vercel.json` included). Check the deployment guides for specifics on injecting environment variables in production.

---

## ⚠️ Current Status & Manual Tasks Required

The **backend architecture is completely wrapped up**. To make the platform functional end-to-end, the following actions are needed:

1. **API Keys Integration**: Add your real OpenAI, YouTube, and Email SMTP credentials to `.env`.
2. **Third-Party Sync**: Register OAuth apps on GitHub/LeetCode for live token generation.
3. **Frontend Application**: Begin Phase 2 by initializing the React/Next.js frontend application to consume these backend RESTful endpoints.