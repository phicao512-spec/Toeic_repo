# 🎓 TOEIC Learning Web Application - Kế Hoạch Triển Khai

## Tổng Quan

Xây dựng một web application học tiếng Anh thi TOEIC với đầy đủ tính năng: học từ vựng, luyện nghe, luyện đọc, thi thử, theo dõi tiến trình. Ứng dụng có thể **self-host** bằng Docker và **publish** lên các nền tảng cloud.

## Tech Stack

| Layer | Công nghệ | Lý do |
|-------|-----------|-------|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG, SEO tốt, dễ deploy |
| **Styling** | Tailwind CSS + Shadcn/UI | Phát triển nhanh, nhất quán |
| **Backend API** | Node.js + Express | Nhẹ, linh hoạt, dễ scale |
| **Database** | PostgreSQL + Prisma ORM | Quan hệ phức tạp, type-safe |
| **Cache** | Redis | Session, leaderboard, cache |
| **Auth** | NextAuth.js (Auth.js) | Hỗ trợ nhiều provider |
| **File Storage** | MinIO (S3-compatible) | Self-host, lưu audio/image |
| **Containerization** | Docker + Docker Compose | Dễ deploy, tự host |
| **CI/CD** | GitHub Actions | Tự động build & deploy |

---

## 📁 Cấu Trúc Thư Mục

