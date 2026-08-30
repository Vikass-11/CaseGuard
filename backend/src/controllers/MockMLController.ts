import { Request, Response, NextFunction } from 'express';
import { MockMLService } from '../services/MockMLService';
import AuditLog from '../models/AuditLog';

export const analyzeCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const prediction = await MockMLService.generatePrediction(id);
        await AuditLog.create({ userId: (req as any).user._id, action: 'ANALYZE_CASE', entityType: 'Case', entityId: id });
        res.json(prediction);
    }
    catch (error) {
        next(error);
    }
};

export const generateBrief = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const brief = await MockMLService.generateBrief(id);
        await AuditLog.create({ userId: (req as any).user._id, action: 'GENERATE_BRIEF', entityType: 'Case', entityId: id });
        res.json(brief);
    }
    catch (error) {
        next(error);
    }
};

export const generateRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const prediction = await MockMLService.generatePrediction(id);
        const recommendations = await MockMLService.generateRecommendations(id, prediction.severity);
        await AuditLog.create({ userId: (req as any).user._id, action: 'GENERATE_RECOMMENDATIONS', entityType: 'Case', entityId: id });
        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};
