"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvalMetrics = exports.getAuditLogs = exports.deleteUser = exports.updateUserRole = exports.createUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const getUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find({ organizationId: req.user.organizationId }).select('-passwordHash');
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res, next) => {
    try {
        const { name, email, role, registrationNumber } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400);
            throw new Error('User already exists');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        // Use registrationNumber as password
        const passwordHash = await bcryptjs_1.default.hash(registrationNumber || 'password123', salt);
        const newUser = await User_1.default.create({
            name,
            email,
            passwordHash,
            organizationId: req.user.organizationId,
            role: role || 'CASE_WORKER',
            registrationNumber,
            requiresPasswordChange: true
        });
        await AuditLog_1.default.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'CREATE', collectionName: 'User', documentId: newUser._id });
        // Return user without password
        const userResponse = await User_1.default.findById(newUser._id).select('-passwordHash');
        res.status(201).json(userResponse);
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        await AuditLog_1.default.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'User', documentId: user._id });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === req.user._id.toString()) {
            res.status(400);
            throw new Error('You cannot delete your own account');
        }
        const user = await User_1.default.findOneAndDelete({ _id: id, organizationId: req.user.organizationId });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'DELETE',
            collectionName: 'User',
            documentId: user._id
        });
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog_1.default.find({ organizationId: req.user.organizationId }).sort({ timestamp: -1 }).populate('actorId', 'name email');
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
};
exports.getAuditLogs = getAuditLogs;
const getEvalMetrics = async (req, res, next) => {
    try {
        const Prediction = (await Promise.resolve().then(() => __importStar(require('../models/Prediction')))).default;
        const Recommendation = (await Promise.resolve().then(() => __importStar(require('../models/Recommendation')))).default;
        // Calculate Prediction Override Rate
        const totalPredictions = await Prediction.countDocuments();
        const overriddenPredictions = await Prediction.countDocuments({ 'overrides.0': { $exists: true } });
        const predictionOverrideRate = totalPredictions > 0 ? (overriddenPredictions / totalPredictions) * 100 : 0;
        // Calculate Recommendation Override Rate
        const totalRecommendations = await Recommendation.countDocuments();
        const overriddenRecommendations = await Recommendation.countDocuments({ 'overrides.0': { $exists: true } });
        const recommendationOverrideRate = totalRecommendations > 0 ? (overriddenRecommendations / totalRecommendations) * 100 : 0;
        res.json({
            metrics: [
                { label: 'Prediction Override Rate', value: predictionOverrideRate.toFixed(1) + '%', description: 'Percentage of AI severity predictions corrected by humans' },
                { label: 'Recommendation Override Rate', value: recommendationOverrideRate.toFixed(1) + '%', description: 'Percentage of AI recommendations edited by humans' },
                { label: 'Total Predictions', value: totalPredictions.toString(), description: 'Total AI severity assessments generated' }
            ]
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvalMetrics = getEvalMetrics;
