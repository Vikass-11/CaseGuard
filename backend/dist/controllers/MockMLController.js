"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendations = exports.generateBrief = exports.analyzeCase = void 0;
const MockMLService_1 = require("../services/MockMLService");
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const RealMLService_1 = require("../services/RealMLService");
const analyzeCase = async (req, res, next) => {
    try {
        const id = req.params.id;
        const orgId = req.user.organizationId;
        const useMockML = process.env.USE_MOCK_ML === 'true';
        const prediction = useMockML
            ? await MockMLService_1.MockMLService.generatePrediction(id)
            : await RealMLService_1.RealMLService.generatePrediction(id, orgId);
        await AuditLog_1.default.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(prediction);
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeCase = analyzeCase;
const generateBrief = async (req, res, next) => {
    try {
        const id = req.params.id;
        const brief = await MockMLService_1.MockMLService.generateBrief(id);
        await AuditLog_1.default.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(brief);
    }
    catch (error) {
        next(error);
    }
};
exports.generateBrief = generateBrief;
const generateRecommendations = async (req, res, next) => {
    try {
        const id = req.params.id;
        const prediction = await MockMLService_1.MockMLService.generatePrediction(id);
        const recommendations = await MockMLService_1.MockMLService.generateRecommendations(id, prediction.severity);
        await AuditLog_1.default.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};
exports.generateRecommendations = generateRecommendations;
