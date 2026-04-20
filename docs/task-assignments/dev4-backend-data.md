# 👨‍💻 Dev 4: Backend Data & Content (Mid-level Developer)

## Role & Responsibilities
Thiết kế database, tạo seed data từ vựng TOEIC, câu hỏi mẫu, đề thi thử, và nội dung ngữ pháp.

## Prerequisites
- Kinh nghiệm với PostgreSQL, Prisma ORM
- Hiểu biết về TOEIC test format
- Kỹ năng nghiên cứu và tổng hợp nội dung
- Đọc và hiểu: `docs/database-schema.md`

---

## Sprint 1 (Week 1): Database Setup

### Task 4.1: Prisma Schema
- [ ] Tạo file `schema.prisma` theo thiết kế trong `docs/database-schema.md`
- [ ] Chạy migration đầu tiên
- [ ] Verify tất cả relations hoạt động đúng
- [ ] Tạo indexes cho performance

**Files to create:**
```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed/
│       └── index.ts          # Main seed runner
```

### Task 4.2: Shared Types & Constants
- [ ] TypeScript interfaces cho tất cả models
- [ ] TOEIC part definitions và descriptions
- [ ] Score conversion tables
- [ ] Vocabulary topic categories

**Files to create:**
```
shared/
├── package.json
├── types/
│   ├── user.ts
│   ├── vocabulary.ts
│   ├── question.ts
│   ├── test.ts
│   └── api-response.ts
├── constants/
│   ├── toeic-parts.ts
│   ├── score-table.ts
│   └── vocab-topics.ts
└── validators/
    ├── auth.schema.ts
    └── question.schema.ts
```

**TOEIC Parts Definition:**
```typescript
export const TOEIC_PARTS = {
  PART1: {
    name: 'Photographs',
    nameVi: 'Mô tả tranh',
    section: 'LISTENING',
    questionCount: 6,
    description: 'Look at a photograph and choose the statement that best describes it.',
    descriptionVi: 'Nhìn vào bức tranh và chọn câu mô tả đúng nhất.',
    tips: ['Focus on the main action or subject', 'Listen for specific details']
  },
  PART2: {
    name: 'Question-Response',
    nameVi: 'Hỏi - Đáp',
    section: 'LISTENING',
    questionCount: 25,
    description: 'Listen to a question and choose the best response.',
    descriptionVi: 'Nghe câu hỏi và chọn câu trả lời phù hợp nhất.'
  },
  // ... Part 3-7
};
```

---

## Sprint 2 (Week 1-2): Vocabulary Seed Data

### Task 4.3: Vocabulary Content Creation

Tạo **10 chủ đề** × **100+ từ mỗi chủ đề** = **1000+ từ vựng TOEIC**

Mỗi từ cần có:
- `word`: Từ tiếng Anh
- `pronunciation`: IPA notation
- `partOfSpeech`: Loại từ
- `meaningVi`: Nghĩa tiếng Việt
- `meaningEn`: English definition
- `example`: Câu ví dụ
- `exampleVi`: Dịch câu ví dụ

**Topics to create:**

| # | Topic | Vietnamese | Target Words |
|---|-------|------------|-------------|
| 1 | Office & Business | Văn phòng & Kinh doanh | 100+ |
| 2 | Finance & Banking | Tài chính & Ngân hàng | 100+ |
| 3 | Marketing & Advertising | Marketing & Quảng cáo | 100+ |
| 4 | Technology & IT | Công nghệ & CNTT | 100+ |
| 5 | Travel & Transportation | Du lịch & Giao thông | 100+ |
| 6 | Health & Wellness | Sức khỏe | 100+ |
| 7 | Human Resources | Nhân sự | 100+ |
| 8 | Manufacturing & Production | Sản xuất | 100+ |
| 9 | Dining & Hospitality | Ẩm thực & Khách sạn | 100+ |
| 10 | Entertainment & Media | Giải trí & Truyền thông | 100+ |

**Files to create:**
```
content/vocabulary/
├── 01-office-business.json
├── 02-finance-banking.json
├── 03-marketing-advertising.json
├── 04-technology-it.json
├── 05-travel-transportation.json
├── 06-health-wellness.json
├── 07-human-resources.json
├── 08-manufacturing-production.json
├── 09-dining-hospitality.json
└── 10-entertainment-media.json

backend/prisma/seed/
└── vocabulary.ts              # Seed script to import JSON
```

