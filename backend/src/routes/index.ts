import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import vocabRoutes from './vocab.routes';
import questionRoutes from './question.routes';
import testRoutes from './test.routes';
import progressRoutes from './progress.routes';
import { authRateLimiter, generalRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use('/health', generalRateLimiter, healthRoutes);
router.use('/auth', authRateLimiter, authRoutes);
router.use('/vocab', generalRateLimiter, vocabRoutes);
router.use('/questions', generalRateLimiter, questionRoutes);
router.use('/tests', generalRateLimiter, testRoutes);
router.use('/progress', generalRateLimiter, progressRoutes);

export default router;