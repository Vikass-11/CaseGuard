import { Request, Response, NextFunction } from 'express';
import { MockMLService } from '../services/MockMLService';
import AuditLog from '../models/AuditLog';
import { RealMLService } from '../services/RealMLService';

export const analyzeCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const orgId = (req as any).user.organizationId;
        const useMockML = process.env.USE_MOCK_ML === 'true';
        const prediction = useMockML
            ? await MockMLService.generatePrediction(id)
            : await RealMLService.generatePrediction(id, orgId);

        await AuditLog.create({ organizationId: (req as any).user.organizationId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(prediction);
    }
    catch (error) {
        next(error);
    }
};

export const generateBrief = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const brief = await MockMLService.generateBrief(id);
        await AuditLog.create({ organizationId: (req as any).user.organizationId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(brief);
    }
    catch (error) {
        next(error);
    }
};

export const generateRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const prediction = await MockMLService.generatePrediction(id);
        const recommendations = await MockMLService.generateRecommendations(id, prediction.severity);
        await AuditLog.create({ organizationId: (req as any).user.organizationId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};
