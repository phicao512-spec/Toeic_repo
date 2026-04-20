import { Router } from 'express';
import * as vocab from '../controllers/vocab.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public: list topics (no auth needed for browsing)
router.get('/topics', vocab.getTopics);
router.get('/topics/:topicId/words', vocab.getWords);

// Auth required: review
router.get('/review', auth, vocab.getReviewWords);
router.post('/review', auth, vocab.reviewWord);

export default router;
