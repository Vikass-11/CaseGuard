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
        const orgId = (req as any).user?.organizationId;
        const useMockML = process.env.USE_MOCK_ML === 'true';
        
        const brief = useMockML
            ? await MockMLService.generateBrief(id)
            : await RealMLService.generateBrief(id, orgId);
            
        await AuditLog.create({ organizationId: orgId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
        res.json(brief);
    }
    catch (error) {
        next(error);
    }
};

export const generateRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const orgId = (req as any).user?.organizationId;
        const useMockML = process.env.USE_MOCK_ML === 'true';

        const prediction = useMockML
            ? await MockMLService.generatePrediction(id)
            : await RealMLService.generatePrediction(id, orgId);

        const recommendations = useMockML
            ? await MockMLService.generateRecommendations(id, prediction.severity)
            : await RealMLService.generateRecommendations(id, prediction.severity, orgId);

        await AuditLog.create({ organizationId: orgId, actorId: (req as any).user._id, action: 'UPDATE', collectionName: 'Case', documentId: id });
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

export const overridePrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const { field, newValue, reason } = req.body;
        const actorId = (req as any).user._id;
        
        const PredictionModel = (await import('../models/Prediction')).default;
        const prediction = await PredictionModel.findOne({ caseId: id });
        
        if (!prediction) {
            return res.status(404).json({ message: 'Prediction not found' });
        }
        
        const originalValue = prediction[field];
        
        const overrideLog = {
            field,
            originalValue,
            newValue,
            reason,
            actorId,
            timestamp: new Date()
        };
        
        prediction[field] = newValue;
        if (!prediction.overrides) prediction.overrides = [];
        prediction.overrides.push(overrideLog);
        
        await prediction.save();
        
        await AuditLog.create({ 
            organizationId: (req as any).user.organizationId, 
            actorId, 
            action: 'UPDATE', 
            collectionName: 'Prediction', 
            documentId: prediction._id,
            diff: { [field]: { before: originalValue, after: newValue } }
        });
        
        res.json(prediction);
    } catch (error) {
        next(error);
    }
};

export const overrideRecommendation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const { field, newValue, reason } = req.body;
        const actorId = (req as any).user._id;
        
        const RecommendationModel = (await import('../models/Recommendation')).default;
        const recommendation = await RecommendationModel.findOne({ caseId: id });
        
        if (!recommendation) {
            return res.status(404).json({ message: 'Recommendation not found' });
        }
        
        const originalValue = recommendation[field];
        
        const overrideLog = {
            field,
            originalValue,
            newValue,
            reason,
            actorId,
            timestamp: new Date()
        };
        
        recommendation[field] = newValue;
        if (!recommendation.overrides) recommendation.overrides = [];
        recommendation.overrides.push(overrideLog);
        
        await recommendation.save();
        
        await AuditLog.create({ 
            organizationId: (req as any).user.organizationId, 
            actorId, 
            action: 'UPDATE', 
            collectionName: 'Recommendation', 
            documentId: recommendation._id,
            diff: { [field]: { before: originalValue, after: newValue } }
        });
        
        res.json(recommendation);
    } catch (error) {
        next(error);
    }
};

export const analyzePractice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { statement, practiceType } = req.body;
        if (!statement || typeof statement !== 'string' || !statement.trim()) {
            return res.status(400).json({ error: 'Statement is required for practice analysis.' });
        }
        const report = await RealMLService.analyzePracticeStatement(statement, practiceType || 'General Statement');
        res.json(report);
    } catch (error) {
        next(error);
    }
};
