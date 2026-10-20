"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const CaseController_1 = require("../controllers/CaseController");
const AIAnalysisController_1 = require("../controllers/AIAnalysisController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(authMiddleware_1.protect);
// Practice Analyser Sandbox Route (must be before /:id)
router.post('/practice/analyze', AIAnalysisController_1.analyzePractice);
router.route('/')
    .post(CaseController_1.createCase)
    .get(CaseController_1.getCases);
router.route('/:id')
    .get(CaseController_1.getCaseById);
router.put('/:id/input', CaseController_1.updateCaseInput);
router.put('/:id/statement', CaseController_1.updateCaseStatement);
router.post('/:id/timeline', CaseController_1.addTimelineEvent);
router.post('/:id/documents', upload.single('file'), CaseController_1.uploadDocument);
// Clinical AI Analysis & Strategic Recommendation Routes
router.post('/:id/analyze', AIAnalysisController_1.analyzeCase);
router.post('/:id/generate-brief', AIAnalysisController_1.generateBrief);
router.put('/:id/brief', AIAnalysisController_1.saveBrief);
router.post('/:id/generate-recommendations', AIAnalysisController_1.generateRecommendations);
router.put('/:id/prediction/override', AIAnalysisController_1.overridePrediction);
router.put('/:id/recommendation/override', AIAnalysisController_1.overrideRecommendation);
exports.default = router;
