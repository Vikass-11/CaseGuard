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
    
    const CaseDocument = (await import('../models/CaseDocument')).default;
    const documents = await CaseDocument.find({ caseId: id }).select('-textContent'); // Exclude full text to save bandwidth

    const PredictionModel = (await import('../models/Prediction')).default;
    const RecommendationModel = (await import('../models/Recommendation')).default;
    const prediction = await PredictionModel.findOne({ caseId: id });
    const recommendation = await RecommendationModel.findOne({ caseId: id });

    res.json({ case: caseDoc, inputs, statement, timeline, documents, prediction, recommendation });
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
    
    let anonymizedText = req.body.anonymizedText;
    if (req.body.originalText) {
      try {
        const piiResponse = await fetch('http://localhost:5001/anonymize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: req.body.originalText, caseId: id })
        });
        if (piiResponse.ok) {
          const piiData = await piiResponse.json();
          anonymizedText = piiData.anonymizedText || req.body.originalText;
        } else {
          console.error('PII service failed with status', piiResponse.status);
          anonymizedText = req.body.originalText;
        }
      } catch (err) {
        console.error('Failed to call PII service', err);
        anonymizedText = req.body.originalText;
      }
    }

    const statement = await CaseStatement.findOneAndUpdate(
      { caseId: id }, 
      { ...req.body, anonymizedText, caseId: id }, 
      { new: true, upsert: true }
    );
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

export const uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileText = req.file.buffer.toString('utf-8');

    // 1. Save locally in MongoDB (Metadata + Text)
    const CaseDocument = (await import('../models/CaseDocument')).default;
    const doc = await CaseDocument.create({
      caseId: id,
      organizationId: req.user.organizationId,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
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
    } catch (err) {
      console.error('Knowledge service unreachable:', err);
    }

    await AuditLog.create({ 
      organizationId: req.user.organizationId, 
      actorId: req.user._id, 
      action: 'CREATE', 
      collectionName: 'CaseDocument', 
      documentId: doc._id 
    });

    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
};
