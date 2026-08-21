"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTimelineEvent = exports.updateCaseStatement = exports.updateCaseInput = exports.getCaseById = exports.getCases = exports.createCase = void 0;
const Case_1 = __importDefault(require("../models/Case"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
const TimelineEvent_1 = __importDefault(require("../models/TimelineEvent"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const createCase = async (req, res, next) => {
    try {
        const { title } = req.body;
        const newCase = await Case_1.default.create({ userId: req.user._id, title });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'CREATE_CASE', entityType: 'Case', entityId: newCase._id });
        res.status(201).json(newCase);
    }
    catch (error) {
        next(error);
    }
};
exports.createCase = createCase;
const getCases = async (req, res, next) => {
    try {
        // Basic filter: only show cases owned by user unless admin
        const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
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
        const caseDoc = await Case_1.default.findById(id);
        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }
        const inputs = await CaseInput_1.default.findOne({ caseId: id });
        const statement = await CaseStatement_1.default.findOne({ caseId: id });
        const timeline = await TimelineEvent_1.default.find({ caseId: id }).sort({ date: 1 });
        res.json({ case: caseDoc, inputs, statement, timeline });
    }
    catch (error) {
        next(error);
    }
};
exports.getCaseById = getCaseById;
const updateCaseInput = async (req, res, next) => {
    try {
        const { id } = req.params;
        const input = await CaseInput_1.default.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'UPDATE_CASE_INPUT', entityType: 'Case', entityId: id });
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
        const statement = await CaseStatement_1.default.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'UPDATE_CASE_STATEMENT', entityType: 'Case', entityId: id });
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
        const event = await TimelineEvent_1.default.create({ ...req.body, caseId: id });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'ADD_TIMELINE_EVENT', entityType: 'Case', entityId: id });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.addTimelineEvent = addTimelineEvent;
