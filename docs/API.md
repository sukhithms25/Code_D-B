# API Reference Guide
Base URL: `http://localhost:5000/api/v1`

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

## 1. Authentication
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
