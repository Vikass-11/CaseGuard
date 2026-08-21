"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.updateUserRole = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const getUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find().select('-passwordHash');
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        await AuditLog_1.default.create({ userId: req.user._id, action: 'UPDATE_USER_ROLE', entityType: 'User', entityId: user._id });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog_1.default.find().sort({ timestamp: -1 }).populate('userId', 'name email');
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
};
exports.getAuditLogs = getAuditLogs;
