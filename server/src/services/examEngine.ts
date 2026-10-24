import { prisma } from '../lib/prisma';
import {
  ExamConfig,
  ExamStateResponse,
  ExamQuestionView,
  SubmitAnswerResponse,
  ExamResultResponse,
  EXAM_AREA_WEIGHTS,
  ExamArea,
  Language,
} from '../../../shared/types';
import { getQuestionForExam } from './questionService';
import { calculateResults } from './scoringEngine';
import { AppError } from '../middleware/errorHandler';

/**
 * Fisher-Yates array shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function createExam(
  config: ExamConfig,
  userId?: string
): Promise<ExamStateResponse> {
  const {
    questionCount,
    durationMinutes,
    language,
    mode,
    difficulty,
    topics,
    randomize,
    strictMode,
    studyMode,
    groupByTopic,
  } = config;

  let selectedQuestionIds: string[] = [];

  // Common difficulty filter
  const diffFilter = difficulty !== 'mixed' ? { difficulty } : {};

  if (mode === 'full_simulation') {
    // Respect CCNA official area weights: 20/20/25/10/15/10
    const areaWeights = EXAM_AREA_WEIGHTS;
    const areas = Object.keys(areaWeights) as ExamArea[];

    const areaQuestionsMap = new Map<ExamArea, string[]>();

    for (const area of areas) {
      const weight = areaWeights[area];
      const targetCount = Math.max(1, Math.round((questionCount * weight) / 100));

      const questions = await prisma.question.findMany({
        where: {
          ...diffFilter,
          primaryTopic: { examArea: area },
        },
        select: { id: true },
        take: targetCount * 2, // fetch pool to pick from
      });

      const ids = questions.map((q) => q.id);
      areaQuestionsMap.set(area, randomize ? shuffleArray(ids).slice(0, targetCount) : ids.slice(0, targetCount));
    }

    // Combine area questions
    for (const area of areas) {
      selectedQuestionIds.push(...(areaQuestionsMap.get(area) || []));
    }

    // If we didn't get enough questions due to bank size, fill from anywhere
    if (selectedQuestionIds.length < questionCount) {
      const needed = questionCount - selectedQuestionIds.length;
      const additional = await prisma.question.findMany({
        where: {
          id: { notIn: selectedQuestionIds },
          ...diffFilter,
        },
        select: { id: true },
        take: needed,
      });
      selectedQuestionIds.push(...additional.map((q) => q.id));
    }
  } else if (mode === 'subnetting_practice') {
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { questionType: 'subnetting' },
          { questionType: 'ipv4_calculation' },
          { primaryTopic: { examArea: 'network_fundamentals' } },
          { primaryTopic: { examArea: 'ip_connectivity' } },
        ],
        ...diffFilter,
      },
      select: { id: true },
      take: questionCount * 2,
    });
    const ids = questions.map((q) => q.id);
    selectedQuestionIds = randomize ? shuffleArray(ids).slice(0, questionCount) : ids.slice(0, questionCount);
  } else if (mode === 'command_practice') {
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { questionType: 'ios_commands' },
          { questionType: 'router_config' },
          { questionType: 'switch_config' },
        ],
        ...diffFilter,
      },
      select: { id: true },
      take: questionCount * 2,
    });
    const ids = questions.map((q) => q.id);
    selectedQuestionIds = randomize ? shuffleArray(ids).slice(0, questionCount) : ids.slice(0, questionCount);
  } else if (mode === 'troubleshooting_practice') {
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { questionType: 'troubleshooting' },
          { questionType: 'routing_table' },
          { questionType: 'topology_analysis' },
        ],
        ...diffFilter,
      },
      select: { id: true },
      take: questionCount * 2,
    });
    const ids = questions.map((q) => q.id);
    selectedQuestionIds = randomize ? shuffleArray(ids).slice(0, questionCount) : ids.slice(0, questionCount);
  } else if (mode === 'topic_practice' && topics.length > 0) {
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { primaryTopicId: { in: topics } },
          { primaryTopic: { code: { in: topics } } },
          { primaryTopic: { examArea: { in: topics } } },
        ],
        ...diffFilter,
      },
      select: { id: true },
      take: questionCount * 2,
    });
    const ids = questions.map((q) => q.id);
    selectedQuestionIds = randomize ? shuffleArray(ids).slice(0, questionCount) : ids.slice(0, questionCount);
  } else if (mode === 'incorrect_review' && userId) {
    // Find questions previously answered incorrectly by user
    const incorrectResponses = await prisma.examResponse.findMany({
      where: {
        examQuestion: {
          exam: { userId },
        },
        isCorrect: false,
      },
      select: {
        examQuestion: {
          select: { questionId: true },
        },
      },
      distinct: ['examQuestionId'],
      take: questionCount,
    });

    const missedIds = [...new Set(incorrectResponses.map((r) => r.examQuestion.questionId))];
    selectedQuestionIds = randomize ? shuffleArray(missedIds) : missedIds;

    // If user doesn't have enough mistakes, supplement with any questions
    if (selectedQuestionIds.length < questionCount) {
      const fillCount = questionCount - selectedQuestionIds.length;
      const extra = await prisma.question.findMany({
        where: {
          id: { notIn: selectedQuestionIds },
          ...diffFilter,
        },
        select: { id: true },
        take: fillCount,
      });
      selectedQuestionIds.push(...extra.map((q) => q.id));
    }
  } else {
    // Custom / default selection
    const topicFilter =
      topics && topics.length > 0
        ? {
            OR: [
              { primaryTopicId: { in: topics } },
              { primaryTopic: { code: { in: topics } } },
              { primaryTopic: { examArea: { in: topics } } },
            ],
          }
        : {};

    const questions = await prisma.question.findMany({
      where: {
        ...topicFilter,
        ...diffFilter,
      },
      select: { id: true },
      take: questionCount * 2,
    });

    const ids = questions.map((q) => q.id);
    selectedQuestionIds = randomize ? shuffleArray(ids).slice(0, questionCount) : ids.slice(0, questionCount);
  }

  // Fallback if question bank has fewer questions
  if (selectedQuestionIds.length === 0) {
    const fallbackQuestions = await prisma.question.findMany({
      select: { id: true },
      take: questionCount,
    });
    selectedQuestionIds = fallbackQuestions.map((q) => q.id);
  }

  // Truncate to questionCount
  selectedQuestionIds = selectedQuestionIds.slice(0, questionCount);

  if (selectedQuestionIds.length === 0) {
    throw new AppError(400, 'No questions are available in the question bank matching the requested criteria.');
  }

  // Ordering: groupByTopic or randomize
  if (groupByTopic) {
    // Sort question IDs according to their topic order
    const orderedTopics = await prisma.question.findMany({
      where: { id: { in: selectedQuestionIds } },
      select: { id: true, primaryTopic: { select: { examAreaNumber: true, code: true } } },
      orderBy: [
        { primaryTopic: { examAreaNumber: 'asc' } },
        { primaryTopic: { code: 'asc' } },
      ],
    });
    selectedQuestionIds = orderedTopics.map((q) => q.id);
  } else if (randomize) {
    selectedQuestionIds = shuffleArray(selectedQuestionIds);
  }

  // Create exam record in database
  const exam = await prisma.$transaction(async (tx) => {
    const newExam = await tx.exam.create({
      data: {
        userId: userId || null,
        questionCount: selectedQuestionIds.length,
        durationMinutes,
        language,
        mode,
        difficulty,
        strictMode,
        studyMode,
        selectedTopics: topics ? JSON.stringify(topics) : null,
        status: 'configured',
        currentQuestionIdx: 0,
      },
    });

    await tx.examQuestion.createMany({
      data: selectedQuestionIds.map((qId, idx) => ({
        examId: newExam.id,
        questionId: qId,
        questionOrder: idx,
        status: 'pending',
      })),
    });

    return newExam;
  });

  return getExamState(exam.id);
}

export async function startExam(examId: string): Promise<ExamStateResponse> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  if (exam.status === 'in_progress') {
    return getExamState(examId);
  }

  if (exam.status !== 'configured') {
    throw new AppError(400, `Cannot start exam with status "${exam.status}".`);
  }

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + exam.durationMinutes * 60 * 1000);

  await prisma.exam.update({
    where: { id: examId },
    data: {
      status: 'in_progress',
      startedAt,
      expiresAt,
    },
  });

  return getExamState(examId);
}

/**
 * Checks if the exam has expired based on server timestamps.
 * If expired, marks remaining questions timed_out, completes the exam, and returns true.
 */
