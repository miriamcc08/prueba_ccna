import { storedQuestion } from '../lib/examSnapshot';
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import {
  ApiResponse,
  LearningProfile,
  WeakAreaItem,
  RepeatedErrorItem,
  ProgressMetrics,
  StudyPlanItem,
  ExamArea,
  EXAM_AREA_LABELS,
  Difficulty,
} from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { registerUserSchema, loginUserSchema } from '../validators/schemas';
import { requireAuth, generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/users/register
 * Register a new user account
 */
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password, language } = registerUserSchema.parse(req.body);

      // Check existing email
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (existingEmail) {
        throw new AppError(409, 'An account with this email address already exists.');
      }

      // Check existing username
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        throw new AppError(409, 'This username is already taken.');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username,
          passwordHash,
          language: language || 'en',
          role: 'user',
        },
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        language: user.language,
      });

      const response: ApiResponse<{
        user: { id: string; email: string; username: string; role: string; language: string };
        token: string;
      }> = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            language: user.language,
          },
          token,
        },
        message: 'Registration successful.',
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/users/login
 * Authenticate existing user
 */
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: email.toLowerCase() }, { username: email }],
        },
      });

      if (!user) {
        throw new AppError(401, 'Invalid email or password.');
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError(401, 'Invalid email or password.');
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        language: user.language,
      });

      const response: ApiResponse<{
        user: { id: string; email: string; username: string; role: string; language: string };
        token: string;
      }> = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            language: user.language,
          },
          token,
        },
        message: 'Login successful.',
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get(
  '/me',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found.');
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        data: user,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/users/me/learning-profile
 * Get adaptive learning analytics and tailored study plan
 */
router.get(
  '/me/learning-profile',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const isEs = (req.query.language || req.user!.language) === 'es';
      const slowTopics = new Set<string>();
      const topicAreas = new Map<string, string>();

      // 1. Fetch user's completed exams
      const completedExams = await prisma.exam.findMany({
        where: {
          userId,
          status: { in: ['completed', 'expired'] },
        },
        include: {
          questions: {
            include: {
              question: {
                include: {
                  primaryTopic: true,
                },
              },
              responses: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const totalExams = completedExams.length;
      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalScoreSum = 0;
      let bestScore = 0;

      const areaStats = new Map<
        ExamArea,
        { area: ExamArea; total: number; correct: number; scores: number[] }
      >();

      const topicErrors = new Map<
        string,
        { topicId: string; topicName: string; errorCount: number; lastSeen: Date }
      >();

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      let examsTaken7Days = 0;
      const accuracyTrend: number[] = [];

      // Iterate through exams (most recent first)
      for (const exam of completedExams) {
        if (exam.createdAt >= sevenDaysAgo) {
          examsTaken7Days++;
        }

        const examScore = exam.score || 300;
        totalScoreSum += examScore;
        if (examScore > bestScore) {
          bestScore = examScore;
        }

        let examCorrect = 0;
        let examTotal = 0;

        for (const eq of exam.questions) {
          const q = storedQuestion(eq);
          const area = q.primaryTopic.examArea as ExamArea;
          topicAreas.set(q.primaryTopic.id, area);
          if ((eq.timeSpentSeconds || 0) > q.estimatedTimeSeconds * 1.5) slowTopics.add(isEs ? q.primaryTopic.nameEs : q.primaryTopic.nameEn);
          totalQuestions++;
          examTotal++;

          if (!areaStats.has(area)) {
            areaStats.set(area, { area, total: 0, correct: 0, scores: [] });
          }
          const aStat = areaStats.get(area)!;
          aStat.total++;

          // Check if question was answered correctly
          const isCorrect = eq.responses.length > 0 && eq.responses.every((r) => r.isCorrect);

          if (isCorrect) {
            totalCorrect++;
            examCorrect++;
            aStat.correct++;
          } else {
            // Track error on topic
            const tId = q.primaryTopic.id;
            const cur = topicErrors.get(tId) || {
              topicId: tId,
              topicName: isEs ? q.primaryTopic.nameEs : q.primaryTopic.nameEn,
              errorCount: 0,
              lastSeen: eq.answeredAt || exam.createdAt,
            };
            cur.errorCount++;
            if ((eq.answeredAt || exam.createdAt) > cur.lastSeen) {
              cur.lastSeen = eq.answeredAt || exam.createdAt;
            }
            topicErrors.set(tId, cur);
          }
        }

        if (examTotal > 0) {
          accuracyTrend.unshift(Math.round((examCorrect / examTotal) * 100));
        }
      }

      // Weak areas
      const weakAreas: WeakAreaItem[] = [];
      const areas: ExamArea[] = [
        'network_fundamentals',
        'network_access',
        'ip_connectivity',
        'ip_services',
        'security_fundamentals',
        'automation_programmability',
      ];

      for (const area of areas) {
        const stat = areaStats.get(area);
        const total = stat?.total || 0;
        const correct = stat?.correct || 0;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        const areaLabel = EXAM_AREA_LABELS[area]?.[isEs ? 'es' : 'en'] || area;

        weakAreas.push({
          area,
          areaName: areaLabel,
          accuracy,
          totalAttempted: total,
          trend: 'stable', // No change is inferred from a single aggregate percentage.
        });
      }

      // Repeated errors
      const repeatedErrors: RepeatedErrorItem[] = Array.from(topicErrors.values())
        .filter((e) => e.errorCount >= 2)
        .sort((a, b) => b.errorCount - a.errorCount)
        .slice(0, 5)
        .map((e) => ({
          topicId: e.topicId,
          topicName: e.topicName,
          errorCount: e.errorCount,
          lastSeen: e.lastSeen.toISOString(),
        }));

      // Study plan
      const studyPlan: StudyPlanItem[] = weakAreas
        .filter((w) => w.accuracy < 80 || w.totalAttempted === 0)
        .sort((a, b) => a.accuracy - b.accuracy)
        .map((w, idx) => ({
          area: w.area,
          areaName: w.areaName,
          priority: idx + 1,
          suggestedQuestionCount: 25,
          suggestedDifficulty: (w.accuracy < 50 ? 'basic' : 'intermediate') as Difficulty,
          focusTopics: repeatedErrors
            .filter(e => topicAreas.get(e.topicId) === w.area)
            .slice(0, 3)
            .map((e) => e.topicName),
          message:
            w.totalAttempted === 0
              ? (isEs ? `Aún no has practicado ${w.areaName}. Comienza con una sesión por tema.` : `You haven't practiced ${w.areaName} yet. Take a targeted practice exam.`)
              : (isEs ? `Tu precisión en ${w.areaName} es ${w.accuracy} %. Repasa los conceptos antes de otra sesión.` : `Accuracy in ${w.areaName} is currently ${w.accuracy}%. Targeted practice is recommended.`),
        }));

      const overallAccuracy =
        totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0;
      const averageScore = totalExams > 0 ? Math.round(totalScoreSum / totalExams) : 300;

      const overallProgress: ProgressMetrics = {
        totalExams,
        totalQuestions,
        overallAccuracy,
        averageScore,
        bestScore,
        examsTaken7Days,
        accuracyTrend: accuracyTrend.slice(-10), // last 10 exams
      };

      const learningProfile: LearningProfile = {
        userId,
        weakAreas,
        repeatedErrors,
        slowTopics: Array.from(slowTopics),
        overallProgress,
        studyPlan,
      };

      const response: ApiResponse<LearningProfile> = {
        success: true,
        data: learningProfile,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/users/me/history
 * Clear user's exam history
 */
router.delete(
  '/me/history',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      await prisma.exam.deleteMany({
        where: { userId },
      });

      const response: ApiResponse = {
        success: true,
        message: 'Exam history cleared successfully.',
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

router.get('/me/favorites', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const favorites = await prisma.questionFavorite.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, select: { questionId: true } });
    res.json({ success: true, data: favorites.map(f => f.questionId) });
  } catch (error) { next(error); }
});
