"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = exports.addTimelineEvent = exports.updateCaseStatement = exports.updateCaseInput = exports.getCaseById = exports.getCases = exports.createCase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Case_1 = __importDefault(require("../models/Case"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
const TimelineEvent_1 = __importDefault(require("../models/TimelineEvent"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const piiFallback_1 = require("../utils/piiFallback");
// Helper to enforce tenant isolation and case existence
async function verifyCaseAccess(caseId, orgId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(caseId))
        return null;
    return await Case_1.default.findOne({ _id: caseId, organizationId: orgId });
}
const createCase = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: 'Case title is required' });
        }
        const sanitizedTitle = title.trim().substring(0, 250);
        const newCase = await Case_1.default.create({
            createdBy: req.user._id,
            title: sanitizedTitle,
            organizationId: req.user.organizationId,
            status: 'INTAKE'
        });
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'CREATE',
            collectionName: 'Case',
            documentId: newCase._id,
            diff: { title: sanitizedTitle }
        });
        res.status(201).json(newCase);
    }
    catch (error) {
        next(error);
    }
};
exports.createCase = createCase;
const getCases = async (req, res, next) => {
    try {
        const filter = { organizationId: req.user.organizationId };
        // Case workers see their own cases, while Lawyers and Admins can supervise all firm cases
        const userRole = (req.user.role || '').toUpperCase();
        if (userRole !== 'ADMIN' && userRole !== 'LAWYER') {
            filter.createdBy = req.user._id;
        }
        const cases = await Case_1.default.find(filter).sort({ createdAt: -1 });
        res.json(cases);
    }
    catch (error) {
        next(error);
    }
};
exports.getCases = getCases;
const getCaseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caseDoc = await verifyCaseAccess(id, req.user.organizationId);
        if (!caseDoc) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }
        const inputs = await CaseInput_1.default.findOne({ caseId: id });
        const statement = await CaseStatement_1.default.findOne({ caseId: id });
        const timeline = await TimelineEvent_1.default.find({ caseId: id, organizationId: req.user.organizationId }).sort({ eventDate: 1 });
        const CaseDocument = (await Promise.resolve().then(() => __importStar(require('../models/CaseDocument')))).default;
        const documents = await CaseDocument.find({ caseId: id, organizationId: req.user.organizationId }).select('-textContent');
        const PredictionModel = (await Promise.resolve().then(() => __importStar(require('../models/Prediction')))).default;
        const RecommendationModel = (await Promise.resolve().then(() => __importStar(require('../models/Recommendation')))).default;
        const BriefModel = (await Promise.resolve().then(() => __importStar(require('../models/Brief')))).default;
        const prediction = await PredictionModel.findOne({ caseId: id });
        const recommendation = await RecommendationModel.findOne({ caseId: id });
        const brief = await BriefModel.findOne({ caseId: id });
        res.json({ case: caseDoc, inputs, statement, timeline, documents, prediction, recommendation, brief });
    }
    catch (error) {
        next(error);
    }
};
exports.getCaseById = getCaseById;
const updateCaseInput = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caseDoc = await verifyCaseAccess(id, req.user.organizationId);
        if (!caseDoc) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }
        const input = await CaseInput_1.default.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'UPDATE',
            collectionName: 'CaseInput',
            documentId: input._id
        });
        res.json(input);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCaseInput = updateCaseInput;
const updateCaseStatement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caseDoc = await verifyCaseAccess(id, req.user.organizationId);
        if (!caseDoc) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }
        const PII_SERVICE_URL = process.env.PII_SERVICE_URL || 'http://localhost:5001';
        const textToAnonymize = req.body.originalText || req.body.statement || req.body.text;
        let anonymizedText = req.body.anonymizedText;
        if (textToAnonymize) {
            try {
                const piiResponse = await fetch(`${PII_SERVICE_URL}/anonymize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: textToAnonymize, caseId: id })
                });
                if (piiResponse.ok) {
                    const piiData = await piiResponse.json();
                    anonymizedText = piiData.anonymizedText;
                }
                else {
                    console.warn(`PII service returned HTTP ${piiResponse.status}. Utilizing local safety redaction.`);
                    anonymizedText = (0, piiFallback_1.redactPiiFallback)(textToAnonymize);
                }
            }
            catch (err) {
                console.warn('PII microservice unreachable. Falling back to local safety redaction.', err);
                anonymizedText = (0, piiFallback_1.redactPiiFallback)(textToAnonymize);
            }
        }
        else if (!anonymizedText) {
            anonymizedText = 'No statement recorded.';
        }
        const statement = await CaseStatement_1.default.findOneAndUpdate({ caseId: id }, { anonymizedText, caseId: id }, { new: true, upsert: true });
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'UPDATE',
            collectionName: 'CaseStatement',
            documentId: statement._id
        });
        res.json(statement);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCaseStatement = updateCaseStatement;
const addTimelineEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caseDoc = await verifyCaseAccess(id, req.user.organizationId);
        if (!caseDoc) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }
        const eventDate = req.body.eventDate || req.body.date || new Date();
        const severityLevel = req.body.severityLevel || req.body.severity || 'Moderate';
        const description = (req.body.description || '').trim();
        const event = await TimelineEvent_1.default.create({
            caseId: id,
            organizationId: req.user.organizationId,
            eventDate,
            severityLevel,
            description
        });
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'CREATE',
            collectionName: 'TimelineEvent',
            documentId: event._id
        });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.addTimelineEvent = addTimelineEvent;
const uploadDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caseDoc = await verifyCaseAccess(id, req.user.organizationId);
        if (!caseDoc) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        // 10MB maximum file size check
        if (req.file.size > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds maximum 10MB limit.' });
        }
        const fileText = req.file.buffer.toString('utf-8');
        const sanitizedFileName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        // 1. Save locally in MongoDB (Metadata + Text)
        const CaseDocument = (await Promise.resolve().then(() => __importStar(require('../models/CaseDocument')))).default;
        const doc = await CaseDocument.create({
            caseId: id,
            organizationId: req.user.organizationId,
            uploadedBy: req.user._id,
            fileName: sanitizedFileName,
            fileType: req.file.mimetype,
            textContent: fileText
        });
        // 2. Forward to Knowledge Service for Embedding
        const KNOWLEDGE_SERVICE_URL = process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:5002';
        try {
            const ingestResponse = await fetch(`${KNOWLEDGE_SERVICE_URL}/api/ingest/case-document`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId: id,
                    sourceDocId: doc._id.toString(),
                    text: fileText
                })
            });
            if (!ingestResponse.ok) {
                console.error('Failed to ingest document into vector DB', ingestResponse.status);
            }
        }
        catch (err) {
            console.error('Knowledge service unreachable:', err);
        }
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'CREATE',
            collectionName: 'CaseDocument',
            documentId: doc._id
        });
        res.status(201).json(doc);
    }
    catch (error) {
        next(error);
    }
};
exports.uploadDocument = uploadDocument;
