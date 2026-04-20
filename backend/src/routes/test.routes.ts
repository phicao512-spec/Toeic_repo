import { Router } from 'express';
import * as tc from '../controllers/test.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', tc.getAllTests);
router.get('/attempts', auth, tc.getMyAttempts);
router.get('/:id', tc.getTest);
router.post('/:id/start', auth, tc.startAttempt);
router.post('/attempts/:attemptId/submit', auth, tc.submitAttempt);

export default router;
