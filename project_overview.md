# Code_D-B: Comprehensive Project Overview

## 📖 1. Vision & Architecture

**Code_D-B** is designed to modernize academic monitoring and personal learning. By leveraging AI (OpenAI API) and continuous deployment streams (GitHub, LeetCode), the platform automates the creation of custom learning paths and tracks student engagement in real-time, drastically reducing manual grading and mentoring overhead.

### Layered Architectural Pattern
The backend adheres strictly to the **Controller-Service-Repository** (Service-oriented) architectural pattern:
- **Routes Layer**: Modularized scalable endpoint configurations separated by context (`src/routes`).
- **Middleware Layer**: JWT verification, Joi payload validation, file multer setups, and error interception.
- **Controller Layer**: Decoupled HTTP handlers, seamlessly wrapped with a `catchAsync` mechanism.
- **Service Layer**: Pure business logic isolation (e.g., Calling OpenAI, calculating performance grades, triggering syncs).
- **Model Layer**: Flexible Mongoose schemas equipped with custom instance methods and pre-hook lifecycle triggers.

---

## 🗂️ 2. Core Modules & Features Completely Added

1. **Authentication & Authorization (`/auth`)**:
   - Secure JSON Web Token authentication flows (Login, Register, Refresh).
   - Comprehensive Role-Based Access Control (RBAC) securely separating `Student` and `HOD` personas.
2. **AI & Intelligence (`/ai`)**:
   - `generateRoadmapController`: Parses user skills and dynamically queries OpenAI for structured, multi-week JSON learning roadmaps.
   - `analyzeResumeController`: Extracts keywords, programming languages, and soft skills from student PDF uploads.
3. **Data Synchronizations (`/integrations`)**:
   - On-demand syncing with **GitHub** (commit history, pull requests) and **LeetCode** (problem-solving streaks).
4. **Scoring & Evaluation Algorithm (`/student`)**:
   - Complex math engine evaluating a student's Code Activity (30%), Projects (30%), Problem Solving (20%), and Consistency (20%).
5. **HOD Administrative Tools (`/hod`)**:
   - Feature-rich data aggregation for HODs to monitor departmental health, rank students, and quickly identify students who may require academic intervention.
6. **Notifications System (`/notifications`)**:
   - Complete CRUD logic for an in-app alert/read-receipts system.

---

## 🟢 3. Current Project Status (Phase 1: Backend Complete)

As of the current iteration, the RESTful API and Backend system is **completely architected, tested, and structurally sound**.

**Successfully Built Layers**:
- [x] **Database Models**: 9 full Mongoose schemas established with precise relational mapping.
- [x] **Service Tier**: Deep integrations and automated logic securely handled off the main thread.
- [x] **Routing Infrastructure**: Complete RESTful controller maps.
- [x] **Security & Validation**: Strict JSON payload constraints using `Joi` and `Helmet` defenses.
- [x] **Cron Automation**: Schedulers registered for routine database cleanup and integrations.
- [x] **Testing Environment**: Robust mock testing suite running inside an isolated in-memory DB slice.

All Node modules are documented inside `package.json` and the `.env.example` structure precisely matches the variables required for boot-up.

---

## 🔴 4. Next Development Steps (Phase 2)

While the core API logic is rock solid, the platform cannot be properly utilized until the visual front-facing applications are constructed and provider configurations are completed:

### Step 4.1: Manual Infrastructure Setup
- **Database Provisioning**: Deploy a Mongo cluster via MongoDB Atlas and populate the `.env` `MONGODB_URI` string.
- **Provider Keys Setup**: Register on OpenAI, Google Cloud Console (YouTube Data API), and Gmail (App Passwords for SMTP nodemailer).
- **GitHub & LeetCode Webhooks**: Configure OAuth applications in their respective developer settings to issue valid secure tokens for testing.

### Step 4.2: Frontend Application Construction
The focus should now shift entirely toward designing and coding the Client UI:
1. Initialize a **React**, **Next.js**, or **Vue** Single Page Application.
2. Build the **Student User Interface**: Integrate the interactive AI Roadmap timeline, asynchronous file uploading (FormData) for PDF resumes, and progress percentage bars.
3. Build the **HOD Dashboard UI**: Implement powerful charting abstractions (e.g., Recharts, Chart.js) to visually represent the aggregate metrics flowing from `/api/v1/hod/*`.
4. Setup **State Management Context**: Securely store JWT tokens inside HttpOnly cookies or Redux/Zustand providers.
