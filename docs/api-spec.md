# 📡 API Specification

Base URL: `http://localhost:4000/api`

All endpoints return JSON. Authentication is via Bearer JWT token in the `Authorization` header.

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### POST /api/auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

### POST /api/auth/forgot-password
Send password reset email.

### POST /api/auth/reset-password
Reset password with token.

---

## Users

### GET /api/users/me 🔒
Get current user profile.

### PUT /api/users/me 🔒
Update current user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "targetScore": 750,
  "avatar": "https://..."
}
```

### PUT /api/users/me/password 🔒
Change password.

---

## Vocabulary

### GET /api/vocabulary/topics
List all vocabulary topics.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Office",
      "nameVi": "Văn phòng",
      "description": "Common office vocabulary",
      "icon": "🏢",
      "order": 1,
      "wordCount": 120,
      "learnedCount": 45  // Only if authenticated
    }
  ]
}
```

### GET /api/vocabulary/topics/:topicId/words
Get all words in a topic.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |
| search | string | - | Search by word |

### GET /api/vocabulary/review 🔒
Get words due for review (spaced repetition).

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | int | 20 | Max words to review |

**Response:**
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "id": "...",
        "word": "negotiate",
        "pronunciation": "/nɪˈɡoʊ.ʃi.eɪt/",
        "meaningVi": "đàm phán",
        "level": 2,
        "nextReview": "2026-04-20T10:00:00Z"
      }
    ],
    "totalDue": 15
  }
}
```

### PUT /api/vocabulary/progress/:wordId 🔒
Update word review result.

**Request Body:**
```json
{
  "correct": true,
  "responseTime": 3500  // milliseconds
}
```

---

## Questions

### GET /api/questions
List questions with filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| part | string | TOEIC part (PART1-PART7) |
| difficulty | string | EASY, MEDIUM, HARD |
| tags | string[] | Filter by tags |
| page | int | Page number |
| limit | int | Items per page |

### GET /api/questions/:id
Get a single question with options.

### GET /api/questions/random
Get random questions for practice.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| part | string | - | TOEIC part |
| count | int | 10 | Number of questions |
| difficulty | string | - | Difficulty filter |

---

## Listening Practice

### GET /api/listening/parts
Get overview of all listening parts with progress.

### GET /api/listening/:part/exercises
List exercises for a specific listening part (part1-part4).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Exercise Set 1",
      "questionCount": 6,
      "completedCount": 4,
      "averageScore": 83.3
    }
  ]
}
```

### GET /api/listening/:part/exercises/:exerciseId
Get exercise detail with questions and audio URLs.

### POST /api/listening/:part/exercises/:exerciseId/submit 🔒
Submit exercise answers.

**Request Body:**
```json
{
  "answers": {
    "q1": "A",
    "q2": "C",
    "q3": "B"
  },
  "timeSpent": 180
}
```

---

## Reading Practice

### GET /api/reading/parts
Get overview of all reading parts with progress.

### GET /api/reading/:part/exercises
List exercises for a specific reading part (part5-part7).

### GET /api/reading/:part/exercises/:exerciseId
Get exercise detail with passages and questions.

### POST /api/reading/:part/exercises/:exerciseId/submit 🔒
Submit exercise answers.

---

## Practice Tests

### GET /api/tests
List available practice tests.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "TOEIC Practice Test #1",
      "description": "Full 200-question practice test",
      "duration": 7200,
      "isFullTest": true,
      "totalQuestions": 200,
      "attemptCount": 2,
      "bestScore": 750
    }
  ]
}
```

### GET /api/tests/:testId
Get test details (without answers).

### POST /api/tests/:testId/start 🔒
Start a test attempt. Returns test questions.

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "...",
    "test": {
      "id": "...",
      "title": "...",
      "duration": 7200
    },
    "questions": [
      {
        "id": "...",
        "order": 1,
        "part": "PART1",
        "content": "...",
        "imageUrl": "...",
        "audioUrl": "...",
        "options": ["A", "B", "C", "D"]
        // NOTE: answer is NOT included
      }
    ]
  }
}
```

