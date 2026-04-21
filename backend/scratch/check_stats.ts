import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const parts = ['PART1', 'PART2', 'PART3', 'PART4', 'PART5', 'PART6', 'PART7'];
  console.log('--- THỐNG KÊ CÂU HỎI TRONG DATABASE ---');
  
  for (const part of parts) {
    const count = await prisma.question.count({
      where: { part }
    });
    console.log(`${part}: ${count} câu hỏi`);
  }

  const vocabCount = await prisma.vocabulary.count();
  console.log(`Từ vựng: ${vocabCount} từ`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
