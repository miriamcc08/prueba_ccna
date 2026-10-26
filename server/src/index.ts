import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import questionsRouter from './routes/questions';
import examsRouter from './routes/exams';
import topicsRouter from './routes/topics';
import usersRouter from './routes/users';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { allowedOrigin } from './lib/corsPolicy';
import { AppError } from './middleware/errorHandler';
import { ApiResponse } from '../../shared/types';
import { prisma } from './lib/prisma';

const app: Express = express();
const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(value => value.trim()).filter(Boolean);
if (process.env.NODE_ENV === 'production' && (!process.env.CORS_ORIGIN?.trim() || CORS_ORIGINS.includes('*'))) {
  throw new Error('Configure explicit CORS_ORIGIN values in production; wildcard origins are not allowed.');
}

// ---- Middleware ----
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigin(origin, CORS_ORIGINS, process.env.NODE_ENV === 'development')) callback(null, true);
      else callback(new AppError(403, 'Origin is not allowed.'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger in development
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ---- Health Check ----
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const response: ApiResponse<{ status: string; timestamp: string; db: string }> = {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        db: 'connected',
      },
    };
    res.json(response);
  } catch (err: unknown) {
    const response: ApiResponse<{ status: string; timestamp: string; db: string }> = {
      success: false,
      error: 'Database connection failed',
      data: {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        db: 'disconnected',
      },
    };
    res.status(503).json(response);
  }
});

// ---- API Routes ----
app.use('/api/questions', questionsRouter);
app.use('/api/exams', examsRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/users', usersRouter);

// ---- 404 Handler ----
app.use(notFoundHandler);

// ---- Global Error Handler ----
app.use(errorHandler);

// ---- Server Startup ----
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('='.repeat(55));
    console.log(` CCNA 200-301 Exam Simulator Server`);
    console.log(` Listening on: http://localhost:${PORT}`);
    console.log(` Environment:  ${process.env.NODE_ENV || 'development'}`);
    console.log(` API Base:     http://localhost:${PORT}/api`);
    console.log('='.repeat(55));
  });
}

export default app;
