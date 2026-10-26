// ============================================================
// Import Questions Script
// Loads JSON question files into the database via the API
// Usage: npx tsx prisma/import-questions.ts
// ============================================================

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface QuestionImport {
  questionFamilyId?: string;
  statementEn: string;
  statementEs: string;
  questionType: string;
  difficulty: string;
  primaryTopicExamArea: string;
  multipleAnswerCount?: number | null;
  estimatedTimeSeconds?: number;
  explanationEn?: string;
  explanationEs?: string;
  correctAnswerExplanationEn?: string;
  correctAnswerExplanationEs?: string;
  options: {
    optionLabel: string;
    optionTextEn: string;
    optionTextEs: string;
    isCorrect: boolean;
    explanationEn?: string;
    explanationEs?: string;
  }[];
  sourceName?: string;
  sourceUrl?: string;
  sourceLicense?: string;
}

interface BatchReport {
  file: string;
  questionsReceived: number;
  questionsImported: number;
  questionsRejected: number;
  duplicatesDetected: number;
  errors: { index: number; statement: string; reason: string }[];
}

const EXAM_AREA_MAP: Record<string, string> = {
  network_fundamentals: '1.0',
  network_access: '2.0',
  ip_connectivity: '3.0',
  ip_services: '4.0',
  security_fundamentals: '5.0',
  automation_programmability: '6.0',
};

async function findTopicByArea(examArea: string): Promise<string | null> {
  const areaNumber = EXAM_AREA_MAP[examArea];
  if (!areaNumber) return null;

  const topic = await prisma.topic.findFirst({
    where: {
      examAreaNumber: areaNumber,
      parentTopicId: null, // Get the top-level topic
    },
  });

  // If no top-level topic, try finding any topic in this area
  if (!topic) {
    const anyTopic = await prisma.topic.findFirst({
      where: { examArea },
    });
    return anyTopic?.id || null;
  }

  return topic.id;
}

async function findSubtopicByArea(examArea: string): Promise<string | null> {
  // Try to find a subtopic (child topic) for better distribution
  const areaNumber = EXAM_AREA_MAP[examArea];
  if (!areaNumber) return null;

  const subtopics = await prisma.topic.findMany({
    where: {
      examAreaNumber: areaNumber,
      parentTopicId: { not: null },
    },
  });

  if (subtopics.length === 0) return null;

  // Return a random subtopic for variety
  return subtopics[Math.floor(Math.random() * subtopics.length)].id;
}

function validateQuestion(q: QuestionImport, index: number): string | null {
  if (!q.statementEn || q.statementEn.trim().length < 10) {
    return `Question ${index}: English statement too short or missing`;
  }
  if (!q.statementEs || q.statementEs.trim().length < 10) {
    return `Question ${index}: Spanish statement too short or missing`;
  }
  if (!q.options || q.options.length < 2) {
    return `Question ${index}: Must have at least 2 options`;
  }

  const correctCount = q.options.filter((o) => o.isCorrect).length;
  if (correctCount === 0) {
    return `Question ${index}: No correct answer specified`;
  }

  if (q.questionType === 'single_choice' || q.questionType === 'true_false') {
    if (correctCount !== 1) {
      return `Question ${index}: ${q.questionType} must have exactly 1 correct answer, found ${correctCount}`;
    }
  }

  if (q.questionType === 'multiple_choice') {
    if (!q.multipleAnswerCount || q.multipleAnswerCount < 2) {
      return `Question ${index}: multiple_choice must specify multipleAnswerCount >= 2`;
    }
    if (correctCount !== q.multipleAnswerCount) {
      return `Question ${index}: multiple_choice has ${correctCount} correct answers but multipleAnswerCount is ${q.multipleAnswerCount}`;
    }
  }

  const labels = q.options.map((o) => o.optionLabel);
  if (new Set(labels).size !== labels.length) {
    return `Question ${index}: Duplicate option labels`;
  }

  if (!EXAM_AREA_MAP[q.primaryTopicExamArea]) {
    return `Question ${index}: Invalid exam area '${q.primaryTopicExamArea}'`;
  }

  return null;
}

