import { Prisma } from '@prisma/client';
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
import { captureQuestion, storedQuestion } from '../lib/examSnapshot';
import { formatExamQuestion } from './questionService';
import { calculateResults } from './scoringEngine';
import { AppError } from '../middleware/errorHandler';

// Older sessions without saved preferences keep their original study behavior.
function revealStudyExplanations(exam: { studyMode: boolean; strictMode: boolean; settings: string | null }): boolean {
  if (!exam.studyMode || exam.strictMode) return false;
  const settings = exam.settings ? JSON.parse(exam.settings) : {};
  return settings.showExplanations ?? true;
}

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

async function findEligibleQuestions(config: ExamConfig, userId?: string) {
  const { mode, difficulty, topics, randomize } = config;
  if (mode === 'incorrect_review' && !userId) throw new AppError(401, 'Sign in to review your incorrect answers.');
  if (mode === 'topic_practice' && topics.length === 0) throw new AppError(400, 'Select at least one topic.');
  // Every selection path shares the same eligibility rules. No unfiltered fallback.
  const where: Prisma.QuestionWhereInput = {
    validationStatus: 'validated',
    examVersion: '200-301-v1.1',
    ...(difficulty !== 'mixed' ? { difficulty } : {}),
  };
  if (topics.length > 0) {
    where.OR = [
      { primaryTopicId: { in: topics } },
      { primaryTopic: { code: { in: topics } } },
      { primaryTopic: { examArea: { in: topics } } },
    ];
  }
  const modeTypes: Record<string, string[]> = {
    subnetting_practice: ['subnetting', 'ipv4_calculation'],
    command_practice: ['ios_commands', 'router_config', 'switch_config'],
    troubleshooting_practice: ['troubleshooting', 'routing_table', 'topology_analysis'],
  };
  if (modeTypes[mode]) where.questionType = { in: modeTypes[mode] };
  if (mode === 'incorrect_review') {
    where.examQuestions = { some: {
      exam: { userId, status: { in: ['completed', 'expired'] } },
      responses: { some: { isCorrect: false } },
    } };
  }
  const candidates = await prisma.question.findMany({
    where,
    select: { id: true, questionFamilyId: true, primaryTopic: { select: { examArea: true } } },
    orderBy: { id: 'asc' },
  });
  const families = new Set<string>();
  const eligible = (randomize ? shuffleArray(candidates) : candidates).filter(q => {
    const family = q.questionFamilyId || q.id;
    if (families.has(family)) return false;
    families.add(family);
    return true;
  });
  return eligible;
}

export async function getExamAvailability(config: ExamConfig, userId?: string) {
  return { available: (await findEligibleQuestions(config, userId)).length };
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

  if (config.untimed && config.perQuestionTimeLimit !== undefined) {
    throw new AppError(400, 'Untimed study cannot use a per-question time limit.');
  }
  if (config.untimed && (!studyMode || strictMode)) {
    throw new AppError(400, 'Untimed practice requires study mode without strict mode.');
  }
  if (strictMode && studyMode) {
    throw new AppError(400, 'Strict mode and study mode cannot be enabled together.');
  }
  if (mode === 'incorrect_review' && !userId) {
    throw new AppError(401, 'Sign in to review your incorrect answers.');
  }
  if (mode === 'topic_practice' && topics.length === 0) {
    throw new AppError(400, 'Select at least one topic.');
  }

  const eligible = await findEligibleQuestions(config, userId);
  if (eligible.length < questionCount) {
    throw new AppError(400, `Only ${eligible.length} validated, distinct question families match these filters; requested ${questionCount}. Choose fewer questions or broaden the filters.`);
  }
  let selectedQuestionIds: string[] = [];
  if (mode === 'full_simulation') {
    const areas = Object.keys(EXAM_AREA_WEIGHTS) as ExamArea[];
    // Largest remainder allocation keeps the requested total, including short exams.
    const quotas = areas.map(area => ({ area, count: Math.floor(questionCount * EXAM_AREA_WEIGHTS[area] / 100), remainder: questionCount * EXAM_AREA_WEIGHTS[area] % 100 }));
    let extra = questionCount - quotas.reduce((sum, q) => sum + q.count, 0);
    for (const quota of [...quotas].sort((a, b) => b.remainder - a.remainder)) {
      if (extra-- > 0) quota.count++;
    }
    for (const quota of quotas) {
      selectedQuestionIds.push(...eligible.filter(q => q.primaryTopic.examArea === quota.area).slice(0, quota.count).map(q => q.id));
    }
    const selected = new Set(selectedQuestionIds);
    selectedQuestionIds.push(...eligible.filter(q => !selected.has(q.id)).slice(0, questionCount - selected.size).map(q => q.id));
  } else {
    selectedQuestionIds = eligible.slice(0, questionCount).map(q => q.id);
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
        settings: JSON.stringify(config),
        selectedTopics: topics ? JSON.stringify(topics) : null,
        status: 'configured',
        currentQuestionIdx: 0,
      },
    });

    const content = await tx.question.findMany({
      where: { id: { in: selectedQuestionIds }, validationStatus: 'validated' },
      include: { primaryTopic: true, source: true, options: { orderBy: { displayOrder: 'asc' } } },
    });
    if (content.length !== selectedQuestionIds.length) throw new AppError(409, 'Question eligibility changed. Configure the exam again.');
    const byId = new Map(content.map(q => [q.id, q]));
    await tx.examQuestion.createMany({
      data: selectedQuestionIds.map((qId, idx) => ({
        examId: newExam.id,
        questionId: qId,
        questionOrder: idx,
        contentSnapshot: captureQuestion(byId.get(qId)!),
        status: 'pending',
      })),
    });

    return newExam;
  });

  return getExamState(exam.id);
}

