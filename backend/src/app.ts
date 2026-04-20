import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import apiRoutes from './routes';
import { corsOptions } from './config/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(requestLogger);
  app.use(express.json({ limit: '1mb' }));

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();