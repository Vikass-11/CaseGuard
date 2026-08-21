"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendations = exports.generateBrief = exports.analyzeCase = void 0;
const MockMLService_1 = require("../services/MockMLService");
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const analyzeCase = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prediction = await MockMLService_1.MockMLService.generatePrediction(id);
        await AuditLog_1.default.create({ userId: req.user._id, action: 'ANALYZE_CASE', entityType: 'Case', entityId: id });
        res.json(prediction);
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeCase = analyzeCase;
const generateBrief = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brief = await MockMLService_1.MockMLService.generateBrief(id);
        await AuditLog_1.default.create({ userId: req.user._id, action: 'GENERATE_BRIEF', entityType: 'Case', entityId: id });
        res.json(brief);
    }
    catch (error) {
        next(error);
    }
};
exports.generateBrief = generateBrief;
const generateRecommendations = async (req, res, next) => {
    try {
        const { id } = req.params;
        // For mock purposes, just pick 'Severe' or pass it. We will let the service handle it or fetch prediction.
        const prediction = await MockMLService_1.MockMLService.generatePrediction(id); // Ensure prediction exists
        const recommendations = await MockMLService_1.MockMLService.generateRecommendations(id, prediction.severity);
        await AuditLog_1.default.create({ userId: req.user._id, action: 'GENERATE_RECOMMENDATIONS', entityType: 'Case', entityId: id });
        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};
exports.generateRecommendations = generateRecommendations;
