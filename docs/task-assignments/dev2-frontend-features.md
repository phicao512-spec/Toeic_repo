# 👨‍💻 Dev 2: Frontend Features (Mid-level Frontend Developer)

## Role & Responsibilities
Xây dựng các module tính năng chính: Vocabulary, Listening, Reading, Practice Test, Grammar.

## Prerequisites
- Kinh nghiệm React/Next.js, TypeScript
- Biết làm animations (CSS/Framer Motion)
- Kinh nghiệm với audio/media APIs
- Đọc và hiểu: `docs/api-spec.md`, `docs/database-schema.md`

## Dependencies
- Chờ Dev 1 hoàn thành Sprint 1-2 (layout, auth, UI components) trước khi bắt đầu

---

## Sprint 1 (Week 1-2): Vocabulary Module

### Task 2.1: Topic List Page
- [ ] Grid layout hiển thị các chủ đề từ vựng
- [ ] Mỗi card hiển thị: icon, tên, số từ, progress bar
- [ ] Search/filter functionality
- [ ] Skeleton loading state

**Files to create:**
```
frontend/src/
├── app/(main)/vocabulary/page.tsx
├── components/vocabulary/TopicCard.tsx
└── types/vocabulary.ts
```

### Task 2.2: Flashcard Component
- [ ] 3D flip animation (front: word, back: meaning)
- [ ] Front side: word, pronunciation, part of speech
- [ ] Back side: Vietnamese meaning, example sentence, audio button
- [ ] Swipe gestures (mobile): left = incorrect, right = correct
- [ ] Button controls: "Biết rồi" / "Chưa biết"
- [ ] Progress indicator (e.g., 5/20 words)

**Files to create:**
```
frontend/src/
├── app/(main)/vocabulary/[topicId]/page.tsx
├── components/vocabulary/FlashCard.tsx
├── components/vocabulary/WordList.tsx
└── hooks/useAudio.ts
```

**Flashcard UI Mockup:**
```
┌──────────────────────────┐
│                          │
│      negotiate           │
│   /nɪˈɡoʊ.ʃi.eɪt/     │
│      (verb)              │
│                          │
│      🔊 Play audio       │
│                          │
│   Tap to flip            │
│                          │
├──────────────────────────┤
│  ❌ Chưa biết   ✅ Biết  │
└──────────────────────────┘
```

### Task 2.3: Vocabulary Quiz
- [ ] Multiple choice quiz (4 options)
- [ ] Show word → choose correct Vietnamese meaning
- [ ] Show Vietnamese → choose correct English word
- [ ] Timer per question (optional)
- [ ] Results summary at the end
- [ ] Animated score reveal

**Files to create:**
```
frontend/src/
├── app/(main)/vocabulary/[topicId]/quiz/page.tsx
├── components/vocabulary/VocabQuiz.tsx
└── hooks/useQuiz.ts
```

### Task 2.4: Spaced Repetition Review
- [ ] Show words due for review (from API)
- [ ] Flashcard interface with SM-2 feedback
- [ ] "No words to review" empty state
- [ ] Stats: words reviewed today, upcoming reviews

**Files to create:**
```
frontend/src/
├── app/(main)/vocabulary/review/page.tsx
└── components/vocabulary/SpacedRepetition.tsx
```

---

## Sprint 2 (Week 2-3): Listening Module

### Task 2.5: Listening Overview Page
- [ ] Cards for Part 1-4 with descriptions
- [ ] Progress indicator for each part
- [ ] TOEIC listening tips section

**Files to create:**
```
frontend/src/
├── app/(main)/listening/page.tsx
└── app/(main)/listening/part1/page.tsx (and part2-4)
```

### Task 2.6: Audio Player Component
- [ ] Play/pause button
- [ ] Progress bar (seekable)
- [ ] Current time / duration display
- [ ] Playback speed control (0.75x, 1x, 1.25x, 1.5x)
- [ ] Repeat button (replay current audio)
- [ ] Volume control

**Files to create:**
```
frontend/src/
├── components/listening/AudioPlayer.tsx
└── hooks/useAudio.ts (extend)
```

### Task 2.7: Listening Exercise Pages
- [ ] **Part 1**: Show photograph + audio + 4 options
- [ ] **Part 2**: Audio only + 3 options (A/B/C)
- [ ] **Part 3**: Conversation audio + 3 questions per set
- [ ] **Part 4**: Talk/lecture audio + 3 questions per set
- [ ] Show/hide transcript toggle
- [ ] Submit answers and show results
- [ ] Explanation for each question

**Files to create:**
```
frontend/src/
├── app/(main)/listening/part1/[exerciseId]/page.tsx
├── app/(main)/listening/part2/[exerciseId]/page.tsx
├── app/(main)/listening/part3/[exerciseId]/page.tsx
├── app/(main)/listening/part4/[exerciseId]/page.tsx
├── components/listening/QuestionCard.tsx
├── components/listening/PhotographViewer.tsx
└── components/listening/TranscriptViewer.tsx
```

---

## Sprint 3 (Week 3-4): Reading Module

