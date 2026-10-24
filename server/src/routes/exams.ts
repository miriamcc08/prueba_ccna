import { Router, Request, Response, NextFunction } from 'express';
import {
  ApiResponse,
  ExamStateResponse,
  ExamQuestionView,
  SubmitAnswerResponse,
  ExamResultResponse,
  ReviewQuestionItem,
  ExamHistoryItem,
} from '../../../shared/types';
import * as examEngine from '../services/examEngine';
import * as scoringEngine from '../services/scoringEngine';
import { createExamSchema, submitAnswerSchema } from '../validators/schemas';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/exams/history
 * Get user exam history (Must be registered before /:id)
 */
router.get(
  '/history',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      const exams = await prisma.exam.findMany({
        where: {
          userId,
          status: { in: ['completed', 'expired'] },
        },
        orderBy: { createdAt: 'desc' },
      });

      const historyItems: ExamHistoryItem[] = [];

      for (const e of exams) {
        // Calculate or retrieve topic breakdown
        const results = await scoringEngine.calculateResults(e.id);
        historyItems.push({
          examId: e.id,
          date: e.createdAt.toISOString(),
          language: e.language as any,
          mode: e.mode as any,
          difficulty: e.difficulty as any,
          questionCount: e.questionCount,
          durationMinutes: e.durationMinutes,
          totalTimeSeconds: e.totalTimeSeconds || 0,
          score: e.score || 300,
          percentage: e.percentage || 0,
          correctCount: e.correctCount || 0,
          incorrectCount: e.incorrectCount || 0,
          topicBreakdown: results.topicBreakdown,
        });
      }

      const response: ApiResponse<ExamHistoryItem[]> = {
        success: true,
        data: historyItems,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/exams
 * Create a new exam from configuration
 */
router.post(
  '/',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = createExamSchema.parse(req.body);
      const userId = req.user?.id;

      const state = await examEngine.createExam(config, userId);

      const response: ApiResponse<ExamStateResponse> = {
        success: true,
        data: state,
        message: 'Exam configured successfully.',
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/exams/:id
 * Get current exam state and time remaining
 */
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const state = await examEngine.getExamState(req.params.id);
      const response: ApiResponse<ExamStateResponse> = {
        success: true,
        data: state,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/exams/:id/start
 * Start the exam timer
 */
router.post(
  '/:id/start',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const state = await examEngine.startExam(req.params.id);
      const response: ApiResponse<ExamStateResponse> = {
        success: true,
        data: state,
        message: 'Exam started.',
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/exams/:id/question
 * Get current exam question (strict: no answers revealed)
 */
router.get(
  '/:id/question',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const question = await examEngine.getCurrentQuestion(req.params.id);
      const response: ApiResponse<ExamQuestionView> = {
        success: true,
        data: question,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/exams/:id/answer
 * Submit answer for the current question
 */
router.post(
  '/:id/answer',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { examQuestionId, selectedOptionIds } = submitAnswerSchema.parse(req.body);

      const result = await examEngine.submitAnswer(
        req.params.id,
        examQuestionId,
        selectedOptionIds
      );

      const response: ApiResponse<SubmitAnswerResponse> = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/exams/:id/complete
 * Manually end and score the exam
 */
router.post(
  '/:id/complete',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await examEngine.completeExam(req.params.id);
      const response: ApiResponse<ExamResultResponse> = {
        success: true,
        data: results,
        message: 'Exam completed.',
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/exams/:id/results
 * Get computed results for a completed exam
 */
router.get(
  '/:id/results',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await scoringEngine.calculateResults(req.params.id);
      const response: ApiResponse<ExamResultResponse> = {
        success: true,
        data: results,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/exams/:id/review
 * Review all questions, user answers, correct answers, and full explanations
 */
router.get(
  '/:id/review',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await prisma.exam.findUnique({
        where: { id: req.params.id },
      });

      if (!exam) {
        throw new AppError(404, `Exam "${req.params.id}" not found.`);
      }

      // In strict mode, only allow review after exam is finished
      if (exam.strictMode && exam.status === 'in_progress') {
        throw new AppError(403, 'Review is only available after completing the exam.');
      }

      const review = await scoringEngine.getExamReview(req.params.id);
      const response: ApiResponse<ReviewQuestionItem[]> = {
        success: true,
        data: review,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
