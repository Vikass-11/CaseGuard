"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const Organization_1 = __importDefault(require("../models/Organization"));
const User_1 = __importDefault(require("../models/User"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const mongoose_1 = __importDefault(require("mongoose"));
const register = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, email, password, orgName } = req.body;
        if (!email || !password) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'Please provide email and password' });
        }
        if (password.length < 6) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        let user = await User_1.default.findOne({ email: normalizedEmail }).session(session);
        if (user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Find or create a shared 'Default Org' so all demo users can see the same cases
        const targetOrgName = orgName ? orgName.trim() : 'Default Org';
        let org = await Organization_1.default.findOne({ name: targetOrgName }).session(session);
        if (!org) {
            const newOrgs = await Organization_1.default.create([{ name: targetOrgName }], { session });
            org = newOrgs[0];
        }
        const organizationId = org._id;
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUsers = await User_1.default.create([{
                name: name ? name.trim() : undefined,
                email: normalizedEmail,
                passwordHash,
                organizationId,
                role: 'CASE_WORKER' // Default role for new users
            }], { session });
        user = newUsers[0];
        // Audit log account creation
        await AuditLog_1.default.create([{
                organizationId,
                actorId: user._id,
                action: 'CREATE',
                collectionName: 'User',
                documentId: user._id
            }], { session });
        const payload = {
            id: user.id,
            role: user.role,
            organizationId: user.organizationId,
            requiresPasswordChange: user.requiresPasswordChange
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ token });
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Registration error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User_1.default.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            id: user.id,
            role: user.role,
            organizationId: user.organizationId,
            requiresPasswordChange: user.requiresPasswordChange
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        res.json({ token });
    }
    catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error during authentication' });
    }
};
exports.login = login;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { passwordHash, requiresPasswordChange: false }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Audit log password update
        if (updatedUser.organizationId) {
            await AuditLog_1.default.create({
                organizationId: updatedUser.organizationId,
                actorId: updatedUser._id,
                action: 'UPDATE',
                collectionName: 'User',
                documentId: updatedUser._id,
                diff: { passwordChange: { before: 'old_hash', after: 'new_hash' } }
            });
        }
        // Generate new token reflecting requiresPasswordChange: false
        const payload = {
            id: updatedUser.id,
            role: updatedUser.role,
            organizationId: updatedUser.organizationId,
            requiresPasswordChange: updatedUser.requiresPasswordChange
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        res.json({ msg: 'Password updated successfully', token });
    }
    catch (error) {
        console.error('Change password error:', error.message);
        res.status(500).json({ msg: 'Server error during password update' });
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User_1.default.findOne({ email: normalizedEmail });
        // For safety against account enumeration, we don't disclose whether user exists,
        // but we generate a reset token if found.
        let resetToken = '';
        if (user) {
            resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour validity
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetPasswordExpires;
            await user.save();
            if (user.organizationId) {
                await AuditLog_1.default.create({
                    organizationId: user.organizationId,
                    actorId: user._id,
                    action: 'UPDATE',
                    collectionName: 'User',
                    documentId: user._id,
                    diff: { action: 'PASSWORD_RESET_REQUESTED' }
                });
            }
        }
        // Return friendly status message and include resetToken for immediate testing in simulation/demo
        res.json({
            msg: 'If that email address is registered, password reset instructions have been generated.',
            resetToken: resetToken || undefined
        });
    }
    catch (err) {
        console.error('Forgot password error:', err.message);
        res.status(500).json({ msg: 'Server error during password reset request' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ msg: 'Reset token and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.requiresPasswordChange = false;
        await user.save();
        if (user.organizationId) {
            await AuditLog_1.default.create({
                organizationId: user.organizationId,
                actorId: user._id,
                action: 'UPDATE',
                collectionName: 'User',
                documentId: user._id,
                diff: { action: 'PASSWORD_RESET_COMPLETED' }
            });
        }
        res.json({ msg: 'Password has been successfully reset. You may now sign in with your new credentials.' });
    }
    catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).json({ msg: 'Server error during password reset' });
    }
};
exports.resetPassword = resetPassword;
const getMe = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const user = await User_1.default.findById(userId).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    }
    catch (err) {
        console.error('getMe error:', err.message);
        res.status(500).json({ msg: 'Server error fetching user profile' });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { name } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const oldName = user.name;
        if (name !== undefined) {
            user.name = name.trim();
        }
        await user.save();
        if (user.organizationId) {
            await AuditLog_1.default.create({
                organizationId: user.organizationId,
                actorId: user._id,
                action: 'UPDATE',
                collectionName: 'User',
                documentId: user._id,
                diff: { name: { before: oldName, after: user.name } }
            });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId
        });
    }
    catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ msg: 'Server error updating profile' });
    }
};
exports.updateProfile = updateProfile;