### Task 2.8: Reading Overview Page
- [ ] Cards for Part 5-7 with descriptions
- [ ] Progress indicator per part
- [ ] TOEIC reading tips

**Files to create:**
```
frontend/src/
├── app/(main)/reading/page.tsx
└── app/(main)/reading/part5/page.tsx (and part6-7)
```

### Task 2.9: Reading Exercise Pages
- [ ] **Part 5**: Sentence with blank + 4 options
- [ ] **Part 6**: Paragraph with multiple blanks + options
- [ ] **Part 7**: Single/double/triple passage + questions
- [ ] Text highlighting (click to highlight key phrases)
- [ ] Split view: passage on left, questions on right
- [ ] Submit and show detailed explanations

**Files to create:**
```
frontend/src/
├── app/(main)/reading/part5/[exerciseId]/page.tsx
├── app/(main)/reading/part6/[exerciseId]/page.tsx
├── app/(main)/reading/part7/[exerciseId]/page.tsx
├── components/reading/PassageViewer.tsx
├── components/reading/QuestionPanel.tsx
└── components/reading/HighlightText.tsx
```

**Part 7 Layout:**
```
┌─────────────────────┬──────────────────────┐
│                     │ Question 176:        │
│  Email from John    │ What is the purpose  │
│  Dear Ms. Smith,    │ of the email?        │
│  I am writing to    │                      │
│  confirm our...     │ ○ A) To complain     │
│                     │ ○ B) To confirm      │
│  [highlighted text] │ ● C) To request      │
│                     │ ○ D) To cancel       │
│                     │                      │
│                     │ ◄ Prev    Next ►     │
└─────────────────────┴──────────────────────┘
```

---

## Sprint 4 (Week 4-5): Practice Test & Grammar

### Task 2.10: Practice Test UI
- [ ] Test list page (available tests with attempt history)
- [ ] Test info page (description, duration, question count)
- [ ] Full test interface with:
  - Countdown timer (2 hours)
  - Question navigator (grid showing answered/unanswered)
  - Current question display
  - Next/Previous navigation
  - Mark for review feature
  - Submit confirmation dialog
- [ ] Result page with:
  - Total score display (animated counter)
  - Listening vs Reading breakdown
  - Part-by-part accuracy chart
  - Detailed answer review
  - Score history comparison

**Files to create:**
```
frontend/src/
├── app/(main)/practice-test/page.tsx
├── app/(main)/practice-test/[testId]/page.tsx
├── app/(main)/practice-test/[testId]/take/page.tsx
├── app/(main)/practice-test/[testId]/result/page.tsx
├── app/(main)/practice-test/history/page.tsx
├── components/test/TestTimer.tsx
├── components/test/QuestionNavigator.tsx
├── components/test/AnswerSheet.tsx
├── components/test/ResultChart.tsx
├── components/test/ScoreBreakdown.tsx
└── hooks/useTimer.ts
```

**Test Interface Layout:**
```
┌──────────────────────────────────────────────┐
│  TOEIC Practice Test #1    ⏱ 01:45:23       │
├──────────────────────────────────────────────┤
│                              │ Q Navigator  │
│  Question 45 / 200          │ ┌─┬─┬─┬─┬─┐  │
│  Part 3: Conversations      │ │1│2│3│4│5│  │
│                              │ ├─┼─┼─┼─┼─┤  │
│  🔊 [Audio Player]          │ │6│7│8│●│9│  │
│                              │ ├─┼─┼─┼─┼─┤  │
│  What does the man suggest?  │ │ │ │ │ │ │  │
│                              │ └─┴─┴─┴─┴─┘  │
│  ○ A) Postpone the meeting   │               │
│  ○ B) Invite more people     │ ■ Answered    │
│  ● C) Change the venue       │ □ Unanswered  │
│  ○ D) Cancel the event       │ ● Current     │
│                              │ ⚑ Marked      │
│  ◄ Prev  ⚑ Mark   Next ►    │               │
├──────────────────────────────────────────────┤
│                    [Submit Test]              │
└──────────────────────────────────────────────┘
```

### Task 2.11: Grammar Module
- [ ] Grammar lesson list with difficulty badges
- [ ] Lesson content viewer (markdown rendering)
- [ ] Interactive examples with toggle translations
- [ ] Practice exercises within lessons

**Files to create:**
```
frontend/src/
├── app/(main)/grammar/page.tsx
├── app/(main)/grammar/[lessonId]/page.tsx
```

### Task 2.12: Leaderboard & Profile Pages
- [ ] Leaderboard with tabs (weekly/monthly/all-time)
- [ ] User profile page with edit form
- [ ] Target score setting

**Files to create:**
```
frontend/src/
├── app/(main)/leaderboard/page.tsx
├── app/(main)/profile/page.tsx
└── app/(main)/progress/page.tsx
```

---

## Definition of Done
- [ ] All modules work with live API data
- [ ] Animations are smooth (60fps)
- [ ] Audio playback works on Chrome, Firefox, Safari
- [ ] Mobile-friendly touch interactions
- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages
- [ ] No TypeScript errors or ESLint warnings
