import express from 'express';
import {
  createCase,
  getCases,
  getCaseById,
  updateCaseInput,
  updateCaseStatement,
  addTimelineEvent
} from '../controllers/CaseController';
import {
  analyzeCase,
  generateBrief,
  generateRecommendations
} from '../controllers/MockMLController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createCase)
  .get(getCases);

router.route('/:id')
  .get(getCaseById);

router.put('/:id/input', updateCaseInput);
router.put('/:id/statement', updateCaseStatement);
router.post('/:id/timeline', addTimelineEvent);

// Mock ML Routes
router.post('/:id/analyze', analyzeCase);
router.post('/:id/generate-brief', generateBrief);
router.post('/:id/generate-recommendations', generateRecommendations);

export default router;