**JSON format example:**
```json
{
  "topic": {
    "name": "Office & Business",
    "nameVi": "Văn phòng & Kinh doanh",
    "description": "Essential vocabulary for office and business environments",
    "icon": "🏢",
    "order": 1
  },
  "words": [
    {
      "word": "negotiate",
      "pronunciation": "/nɪˈɡoʊ.ʃi.eɪt/",
      "partOfSpeech": "verb",
      "meaningVi": "đàm phán, thương lượng",
      "meaningEn": "to discuss something in order to reach an agreement",
      "example": "We need to negotiate the terms of the contract before signing.",
      "exampleVi": "Chúng ta cần đàm phán các điều khoản của hợp đồng trước khi ký."
    },
    {
      "word": "deadline",
      "pronunciation": "/ˈded.laɪn/",
      "partOfSpeech": "noun",
      "meaningVi": "hạn chót, thời hạn",
      "meaningEn": "the latest time or date by which something should be completed",
      "example": "The deadline for submitting the report is next Friday.",
      "exampleVi": "Hạn chót để nộp báo cáo là thứ Sáu tuần tới."
    }
  ]
}
```

---

## Sprint 3 (Week 2-3): Questions Seed Data

### Task 4.4: Create Questions for All 7 Parts

Target: **500+ câu hỏi** covering all parts

| Part | Type | Target Count | Notes |
|------|------|-------------|-------|
| Part 1 | Photographs | 30+ | Need image URLs |
| Part 2 | Question-Response | 75+ | 3 options (A/B/C) |
| Part 3 | Conversations | 120+ | Groups of 3 questions |
| Part 4 | Talks | 90+ | Groups of 3 questions |
| Part 5 | Incomplete Sentences | 90+ | Grammar-focused |
| Part 6 | Text Completion | 48+ | Groups of 4 (per passage) |
| Part 7 | Reading Comprehension | 100+ | Single/double passages |

**Files to create:**
```
content/tests/
├── questions/
│   ├── part1-questions.json
│   ├── part2-questions.json
│   ├── part3-questions.json
│   ├── part4-questions.json
│   ├── part5-questions.json
│   ├── part6-questions.json
│   └── part7-questions.json

backend/prisma/seed/
└── questions.ts
```

**Question JSON format:**
```json
{
  "part": "PART5",
  "type": "SINGLE_CHOICE",
  "content": "The marketing team _____ a new campaign strategy for the upcoming quarter.",
  "options": [
    "A) has developed",
    "B) have developed",
    "C) developing",
    "D) was develop"
  ],
  "answer": "A",
  "explanation": "Subject 'team' là danh từ tập hợp số ít, nên dùng 'has developed' (present perfect, số ít).",
  "explanationEn": "The subject 'team' is a collective noun treated as singular, so it takes 'has developed' (present perfect singular).",
  "difficulty": "MEDIUM",
  "tags": ["grammar", "subject-verb-agreement", "present-perfect"]
}
```

### Task 4.5: Part 3 & 4 with Audio Scripts
- [ ] Write conversation scripts for Part 3
- [ ] Write talk/lecture scripts for Part 4
- [ ] Each set has 3 related questions
- [ ] Include transcript text

**Conversation format:**
```json
{
  "part": "PART3",
  "type": "SINGLE_CHOICE",
  "passageGroup": "conversation_001",
  "passage": "M: Have you seen the latest sales report? Our numbers are up 15% from last quarter.\nW: That's great news! I think the new marketing campaign really helped.\nM: Definitely. Should we present these figures at the board meeting next week?\nW: Yes, I'll prepare a presentation by Wednesday.",
  "content": "What are the speakers mainly discussing?",
  "options": [
    "A) A marketing campaign",
    "B) Sales performance",
    "C) A board meeting schedule",
    "D) A presentation design"
  ],
  "answer": "B",
  "explanation": "Hai người đang thảo luận về kết quả doanh số bán hàng tăng 15%.",
  "difficulty": "EASY"
}
```

---

## Sprint 4 (Week 3-4): Practice Tests & Grammar

### Task 4.6: Create 3 Full Practice Tests
- [ ] Each test = 200 questions (100 Listening + 100 Reading)
- [ ] Proper question distribution per TOEIC format:

**Test Structure:**
```
Listening Section (100 questions):
├── Part 1: 6 questions (Photographs)
├── Part 2: 25 questions (Question-Response)
├── Part 3: 39 questions (13 conversations × 3 questions)
└── Part 4: 30 questions (10 talks × 3 questions)

Reading Section (100 questions):
├── Part 5: 30 questions (Incomplete Sentences)
├── Part 6: 16 questions (4 passages × 4 questions)
└── Part 7: 54 questions (Single + Double + Triple passages)
```

