import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { MockMLService } from '../services/MockMLService';
import AuditLog from '../models/AuditLog';
import Case from '../models/Case';
import { RealMLService } from '../services/RealMLService';

// Ensure case belongs to the requesting user's organization
async function verifyCaseOwnership(caseId: string, orgId: any): Promise<boolean> {
    if (!caseId || !mongoose.Types.ObjectId.isValid(caseId)) return false;
    const caseDoc = await Case.findOne({ _id: caseId, organizationId: orgId });
    return !!caseDoc;
}

export const analyzeCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const orgId = (req as any).user?.organizationId;
        
        const hasAccess = await verifyCaseOwnership(id, orgId);
        if (!hasAccess) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }

        const useMockML = process.env.USE_MOCK_ML === 'true';
        const prediction = useMockML
            ? await MockMLService.generatePrediction(id)
            : await RealMLService.generatePrediction(id, orgId);

        await AuditLog.create({ 
            organizationId: orgId, 
            actorId: (req as any).user._id, 
            action: 'UPDATE', 
            collectionName: 'Case', 
            documentId: id,
            diff: { action: 'ANALYZE_CASE' }
        });

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
        const userId = (req as any).user?._id;
        
        const hasAccess = await verifyCaseOwnership(id, orgId);
        if (!hasAccess) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }

        const useMockML = process.env.USE_MOCK_ML === 'true';
        const brief = useMockML
            ? await MockMLService.generateBrief(id, orgId, userId)
            : await RealMLService.generateBrief(id, orgId, userId);
            
        await AuditLog.create({ 
            organizationId: orgId, 
            actorId: userId, 
            action: 'UPDATE', 
            collectionName: 'Case', 
            documentId: id,
            diff: { action: 'GENERATE_BRIEF' }
        });

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
        const userId = (req as any).user?._id;

        const hasAccess = await verifyCaseOwnership(id, orgId);
        if (!hasAccess) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }

        const useMockML = process.env.USE_MOCK_ML === 'true';
        const prediction = useMockML
            ? await MockMLService.generatePrediction(id)
            : await RealMLService.generatePrediction(id, orgId);

        const recommendations = useMockML
            ? await MockMLService.generateRecommendations(id, prediction.severity)
            : await RealMLService.generateRecommendations(id, prediction.severity, orgId);

        await AuditLog.create({ 
            organizationId: orgId, 
            actorId: userId, 
            action: 'UPDATE', 
            collectionName: 'Case', 
            documentId: id,
            diff: { action: 'GENERATE_RECOMMENDATIONS' }
        });

        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};

export const saveBrief = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const userId = (req as any).user?._id;
        const orgId = (req as any).user?.organizationId;
        
        const hasAccess = await verifyCaseOwnership(id, orgId);
        if (!hasAccess) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }

        const { content, summary, chronology, abuseIndicators, riskLevel, missingInfo, researchCitations } = req.body;
        const BriefModel = (await import('../models/Brief')).default;
        
        // Build update object with all provided fields
        const updateData: any = {};
        if (content !== undefined) {
          updateData.content = typeof content === 'string'
            ? content.replace(/\\r/g, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
            : content;
        }
        if (summary !== undefined) updateData.summary = summary;
        if (chronology !== undefined) updateData.chronology = chronology;
        if (abuseIndicators !== undefined) updateData.abuseIndicators = abuseIndicators;
        if (riskLevel !== undefined) updateData.riskLevel = riskLevel;
        if (missingInfo !== undefined) updateData.missingInfo = missingInfo;
        if (researchCitations !== undefined) updateData.researchCitations = researchCitations;
        if (orgId) updateData.organizationId = orgId;
        if (userId) updateData.lastSavedBy = userId;
        
        // Use upsert to create the brief if it doesn't exist
        const brief = await BriefModel.findOneAndUpdate(
            { caseId: id },
            { ...updateData, caseId: id },
            { new: true, upsert: true }
        );
        
        await AuditLog.create({ 
            organizationId: orgId, 
            actorId: userId, 
            action: 'UPDATE', 
            collectionName: 'Brief', 
            documentId: id,
            diff: { action: 'SAVE_BRIEF' }
        });

        res.json(brief);
    } catch (error) {
        next(error);
    }
};

export const overridePrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const orgId = (req as any).user?.organizationId;
        const actorId = (req as any).user?._id;

        const hasAccess = await verifyCaseOwnership(id, orgId);
        if (!hasAccess) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }

        const { field, newValue, reason } = req.body;
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
            reason: reason || 'Professional discretion override',
            actorId,
            timestamp: new Date()
        };
        
        prediction[field] = newValue;
        if (!prediction.overrides) prediction.overrides = [];
        prediction.overrides.push(overrideLog);
        
        await prediction.save();
        
        await AuditLog.create({ 
            organizationId: orgId, 
            actorId, 
            action: 'UPDATE', 
            collectionName: 'Prediction', 
            documentId: prediction._id,
            diff: { [field]: { before: originalValue, after: newValue, reason } }
        });
        
        res.json(prediction);
    } catch (error) {
        next(error);
    }
};

export const overrideRecommendation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const orgId = (req as any).user?.organizationId;
        const actorId = (req as any).user?._id;

        const hasAccess = await verifyCaseOwnership(id, orgId);
        if (!hasAccess) {
            return res.status(404).json({ message: 'Case not found or access denied.' });
        }

        const { field, newValue, reason } = req.body;
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
            reason: reason || 'Professional discretion override',
            actorId,
            timestamp: new Date()
        };
        
        recommendation[field] = newValue;
        if (!recommendation.overrides) recommendation.overrides = [];
        recommendation.overrides.push(overrideLog);
        
        await recommendation.save();
        
        await AuditLog.create({ 
            organizationId: orgId, 
            actorId, 
            action: 'UPDATE', 
            collectionName: 'Recommendation', 
            documentId: recommendation._id,
            diff: { [field]: { before: originalValue, after: newValue, reason } }
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