/** Changing topic creates another attempt; it never replaces the source question set. */
export async function createStudyTopicPractice(examId: string, topicId: string, questionCount: number, actorId?: string): Promise<ExamStateResponse> {
  await checkExpiry(examId);
  const source = await prisma.exam.findUnique({ where: { id: examId } });
  if (!source) throw new AppError(404, 'Exam not found.');
  if (source.userId && source.userId !== actorId) throw new AppError(403, 'Only the owner can change study topics.');
  if (!source.studyMode || source.strictMode || !['in_progress', 'completed'].includes(source.status)) throw new AppError(400, 'Changing topics requires an active or completed study attempt.');
  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 200) throw new AppError(400, 'Choose 1 to 200 questions.');
  if (!await prisma.topic.findUnique({ where: { id: topicId } })) throw new AppError(404, 'Topic not found.');
  const saved = source.settings ? JSON.parse(source.settings) : {};
  return createExam({
    questionCount, durationMinutes: source.durationMinutes, language: source.language as Language,
    mode: 'topic_practice', difficulty: source.difficulty as ExamConfig['difficulty'], topics: [topicId],
    randomize: true, strictMode: false, studyMode: true, untimed: saved.untimed ?? false,
    showExplanations: saved.showExplanations ?? true, soundEnabled: saved.soundEnabled ?? true,
    groupByTopic: false, ...(saved.perQuestionTimeLimit && !saved.untimed ? { perQuestionTimeLimit: saved.perQuestionTimeLimit } : {}),
    practiceSourceExamId: source.id,
  }, source.userId || undefined);
}

