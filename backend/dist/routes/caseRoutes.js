"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CaseController_1 = require("../controllers/CaseController");
const MockMLController_1 = require("../controllers/MockMLController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.route('/')
    .post(CaseController_1.createCase)
    .get(CaseController_1.getCases);
router.route('/:id')
    .get(CaseController_1.getCaseById);
router.put('/:id/input', CaseController_1.updateCaseInput);
router.put('/:id/statement', CaseController_1.updateCaseStatement);
router.post('/:id/timeline', CaseController_1.addTimelineEvent);
// Mock ML Routes
router.post('/:id/analyze', MockMLController_1.analyzeCase);
router.post('/:id/generate-brief', MockMLController_1.generateBrief);
router.post('/:id/generate-recommendations', MockMLController_1.generateRecommendations);
exports.default = router;
