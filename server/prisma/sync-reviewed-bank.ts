import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
import { contentRecord, digest, normalized } from './bank-review-format';

export const REVIEW_SERVICE_ID = 'system-assisted-bank-review';
const REVIEW_EMAIL = 'assisted-bank-review@system.invalid';
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const recordSchema = z.object({
  file: z.string(), index: z.number().int().min(0), id: z.string().min(1), sourceSha256: hash, contentSha256: hash,
  decision: z.enum(['validated', 'pending_review', 'rejected']), reason: z.string().min(20),
  independentCheck: z.object({ kind: z.string(), result: z.unknown(), passed: z.literal(true) }).optional(),
  scenarioCheck: z.object({ kind: z.string(), result: z.unknown(), passed: z.literal(true) }).optional(),
  evidenceUrl: z.string().url().startsWith('https://').optional(),
  evidenceDocumentSha256: hash.optional(),
  evidenceSection: z.string().optional().nullable(),
  supersedesQuestionId: z.string().optional(),
  supersededByQuestionId: z.string().optional(),
  reviewRound: z.string().optional(),
  supportingPassage: z.object({ documentSha256: hash, normalizedOffset: z.number().int().min(0), normalizedLength: z.number().int().positive(), sha256: hash }).optional(),
  additionalEvidence: z.array(z.object({ url: z.string().url().startsWith('https://'), documentSha256: hash, section: z.string(), normalizedOffset: z.number().int().min(0), normalizedLength: z.number().int().positive(), sha256: hash })).optional(),
  checks: z.object({ answerAndDistractors: z.literal(true), bilingualConsistency: z.literal(true), explicitAssumptions: z.literal(true), authorship: z.string().min(10) }).optional(),
});
const manifestSchema = z.object({
  id: z.literal('assisted-review-20261029-v1'), reviewerType: z.literal('automated_assistant'), authorization: z.string().min(20),
  references: z.array(z.object({ url: z.string().url().startsWith('https://'), documentSha256: hash, excerpts: z.array(z.object({ anchor: z.string().min(1), excerpt: z.string().min(8), normalizedOffset: z.number().int().min(0) })).min(1) })),
  summary: z.object({ validated: z.number().int().min(0), pending_review: z.number().int().min(0), rejected: z.number().int().min(0).default(0) }), records: z.array(recordSchema),
});

export function readReviewedBank(directory = resolve(__dirname, 'questions'), manifestPath = resolve(__dirname, 'reviews/assisted-20261029.json')) {
  const manifest = manifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
  const byPosition = new Map(manifest.records.map(row => [`${row.file}:${row.index}`, row]));
  if (byPosition.size !== manifest.records.length) throw new Error('Duplicate review positions.');
  const ids = new Set<string>(), en = new Set<string>(), es = new Set<string>();
  const candidates: Array<{ q: any; row: z.infer<typeof recordSchema>; sourceId: string }> = [];
  for (const file of readdirSync(directory).filter(name => name.endsWith('.json')).sort()) {
    const batch = JSON.parse(readFileSync(resolve(directory, file), 'utf8'));
    const items = Array.isArray(batch) ? batch : batch.questions;
    if (!Array.isArray(items)) throw new Error(`${file}: missing question array.`);
    items.forEach((q: any, index: number) => {
      const row = byPosition.get(`${file}:${index}`);
      const expectedId = q.id || `ccna-legacy-${file.replace(/\.json$/, '')}-${String(index + 1).padStart(3, '0')}`;
      if (!row || row.id !== expectedId || digest(q) !== row.sourceSha256 || digest(contentRecord(q)) !== row.contentSha256) throw new Error(`${file}:${index}: reviewed content hash mismatch; approval refused.`);
      const parsed = questionImportItemSchema.parse(q);
      const checked = validateQuestionAnswers(parsed, parsed.options);
      if (!checked.valid) throw new Error(`${row.id}: ${checked.errors.join('; ')}`);
      if (!q.explanationEn?.trim() || !q.explanationEs?.trim()) throw new Error(`${row.id}: bilingual explanation missing.`);
      const ne = normalized(q.statementEn), ns = normalized(q.statementEs);
      if (ids.has(row.id) || en.has(ne) || es.has(ns)) throw new Error(`${row.id}: duplicate reviewed content.`);
      ids.add(row.id); en.add(ne); es.add(ns);
      if (row.decision === 'validated') {
        if (!row.checks || !row.independentCheck || !q.sourceLicense?.trim() || !manifest.references.some(ref => ref.url === row.evidenceUrl && (!row.evidenceDocumentSha256 || ref.documentSha256 === row.evidenceDocumentSha256))) throw new Error(`${row.id}: incomplete technical approval evidence.`);
        if (row.supportingPassage && row.supportingPassage.documentSha256 !== row.evidenceDocumentSha256) throw new Error(`${row.id}: inconsistent evidence document hash.`);
        if (row.additionalEvidence?.some(extra => !manifest.references.some(ref => ref.url === extra.url && ref.documentSha256 === extra.documentSha256))) throw new Error(`${row.id}: unbound supplemental evidence.`);
        if (row.supersedesQuestionId && (q.supersedesQuestionId !== row.supersedesQuestionId || row.supersedesQuestionId === row.id)) throw new Error(`${row.id}: invalid reviewed correction provenance.`);
        if (row.independentCheck.kind === 'documentary_independent_key') {
          const expected = row.independentCheck.result;
          const actual = q.options.filter((option: any) => option.isCorrect).map((option: any) => option.optionLabel).sort();
          if (!Array.isArray(expected) || expected.some(label => typeof label !== 'string') || JSON.stringify([...expected].sort()) !== JSON.stringify(actual)) throw new Error(`${row.id}: independent editorial key mismatch.`);
        }
      }
      candidates.push({ q, row, sourceId: 'source-' + (batch.batchId || file.replace(/\.json$/, '')) });
    });
  }
  if (candidates.length !== manifest.records.length || candidates.filter(item => item.row.decision === 'validated').length !== manifest.summary.validated || candidates.filter(item => item.row.decision === 'pending_review').length !== manifest.summary.pending_review || candidates.filter(item => item.row.decision === 'rejected').length !== manifest.summary.rejected) throw new Error('Review manifest summary or inventory mismatch.');
  const byId = new Map(candidates.map(item => [item.row.id, item]));
  for (const { q, row } of candidates.filter(item => item.row.decision === 'rejected')) {
    const replacement = row.supersededByQuestionId && byId.get(row.supersededByQuestionId);
    if (!replacement || replacement.row.decision !== 'validated' || replacement.row.supersedesQuestionId !== row.id || (q.questionFamilyId && q.questionFamilyId !== replacement.q.questionFamilyId)) throw new Error(`${row.id}: rejection requires an approved, linked correction in the same assigned family.`);
    if (!manifest.references.some(ref => ref.url === row.evidenceUrl && ref.documentSha256 === row.evidenceDocumentSha256)) throw new Error(`${row.id}: rejected correction lacks source evidence.`);
  }
  return { manifest, candidates };
}

