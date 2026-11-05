const fs = require('fs');

// Fix questions.ts - cast req.params.id to string
let qs = fs.readFileSync('src/routes/questions.ts', 'utf8').replace(/\r\n/g, '\n');

// Add type helper at top after imports
const importEnd = qs.indexOf("const router = express.Router();");
if (importEnd > 0) {
  qs = qs.slice(0, importEnd) + 
    "const paramId = (req: Request) => req.params.id as string;\n\n" + 
    qs.slice(importEnd);
}

// Replace req.params.id usages in the favorite/review routes
// Use a regex to match all occurrences
qs = qs.replace(/req\.params\.id(?!\s*as\b)/g, 'paramId(req)');

// Fix the validateQuestionAnswers call - q needs options included
qs = qs.replace(
  'const check = validateQuestionAnswers(q, q.options);',
  'const check = validateQuestionAnswers(q as any, q.options as any);'
);

fs.writeFileSync('src/routes/questions.ts', qs);
console.log('Fixed questions.ts');
