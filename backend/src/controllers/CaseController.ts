import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Case from '../models/Case';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    // For demo purposes, we will assign a new ObjectId for organizationId if not provided
    const newCase = await Case.create({ 
      createdBy: req.user._id, 
      title,
      organizationId: req.user.organizationId
    });
    
    await AuditLog.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'CREATE', collectionName: 'Case', documentId: newCase._id });
    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};

export const getCases = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Basic filter: only show cases owned by user unless admin
    const filter: any = { organizationId: req.user.organizationId };
    if (req.user.role !== 'admin' && req.user.role !== 'ADMIN') {
      filter.createdBy = req.user._id;
    }
    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findOne({ _id: id, organizationId: req.user.organizationId });
    if (!caseDoc) {
      res.status(404);
      throw new Error('Case not found');
    }

    const inputs = await CaseInput.findOne({ caseId: id });
    const statement = await CaseStatement.findOne({ caseId: id });
    const timeline = await TimelineEvent.find({ caseId: id, organizationId: req.user.organizationId }).sort({ date: 1 });

    res.json({ case: caseDoc, inputs, statement, timeline });
  } catch (error) {
    next(error);
  }
};

export const updateCaseInput = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const input = await CaseInput.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
    await AuditLog.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'CaseInput', documentId: input._id });
    res.json(input);
  } catch (error) {
    next(error);
  }
};

export const updateCaseStatement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const statement = await CaseStatement.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
    await AuditLog.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'CaseStatement', documentId: statement._id });
    res.json(statement);
  } catch (error) {
    next(error);
  }
};

export const addTimelineEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await TimelineEvent.create({ ...req.body, caseId: id, organizationId: req.user.organizationId });
    await AuditLog.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'CREATE', collectionName: 'TimelineEvent', documentId: event._id });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};
