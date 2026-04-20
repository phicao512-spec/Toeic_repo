# 👨‍💻 Dev 1: Frontend Core (Senior Frontend Developer)

## Role & Responsibilities
Xây dựng nền tảng frontend, design system, authentication, và layout chính của ứng dụng.

## Prerequisites
- Thành thạo Next.js 14 (App Router), TypeScript, Tailwind CSS
- Kinh nghiệm với Shadcn/UI, Zustand, NextAuth.js
- Hiểu biết về responsive design, accessibility

---

## Sprint 1 (Week 1): Project Setup & Authentication

### Task 1.1: Initialize Next.js Project
- [ ] Tạo Next.js 14 project với App Router
- [ ] Cấu hình TypeScript, ESLint, Prettier
- [ ] Cài đặt và cấu hình Tailwind CSS
- [ ] Cài đặt Shadcn/UI, chọn theme colors
- [ ] Setup project structure (folders as per architecture)

**Files to create:**
```
frontend/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── src/app/layout.tsx
├── src/app/globals.css
├── src/app/loading.tsx
├── src/app/not-found.tsx
└── src/lib/utils.ts
```

### Task 1.2: Design System & UI Components
- [ ] Cấu hình color palette (primary, secondary, accent colors)
- [ ] Setup typography (Google Fonts: Inter)
- [ ] Dark mode support (next-themes)
- [ ] Install Shadcn/UI components: Button, Card, Dialog, Input, Progress, Select, Tabs, Toast, Avatar

**Files to create:**
```
frontend/src/components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── input.tsx
├── progress.tsx
├── select.tsx
├── tabs.tsx
├── toast.tsx
└── avatar.tsx
```

### Task 1.3: Authentication Pages
- [ ] Login page with email/password form
- [ ] Register page with validation
- [ ] Forgot password page
- [ ] NextAuth.js configuration (credentials provider)
- [ ] Auth middleware (protect routes)
- [ ] Loading states & error handling

**Files to create:**
```
frontend/src/
├── app/(auth)/login/page.tsx
├── app/(auth)/register/page.tsx
├── app/(auth)/forgot-password/page.tsx
├── app/api/auth/[...nextauth]/route.ts
├── lib/auth.ts
├── hooks/useAuth.ts
└── lib/validators.ts (Zod schemas for auth)
```

**Acceptance Criteria:**
- ✅ User can register with name, email, password
- ✅ User can login and is redirected to dashboard
- ✅ Invalid credentials show error message
- ✅ Protected routes redirect to login
- ✅ Responsive on mobile and desktop
- ✅ Form validation with clear error messages

---

## Sprint 2 (Week 2): Layout & Dashboard

### Task 2.1: Main Layout Components
- [ ] Header with logo, user menu, notification bell
- [ ] Sidebar navigation with collapsible items
- [ ] Mobile hamburger menu
- [ ] Breadcrumb component
- [ ] Footer

**Files to create:**
```
frontend/src/
├── app/(main)/layout.tsx
├── components/layout/Header.tsx
├── components/layout/Sidebar.tsx
├── components/layout/Footer.tsx
├── components/layout/MobileNav.tsx
└── components/layout/Breadcrumb.tsx
```

**Sidebar Navigation Items:**
```
📊 Dashboard
📚 Từ Vựng (Vocabulary)
🎧 Luyện Nghe (Listening)
  ├── Part 1: Photographs
  ├── Part 2: Question-Response
  ├── Part 3: Conversations
  └── Part 4: Talks
📖 Luyện Đọc (Reading)
  ├── Part 5: Incomplete Sentences
  ├── Part 6: Text Completion
  └── Part 7: Reading Comprehension
📝 Thi Thử (Practice Test)
📗 Ngữ Pháp (Grammar)
📊 Tiến Trình (Progress)
🏆 Bảng Xếp Hạng (Leaderboard)
👤 Hồ Sơ (Profile)
```

### Task 2.2: Dashboard Page
- [ ] Welcome section with user name
- [ ] Study streak calendar widget
- [ ] Recent activity feed
- [ ] Quick action cards (Start Practice, Review Vocab, Take Test)
- [ ] Score overview chart (latest vs target)
- [ ] Daily study time widget

**Files to create:**
```
frontend/src/
├── app/(main)/dashboard/page.tsx
├── components/progress/StreakCalendar.tsx
├── components/progress/ScoreHistory.tsx
└── components/progress/StudyStats.tsx
```

**Acceptance Criteria:**
- ✅ Layout renders correctly on all screen sizes
- ✅ Sidebar collapses on mobile
- ✅ Active navigation item is highlighted
- ✅ Dashboard shows meaningful data widgets
- ✅ Smooth animations on sidebar toggle

---

## Sprint 3 (Week 3): State Management & API Layer

### Task 3.1: API Client Setup
- [ ] Create axios/fetch wrapper with interceptors
- [ ] Auto-attach auth token to requests
- [ ] Handle token refresh on 401
- [ ] Error handling & toast notifications
- [ ] Request/response logging (dev mode)

**Files to create:**
```
frontend/src/
├── lib/api-client.ts
├── lib/constants.ts
└── types/api.ts
```

### Task 3.2: Zustand Stores
- [ ] UI Store (sidebar state, theme, notifications)
- [ ] Test Store (current test session, answers, timer)
- [ ] Vocab Store (current topic, review queue)

**Files to create:**
```
frontend/src/stores/
├── useUIStore.ts
├── useTestStore.ts
└── useVocabStore.ts
```

### Task 3.3: Common Components
- [ ] LoadingSpinner with different sizes
- [ ] ErrorBoundary with retry button
- [ ] EmptyState with illustration
- [ ] Pagination component
- [ ] ConfirmDialog for destructive actions

**Files to create:**
```
frontend/src/components/common/
├── LoadingSpinner.tsx
├── ErrorBoundary.tsx
├── EmptyState.tsx
├── Pagination.tsx
└── ConfirmDialog.tsx
```

---

## Sprint 4 (Week 4): Code Review & Optimization

### Task 4.1: Code Review
- [ ] Review Dev 2's feature components
- [ ] Ensure consistent patterns and naming
- [ ] Check accessibility (ARIA labels, keyboard navigation)
- [ ] Review TypeScript types coverage

### Task 4.2: Performance Optimization
- [ ] Implement code splitting with dynamic imports
- [ ] Add loading skeletons for async content
- [ ] Optimize images with Next.js Image component
- [ ] Add SEO meta tags to all pages
- [ ] Setup error tracking (optional: Sentry)

### Task 4.3: Admin Layout
- [ ] Admin layout with separate navigation
- [ ] Admin dashboard page (user count, question count, etc.)
- [ ] Role-based route protection

**Files to create:**
```
frontend/src/
├── app/admin/layout.tsx
└── app/admin/page.tsx
```

---

## Definition of Done
- [ ] All pages are responsive (mobile, tablet, desktop)
- [ ] Dark mode works correctly
- [ ] No TypeScript errors
- [ ] ESLint passes with no warnings
- [ ] Auth flow works end-to-end
- [ ] All components have proper loading & error states
- [ ] Accessibility: keyboard navigable, proper ARIA labels
