const fs = require('fs');
let content = fs.readFileSync('src/validators/schemas.ts', 'utf8');

const oldCode = `// Zod 4 applies nested defaults inside optional fields. PATCH must preserve omitted fields.
export const updateQuestionSchema = createQuestionSchema.partial().extend({
  subtopics: createQuestionSchema.shape.subtopics.unwrap().optional(),
  estimatedTimeSeconds: createQuestionSchema.shape.estimatedTimeSeconds.unwrap().optional(),
  validationStatus: createQuestionSchema.shape.validationStatus.unwrap().optional(),
});`;

const newCode = `// PATCH must preserve omitted fields - strip defaults so undefined means unchanged.
export const updateQuestionSchema = createQuestionSchema.partial().extend({
  subtopics: z.array(z.string()).optional(),
  estimatedTimeSeconds: z.number().int().min(10).max(600).optional(),
  validationStatus: z.enum(['draft', 'pending_review', 'validated', 'rejected']).optional(),
});`;

// Normalize line endings for comparison
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedOld = oldCode.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedOld)) {
  content = normalizedContent.replace(normalizedOld, newCode);
  fs.writeFileSync('src/validators/schemas.ts', content);
  console.log('Fixed schemas.ts');
} else {
  console.log('Pattern not found');
}
