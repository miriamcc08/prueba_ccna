import { describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { readReviewedBank } from '../prisma/sync-reviewed-bank';
import { digest, contentRecord } from '../prisma/bank-review-format';

describe('Evidence-bound bank review decisions', () => {
  it('allows only the documented reviewed subset, not all structurally passing candidates', () => {
    const bank = readReviewedBank();
    expect(bank.candidates).toHaveLength(660);
    expect(bank.manifest.summary).toEqual({ validated: 131, pending_review: 529 });
    expect(bank.candidates.filter(item => item.row.decision === 'validated' && item.row.file.startsWith('original_'))).toHaveLength(120);
    expect(bank.candidates.filter(item => item.row.decision === 'validated' && !item.row.file.startsWith('original_'))).toHaveLength(11);
    for (const id of ['ccna-original-20261024-b03-026', 'ccna-original-20261026-b04-012', 'ccna-original-20261024-045']) expect(bank.candidates.find(item => item.row.id === id)?.row.decision).toBe('pending_review');
    for (const item of bank.candidates) expect(digest(contentRecord(item.q))).toBe(item.row.contentSha256);
  });
  it('keeps short attributed passages and records assisted rather than fabricated human approval', () => {
    const { manifest } = readReviewedBank();
    expect(manifest.reviewerType).toBe('automated_assistant');
    for (const reference of manifest.references) {
      expect(reference.documentSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(reference.excerpts.flatMap(item => item.excerpt.split(/\s+/)).length).toBeLessThanOrEqual(90);
    }
    for (const row of manifest.records.filter(item => item.decision === 'validated')) {
      expect(row.independentCheck?.passed).toBe(true);
      expect(row.checks?.bilingualConsistency).toBe(true);
      expect(manifest.references.some(reference => reference.url === row.evidenceUrl)).toBe(true);
    }
  });
  it('rejects a key changed after review even when the source still has one correct answer', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-stale-review-'));
    try {
      const file = 'original_20261024_50.json';
      const payload = JSON.parse(readFileSync(resolve(__dirname, '../prisma/questions', file), 'utf8'));
      const q = payload.questions[0];
      const right = q.options.find((option: any) => option.isCorrect), wrong = q.options.find((option: any) => !option.isCorrect);
      right.isCorrect = false; wrong.isCorrect = true;
      writeFileSync(join(directory, file), JSON.stringify(payload));
      expect(() => readReviewedBank(directory)).toThrow('hash mismatch');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
