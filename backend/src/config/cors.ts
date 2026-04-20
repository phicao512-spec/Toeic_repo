import type { CorsOptions } from 'cors';
import { env } from './env';

const origins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (incomingOrigin, callback) => {
    if (!incomingOrigin || origins.includes('*') || origins.includes(incomingOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
};