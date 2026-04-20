# 👨‍💻 Dev 3: Backend API (Senior Backend Developer)

## Role & Responsibilities
Xây dựng toàn bộ REST API backend: authentication, CRUD endpoints, business logic, và integrations.

## Prerequisites
- Thành thạo Node.js, Express.js, TypeScript
- Kinh nghiệm với Prisma ORM, PostgreSQL
- Hiểu biết JWT authentication, Redis
- Kinh nghiệm với MinIO/S3 (file storage)
- Đọc và hiểu: `docs/api-spec.md`, `docs/database-schema.md`

---

## Sprint 1 (Week 1): Project Setup & Authentication

### Task 3.1: Express.js Setup
- [ ] Initialize Node.js project with TypeScript
- [ ] Setup Express.js with proper middleware stack
- [ ] Configure environment variables with Zod validation
- [ ] Setup Prisma ORM with PostgreSQL connection
- [ ] Setup Redis connection
- [ ] Configure CORS
- [ ] Setup request logging (morgan/winston)
- [ ] Create health check endpoint: `GET /api/health`

**Files to create:**
```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app setup
│   ├── config/
│   │   ├── database.ts       # Prisma client singleton
│   │   ├── redis.ts          # Redis client
│   │   ├── storage.ts        # MinIO client
│   │   ├── cors.ts           # CORS config
│   │   └── env.ts            # Env validation (Zod)
│   └── types/
│       ├── express.d.ts      # Express type extensions
│       └── index.ts
```

### Task 3.2: Authentication System
- [ ] Register endpoint with input validation
- [ ] Login endpoint with bcrypt password verification
- [ ] JWT access token (15min expiry) + refresh token (7 days)
- [ ] Refresh token endpoint
- [ ] Forgot password: generate reset token, send email
- [ ] Reset password with token verification
- [ ] Auth middleware: verify JWT, attach user to request
- [ ] Admin middleware: check user role

**Files to create:**
```
backend/src/
├── middleware/
│   ├── auth.ts               # JWT verification middleware
│   ├── admin.ts              # Admin role check
│   ├── rateLimiter.ts        # Rate limiting
│   ├── validator.ts          # Zod request validation
│   ├── errorHandler.ts       # Global error handler
│   └── logger.ts             # Request logging
├── routes/
│   ├── index.ts              # Route aggregator
│   └── auth.routes.ts
├── controllers/
│   └── auth.controller.ts
├── services/
│   ├── auth.service.ts
│   └── email.service.ts
└── utils/
    ├── hash.ts               # bcrypt helpers
    └── token.ts              # JWT helpers
```

**Auth Flow:**
```
Register: validate input → hash password → create user → generate tokens → return
Login: find user → verify password → generate tokens → store in Redis → return
Refresh: verify refresh token → check Redis → generate new access token → return
Forgot: find user → generate reset token → store in Redis (15min TTL) → send email
Reset: verify reset token → hash new password → update user → delete token → return
```

**Acceptance Criteria:**
- ✅ Register with duplicate email returns 409
- ✅ Login with wrong credentials returns 401
- ✅ Protected endpoints return 401 without token
- ✅ Expired tokens trigger 401 with specific error code
- ✅ Rate limiting on auth endpoints (5 req/min)

---

## Sprint 2 (Week 2): Vocabulary & Question APIs

### Task 3.3: User API
- [ ] `GET /api/users/me` - Get current profile
- [ ] `PUT /api/users/me` - Update profile (name, targetScore, avatar)
- [ ] `PUT /api/users/me/password` - Change password
- [ ] Handle avatar upload via MinIO

**Files to create:**
```
backend/src/
├── routes/user.routes.ts
├── controllers/user.controller.ts
├── services/user.service.ts
└── services/storage.service.ts    # MinIO file upload
```

### Task 3.4: Vocabulary API
- [ ] `GET /api/vocabulary/topics` - List topics with word count & user progress
- [ ] `GET /api/vocabulary/topics/:topicId/words` - Paginated word list
- [ ] `GET /api/vocabulary/review` - Get words due for spaced repetition
- [ ] `PUT /api/vocabulary/progress/:wordId` - Update review result
- [ ] Implement SM-2 spaced repetition algorithm:

**SM-2 Algorithm:**
```typescript
function calculateNextReview(level: number, easeFactor: number, correct: boolean) {
  if (!correct) {
    return {
      level: Math.max(0, level - 1),
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      nextReview: addDays(now(), 1) // Review again tomorrow
    };
  }
  
  const intervals = [1, 1, 3, 7, 14, 30]; // days
  const newLevel = Math.min(5, level + 1);
  const interval = intervals[newLevel] * easeFactor;
  
  return {
    level: newLevel,
    easeFactor: easeFactor + 0.1,
    nextReview: addDays(now(), Math.round(interval))
  };
}
```

**Files to create:**
```
backend/src/
├── routes/vocabulary.routes.ts
├── controllers/vocabulary.controller.ts
└── services/vocabulary.service.ts
```

### Task 3.5: Question API
- [ ] `GET /api/questions` - List with filters (part, difficulty, tags)
- [ ] `GET /api/questions/:id` - Single question
- [ ] `GET /api/questions/random` - Random questions for practice
- [ ] Exclude answers from response when in test mode

**Files to create:**
```
backend/src/
├── routes/question.routes.ts
├── controllers/question.controller.ts
└── services/question.service.ts
```

---

