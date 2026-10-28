import express from 'express';
import multer from 'multer';
import {
  createCase,
  getCases,
  getCaseById,
  updateCaseInput,
  updateCaseStatement,
  addTimelineEvent,
  uploadDocument
} from '../controllers/CaseController';
import {
  analyzeCase,
  generateBrief,
  saveBrief,
  generateRecommendations,
  overridePrediction,
  overrideRecommendation,
  analyzePractice
} from '../controllers/AIAnalysisController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Safe multer memory storage with 10MB limit
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file limit
});

router.use(protect);

// Practice Analyser Sandbox Route (must be before /:id)
router.post('/practice/analyze', analyzePractice);

router.route('/')
  .post(createCase)
  .get(getCases);

router.route('/:id')
  .get(getCaseById);

router.put('/:id/input', updateCaseInput);
router.put('/:id/statement', updateCaseStatement);
router.post('/:id/timeline', addTimelineEvent);
router.post('/:id/documents', upload.single('file'), uploadDocument as any);

// Clinical AI Analysis & Strategic Recommendation Routes
router.post('/:id/analyze', analyzeCase);
router.post('/:id/generate-brief', generateBrief);
router.put('/:id/brief', saveBrief);
router.post('/:id/generate-recommendations', generateRecommendations);
router.put('/:id/prediction/override', overridePrediction);
router.put('/:id/recommendation/override', overrideRecommendation);

export default router;
