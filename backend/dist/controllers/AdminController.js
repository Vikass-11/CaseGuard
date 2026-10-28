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
const ALLOWED_ROLES = ['ADMIN', 'LAWYER', 'CASE_WORKER'];
const getUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find({ organizationId: req.user.organizationId })
            .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 });
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
        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User_1.default.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }
        const assignedRole = role && ALLOWED_ROLES.includes(role.toUpperCase())
            ? role.toUpperCase()
            : 'CASE_WORKER';
        const salt = await bcryptjs_1.default.genSalt(10);
        // Use registrationNumber as password if provided, otherwise standard temporary password
        const initialPassword = registrationNumber && registrationNumber.trim().length >= 6
            ? registrationNumber.trim()
            : 'SecurePass123!';
        const passwordHash = await bcryptjs_1.default.hash(initialPassword, salt);
        const newUser = await User_1.default.create({
            name: name ? name.trim() : undefined,
            email: normalizedEmail,
            passwordHash,
            organizationId: req.user.organizationId,
            role: assignedRole,
            registrationNumber: registrationNumber ? registrationNumber.trim() : undefined,
            requiresPasswordChange: true
        });
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'CREATE',
            collectionName: 'User',
            documentId: newUser._id,
            diff: { role: assignedRole, email: normalizedEmail }
        });
        const userResponse = await User_1.default.findById(newUser._id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
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
        if (!role || !ALLOWED_ROLES.includes(role.toUpperCase())) {
            return res.status(400).json({ message: `Invalid role. Allowed roles are: ${ALLOWED_ROLES.join(', ')}` });
        }
        const targetRole = role.toUpperCase();
        // Prevent sole admin from demoting themselves
        if (id === req.user._id.toString() && targetRole !== 'ADMIN') {
            const adminCount = await User_1.default.countDocuments({
                organizationId: req.user.organizationId,
                role: 'ADMIN'
            });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot demote the sole remaining administrator for this organization.' });
            }
        }
        // Security check: Ensure user belongs to the same organization (Tenant Isolation)
        const existingUser = await User_1.default.findOne({ _id: id, organizationId: req.user.organizationId });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found in your organization' });
        }
        const oldRole = existingUser.role;
        existingUser.role = targetRole;
        await existingUser.save();
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'UPDATE',
            collectionName: 'User',
            documentId: existingUser._id,
            diff: { role: { before: oldRole, after: targetRole } }
        });
        const sanitizedUser = await User_1.default.findById(existingUser._id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
        res.json(sanitizedUser);
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
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }
        // Verify tenant and user existence
        const user = await User_1.default.findOne({ _id: id, organizationId: req.user.organizationId });
        if (!user) {
            return res.status(404).json({ message: 'User not found in your organization' });
        }
        // If deleting an admin, ensure at least one admin remains
        if (user.role === 'ADMIN') {
            const adminCount = await User_1.default.countDocuments({
                organizationId: req.user.organizationId,
                role: 'ADMIN'
            });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot delete the sole administrator for this organization.' });
            }
        }
        await User_1.default.deleteOne({ _id: id, organizationId: req.user.organizationId });
        await AuditLog_1.default.create({
            organizationId: req.user.organizationId,
            actorId: req.user._id,
            action: 'DELETE',
            collectionName: 'User',
            documentId: user._id,
            diff: { email: user.email, role: user.role }
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog_1.default.find({ organizationId: req.user.organizationId })
            .sort({ timestamp: -1 })
            .limit(200)
            .populate('actorId', 'name email role');
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
        // Calculate Prediction Override Rate scoped to org if present
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
