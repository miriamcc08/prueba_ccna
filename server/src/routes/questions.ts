import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { Router, Request, Response, NextFunction } from 'express';
import { ApiResponse, QuestionListItem, QuestionDetail, ImportResult } from '../../../shared/types';
import * as questionService from '../services/questionService';
import {
  questionFilterSchema,
  createQuestionSchema,
  updateQuestionSchema,
  importQuestionsSchema,
} from '../validators/schemas';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth';
import {
  validateQuestionAnswers,
  validateSubnettingQuestion,
} from '../utils/networkValidators';

const router = Router();

/**
 * GET /api/questions/stats
 * Get question bank statistics
 */
router.get(
  '/stats',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await questionService.getQuestionStats();
      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/questions
 * List questions with filters and pagination
 */
router.get(
  '/',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = questionFilterSchema.parse(req.query);
      const result = await questionService.getQuestions(filters, req.user?.id);

      const response: ApiResponse<QuestionListItem[]> = {
        success: true,
        data: result.questions,
        pagination: result.pagination,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/questions/:id
 * Get full question details
 */
router.get(
  '/:id',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const question = await questionService.getQuestionById(req.params.id);
      const response: ApiResponse<QuestionDetail> = {
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
 * POST /api/questions
 * Create a new question (Admin only)
 */
router.post(
  '/',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = createQuestionSchema.parse(req.body);
      const created = await questionService.createQuestion(input);

      const response: ApiResponse<QuestionDetail> = {
        success: true,
        data: created,
        message: 'Question created successfully.',
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/questions/:id
 * Update an existing question (Admin only)
 */
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = updateQuestionSchema.parse(req.body);
      const updated = await questionService.updateQuestion(req.params.id, input);

      const response: ApiResponse<QuestionDetail> = {
        success: true,
        data: updated,
        message: 'Question updated successfully.',
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/questions/import
 * Batch import questions (Admin only)
 */
router.post(
  '/import',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { questions } = importQuestionsSchema.parse(req.body);
      const result = await questionService.importQuestions(questions);

      const response: ApiResponse<ImportResult> = {
        success: true,
        data: result,
        message: `Imported ${result.imported} questions (${result.rejected} rejected, ${result.duplicates} duplicates).`,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/questions/:id/validate
 * Run automated validation checks on a question (Admin only)
 */
router.post(
  '/:id/validate',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = await questionService.getQuestionById(req.params.id);

      const answerValidation = validateQuestionAnswers(
        {
          questionType: q.questionType,
          multipleAnswerCount: q.multipleAnswerCount,
          statementEn: q.statementEn,
          statementEs: q.statementEs,
        },
        q.options
      );

      const subnetValidation =
        q.questionType === 'subnetting' || q.questionType === 'ipv4_calculation'
          ? validateSubnettingQuestion({ statementEn: q.statementEn }, q.options)
          : null;

      const isValid = answerValidation.valid && (!subnetValidation || subnetValidation.valid);

      const response: ApiResponse<{
        valid: boolean;
        answerValidation: typeof answerValidation;
        subnetValidation: typeof subnetValidation;
      }> = {
        success: true,
        data: {
          valid: isValid,
          answerValidation,
          subnetValidation,
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

// Favorite operations derive ownership from authentication, never from the request body.
router.put('/:id/favorite', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!await prisma.question.findUnique({ where: { id: req.params.id } })) throw new AppError(404, 'Question not found.');
    await prisma.questionFavorite.upsert({
      where: { userId_questionId: { userId: req.user!.id, questionId: req.params.id } },
      create: { userId: req.user!.id, questionId: req.params.id }, update: {},
    });
    res.json({ success: true, data: { favorite: true } });
  } catch (error) { next(error); }
});
router.delete('/:id/favorite', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.questionFavorite.deleteMany({ where: { userId: req.user!.id, questionId: req.params.id } });
    res.json({ success: true, data: { favorite: false } });
  } catch (error) { next(error); }
});

const reviewSchema = z.object({
  status: z.enum(['draft', 'pending_review', 'validated', 'rejected']),
  notes: z.string().trim().min(20).max(10000),
  evidenceUrl: z.string().url().refine(url => new URL(url).protocol === 'https:').optional(),
  technicalReviewConfirmed: z.boolean().default(false),
});
router.post('/:id/review', requireAuth, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = reviewSchema.parse(req.body);
    await prisma.$transaction(async tx => {
      const q = await tx.question.findUnique({ where: { id: req.params.id }, include: { options: true } });
      if (!q) throw new AppError(404, 'Question not found.');
      if (input.status === 'validated') {
        const check = validateQuestionAnswers(q, q.options);
        if (!check.valid) throw new AppError(400, 'Structural validation failed.', check.errors);
        if (!input.evidenceUrl || !input.technicalReviewConfirmed) throw new AppError(400, 'Approval requires an HTTPS reference and explicit technical review confirmation.');
        if (!q.explanationEn?.trim() || !q.explanationEs?.trim() || !q.examVersion) throw new AppError(400, 'Approval requires bilingual explanations and an exam version.');
      }
      await tx.questionReview.create({ data: {
        questionId: q.id, reviewerId: req.user!.id, status: input.status, notes: input.notes, evidenceUrl: input.evidenceUrl,
      } });
      await tx.question.update({ where: { id: q.id }, data: {
        validationStatus: input.status, lastVerifiedAt: input.status === 'validated' ? new Date() : null,
      } });
    });
    res.json({ success: true, data: await questionService.getQuestionById(req.params.id) });
  } catch (error) { next(error); }
});
router.get('/:id/reviews', requireAuth, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.questionReview.findMany({
      where: { questionId: req.params.id }, orderBy: { createdAt: 'desc' },
      select: { id: true, questionId: true, reviewerId: true, status: true, notes: true, evidenceUrl: true, createdAt: true },
    });
    res.json({ success: true, data: reviews });
  } catch (error) { next(error); }
});

router.post('/:id/revisions', requireAuth, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const changes = updateQuestionSchema.parse(req.body);
    res.status(201).json({ success: true, data: await questionService.createQuestionRevision(req.params.id, changes, req.user!.id) });
  } catch (error) { next(error); }
});
