# 🎓 TOEIC Learning Web Application

> Ứng dụng web học tiếng Anh thi TOEIC - Self-hosted, Full-stack

## 🚀 Quick Start

```bash
# Clone project
git clone https://github.com/your-org/toeic-learning.git
cd toeic-learning

# Copy environment variables
cp .env.example .env

# Start all services with Docker
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# MinIO Console: http://localhost:9001
```

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Shadcn/UI |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache | Redis 7 |
| Auth | NextAuth.js (Auth.js) |
| File Storage | MinIO (S3-compatible) |
| Reverse Proxy | Nginx |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## 📁 Project Structure

```
toeic-learning/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── shared/            # Shared types, constants, validators
├── infrastructure/    # Docker, Nginx, CI/CD configs
├── content/           # TOEIC learning content (vocab, tests, grammar)
└── docs/              # Project documentation & task assignments
```

## 🎯 Features

### For Students
- 📚 **Vocabulary Learning** - Flashcards with spaced repetition (SM-2 algorithm)
- 🎧 **Listening Practice** - Parts 1-4 with audio player & transcripts
- 📖 **Reading Practice** - Parts 5-7 with passage viewer & highlighting
- 📝 **Practice Tests** - Full mock tests with 2-hour timer
- 📊 **Progress Tracking** - Score history, streak calendar, skill radar
- 🏆 **Leaderboard** - Weekly/monthly rankings
- 📗 **Grammar Lessons** - Interactive grammar with exercises

### For Admins
- 👤 User management
- ❓ Question bank CRUD
- 📋 Test creation & management
- 📊 Analytics dashboard

## 🐳 Self-Hosting

See [docs/deployment-guide.md](docs/deployment-guide.md) for detailed instructions.

**Minimum Requirements:**
- 2 CPU cores, 4GB RAM, 20GB storage
- Docker & Docker Compose installed
- Domain name (optional, for SSL)

## 👥 Development

See [docs/dev-guide.md](docs/dev-guide.md) for developer setup.

```bash
# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up

# Run frontend only
cd frontend && npm run dev

# Run backend only
cd backend && npm run dev

# Run database migrations
cd backend && npx prisma migrate dev

# Seed database
cd backend && npx prisma db seed
```

## 📄 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | System architecture & design decisions |
| [API Spec](docs/api-spec.md) | REST API documentation |
| [Database Schema](docs/database-schema.md) | Database design & relationships |
| [Deployment Guide](docs/deployment-guide.md) | Self-hosting & cloud deployment |
| [Dev Guide](docs/dev-guide.md) | Developer onboarding & workflows |
| [Task Assignments](docs/task-assignments/) | Work breakdown per developer |

## 📜 License

MIT License