### POST /api/tests/:testId/submit 🔒
Submit test answers and get score.

**Request Body:**
```json
{
  "attemptId": "...",
  "answers": {
    "question_id_1": "A",
    "question_id_2": "C"
  },
  "timeSpent": 6800
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScore": 750,
    "listeningScore": 400,
    "readingScore": 350,
    "correctListening": 82,
    "correctReading": 75,
    "totalCorrect": 157,
    "totalQuestions": 200,
    "timeSpent": 6800,
    "partBreakdown": {
      "PART1": { "correct": 5, "total": 6 },
      "PART2": { "correct": 20, "total": 25 },
      "PART3": { "correct": 30, "total": 39 },
      "PART4": { "correct": 27, "total": 30 },
      "PART5": { "correct": 25, "total": 30 },
      "PART6": { "correct": 12, "total": 16 },
      "PART7": { "correct": 38, "total": 54 }
    },
    "detailedResults": [
      {
        "questionId": "...",
        "userAnswer": "A",
        "correctAnswer": "B",
        "isCorrect": false,
        "explanation": "..."
      }
    ]
  }
}
```

### GET /api/tests/history 🔒
Get user's test history.

### GET /api/tests/history/:attemptId 🔒
Get detailed result of a specific attempt.

---

## Grammar

### GET /api/grammar/lessons
List all grammar lessons.

### GET /api/grammar/lessons/:lessonId
Get grammar lesson content.

### POST /api/grammar/lessons/:lessonId/exercises/submit 🔒
Submit grammar exercise answers.

---

## Progress & Analytics

### GET /api/progress/overview 🔒
Get user's overall progress dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStreak": 7,
    "longestStreak": 15,
    "totalStudyTime": 12500,
    "wordsLearned": 450,
    "wordsTotal": 1000,
    "latestTestScore": 680,
    "bestTestScore": 750,
    "targetScore": 800,
    "partAccuracy": {
      "PART1": 85.5,
      "PART2": 72.3,
      "PART3": 68.9,
      "PART4": 71.2,
      "PART5": 80.1,
      "PART6": 65.4,
      "PART7": 60.8
    },
    "recentActivity": [
      { "date": "2026-04-20", "minutesStudied": 45, "wordsLearned": 12 }
    ]
  }
}
```

### GET /api/progress/streaks 🔒
Get study streak calendar data.

### GET /api/progress/history 🔒
Get progress history by part.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| part | string | Filter by TOEIC part |
| from | date | Start date |
| to | date | End date |

---

## Leaderboard

### GET /api/leaderboard
Get leaderboard rankings.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| period | string | weekly | weekly, monthly, all-time |
| limit | int | 20 | Number of entries |

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "weekly",
    "rankings": [
      {
        "rank": 1,
        "userId": "...",
        "name": "Nguyen Van A",
        "avatar": "...",
        "score": 850,
        "studyTime": 1200
      }
    ],
    "currentUser": {
      "rank": 15,
      "score": 680
    }
  }
}
```

---

## Admin Endpoints 🔒👑

All admin endpoints require `role: ADMIN`.

### Users
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

### Questions
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `POST /api/admin/questions/bulk` - Bulk import questions (JSON)

### Tests
- `POST /api/admin/tests` - Create test
- `PUT /api/admin/tests/:id` - Update test
- `DELETE /api/admin/tests/:id` - Delete test
- `POST /api/admin/tests/:id/questions` - Add questions to test

### Vocabulary
- `POST /api/admin/vocabulary/topics` - Create topic
- `POST /api/admin/vocabulary/words` - Add words
- `POST /api/admin/vocabulary/words/bulk` - Bulk import words
- `PUT /api/admin/vocabulary/words/:id` - Update word
- `DELETE /api/admin/vocabulary/words/:id` - Delete word

### Analytics
- `GET /api/admin/analytics/overview` - Platform analytics
- `GET /api/admin/analytics/users` - User activity stats

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request body |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth endpoints | 5 requests/min |
| General API | 100 requests/min |
| File upload | 10 requests/min |
| Admin API | 200 requests/min |
