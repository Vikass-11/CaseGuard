import { Router } from 'express';
import { analyzePatterns } from '../controllers/PatternController';

const router = Router();

router.post('/analyze-patterns', analyzePatterns);

export default router;
