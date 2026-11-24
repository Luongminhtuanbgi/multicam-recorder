import cors from 'cors';
import express, { Router, type Express } from 'express';
import helmet from 'helmet';
import { httpLogger } from './common/logger';
import { errorHandler } from './common/middlewares/errorHandler';
import {
  createApiNotFoundHandler,
  rootNotFoundHandler,
} from './common/middlewares/notFoundHandler';
import { env } from './config/env';
import { healthRouter } from './modules/health/health.routes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  if (env.NODE_ENV !== 'production') {
    app.use(cors());
  }

  app.use(httpLogger);
  app.use(express.json({ limit: '1mb' }));

  const apiRouter = Router();
  apiRouter.use('/health', healthRouter);
  apiRouter.use(createApiNotFoundHandler(apiRouter));

  app.use('/api', apiRouter);

  app.use(rootNotFoundHandler);
  app.use(errorHandler);

  return app;
}
