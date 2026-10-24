const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const total = await p.question.count();
  console.log('Total questions:', total);

  const byArea = await p.question.groupBy({
    by: ['primaryTopicId'],
    _count: true,
  });

  const topics = await p.topic.findMany({
    select: { id: true, examArea: true, nameEn: true },
  });

  const areaCounts = {};
  for (const item of byArea) {
    const topic = topics.find(t => t.id === item.primaryTopicId);
    if (topic) {
      areaCounts[topic.examArea] = (areaCounts[topic.examArea] || 0) + item._count;
    }
  }
  console.log('By exam area:', JSON.stringify(areaCounts, null, 2));

  const byDiff = await p.question.groupBy({ by: ['difficulty'], _count: true });
  console.log('By difficulty:', JSON.stringify(byDiff));

  const byType = await p.question.groupBy({ by: ['questionType'], _count: true });
  console.log('By type:', JSON.stringify(byType));

  const byStatus = await p.question.groupBy({ by: ['validationStatus'], _count: true });
  console.log('By status:', JSON.stringify(byStatus));

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
