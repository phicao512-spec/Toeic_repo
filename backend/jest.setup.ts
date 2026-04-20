process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.PORT = process.env.PORT ?? '4000';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://toeic_user:toeic_pass@localhost:5432/toeic_learning';
process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test-jwt-secret-with-at-least-32-characters';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret-with-at-least-32chars';
process.env.JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY ?? '15m';
process.env.JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY ?? '7d';
process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES =
  process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES ?? '15';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';