export async function checkExpiry(examId: string): Promise<boolean> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam || exam.status !== 'in_progress' || !exam.expiresAt) {
    return false;
  }

  const now = new Date();
  if (now > exam.expiresAt) {
    // Mark pending questions as timed_out
    await prisma.examQuestion.updateMany({
      where: {
        examId,
        status: 'pending',
      },
      data: {
        status: 'timed_out',
      },
    });

    await prisma.exam.update({
      where: { id: examId },
      data: {
        status: 'expired',
        completedAt: now,
      },
    });

    // Score the exam
    await calculateResults(examId);
    return true;
  }

  return false;
}

export async function getCurrentQuestion(examId: string): Promise<ExamQuestionView> {
  const isExpired = await checkExpiry(examId);
  if (isExpired) {
    throw new AppError(400, 'Exam time has expired.');
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  if (exam.status !== 'in_progress') {
    throw new AppError(400, `Exam is not in progress (current status: ${exam.status}).`);
  }

  const examQuestion = await prisma.examQuestion.findUnique({
    where: {
      examId_questionOrder: {
        examId,
        questionOrder: exam.currentQuestionIdx,
      },
    },
  });

  if (!examQuestion) {
    throw new AppError(404, `No question found at index ${exam.currentQuestionIdx}.`);
  }

  return getQuestionForExam(
    examQuestion.questionId,
    exam.language as Language,
    examQuestion.id,
    exam.currentQuestionIdx + 1,
    exam.questionCount
  );
}

export async function submitAnswer(
  examId: string,
  examQuestionId: string,
  selectedOptionIds: string[]
): Promise<SubmitAnswerResponse> {
  const isExpired = await checkExpiry(examId);
  if (isExpired) {
    throw new AppError(400, 'Exam time has expired. Cannot submit answers.');
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  if (exam.status !== 'in_progress') {
    throw new AppError(400, `Exam is not in progress (status: ${exam.status}).`);
  }

  const examQuestion = await prisma.examQuestion.findUnique({
    where: { id: examQuestionId },
    include: {
      question: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!examQuestion || examQuestion.examId !== examId) {
    throw new AppError(404, 'Question does not belong to this exam.');
  }

  // Strict mode: answers must be submitted sequentially for the current question
  if (exam.strictMode && examQuestion.questionOrder !== exam.currentQuestionIdx) {
    throw new AppError(
      400,
      `Strict mode violation: question ${examQuestion.questionOrder + 1} does not match current index ${exam.currentQuestionIdx + 1}.`
    );
  }

  const now = new Date();

  // Save selected option responses
  await prisma.$transaction(async (tx) => {
    // Clear any previous responses for this question
    await tx.examResponse.deleteMany({
      where: { examQuestionId },
    });

    if (selectedOptionIds.length > 0) {
      await tx.examResponse.createMany({
        data: selectedOptionIds.map((optId) => ({
          examQuestionId,
          selectedOptionId: optId,
          confirmedAt: now,
        })),
      });

      await tx.examQuestion.update({
        where: { id: examQuestionId },
        data: {
          status: 'answered',
          answeredAt: now,
        },
      });
    } else {
      await tx.examQuestion.update({
        where: { id: examQuestionId },
        data: {
          status: 'skipped',
          answeredAt: now,
        },
      });
    }
  });

  const nextQuestionIndex = exam.currentQuestionIdx + 1;
  const isLastQuestion = nextQuestionIndex >= exam.questionCount;

  if (isLastQuestion) {
    // Complete the exam
    await prisma.exam.update({
      where: { id: examId },
      data: {
        status: 'completed',
        completedAt: now,
        currentQuestionIdx: nextQuestionIndex,
      },
    });
    await calculateResults(examId);
  } else {
    // Advance to next question
    await prisma.exam.update({
      where: { id: examId },
      data: {
        currentQuestionIdx: nextQuestionIndex,
      },
    });
  }

  // Study mode feedback: reveal explanation and correctness
  if (exam.studyMode) {
    const q = examQuestion.question;
    const correctOptions = q.options.filter((o) => o.isCorrect);
    const correctOptionIds = correctOptions.map((o) => o.id);

    const userSet = new Set(selectedOptionIds);
    const correctSet = new Set(correctOptionIds);

    let isCorrect = selectedOptionIds.length > 0;
    for (const cId of correctOptionIds) {
      if (!userSet.has(cId)) isCorrect = false;
    }
    for (const sId of selectedOptionIds) {
      if (!correctSet.has(sId)) isCorrect = false;
    }

    const explanation =
      exam.language === 'es'
        ? q.explanationEs || q.correctAnswerExplanationEs || undefined
        : q.explanationEn || q.correctAnswerExplanationEn || undefined;

    return {
      confirmed: true,
      nextQuestionIndex,
      isCorrect,
      explanation,
      correctOptionIds,
    };
  }

  // STRICT / NORMAL EXAM MODE: NEVER send correct answers
  return {
    confirmed: true,
    nextQuestionIndex,
  };
}

export async function completeExam(examId: string): Promise<ExamResultResponse> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  if (exam.status !== 'completed') {
    await prisma.exam.update({
      where: { id: examId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  return calculateResults(examId);
}

export async function getExamState(examId: string): Promise<ExamStateResponse> {
  await checkExpiry(examId);

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  let selectedTopics: string[] = [];
  if (exam.selectedTopics) {
    try {
      selectedTopics = JSON.parse(exam.selectedTopics);
    } catch {
      selectedTopics = [];
    }
  }

  const config: ExamConfig = {
    questionCount: exam.questionCount,
    durationMinutes: exam.durationMinutes,
    language: exam.language as Language,
    mode: exam.mode as any,
    difficulty: exam.difficulty as any,
    topics: selectedTopics,
    randomize: true,
    strictMode: exam.strictMode,
    studyMode: exam.studyMode,
    showExplanations: exam.studyMode,
    soundEnabled: true,
    groupByTopic: false,
  };

  const now = Date.now();
  const timeRemainingSeconds = exam.expiresAt
    ? Math.max(0, Math.floor((exam.expiresAt.getTime() - now) / 1000))
    : exam.durationMinutes * 60;

  const answeredCount = exam.questions.filter((q) => q.status === 'answered').length;

  return {
    examId: exam.id,
    config,
    currentQuestionIndex: exam.currentQuestionIdx,
    totalQuestions: exam.questionCount,
    startedAt: exam.startedAt ? exam.startedAt.toISOString() : exam.createdAt.toISOString(),
    expiresAt: exam.expiresAt ? exam.expiresAt.toISOString() : new Date(now + exam.durationMinutes * 60000).toISOString(),
    timeRemainingSeconds,
    answeredCount,
    status: exam.status as any,
  };
}
