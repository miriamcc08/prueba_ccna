import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';

const itemSchema = questionImportItemSchema.extend({
  id: z.string().regex(/^ccna-original-\d{8}(?:-b\d{2})?-\d{3}$/),
  questionFamilyId: z.string().min(1),
  concept: z.string().min(1),
  examVersion: z.literal('200-301-v1.1'),
  sourceUrl: z.string().url().refine(url => new URL(url).protocol === 'https:'),
  verification: z.object({ referenceAccess: z.enum(['not_consulted_network_blocked', 'retrieved_pending_review', 'consulted']), humanReviewRequired: z.literal(true) }).passthrough(),
});
const batchSchema = z.object({ batchId: z.string().regex(/^original-\d{8}(?:-b\d{2})?-(?:10|50)$/), questions: z.array(itemSchema).min(1) });
// Small focused batches and full batches must both declare their exact size.
const exactBatchSchema = batchSchema.superRefine((batch, context) => {
  const declaredSize = Number(batch.batchId.split('-').at(-1));
  if (batch.questions.length !== declaredSize) context.addIssue({ code: z.ZodIssueCode.custom, path: ['questions'], message: 'Question count does not match declared batch size' });
});
const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// Compare every imported content field so retries never silently overwrite editorial work.
function signature(item: any) {
  const fields = ['statementEn', 'statementEs', 'questionType', 'difficulty', 'multipleAnswerCount', 'estimatedTimeSeconds', 'questionFamilyId', 'examVersion', 'explanationEn', 'explanationEs', 'correctAnswerExplanationEn', 'correctAnswerExplanationEs', 'sourceUrl', 'sourceLicense'];
  const record = Object.fromEntries(fields.map(key => [key, item[key] ?? null]));
  return JSON.stringify({ ...record, options: [...item.options].sort((a, b) => a.optionLabel.localeCompare(b.optionLabel)).map(option => ({
    optionLabel: option.optionLabel, optionTextEn: option.optionTextEn, optionTextEs: option.optionTextEs,
    isCorrect: option.isCorrect, explanationEn: option.explanationEn ?? null, explanationEs: option.explanationEs ?? null,
  })) });
}

export async function loadOriginalBatch(file: string, db: PrismaClient) {
  const batch = exactBatchSchema.parse(JSON.parse(readFileSync(file, 'utf8')));
  for (const field of ['id', 'concept', 'statementEn', 'statementEs'] as const) {
    if (new Set(batch.questions.map(q => normalize(q[field]))).size !== batch.questions.length) throw new Error(`Duplicate ${field} in batch`);
  }
  const idPrefix = 'ccna-' + batch.batchId.replace(/-(?:10|50)$/, '') + '-';
  for (const q of batch.questions) {
    if (!q.id.startsWith(idPrefix)) throw new Error(`${q.id}: ID does not belong to ${batch.batchId}`);
    if (q.verification.referenceAccess === 'consulted' && (!q.verification.referenceSha256 || !q.verification.consultedAt || !q.verification.evidenceSection)) throw new Error(`${q.id}: incomplete consultation evidence`);
    const check = validateQuestionAnswers(q, q.options);
    if (!check.valid) throw new Error(`${q.id}: ${check.errors.join('; ')}`);
    if (!q.explanationEn?.trim() || !q.explanationEs?.trim()) throw new Error(`${q.id}: missing bilingual explanation`);
  }
  return db.$transaction(async tx => {
    const source = await tx.source.upsert({
      where: { id: 'source-' + batch.batchId }, update: {},
      create: {
        id: 'source-' + batch.batchId, name: 'Original CCNA practice — ' + batch.batchId, sourceType: 'original',
        license: 'Original project question wording; cited technical references are not reproduced.',
        reuseConditions: 'Original material created for this project; consult the batch reference evidence before technical approval.',
        validationNotes: 'Questions require technical and translation review. Reference consultation and executable checks do not imply human approval.',
      },
    });
    let created = 0, unchanged = 0;
    for (const q of batch.questions) {
      const existing = await tx.question.findUnique({ where: { id: q.id }, include: { options: true } });
      if (existing) {
        if (signature(existing) !== signature(q)) throw new Error(`${q.id}: existing content differs; refusing to overwrite it`);
        unchanged++;
        continue;
      }
      const duplicate = await tx.question.findFirst({ where: { OR: [{ statementEn: q.statementEn }, { statementEs: q.statementEs }] }, select: { id: true } });
      if (duplicate) throw new Error(`${q.id}: identical statement already exists as ${duplicate.id}`);
      const topic = await tx.topic.findFirst({ where: { examArea: q.primaryTopicExamArea, parentTopicId: null }, orderBy: { code: 'asc' } });
      if (!topic) throw new Error(`No root topic found for ${q.primaryTopicExamArea}`);
      const { id, questionFamilyId, examVersion, statementEn, statementEs, questionType, difficulty, multipleAnswerCount, estimatedTimeSeconds, explanationEn, explanationEs, correctAnswerExplanationEn, correctAnswerExplanationEs, sourceUrl, sourceLicense } = q;
      await tx.question.create({ data: {
        id, questionFamilyId, examVersion, statementEn, statementEs, questionType, difficulty, multipleAnswerCount, estimatedTimeSeconds,
        explanationEn, explanationEs, correctAnswerExplanationEn, correctAnswerExplanationEs, sourceUrl, sourceLicense,
        sourceId: source.id, primaryTopicId: topic.id, validationStatus: 'pending_review', lastVerifiedAt: null,
        options: { create: q.options.map((option, index) => ({ ...option, id: `${id}-option-${option.optionLabel}`, displayOrder: index })) },
      } });
      created++;
    }
    return { batchId: batch.batchId, received: batch.questions.length, created, unchanged, automaticallyApproved: 0 };
  }, { timeout: 15000 });
}

if (require.main === module) {
  const db = new PrismaClient();
  const arg = process.argv.indexOf('--file');
  const directory = resolve(__dirname, 'questions');
  const files = process.argv.includes('--all')
    ? readdirSync(directory).filter(name => /^original_.*_(?:10|50)\.json$/.test(name)).sort().map(name => resolve(directory, name))
    : [arg >= 0 ? resolve(process.argv[arg + 1] || '') : resolve(directory, 'original_20261024_50.json')];
  (async () => {
    for (const file of files) console.log(JSON.stringify(await loadOriginalBatch(file, db)));
  })().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
}
