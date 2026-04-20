import { Role } from '@prisma/client';
import { authService } from '../../services/auth.service';
import { hashPassword } from '../../utils/hash';
import { emailService } from '../../services/email.service';
import { prisma } from '../../config/database';

jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../../config/redis', () => ({
  getRedisClient: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../services/email.service', () => ({
  emailService: {
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns conflict for duplicate email on register', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user_1' });

    await expect(
      authService.register({
        name: 'User',
        email: 'user@example.com',
        password: 'secure-password-123',
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: 'CONFLICT',
    });
  });

  it('returns unauthorized for wrong login password', async () => {
    const passwordHash = await hashPassword('correct-password');

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user_1',
      email: 'user@example.com',
      name: 'User',
      password: passwordHash,
      avatar: null,
      role: Role.STUDENT,
      targetScore: 600,
    });

    await expect(
      authService.login({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  });

  it('returns unauthorized for invalid refresh token', async () => {
    await expect(
      authService.refreshTokens({
        refreshToken: 'invalid-token',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  });

  it('does not reveal account existence in forgot password', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.forgotPassword({
        email: 'unknown@example.com',
      }),
    ).resolves.toBeUndefined();

    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('returns unauthorized when reset token is invalid', async () => {
    await expect(
      authService.resetPassword({
        token: 'missing-token',
        newPassword: 'new-password-123',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  });
});