```
toeic-learning/
│
├── 📄 README.md                          # Hướng dẫn tổng quan dự án
├── 📄 CONTRIBUTING.md                    # Quy tắc đóng góp cho dev
├── 📄 LICENSE                            # Giấy phép
├── 📄 .gitignore
├── 📄 .env.example                       # Template biến môi trường
├── 📄 docker-compose.yml                 # Cấu hình Docker cho toàn bộ stack
├── 📄 docker-compose.dev.yml             # Cấu hình Docker cho dev
├── 📄 Makefile                           # Lệnh tắt (make dev, make build, etc.)
│
├── 📂 docs/                              # Tài liệu dự án
│   ├── 📄 architecture.md               # Kiến trúc hệ thống
│   ├── 📄 api-spec.md                   # API specification
│   ├── 📄 database-schema.md            # Database design
│   ├── 📄 deployment-guide.md           # Hướng dẫn deploy & self-host
│   ├── 📄 dev-guide.md                  # Hướng dẫn cho developer
│   ├── 📂 wireframes/                   # Bản vẽ UI
│   └── 📂 task-assignments/             # Phân chia công việc
│       ├── 📄 dev1-frontend-core.md     # Việc cho Dev 1
│       ├── 📄 dev2-frontend-features.md # Việc cho Dev 2
│       ├── 📄 dev3-backend-api.md       # Việc cho Dev 3
│       ├── 📄 dev4-backend-data.md      # Việc cho Dev 4
│       └── 📄 dev5-devops.md            # Việc cho Dev 5
│
├── 📂 frontend/                          # ===== FRONTEND (Next.js) =====
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tsconfig.json
│   ├── 📄 tailwind.config.ts
│   ├── 📄 postcss.config.js
│   ├── 📄 Dockerfile                    # Docker build cho frontend
│   ├── 📄 .env.local.example
│   │
│   ├── 📂 public/                       # Static assets
│   │   ├── 📂 images/
│   │   │   ├── logo.svg
│   │   │   ├── hero-banner.webp
│   │   │   └── 📂 icons/
│   │   ├── 📂 audio/                    # TOEIC listening samples
│   │   │   └── 📂 samples/
│   │   └── 📄 favicon.ico
│   │
│   ├── 📂 src/
│   │   ├── 📂 app/                      # Next.js App Router
│   │   │   ├── 📄 layout.tsx            # Root layout
│   │   │   ├── 📄 page.tsx              # Landing page
│   │   │   ├── 📄 globals.css           # Global styles
│   │   │   ├── 📄 loading.tsx           # Global loading UI
│   │   │   ├── 📄 not-found.tsx         # 404 page
│   │   │   │
│   │   │   ├── 📂 (auth)/              # Auth route group
│   │   │   │   ├── 📂 login/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📂 register/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📂 forgot-password/
│   │   │   │       └── 📄 page.tsx
│   │   │   │
│   │   │   ├── 📂 (main)/              # Main app route group
│   │   │   │   ├── 📄 layout.tsx        # Layout có sidebar/navbar
│   │   │   │   │
│   │   │   │   ├── 📂 dashboard/        # Trang tổng quan
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 vocabulary/       # === Học Từ Vựng ===
│   │   │   │   │   ├── 📄 page.tsx      # Danh sách chủ đề từ vựng
│   │   │   │   │   ├── 📂 [topicId]/
│   │   │   │   │   │   ├── 📄 page.tsx  # Chi tiết chủ đề + flashcard
│   │   │   │   │   │   └── 📂 quiz/
│   │   │   │   │   │       └── 📄 page.tsx  # Quiz từ vựng
│   │   │   │   │   └── 📂 review/
│   │   │   │   │       └── 📄 page.tsx  # Ôn tập spaced repetition
│   │   │   │   │
│   │   │   │   ├── 📂 listening/        # === Luyện Nghe ===
│   │   │   │   │   ├── 📄 page.tsx      # Tổng quan phần nghe
│   │   │   │   │   ├── 📂 part1/        # Part 1: Photographs
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   │   └── 📂 [exerciseId]/
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   ├── 📂 part2/        # Part 2: Question-Response
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   │   └── 📂 [exerciseId]/
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   ├── 📂 part3/        # Part 3: Conversations
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   │   └── 📂 [exerciseId]/
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   └── 📂 part4/        # Part 4: Talks
│   │   │   │   │       ├── 📄 page.tsx
│   │   │   │   │       └── 📂 [exerciseId]/
│   │   │   │   │           └── 📄 page.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 reading/          # === Luyện Đọc ===
│   │   │   │   │   ├── 📄 page.tsx      # Tổng quan phần đọc
│   │   │   │   │   ├── 📂 part5/        # Part 5: Incomplete Sentences
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   │   └── 📂 [exerciseId]/
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   ├── 📂 part6/        # Part 6: Text Completion
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   │   └── 📂 [exerciseId]/
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   └── 📂 part7/        # Part 7: Reading Comprehension
│   │   │   │   │       ├── 📄 page.tsx
│   │   │   │   │       └── 📂 [exerciseId]/
│   │   │   │   │           └── 📄 page.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 practice-test/    # === Thi Thử ===
│   │   │   │   │   ├── 📄 page.tsx      # Danh sách đề thi
│   │   │   │   │   ├── 📂 [testId]/
│   │   │   │   │   │   ├── 📄 page.tsx  # Thông tin đề thi
│   │   │   │   │   │   ├── 📂 take/
│   │   │   │   │   │   │   └── 📄 page.tsx  # Làm bài thi
│   │   │   │   │   │   └── 📂 result/
│   │   │   │   │   │       └── 📄 page.tsx  # Kết quả thi
│   │   │   │   │   └── 📂 history/
│   │   │   │   │       └── 📄 page.tsx  # Lịch sử thi
│   │   │   │   │
│   │   │   │   ├── 📂 grammar/          # === Ngữ Pháp ===
│   │   │   │   │   ├── 📄 page.tsx      # Danh sách bài ngữ pháp
│   │   │   │   │   └── 📂 [lessonId]/
│   │   │   │   │       └── 📄 page.tsx  # Chi tiết bài ngữ pháp
│   │   │   │   │
│   │   │   │   ├── 📂 progress/         # === Tiến Trình ===
│   │   │   │   │   └── 📄 page.tsx      # Thống kê & dashboard cá nhân
│   │   │   │   │
│   │   │   │   ├── 📂 leaderboard/      # === Bảng Xếp Hạng ===
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │
│   │   │   │   └── 📂 profile/          # === Hồ Sơ Cá Nhân ===
│   │   │   │       └── 📄 page.tsx
│   │   │   │
│   │   │   ├── 📂 admin/               # Admin panel
│   │   │   │   ├── 📄 layout.tsx
│   │   │   │   ├── 📄 page.tsx          # Admin dashboard
│   │   │   │   ├── 📂 users/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📂 questions/
│   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   └── 📂 create/
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📂 tests/
│   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   └── 📂 create/
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   └── 📂 vocabulary/
│   │   │   │       ├── 📄 page.tsx
│   │   │   │       └── 📂 create/
│   │   │   │           └── 📄 page.tsx
│   │   │   │
│   │   │   └── 📂 api/                 # Next.js API Routes
│   │   │       └── 📂 auth/
│   │   │           └── 📂 [...nextauth]/
│   │   │               └── 📄 route.ts  # NextAuth handler
│   │   │
│   │   ├── 📂 components/              # React Components
│   │   │   ├── 📂 ui/                  # Base UI (Shadcn/UI)
│   │   │   │   ├── 📄 button.tsx
│   │   │   │   ├── 📄 card.tsx
│   │   │   │   ├── 📄 dialog.tsx
│   │   │   │   ├── 📄 input.tsx
│   │   │   │   ├── 📄 progress.tsx
│   │   │   │   ├── 📄 select.tsx
│   │   │   │   ├── 📄 tabs.tsx
│   │   │   │   ├── 📄 toast.tsx
│   │   │   │   └── 📄 avatar.tsx
│   │   │   │
│   │   │   ├── 📂 layout/              # Layout components
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   ├── 📄 Sidebar.tsx
│   │   │   │   ├── 📄 Footer.tsx
│   │   │   │   ├── 📄 MobileNav.tsx
│   │   │   │   └── 📄 Breadcrumb.tsx
│   │   │   │
│   │   │   ├── 📂 vocabulary/           # Vocabulary components
│   │   │   │   ├── 📄 FlashCard.tsx
│   │   │   │   ├── 📄 WordList.tsx
│   │   │   │   ├── 📄 TopicCard.tsx
│   │   │   │   ├── 📄 VocabQuiz.tsx
│   │   │   │   └── 📄 SpacedRepetition.tsx
│   │   │   │
│   │   │   ├── 📂 listening/            # Listening components
│   │   │   │   ├── 📄 AudioPlayer.tsx
│   │   │   │   ├── 📄 QuestionCard.tsx
│   │   │   │   ├── 📄 PhotographViewer.tsx
│   │   │   │   └── 📄 TranscriptViewer.tsx
│   │   │   │
│   │   │   ├── 📂 reading/             # Reading components
│   │   │   │   ├── 📄 PassageViewer.tsx
│   │   │   │   ├── 📄 QuestionPanel.tsx
│   │   │   │   └── 📄 HighlightText.tsx
│   │   │   │
│   │   │   ├── 📂 test/                # Test components
│   │   │   │   ├── 📄 TestTimer.tsx
│   │   │   │   ├── 📄 QuestionNavigator.tsx
│   │   │   │   ├── 📄 AnswerSheet.tsx
│   │   │   │   ├── 📄 ResultChart.tsx
│   │   │   │   └── 📄 ScoreBreakdown.tsx
│   │   │   │
│   │   │   ├── 📂 progress/            # Progress components
│   │   │   │   ├── 📄 StreakCalendar.tsx
│   │   │   │   ├── 📄 SkillRadar.tsx
│   │   │   │   ├── 📄 ScoreHistory.tsx
│   │   │   │   └── 📄 StudyStats.tsx
│   │   │   │
│   │   │   └── 📂 common/              # Shared components
│   │   │       ├── 📄 LoadingSpinner.tsx
│   │   │       ├── 📄 ErrorBoundary.tsx
│   │   │       ├── 📄 EmptyState.tsx
│   │   │       ├── 📄 Pagination.tsx
│   │   │       └── 📄 ConfirmDialog.tsx
│   │   │
│   │   ├── 📂 hooks/                   # Custom React hooks
│   │   │   ├── 📄 useAuth.ts
│   │   │   ├── 📄 useTimer.ts
│   │   │   ├── 📄 useAudio.ts
│   │   │   ├── 📄 useProgress.ts
│   │   │   ├── 📄 useQuiz.ts
│   │   │   └── 📄 useDebounce.ts
│   │   │
│   │   ├── 📂 lib/                     # Utilities & configurations
│   │   │   ├── 📄 api-client.ts        # Axios/fetch wrapper
│   │   │   ├── 📄 auth.ts              # NextAuth config
│   │   │   ├── 📄 utils.ts             # Helper functions
│   │   │   ├── 📄 constants.ts         # App constants
│   │   │   └── 📄 validators.ts        # Zod schemas
│   │   │
│   │   ├── 📂 stores/                  # State management (Zustand)
│   │   │   ├── 📄 useTestStore.ts      # Test session state
│   │   │   ├── 📄 useVocabStore.ts     # Vocabulary state
│   │   │   └── 📄 useUIStore.ts        # UI state (sidebar, theme)
│   │   │
│   │   └── 📂 types/                   # TypeScript types
│   │       ├── 📄 user.ts
│   │       ├── 📄 vocabulary.ts
│   │       ├── 📄 question.ts
│   │       ├── 📄 test.ts
│   │       ├── 📄 progress.ts
│   │       └── 📄 api.ts
│   │
│   └── 📂 __tests__/                   # Frontend tests
│       ├── 📂 components/
│       ├── 📂 hooks/
│       └── 📂 pages/
│
├── 📂 backend/                          # ===== BACKEND (Express.js) =====
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 Dockerfile                    # Docker build cho backend
│   ├── 📄 .env.example
│   │
│   ├── 📂 prisma/                       # Prisma ORM
│   │   ├── 📄 schema.prisma            # Database schema
│   │   ├── 📂 migrations/              # Database migrations
│   │   └── 📂 seed/                    # Seed data
│   │       ├── 📄 index.ts             # Main seed runner
│   │       ├── 📄 vocabulary.ts        # Seed từ vựng TOEIC
│   │       ├── 📄 questions.ts         # Seed câu hỏi mẫu
│   │       ├── 📄 grammar.ts           # Seed bài ngữ pháp
│   │       └── 📂 data/                # JSON data files
│   │           ├── 📄 vocab-topics.json
│   │           ├── 📄 sample-questions.json
│   │           └── 📄 grammar-lessons.json
│   │
│   └── 📂 src/
│       ├── 📄 index.ts                  # Entry point
│       ├── 📄 app.ts                    # Express app setup
│       │
│       ├── 📂 config/                   # Configuration
│       │   ├── 📄 database.ts
│       │   ├── 📄 redis.ts
│       │   ├── 📄 storage.ts           # MinIO config
│       │   ├── 📄 cors.ts
│       │   └── 📄 env.ts               # Env validation (zod)
│       │
│       ├── 📂 middleware/               # Express middlewares
│       │   ├── 📄 auth.ts              # JWT verification
│       │   ├── 📄 admin.ts             # Admin role check
│       │   ├── 📄 rateLimiter.ts       # Rate limiting
│       │   ├── 📄 validator.ts         # Request validation
│       │   ├── 📄 errorHandler.ts      # Global error handler
│       │   └── 📄 logger.ts            # Request logging
│       │
│       ├── 📂 routes/                   # API Routes
│       │   ├── 📄 index.ts             # Route aggregator
│       │   ├── 📄 auth.routes.ts       # /api/auth/*
│       │   ├── 📄 user.routes.ts       # /api/users/*
│       │   ├── 📄 vocabulary.routes.ts # /api/vocabulary/*
│       │   ├── 📄 question.routes.ts   # /api/questions/*
│       │   ├── 📄 test.routes.ts       # /api/tests/*
│       │   ├── 📄 listening.routes.ts  # /api/listening/*
│       │   ├── 📄 reading.routes.ts    # /api/reading/*
│       │   ├── 📄 grammar.routes.ts    # /api/grammar/*
│       │   ├── 📄 progress.routes.ts   # /api/progress/*
│       │   ├── 📄 leaderboard.routes.ts # /api/leaderboard/*
│       │   └── 📄 admin.routes.ts      # /api/admin/*
│       │
│       ├── 📂 controllers/             # Request handlers
│       │   ├── 📄 auth.controller.ts
│       │   ├── 📄 user.controller.ts
│       │   ├── 📄 vocabulary.controller.ts
│       │   ├── 📄 question.controller.ts
│       │   ├── 📄 test.controller.ts
│       │   ├── 📄 listening.controller.ts
│       │   ├── 📄 reading.controller.ts
│       │   ├── 📄 grammar.controller.ts
│       │   ├── 📄 progress.controller.ts
│       │   ├── 📄 leaderboard.controller.ts
│       │   └── 📄 admin.controller.ts
│       │
│       ├── 📂 services/                 # Business logic
│       │   ├── 📄 auth.service.ts
│       │   ├── 📄 user.service.ts
│       │   ├── 📄 vocabulary.service.ts
│       │   ├── 📄 question.service.ts
│       │   ├── 📄 test.service.ts       # Tính điểm TOEIC
│       │   ├── 📄 listening.service.ts
│       │   ├── 📄 reading.service.ts
│       │   ├── 📄 grammar.service.ts
│       │   ├── 📄 progress.service.ts   # Spaced repetition logic
│       │   ├── 📄 leaderboard.service.ts
│       │   ├── 📄 storage.service.ts    # File upload (MinIO)
│       │   └── 📄 email.service.ts      # Email notifications
│       │
│       ├── 📂 utils/                    # Utility functions
│       │   ├── 📄 scoring.ts           # TOEIC score calculation
│       │   ├── 📄 pagination.ts
│       │   ├── 📄 hash.ts              # Password hashing
│       │   └── 📄 token.ts             # JWT helpers
│       │
│       └── 📂 types/                    # Shared types
│           ├── 📄 express.d.ts         # Express type extensions
│           └── 📄 index.ts
│
├── 📂 shared/                           # ===== SHARED CODE =====
│   ├── 📄 package.json
│   ├── 📂 types/                        # Shared TypeScript interfaces
│   │   ├── 📄 user.ts
│   │   ├── 📄 vocabulary.ts
│   │   ├── 📄 question.ts
│   │   ├── 📄 test.ts
│   │   └── 📄 api-response.ts
│   ├── 📂 constants/                    # Shared constants
│   │   ├── 📄 toeic-parts.ts           # TOEIC part definitions
│   │   ├── 📄 score-table.ts           # Score conversion table
│   │   └── 📄 vocab-topics.ts          # Topic categories
│   └── 📂 validators/                  # Shared validation schemas
│       ├── 📄 auth.schema.ts
│       └── 📄 question.schema.ts
│
├── 📂 infrastructure/                   # ===== INFRA & DEVOPS =====
│   ├── 📂 docker/
│   │   ├── 📂 nginx/
│   │   │   ├── 📄 nginx.conf           # Reverse proxy config
│   │   │   └── 📄 ssl/                 # SSL certificates
│   │   ├── 📂 postgres/
│   │   │   └── 📄 init.sql             # Initial DB setup
│   │   └── 📂 redis/
│   │       └── 📄 redis.conf
│   │
│   ├── 📂 scripts/
│   │   ├── 📄 setup.sh                 # First-time setup script
│   │   ├── 📄 backup-db.sh             # Database backup
│   │   ├── 📄 restore-db.sh            # Database restore
│   │   └── 📄 seed-data.sh             # Seed initial data
│   │
│   └── 📂 github/
│       └── 📂 workflows/
│           ├── 📄 ci.yml               # CI pipeline
│           ├── 📄 deploy-staging.yml   # Deploy to staging
│           └── 📄 deploy-prod.yml      # Deploy to production
│
└── 📂 content/                          # ===== NỘI DUNG HỌC =====
    ├── 📂 vocabulary/                   # Dữ liệu từ vựng
    │   ├── 📄 01-office.json           # Chủ đề: Văn phòng
    │   ├── 📄 02-finance.json          # Chủ đề: Tài chính
    │   ├── 📄 03-marketing.json        # Chủ đề: Marketing
    │   ├── 📄 04-technology.json       # Chủ đề: Công nghệ
    │   ├── 📄 05-travel.json           # Chủ đề: Du lịch
    │   ├── 📄 06-health.json           # Chủ đề: Sức khỏe
    │   ├── 📄 07-human-resources.json  # Chủ đề: Nhân sự
    │   ├── 📄 08-manufacturing.json    # Chủ đề: Sản xuất
    │   ├── 📄 09-dining.json           # Chủ đề: Ẩm thực
    │   └── 📄 10-entertainment.json    # Chủ đề: Giải trí
    │
    ├── 📂 grammar/                      # Bài học ngữ pháp
    │   ├── 📄 01-tenses.json
    │   ├── 📄 02-passive-voice.json
    │   ├── 📄 03-conditionals.json
    │   ├── 📄 04-relative-clauses.json
    │   └── 📄 05-prepositions.json
    │
    ├── 📂 tests/                        # Đề thi mẫu
    │   ├── 📂 full-test-01/
    │   │   ├── 📄 metadata.json
    │   │   ├── 📄 listening.json
    │   │   ├── 📄 reading.json
    │   │   └── 📂 audio/
    │   │       ├── 📄 part1-01.mp3
    │   │       ├── 📄 part2-01.mp3
    │   │       ├── 📄 part3-01.mp3
    │   │       └── 📄 part4-01.mp3
    │   └── 📂 full-test-02/
    │       └── ...
    │
    └── 📂 images/                       # Hình ảnh cho đề thi
        ├── 📂 part1/                    # Photographs cho Part 1
        └── 📂 passages/                 # Hình cho Reading passages
```

