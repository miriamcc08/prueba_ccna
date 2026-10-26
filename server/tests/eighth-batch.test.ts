import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
const file = resolve(__dirname, '../prisma/questions/original_20261026_b08_10.json');
const refs = resolve(__dirname, '../../docs/batches/lote-08-referencias.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const checker = resolve(__dirname, '../../tools/check-question-evidence.py');
const calc = resolve(__dirname, '../../tools/check-question-calculations.py');

describe('Focused AIOps batch and direct platform evidence', () => {
  it('declares ten distinct scenarios, two multiple selections and focused area coverage', () => {
    expect(batch.questions).toHaveLength(10);
    for (const field of ['id', 'concept', 'questionFamilyId', 'statementEn', 'statementEs']) expect(new Set(batch.questions.map((q: any) => q[field])).size).toBe(10);
    expect(batch.questions.filter((q: any) => q.questionType === 'multiple_choice')).toHaveLength(2);
    expect(batch.questions.filter((q: any) => q.primaryTopicExamArea === 'automation_programmability')).toHaveLength(9);
    expect(batch.questions.filter((q: any) => q.primaryTopicExamArea === 'security_fundamentals')).toHaveLength(1);
  });
  it.each(batch.questions)('$id has valid proposed keys, bilingual content and attributed review', q => {
    const item = questionImportItemSchema.parse(q);
    expect(validateQuestionAnswers(item, item.options).valid).toBe(true);
    for (const field of ['statementEn', 'statementEs', 'explanationEn', 'explanationEs']) expect(q[field].length).toBeGreaterThan(20);
    if (q.questionType === 'multiple_choice') {
      expect(q.options.filter((o: any) => o.isCorrect)).toHaveLength(2);
      expect(q.statementEn).toMatch(/select two/i); expect(q.statementEs).toMatch(/selecciona dos/i);
    }
    expect(q.validationStatus).toBe('pending_review');
    expect(q.verification.documentaryReview.humanApproval).toBe('pending');
    expect(q.verification.referenceAccess).toBe('consulted');
  });
  it('checks full evidence for the focused ten without assuming a fifty-question batch', () => {
    const r = JSON.parse(execFileSync('python3', [checker, file, '--references', refs], { encoding: 'utf8' }));
    expect(r).toMatchObject({ received: 10, batchReceived: 10, questionsWithoutReview: 0, technicalApprovals: 0 });
  });
  it('independently verifies both explicit numeric models', () => {
    const r = JSON.parse(execFileSync('python3', [calc, file], { encoding: 'utf8' }));
    expect(r.independentChecksPassed).toBe(2);
  });
  it.each(['alert_precision', 'time_savings'])('rejects an incorrect %s answer while preserving selection count', kind => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-focused-model-'));
    try {
      const changed = structuredClone(batch);
      const q = changed.questions.find((q: any) => q.verification.calculation?.kind === kind);
      const correct = q.options.find((o: any) => o.isCorrect), wrong = q.options.find((o: any) => !o.isCorrect);
      correct.isCorrect = false; wrong.isCorrect = true;
      expect(validateQuestionAnswers(q, q.options).valid).toBe(true);
      const path = join(dir, 'changed.json'); writeFileSync(path, JSON.stringify(changed));
      expect(() => execFileSync('python3', [calc, path], { stdio: 'pipe' })).toThrow();
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('rejects a consulted chapter substituted after a review despite the retained general citation', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-chapter-evidence-'));
    try {
      const oldFile = resolve(__dirname, '../prisma/questions/original_20261024_50.json');
      const oldRefs = JSON.parse(readFileSync(resolve(__dirname, '../../docs/batches/lote-01-referencias.json'), 'utf8'));
      const entry = oldRefs.focusedEvidence.find((e: any) => e.documentUrl);
      entry.documentUrl = 'https://www.cisco.com/unrelated-chapter.html';
      const path = join(dir, 'refs.json'); writeFileSync(path, JSON.stringify(oldRefs));
      expect(() => execFileSync('python3', [checker, oldFile, '--references', path, '--reviewed-only'], { stdio: 'pipe' })).toThrow();
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
