import { Router } from 'express';
import * as qc from '../controllers/question.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', qc.getQuestions);
router.get('/:id', qc.getQuestion);
router.post('/check', auth, qc.checkAnswer);
router.get('/practice/:part', qc.getPracticeSet);

export default router;
