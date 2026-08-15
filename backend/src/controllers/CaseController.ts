import { Response, NextFunction } from 'express';
import Case from '../models/Case';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const newCase = await Case.create({ userId: req.user._id, title });
    
    await AuditLog.create({ userId: req.user._id, action: 'CREATE_CASE', entityType: 'Case', entityId: newCase._id });
    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};

export const getCases = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Basic filter: only show cases owned by user unless admin
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      res.status(404);
      throw new Error('Case not found');
    }

    const inputs = await CaseInput.findOne({ caseId: id });
    const statement = await CaseStatement.findOne({ caseId: id });
    const timeline = await TimelineEvent.find({ caseId: id }).sort({ date: 1 });

    res.json({ case: caseDoc, inputs, statement, timeline });
  } catch (error) {
    next(error);
  }
};

export const updateCaseInput = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const input = await CaseInput.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
    await AuditLog.create({ userId: req.user._id, action: 'UPDATE_CASE_INPUT', entityType: 'Case', entityId: id });
    res.json(input);
  } catch (error) {
    next(error);
  }
};

export const updateCaseStatement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const statement = await CaseStatement.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
    await AuditLog.create({ userId: req.user._id, action: 'UPDATE_CASE_STATEMENT', entityType: 'Case', entityId: id });
    res.json(statement);
  } catch (error) {
    next(error);
  }
};

export const addTimelineEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await TimelineEvent.create({ ...req.body, caseId: id });
    await AuditLog.create({ userId: req.user._id, action: 'ADD_TIMELINE_EVENT', entityType: 'Case', entityId: id });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};
