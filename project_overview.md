# Code_D-B: AI-Based Student Performance Analysis System
## Comprehensive Project Overview & Status Report

### 📖 1. Project Description
Code_D-B is a cutting-edge, AI-driven educational technology platform designed to bridge the gap between student learning and department-level academic monitoring. The system serves two primary demographics: **Students** and **Heads of Departments (HODs)**. 

For students, the platform acts as a personalized learning assistant. It ingests their resumes, analyzes their skills using OpenAI, generates dynamic, multi-week learning roadmaps, synchronizes their coding activity from platforms like GitHub and LeetCode, and recommends targeted YouTube resources.
For HODs, the platform serves as an administrative surveillance dashboard. It aggregates the performance data of all students, calculates a weighted score (30% Coding, 30% Projects, 20% Problem Solving, 20% Consistency), assigns academic grades, and identifies top performers vs. students needing intervention.

### 🛠️ 2. Technology Stack
The project is built on a modern, robust, and asynchronous JavaScript backend ecosystem:
- **Core Runtime**: Node.js
- **Web Framework**: Express.js 
- **Database**: MongoDB (NoSQL) operated via Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with deep Role-Based Access Control (RBAC) and bcryptjs hashing
- **Data Validation**: Joi (Strict schema enforcement)
- **AI Engine**: OpenAI API (`gpt-4o-mini` mapped for Chatbots, Resume Parsing, and Curriculum Generation)
- **Third-Party Integrations**: YouTube Data API v3, GitHub API, LeetCode
- **Background Workers**: `node-cron` (Automated cleanup, email reporting, and reminders)
- **Testing Architecture**: `Jest` testing framework, `Supertest` for HTTP assertions, `mongodb-memory-server` for volatile isolated test databases.

### ✨ 3. Core Features
- **Dynamic AI Curriculum Generation**: Creates 4-12 week custom roadmaps based on a student's detected skill level.
- **Smart Resume Parsing**: Uses LLMs to extract core competencies directly from uploaded PDF resumes.
- **Weighted Grading Algorithm**: A custom math engine that tracks coding activity, project commits, and consistency to assign a live Grade (A+, B, C, F, etc.).
- **Automated External Syncing**: Native webhook-ready connectors to continually fetch GitHub commit histories and LeetCode problem-solving streaks.
- **HOD Analytics Dashboard**: Aggregates network-wide statistics, delivering paginated lists of low-performers and top-tier students.
- **Automated Cron Jobs**: Background workers that fire daily and weekly to send emails, sweep 90-day stale data, and trigger n8n webhooks.
- **Interceptor Validation**: A highly secure middleware gateway that checks environment variables on boot and strips malicious JSON properties before they hit the database.

---

### 🟢 4. Completed Tasks (100% Backend Architecture Finished)
The backend REST API is structurally complete, modularized, and production-ready.
- [x] **Project Initialization**: NPM setup, Express scaffolding, and `.env` parameter configurations.
- [x] **Database Modeling**: Constructed all 9 Mongoose schemas (User, StudentProfile, HODProfile, Roadmap, Progress, Evaluation, Resource, Notification, Integration).
- [x] **Service Layer**: Decoupled business logic into 16+ stateless services (Token logic, AI Prompting, GitHub syncing, Scoring math).
- [x] **Controllers Layer**: Mapped 26+ specific endpoint controllers wrapping the services in `catchAsync` blocks.
- [x] **Security & Validation Layer**: Configured `Joi` schemas, JWT `authMiddleware` (with `restrictTo` roles), and strict Startup Environment Validations.
- [x] **Routing**: Built modular Express routers for `/auth`, `/student`, `/hod`, `/ai`, `/integrations`, etc.
- [x] **Cron Scheduling**: Written and registered automated daily/weekly background tasks.
- [x] **Utility Scripts**: Built interactive CLI tools (`createHODAccount`, `seedDatabase`) for fast administrator onboarding.
- [x] **Unit & Integration Testing**: Established a full testing suite executing within an isolated volatile Mongo memory partition.

---

### 🔴 5. Incomplete Tasks & Next Steps (What's Left)
The backend codebase is complete, but the project *as a whole* requires manual configuration and the creation of its front-facing counterpart.

#### **Backend Manual Configuration (Required to Run)**
- [ ] **Provision a Database**: Create a cluster on MongoDB Atlas (or locally) and place the URI in `.env`.
- [ ] **Generate API Keys**: Obtain a real `OPENAI_API_KEY` and `YOUTUBE_API_KEY` and place them in `.env`.
- [ ] **Configure SMTP Emails**: Setup Gmail App Passwords for Nodemailer to functionally send weekly progress reports.
- [ ] **OAuth Registrations**: Register an OAuth Application inside the GitHub Developer console to allow actual user tracking.
- [ ] **Install Packages**: Run `npm install` locally on your machine to map the `package.json` configurations into an active `node_modules` folder.

#### **Frontend Development (Phase 2 of overall project)**
- [ ] **Initialize Frontend**: Spin up a React, Next.js, or Vue frontend application.
- [ ] **Build Auth Views**: Create the Login, Registration, and layout wrappers mapping to the backend `/api/v1/auth` endpoints.
- [ ] **Build Student Dashboard**: Create the UI elements to display the AI Roadmaps, Progress bars, Resume Upload forms, and Chatbot window.
- [ ] **Build HOD Dashboard**: Design data tables, analytical charts (e.g., using Chart.js), and leaderboard statistics.
- [ ] **Connect API Client**: Implement `Axios` or `fetch` interceptors on the frontend to automatically attach the `Bearer Token` to all outgoing requests.
