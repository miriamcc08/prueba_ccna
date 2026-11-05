const fs = require('fs');

// Fix questions.ts - revert paramId approach and just use `as string` casts
let qs = fs.readFileSync('src/routes/questions.ts', 'utf8').replace(/\r\n/g, '\n');

// Remove the paramId helper if it was added
qs = qs.replace('const paramId = (req: Request) => req.params.id as string;\n\n', '');

// Replace all paramId(req) back to req.params.id and add `as string`
qs = qs.replace(/paramId\(req\)/g, '(req.params.id as string)');

// Also fix any remaining bare req.params.id in the later routes
// We need to be careful not to double-cast
qs = qs.replace(/req\.params\.id(?!\s+as\b)(?!.*as string)/g, '(req.params.id as string)');

fs.writeFileSync('src/routes/questions.ts', qs);
console.log('Fixed questions.ts');

// Fix exams.ts too
let ex = fs.readFileSync('src/routes/exams.ts', 'utf8').replace(/\r\n/g, '\n');
ex = ex.replace(/req\.params\.id(?!\s+as\b)/g, '(req.params.id as string)');
ex = ex.replace(/req\.params\.examId(?!\s+as\b)/g, '(req.params.examId as string)');
fs.writeFileSync('src/routes/exams.ts', ex);
console.log('Fixed exams.ts');
