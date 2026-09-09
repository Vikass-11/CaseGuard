"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.deleteUser = exports.updateUserRole = exports.createUser = exports.getUsers = void 0;
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