---

## 🗄️ Database Schema (Prisma)

```prisma
// === USERS ===
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  avatar        String?
  role          Role      @default(STUDENT)
  targetScore   Int?      @default(600)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  progress      Progress[]
  testAttempts  TestAttempt[]
  vocabProgress VocabProgress[]
  streaks       StudyStreak[]
}

enum Role {
  STUDENT
  ADMIN
  CONTENT_CREATOR
}

// === VOCABULARY ===
model VocabTopic {
  id          String   @id @default(cuid())
  name        String
  nameVi      String   // Tên tiếng Việt
  description String
  icon        String
  order       Int
  words       Word[]
}

model Word {
  id            String   @id @default(cuid())
  word          String
  pronunciation String   // IPA
  partOfSpeech  String   // noun, verb, adj...
  meaningVi     String   // Nghĩa tiếng Việt
  meaningEn     String   // English definition
  example       String   // Example sentence
  exampleVi     String   // Dịch câu ví dụ
  audioUrl      String?
  imageUrl      String?
  topicId       String
  topic         VocabTopic @relation(fields: [topicId], references: [id])
  progress      VocabProgress[]
}

model VocabProgress {
  id          String   @id @default(cuid())
  userId      String
  wordId      String
  level       Int      @default(0) // 0-5 (spaced repetition level)
  nextReview  DateTime @default(now())
  correctCount Int     @default(0)
  wrongCount  Int      @default(0)
  user        User     @relation(fields: [userId], references: [id])
  word        Word     @relation(fields: [wordId], references: [id])
  
  @@unique([userId, wordId])
}

// === QUESTIONS ===
model Question {
  id          String       @id @default(cuid())
  part        ToeicPart
  type        QuestionType
  content     String       // Question text
  audioUrl    String?      // For listening questions
  imageUrl    String?      // For photograph questions
  passage     String?      // For reading questions
  options     Json         // ["A", "B", "C", "D"]
  answer      String       // Correct answer
  explanation String?      // Giải thích đáp án
  difficulty  Difficulty   @default(MEDIUM)
  tags        String[]     
  
  testQuestions TestQuestion[]
}

enum ToeicPart {
  PART1  // Photographs
  PART2  // Question-Response
  PART3  // Conversations
  PART4  // Talks
  PART5  // Incomplete Sentences
  PART6  // Text Completion
  PART7  // Reading Comprehension
}

enum QuestionType {
  SINGLE_CHOICE
  MULTI_PASSAGE
  FILL_IN_BLANK
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

// === TESTS ===
model Test {
  id          String   @id @default(cuid())
  title       String
  description String
  duration    Int      @default(7200) // 2 hours in seconds
  isFullTest  Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  questions   TestQuestion[]
  attempts    TestAttempt[]
}

model TestQuestion {
  id         String   @id @default(cuid())
  testId     String
  questionId String
  order      Int
  
  test       Test     @relation(fields: [testId], references: [id])
  question   Question @relation(fields: [questionId], references: [id])
}

model TestAttempt {
  id            String   @id @default(cuid())
  userId        String
  testId        String
  answers       Json     // { questionId: selectedAnswer }
  listeningScore Int
  readingScore  Int
  totalScore    Int
  timeSpent     Int      // seconds
  completedAt   DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  test          Test     @relation(fields: [testId], references: [id])
}

// === GRAMMAR ===
model GrammarLesson {
  id          String   @id @default(cuid())
  title       String
  titleVi     String
  content     String   // Markdown content
  examples    Json     // Array of examples
  order       Int
  exercises   Json     // Practice exercises
}

// === PROGRESS ===
model Progress {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @default(now())
  part        ToeicPart
  correct     Int
  total       Int
  timeSpent   Int
  
  user        User     @relation(fields: [userId], references: [id])
}

model StudyStreak {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @db.Date
  minutesStudied Int
  
  user        User     @relation(fields: [userId], references: [id])
  @@unique([userId, date])
}
```

