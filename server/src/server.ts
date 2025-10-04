import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './routes/auth';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';
import { feedRouter } from './routes/feed';
import { errorHandler } from './utils/error';
import { createCorsOptions } from './utils/cors';
import { assetsRouter } from './routes/assets';
import { ensureSeed } from './seed';
import { previewRouter } from './routes/preview';

export const prisma = new PrismaClient();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export async function createServer() {
  // Ensure initial seed on first run
  await ensureSeed(prisma);

  const app = express();

  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: false // can be refined per deployment
    })
  );

  app.use(cors(createCorsOptions()));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ logger }));

  // Rate limit auth endpoints
  const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use('/api/auth', authLimiter);

  // Routers
  app.use('/api/auth', authRouter);
  app.use('/api', publicRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/preview', previewRouter);
  app.use('/', feedRouter);
  app.use('/uploads', assetsRouter);

  // Health check
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // Error handler
  app.use(errorHandler);

  return app;
}