/** Deliberately opt-in: reviewed allowlist, all-or-nothing import and no silent overwrite. */
export async function syncReviewedBank(db: PrismaClient, apply = false, directory?: string, manifestPath?: string) {
  const bank = readReviewedBank(directory, manifestPath);
  return db.$transaction(async tx => {
    const existing = await tx.question.findMany({ include: { options: true, primaryTopic: true } });
    const byId = new Map(existing.map(q => [q.id, q]));
    const en = new Map<string, typeof existing>(), es = new Map<string, typeof existing>();
    for (const q of existing) {
      const ne = normalized(q.statementEn), ns = normalized(q.statementEs);
      en.set(ne, [...en.get(ne) || [], q]); es.set(ns, [...es.get(ns) || [], q]);
    }
    const topics = await tx.topic.findMany({ where: { parentTopicId: null }, orderBy: { code: 'asc' } });
    const topicByArea = new Map(topics.map(topic => [topic.examArea, topic.id]));
    const plans = bank.candidates.map(item => {
      const matches = new Map([...en.get(normalized(item.q.statementEn)) || [], ...es.get(normalized(item.q.statementEs)) || [], ...(byId.has(item.row.id) ? [byId.get(item.row.id)!] : [])].map(q => [q.id, q]));
      if (matches.size > 1) throw new Error(`${item.row.id}: ambiguous existing duplicate; no changes applied.`);
      const current = [...matches.values()][0];
      if (current && digest(contentRecord(current)) !== item.row.contentSha256) throw new Error(`${item.row.id}: existing content differs; preserve it and create an explicit revision before applying.`);
      if (!topicByArea.has(item.q.primaryTopicExamArea)) throw new Error(`Missing root topic: ${item.q.primaryTopicExamArea}. Run the seed first.`);
      if (current && item.row.decision === 'validated' && current.validationStatus === 'rejected') throw new Error(`${current.id}: a previous rejection must be resolved explicitly.`);
      if (current && item.row.decision === 'rejected' && current.validationStatus === 'validated') throw new Error(`${current.id}: an existing approval cannot be withdrawn by this correction import.`);
      return { ...item, current, id: current?.id || item.row.id };
    });
    const summary = {
      mode: apply ? 'applied' : 'dry-run', manifestId: bank.manifest.id, candidates: plans.length,
      questionsToCreate: plans.filter(p => !p.current).length, existingMatched: plans.filter(p => p.current).length,
      reviewedApprovals: bank.manifest.summary.validated, remainingCandidatesPending: bank.manifest.summary.pending_review,
      appliedApprovals: 0, approvalsAlreadyPresent: 0,
      reviewedRejections: bank.manifest.summary.rejected, appliedRejections: 0, rejectionsAlreadyPresent: 0,
    };
    if (!apply) return summary;
    const service = await tx.user.findUnique({ where: { id: REVIEW_SERVICE_ID } });
    if (service && (service.role !== 'review_service' || service.email !== REVIEW_EMAIL)) throw new Error('Review service identity collision; no accounts changed.');
    if (!service) await tx.user.create({ data: { id: REVIEW_SERVICE_ID, email: REVIEW_EMAIL, username: 'assisted-bank-review', role: 'review_service', passwordHash: '!interactive-login-disabled!', language: 'es' } });
    for (const plan of plans) {
      const { q, row, id } = plan;
      if (!plan.current) {
        await tx.source.upsert({ where: { id: plan.sourceId }, update: {}, create: { id: plan.sourceId, name: q.sourceName || 'Original project practice', sourceType: 'original', license: q.sourceLicense || 'Original project content declared in repository', reuseConditions: 'Review decisions are in the versioned assisted manifest; not Cisco exam content.' } });
        await tx.question.create({ data: {
          id, statementEn: q.statementEn, statementEs: q.statementEs, questionType: q.questionType, difficulty: q.difficulty,
          questionFamilyId: q.questionFamilyId || null, multipleAnswerCount: q.multipleAnswerCount ?? null,
          estimatedTimeSeconds: q.estimatedTimeSeconds ?? 90, examVersion: q.examVersion || '200-301-v1.1',
          explanationEn: q.explanationEn, explanationEs: q.explanationEs, correctAnswerExplanationEn: q.correctAnswerExplanationEn, correctAnswerExplanationEs: q.correctAnswerExplanationEs,
          sourceUrl: q.sourceUrl, sourceLicense: q.sourceLicense, sourceId: plan.sourceId, primaryTopicId: topicByArea.get(q.primaryTopicExamArea)!,
          validationStatus: 'pending_review',
          options: { create: q.options.map((option: any, index: number) => ({ id: `${id}-option-${option.optionLabel}`, optionLabel: option.optionLabel, optionTextEn: option.optionTextEn, optionTextEs: option.optionTextEs, isCorrect: option.isCorrect, explanationEn: option.explanationEn, explanationEs: option.explanationEs, displayOrder: index })) },
        } });
      }
      if (row.decision === 'pending_review') continue;
      const reviewId = `${bank.manifest.id}:${id}`;
      const previous = await tx.questionReview.findUnique({ where: { id: reviewId } });
      if (plan.current?.validationStatus === row.decision) {
        if (row.decision === 'validated') summary.approvalsAlreadyPresent++;
        else summary.rejectionsAlreadyPresent++;
        continue;
      }
      if (previous) throw new Error(`${id}: status changed after review; refusing to restore an approval silently.`);
      const humanReview = await tx.questionReview.findFirst({ where: { questionId: id, reviewerId: { not: REVIEW_SERVICE_ID } } });
      if (humanReview) throw new Error(`${id}: an existing editorial decision requires explicit reconciliation.`);
      const reference = bank.manifest.references.find(ref => ref.url === row.evidenceUrl && (!row.evidenceDocumentSha256 || ref.documentSha256 === row.evidenceDocumentSha256))!;
      await tx.questionReview.create({ data: {
        id: reviewId, questionId: id, reviewerId: REVIEW_SERVICE_ID, status: row.decision, evidenceUrl: row.evidenceUrl,
        notes: `ASSISTED EVIDENCE REVIEW; not human certification. Decision=${row.decision}. ${row.reason} Manifest=${bank.manifest.id}; round=${row.reviewRound || 'initial'}; contentSHA256=${row.contentSha256}; sourceSHA256=${reference.documentSha256}; additionalEvidence=${JSON.stringify(row.additionalEvidence || [])}; independent=${JSON.stringify(row.independentCheck)}; scenario=${JSON.stringify(row.scenarioCheck)}; supersedes=${row.supersedesQuestionId || 'none'}; supersededBy=${row.supersededByQuestionId || 'none'}; ES/EN and distractors inspected. Authorized by the user; reviewed by an automated assistant.`,
      } });
      await tx.question.update({ where: { id }, data: { validationStatus: row.decision, lastVerifiedAt: new Date() } });
      if (row.decision === 'validated') summary.appliedApprovals++;
      else summary.appliedRejections++;
    }
    return summary;
  }, { timeout: 60000 });
}

if (require.main === module) {
  const db = new PrismaClient();
  syncReviewedBank(db, process.argv.includes('--apply')).then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
}
