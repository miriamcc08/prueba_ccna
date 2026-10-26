import { describe, expect, it } from 'vitest';
import { parseQuestionCsv, QUESTION_CSV_HEADERS, QUESTION_CSV_TEMPLATE } from '../../shared/questionCsv';
import { questionImportItemSchema } from '../src/validators/schemas';

const fixture: Record<string, string> = {
  statementEn: 'CSV fixture: which address uses 32 bits?', statementEs: 'Prueba CSV: ¿qué dirección utiliza 32 bits?',
  questionType: 'single_choice', difficulty: 'basic', primaryTopicExamArea: 'network_fundamentals',
  explanationEn: 'IPv4 addresses contain 32 bits.', explanationEs: 'Las direcciones IPv4 contienen 32 bits.',
  correctAnswers: 'A', optionAEn: 'IPv4', optionAEs: 'IPv4', optionBEn: 'IPv6', optionBEs: 'IPv6',
  sourceUrl: 'https://www.rfc-editor.org/rfc/rfc791', sourceLicense: 'Original test fixture', estimatedTimeSeconds: '90',
};
function csv(changes: Record<string, string> = {}, headers = QUESTION_CSV_HEADERS) {
  const record = { ...fixture, ...changes };
  return headers.join(',') + '\r\n' + headers.map(key => '"' + (record[key] || '').replace(/"/g, '""') + '"').join(',') + '\r\n';
}
describe('CSV candidate import adapter', () => {
  it('converts bilingual spreadsheet fields into a valid existing API item', () => {
    const parsed = parseQuestionCsv('\uFEFF' + csv());
    expect(parsed).toHaveLength(1);
    expect(questionImportItemSchema.parse(parsed[0])).toMatchObject({
      statementEs: fixture.statementEs, estimatedTimeSeconds: 90, sourceLicense: fixture.sourceLicense,
      options: [{ optionLabel: 'A', isCorrect: true }, { optionLabel: 'B', isCorrect: false }],
    });
    expect(parsed[0]).not.toHaveProperty('validationStatus');
  });
  it('preserves commas, quotes, Unicode and multiline explanations', () => {
    const explanationEn = 'First line, with "quotes"\nSecond line';
    expect(parseQuestionCsv(csv({ explanationEn }))[0].explanationEn).toBe(explanationEn);
  });
  it('derives the required selection count from multiple-choice keys', () => {
    const item = parseQuestionCsv(csv({ questionType: 'multiple_choice', correctAnswers: 'a | b' }))[0];
    expect(item.multipleAnswerCount).toBe(2);
    expect(item.options.every(option => option.isCorrect)).toBe(true);
  });
  it('allows reordered headers and optional columns to be omitted', () => {
    const headers = QUESTION_CSV_HEADERS.slice(0, 12).reverse();
    expect(parseQuestionCsv(csv({}, headers))[0].statementEn).toBe(fixture.statementEn);
  });
  it.each([
    [{ correctAnswers: 'A|A' }, 'unique'],
    [{ correctAnswers: 'Z' }, 'unique'],
    [{ correctAnswers: 'C' }, 'missing option'],
    [{ correctAnswers: 'A|B' }, 'one correct'],
    [{ questionType: 'multiple_choice', correctAnswers: 'A' }, 'one correct'],
    [{ optionAEs: '' }, 'both languages'],
    [{ optionBEn: '', optionBEs: '' }, 'two bilingual'],
    [{ statementEn: '' }, 'statementEn is required'],
    [{ estimatedTimeSeconds: '10.5' }, 'integer'],
    [{ estimatedTimeSeconds: '601' }, 'integer'],
  ])('rejects invalid record %j', (changes, message) => {
    expect(() => parseQuestionCsv(csv(changes))).toThrow(message);
  });
  it.each([
    ['statementEn,statementEn\nx,y', 'duplicate'],
    ['statementEn,unknown\nx,y', 'Unknown'],
    ['statementEn\nx', 'Missing'],
    [QUESTION_CSV_TEMPLATE, 'at least one'],
    [csv().trimEnd() + ',extra', 'cells'],
    [csv().trimEnd() + 'unexpected', 'quotation'],
    [csv().trimEnd().slice(0, -1), 'unclosed'],
    ['x'.repeat(2 * 1024 * 1024 + 1), '2 MiB'],
    ['é'.repeat(1024 * 1024 + 1), '2 MiB'],
  ])('rejects malformed CSV without silently dropping data', (input, message) => {
    expect(() => parseQuestionCsv(input)).toThrow(message);
  });
  it('rejects more than 1000 records', () => {
    const record = csv().split('\r\n')[1];
    expect(() => parseQuestionCsv(QUESTION_CSV_TEMPLATE + (record + '\r\n').repeat(1001))).toThrow('1000');
  });
  it('ignores empty records and supports LF-only line endings', () => {
    expect(parseQuestionCsv('\n' + csv().replace(/\r\n/g, '\n') + '\n')).toHaveLength(1);
  });
});
