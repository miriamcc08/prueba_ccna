import { storedQuestion } from '../lib/examSnapshot';
import { prisma } from '../lib/prisma';
import {
  ExamResultResponse,
  TopicResultItem,
  DifficultyResultItem,
  RecommendationItem,
  ReviewQuestionItem,
  ExamArea,
  EXAM_AREA_LABELS,
  Difficulty,
  Language,
  ExamMode,
} from '../../../shared/types';
import { AppError } from '../middleware/errorHandler';

const PASSING_PERCENTAGE = 82.5; // Simulator practice target, not a Cisco passing threshold.

export async function calculateResults(examId: string): Promise<ExamResultResponse> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: {
        orderBy: { questionOrder: 'asc' },
        include: {
          question: {
            include: {
              primaryTopic: true,
              options: true,
            },
          },
          responses: {
            include: {
              selectedOption: true,
            },
          },
        },
      },
    },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  if (!['completed', 'expired'].includes(exam.status)) {
    throw new AppError(403, 'Results are only available after completing the exam.');
  }

  const now = new Date();
  const startedAt = exam.startedAt || exam.createdAt;
  const completedAt = exam.completedAt || now;
  const totalTimeSeconds = Math.max(
    0,
    Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)
  );

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // Track per-topic and per-difficulty performance
  const topicStats = new Map<
    string,
    {
      topicId: string;
      topicName: string;
      examArea: ExamArea;
      total: number;
      correct: number;
      incorrect: number;
      unanswered: number;
    }
  >();

  const diffStats = new Map<
    Difficulty,
    {
      difficulty: Difficulty;
      total: number;
      correct: number;
    }
  >();

  // Process each exam question
  const responseUpdates: Array<{ id: string; isCorrect: boolean }> = [];

  for (const eq of exam.questions) {
    const q = storedQuestion(eq);
    const topic = q.primaryTopic;
    const diff = q.difficulty as Difficulty;
    const examArea = topic.examArea as ExamArea;

    // Init topic stats if not present
    if (!topicStats.has(topic.id)) {
      topicStats.set(topic.id, {
        topicId: topic.id,
        topicName: exam.language === 'es' ? topic.nameEs : topic.nameEn,
        examArea,
        total: 0,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      });
    }

    // Init difficulty stats
    if (!diffStats.has(diff)) {
      diffStats.set(diff, {
        difficulty: diff,
        total: 0,
        correct: 0,
      });
    }

    const tStat = topicStats.get(topic.id)!;
    const dStat = diffStats.get(diff)!;

    tStat.total++;
    dStat.total++;

    const correctOptionIds = new Set(
      q.options.filter((o) => o.isCorrect).map((o) => o.id)
    );
    const userSelectedOptionIds = new Set(
      eq.responses.map((r) => r.selectedOptionId)
    );

    // Evaluate response
    if (eq.responses.length === 0) {
      unansweredCount++;
      tStat.unanswered++;
    } else {
      // Check for exact match: all correct chosen, no incorrect chosen
      let isExactMatch = true;

      // Every correct option must be selected
      for (const cId of correctOptionIds) {
        if (!userSelectedOptionIds.has(cId)) {
          isExactMatch = false;
          break;
        }
      }

      // Every selected option must be correct
      if (isExactMatch) {
        for (const sId of userSelectedOptionIds) {
          if (!correctOptionIds.has(sId)) {
            isExactMatch = false;
            break;
          }
        }
      }

      if (isExactMatch) {
        correctCount++;
        tStat.correct++;
        dStat.correct++;
      } else {
        incorrectCount++;
        tStat.incorrect++;
      }

      // Record correctness for each individual response option selected
      for (const resp of eq.responses) {
        responseUpdates.push({
          id: resp.id,
          isCorrect: isExactMatch,
        });
      }
    }
  }

  // Update responses in database
  if (responseUpdates.length > 0) {
    await prisma.$transaction(
      responseUpdates.map((ru) =>
        prisma.examResponse.update({
          where: { id: ru.id },
          data: { isCorrect: ru.isCorrect },
        })
      )
    );
  }

  const totalQuestions = exam.questions.length || exam.questionCount;
  const percentage = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 1000) / 10
    : 0;
  
  // Internal simulator scale only; it does not predict an official Cisco score.
  const score = totalQuestions > 0
    ? Math.round(300 + (correctCount / totalQuestions) * 700)
    : 300;

  const passed = percentage >= PASSING_PERCENTAGE;
  const averageTimePerQuestion = totalQuestions > 0
    ? Math.round(totalTimeSeconds / totalQuestions)
    : 0;

  // Build topic breakdown
  const topicBreakdown: TopicResultItem[] = Array.from(topicStats.values()).map(
    (item) => ({
      ...item,
      percentage: item.total > 0
        ? Math.round((item.correct / item.total) * 1000) / 10
        : 0,
    })
  );

  // Build difficulty breakdown
  const difficultyBreakdown: DifficultyResultItem[] = Array.from(
    diffStats.values()
  ).map((item) => ({
    ...item,
    percentage: item.total > 0
      ? Math.round((item.correct / item.total) * 1000) / 10
      : 0,
  }));

  // Build recommendations by area
  const areaAccuracy = new Map<ExamArea, { total: number; correct: number }>();
  for (const item of topicBreakdown) {
    const cur = areaAccuracy.get(item.examArea) || { total: 0, correct: 0 };
    cur.total += item.total;
    cur.correct += item.correct;
    areaAccuracy.set(item.examArea, cur);
  }

  const recommendations: RecommendationItem[] = [];

  for (const [area, data] of areaAccuracy.entries()) {
    const areaPct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    const areaLabel = EXAM_AREA_LABELS[area] || { en: area, es: area };
    const weakTopicsInArea = topicBreakdown
      .filter((t) => t.examArea === area && t.percentage < 75)
      .map((t) => t.topicName);

    if (areaPct < 70) {
      recommendations.push({
        area,
        areaName: exam.language === 'es' ? areaLabel.es : areaLabel.en,
        priority: 'high',
        message: `Needs improvement in ${areaLabel.en} (${Math.round(areaPct)}% accuracy). Focus on core concepts and hands-on practice.`,
        messageEs: `Necesita mejorar en ${areaLabel.es} (${Math.round(areaPct)}% de precisión). Concéntrese en conceptos fundamentales y práctica guiada.`,
        suggestedTopics: weakTopicsInArea,
      });
    } else if (areaPct < 85) {
      recommendations.push({
        area,
        areaName: exam.language === 'es' ? areaLabel.es : areaLabel.en,
        priority: 'medium',
        message: `Solid performance in ${areaLabel.en} (${Math.round(areaPct)}%), but review specific subtopics to ensure mastery.`,
        messageEs: `Buen desempeño en ${areaLabel.es} (${Math.round(areaPct)}%), pero revise subtemas específicos para alcanzar el dominio completo.`,
        suggestedTopics: weakTopicsInArea,
      });
    }
  }

  // Update exam record with final results
  await prisma.exam.update({
    where: { id: examId },
    data: {
      score,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      totalTimeSeconds,
      status: exam.status === 'in_progress' ? 'completed' : exam.status,
      completedAt,
    },
  });

  return {
    examId: exam.id,
    score,
    percentage,
    passed,
    passingPercentage: PASSING_PERCENTAGE,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalTimeSeconds,
    averageTimePerQuestion,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    language: exam.language as Language,
    mode: exam.mode as ExamMode,
    difficulty: exam.difficulty as Difficulty,
    topicBreakdown,
    difficultyBreakdown,
    recommendations,
  };
}

