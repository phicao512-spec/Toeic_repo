# 👨‍💻 Dev 5: DevOps & QA (Junior-Mid Developer)

## Role & Responsibilities
Setup Docker infrastructure, CI/CD pipeline, deployment automation, và quality assurance.

## Prerequisites
- Kinh nghiệm Docker & Docker Compose
- Hiểu biết Nginx configuration
- Kinh nghiệm GitHub Actions
- Cơ bản về Linux server administration
- Đọc và hiểu: `docs/deployment-guide.md`

---

## Sprint 1 (Week 1): Docker & Infrastructure

### Task 5.1: Docker Compose Setup

**Development environment:** (hot reload, debug mode)
- [ ] `docker-compose.dev.yml` - Development config
- [ ] Frontend container with volume mounts (hot reload)
- [ ] Backend container with nodemon (auto restart)
- [ ] PostgreSQL with persistent volume
- [ ] Redis
- [ ] MinIO with initial bucket creation

**Production environment:**
- [ ] `docker-compose.yml` - Production config
- [ ] Multi-stage Dockerfile for frontend (build → nginx serve)
- [ ] Multi-stage Dockerfile for backend (build → node run)
- [ ] Health checks for all services
- [ ] Resource limits (memory, CPU)
- [ ] Restart policies
- [ ] Named volumes for data persistence

**Files to create:**
```
├── docker-compose.yml              # Production
├── docker-compose.dev.yml          # Development
├── frontend/Dockerfile
├── backend/Dockerfile
├── infrastructure/
│   ├── docker/
│   │   ├── nginx/
│   │   │   └── nginx.conf
│   │   ├── postgres/
│   │   │   └── init.sql
│   │   └── redis/
│   │       └── redis.conf
```

**Frontend Dockerfile (multi-stage):**
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**Backend Dockerfile (multi-stage):**
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

### Task 5.2: Nginx Reverse Proxy
- [ ] Route `/api/*` to backend:4000
- [ ] Route `/` to frontend:3000
- [ ] SSL termination (configurable)
- [ ] Gzip compression
- [ ] Static file caching headers
- [ ] Security headers (X-Frame-Options, CSP, etc.)
- [ ] WebSocket support for Next.js HMR (dev mode)
- [ ] File upload size limit (50MB)

### Task 5.3: .env.example Template
- [ ] Document all environment variables
- [ ] Add comments explaining each variable
- [ ] Include sensible defaults where possible
- [ ] Add secret generation commands

**File to create:**
```
.env.example
```

```env
# ================================
# TOEIC Learning Web Application
# ================================

# === General ===
NODE_ENV=production                    # production | development
APP_URL=http://localhost               # Public URL of the application
API_URL=http://localhost/api           # Public URL of the API

# === PostgreSQL ===
POSTGRES_USER=toeic_user               # Database username
POSTGRES_PASSWORD=change_me_123        # Database password (CHANGE THIS!)
POSTGRES_DB=toeic_learning             # Database name
DATABASE_URL=postgresql://toeic_user:change_me_123@postgres:5432/toeic_learning

# === Redis ===
REDIS_URL=redis://redis:6379           # Redis connection URL

# === Authentication ===
# Generate with: openssl rand -base64 48
JWT_SECRET=change_me_jwt_secret        # JWT signing secret (CHANGE THIS!)
JWT_REFRESH_SECRET=change_me_refresh   # Refresh token secret (CHANGE THIS!)
JWT_ACCESS_EXPIRY=15m                  # Access token expiry
JWT_REFRESH_EXPIRY=7d                  # Refresh token expiry
NEXTAUTH_SECRET=change_me_nextauth     # NextAuth secret (CHANGE THIS!)
NEXTAUTH_URL=http://localhost          # NextAuth callback URL

# === MinIO (File Storage) ===
MINIO_ROOT_USER=minio_admin            # MinIO admin username
MINIO_ROOT_PASSWORD=change_me_minio    # MinIO admin password (CHANGE THIS!)
MINIO_ENDPOINT=minio:9000             # MinIO server endpoint
MINIO_BUCKET=toeic-assets             # Default bucket name

# === Email (Optional) ===
SMTP_HOST=smtp.gmail.com               # SMTP server
SMTP_PORT=587                          # SMTP port
SMTP_USER=                             # SMTP username
SMTP_PASS=                             # SMTP password or app password
EMAIL_FROM=noreply@yourdomain.com      # From email address
```

---

## Sprint 2 (Week 2): CI/CD Pipeline

### Task 5.4: GitHub Actions CI
- [ ] Trigger on: push to `develop`, pull requests to `main`
- [ ] Steps:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (frontend + backend)
  4. Lint check (ESLint)
  5. Type check (TypeScript)
  6. Run unit tests
  7. Build frontend & backend
  8. Run E2E tests (optional)

**File to create:**
```
infrastructure/github/workflows/ci.yml
```