---

## 🏗️ Kiến Trúc Hệ Thống

```mermaid
graph TB
    subgraph Client
        Browser["🌐 Browser"]
    end
    
    subgraph Docker["Docker Compose"]
        Nginx["📦 Nginx<br/>Reverse Proxy<br/>:80/:443"]
        Frontend["⚛️ Next.js<br/>Frontend<br/>:3000"]
        Backend["🟢 Express.js<br/>Backend API<br/>:4000"]
        Postgres["🐘 PostgreSQL<br/>Database<br/>:5432"]
        Redis["🔴 Redis<br/>Cache/Session<br/>:6379"]
        MinIO["📁 MinIO<br/>File Storage<br/>:9000"]
    end
    
    Browser --> Nginx
    Nginx --> Frontend
    Nginx --> Backend
    Backend --> Postgres
    Backend --> Redis
    Backend --> MinIO
    Frontend --> Backend
```

---

## 👥 Phân Chia Công Việc Cho Dev

### 🧑‍💻 Dev 1: Frontend Core (Senior)
**Thời gian: 3-4 tuần**

| Sprint | Task | Ưu tiên |
|--------|------|---------|
| Week 1 | Setup Next.js, Tailwind, Shadcn/UI, Auth pages | 🔴 Cao |
| Week 1 | Layout components (Header, Sidebar, Footer) | 🔴 Cao |
| Week 2 | Dashboard page, Progress components | 🟡 Trung bình |
| Week 2 | Responsive design, Dark mode | 🟡 Trung bình |
| Week 3 | State management (Zustand), API client setup | 🔴 Cao |
| Week 3-4 | Code review, mentoring, optimization | 🟡 Trung bình |

