const fs = require('fs');

// Fix questionService.ts
let qs = fs.readFileSync('src/services/questionService.ts', 'utf8').replace(/\r\n/g, '\n');

// Fix the validation call - cast fields to string types
const oldValidation = `    const validation = validateQuestionAnswers(
      {
        questionType: data.questionType || existing.questionType,
        multipleAnswerCount: data.multipleAnswerCount ?? existing.multipleAnswerCount,
        statementEn: data.statementEn || existing.statementEn,
        statementEs: data.statementEs || existing.statementEs,
      },
      data.options
    );`;

const newValidation = `    const validation = validateQuestionAnswers(
      {
        questionType: (data.questionType || existing.questionType) as string,
        multipleAnswerCount: (data.multipleAnswerCount ?? existing.multipleAnswerCount) as number | null,
        statementEn: (data.statementEn || existing.statementEn) as string,
        statementEs: (data.statementEs || existing.statementEs) as string,
      },
      data.options as any
    );`;

qs = qs.replace(oldValidation, newValidation);

// Fix the options.map - add type annotation
qs = qs.replace(
  'data: data.options.map((opt, idx) => ({',
  'data: data.options!.map((opt: any, idx: number) => ({'
);

// Fix the prisma update - spread questionData with explicit types
const oldUpdate = `    const { options: _, subtopics, ...questionData } = data;

    await tx.question.update({
      where: { id },
      data: {
        ...questionData,
        // Any edit invalidates a previous technical approval. History remains in review records.
        validationStatus: data.validationStatus || 'pending_review',
        lastVerifiedAt: null,
        ...(subtopics ? { subtopics: JSON.stringify(subtopics) } : {}),
      },
    });`;

const newUpdate = `    const { options: _, subtopics, ...questionData } = data;

    const updateData: Record<string, any> = {
      ...questionData,
      // Any edit invalidates a previous technical approval. History remains in review records.
      validationStatus: (data.validationStatus as string) || 'pending_review',
      lastVerifiedAt: null,
    };
    if (subtopics) updateData.subtopics = JSON.stringify(subtopics);

    await tx.question.update({
      where: { id },
      data: updateData,
    });`;

qs = qs.replace(oldUpdate, newUpdate);

fs.writeFileSync('src/services/questionService.ts', qs);
console.log('Fixed questionService.ts');

// Fix topics.ts
let tp = fs.readFileSync('src/routes/topics.ts', 'utf8').replace(/\r\n/g, '\n');

tp = tp.replace(
  'OR: [{ id: req.params.id }, { code: req.params.id }],',
  'OR: [{ id: req.params.id as string }, { code: req.params.id as string }],'
);

fs.writeFileSync('src/routes/topics.ts', tp);
console.log('Fixed topics.ts');