```yaml
name: CI Pipeline

on:
  push:
    branches: [develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
          POSTGRES_DB: toeic_test
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s
      
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      # Frontend
      - name: Install frontend deps
        working-directory: frontend
        run: npm ci
      
      - name: Lint frontend
        working-directory: frontend
        run: npm run lint
      
      - name: Type check frontend
        working-directory: frontend
        run: npx tsc --noEmit
      
      - name: Test frontend
        working-directory: frontend
        run: npm test -- --coverage
      
      - name: Build frontend
        working-directory: frontend
        run: npm run build
      
      # Backend
      - name: Install backend deps
        working-directory: backend
        run: npm ci
      
      - name: Generate Prisma client
        working-directory: backend
        run: npx prisma generate
      
      - name: Lint backend
        working-directory: backend
        run: npm run lint
      
      - name: Type check backend
        working-directory: backend
        run: npx tsc --noEmit
      
      - name: Run migrations
        working-directory: backend
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/toeic_test
        run: npx prisma migrate deploy
      
      - name: Test backend
        working-directory: backend
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/toeic_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
        run: npm test -- --coverage
```

### Task 5.5: Deploy Workflows
- [ ] Staging deploy (auto on push to `develop`)
- [ ] Production deploy (manual trigger or tag)
- [ ] Docker image build & push to registry
- [ ] SSH deploy to VPS (or platform-specific deploy)

**Files to create:**
```
infrastructure/github/workflows/
├── deploy-staging.yml
└── deploy-prod.yml
```

---

## Sprint 3 (Week 2-3): Scripts & Monitoring

### Task 5.6: Utility Scripts
- [ ] `setup.sh` - First-time setup (create dirs, copy .env, etc.)
- [ ] `backup-db.sh` - Automated PostgreSQL backup
- [ ] `restore-db.sh` - Database restore from backup
- [ ] `seed-data.sh` - Run seed with confirmation

**Files to create:**
```
infrastructure/scripts/
├── setup.sh
├── backup-db.sh
├── restore-db.sh
└── seed-data.sh
```

**backup-db.sh:**
```bash
#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="toeic_backup_${TIMESTAMP}.sql.gz"

mkdir -p $BACKUP_DIR

echo "📦 Creating database backup..."
docker-compose exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "✅ Backup saved: ${BACKUP_DIR}/${FILENAME}"

# Keep only last 7 backups
ls -t ${BACKUP_DIR}/toeic_backup_*.sql.gz | tail -n +8 | xargs -r rm
echo "🧹 Old backups cleaned up (keeping last 7)"
```

### Task 5.7: Makefile
- [ ] Common commands as make targets

**File to create:**
```
Makefile
```

```makefile
.PHONY: dev prod build stop logs backup seed

# Development
dev:
	docker-compose -f docker-compose.dev.yml up

# Production
prod:
	docker-compose up -d

# Build images
build:
	docker-compose build

# Stop all services
stop:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Backup database
backup:
	./infrastructure/scripts/backup-db.sh

# Seed database
seed:
	docker-compose exec backend npx prisma db seed

# Run migrations
migrate:
	docker-compose exec backend npx prisma migrate deploy

# Open Prisma Studio
studio:
	cd backend && npx prisma studio

# Clean everything (WARNING: deletes data)
clean:
	docker-compose down -v
	rm -rf frontend/node_modules backend/node_modules
```

---

## Sprint 4 (Ongoing): QA & Testing

### Task 5.8: E2E Testing Setup
- [ ] Install Playwright
- [ ] Write critical path tests:
  - User registration flow
  - Login flow
  - Vocabulary learning flow
  - Practice test flow (start → answer → submit → view result)
  - Admin login and question creation

**Files to create:**
```
frontend/
├── playwright.config.ts
└── e2e/
    ├── auth.spec.ts
    ├── vocabulary.spec.ts
    ├── practice-test.spec.ts
    └── admin.spec.ts
```

### Task 5.9: Performance Testing
- [ ] Load test API endpoints with k6 or Artillery
- [ ] Identify bottlenecks
- [ ] Document performance baselines

### Task 5.10: Security Checklist
- [ ] Verify all secrets are in .env (not hardcoded)
- [ ] Check CORS configuration
- [ ] Verify rate limiting works
- [ ] Test SQL injection protection
- [ ] Test XSS protection
- [ ] Verify JWT security (algorithm, expiry)
- [ ] Check file upload validation
- [ ] Test role-based access control

---

## Documentation

### Task 5.11: Deployment Documentation
- [ ] Update `docs/deployment-guide.md` with real-world testing results
- [ ] Document common issues and solutions
- [ ] Create video/screenshot walkthrough if needed

### Task 5.12: CONTRIBUTING.md
- [ ] Git workflow
- [ ] Code review process
- [ ] Commit message conventions
- [ ] Branch naming conventions
- [ ] How to run tests locally

**File to create:**
```
CONTRIBUTING.md
```

---

## Definition of Done
- [ ] `docker-compose up -d` starts all services successfully
- [ ] `docker-compose -f docker-compose.dev.yml up` starts dev environment
- [ ] CI pipeline runs on every PR
- [ ] Deploy to staging works automatically
- [ ] Backup script works correctly
- [ ] All E2E critical paths pass
- [ ] Security checklist completed
- [ ] Documentation is accurate and complete
- [ ] SSL setup guide is verified on real server