async function checkDuplicate(statementEn: string): Promise<boolean> {
  // Simple duplicate check based on normalized statement
  const normalized = statementEn.toLowerCase().replace(/\s+/g, ' ').trim();

  const existing = await prisma.question.findMany({
    select: { statementEn: true },
  });

  for (const q of existing) {
    const existingNorm = q.statementEn.toLowerCase().replace(/\s+/g, ' ').trim();

    // Jaccard similarity on words
    const wordsA = new Set(normalized.split(' '));
    const wordsB = new Set(existingNorm.split(' '));
    const intersection = new Set([...wordsA].filter((w) => wordsB.has(w)));
    const union = new Set([...wordsA, ...wordsB]);
    const similarity = intersection.size / union.size;

    if (similarity > 0.85) {
      return true;
    }
  }

  return false;
}

async function importFile(filePath: string): Promise<BatchReport> {
  const report: BatchReport = {
    file: path.basename(filePath),
    questionsReceived: 0,
    questionsImported: 0,
    questionsRejected: 0,
    duplicatesDetected: 0,
    errors: [],
  };

  console.log(`\n📄 Processing: ${report.file}`);

  let data: { questions: QuestionImport[] };
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`  ❌ Failed to parse JSON: ${err}`);
    report.errors.push({ index: -1, statement: '', reason: `Invalid JSON: ${err}` });
    return report;
  }

  if (!data.questions || !Array.isArray(data.questions)) {
    console.error(`  ❌ File must contain a "questions" array`);
    report.errors.push({ index: -1, statement: '', reason: 'Missing "questions" array' });
    return report;
  }

  report.questionsReceived = data.questions.length;
  console.log(`  📝 Questions found: ${report.questionsReceived}`);

  // Get or create source
  let source = await prisma.source.findFirst({
    where: { name: 'CCNA 200-301 Original Questions' },
  });
  if (!source) {
    source = await prisma.source.create({
      data: {
        name: 'CCNA 200-301 Original Questions',
        sourceType: 'original',
        license: 'Original content',
      },
    });
  }

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];

    // Validate
    const validationError = validateQuestion(q, i);
    if (validationError) {
      report.questionsRejected++;
      report.errors.push({
        index: i,
        statement: q.statementEn?.substring(0, 80) || 'N/A',
        reason: validationError,
      });
      console.log(`  ⚠️  Q${i}: Rejected - ${validationError}`);
      continue;
    }

    // Check duplicate
    const isDuplicate = await checkDuplicate(q.statementEn);
    if (isDuplicate) {
      report.duplicatesDetected++;
      report.errors.push({
        index: i,
        statement: q.statementEn.substring(0, 80),
        reason: 'Duplicate detected (>85% similarity)',
      });
      console.log(`  🔄 Q${i}: Duplicate detected, skipping`);
      continue;
    }

    // Find topic
    const topicId = await findSubtopicByArea(q.primaryTopicExamArea) ||
      await findTopicByArea(q.primaryTopicExamArea);

    if (!topicId) {
      report.questionsRejected++;
      report.errors.push({
        index: i,
        statement: q.statementEn.substring(0, 80),
        reason: `No topic found for area '${q.primaryTopicExamArea}'`,
      });
      continue;
    }

    // Create question with options in a transaction
    try {
      await prisma.question.create({
        data: {
          questionFamilyId: q.questionFamilyId,
          statementEn: q.statementEn,
          statementEs: q.statementEs,
          questionType: q.questionType,
          difficulty: q.difficulty,
          multipleAnswerCount: q.multipleAnswerCount || null,
          estimatedTimeSeconds: q.estimatedTimeSeconds || 90,
          validationStatus: 'pending_review', // Structural checks do not establish technical correctness.
          lastVerifiedAt: null,
          explanationEn: q.explanationEn || null,
          explanationEs: q.explanationEs || null,
          correctAnswerExplanationEn: q.correctAnswerExplanationEn || null,
          correctAnswerExplanationEs: q.correctAnswerExplanationEs || null,
          primaryTopicId: topicId,
          sourceId: source.id,
          sourceLicense: q.sourceLicense || 'Original content',
          options: {
            create: q.options.map((opt, idx) => ({
              optionLabel: opt.optionLabel,
              optionTextEn: opt.optionTextEn,
              optionTextEs: opt.optionTextEs,
              isCorrect: opt.isCorrect,
              explanationEn: opt.explanationEn || null,
              explanationEs: opt.explanationEs || null,
              displayOrder: idx,
            })),
          },
        },
      });

      report.questionsImported++;
      console.log(`  ✅ Q${i}: Imported successfully`);
    } catch (err) {
      report.questionsRejected++;
      report.errors.push({
        index: i,
        statement: q.statementEn.substring(0, 80),
        reason: `Database error: ${err}`,
      });
      console.log(`  ❌ Q${i}: Database error - ${err}`);
    }
  }

  console.log(`  📊 Results: ${report.questionsImported} imported, ${report.questionsRejected} rejected, ${report.duplicatesDetected} duplicates`);

  return report;
}

