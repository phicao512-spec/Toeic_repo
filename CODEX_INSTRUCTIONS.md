# 🤖 CODEX INSTRUCTIONS

> This file provides instructions for AI coding agents (Codex, Copilot, etc.) to understand and execute tasks in this project.

## Project Overview

This is a **TOEIC English Learning Web Application** built with:
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn/UI
- **Backend**: Node.js + Express.js + TypeScript + Prisma ORM
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **File Storage**: MinIO (S3-compatible)
- **Deployment**: Docker Compose + Nginx

## Documentation Index

Read these files in order to understand the project:

1. **[README.md](README.md)** - Project overview & quick start
2. **[docs/architecture.md](docs/architecture.md)** - System architecture & design decisions
3. **[docs/database-schema.md](docs/database-schema.md)** - Complete database schema (Prisma)
4. **[docs/api-spec.md](docs/api-spec.md)** - REST API specification (all endpoints)
5. **[docs/deployment-guide.md](docs/deployment-guide.md)** - Docker setup & deployment
6. **[docs/dev-guide.md](docs/dev-guide.md)** - Developer conventions & patterns

## Task Assignments

Each developer role has a detailed task file:

| File | Role | Description |
|------|------|-------------|
| [docs/task-assignments/dev1-frontend-core.md](docs/task-assignments/dev1-frontend-core.md) | Frontend Core (Senior) | Next.js setup, auth, layout, design system |
| [docs/task-assignments/dev2-frontend-features.md](docs/task-assignments/dev2-frontend-features.md) | Frontend Features (Mid) | Vocabulary, Listening, Reading, Test modules |
| [docs/task-assignments/dev3-backend-api.md](docs/task-assignments/dev3-backend-api.md) | Backend API (Senior) | Express setup, all API endpoints, business logic |
| [docs/task-assignments/dev4-backend-data.md](docs/task-assignments/dev4-backend-data.md) | Backend Data (Mid) | Database schema, seed data, content creation |
| [docs/task-assignments/dev5-devops.md](docs/task-assignments/dev5-devops.md) | DevOps & QA | Docker, CI/CD, scripts, testing |

## Execution Order

When implementing the full project, follow this order:

### Phase 1: Foundation (Week 1)
```
1. Dev 5: Docker Compose + infrastructure setup
2. Dev 4: Prisma schema + initial migration
3. Dev 3: Express.js setup + auth endpoints
4. Dev 1: Next.js setup + design system + auth pages
```

### Phase 2: Core Features (Week 2-3)
```
5. Dev 4: Seed vocabulary data (1000+ words)
6. Dev 3: Vocabulary API + Question API
7. Dev 1: Layout components + Dashboard
8. Dev 4: Seed questions (500+ questions)
9. Dev 3: Listening + Reading APIs
10. Dev 2: Vocabulary module (depends on #6, #7)
11. Dev 2: Listening module (depends on #9)
```

### Phase 3: Advanced Features (Week 3-4)
```
12. Dev 3: Practice Test API + Score calculation
13. Dev 4: Create 3 full practice tests
14. Dev 2: Reading module
15. Dev 2: Practice Test UI (depends on #12, #13)
16. Dev 3: Progress tracking + Leaderboard APIs
17. Dev 4: Grammar content
18. Dev 2: Grammar module + Progress page
```

### Phase 4: Polish & Deploy (Week 5-6)
```
19. Dev 1: Admin panel
20. Dev 3: Admin APIs
21. Dev 5: CI/CD pipeline
22. Dev 5: E2E testing
23. Dev 1: Performance optimization
24. Dev 5: Production deployment
```

## Key Implementation Details

### Frontend Patterns
- Use **Server Components** by default, add `'use client'` only when needed
- Use **Zustand** for client-side state (test session, UI state)
- Use **fetch** with Next.js caching for API calls in server components
- Use **Shadcn/UI** components as the base, customize with Tailwind
- All pages must be **responsive** (mobile-first)

### Backend Patterns
- Follow **Route → Controller → Service → Prisma** layer pattern
- Use **Zod** for request validation
- Use **bcrypt** (salt rounds = 12) for passwords
- Use **JWT** with separate access (15min) and refresh (7 days) tokens
- Implement **SM-2 algorithm** for spaced repetition
- Use **Redis sorted sets** for leaderboard

### Database
- Schema is defined in `docs/database-schema.md`
- Use **cuid()** for all primary keys
- Add **indexes** on frequently queried columns
- Use **JSON fields** for flexible data (options, answers, exercises)
- Implement **soft deletes** where appropriate

### File Structure
```
toeic-learning/
├── frontend/          # Next.js 14 app
│   ├── src/app/       # Pages (App Router)
│   ├── src/components/ # React components
│   ├── src/hooks/     # Custom hooks
│   ├── src/lib/       # Utilities
│   ├── src/stores/    # Zustand stores
│   └── src/types/     # TypeScript types
├── backend/           # Express.js API
│   ├── prisma/        # Schema & migrations
│   └── src/
│       ├── config/    # Configuration
│       ├── middleware/ # Express middleware
│       ├── routes/    # API routes
│       ├── controllers/# Request handlers
│       ├── services/  # Business logic
│       └── utils/     # Helper functions
├── shared/            # Shared code
│   ├── types/         # Shared TypeScript types
│   ├── constants/     # Shared constants
│   └── validators/    # Shared Zod schemas
├── infrastructure/    # DevOps configs
│   ├── docker/        # Docker configs
│   ├── scripts/       # Utility scripts
│   └── github/        # CI/CD workflows
└── content/           # Learning content (JSON)
    ├── vocabulary/    # Word lists by topic
    ├── grammar/       # Grammar lessons
    └── tests/         # Practice test data
```

## Quality Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- No `any` types without justification
- All API endpoints have input validation
- Error handling with proper HTTP status codes
- Loading & error states for all async UI
- Mobile-responsive design (320px - 1920px)
- Accessibility: ARIA labels, keyboard navigation
- SEO: meta tags, semantic HTML, proper headings
