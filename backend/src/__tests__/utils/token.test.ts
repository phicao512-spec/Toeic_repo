import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/token';

describe('token utilities', () => {
  const payload = {
    userId: 'user_123',
    email: 'user@example.com',
    role: 'STUDENT' as const,
  };

  it('creates and validates access token', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.tokenType).toBe('access');
  });

  it('creates and validates refresh token', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyRefreshToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.tokenType).toBe('refresh');
  });
});