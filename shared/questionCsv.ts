/** CSV adapter only; the API remains responsible for schema, permissions and review. */
export const QUESTION_CSV_HEADERS = [
  'statementEn', 'statementEs', 'questionType', 'difficulty', 'primaryTopicExamArea',
  'explanationEn', 'explanationEs', 'correctAnswers',
  ...'ABCDEF'.split('').flatMap(label => [`option${label}En`, `option${label}Es`]),
  'sourceUrl', 'sourceLicense', 'sourceName', 'questionFamilyId', 'estimatedTimeSeconds',
];
export const QUESTION_CSV_TEMPLATE = QUESTION_CSV_HEADERS.join(',') + '\r\n';
const required = QUESTION_CSV_HEADERS.slice(0, 8);
const MAX_LENGTH = 2 * 1024 * 1024;

/** RFC 4180-style commas, quoted commas/newlines, escaped double quotes, CRLF and BOM. */
function readCsv(text: string): string[][] {
  if (text.length > MAX_LENGTH || new TextEncoder().encode(text).byteLength > MAX_LENGTH) throw new Error('CSV exceeds the 2 MiB text limit.');
  text = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  const cell = () => { row.push(field); field = ''; closed = false; };
  const line = () => {
    cell();
    if (row.some(value => value.trim())) rows.push(row);
    row = [];
    if (rows.length > 1001) throw new Error('CSV supports at most 1000 questions.');
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
    } else if (char === ',') cell();
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      line();
    } else if (char === '"' && !field && !closed) quoted = true;
    else {
      if (closed || char === '"') throw new Error(`CSV record ${rows.length + 1}: invalid quotation.`);
      field += char;
    }
  }
  if (quoted) throw new Error('CSV has an unclosed quoted field.');
  if (row.length || field || closed) line();
  return rows;
}

export function parseQuestionCsv(text: string) {
  const rows = readCsv(text);
  if (rows.length < 2) throw new Error('CSV needs headers and at least one question.');
  const headers = rows[0].map(value => value.trim());
  if (new Set(headers).size !== headers.length) throw new Error('CSV has duplicate headers.');
  const unknown = headers.filter(value => !QUESTION_CSV_HEADERS.includes(value));
  if (unknown.length) throw new Error(`Unknown CSV headers: ${unknown.join(', ')}.`);
  const missing = required.filter(value => !headers.includes(value));
  if (missing.length) throw new Error(`Missing CSV headers: ${missing.join(', ')}.`);
  return rows.slice(1).map((values, index) => {
    const fail = (message: string): never => { throw new Error(`CSV record ${index + 2}: ${message}`); };
    if (values.length !== headers.length) fail(`expected ${headers.length} cells, received ${values.length}.`);
    const record: Record<string, string> = Object.fromEntries(headers.map((header, i) => [header, values[i].trim()]));
    for (const key of required) if (!record[key]) fail(`${key} is required.`);
    const correct = record.correctAnswers.split('|').map(value => value.trim().toUpperCase());
    if (new Set(correct).size !== correct.length || correct.some(value => !/^[A-F]$/.test(value))) fail('correctAnswers must contain unique letters A–F separated by |.');
    const options = 'ABCDEF'.split('').flatMap(optionLabel => {
      const optionTextEn = record[`option${optionLabel}En`] || '', optionTextEs = record[`option${optionLabel}Es`] || '';
      if (!optionTextEn && !optionTextEs) return [];
      if (!optionTextEn || !optionTextEs) fail(`option ${optionLabel} needs both languages.`);
      return [{ optionLabel, optionTextEn, optionTextEs, isCorrect: correct.includes(optionLabel) }];
    });
    if (options.length < 2) fail('at least two bilingual options are required.');
    if (correct.some(label => !options.some(option => option.optionLabel === label))) fail('a correct answer references a missing option.');
    if (record.questionType === 'multiple_choice' ? correct.length < 2 : correct.length !== 1) fail('use one correct answer, or at least two for multiple_choice.');
    const estimated = record.estimatedTimeSeconds;
    if (estimated && (!/^\d+$/.test(estimated) || Number(estimated) < 10 || Number(estimated) > 600)) fail('estimatedTimeSeconds must be an integer from 10 to 600.');
    return {
      statementEn: record.statementEn, statementEs: record.statementEs,
      questionType: record.questionType, difficulty: record.difficulty, primaryTopicExamArea: record.primaryTopicExamArea,
      explanationEn: record.explanationEn, explanationEs: record.explanationEs,
      options, multipleAnswerCount: record.questionType === 'multiple_choice' ? correct.length : undefined,
      ...Object.fromEntries(['sourceUrl', 'sourceLicense', 'sourceName', 'questionFamilyId'].filter(key => record[key]).map(key => [key, record[key]])),
      ...(estimated ? { estimatedTimeSeconds: Number(estimated) } : {}),
    };
  });
}
