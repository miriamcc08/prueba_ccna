import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
const file = resolve(__dirname, '../prisma/questions/original_20261024_b02_50.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const references = JSON.parse(readFileSync(resolve(__dirname, '../../docs/batches/lote-02-referencias.json'), 'utf8'));

describe('Second original question batch', () => {
  it('contains 50 records with 10 multiple-answer exercises and explicit related families', () => {
    expect(batch.questions).toHaveLength(50);
    expect(new Set(batch.questions.map((q: any) => q.id)).size).toBe(50);
    expect(new Set(batch.questions.map((q: any) => q.concept)).size).toBe(50);
    expect(new Set(batch.questions.map((q: any) => q.questionFamilyId)).size).toBe(49);
    expect(batch.questions.filter((q: any) => q.questionType === 'multiple_choice')).toHaveLength(10);
    expect(batch.questions.filter((q: any) => q.primaryTopicExamArea === 'ip_connectivity')).toHaveLength(13);
  });
  it.each(batch.questions)('$id has consistent answer counts, bilingual explanations and explicit review state', q => {
    const parsed = questionImportItemSchema.parse(q);
    expect(validateQuestionAnswers(parsed, parsed.options).valid).toBe(true);
    for (const field of ['statementEn', 'statementEs', 'explanationEn', 'explanationEs']) expect(q[field].length).toBeGreaterThan(20);
    for (const field of ['optionTextEn', 'optionTextEs']) expect(new Set(q.options.map((o: any) => o[field])).size).toBe(q.options.length);
    expect(q.options.every((o: any) => o.explanationEn && o.explanationEs)).toBe(true);
    if (q.questionType === 'multiple_choice') {
      expect(q.options.filter((o: any) => o.isCorrect)).toHaveLength(q.multipleAnswerCount);
      expect(q.statementEn).toMatch(q.multipleAnswerCount === 3 ? /select three/i : /select two/i);
      expect(q.statementEs).toMatch(q.multipleAnswerCount === 3 ? /selecciona tres/i : /selecciona dos/i);
    }
    expect(q.validationStatus).toBe('pending_review');
    expect(q.verification.humanReviewRequired).toBe(true);
    const document = references.documents.find((d: any) => d.url === q.sourceUrl);
    expect(document.status).toBe('retrieved');
    expect(document.sha256).toBe(q.verification.referenceSha256);
    if (q.verification.referenceAccess === 'consulted') {
      expect(q.verification.evidenceSection).toBeTruthy();
      expect(Number.isNaN(Date.parse(q.verification.consultedAt))).toBe(false);
      expect(references.focusedEvidence.some((r: any) => r.questionId === q.id)).toBe(true);
    }
  });
  it('recomputes 13 single- and multiple-answer cases independently', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-question-calculations.py'), file], { encoding: 'utf8' }));
    expect(report.independentChecksPassed).toBe(13);
    expect(report.technicalApprovals).toBe(0);
    expect(references.questionsWithFocusedConsultation).toBe(24);
  });
  it('rejects an incorrect multiple-answer key even when its answer count remains valid', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-second-batch-'));
    try {
      const corrupted = JSON.parse(JSON.stringify(batch));
      const question = corrupted.questions.find((q: any) => q.multipleAnswerCount && q.verification.calculation);
      question.options.find((o: any) => o.isCorrect).isCorrect = false;
      const selected = question.options.filter((o: any) => o.isCorrect);
      const wrong = question.options.find((o: any) => !o.isCorrect && !selected.includes(o) && !['224.1.2.3', '239.129.2.3'].includes(o.optionTextEn));
      wrong.isCorrect = true;
      expect(validateQuestionAnswers(question, question.options).valid).toBe(true);
      const path = join(directory, 'corrupt.json'); writeFileSync(path, JSON.stringify(corrupted));
      expect(() => execFileSync('python3', [resolve(__dirname, '../../tools/check-question-calculations.py'), path], { stdio: 'pipe' })).toThrow();
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
