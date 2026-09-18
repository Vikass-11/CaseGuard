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
        const useMockML = process.env.USE_MOCK_ML === 'true';
        
        const brief = useMockML
            ? await MockMLService.generateBrief(id)
            : await RealMLService.generateBrief(id);
            
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
        const orgId = (req as any).user.organizationId;
        const useMockML = process.env.USE_MOCK_ML === 'true';

        const prediction = useMockML
            ? await MockMLService.generatePrediction(id)
            : await RealMLService.generatePrediction(id, orgId);

        const recommendations = useMockML
            ? await MockMLService.generateRecommendations(id, prediction.severity)
            : await RealMLService.generateRecommendations(id, prediction.severity);

        await AuditLog.create({ organizationId: (req as any).user.organizationId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};
export const saveBrief = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const { content } = req.body;
        
        // Find existing brief and update the content
        const BriefModel = (await import('../models/Brief')).default;
        
        const brief = await BriefModel.findOneAndUpdate(
            { caseId: id },
            { content },
            { new: true }
        );
        
        if (!brief) {
            return res.status(404).json({ message: 'Brief not found' });
        }
        
        await AuditLog.create({ organizationId: (req as any).user.organizationId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Brief', documentId: id });
        res.json(brief);
    } catch (error) {
        next(error);
    }
};
