import { Router, Request, Response, NextFunction } from 'express';
import { ApiResponse, TopicWithCount, ExamArea } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/topics
 * List all CCNA 200-301 topics with question counts and validated counts
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topics = await prisma.topic.findMany({
        orderBy: [{ examAreaNumber: 'asc' }, { code: 'asc' }],
        include: {
          _count: {
            select: { questions: true },
          },
          questions: {
            where: { validationStatus: 'validated' },
            select: { id: true },
          },
        },
      });

      const topicsWithCount: TopicWithCount[] = topics.map((t) => ({
        id: t.id,
        nameEn: t.nameEn,
        nameEs: t.nameEs,
        examArea: t.examArea as ExamArea,
        examAreaNumber: t.examAreaNumber,
        weightPercentage: t.weightPercentage,
        questionCount: t._count.questions,
        validatedCount: t.questions.length,
      }));

      const response: ApiResponse<TopicWithCount[]> = {
        success: true,
        data: topicsWithCount,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/topics/:id
 * Get topic detail by ID or code
 */
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topic = await prisma.topic.findFirst({
        where: {
          OR: [{ id: req.params.id }, { code: req.params.id }],
        },
        include: {
          parentTopic: true,
          childTopics: {
            orderBy: { code: 'asc' },
          },
          _count: {
            select: { questions: true },
          },
        },
      });

      if (!topic) {
        throw new AppError(404, `Topic with identifier "${req.params.id}" not found.`);
      }

      let learningObjectives: string[] = [];
      if (topic.learningObjectives) {
        try {
          learningObjectives = JSON.parse(topic.learningObjectives);
        } catch {
          learningObjectives = [];
        }
      }

      const response: ApiResponse<typeof topic & { learningObjectives: string[] }> = {
        success: true,
        data: {
          ...topic,
          learningObjectives,
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