**Deliverables:**
- [ ] Hoàn thiện design system & UI components
- [ ] Auth flow (Login/Register/Forgot Password)
- [ ] Main layout với navigation
- [ ] Dashboard page
- [ ] Zustand stores & API integration layer

---

### 🧑‍💻 Dev 2: Frontend Features (Mid-level)
**Thời gian: 4-5 tuần**

| Sprint | Task | Ưu tiên |
|--------|------|---------|
| Week 1-2 | Vocabulary module (FlashCard, Quiz, Review) | 🔴 Cao |
| Week 2-3 | Listening module (AudioPlayer, Parts 1-4) | 🔴 Cao |
| Week 3-4 | Reading module (PassageViewer, Parts 5-7) | 🔴 Cao |
| Week 4-5 | Practice Test UI (Timer, Navigator, Result) | 🔴 Cao |
| Week 5 | Grammar module, Leaderboard | 🟡 Trung bình |

**Deliverables:**
- [ ] Vocabulary: Flashcard flip animation, spaced repetition UI
- [ ] Listening: Audio player with controls, transcript toggle
- [ ] Reading: Passage viewer with highlight, question panel
- [ ] Test: Full test interface with timing and navigation
- [ ] Grammar lesson viewer

---

### 🧑‍💻 Dev 3: Backend API (Senior)
**Thời gian: 3-4 tuần**

