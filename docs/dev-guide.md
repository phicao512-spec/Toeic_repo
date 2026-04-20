# 🧑‍💻 Developer Guide

## Getting Started

### Prerequisites
- Node.js 20+ (LTS)
- npm 10+ or pnpm 8+
- Docker & Docker Compose (for database & services)
- Git
- VS Code (recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Importer
- GitLens

---

## Initial Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-org/toeic-learning.git
cd toeic-learning

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Install shared dependencies
cd shared && npm install && cd ..
```

### 2. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, MinIO only
docker-compose -f docker-compose.dev.yml up -d postgres redis minio
```

### 3. Setup Environment

```bash
# Frontend
cp frontend/.env.local.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

### 4. Setup Database

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### 5. Start Development Servers

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Runs on http://localhost:4000

# Terminal 2: Frontend
cd frontend && npm run dev
# Runs on http://localhost:3000
```

---

## Project Conventions

### Git Branching Strategy

```
main                    ← Production-ready code
├── develop             ← Integration branch
│   ├── feature/vocab-flashcard    ← Feature branches
│   ├── feature/listening-player
│   ├── fix/auth-token-refresh
│   └── chore/update-dependencies
```

### Branch Naming
- `feature/short-description` — New features
- `fix/short-description` — Bug fixes
- `chore/short-description` — Maintenance tasks
- `docs/short-description` — Documentation updates

### Commit Messages (Conventional Commits)
```
feat: add flashcard flip animation
fix: resolve audio player pause issue
docs: update API spec for vocabulary endpoint
chore: upgrade Next.js to 14.2
test: add unit tests for score calculation
refactor: extract audio player hook
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with clear commits
3. Write/update tests
4. Create PR targeting `develop`
5. Request code review
6. Address feedback
7. Squash merge after approval

---

## Code Structure & Patterns

### Frontend (Next.js)

**File naming:**
- Components: `PascalCase.tsx` (e.g., `FlashCard.tsx`)
- Pages: `page.tsx` (Next.js convention)
- Hooks: `camelCase.ts` (e.g., `useTimer.ts`)
- Utils: `camelCase.ts` (e.g., `apiClient.ts`)
- Types: `camelCase.ts` (e.g., `question.ts`)
- Stores: `camelCase.ts` (e.g., `useTestStore.ts`)

**Component Pattern:**
```tsx
// components/vocabulary/FlashCard.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Word } from '@/types/vocabulary';

interface FlashCardProps {
  word: Word;
  onCorrect: () => void;
  onIncorrect: () => void;
  className?: string;
}

export function FlashCard({ word, onCorrect, onIncorrect, className }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={cn('flashcard', className)}>
      {/* Component implementation */}
    </div>
  );
}
```

**API Client Pattern:**
```tsx
// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new ApiError(res);
  return res.json();
}
```

### Backend (Express)

**Route → Controller → Service → Prisma pattern:**

```typescript
// routes/vocabulary.routes.ts
router.get('/topics', vocabularyController.getTopics);
router.get('/topics/:topicId/words', vocabularyController.getWords);
router.get('/review', auth, vocabularyController.getReviewWords);
router.put('/progress/:wordId', auth, vocabularyController.updateProgress);

// controllers/vocabulary.controller.ts
export const getTopics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topics = await vocabularyService.getTopics(req.user?.id);
    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

// services/vocabulary.service.ts
export const getTopics = async (userId?: string) => {
  const topics = await prisma.vocabTopic.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { words: true } } },
  });
  // Add learned count if user is authenticated
  if (userId) {
    // ... add progress data
  }
  return topics;
};
```

---

## Testing

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Watch mode
npm test -- --watch

# Run specific test
npm test -- --testPathPattern="vocabulary"
```

### E2E Tests
```bash
# Run Playwright tests
npx playwright test

# Run with UI
npx playwright test --ui
```

---

## Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name add_new_field

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open database GUI
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

---

## Common Tasks

### Adding a New API Endpoint

1. Define route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Create service with business logic in `backend/src/services/`
4. Add validation schema in `shared/validators/`
5. Update API spec in `docs/api-spec.md`
6. Write tests

### Adding a New Frontend Page

1. Create page in `frontend/src/app/(main)/`
2. Create necessary components in `frontend/src/components/`
3. Add types in `frontend/src/types/`
4. Add API calls in `frontend/src/lib/`
5. Add navigation link in Sidebar
6. Write tests

### Adding a New Database Model

1. Update `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Create seed data if needed
4. Update shared types in `shared/types/`
5. Create API endpoints
6. Update database-schema.md

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check if PostgreSQL container is running: `docker-compose ps` |
| Prisma client not found | Run `npx prisma generate` in backend |
| Port already in use | Change port in `.env` or kill existing process |
| CORS errors | Check `backend/src/config/cors.ts` whitelist |
| Auth not working | Verify JWT_SECRET matches between frontend and backend |
| Audio not playing | Check MinIO is running and bucket permissions |
