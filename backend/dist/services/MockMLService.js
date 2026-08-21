"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockMLService = void 0;
const Prediction_1 = __importDefault(require("../models/Prediction"));
const Brief_1 = __importDefault(require("../models/Brief"));
const Recommendation_1 = __importDefault(require("../models/Recommendation"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
class MockMLService {
    static async generatePrediction(caseId) {
        // Generate mock prediction data
        const severityOptions = ['Moderate', 'Severe', 'Life-Threatening'];
        const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
        const escalationScore = Math.floor(Math.random() * 100);
        const escalationLevel = escalationScore > 75 ? 'High' : escalationScore > 40 ? 'Medium' : 'Low';
        const patterns = ['Coercive Control', 'Isolation', 'Threats'];
        const triggers = ['Repeated Complaints', 'Fear Indicators'];
        // Upsert Prediction
        const prediction = await Prediction_1.default.findOneAndUpdate({ caseId }, { severity, escalationScore, escalationLevel, patterns, triggers }, { new: true, upsert: true });
        return prediction;
    }
    static async generateBrief(caseId) {
        const inputs = await CaseInput_1.default.findOne({ caseId });
        const statement = await CaseStatement_1.default.findOne({ caseId });
        const summary = 'This case involves a domestic violence incident...';
        const chronology = '1. Incident reported. 2. Statement recorded.';
        const abuseIndicators = 'Physical abuse, Emotional abuse.';
        const riskLevel = 'High';
        const missingInfo = 'Medical records, Witness statements.';
        const content = `## Summary\n${summary}\n\n## Chronology\n${chronology}\n\n## Abuse Indicators\n${abuseIndicators}\n\n## Risk Level\n${riskLevel}\n\n## Missing Information\n${missingInfo}`;
        const brief = await Brief_1.default.findOneAndUpdate({ caseId }, { summary, chronology, abuseIndicators, riskLevel, missingInfo, content }, { new: true, upsert: true });
        return brief;
    }
    static async generateRecommendations(caseId, severity) {
        const urgency = severity === 'Life-Threatening' ? 'Immediate Action Required' : 'Standard Follow-up';
        const evidenceChecklist = ['Photos of injuries', 'Medical reports', 'Police reports'];
        const followUpQuestions = ['Are there children in the home?', 'Do you have a safe place to stay?'];
        const referrals = ['Local Women Shelter', 'Legal Aid Society'];
        const recommendation = await Recommendation_1.default.findOneAndUpdate({ caseId }, { urgency, evidenceChecklist, followUpQuestions, referrals }, { new: true, upsert: true });
        return recommendation;
    }
}
exports.MockMLService = MockMLService;
