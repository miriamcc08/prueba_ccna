import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  QuestionListItem,
  QuestionDetail,
  ExamQuestionView,
  TopicInfo,
  QuestionOptionDetail,
  QuestionImportItem,
  ImportResult,
  PaginationInfo,
  ExamArea,
  Language,
  Difficulty,
  QuestionType,
  ValidationStatus,
} from '../../../shared/types';
import {
  createQuestionSchema,
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionFilterInput,
} from '../validators/schemas';
import {
  validateQuestionAnswers,
  detectDuplicate,
} from '../utils/networkValidators';
import { AppError } from '../middleware/errorHandler';

export async function getQuestions(filters: QuestionFilterInput, userId?: string): Promise<{
  questions: QuestionListItem[];
  pagination: PaginationInfo;
}> {
  const {
    topic,
    examArea,
    difficulty,
    questionType,
    validationStatus,
    search,
    language = 'en',
    page = 1,
    pageSize = 20,
  } = filters;

  const where: any = {};
  if (filters.favoritesOnly) {
    if (!userId) throw new AppError(401, 'Sign in to view favorites.');
    where.favorites = { some: { userId } };
  }

  if (topic) {
    where.AND = [{ OR: [
      { primaryTopicId: topic },
      { primaryTopic: { code: topic } },
      { primaryTopic: { nameEn: { contains: topic } } },
      { primaryTopic: { examArea: topic } },
    ] }];
  }

  if (examArea) {
    where.primaryTopic = {
      ...(where.primaryTopic || {}),
      examArea,
    };
  }

  if (difficulty && difficulty !== 'mixed') {
    where.difficulty = difficulty;
  }

  if (questionType) {
    where.questionType = questionType;
  }

  if (validationStatus) {
    where.validationStatus = validationStatus;
  }

  if (search) {
    where.OR = [
      { statementEn: { contains: search } },
      { statementEs: { contains: search } },
    ];
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [totalItems, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      skip,
      take,
      include: {
        primaryTopic: true,
        options: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const questionListItems: QuestionListItem[] = questions.map((q) => ({
    id: q.id,
    statement: language === 'es' ? q.statementEs : q.statementEn,
    questionType: q.questionType as QuestionType,
    difficulty: q.difficulty as Difficulty,
    topicName: language === 'es' ? q.primaryTopic.nameEs : q.primaryTopic.nameEn,
    examArea: q.primaryTopic.examArea as ExamArea,
    validationStatus: q.validationStatus as ValidationStatus,
    optionCount: q.options.length,
  }));

  return {
    questions: questionListItems,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export async function getQuestionById(id: string): Promise<QuestionDetail> {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      primaryTopic: true,
      source: true,
      options: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!question) {
    throw new AppError(404, `Question with id "${id}" not found.`);
  }

  let subtopics: string[] = [];
  if (question.subtopics) {
    try {
      subtopics = JSON.parse(question.subtopics);
    } catch {
      subtopics = [];
    }
  }

  const primaryTopic: TopicInfo = {
    id: question.primaryTopic.id,
    nameEn: question.primaryTopic.nameEn,
    nameEs: question.primaryTopic.nameEs,
    examArea: question.primaryTopic.examArea as ExamArea,
    examAreaNumber: question.primaryTopic.examAreaNumber,
    weightPercentage: question.primaryTopic.weightPercentage,
  };

  const options: QuestionOptionDetail[] = question.options.map((opt) => ({
    id: opt.id,
    optionLabel: opt.optionLabel,
    optionTextEn: opt.optionTextEn,
    optionTextEs: opt.optionTextEs,
    isCorrect: opt.isCorrect,
    explanationEn: opt.explanationEn || undefined,
    explanationEs: opt.explanationEs || undefined,
    displayOrder: opt.displayOrder,
  }));

  return {
    sourceUrl: question.sourceUrl || undefined,
    sourceLicense: question.sourceLicense || undefined,
    questionFamilyId: question.questionFamilyId || undefined,
    id: question.id,
    statementEn: question.statementEn,
    statementEs: question.statementEs,
    questionType: question.questionType as QuestionType,
    difficulty: question.difficulty as Difficulty,
    multipleAnswerCount: question.multipleAnswerCount || undefined,
    estimatedTimeSeconds: question.estimatedTimeSeconds,
    validationStatus: question.validationStatus as ValidationStatus,
    explanationEn: question.explanationEn || undefined,
    explanationEs: question.explanationEs || undefined,
    correctAnswerExplanationEn: question.correctAnswerExplanationEn || undefined,
    correctAnswerExplanationEs: question.correctAnswerExplanationEs || undefined,
    primaryTopic,
    subtopics,
    source: question.source
      ? {
          id: question.source.id,
          name: question.source.name,
          url: question.source.url || undefined,
          sourceType: question.source.sourceType as any,
          license: question.source.license || undefined,
        }
      : undefined,
    options,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

/**
 * Returns question formatted for active exam view - STRICTLY WITHOUT CORRECT ANSWERS
 */
export async function getQuestionForExam(
  id: string,
  language: Language,
  examQuestionId?: string,
  questionNumber = 1,
  totalQuestions = 1
): Promise<ExamQuestionView> {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      primaryTopic: true,
      options: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!question) {
    throw new AppError(404, `Question with id "${id}" not found.`);
  }

  return formatExamQuestion(question, language, examQuestionId, questionNumber, totalQuestions);
}

type ExamContent = Prisma.QuestionGetPayload<{ include: { primaryTopic: true; options: true } }>;
export function formatExamQuestion(question: ExamContent, language: Language, examQuestionId?: string, questionNumber = 1, totalQuestions = 1): ExamQuestionView {
  return {
    id: question.id,
    examQuestionId: examQuestionId || question.id,
    statement: language === 'es' ? question.statementEs : question.statementEn,
    questionType: question.questionType as QuestionType,
    difficulty: question.difficulty as Difficulty,
    multipleAnswerCount: question.multipleAnswerCount || undefined,
    estimatedTimeSeconds: question.estimatedTimeSeconds,
    topicName: language === 'es' ? question.primaryTopic.nameEs : question.primaryTopic.nameEn,
    options: question.options.map((opt) => ({
      id: opt.id,
      label: opt.optionLabel,
      text: language === 'es' ? opt.optionTextEs : opt.optionTextEn,
      displayOrder: opt.displayOrder,
    })),
    questionNumber,
    totalQuestions,
  };
}

export async function createQuestion(data: CreateQuestionInput): Promise<QuestionDetail> {
  if (data.validationStatus === 'validated') throw new AppError(400, 'Use the technical review endpoint to approve questions.');
  // Validate question & options logic
  const validation = validateQuestionAnswers(
    {
      questionType: data.questionType,
      multipleAnswerCount: data.multipleAnswerCount,
      statementEn: data.statementEn,
      statementEs: data.statementEs,
    },
    data.options
  );

  if (!validation.valid) {
    throw new AppError(400, 'Question validation failed', validation.errors);
  }

  // Ensure primary topic exists
  const topic = await prisma.topic.findUnique({
    where: { id: data.primaryTopicId },
  });
  if (!topic) {
    throw new AppError(404, `Primary topic "${data.primaryTopicId}" does not exist.`);
  }

  const created = await prisma.$transaction(async (tx) => {
    const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const statements = await tx.question.findMany({ select: { statementEn: true, statementEs: true } });
    if (statements.some(q => normalize(q.statementEn) === normalize(data.statementEn) || normalize(q.statementEs) === normalize(data.statementEs))) {
      throw new AppError(409, 'An identical English or Spanish question exists. Create a revision of that question.');
    }
    const question = await tx.question.create({
      data: {
        questionFamilyId: data.questionFamilyId,
        statementEn: data.statementEn,
        statementEs: data.statementEs,
        questionType: data.questionType,
        difficulty: data.difficulty,
        multipleAnswerCount: data.multipleAnswerCount,
        estimatedTimeSeconds: data.estimatedTimeSeconds ?? 90,
        validationStatus: data.validationStatus ?? 'draft',
        explanationEn: data.explanationEn,
        explanationEs: data.explanationEs,
        correctAnswerExplanationEn: data.correctAnswerExplanationEn,
        correctAnswerExplanationEs: data.correctAnswerExplanationEs,
        primaryTopicId: data.primaryTopicId,
        subtopics: data.subtopics ? JSON.stringify(data.subtopics) : null,
        sourceId: data.sourceId,
        sourceUrl: data.sourceUrl || null,
        sourceLicense: data.sourceLicense,
        options: {
          create: data.options.map((opt, idx) => ({
            optionLabel: opt.optionLabel,
            optionTextEn: opt.optionTextEn,
            optionTextEs: opt.optionTextEs,
            isCorrect: opt.isCorrect,
            explanationEn: opt.explanationEn,
            explanationEs: opt.explanationEs,
            displayOrder: idx,
          })),
        },
      },
    });
    return question;
  });

  return getQuestionById(created.id);
}

export async function updateQuestion(
  id: string,
  data: UpdateQuestionInput
): Promise<QuestionDetail> {
  const existing = await prisma.question.findUnique({
    where: { id },
    include: { options: true },
  });

  if (!existing) {
    throw new AppError(404, `Question with id "${id}" not found.`);
  }

  if (data.validationStatus === 'validated') throw new AppError(400, 'Use the technical review endpoint to approve questions.');

  if (await prisma.examQuestion.count({ where: { questionId: id, contentSnapshot: null } }) > 0) {
    throw new AppError(409, 'This question belongs to an older attempt without captured content. Create a separate revision to preserve that history.');
  }

  if (data.options && await prisma.examQuestion.count({ where: { questionId: id } }) > 0) {
    throw new AppError(409, 'This question is used in an exam. Create a separate revision instead of replacing its options.');
  }

  if (data.options) {
    const validation = validateQuestionAnswers(
      {
        questionType: data.questionType || existing.questionType,
        multipleAnswerCount: data.multipleAnswerCount ?? existing.multipleAnswerCount,
        statementEn: data.statementEn || existing.statementEn,
        statementEs: data.statementEs || existing.statementEs,
      },
      data.options
    );

    if (!validation.valid) {
      throw new AppError(400, 'Question validation failed', validation.errors);
    }
  }

  await prisma.$transaction(async (tx) => {
    // If options are provided, replace them
    if (data.options) {
      await tx.questionOption.deleteMany({
        where: { questionId: id },
      });

      await tx.questionOption.createMany({
        data: data.options.map((opt, idx) => ({
          questionId: id,
          optionLabel: opt.optionLabel,
          optionTextEn: opt.optionTextEn,
          optionTextEs: opt.optionTextEs,
          isCorrect: opt.isCorrect,
          explanationEn: opt.explanationEn,
          explanationEs: opt.explanationEs,
          displayOrder: idx,
        })),
      });
    }

    const { options: _, subtopics, ...questionData } = data;

    await tx.question.update({
      where: { id },
      data: {
        ...questionData,
        // Any edit invalidates a previous technical approval. History remains in review records.
        validationStatus: data.validationStatus || 'pending_review',
        lastVerifiedAt: null,
        ...(subtopics ? { subtopics: JSON.stringify(subtopics) } : {}),
      },
    });
  });

  return getQuestionById(id);
}

export async function importQuestions(items: QuestionImportItem[]): Promise<ImportResult> {
  let imported = 0;
  let rejected = 0;
  let duplicates = 0;
  const errors: { index: number; statement: string; reason: string }[] = [];

  // Fetch all existing questions to check duplicates
  const existingQuestions = await prisma.question.findMany({
    select: { id: true, statementEn: true, statementEs: true },
  });

  // Fetch topics by area
  const topics = await prisma.topic.findMany();
  const topicMapByArea = new Map<string, string>();
  for (const t of topics) {
    if (!topicMapByArea.has(t.examArea)) {
      topicMapByArea.set(t.examArea, t.id);
    }
  }

  // Find or create default source
  let defaultSource = await prisma.source.findFirst({
    where: { sourceType: 'user_import' },
  });

  if (!defaultSource) {
    defaultSource = await prisma.source.create({
      data: {
        name: 'User Import',
        sourceType: 'user_import',
        reuseConditions: 'Imported questions bank',
      },
    });
  }

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];

    try {
      // 1. Check duplicate
      const dupCheck = detectDuplicate(
        { statementEn: item.statementEn, statementEs: item.statementEs },
        existingQuestions
      );

      if (dupCheck.isDuplicate) {
        duplicates++;
        errors.push({
          index: idx,
          statement: item.statementEn.slice(0, 80),
          reason: `Duplicate detected (${Math.round(dupCheck.similarity * 100)}% similarity to ID ${dupCheck.matchingQuestionId})`,
        });
        continue;
      }

      // 2. Validate options and rules
      const val = validateQuestionAnswers(
        {
          questionType: item.questionType,
          multipleAnswerCount: item.multipleAnswerCount,
          statementEn: item.statementEn,
          statementEs: item.statementEs,
        },
        item.options
      );

      if (!val.valid) {
        rejected++;
        errors.push({
          index: idx,
          statement: item.statementEn.slice(0, 80),
          reason: val.errors.join('; '),
        });
        continue;
      }

      // 3. Resolve topic ID
      const topicId = topicMapByArea.get(item.primaryTopicExamArea);
      if (!topicId) {
        rejected++;
        errors.push({
          index: idx,
          statement: item.statementEn.slice(0, 80),
          reason: `No topic found for exam area: "${item.primaryTopicExamArea}"`,
        });
        continue;
      }

      // 4. Create question
      const newQuestion = await prisma.question.create({
        data: {
          questionFamilyId: item.questionFamilyId,
          statementEn: item.statementEn,
          statementEs: item.statementEs,
          questionType: item.questionType,
          difficulty: item.difficulty,
          multipleAnswerCount: item.multipleAnswerCount,
          estimatedTimeSeconds: item.estimatedTimeSeconds ?? 90,
          validationStatus: 'pending_review',
          explanationEn: item.explanationEn,
          explanationEs: item.explanationEs,
          correctAnswerExplanationEn: item.correctAnswerExplanationEn,
          correctAnswerExplanationEs: item.correctAnswerExplanationEs,
          primaryTopicId: topicId,
          sourceId: defaultSource.id,
          sourceUrl: item.sourceUrl || null,
          sourceLicense: item.sourceLicense,
          options: {
            create: item.options.map((opt, oIdx) => ({
              optionLabel: opt.optionLabel,
              optionTextEn: opt.optionTextEn,
              optionTextEs: opt.optionTextEs,
              isCorrect: opt.isCorrect,
              explanationEn: opt.explanationEn,
              explanationEs: opt.explanationEs,
              displayOrder: oIdx,
            })),
          },
        },
      });

      existingQuestions.push({
        id: newQuestion.id,
        statementEn: newQuestion.statementEn,
        statementEs: newQuestion.statementEs,
      });

      imported++;
    } catch (err: unknown) {
      rejected++;
      errors.push({
        index: idx,
        statement: item.statementEn?.slice(0, 80) || `Item ${idx}`,
        reason: (err as Error).message || 'Failed to insert question',
      });
    }
  }

  return {
    totalReceived: items.length,
    imported,
    rejected,
    duplicates,
    errors,
  };
}

export async function getQuestionStats(): Promise<{
  total: number;
  byExamArea: Record<string, number>;
  byDifficulty: Record<string, number>;
  byValidationStatus: Record<string, number>;
  byQuestionType: Record<string, number>;
}> {
  const [total, byTopicRows, byDiffRows, byStatusRows, byTypeRows] = await Promise.all([
    prisma.question.count(),
    prisma.question.findMany({
      select: {
        primaryTopic: {
          select: { examArea: true },
        },
      },
    }),
    prisma.question.groupBy({
      by: ['difficulty'],
      _count: { id: true },
    }),
    prisma.question.groupBy({
      by: ['validationStatus'],
      _count: { id: true },
    }),
    prisma.question.groupBy({
      by: ['questionType'],
      _count: { id: true },
    }),
  ]);

  const byExamArea: Record<string, number> = {};
  for (const row of byTopicRows) {
    const area = row.primaryTopic?.examArea || 'unknown';
    byExamArea[area] = (byExamArea[area] || 0) + 1;
  }

  const byDifficulty: Record<string, number> = {};
  for (const row of byDiffRows) {
    byDifficulty[row.difficulty] = row._count.id;
  }

  const byValidationStatus: Record<string, number> = {};
  for (const row of byStatusRows) {
    byValidationStatus[row.validationStatus] = row._count.id;
  }

  const byQuestionType: Record<string, number> = {};
  for (const row of byTypeRows) {
    byQuestionType[row.questionType] = row._count.id;
  }

  return {
    total,
    byExamArea,
    byDifficulty,
    byValidationStatus,
    byQuestionType,
  };
}

// Revisions retain every original option row, including IDs referenced by past responses.
export async function createQuestionRevision(id: string, changes: UpdateQuestionInput, reviewerId: string): Promise<QuestionDetail> {
  const created = await prisma.$transaction(async tx => {
    const original = await tx.question.findUnique({ where: { id }, include: { options: { orderBy: { displayOrder: 'asc' } } } });
    if (!original) throw new AppError(404, 'Question not found.');
    const withoutNulls = (value: Record<string, unknown>) => Object.fromEntries(Object.entries(value).filter(([, value]) => value !== null));
    const parsed = createQuestionSchema.parse({
      ...withoutNulls(original),
      options: original.options.map(withoutNulls),
      subtopics: JSON.parse(original.subtopics || '[]'),
      ...changes, validationStatus: 'pending_review',
    });
    const check = validateQuestionAnswers(parsed, parsed.options);
    if (!check.valid) throw new AppError(400, 'Revision validation failed.', check.errors);
    const family = original.questionFamilyId || original.id;
    const { options, subtopics, ...fields } = parsed;
    const revision = await tx.question.create({ data: {
      ...fields, questionFamilyId: family, subtopics: JSON.stringify(subtopics || []), lastVerifiedAt: null,
      options: { create: options.map((option, i) => ({ ...option, displayOrder: i })) },
    } });
    await tx.question.update({ where: { id }, data: { questionFamilyId: family, validationStatus: 'pending_review', lastVerifiedAt: null } });
    await tx.questionReview.create({ data: {
      questionId: id, reviewerId, status: 'pending_review',
      notes: `Created draft revision ${revision.id}; original content and options retained for past attempts.`,
    } });
    return revision;
  });
  return getQuestionById(created.id);
}
