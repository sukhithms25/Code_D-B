# API Reference Guide & Master Route List

Base URL: `http://localhost:5000`

## 🔗 API Master List

| METHOD | ROUTE | AUTH | ROLE | PURPOSE |
|--------|-------|------|------|---------|
| GET | `/health` | No | Public | Basic health and uptime check |
| POST | `/api/v1/auth/register` | No | Public | Register a new user |
| POST | `/api/v1/auth/login` | No | Public | Login user and receive tokens |
| POST | `/api/v1/auth/refresh` | No | Public | Retrieve new tokens using refresh |
| POST | `/api/v1/auth/logout` | No | Public | Clear cookies/tokens |
| POST | `/api/v1/auth/forgot-password` | No | Public | Request a password reset URL |
| POST | `/api/v1/auth/reset-password/:token` | No | Public | Set new password with token |
| GET | `/api/v1/student/profile` | Yes | student | View student profile & stats |
| PUT | `/api/v1/student/profile` | Yes | student | Update profile and skills |
| POST | `/api/v1/student/resume` | Yes | student | Upload PDF resume |
| GET | `/api/v1/student/roadmap` | Yes | student | View current roadmap progress |
| POST | `/api/v1/student/roadmap/generate` | Yes | student | Create tiered AI roadmap |
| GET | `/api/v1/student/progress` | Yes | student | Fetch progress tracking metrics |
| PUT | `/api/v1/student/progress` | Yes | student | Check off roadmap tasks |
| GET | `/api/v1/student/score` | Yes | student | Fetch total score calculation |
| GET | `/api/v1/student/recommendations` | Yes | student | Get personalized recommendations |
| GET | `/api/v1/hod/students` | Yes | hod, admin | List all students in system |
| GET | `/api/v1/hod/students/:id` | Yes | hod, admin | View specific student stats |
| GET | `/api/v1/hod/analytics` | Yes | hod, admin | Dashboard aggregate stats |
| GET | `/api/v1/hod/top-performers` | Yes | hod, admin | Ranked list of top students |
| GET | `/api/v1/hod/low-performers` | Yes | hod, admin | Flagged underperformers |
| POST | `/api/v1/ai/chat` | Yes | student | Send history to AI chatbot |
| POST | `/api/v1/ai/generate-roadmap` | Yes | student | Used by generator service |
| POST | `/api/v1/ai/analyze-resume` | Yes | student | Deep feedback on resume |
| GET | `/api/v1/ai/recommend` | Yes | student | AI specific recommendations |
| GET | `/api/v1/integrations/status` | Yes | student | View mapping status |
| POST | `/api/v1/integrations/github/sync` | Yes | student | Trigger GitHub metadata sync |
| POST | `/api/v1/integrations/leetcode/sync` | Yes | student | Trigger LeetCode data sync |
| GET | `/api/v1/integrations/youtube/search` | Yes | student | Search YouTube tutorials |
| GET | `/api/v1/notifications` | Yes | student, hod | View unread system notifications |
| PUT | `/api/v1/notifications/mark-all` | Yes | student, hod | Fast mark all as read |
| PUT | `/api/v1/notifications/:id` | Yes | student, hod | Mark specific notification read |

---

## Response Formats
All requests follow this standard signature.

**Success format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { "key": "value" },
  "timestamp": "2026-03-28T10:30:00.000Z"
}
```

**Error format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detail 1", "Detail 2"]
}
```

---

## 1. Authentication Details
### `POST /auth/register`
Creates an account (auto-provisions `StudentProfile` or `HODProfile`).
**Body:**
```json
{
  "email": "test@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```
**Options:** `role` can be `student` or `hod`. If `hod`, `department` is required.

### `POST /auth/login`
**Body:**
```json
{
  "email": "test@example.com",
  "password": "securepassword"
}
```

---

## 2. Students (Requires `Bearer Token` & role `student`)
### `PUT /student/profile`
**Body:**
```json
{
  "CGPA": 8.5,
  "interests": ["Machine Learning", "Web Dev"],
  "skills": ["Python", "Django"],
  "githubUrl": "https://github.com/user"
}
```

### `POST /student/roadmap/generate`
Triggers OpenAI service to construct a tiered roadmap mapped to the requested length.
**Body:**
```json
{
  "skillLevel": "beginner",
  "weeks": 4
}
```

### `PUT /student/progress`
**Body:**
```json
{
  "roadmapId": "60a7b4f5e7b...",
  "taskId": "task-uuid-here",
  "isCompleted": true
}
```

---

## 3. HOD Dashboards (Requires `Bearer Token` & role `hod`)
### `GET /hod/analytics`
Returns aggregate statistics of the student body.
**Response Data:**
```json
{
  "totalStudents": 150,
  "avgTotalScore": 75.4,
  "activeRoadmaps": 120,
  "completedEvaluations": 80
}
```

### `GET /hod/top-performers`
Returns top graded active students.
**Response Data:**
```json
[
  {
    "studentId": "...",
    "firstName": "Jane",
    "totalScore": 96.5,
    "grade": "A+"
  }
]
```

---

## 4. Scheduled Background Jobs
- **Daily Progress Reminder**: Fires every day at 09:00 AM (`node-cron`). Detects stagnant 'in-progress' roadmap stages.
- **Weekly Report Job**: Fires Monday at 10:00 AM. Triggers `emailService` for all users and pings `N8N_WEBHOOK_URL`.
- **Data Cleanup Job**: Fires Sunday at 02:00 AM. Sweeps notifications and completed roadmaps > 90 days.
