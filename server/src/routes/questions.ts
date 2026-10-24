import { Router, Request, Response, NextFunction } from 'express';
import { ApiResponse, QuestionListItem, QuestionDetail, ImportResult } from '../../../shared/types';
import * as questionService from '../services/questionService';
import {
  questionFilterSchema,
  createQuestionSchema,
  updateQuestionSchema,
  importQuestionsSchema,
} from '../validators/schemas';
import { requireAuth, requireAdmin } from '../middleware/auth';
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = questionFilterSchema.parse(req.query);
      const result = await questionService.getQuestions(filters);

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
