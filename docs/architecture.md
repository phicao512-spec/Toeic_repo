# 🏗️ System Architecture

## Overview

TOEIC Learning Web Application sử dụng kiến trúc **monorepo** với Frontend và Backend tách biệt, giao tiếp qua REST API, được đóng gói bằng Docker Compose.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Nginx     │  :80 / :443
                    │  (Reverse   │  SSL Termination
                    │   Proxy)    │  Static file caching
                    └──┬──────┬──┘
                       │      │
            ┌──────────▼┐  ┌──▼──────────┐
            │ Frontend  │  │  Backend    │
            │ Next.js   │  │  Express.js │
            │ :3000     │  │  :4000      │
            │           │  │             │
            │ - SSR/SSG │  │ - REST API  │
            │ - Auth UI │  │ - JWT Auth  │
            │ - SPA     │  │ - Business  │
            └───────────┘  │   Logic     │
                           └──┬───┬───┬──┘
                              │   │   │
              ┌───────────────┘   │   └───────────────┐
              │                   │                   │
       ┌──────▼──────┐   ┌──────▼──────┐   ┌────────▼────────┐
       │ PostgreSQL  │   │   Redis     │   │     MinIO       │
       │ :5432       │   │   :6379     │   │     :9000       │
       │             │   │             │   │                 │
       │ - Users     │   │ - Sessions  │   │ - Audio files   │
       │ - Questions │   │ - Cache     │   │ - Images        │
       │ - Tests     │   │ - Leaderbd  │   │ - Uploads       │
       │ - Progress  │   │ - Rate Lim  │   │                 │
       └─────────────┘   └─────────────┘   └─────────────────┘
```

## Data Flow

### Authentication Flow
```
User → Frontend (Login Page) → Backend /api/auth/login
  → Verify credentials (bcrypt)
  → Generate JWT + Refresh Token
  → Store session in Redis
  → Return tokens to Frontend
  → Frontend stores in httpOnly cookie
```

### Practice Test Flow
```
User starts test → Frontend fetches test from /api/tests/:id
  → Timer starts (120 min)
  → User answers questions (stored in Zustand store)
  → User submits → POST /api/tests/:id/submit
  → Backend calculates TOEIC score (conversion table)
  → Saves TestAttempt to PostgreSQL
  → Updates Progress & Leaderboard (Redis)
  → Returns result to Frontend
```

### Spaced Repetition Flow
```
User opens Vocabulary Review → Frontend fetches /api/vocabulary/review
  → Backend queries VocabProgress WHERE nextReview <= NOW()
  → Returns words sorted by priority
  → User marks correct/incorrect
  → PUT /api/vocabulary/progress/:wordId
  → Backend applies SM-2 algorithm:
    - correct: level++, nextReview = now + interval(level)
    - incorrect: level = max(0, level-1), nextReview = now + 1 day
```

## Key Design Decisions

### 1. Monorepo Structure
- **Why**: Shared types between frontend/backend, easier to manage
- **Trade-off**: Larger repo, but simpler deployment

### 2. PostgreSQL over MongoDB
- **Why**: TOEIC data has strong relational models (User → Progress → Questions)
- **Prisma ORM**: Type-safe queries, easy migrations

### 3. Redis for Leaderboard
- **Why**: Sorted sets are perfect for rankings, O(log N) operations
- **Also used for**: Session caching, rate limiting

### 4. MinIO for File Storage
- **Why**: S3-compatible, self-hostable, no vendor lock-in
- **Stores**: Audio files (listening), images (Part 1 photographs)

### 5. Next.js App Router
- **Why**: Server-side rendering for SEO, route groups for layout separation
- **Auth group**: Login/Register without sidebar
- **Main group**: Dashboard/Learning with sidebar navigation

### 6. Separate Backend (Express) vs Next.js API Routes
- **Why**: Scalability - backend can be scaled independently
- **Trade-off**: More complexity, but better for production

## Security

| Measure | Implementation |
|---------|---------------|
| Authentication | JWT with refresh tokens |
| Password | bcrypt with salt rounds = 12 |
| API Security | Rate limiting (express-rate-limit) |
| Input Validation | Zod schemas on all endpoints |
| CORS | Whitelist frontend domain only |
| SQL Injection | Prisma ORM (parameterized queries) |
| XSS | Next.js auto-escaping + CSP headers |
| HTTPS | Nginx SSL termination (Let's Encrypt) |

## Performance Considerations

1. **SSG for static content**: Grammar lessons, vocabulary lists can be statically generated
2. **Redis caching**: Hot data (leaderboard, popular tests) cached in Redis
3. **Image optimization**: Next.js Image component with WebP
4. **Audio streaming**: Range requests for audio files via MinIO
5. **Database indexing**: Composite indexes on (userId, date) for progress queries
6. **Pagination**: Cursor-based pagination for large lists