/** Start a separate one-question study attempt; never reset a recorded answer. */
export async function restartStudyExercise(examId: string, examQuestionId: string, actorId?: string): Promise<ExamStateResponse> {
  await checkExpiry(examId);
  const created = await prisma.$transaction(async tx => {
    const source = await tx.exam.findUnique({ where: { id: examId } });
    if (!source) throw new AppError(404, 'Exam not found.');
    if (source.userId && source.userId !== actorId) throw new AppError(403, 'Only the owner can restart this exercise.');
    if (!source.studyMode || source.strictMode || !['in_progress', 'completed'].includes(source.status)) {
      throw new AppError(400, 'Restart requires a study attempt without strict mode that is active or completed.');
    }
    const original = await tx.examQuestion.findFirst({
      where: { id: examQuestionId, examId },
      include: { question: { include: { primaryTopic: true, source: true, options: { orderBy: { displayOrder: 'asc' } } } } },
    });
    if (!original) throw new AppError(404, 'Question does not belong to this attempt.');
    if (original.status !== 'answered') throw new AppError(400, 'Confirm the exercise before restarting it.');
    const content = original.question;
    if (content.validationStatus !== 'validated' || content.examVersion !== source.examVersion) {
      throw new AppError(409, 'This question is no longer eligible. Choose another study exercise.');
    }
    const settings = source.settings ? JSON.parse(source.settings) : {};
    const practiceConfig: ExamConfig = {
      questionCount: 1, durationMinutes: source.durationMinutes, language: source.language as Language,
      mode: 'custom', difficulty: content.difficulty as ExamConfig['difficulty'], topics: [], randomize: false,
      strictMode: false, studyMode: true, untimed: true, showExplanations: settings.showExplanations ?? true,
      soundEnabled: settings.soundEnabled ?? true, groupByTopic: false, practiceSourceExamId: source.id,
    };
    return tx.exam.create({ data: {
      userId: source.userId, questionCount: 1, durationMinutes: source.durationMinutes,
      language: source.language, mode: 'custom', difficulty: content.difficulty, examVersion: source.examVersion,
      strictMode: false, studyMode: true, settings: JSON.stringify(practiceConfig), status: 'configured',
      questions: { create: { questionId: content.id, questionOrder: 0, status: 'pending', contentSnapshot: captureQuestion(content) } },
    } });
  });
  return getExamState(created.id);
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
  const settings = exam.settings ? JSON.parse(exam.settings) : {};
  const expiresAt = settings.untimed && exam.studyMode && !exam.strictMode ? null : new Date(startedAt.getTime() + exam.durationMinutes * 60 * 1000);

  await prisma.$transaction(async tx => {
    const started = await tx.exam.updateMany({
      where: { id: examId, status: 'configured' },
      data: { status: 'in_progress', startedAt, expiresAt },
    });
    if (started.count) await tx.examQuestion.updateMany({ where: { examId, questionOrder: 0, activatedAt: null }, data: { activatedAt: startedAt } });
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

  if (!exam || exam.status !== 'in_progress') {
    return false;
  }

  const now = new Date();
  if (exam.expiresAt && now >= exam.expiresAt) {
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
        completedAt: exam.expiresAt,
      },
    });

    // Score the exam
    await calculateResults(examId);
    return true;
  }

  if (exam.settings && JSON.parse(exam.settings).perQuestionTimeLimit) await expireCurrentQuestion(examId);
  return false;
}

function questionDeadline(exam: { settings: string | null; expiresAt: Date | null; startedAt: Date | null }, activatedAt: Date | null): Date | null {
  const seconds = exam.settings ? JSON.parse(exam.settings).perQuestionTimeLimit : undefined;
  if (!seconds || !activatedAt) return null;
  const deadline = activatedAt.getTime() + seconds * 1000;
  return new Date(exam.expiresAt ? Math.min(deadline, exam.expiresAt.getTime()) : deadline);
}

/** Only the active question expires offline; unpresented questions get a fresh interval on recovery. */
async function expireCurrentQuestion(examId: string) {
  const completed = await prisma.$transaction(async tx => {
    const exam = await tx.exam.findUnique({ where: { id: examId } });
    if (!exam || exam.status !== 'in_progress' || !exam.settings || !JSON.parse(exam.settings).perQuestionTimeLimit) return false;
    const current = await tx.examQuestion.findUnique({ where: { examId_questionOrder: { examId, questionOrder: exam.currentQuestionIdx } } });
    if (!current || current.status !== 'pending') return false;
    const now = new Date();
    if (exam.expiresAt && now >= exam.expiresAt) return 'overall-expired' as const;
    if (!current.activatedAt) {
      await tx.examQuestion.updateMany({ where: { id: current.id, activatedAt: null }, data: { activatedAt: now } });
      return false;
    }
    const deadline = questionDeadline(exam, current.activatedAt);
    if (!deadline || now < deadline) return false;
    const next = exam.currentQuestionIdx + 1, last = next >= exam.questionCount;
    const advanced = await tx.exam.updateMany({
      where: { id: examId, status: 'in_progress', currentQuestionIdx: exam.currentQuestionIdx },
      data: { currentQuestionIdx: next, ...(last ? { status: 'completed', completedAt: now } : {}) },
    });
    if (!advanced.count) return false;
    await tx.examQuestion.update({ where: { id: current.id }, data: {
      status: 'timed_out', answeredAt: now,
      timeSpentSeconds: Math.max(0, Math.floor((deadline.getTime() - current.activatedAt.getTime()) / 1000)),
    } });
    if (!last) await tx.examQuestion.updateMany({ where: { examId, questionOrder: next, activatedAt: null }, data: { activatedAt: now } });
    return last;
  });
  if (completed === 'overall-expired') { await checkExpiry(examId); return; }
  if (completed) await calculateResults(examId);
}

