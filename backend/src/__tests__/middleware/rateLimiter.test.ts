import express from 'express';
import request from 'supertest';
import {
  AUTH_RATE_LIMIT_MAX,
  GENERAL_RATE_LIMIT_MAX,
  authRateLimiter,
} from '../../middleware/rateLimiter';

describe('rate limiter', () => {
  it('exposes expected limits', () => {
    expect(AUTH_RATE_LIMIT_MAX).toBe(5);
    expect(GENERAL_RATE_LIMIT_MAX).toBe(100);
  });

  it('limits auth requests after threshold', async () => {
    const app = express();
    app.use(express.json());
    app.post('/limited', authRateLimiter, (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const limiter = authRateLimiter as unknown as { resetKey?: (key: string) => void };
    limiter.resetKey?.('::ffff:127.0.0.1');
    limiter.resetKey?.('127.0.0.1');

    for (let index = 0; index < AUTH_RATE_LIMIT_MAX; index += 1) {
      await request(app).post('/limited').send({ email: 'user@example.com' }).expect(200);
    }

    const response = await request(app)
      .post('/limited')
      .send({ email: 'user@example.com' })
      .expect(429);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('RATE_LIMITED');
  });
});