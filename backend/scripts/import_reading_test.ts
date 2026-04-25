import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importReadingTest() {
  console.log('Starting import process for ETS 2026 READING TEST 1...');

  const dataPath = path.join(__dirname, '../scratch/reading_questions.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const questions: any[] = JSON.parse(rawData);

  // 1. Create a new Test
  const newTest = await prisma.test.create({
    data: {
      title: 'ETS 2026 READING TEST 1',
      description: 'Bài thi thử phần Reading được trích xuất từ sách ETS 2026',
      duration: 75 * 60, // 75 minutes for reading section typically
      isFullTest: false,
      totalQuestions: questions.length,
    },
  });
  console.log(`Created new Test with ID: ${newTest.id}`);

  // 2. Insert questions and link them
  let order = 1;
  const missingNums = [];

  // Sort and remove duplicates from parsing errors just in case
  const uniqueQuestionsMap = new Map();
  for (const q of questions) {
    if (101 <= parseInt(q.id) && parseInt(q.id) <= 200) {
      if (!uniqueQuestionsMap.has(q.id)) {
        uniqueQuestionsMap.set(q.id, q);
      }
    }
  }

  const sortedQuestions = Array.from(uniqueQuestionsMap.values()).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  for (const qData of sortedQuestions) {
    try {
      // Clean up the data
      const optionsArray = qData.options && qData.options.length > 0
        ? qData.options
        : ['(A)', '(B)', '(C)', '(D)']; // fallback if failed to parse options

      // Create Question
      const createdQuestion = await prisma.question.create({
        data: {
          part: qData.part,
          type: 'SINGLE_CHOICE',
          content: qData.content || `Nội dung câu hỏi ${qData.id} (Trích xuất thiếu)`,
          passage: qData.passage ? qData.passage : null,
          options: JSON.stringify(optionsArray),
          answer: qData.answer || 'A', // fallback
          explanation: qData.explanation || 'Không có giải thích',
          difficulty: 'MEDIUM',
          tags: JSON.stringify(['ETS_2026', 'READING', qData.part]),
        },
      });

      // Link Question to Test
      await prisma.testQuestion.create({
        data: {
          testId: newTest.id,
          questionId: createdQuestion.id,
          order: parseInt(qData.id), // Using the actual question number 101-200
        },
      });

      console.log(`Imported question ${qData.id} (${qData.part})`);
    } catch (error) {
      console.error(`Failed to import question ${qData.id}:`, error);
      missingNums.push(qData.id);
    }
  }

  console.log(`--- Import completed! ---`);
  console.log(`Successfully added ${sortedQuestions.length - missingNums.length} questions to Test: ${newTest.title}`);
  if (missingNums.length > 0) {
    console.log(`Errors on questions: ${missingNums.join(', ')}`);
  }

  await prisma.$disconnect();
}

importReadingTest().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
