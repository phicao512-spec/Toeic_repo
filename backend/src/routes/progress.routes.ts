import { Router } from 'express';
import * as pc from '../controllers/progress.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/dashboard', auth, pc.getDashboard);
router.get('/accuracy', auth, pc.getPartAccuracy);
router.post('/study', auth, pc.recordStudy);

export default router;