| Sprint | Task | Ưu tiên |
|--------|------|---------|
| Week 1 | Express setup, Prisma, Auth (JWT + NextAuth) | 🔴 Cao |
| Week 1 | Middleware (auth, validation, error handling) | 🔴 Cao |
| Week 2 | Vocabulary CRUD API + Search | 🔴 Cao |
| Week 2 | Question & Test APIs | 🔴 Cao |
| Week 3 | Listening & Reading exercise APIs | 🟡 Trung bình |
| Week 3 | Progress tracking & Score calculation | 🔴 Cao |
| Week 4 | Leaderboard (Redis), Admin APIs | 🟡 Trung bình |

**Deliverables:**
- [ ] RESTful API hoàn chỉnh với authentication
- [ ] TOEIC score calculation logic
- [ ] Spaced repetition algorithm (SM-2)
- [ ] File upload service (MinIO)
- [ ] Rate limiting & security

---

### 🧑‍💻 Dev 4: Backend Data & Content (Mid-level)
**Thời gian: 3-4 tuần**

| Sprint | Task | Ưu tiên |
|--------|------|---------|
| Week 1 | Database schema setup & migrations | 🔴 Cao |
| Week 1-2 | Seed data: 1000+ từ vựng TOEIC | 🔴 Cao |
| Week 2-3 | Seed data: 500+ câu hỏi mẫu (Part 1-7) | 🔴 Cao |
| Week 3 | Seed data: Bài ngữ pháp + exercises | 🟡 Trung bình |
| Week 3-4 | Tạo 3 full practice tests | 🟡 Trung bình |
| Week 4 | Admin panel APIs (CRUD management) | 🟡 Trung bình |

