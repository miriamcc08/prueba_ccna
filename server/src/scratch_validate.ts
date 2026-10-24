import * as fs from 'fs';
import * as path from 'path';
import { importQuestionsSchema } from '../src/validators/schemas';
import { validateQuestionAnswers } from '../src/utils/networkValidators';

const filePath = path.join(__dirname, '../../prisma/questions/batch1_ip_connectivity.json');
const raw = fs.readFileSync(filePath, 'utf-8');
const json = JSON.parse(raw);

console.log('Testing importQuestionsSchema parse...');
const parsed = importQuestionsSchema.parse(json);
console.log('✓ Zod Schema validation passed! Total questions:', parsed.questions.length);

let errors = 0;
parsed.questions.forEach((q, idx) => {
  const res = validateQuestionAnswers(
    {
      questionType: q.questionType,
      multipleAnswerCount: q.multipleAnswerCount,
      statementEn: q.statementEn,
      statementEs: q.statementEs,
    },
    q.options
  );
  if (!res.valid) {
    console.error(`Question ${idx + 1} validation failed:`, res.errors);
    errors++;
  }
});

if (errors === 0) {
  console.log('✓ All questions passed validateQuestionAnswers!');
} else {
  console.error(`Failed on ${errors} questions.`);
  process.exit(1);
}

// Check counts
const diffs: Record<string, number> = {};
const types: Record<string, number> = {};

parsed.questions.forEach((q) => {
  diffs[q.difficulty] = (diffs[q.difficulty] || 0) + 1;
  types[q.questionType] = (types[q.questionType] || 0) + 1;
});

console.log('Difficulties:', diffs);
console.log('Question types:', types);
