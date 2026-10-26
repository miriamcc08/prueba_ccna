import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
const file = resolve(__dirname, '../prisma/questions/original_20261026_b06_50.json');
const referencesFile = resolve(__dirname, '../../docs/batches/lote-06-referencias.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const references = JSON.parse(readFileSync(referencesFile, 'utf8'));
const calculations = resolve(__dirname, '../../tools/check-question-calculations.py');
const evidenceChecker = resolve(__dirname, '../../tools/check-question-evidence.py');
const evidence = (path = file) => JSON.parse(execFileSync('python3', [evidenceChecker, path, '--references', referencesFile], { encoding: 'utf8', stdio: 'pipe' }));
const calculated = batch.questions.filter((q: any) => q.verification.calculation);

describe('Sixth original batch: physical links and operational diagnostics', () => {
  it('has fifty bilingual scenarios with the declared area distribution and related families', () => {
    expect(batch.questions).toHaveLength(50);
    for (const field of ['id', 'concept', 'statementEn', 'statementEs']) expect(new Set(batch.questions.map((q: any) => q[field])).size).toBe(50);
    expect(batch.questions.filter((q: any) => q.questionType === 'multiple_choice')).toHaveLength(6);
    expect(new Set(batch.questions.map((q: any) => q.questionFamilyId)).size).toBe(49);
    const counts: Record<string, number> = {};
    for (const q of batch.questions) counts[q.primaryTopicExamArea] = (counts[q.primaryTopicExamArea] || 0) + 1;
    expect(counts).toEqual({ network_fundamentals: 10, network_access: 10, ip_connectivity: 12, ip_services: 5, security_fundamentals: 8, automation_programmability: 5 });
  });
  it.each(batch.questions)('$id has valid proposed answers and attributable documentary review', q => {
    const parsed = questionImportItemSchema.parse(q);
    expect(validateQuestionAnswers(parsed, parsed.options).valid).toBe(true);
    for (const field of ['statementEn', 'statementEs', 'explanationEn', 'explanationEs']) expect(q[field].length).toBeGreaterThan(20);
    for (const field of ['optionTextEn', 'optionTextEs']) expect(new Set(q.options.map((o: any) => o[field])).size).toBe(q.options.length);
    expect(q.options.every((o: any) => o.explanationEn && o.explanationEs)).toBe(true);
    if (q.questionType === 'multiple_choice') {
      expect(q.options.filter((o: any) => o.isCorrect)).toHaveLength(2);
      expect(q.statementEn).toMatch(/select two/i);
      expect(q.statementEs).toMatch(/selecciona dos/i);
    }
    expect(q.validationStatus).toBe('pending_review');
    expect(q.verification.humanReviewRequired).toBe(true);
    expect(q.verification.documentaryReview).toMatchObject({ reviewerType: 'automated_assistant', humanApproval: 'pending' });
    const doc = references.documents.find((d: any) => d.url === q.sourceUrl);
    expect(doc.status).toBe('retrieved');
    expect(doc.sha256).toBe(q.verification.referenceSha256);
    expect(references.focusedEvidence.some((e: any) => e.questionId === q.id)).toBe(true);
  });
  it('recomputes twelve independent cases without awarding technical approval', () => {
    const report = JSON.parse(execFileSync('python3', [calculations, file], { encoding: 'utf8' }));
    expect(report.independentChecksPassed).toBe(12);
    expect(report.technicalApprovals).toBe(0);
    expect(calculated).toHaveLength(12);
  });
  it('binds all fifty recorded reviews to their current question content', () => {
    expect(evidence()).toMatchObject({ reviewBindingsPassed: 50, cachedDocumentsVerified: 0, technicalApprovals: 0 });
    expect(references.questionsWithFocusedConsultation).toBe(50);
  });
  it.each(calculated)('$concept rejects a changed answer key with the same cardinality', original => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-sixth-key-'));
    try {
      const changed = structuredClone(batch);
      const q = changed.questions.find((q: any) => q.id === original.id);
      const correct = q.options.find((o: any) => o.isCorrect);
      const incorrect = q.options.find((o: any) => !o.isCorrect);
      correct.isCorrect = false; incorrect.isCorrect = true;
      expect(validateQuestionAnswers(q, q.options).valid).toBe(true);
      const path = join(dir, 'changed.json'); writeFileSync(path, JSON.stringify(changed));
      expect(() => execFileSync('python3', [calculations, path], { stdio: 'pipe' })).toThrow();
      expect(() => evidence(path)).toThrow(/content changed since documentary review/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
