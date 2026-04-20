# 🗄️ Database Schema

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│     User     │     │   VocabProgress  │     │     Word     │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK)      │◄───┤ userId (FK)      │    ┌┤ id (PK)      │
│ email        │     │ wordId (FK)      ├───►│ word         │
│ name         │     │ level            │    │ pronunciation│
│ password     │     │ nextReview       │    │ partOfSpeech │
│ avatar       │     │ correctCount     │    │ meaningVi    │
│ role         │     │ wrongCount       │    │ meaningEn    │
│ targetScore  │     └──────────────────┘    │ example      │
│ createdAt    │                              │ audioUrl     │
│ updatedAt    │     ┌──────────────────┐    │ imageUrl     │
└──────┬───────┘     │   TestAttempt    │    │ topicId (FK) │
       │             ├──────────────────┤    └──────┬───────┘
       │◄────────────┤ userId (FK)      │           │
       │             │ testId (FK)      ├──┐        │
       │             │ answers (JSON)   │  │   ┌────▼───────┐
       │             │ listeningScore   │  │   │ VocabTopic │
       │             │ readingScore     │  │   ├────────────┤
       │             │ totalScore       │  │   │ id (PK)    │
       │             │ timeSpent        │  │   │ name       │
       │             │ completedAt      │  │   │ nameVi     │
       │             └──────────────────┘  │   │ description│
       │                                   │   │ icon       │
       │             ┌──────────────────┐  │   │ order      │
       │             │    Progress      │  │   └────────────┘
       │◄────────────┤ userId (FK)      │  │
       │             │ date             │  │   ┌────────────┐
       │             │ part             │  └──►│    Test    │
       │             │ correct          │      ├────────────┤
       │             │ total            │      │ id (PK)    │
       │             │ timeSpent        │      │ title      │
       │             └──────────────────┘      │ description│
       │                                       │ duration   │
       │             ┌──────────────────┐      │ isFullTest │
       │             │   StudyStreak    │      └─────┬──────┘
       │◄────────────┤ userId (FK)      │            │
                     │ date             │      ┌─────▼──────────┐
                     │ minutesStudied   │      │  TestQuestion  │
                     └──────────────────┘      ├────────────────┤
                                               │ testId (FK)    │
                                               │ questionId(FK) ├──┐
                                               │ order          │  │
                                               └────────────────┘  │
                                                                    │
                     ┌──────────────────┐                           │
                     │  GrammarLesson   │      ┌────────────────┐  │
                     ├──────────────────┤      │    Question    │◄─┘
                     │ id (PK)          │      ├────────────────┤
                     │ title            │      │ id (PK)        │
                     │ titleVi          │      │ part           │
                     │ content (MD)     │      │ type           │
                     │ examples (JSON)  │      │ content        │
                     │ order            │      │ audioUrl       │
                     │ exercises (JSON) │      │ imageUrl       │
                     └──────────────────┘      │ passage        │
                                               │ options (JSON) │
                                               │ answer         │
                                               │ explanation    │
                                               │ difficulty     │
                                               │ tags           │
                                               └────────────────┘