## Sprint 3 (Week 3): Exercise & Test APIs

### Task 3.6: Listening & Reading APIs
- [ ] `GET /api/listening/parts` - Parts overview with progress
- [ ] `GET /api/listening/:part/exercises` - Exercise list
- [ ] `GET /api/listening/:part/exercises/:id` - Exercise detail with audio URLs
- [ ] `POST /api/listening/:part/exercises/:id/submit` - Submit & score
- [ ] Same endpoints for reading (`/api/reading/...`)
- [ ] Track progress after submission (update Progress table)

**Files to create:**
```
backend/src/
├── routes/listening.routes.ts
├── routes/reading.routes.ts
├── controllers/listening.controller.ts
├── controllers/reading.controller.ts
├── services/listening.service.ts
└── services/reading.service.ts
```

### Task 3.7: Practice Test API
- [ ] `GET /api/tests` - List available tests with user's attempt history
- [ ] `GET /api/tests/:id` - Test detail (NO answers)
- [ ] `POST /api/tests/:id/start` - Start attempt, return questions without answers
- [ ] `POST /api/tests/:id/submit` - Submit answers, calculate TOEIC score
- [ ] `GET /api/tests/history` - User's test history
- [ ] `GET /api/tests/history/:attemptId` - Detailed result with explanations

**TOEIC Score Calculation:**
```typescript
function calculateToeicScore(
  correctListening: number, 
  totalListening: number,
  correctReading: number, 
  totalReading: number
): { listeningScore: number; readingScore: number; totalScore: number } {
  // Use official ETS conversion table
  const listeningScore = LISTENING_CONVERSION_TABLE[correctListening] || 5;
  const readingScore = READING_CONVERSION_TABLE[correctReading] || 5;
  return {
    listeningScore,
    readingScore,
    totalScore: listeningScore + readingScore
  };
}
```

**Files to create:**
```
backend/src/
├── routes/test.routes.ts
├── controllers/test.controller.ts
├── services/test.service.ts
└── utils/scoring.ts          # TOEIC score conversion tables
```

### Task 3.8: Progress & Grammar APIs
- [ ] `GET /api/progress/overview` - Dashboard data
- [ ] `GET /api/progress/streaks` - Streak calendar
- [ ] `GET /api/progress/history` - Part-based history
- [ ] Update StudyStreak on any activity
- [ ] `GET /api/grammar/lessons` - List lessons
- [ ] `GET /api/grammar/lessons/:id` - Lesson content
- [ ] `POST /api/grammar/lessons/:id/exercises/submit` - Grade exercises

**Files to create:**
```
backend/src/
├── routes/progress.routes.ts
├── routes/grammar.routes.ts
├── controllers/progress.controller.ts
├── controllers/grammar.controller.ts
├── services/progress.service.ts
└── services/grammar.service.ts
```

---

## Sprint 4 (Week 4): Leaderboard & Admin APIs

### Task 3.9: Leaderboard API
- [ ] `GET /api/leaderboard?period=weekly` - Rankings from Redis sorted sets
- [ ] Update leaderboard on test completion
- [ ] Weekly/monthly reset via cron job (node-cron)
- [ ] Include current user's rank

**Redis Data Structure:**
```
leaderboard:weekly       → ZSET { userId: score }
leaderboard:monthly      → ZSET { userId: score }
leaderboard:all-time     → ZSET { userId: score }
```

**Files to create:**
```
backend/src/
├── routes/leaderboard.routes.ts
├── controllers/leaderboard.controller.ts
└── services/leaderboard.service.ts
```

### Task 3.10: Admin APIs
- [ ] User management (list, get, update role, delete)
- [ ] Question management (CRUD + bulk import)
- [ ] Test management (CRUD + add/remove questions)
- [ ] Vocabulary management (CRUD topics & words + bulk import)
- [ ] Platform analytics (user count, daily active, test completion rate)

**Files to create:**
```
backend/src/
├── routes/admin.routes.ts
├── controllers/admin.controller.ts
└── utils/pagination.ts
```

### Task 3.11: File Upload Service
- [ ] MinIO bucket initialization
- [ ] Upload endpoint for audio files
- [ ] Upload endpoint for images
- [ ] File size validation (max 50MB for audio, 5MB for images)
- [ ] MIME type validation
- [ ] Generate signed URLs for private files

---

## Testing Requirements

### Unit Tests
```bash
# Test files location
backend/src/__tests__/
├── services/
│   ├── auth.service.test.ts
│   ├── vocabulary.service.test.ts
│   ├── test.service.test.ts
│   └── scoring.test.ts
├── middleware/
│   ├── auth.test.ts
│   └── validator.test.ts
└── utils/
    └── scoring.test.ts
```

### Integration Tests
```bash
backend/src/__tests__/
├── routes/
│   ├── auth.routes.test.ts
│   ├── vocabulary.routes.test.ts
│   └── test.routes.test.ts
```

---

## Definition of Done
- [ ] All API endpoints match the spec in `docs/api-spec.md`
- [ ] All endpoints have input validation (Zod)
- [ ] All endpoints have proper error handling
- [ ] Auth middleware protects all necessary routes
- [ ] Rate limiting is configured
- [ ] TOEIC score calculation is accurate
- [ ] SM-2 algorithm works correctly
- [ ] Unit tests pass with >80% coverage
- [ ] API responds within 200ms for standard queries
- [ ] No N+1 query issues (verify with Prisma logging)