**Files to create:**
```
content/tests/
├── full-test-01/
│   ├── metadata.json
│   ├── listening.json
│   └── reading.json
├── full-test-02/
│   ├── metadata.json
│   ├── listening.json
│   └── reading.json
└── full-test-03/
    ├── metadata.json
    ├── listening.json
    └── reading.json

backend/prisma/seed/
└── tests.ts
```

### Task 4.7: Grammar Content
- [ ] Create 10+ grammar lessons relevant to TOEIC

| # | Topic | Vietnamese |
|---|-------|-----------|
| 1 | Tenses (Thì) | Các thì trong tiếng Anh |
| 2 | Passive Voice | Câu bị động |
| 3 | Conditionals | Câu điều kiện |
| 4 | Relative Clauses | Mệnh đề quan hệ |
| 5 | Prepositions | Giới từ |
| 6 | Conjunctions | Liên từ |
| 7 | Comparatives & Superlatives | So sánh hơn & nhất |
| 8 | Gerunds & Infinitives | Danh động từ & Động từ nguyên mẫu |
| 9 | Modal Verbs | Động từ khiếm khuyết |
| 10 | Parts of Speech | Từ loại |

**Files to create:**
```
content/grammar/
├── 01-tenses.json
├── 02-passive-voice.json
├── 03-conditionals.json
├── 04-relative-clauses.json
├── 05-prepositions.json
├── 06-conjunctions.json
├── 07-comparatives-superlatives.json
├── 08-gerunds-infinitives.json
├── 09-modal-verbs.json
└── 10-parts-of-speech.json

backend/prisma/seed/
└── grammar.ts
```

**Grammar lesson JSON format:**
```json
{
  "title": "Tenses - Present Perfect",
  "titleVi": "Thì Hiện Tại Hoàn Thành",
  "difficulty": "MEDIUM",
  "order": 1,
  "tags": ["tenses", "present-perfect", "part5"],
  "content": "## Present Perfect Tense\n\n### Formation\n**Subject + have/has + past participle (V3)**\n\n### Usage\n1. Actions completed at an unspecified time before now\n2. Actions that started in the past and continue to the present\n3. Life experiences\n\n### Signal Words\n- already, yet, just, ever, never, since, for, recently",
  "summary": "Thì hiện tại hoàn thành diễn tả hành động đã hoàn thành trước hiện tại.",
  "examples": [
    {
      "en": "She has worked at this company for five years.",
      "vi": "Cô ấy đã làm việc tại công ty này được năm năm.",
      "grammarPoint": "has + past participle (worked) + for + duration"
    },
    {
      "en": "We have already submitted the proposal.",
      "vi": "Chúng tôi đã nộp đề xuất rồi.",
      "grammarPoint": "have + already + past participle"
    }
  ],
  "exercises": [
    {
      "question": "The company _____ three new branches since 2020.",
      "options": ["A) opened", "B) has opened", "C) is opening", "D) opens"],
      "answer": "B",
      "explanation": "Dùng 'has opened' vì có 'since 2020' → hiện tại hoàn thành."
    }
  ]
}
```

---

## Sprint 5 (Week 4): Admin Panel Seed & Quality Check

### Task 4.8: Admin Seed Data
- [ ] Create default admin user
- [ ] Verify all seed data imports correctly
- [ ] Check for duplicate entries
- [ ] Validate all references (topicId, testId, etc.)

### Task 4.9: Content Quality Review
- [ ] Proofread all English content
- [ ] Verify Vietnamese translations
- [ ] Check all explanations are helpful
- [ ] Ensure difficulty ratings are appropriate
- [ ] Verify TOEIC format compliance

---

## Seed Script Structure

```typescript
// backend/prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { seedVocabulary } from './vocabulary';
import { seedQuestions } from './questions';
import { seedTests } from './tests';
import { seedGrammar } from './grammar';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Order matters: dependencies first
  await seedVocabulary(prisma);    // 1. Vocabulary topics & words
  await seedQuestions(prisma);     // 2. Questions
  await seedTests(prisma);        // 3. Tests (references questions)
  await seedGrammar(prisma);      // 4. Grammar lessons
  
  console.log('✅ Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Definition of Done
- [ ] `npx prisma db seed` runs without errors
- [ ] 1000+ vocabulary words across 10 topics
- [ ] 500+ questions across all 7 parts
- [ ] 3 complete practice tests (200 questions each)
- [ ] 10+ grammar lessons with exercises
- [ ] All content is accurate and appropriate
- [ ] No orphaned references in database
- [ ] Seed script is idempotent (can run multiple times)