async function main() {
  console.log('='.repeat(60));
  console.log(' CCNA Question Import Tool');
  console.log('='.repeat(60));

  const questionsDir = path.join(__dirname, 'questions');

  if (!fs.existsSync(questionsDir)) {
    console.log('No questions directory found. Nothing to import.');
    return;
  }

  const files = fs.readdirSync(questionsDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    console.log('No JSON files found in questions directory.');
    return;
  }

  console.log(`\nFound ${files.length} question file(s):`);
  files.forEach((f) => console.log(`  - ${f}`));

  const reports: BatchReport[] = [];

  for (const file of files) {
    const report = await importFile(path.join(questionsDir, file));
    reports.push(report);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(' IMPORT SUMMARY');
  console.log('='.repeat(60));

  let totalReceived = 0;
  let totalImported = 0;
  let totalRejected = 0;
  let totalDuplicates = 0;

  for (const r of reports) {
    totalReceived += r.questionsReceived;
    totalImported += r.questionsImported;
    totalRejected += r.questionsRejected;
    totalDuplicates += r.duplicatesDetected;
  }

  console.log(`\n  Total questions received:  ${totalReceived}`);
  console.log(`  Total questions imported:  ${totalImported}`);
  console.log(`  Total questions rejected:  ${totalRejected}`);
  console.log(`  Total duplicates skipped:  ${totalDuplicates}`);

  // Get final stats
  const stats = await prisma.question.groupBy({
    by: ['validationStatus'],
    _count: true,
  });
  const totalInDB = await prisma.question.count();

  console.log(`\n  Total questions in database: ${totalInDB}`);
  console.log(`  By validation status:`);
  for (const s of stats) {
    console.log(`    - ${s.validationStatus}: ${s._count}`);
  }

  // Coverage by area
  const areaCoverage = await prisma.question.groupBy({
    by: ['primaryTopicId'],
    _count: true,
  });

  const topics = await prisma.topic.findMany({
    where: { parentTopicId: null },
    select: { id: true, nameEn: true, examArea: true },
  });

  console.log(`\n  Coverage by exam area:`);
  const areaCounts: Record<string, number> = {};
  for (const ac of areaCoverage) {
    const topic = await prisma.topic.findUnique({
      where: { id: ac.primaryTopicId },
      select: { examArea: true },
    });
    if (topic) {
      areaCounts[topic.examArea] = (areaCounts[topic.examArea] || 0) + ac._count;
    }
  }
  for (const [area, count] of Object.entries(areaCounts).sort()) {
    console.log(`    - ${area}: ${count}`);
  }

  if (totalRejected > 0 || totalDuplicates > 0) {
    console.log(`\n  ⚠️  ${totalRejected + totalDuplicates} questions were not imported. Check the errors above.`);
  }

  console.log('\n' + '='.repeat(60));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  prisma.$disconnect();
  process.exit(1);
});
