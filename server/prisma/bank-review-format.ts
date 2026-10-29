import { createHash } from 'node:crypto';

export function canonical(value: any): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().filter(key => value[key] !== undefined).map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
export const digest = (value: any): string => createHash('sha256').update(canonical(value)).digest('hex');
export const normalized = (text: string): string => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export function contentRecord(q: any) {
  const fields = ['statementEn', 'statementEs', 'questionType', 'difficulty', 'multipleAnswerCount', 'questionFamilyId', 'explanationEn', 'explanationEs', 'correctAnswerExplanationEn', 'correctAnswerExplanationEs', 'sourceUrl', 'sourceLicense'];
  return {
    ...Object.fromEntries(fields.map(key => [key, q[key] ?? null])),
    estimatedTimeSeconds: q.estimatedTimeSeconds ?? 90, examVersion: q.examVersion ?? '200-301-v1.1',
    primaryTopicExamArea: q.primaryTopicExamArea ?? q.primaryTopic?.examArea,
    options: [...q.options].sort((a, b) => a.optionLabel.localeCompare(b.optionLabel)).map(o => ({ optionLabel: o.optionLabel, optionTextEn: o.optionTextEn, optionTextEs: o.optionTextEs, isCorrect: o.isCorrect, explanationEn: o.explanationEn ?? null, explanationEs: o.explanationEs ?? null })),
  };
}
