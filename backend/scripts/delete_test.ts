import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  try {
    const r = await p.vocabTopic.delete({ where: { id: 'cmo6sazms0000113cbnpvl3li' } });
    console.log('Deleted topic:', r.name);
  } catch(e: any) {
    console.log('Topic may already be deleted:', e.message);
  }
  await p.$disconnect();
}

main();
