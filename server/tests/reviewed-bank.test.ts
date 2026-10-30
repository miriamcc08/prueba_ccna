import { describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { readReviewedBank } from '../prisma/sync-reviewed-bank';
import { digest, contentRecord } from '../prisma/bank-review-format';

describe('Evidence-bound bank review decisions', () => {
  it('allows only the documented reviewed subset, not all structurally passing candidates', () => {
    const bank = readReviewedBank();
    expect(bank.candidates).toHaveLength(779);
    expect(bank.manifest.summary).toEqual({ validated: 520, pending_review: 140, rejected: 119 });
    expect(bank.candidates.filter(item => item.row.decision === 'validated' && item.row.file.startsWith('original_'))).toHaveLength(356);
    expect(bank.candidates.filter(item => item.row.decision === 'validated' && item.row.file.startsWith('batch'))).toHaveLength(45);
    for (const id of ['ccna-original-20261024-b03-026', 'ccna-original-20261026-b04-025']) expect(bank.candidates.find(item => item.row.id === id)?.row.decision).toBe('rejected');
    expect(bank.candidates.find(item => item.row.id === 'ccna-original-20261026-b04-012')?.row.decision).toBe('validated');
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
  it('uses corrected versions while preserving rejected originals and assigned families', () => {
    const bank = readReviewedBank();
    const revised = bank.candidates.filter(item => item.row.supersedesQuestionId);
    expect(revised).toHaveLength(119);
    for (const item of revised) {
      const original = bank.candidates.find(candidate => candidate.row.id === item.row.supersedesQuestionId)!;
      expect(original.row.decision).toBe('rejected');
      expect(original.row.supersededByQuestionId).toBe(item.row.id);
      expect(item.row.decision).toBe('validated');
      if (original.q.questionFamilyId) expect(item.q.questionFamilyId).toBe(original.q.questionFamilyId);
      else expect(item.q.questionFamilyId).toBeTruthy();
      expect(item.q.statementEn !== original.q.statementEn || item.q.explanationEn !== original.q.explanationEn).toBe(true);
      expect(item.q.statementEs !== original.q.statementEs || item.q.explanationEs !== original.q.explanationEs).toBe(true);
      expect(item.row.independentCheck?.kind).toBe('documentary_independent_key');
    }
    expect(bank.candidates.find(item => item.row.id === 'ccna-original-20261024-045')?.row.decision).toBe('validated');
    const corrections = JSON.stringify(revised.map(item => item.q));
    expect(corrections).not.toContain('No debe coincidir con el ID del vecino');
    expect(corrections).not.toContain('Los ID de proceso locales no deben coincidir');
    expect(corrections).not.toContain('Send one specific CLI keystroke every segundo');
  });
  it('resolves all third-batch candidates using scoped corrections rather than importing prior drafts verbatim', () => {
    const bank = readReviewedBank();
    const third = bank.candidates.filter(item => item.row.file === 'batch3_all.json');
    expect(third).toHaveLength(50);
    const pending = third.filter(item => item.row.decision === 'pending_review');
    expect(pending).toHaveLength(0);
    const drafts = JSON.parse(readFileSync(resolve(__dirname, '../../docs/propuestas-batch3-fuentes-20261029.json'), 'utf8'));
    expect(drafts.questions).toHaveLength(2);
    for (const draft of drafts.questions) {
      const replacement = bank.candidates.find(item => item.row.id === draft.id)!;
      expect(replacement.row.decision).toBe('validated');
      expect(digest(contentRecord(replacement.q))).not.toBe(digest(contentRecord(draft)));
    }
    const corrected = bank.candidates.filter(item => item.row.file === 'reviewed_batch3_corrections_20261029.json');
    expect(corrected).toHaveLength(37);
    expect(corrected.every(item => item.row.decision === 'validated')).toBe(true);
    const sae = corrected.find(item => item.row.id.endsWith('-045-review-r1'))!;
    expect(sae.q.explanationEn).toContain('four-way handshake is still used');
    const ipv6 = corrected.find(item => item.row.id.endsWith('-008-review-r1'))!;
    expect(ipv6.q.explanationEn).toContain('M=1 does not disable SLAAC');
    const restconf = corrected.find(item => item.row.id.endsWith('-048-review-r1'))!;
    expect(restconf.q.statementEn).not.toContain('verify=False');
    expect(restconf.q.statementEn).not.toContain('C1sco123!');
  });
  it('keeps fourth-batch documentary holds and sixth-batch proposals outside approval', () => {
    const bank = readReviewedBank();
    const fourth = bank.candidates.filter(item => item.row.file === 'batch4_all.json');
    expect(fourth.filter(item => item.row.decision === 'pending_review').map(item => item.row.index)).toEqual([43, 46]);
    const corrections = bank.candidates.filter(item => item.row.file === 'reviewed_batch4_corrections_20261030.json');
    expect(corrections).toHaveLength(41);
    expect(corrections.every(item => item.row.decision === 'validated')).toBe(true);
    const drafts = JSON.parse(readFileSync(resolve(__dirname, '../../docs/propuestas-cierre-heredadas-20261030.json'), 'utf8'));
    expect(drafts.questions).toHaveLength(41);
    for (const draft of drafts.questions) expect(bank.candidates.some(item => item.row.id === draft.id)).toBe(false);
    const certificate = corrections.find(item => item.row.id === 'ccna-legacy-batch4_all-020-review-r1')!;
    expect(certificate.q.statementEn).toContain('trusted time reference');
    expect(certificate.q.statementEs).toContain('referencia temporal confiable');
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
  it('rejects an editorial key or document hash that no longer agrees with its reviewed evidence', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-invalid-evidence-'));
    try {
      const manifest = JSON.parse(readFileSync(resolve(__dirname, '../prisma/reviews/assisted-20261029.json'), 'utf8'));
      const row = manifest.records.find((item: any) => item.supersedesQuestionId);
      const originalKey = row.independentCheck.result;
      row.independentCheck.result = ['not-the-reviewed-answer'];
      const path = join(directory, 'manifest.json');
      writeFileSync(path, JSON.stringify(manifest));
      expect(() => readReviewedBank(undefined, path)).toThrow('independent editorial key mismatch');
      row.independentCheck.result = originalKey;
      row.supportingPassage.documentSha256 = '0'.repeat(64);
      writeFileSync(path, JSON.stringify(manifest));
      expect(() => readReviewedBank(undefined, path)).toThrow('inconsistent evidence document hash');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
  it('finishes every question in the first legacy batch and resolves the five original source holds', () => {
    const bank = readReviewedBank();
    const first = bank.candidates.filter(item => item.row.file.startsWith('batch1_'));
    expect(first).toHaveLength(50);
    for (const item of first) {
      const usable = item.row.decision === 'validated' ? item : bank.candidates.find(candidate => candidate.row.id === item.row.supersededByQuestionId);
      expect(usable?.row.decision).toBe('validated');
    }
    for (const id of ['ccna-original-20261024-b02-042', 'ccna-original-20261024-b03-021', 'ccna-original-20261024-b03-039', 'ccna-original-20261024-b03-042', 'ccna-original-20261026-b04-012']) expect(bank.candidates.find(item => item.row.id === id)?.row.decision).toBe('validated');
    const mapped = bank.candidates.filter(item => item.q.reviewFamilyMapping);
    expect(mapped).toHaveLength(10);
    for (const item of mapped) expect(bank.candidates.some(other => other.row.id !== item.row.id && other.row.decision === 'validated' && other.q.questionFamilyId === item.q.questionFamilyId)).toBe(true);
  });
  it('refuses to reject an original without its approved linked replacement', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ccna-invalid-rejection-'));
    try {
      const manifest = JSON.parse(readFileSync(resolve(__dirname, '../prisma/reviews/assisted-20261029.json'), 'utf8'));
      manifest.records.find((row: any) => row.decision === 'rejected').supersededByQuestionId = 'missing-replacement';
      const path = join(directory, 'manifest.json');
      writeFileSync(path, JSON.stringify(manifest));
      expect(() => readReviewedBank(undefined, path)).toThrow('rejection requires an approved, linked correction');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
