import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
const file = resolve(__dirname, '../prisma/questions/original_20261024_b03_50.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const references = JSON.parse(readFileSync(resolve(__dirname, '../../docs/batches/lote-03-referencias.json'), 'utf8'));

describe('Third original question batch', () => {
  it('has fifty bilingual scenarios, ten multiple-answer questions and one true/false', () => {
    expect(batch.questions).toHaveLength(50);
    expect(new Set(batch.questions.map((q: any) => q.id)).size).toBe(50);
    expect(new Set(batch.questions.map((q: any) => q.concept)).size).toBe(50);
    expect(new Set(batch.questions.map((q: any) => q.questionFamilyId)).size).toBe(48);
    expect(batch.questions.filter((q: any) => q.questionType === 'multiple_choice')).toHaveLength(10);
    expect(batch.questions.filter((q: any) => q.questionType === 'true_false')).toHaveLength(1);
    const counts: Record<string, number> = {};
    for (const q of batch.questions) counts[q.primaryTopicExamArea] = (counts[q.primaryTopicExamArea] || 0) + 1;
    expect(counts).toEqual({ network_fundamentals: 10, network_access: 10, ip_connectivity: 12, ip_services: 5, security_fundamentals: 8, automation_programmability: 5 });
  });
  it.each(batch.questions)('$id has valid options, bilingual explanations and traceable reference metadata', q => {
    const parsed = questionImportItemSchema.parse(q);
    expect(validateQuestionAnswers(parsed, parsed.options).valid).toBe(true);
    for (const key of ['statementEn', 'statementEs', 'explanationEn', 'explanationEs']) expect(q[key].length).toBeGreaterThan(20);
    for (const key of ['optionTextEn', 'optionTextEs']) expect(new Set(q.options.map((o: any) => o[key])).size).toBe(q.options.length);
    expect(q.options.every((o: any) => o.explanationEn && o.explanationEs)).toBe(true);
    if (q.questionType === 'multiple_choice') {
      expect(q.options.filter((o: any) => o.isCorrect)).toHaveLength(q.multipleAnswerCount);
      expect(q.statementEn).toMatch(q.multipleAnswerCount === 3 ? /select three/i : /select two/i);
      expect(q.statementEs).toMatch(q.multipleAnswerCount === 3 ? /selecciona tres/i : /selecciona dos/i);
    }
    if (q.questionType === 'true_false') expect(q.options).toHaveLength(2);
    expect(q.validationStatus).toBe('pending_review');
    expect(q.verification.humanReviewRequired).toBe(true);
    const reference = references.documents.find((r: any) => r.url === q.sourceUrl);
    expect(reference.status).toBe('retrieved');
    expect(reference.sha256).toBe(q.verification.referenceSha256);
    if (q.verification.referenceAccess === 'consulted') {
      expect(q.verification.evidenceSection).toBeTruthy();
      expect(references.focusedEvidence.some((r: any) => r.questionId === q.id)).toBe(true);
    }
  });
  it('independently recomputes twenty-one numeric, address and policy cases', () => {
    const result = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-question-calculations.py'), file], { encoding: 'utf8' }));
    expect(result.received).toBe(50);
    expect(result.independentChecksPassed).toBe(21);
    expect(result.technicalApprovals).toBe(0);
    expect(references.questionsWithFocusedConsultation).toBe(11);
  });
  it('detects a service-ACL key that wrongly permits HTTPS while preserving selection count', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-third-batch-'));
    try {
      const corrupted = JSON.parse(JSON.stringify(batch));
      const q = corrupted.questions.find((q: any) => q.verification.calculation?.kind === 'service_acl');
      q.options.find((o: any) => o.optionTextEn === 'UDP query to destination port 53').isCorrect = false;
      q.options.find((o: any) => o.optionTextEn === 'TCP request to destination port 443').isCorrect = true;
      expect(validateQuestionAnswers(q, q.options).valid).toBe(true);
      const path = join(directory, 'corrupt.json'); writeFileSync(path, JSON.stringify(corrupted));
      expect(() => execFileSync('python3', [resolve(__dirname, '../../tools/check-question-calculations.py'), path], { stdio: 'pipe' })).toThrow();
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
