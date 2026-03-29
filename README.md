# Code_D-B Backend
AI-Based Student Performance Analysis System

## Setup

### Prerequisites
- Node.js 20.x
- MongoDB (local or Atlas)

### Installation
1. Clone the repository
2. Copy `.env.example` to `.env`
3. Fill in the environment variables
4. Run `npm install`
5. Run `npm run seed` (optional - generates sample data)
6. Run `npm run dev`

## API Documentation

Base URL: `http://localhost:5000/api/v1`

### Authentication Endpoints
- `POST /auth/register` - Create a new Student or HOD account
- `POST /auth/login` - Authenticate and retrieve JWT
- `POST /auth/refresh` - Request a fresh session access token
- `POST /auth/logout` - Invalidate current tokens and session

### Student Endpoints
- `GET /student/profile` - Fetch current student profile
- `PUT /student/profile` - Update profile metrics (CGPA, skills, URLs)
- `POST /student/resume` - Upload binary resume for AI parsing
- `GET /student/roadmap` - Retrieve active AI roadmap
- `POST /student/roadmap/generate` - Prompt GPT to generate a custom 4-12 week roadmap
- `GET /student/progress` - Get current progression status
- `PUT /student/progress` - Update status of specific tasks
- `GET /student/score` - Retrieve overall calculated grading
- `GET /student/recommendations` - Get AI/YouTube resource suggestions

### HOD Endpoints
- `GET /hod/students` - View paginated list of all students
- `GET /hod/students/:id` - View detailed metrics of a specific student
- `GET /hod/analytics` - View aggregated department analytics
- `GET /hod/top-performers` - Get leaderboard of top students
- `GET /hod/low-performers` - Identify students needing assistance

### AI & Integration Endpoints
- `POST /ai/chat` - Interact with the interest-detection chatbot
- `POST /ai/analyze-resume` - Extract skills directly from a resume file
- `GET /integrations/status` - Check active Github/Leetcode links
- `POST /integrations/github/sync` - Synchronize GitHub token data

## Testing
```bash
npm test
npm run test:watch
```

## Deployment
See deployment guide for Render deployment instructions.

---

## ⚠️ Outstanding Manual Tasks & Incomplete Items

As requested, here is the honest list of things you will need to do manually to bring this backend architecture to life:

1. **Environment Variables Installation**: Open your `.env` file. You MUST manually replace the placeholder values with REAL developer keys:
   - `OPENAI_API_KEY`: Required for the roadmap, resume parsing, and chat controllers to work.
   - `YOUTUBE_API_KEY`: Required for the resource recommendations system.
   - `EMAIL_PASS` & `EMAIL_USER`: Required for the weekly report nodemailers and registration welcome emails.
2. **Database Provisioning**: You need to create a real MongoDB database (either locally installed, via Docker, or via a free MongoDB Atlas cluster) and paste that `mongodb+srv://...` link into your `MONGODB_URI` environment variable.
3. **Run Install & Update Package.json**: 
   - You must run `npm install` manually in your terminal to actually download all the required node modules we placed in `package.json`.
   - Inside `package.json`, you need to manually hook up the seed scripts we wrote. Add `"seed": "node src/scripts/seedDatabase.js"` to your `"scripts"`.
4. **Third-Party App OAuth Logic**: For GitHub and LeetCode integration syncs to truly work in production, you must manually go to GitHub Developer Settings to register an OAuth App so your students can generate actual access tokens for your domain.
5. **Frontend Application**: This repository constitutes 100% of the backend REST API logic. You still need to initialize and build the actual React/Next.js frontend to securely consume these routes.