import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
import { readReviewedBank } from './sync-reviewed-bank';

// Structural checks are deliberately separate from technical approval.
const directory = join(__dirname, 'questions');
let editorialReview: { integrity: string; summary?: { validated: number; pending_review: number; rejected: number }; error?: string };
const decisions = new Map<string, ReturnType<typeof readReviewedBank>['candidates'][number]['row']>();
try {
  const reviewed = readReviewedBank(directory);
  editorialReview = { integrity: 'verified', summary: reviewed.manifest.summary };
  for (const { row } of reviewed.candidates) decisions.set(`${row.file}:${row.index}`, row);
} catch (error) {
  editorialReview = { integrity: 'unavailable_or_stale', error: error instanceof Error ? error.message : 'Review integrity check failed.' };
}
const seenEn = new Set<string>();
const seenEs = new Set<string>();
const normalize = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const records: Array<{ file: string; index: number; area: string; status: string; family: string; issues: string[]; reviewDecision?: string; reviewEvidenceUrl?: string }> = [];
const singleAnswerLabels: Record<string, number> = {};
let labelDependentQuestions = 0;
for (const file of readdirSync(directory).filter(name => name.endsWith('.json')).sort()) {
  const payload = JSON.parse(readFileSync(join(directory, file), 'utf8'));
  const questions = Array.isArray(payload) ? payload : payload.questions;
  if (!Array.isArray(questions)) throw new Error(`Invalid batch structure: ${file}`);
  questions.forEach((input, index) => {
    const reviewed = decisions.get(`${file}:${index}`);
    const parsed = questionImportItemSchema.safeParse(input);
    const issues: string[] = [];
    let status = 'pending_review';
    if (!parsed.success) {
      status = 'rejected';
      issues.push(...parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`));
    } else {
      const item = parsed.data;
      const check = validateQuestionAnswers(item, item.options);
      if (!check.valid) { status = 'rejected'; issues.push(...check.errors); }
      const en = normalize(item.statementEn), es = normalize(item.statementEs);
      if (seenEn.has(en) || seenEs.has(es)) { status = 'duplicate'; issues.push('Exact normalized statement duplicate in English or Spanish.'); }
      seenEn.add(en); seenEs.add(es);
      if (!item.explanationEn?.trim() || !item.explanationEs?.trim()) issues.push('Bilingual explanation missing.');
      if ((!item.sourceUrl || !/^https:\/\//.test(item.sourceUrl)) && !reviewed?.evidenceUrl) issues.push('HTTPS technical reference missing.');
      if (!reviewed || reviewed.decision === 'pending_review') issues.push('Technical correctness, distractors, translation and source reuse require documented review.');
    }
    const correctLabels = input.options?.filter((o: any) => o.isCorrect).map((o: any) => o.optionLabel) || [];
    if (correctLabels.length === 1) singleAnswerLabels[correctLabels[0]] = (singleAnswerLabels[correctLabels[0]] || 0) + 1;
    if (/\b(?:option|choice|answer|opci[oó]n|respuesta)\s+[A-F]\b/i.test(JSON.stringify(input))) labelDependentQuestions++;
    records.push({ file, index, family: input.questionFamilyId || `ungrouped:${file}:${index}`, area: input.primaryTopicExamArea || 'unknown', status, issues, reviewDecision: reviewed?.decision, reviewEvidenceUrl: reviewed?.evidenceUrl });
  });
}
const batches = [];
for (let offset = 0; offset < records.length; offset += 50) {
  const batch = records.slice(offset, offset + 50);
  batches.push({
    batch: batches.length + 1, received: batch.length, approved: 0,
    rejected: batch.filter(r => r.status === 'rejected').length,
    duplicates: batch.filter(r => r.status === 'duplicate').length,
    pending: batch.filter(r => r.status === 'pending_review').length,
    coverage: Object.fromEntries([...new Set(batch.map(r => r.area))].map(area => [area, batch.filter(r => r.area === area).length])),
    records: batch,
  });
}
const families = new Map<string, typeof records>();
for (const record of records) families.set(record.family, [...(families.get(record.family) || []), record]);
const equivalentFamilies = [...families].filter(([, members]) => members.length > 1).map(([family, members]) => ({ family, records: members.map(({ file, index }) => ({ file, index })) }));
const singleAnswerTotal = Object.values(singleAnswerLabels).reduce((a, b) => a + b, 0);
const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Candidate JSON files only. No database rows were modified. This is not technical certification.',
  editorialReview,
  received: records.length, approved: 0,
  rejected: records.filter(r => r.status === 'rejected').length,
  duplicates: records.filter(r => r.status === 'duplicate').length,
  pending: records.filter(r => r.status === 'pending_review').length,
  distinctDeclaredFamilies: families.size,
  equivalentFamilies,
  singleAnswerLabelDistribution: singleAnswerLabels,
  labelDependentQuestions,
  warnings: singleAnswerTotal && Math.max(...Object.values(singleAnswerLabels)) / singleAnswerTotal > 0.75 ? ['The answer key is heavily concentrated in one label. New exam attempts shuffle eligible options and persist their presentation; label-dependent prose needs editorial review.'] : [],
  uniqueNormalizedEnglishStatements: seenEn.size,
  batches,
};
const output = process.argv.indexOf('--output');
if (output >= 0) {
  if (!process.argv[output + 1]) throw new Error('--output requires a path');
  writeFileSync(resolve(process.argv[output + 1]), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ received: report.received, approved: 0, rejected: report.rejected, duplicates: report.duplicates, pending: report.pending, batches: batches.length, editorialReview }));
} else console.log(JSON.stringify(report, null, 2));