export async function getCurrentQuestion(examId: string, requestedIndex?: number): Promise<ExamQuestionView> {
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

  const index = requestedIndex ?? exam.currentQuestionIdx;
  if (!Number.isInteger(index) || index < 0 || index >= exam.questionCount) {
    throw new AppError(400, 'Invalid question index.');
  }
  if (index !== exam.currentQuestionIdx && (!exam.studyMode || exam.strictMode || index > exam.currentQuestionIdx)) {
    throw new AppError(403, 'Only the current question is accessible in exam mode.');
  }
  const examQuestion = await prisma.examQuestion.findUnique({
    where: {
      examId_questionOrder: {
        examId,
        questionOrder: index,
      },
    },
    include: { responses: true, question: { include: { options: true, primaryTopic: true } } },
  });

  if (!examQuestion) {
    throw new AppError(404, `No question found at index ${exam.currentQuestionIdx}.`);
  }

  const content = storedQuestion(examQuestion);
  const view = formatExamQuestion(
    content,
    exam.language as Language,
    examQuestion.id,
    index + 1,
    exam.questionCount
  );
  if (exam.studyMode && !exam.strictMode && examQuestion.status !== 'pending') {
    const selected = examQuestion.responses.map(r => r.selectedOptionId);
    const correct = content.options.filter(o => o.isCorrect).map(o => o.id);
    view.selectedOptionIds = selected;
    view.feedback = {
      confirmed: true,
      nextQuestionIndex: index + 1,
      isCorrect: selected.length === correct.length && correct.every(id => selected.includes(id)),
      correctOptionIds: correct,
      explanation: revealStudyExplanations(exam)
        ? (exam.language === 'es' ? content.explanationEs || content.correctAnswerExplanationEs : content.explanationEn || content.correctAnswerExplanationEn) || undefined
        : undefined,
    };
  }
  return view;
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
  if ((exam.strictMode || (exam.settings && JSON.parse(exam.settings).perQuestionTimeLimit)) && examQuestion.questionOrder !== exam.currentQuestionIdx) {
    throw new AppError(
      400,
      `Strict mode violation: question ${examQuestion.questionOrder + 1} does not match current index ${exam.currentQuestionIdx + 1}.`
    );
  }

  if (examQuestion.status !== 'pending') {
    throw new AppError(409, 'This answer has already been confirmed.');
  }
  const q = storedQuestion(examQuestion);
  if (new Set(selectedOptionIds).size !== selectedOptionIds.length) {
    throw new AppError(400, 'Duplicate options are not allowed.');
  }
  if (selectedOptionIds.some(id => !q.options.some(option => option.id === id))) {
    throw new AppError(400, 'Selected option does not belong to this question.');
  }
  const requiredCount = q.questionType === 'multiple_choice' ? q.multipleAnswerCount : 1;
  if (!requiredCount || (selectedOptionIds.length !== requiredCount && (exam.strictMode || selectedOptionIds.length > 0))) {
    throw new AppError(400, `Select exactly ${requiredCount || 1} option(s).`);
  }
  const now = new Date();
  const deadline = questionDeadline(exam, examQuestion.activatedAt);
  if (deadline && now >= deadline) { await expireCurrentQuestion(examId); throw new AppError(409, 'Question time expired. Reload your session.'); }
  const nextQuestionIndex = exam.currentQuestionIdx + 1;
  const isLastQuestion = nextQuestionIndex >= exam.questionCount;

  // Compare-and-set the exam cursor and claim the question in the same transaction.
  // Concurrent requests cannot overwrite a confirmed response or advance twice.
  await prisma.$transaction(async (tx) => {
    const advanced = await tx.exam.updateMany({
      where: { id: examId, status: 'in_progress', currentQuestionIdx: exam.currentQuestionIdx, OR: [{ expiresAt: { gt: now } }, { expiresAt: null }] },
      data: {
        currentQuestionIdx: nextQuestionIndex,
        ...(isLastQuestion ? { status: 'completed', completedAt: now } : {}),
      },
    });
    if (advanced.count !== 1) throw new AppError(409, 'Exam state changed. Reload your session.');
    const previous = await tx.examQuestion.findFirst({
      where: { examId, questionOrder: exam.currentQuestionIdx - 1 },
      select: { answeredAt: true },
    });
    const since = previous?.answeredAt || exam.startedAt || now;
    const claimed = await tx.examQuestion.updateMany({
      where: { id: examQuestionId, status: 'pending', ...(deadline ? { activatedAt: examQuestion.activatedAt } : {}) },
      data: {
        status: selectedOptionIds.length ? 'answered' : 'skipped',
        answeredAt: now,
        timeSpentSeconds: Math.max(0, Math.floor((now.getTime() - since.getTime()) / 1000)),
      },
    });
    if (claimed.count !== 1) throw new AppError(409, 'This answer has already been confirmed.');
    if (deadline && new Date() >= deadline) throw new AppError(409, 'Question time expired. Reload your session.');
    if (!isLastQuestion) await tx.examQuestion.updateMany({ where: { examId, questionOrder: nextQuestionIndex, activatedAt: null }, data: { activatedAt: now } });
    if (selectedOptionIds.length) await tx.examResponse.createMany({
      data: selectedOptionIds.map(selectedOptionId => ({ examQuestionId, selectedOptionId, confirmedAt: now })),
    });
  });
  if (isLastQuestion) await calculateResults(examId);
  const timing = deadline ? { questionExpiresAt: isLastQuestion ? null : questionDeadline(exam, now)?.toISOString() || null } : {};

  // Study mode feedback: reveal explanation and correctness
  if (exam.studyMode && !exam.strictMode) {
    const q = storedQuestion(examQuestion);
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

    const explanation = !revealStudyExplanations(exam) ? undefined :
      exam.language === 'es'
        ? q.explanationEs || q.correctAnswerExplanationEs || undefined
        : q.explanationEn || q.correctAnswerExplanationEn || undefined;

    return {
      confirmed: true,
      nextQuestionIndex,
      ...timing,
      isCorrect,
      explanation,
      correctOptionIds,
    };
  }

  // STRICT / NORMAL EXAM MODE: NEVER send correct answers
  return {
    confirmed: true,
    nextQuestionIndex,
    ...timing,
  };
}

