import { describe, expect, it } from 'vitest';
import { captureQuestion, storedQuestion } from '../src/lib/examSnapshot';

const original = {
  id: 'question', statementEn: 'Choose the network address.', explanationEn: 'Clear the host bits.',
  primaryTopic: { id: 'topic', nameEn: 'IPv4' },
  options: [{ id: 'a', optionLabel: 'A', displayOrder: 0, isCorrect: true }, { id: 'b', optionLabel: 'B', displayOrder: 1, isCorrect: false }, { id: 'c', optionLabel: 'C', displayOrder: 2, isCorrect: false }],
};
describe('Saved question content', () => {
  it('permutes IDs and relabels the presentation without changing the answer identity', () => {
    const captured = captureQuestion(original, () => 0);
    const stored = storedQuestion({ question: original, contentSnapshot: captured });
    expect(stored.options.map(o => o.id)).toEqual(['b', 'c', 'a']);
    expect(stored.options.map(o => o.optionLabel)).toEqual(['A', 'B', 'C']);
    expect(stored.options.filter(o => o.isCorrect).map(o => o.id)).toEqual(['a']);
    expect(original.options.map(o => o.id)).toEqual(['a', 'b', 'c']);
  });
  it('does not reorder content that refers to a named option', () => {
    const question = { ...original, explanationEn: 'Option A identifies the network.' };
    const captured = captureQuestion(question, () => { throw new Error('Must not shuffle'); });
    expect(JSON.parse(captured).shuffleSkippedReason).toBe('label_references');
    expect(storedQuestion({ question, contentSnapshot: captured }).options.map(o => o.id)).toEqual(['a', 'b', 'c']);
  });
  it('detects corruption instead of silently using an edited live key', () => {
    const snapshot = JSON.parse(captureQuestion(original, () => 0));
    snapshot.question.options[0].isCorrect = true;
    expect(() => storedQuestion({ question: original, contentSnapshot: JSON.stringify(snapshot) })).toThrow('integrity check');
    expect(() => storedQuestion({ question: original, contentSnapshot: 'broken' })).toThrow('integrity check');
  });
  it('distinguishes older uncaptured attempts rather than fabricating snapshots', () => {
    expect(storedQuestion({ question: original, contentSnapshot: null })).toBe(original);
  });
});