export async function getExamReview(examId: string): Promise<ReviewQuestionItem[]> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: {
        orderBy: { questionOrder: 'asc' },
        include: {
          question: {
            include: {
              primaryTopic: true,
              options: {
                orderBy: { displayOrder: 'asc' },
              },
            },
          },
          responses: {
            include: {
              selectedOption: true,
            },
          },
        },
      },
    },
  });

  if (!exam) {
    throw new AppError(404, `Exam "${examId}" not found.`);
  }

  if (!['completed', 'expired'].includes(exam.status)) {
    throw new AppError(403, 'Review is only available after completing the exam.');
  }

  const isEs = exam.language === 'es';

  return exam.questions.map((eq) => {
    const q = storedQuestion(eq);
    const selectedOptionIds = eq.responses.map((r) => r.selectedOptionId);
    const selectedOptions = q.options.filter((o) => selectedOptionIds.includes(o.id));
    const correctOptions = q.options.filter((o) => o.isCorrect);

    const correctOptionIds = correctOptions.map((o) => o.id);
    const selectedSet = new Set(selectedOptionIds);
    const correctSet = new Set(correctOptionIds);

    let isCorrect = selectedOptionIds.length > 0;
    for (const cId of correctOptionIds) {
      if (!selectedSet.has(cId)) isCorrect = false;
    }
    for (const sId of selectedOptionIds) {
      if (!correctSet.has(sId)) isCorrect = false;
    }

    return {
      historicalContentPreserved: !!eq.contentSnapshot,
      questionNumber: eq.questionOrder + 1,
      examQuestionId: eq.id,
      questionId: q.id,
      statement: isEs ? q.statementEs : q.statementEn,
      questionType: q.questionType as any,
      difficulty: q.difficulty as any,
      topicName: isEs ? q.primaryTopic.nameEs : q.primaryTopic.nameEn,
      selectedOptionIds,
      selectedOptionLabels: selectedOptions.map((o) => o.optionLabel),
      correctOptionIds,
      correctOptionLabels: correctOptions.map((o) => o.optionLabel),
      isCorrect,
      timeSpentSeconds: eq.timeSpentSeconds || 0,
      options: q.options.map((opt) => ({
        id: opt.id,
        label: opt.optionLabel,
        text: isEs ? opt.optionTextEs : opt.optionTextEn,
        isCorrect: opt.isCorrect,
        isSelected: selectedSet.has(opt.id),
        explanation: (isEs ? opt.explanationEs : opt.explanationEn) || undefined,
      })),
      explanation: (isEs ? q.explanationEs : q.explanationEn) || '',
      correctAnswerExplanation: (isEs ? q.correctAnswerExplanationEs : q.correctAnswerExplanationEn) || '',
    };
  });
}