export async function completeExam(examId: string): Promise<ExamResultResponse> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  await checkExpiry(examId);
  const current = await prisma.exam.findUniqueOrThrow({ where: { id: examId } });
  if (current.status === 'configured') throw new AppError(400, 'Start the exam before completing it.');
  if (!['completed', 'expired'].includes(current.status)) {
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
          questionOrder: true,
          activatedAt: true,
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

  const savedSettings = exam.settings ? JSON.parse(exam.settings) : {};
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
    ...savedSettings,
  };

  const now = Date.now();
  const timeRemainingSeconds = exam.expiresAt
    ? Math.max(0, Math.floor((exam.expiresAt.getTime() - now) / 1000))
    : exam.durationMinutes * 60;

  const answeredCount = exam.questions.filter((q) => q.status === 'answered').length;

  return {
    examId: exam.id,
    questionExpiresAt: exam.status === 'in_progress' ? questionDeadline(exam, exam.questions.find(q => q.questionOrder === exam.currentQuestionIdx)?.activatedAt || null)?.toISOString() || null : null,
    config,
    currentQuestionIndex: exam.currentQuestionIdx,
    totalQuestions: exam.questionCount,
    startedAt: exam.startedAt ? exam.startedAt.toISOString() : exam.createdAt.toISOString(),
    expiresAt: exam.expiresAt ? exam.expiresAt.toISOString() : null,
    timeRemainingSeconds,
    answeredCount,
    status: exam.status as any,
  };
}
