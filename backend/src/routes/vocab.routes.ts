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

// Management: Topics
router.post('/topics', vocab.createTopic);
router.put('/topics/:id', vocab.updateTopic);
router.delete('/topics/:id', vocab.deleteTopic);

// Management: Words
router.post('/words', vocab.createWord);
router.put('/words/:id', vocab.updateWord);
router.delete('/words/:id', vocab.deleteWord);
router.post('/import', vocab.importWords);

export default router;
// trigger reload
