import { parseEnv } from '../../config/env';

describe('parseEnv', () => {
  const baseEnv = {
    NODE_ENV: 'test',
    PORT: '4000',
    DATABASE_URL: 'postgresql://toeic_user:toeic_pass@localhost:5432/toeic_learning',
    REDIS_URL: 'redis://localhost:6379',
    JWT_SECRET: 'jwt-secret-with-at-least-32-characters',
    JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32chars',
    JWT_ACCESS_EXPIRY: '15m',
    JWT_REFRESH_EXPIRY: '7d',
    RESET_PASSWORD_TOKEN_EXPIRY_MINUTES: '15',
    CORS_ORIGIN: 'http://localhost:3000',
    APP_URL: 'http://localhost:3000',
  };

  it('parses valid values', () => {
    const parsed = parseEnv(baseEnv);
    expect(parsed.PORT).toBe(4000);
    expect(parsed.NODE_ENV).toBe('test');
    expect(parsed.MINIO_BUCKET).toBe('toeic-assets');
  });

  it('throws when jwt secret is too short', () => {
    expect(() =>
      parseEnv({
        ...baseEnv,
        JWT_SECRET: 'short',
      }),
    ).toThrow('Invalid environment configuration');
  });
});