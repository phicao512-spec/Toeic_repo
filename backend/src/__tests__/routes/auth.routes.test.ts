import request from 'supertest';
import { app } from '../../app';
import { authService } from '../../services/auth.service';
import { AppError } from '../../utils/errors';
import { authRateLimiter, AUTH_RATE_LIMIT_MAX } from '../../middleware/rateLimiter';

jest.mock('../../services/auth.service', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const limiter = authRateLimiter as unknown as { resetKey?: (key: string) => void };
    limiter.resetKey?.('::ffff:127.0.0.1');
    limiter.resetKey?.('127.0.0.1');

    (authService.forgotPassword as jest.Mock).mockResolvedValue(undefined);
  });

  it('registers user successfully', async () => {
    (authService.register as jest.Mock).mockResolvedValue({
      user: { id: 'user_1', name: 'User', email: 'user@example.com' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User',
        email: 'user@example.com',
        password: 'secure-password-123',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBe('access-token');
  });

  it('returns conflict for duplicate email register', async () => {
    (authService.register as jest.Mock).mockRejectedValue(
      new AppError(409, 'CONFLICT', 'Email already in use'),
    );

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User',
        email: 'user@example.com',
        password: 'secure-password-123',
      })
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('CONFLICT');
  });

  it('returns unauthorized for wrong login credentials', async () => {
    (authService.login as jest.Mock).mockRejectedValue(
      new AppError(401, 'UNAUTHORIZED', 'Invalid email or password'),
    );

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrong-password',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns unauthorized for invalid refresh token', async () => {
    (authService.refreshTokens as jest.Mock).mockRejectedValue(
      new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token'),
    );

    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns safe message for forgot password endpoint', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'unknown@example.com' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toContain('If the account exists');
  });

  it('returns unauthorized for invalid reset token', async () => {
    (authService.resetPassword as jest.Mock).mockRejectedValue(
      new AppError(401, 'UNAUTHORIZED', 'Invalid or expired reset token'),
    );

    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalid-token', newPassword: 'new-password-123' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('enforces auth rate limit', async () => {
    for (let index = 0; index < AUTH_RATE_LIMIT_MAX; index += 1) {
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: `user${index}@example.com` })
        .expect(200);
    }

    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'overflow@example.com' })
      .expect(429);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('RATE_LIMITED');
  });
});