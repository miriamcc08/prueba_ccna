import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
const file = resolve(__dirname, '../prisma/questions/original_20261026_b04_50.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const references = JSON.parse(readFileSync(resolve(__dirname, '../../docs/batches/lote-04-referencias.json'), 'utf8'));
const checker = resolve(__dirname, '../../tools/check-question-calculations.py');

describe('Fourth original question batch', () => {
  it('covers all six areas with fifty scenarios, four multiple selections and declared related families', () => {
    expect(batch.questions).toHaveLength(50);
    for (const field of ['id', 'concept', 'statementEn', 'statementEs']) {
      expect(new Set(batch.questions.map((q: any) => q[field])).size).toBe(50);
    }
    expect(new Set(batch.questions.map((q: any) => q.questionFamilyId)).size).toBe(49);
    expect(batch.questions.filter((q: any) => q.questionType === 'multiple_choice')).toHaveLength(4);
    const counts: Record<string, number> = {};
    for (const q of batch.questions) counts[q.primaryTopicExamArea] = (counts[q.primaryTopicExamArea] || 0) + 1;
    expect(counts).toEqual({ network_fundamentals: 10, network_access: 10, ip_connectivity: 12, ip_services: 5, security_fundamentals: 8, automation_programmability: 5 });
  });
  it.each(batch.questions)('$id has bilingual content, valid proposed keys and honest source provenance', q => {
    const parsed = questionImportItemSchema.parse(q);
    expect(validateQuestionAnswers(parsed, parsed.options).valid).toBe(true);
    for (const field of ['statementEn', 'statementEs', 'explanationEn', 'explanationEs']) expect(q[field].length).toBeGreaterThan(20);
    for (const field of ['optionTextEn', 'optionTextEs']) expect(new Set(q.options.map((o: any) => o[field])).size).toBe(q.options.length);
    expect(q.options.every((o: any) => o.explanationEn && o.explanationEs)).toBe(true);
    if (q.questionType === 'multiple_choice') {
      expect(q.options.filter((o: any) => o.isCorrect)).toHaveLength(q.multipleAnswerCount);
      expect(q.statementEn).toMatch(/select two/i);
      expect(q.statementEs).toMatch(/selecciona dos/i);
    }
    expect(q.validationStatus).toBe('pending_review');
    expect(q.verification.humanReviewRequired).toBe(true);
    const reference = references.documents.find((d: any) => d.url === q.sourceUrl);
    expect(reference.status).toBe('retrieved');
    expect(reference.sha256).toBe(q.verification.referenceSha256);
    if (q.verification.referenceAccess === 'consulted') {
      const evidence = references.focusedEvidence.find((e: any) => e.questionId === q.id);
      expect(evidence.sha256).toBe(reference.sha256);
      expect(evidence.anchor).toBe(q.verification.evidenceAnchor);
      expect(q.verification.consultedAt).toBeTruthy();
    }
    if (q.verification.referenceCoverage === 'partial') expect(q.verification.referenceCoverageNotes.length).toBeGreaterThan(20);
  });
  it('independently recomputes nine allocation, switching, routing and data cases', () => {
    const result = JSON.parse(execFileSync('python3', [checker, file], { encoding: 'utf8' }));
    expect(result.independentChecksPassed).toBe(9);
    expect(result.technicalApprovals).toBe(0);
    expect(references.questionsWithFocusedConsultation).toBe(14);
  });
  it.each(['graph_shortest_path', 'vlsm_allocate', 'switch_flood'])('rejects an incorrect %s answer while its selection count remains valid', kind => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-fourth-batch-'));
    try {
      const corrupted = JSON.parse(JSON.stringify(batch));
      const q = corrupted.questions.find((q: any) => q.verification.calculation?.kind === kind);
      const correct = q.options.find((o: any) => o.isCorrect);
      const incorrect = q.options.find((o: any) => !o.isCorrect && (kind !== 'switch_flood' || o.optionTextEn === 'P4'));
      correct.isCorrect = false;
      incorrect.isCorrect = true;
      expect(validateQuestionAnswers(q, q.options).valid).toBe(true);
      const path = join(directory, 'corrupt.json'); writeFileSync(path, JSON.stringify(corrupted));
      expect(() => execFileSync('python3', [checker, path], { stdio: 'pipe' })).toThrow();
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