**Deliverables:**
- [ ] Database hoàn chỉnh với seed data
- [ ] 10 chủ đề từ vựng × 100+ từ mỗi chủ đề
- [ ] 500+ câu hỏi mẫu đủ 7 parts
- [ ] 3 bộ đề thi thử hoàn chỉnh
- [ ] Grammar content (10+ bài)

---

### 🧑‍💻 Dev 5: DevOps & QA (Junior-Mid)
**Thời gian: 2-3 tuần + ongoing**

| Sprint | Task | Ưu tiên |
|--------|------|---------|
| Week 1 | Docker Compose setup (dev + prod) | 🔴 Cao |
| Week 1 | Nginx reverse proxy + SSL | 🔴 Cao |
| Week 2 | CI/CD pipeline (GitHub Actions) | 🟡 Trung bình |
| Week 2 | Backup scripts, monitoring | 🟡 Trung bình |
| Week 3+ | E2E testing, performance testing | 🟢 Thấp |
| Ongoing | Bug fixes, deployment support | 🟡 Trung bình |

**Deliverables:**
- [ ] `docker-compose up` chạy toàn bộ stack
- [ ] CI/CD auto deploy
- [ ] SSL certificate setup
- [ ] Database backup/restore scripts
- [ ] Documentation: deployment guide

