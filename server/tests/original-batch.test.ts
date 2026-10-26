import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';

const file = resolve(__dirname, '../prisma/questions/original_20261024_50.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));

describe('Original 50-question batch', () => {
  it('has 50 separately identified concepts and the declared six-domain distribution', () => {
    expect(batch.questions).toHaveLength(50);
    for (const key of ['id', 'concept', 'questionFamilyId', 'statementEn', 'statementEs']) {
      expect(new Set(batch.questions.map((q: any) => q[key])).size).toBe(50);
    }
    const counts: Record<string, number> = {};
    for (const q of batch.questions) counts[q.primaryTopicExamArea] = (counts[q.primaryTopicExamArea] || 0) + 1;
    expect(counts).toEqual({ network_fundamentals: 10, network_access: 10, ip_connectivity: 12, ip_services: 5, security_fundamentals: 8, automation_programmability: 5 });
  });
  it.each(batch.questions)('$id has bilingual content, explanations, a reference and no unearned approval', q => {
    const item = questionImportItemSchema.parse(q);
    expect(validateQuestionAnswers(item, item.options).valid).toBe(true);
    for (const field of ['statementEn', 'statementEs', 'explanationEn', 'explanationEs', 'correctAnswerExplanationEn', 'correctAnswerExplanationEs']) expect(q[field].length).toBeGreaterThan(20);
    expect(q.sourceUrl).toMatch(/^https:\/\//);
    expect(q.sourceSection).toBeTruthy();
    expect(q.validationStatus).toBe('pending_review');
    expect(q.verification.humanReviewRequired).toBe(true);
    expect(['not_consulted_network_blocked', 'retrieved_pending_review', 'consulted']).toContain(q.verification.referenceAccess);
    if (q.verification.referenceAccess !== 'not_consulted_network_blocked') expect(q.verification.referenceSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(q.options.filter((o: any) => o.isCorrect)).toHaveLength(1);
    for (const key of ['optionTextEn', 'optionTextEs']) expect(new Set(q.options.map((o: any) => o[key])).size).toBe(4);
    expect(q.options.every((o: any) => o.explanationEn && o.explanationEs)).toBe(true);
  });
  it('independently recomputes 28 calculation/scenario answers with Python standard libraries', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-question-calculations.py'), file], { encoding: 'utf8' }));
    expect(report.received).toBe(50);
    expect(report.independentChecksPassed).toBe(28);
    expect(report.technicalApprovals).toBe(0);
  });
  it('rejects a structurally valid answer-key corruption using the independent checker', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-batch-corruption-'));
    try {
      const modified = JSON.parse(JSON.stringify(batch));
      const q = modified.questions[0];
      const correct = q.options.find((o: any) => o.isCorrect);
      const wrong = q.options.find((o: any) => !o.isCorrect);
      correct.isCorrect = false; wrong.isCorrect = true;
      expect(validateQuestionAnswers(q, q.options).valid).toBe(true);
      const path = join(directory, 'corrupted.json');
      writeFileSync(path, JSON.stringify(modified));
      expect(() => execFileSync('python3', [resolve(__dirname, '../../tools/check-question-calculations.py'), path], { stdio: 'pipe' })).toThrow();
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });

});
