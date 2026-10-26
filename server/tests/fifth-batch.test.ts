import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { questionImportItemSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';
const file = resolve(__dirname, '../prisma/questions/original_20261026_b05_50.json');
const referencesFile = resolve(__dirname, '../../docs/batches/lote-05-referencias.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const references = JSON.parse(readFileSync(referencesFile, 'utf8'));
const calculations = resolve(__dirname, '../../tools/check-question-calculations.py');
const evidenceChecker = resolve(__dirname, '../../tools/check-question-evidence.py');
const runEvidence = (path = file, refs = referencesFile, extra: string[] = []) => JSON.parse(execFileSync('python3', [evidenceChecker, path, '--references', refs, ...extra], { encoding: 'utf8', stdio: 'pipe' }));

describe('Fifth original question batch and traceable validation', () => {
  it('has fifty bilingual scenarios, five multiple selections and explicit related families', () => {
    expect(batch.questions).toHaveLength(50);
    for (const field of ['id', 'concept', 'statementEn', 'statementEs']) expect(new Set(batch.questions.map((q: any) => q[field])).size).toBe(50);
    expect(new Set(batch.questions.map((q: any) => q.questionFamilyId)).size).toBe(49);
    expect(batch.questions.filter((q: any) => q.questionType === 'multiple_choice')).toHaveLength(5);
    const counts: Record<string, number> = {};
    for (const q of batch.questions) counts[q.primaryTopicExamArea] = (counts[q.primaryTopicExamArea] || 0) + 1;
    expect(counts).toEqual({ network_fundamentals: 10, network_access: 10, ip_connectivity: 12, ip_services: 5, security_fundamentals: 8, automation_programmability: 5 });
  });
  it.each(batch.questions)('$id has consistent keys and attributed evidence without claiming human approval', q => {
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
    expect(q.verification.documentaryReview).toMatchObject({ reviewerType: 'automated_assistant', humanApproval: 'pending' });
    expect(q.verification.referenceAccess).toBe('consulted');
    const reference = references.documents.find((d: any) => d.url === q.sourceUrl);
    expect(reference.status).toBe('retrieved');
    expect(reference.sha256).toBe(q.verification.referenceSha256);
    expect(references.focusedEvidence.find((e: any) => e.questionId === q.id).anchors.length).toBeGreaterThan(0);
  });
  it('independently recomputes all six executable cases', () => {
    const report = JSON.parse(execFileSync('python3', [calculations, file], { encoding: 'utf8' }));
    expect(report.independentChecksPassed).toBe(6);
    expect(report.technicalApprovals).toBe(0);
  });
  it('verifies every recorded review against current content without needing network or cache access', () => {
    expect(runEvidence()).toMatchObject({ reviewBindingsPassed: 50, cachedDocumentsVerified: 0, technicalApprovals: 0 });
    expect(references.questionsWithFocusedConsultation).toBe(50);
  });
  it('rejects an edited Spanish statement carrying its old review fingerprint', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-stale-evidence-'));
    try {
      const changed = structuredClone(batch);
      changed.questions[0].statementEs += ' Cambio editorial posterior.';
      const path = join(dir, 'changed.json'); writeFileSync(path, JSON.stringify(changed));
      expect(() => runEvidence(path)).toThrow(/content changed since documentary review/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it.each(['tcp_ack', 'link_utilization', 'ttl_remaining', 'longest_prefix', 'integer_range_labels', 'dns_wildcard'])('rejects a plausible but wrong %s key while preserving answer count', kind => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-key-validation-'));
    try {
      const changed = structuredClone(batch);
      const q = changed.questions.find((q: any) => q.verification.calculation?.kind === kind);
      const correct = q.options.find((o: any) => o.isCorrect);
      const incorrect = q.options.find((o: any) => !o.isCorrect);
      correct.isCorrect = false; incorrect.isCorrect = true;
      expect(validateQuestionAnswers(q, q.options).valid).toBe(true);
      const path = join(dir, 'changed.json'); writeFileSync(path, JSON.stringify(changed));
      expect(() => execFileSync('python3', [calculations, path], { stdio: 'pipe' })).toThrow();
      expect(() => runEvidence(path)).toThrow(/content changed since documentary review/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('detects modified retrieved bytes even when the passage text is retained', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-cache-validation-'));
    try {
      const q = structuredClone(batch.questions[0]);
      const body = q.verification.evidenceAnchors.join(' ');
      const digest = createHash('sha256').update(body).digest('hex');
      const cachePath = join(dir, 'reference.txt'); writeFileSync(cachePath, body);
      const entry = structuredClone(references.focusedEvidence[0]);
      entry.sha256 = digest; q.verification.referenceSha256 = digest;
      const b = { batchId: batch.batchId, questions: [q] };
      const r = { batchId: batch.batchId, documents: [{ url: q.sourceUrl, status: 'retrieved', sha256: digest, cachePath }], focusedEvidence: [entry] };
      const path = join(dir, 'batch.json'), refs = join(dir, 'refs.json');
      writeFileSync(path, JSON.stringify(b)); writeFileSync(refs, JSON.stringify(r));
      expect(runEvidence(path, refs, ['--check-cache']).cachedDocumentsVerified).toBe(1);
      writeFileSync(cachePath, body + ' Modified after retrieval.');
      expect(() => runEvidence(path, refs, ['--check-cache'])).toThrow(/cached document hash differs/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('does not treat words present only in HTML scripts as technical evidence', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna-script-evidence-'));
    try {
      const q = structuredClone(batch.questions[44]); // A Cisco HTML reference.
      const body = '<html><script>' + q.verification.evidenceAnchors.join(' ') + '</script><p>No supporting passage.</p></html>';
      const digest = createHash('sha256').update(body).digest('hex');
      const cachePath = join(dir, 'reference.html'); writeFileSync(cachePath, body);
      const entry = structuredClone(references.focusedEvidence[44]);
      entry.sha256 = digest; q.verification.referenceSha256 = digest;
      const path = join(dir, 'batch.json'), refs = join(dir, 'refs.json');
      writeFileSync(path, JSON.stringify({ batchId: batch.batchId, questions: [q] }));
      writeFileSync(refs, JSON.stringify({ batchId: batch.batchId, documents: [{ url: q.sourceUrl, status: 'retrieved', sha256: digest, cachePath }], focusedEvidence: [entry] }));
      expect(() => runEvidence(path, refs, ['--check-cache'])).toThrow(/supporting passage anchor not found/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