```

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =============================================
// USER & AUTHENTICATION
// =============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    // bcrypt hashed
  avatar        String?
  role          Role      @default(STUDENT)
  targetScore   Int?      @default(600)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  progress      Progress[]
  testAttempts  TestAttempt[]
  vocabProgress VocabProgress[]
  streaks       StudyStreak[]

  @@index([email])
  @@map("users")
}

enum Role {
  STUDENT
  ADMIN
  CONTENT_CREATOR
}

// =============================================
// VOCABULARY
// =============================================

model VocabTopic {
  id          String   @id @default(cuid())
  name        String   // English name
  nameVi      String   // Vietnamese name
  description String
  icon        String   // Emoji or icon name
  order       Int      // Display order
  createdAt   DateTime @default(now())

  words       Word[]

  @@map("vocab_topics")
}

model Word {
  id            String   @id @default(cuid())
  word          String
  pronunciation String   // IPA notation, e.g. /ɪɡˈzæm.pəl/
  partOfSpeech  String   // noun, verb, adjective, adverb, etc.
  meaningVi     String   // Vietnamese meaning
  meaningEn     String   // English definition
  example       String   // Example sentence
  exampleVi     String   // Vietnamese translation of example
  audioUrl      String?  // URL to pronunciation audio
  imageUrl      String?  // URL to illustrative image
  topicId       String
  createdAt     DateTime @default(now())

  topic         VocabTopic     @relation(fields: [topicId], references: [id], onDelete: Cascade)
  progress      VocabProgress[]

  @@index([topicId])
  @@index([word])
  @@map("words")
}

model VocabProgress {
  id           String   @id @default(cuid())
  userId       String
  wordId       String
  level        Int      @default(0)    // SM-2 level: 0-5
  easeFactor   Float    @default(2.5)  // SM-2 ease factor
  nextReview   DateTime @default(now())
  correctCount Int      @default(0)
  wrongCount   Int      @default(0)
  lastReviewed DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  word         Word     @relation(fields: [wordId], references: [id], onDelete: Cascade)

  @@unique([userId, wordId])
  @@index([userId, nextReview])
  @@map("vocab_progress")
}

// =============================================
// QUESTIONS
// =============================================

model Question {
  id          String       @id @default(cuid())
  part        ToeicPart    // Which TOEIC part
  type        QuestionType
  content     String       // Question text / prompt
  audioUrl    String?      // Audio file URL (listening parts)
  imageUrl    String?      // Image URL (Part 1 photographs)
  passage     String?      // Reading passage text (reading parts)
  passageGroup String?     // Group ID for multi-question passages
  options     Json         // ["Option A", "Option B", "Option C", "Option D"]
  answer      String       // Correct answer: "A", "B", "C", or "D"
  explanation String?      // Explanation in Vietnamese
  explanationEn String?    // Explanation in English
  difficulty  Difficulty   @default(MEDIUM)
  tags        String[]     // Tags for categorization
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  testQuestions TestQuestion[]

  @@index([part])
  @@index([difficulty])
  @@map("questions")
}

enum ToeicPart {
  PART1  // Photographs (Listening)
  PART2  // Question-Response (Listening)
  PART3  // Conversations (Listening)
  PART4  // Talks (Listening)
  PART5  // Incomplete Sentences (Reading)
  PART6  // Text Completion (Reading)
  PART7  // Reading Comprehension (Reading)
}

enum QuestionType {
  SINGLE_CHOICE     // Standard 4-option MCQ
  MULTI_PASSAGE     // Part 7 double/triple passage
  FILL_IN_BLANK     // Part 6 text completion
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

// =============================================
// TESTS
// =============================================

model Test {
  id          String   @id @default(cuid())
  title       String   // e.g., "TOEIC Practice Test #1"
  description String
  duration    Int      @default(7200)  // Duration in seconds (default: 2 hours)
  isFullTest  Boolean  @default(true)  // Full test vs mini test
  totalQuestions Int   @default(200)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  questions   TestQuestion[]
  attempts    TestAttempt[]

  @@map("tests")
}

model TestQuestion {
  id         String   @id @default(cuid())
  testId     String
  questionId String
  order      Int      // Question order in the test (1-200)

  test       Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([testId, questionId])
  @@unique([testId, order])
  @@map("test_questions")
}

model TestAttempt {
  id             String   @id @default(cuid())
  userId         String
  testId         String
  answers        Json     // { "questionId": "selectedAnswer", ... }
  listeningScore Int      // Converted TOEIC listening score (5-495)
  readingScore   Int      // Converted TOEIC reading score (5-495)
  totalScore     Int      // Total TOEIC score (10-990)
  correctListening Int    // Number of correct listening answers
  correctReading Int      // Number of correct reading answers
  timeSpent      Int      // Time spent in seconds
  status         TestStatus @default(COMPLETED)
  startedAt      DateTime @default(now())
  completedAt    DateTime @default(now())

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  test           Test     @relation(fields: [testId], references: [id], onDelete: Cascade)

  @@index([userId, completedAt])
  @@map("test_attempts")
}

enum TestStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

// =============================================
// GRAMMAR
// =============================================

model GrammarLesson {
  id          String   @id @default(cuid())
  title       String   // English title
  titleVi     String   // Vietnamese title
  content     String   // Markdown content with examples
  summary     String?  // Brief summary
  examples    Json     // [{ "en": "...", "vi": "...", "grammar_point": "..." }]
  order       Int      // Display order
  difficulty  Difficulty @default(MEDIUM)
  exercises   Json     // [{ "question": "...", "options": [...], "answer": "..." }]
  tags        String[] // e.g., ["tenses", "part5"]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("grammar_lessons")
}

// =============================================
// PROGRESS & ANALYTICS
// =============================================

model Progress {
  id          String    @id @default(cuid())
  userId      String
  date        DateTime  @default(now())
  part        ToeicPart // Which TOEIC part was practiced
  correct     Int       // Number of correct answers
  total       Int       // Total questions attempted
  timeSpent   Int       // Time spent in seconds
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@index([userId, part])
  @@map("progress")
}

model StudyStreak {
  id             String   @id @default(cuid())
  userId         String
  date           DateTime @db.Date  // Date only (no time)
  minutesStudied Int      // Total minutes studied on this day
  wordsLearned   Int      @default(0)
  questionsAnswered Int   @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId, date])
  @@map("study_streaks")
}
```

## TOEIC Score Conversion Table

The backend uses official ETS score conversion tables to convert raw scores to scaled TOEIC scores:

```
Raw Correct (Listening) → Scaled Score (5-495)
Raw Correct (Reading)   → Scaled Score (5-495)
Total Score             → 10-990
```

Example conversion (approximate):
| Raw Correct | Listening Score | Reading Score |
|-------------|----------------|---------------|
| 96-100      | 475-495        | 460-495       |
| 91-95       | 435-495        | 420-470       |
| 86-90       | 400-450        | 385-430       |
| 81-85       | 370-420        | 350-400       |
| 76-80       | 340-390        | 320-370       |
| 71-75       | 310-360        | 290-340       |
| 66-70       | 280-330        | 260-310       |
| 61-65       | 250-300        | 235-280       |
| 56-60       | 220-270        | 210-255       |
| 51-55       | 195-245        | 185-230       |
| 46-50       | 165-215        | 160-205       |
| 41-45       | 140-190        | 135-180       |
| 36-40       | 115-160        | 110-155       |
| 31-35       | 95-135         | 90-130        |
| 26-30       | 75-110         | 70-110        |
| 21-25       | 55-90          | 55-85         |
| 16-20       | 40-70          | 40-65         |
| 11-15       | 25-55          | 25-50         |
| 6-10        | 15-40          | 15-35         |
| 0-5         | 5-25           | 5-20          |

## Indexes Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| users | email | Fast login lookup |
| words | topicId | Filter words by topic |
| words | word | Word search |
| vocab_progress | (userId, nextReview) | Spaced repetition queries |
| questions | part | Filter by TOEIC part |
| questions | difficulty | Filter by difficulty |
| test_attempts | (userId, completedAt) | User test history |
| progress | (userId, date) | Daily progress lookup |
| progress | (userId, part) | Part-specific progress |
| study_streaks | (userId, date) | Streak calculation |