---

## 🐳 Self-Host với Docker

**docker-compose.yml** sẽ bao gồm:

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    depends_on: [frontend, backend]
    
  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
      
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/toeic
      - REDIS_URL=redis://redis:6379
    depends_on: [postgres, redis]
    
  postgres:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    
  redis:
    image: redis:7-alpine
    
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes: [minio_data:/data]

volumes:
  postgres_data:
  minio_data:
```

**Deploy chỉ cần 3 bước:**
```bash
git clone https://github.com/your-org/toeic-learning.git
cp .env.example .env  # Cấu hình biến môi trường
docker-compose up -d   # Khởi chạy
```

---

## ✅ Kế Hoạch Xác Minh

### Automated Tests
- **Frontend**: Jest + React Testing Library cho components
- **Backend**: Jest + Supertest cho API endpoints
- **E2E**: Playwright cho critical user flows
- **Lệnh chạy**: `npm test` trong mỗi package

### Manual Verification
1. Kiểm tra responsive trên mobile/tablet/desktop
2. Test full practice test flow (120 phút)
3. Verify TOEIC score calculation accuracy
4. Test audio playback trên các browser
5. Self-host test trên VPS mới (Ubuntu)

---

## ⏱️ Timeline Tổng Thể

```mermaid
gantt
    title TOEIC Learning Web - Timeline
    dateFormat  YYYY-MM-DD
    section Dev 1 - FE Core
    Setup & Auth          :a1, 2026-04-21, 7d
    Layout & Dashboard    :a2, after a1, 7d
    State & API Layer     :a3, after a2, 7d
    Review & Optimize     :a4, after a3, 7d
    
    section Dev 2 - FE Features
    Vocabulary Module     :b1, 2026-04-28, 10d
    Listening Module      :b2, after b1, 7d
    Reading Module        :b3, after b2, 7d
    Test & Grammar        :b4, after b3, 10d
    
    section Dev 3 - BE API
    Auth & Middleware      :c1, 2026-04-21, 7d
    Vocab & Question APIs  :c2, after c1, 7d
    Exercise & Score APIs  :c3, after c2, 7d
    Leaderboard & Admin    :c4, after c3, 7d
    
    section Dev 4 - Data
    Schema & Migrations    :d1, 2026-04-21, 5d
    Vocab Seed Data        :d2, after d1, 10d
    Questions & Tests      :d3, after d2, 10d
    Grammar Content        :d4, after d3, 5d
    
    section Dev 5 - DevOps
    Docker & Nginx         :e1, 2026-04-21, 7d
    CI/CD Pipeline         :e2, after e1, 7d
    Testing & Monitoring   :e3, after e2, 14d
```

> [!IMPORTANT]
> **Tổng thời gian ước tính: 5-6 tuần** với 5 developers làm song song.
> MVP (Minimum Viable Product) có thể ra mắt sau **3 tuần** với các tính năng cốt lõi.

---

## Câu Hỏi Mở

> [!IMPORTANT]
> 1. **Bạn muốn dùng Tailwind CSS hay Vanilla CSS?** Plan hiện tại đề xuất Tailwind + Shadcn/UI cho tốc độ phát triển, nhưng nếu bạn muốn Vanilla CSS thì cần điều chỉnh.
> 2. **Số lượng developer thực tế?** Plan chia cho 5 dev, nhưng có thể gộp nếu ít hơn.
> 3. **Bạn có sẵn nội dung TOEIC không?** (Từ vựng, câu hỏi, đề thi) hay cần tạo từ đầu?
> 4. **Ngôn ngữ giao diện?** Chỉ tiếng Việt, hay hỗ trợ cả English?
> 5. **Bạn muốn tôi bắt đầu tạo code skeleton ngay không?**
