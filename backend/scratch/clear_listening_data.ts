import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑 Clearing PART1 and PART2 questions...');
  const deleted = await prisma.question.deleteMany({
    where: {
      part: {
        in: ['PART1', 'PART2']
      }
    }
  });
  console.log(`✅ Deleted ${deleted.count} questions.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
