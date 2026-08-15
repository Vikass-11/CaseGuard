import { Response, NextFunction } from 'express';
import { MockMLService } from '../services/MockMLService';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const analyzeCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const prediction = await MockMLService.generatePrediction(id);
    await AuditLog.create({ userId: req.user._id, action: 'ANALYZE_CASE', entityType: 'Case', entityId: id });
    res.json(prediction);
  } catch (error) {
    next(error);
  }
};

export const generateBrief = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const brief = await MockMLService.generateBrief(id);
    await AuditLog.create({ userId: req.user._id, action: 'GENERATE_BRIEF', entityType: 'Case', entityId: id });
    res.json(brief);
  } catch (error) {
    next(error);
  }
};

export const generateRecommendations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // For mock purposes, just pick 'Severe' or pass it. We will let the service handle it or fetch prediction.
    const prediction = await MockMLService.generatePrediction(id); // Ensure prediction exists
    const recommendations = await MockMLService.generateRecommendations(id, prediction.severity);
    await AuditLog.create({ userId: req.user._id, action: 'GENERATE_RECOMMENDATIONS', entityType: 'Case', entityId: id });
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};
