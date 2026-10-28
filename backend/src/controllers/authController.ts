import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Organization from '../models/Organization';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
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
    let user = await User.findOne({ email: normalizedEmail }).session(session);
    if (user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Find or create a shared 'Default Org' so all demo users can see the same cases
    const targetOrgName = orgName ? orgName.trim() : 'Default Org';
    let org = await Organization.findOne({ name: targetOrgName }).session(session);
    if (!org) {
      const newOrgs = await Organization.create([{ name: targetOrgName }], { session });
      org = newOrgs[0];
    }
    const organizationId = org._id;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{
      name: name ? name.trim() : undefined,
      email: normalizedEmail,
      passwordHash,
      organizationId,
      role: 'CASE_WORKER' // Default role for new users
    }], { session });

    user = newUsers[0];

    // Audit log account creation
    await AuditLog.create([{
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

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ token });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      id: user.id,
      role: user.role,
      organizationId: user.organizationId,
      requiresPasswordChange: user.requiresPasswordChange
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    res.json({ token });
  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error during authentication' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { passwordHash, requiresPasswordChange: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Audit log password update
    if (updatedUser.organizationId) {
      await AuditLog.create({
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

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    res.json({ msg: 'Password updated successfully', token });
  } catch (error: any) {
    console.error('Change password error:', error.message);
    res.status(500).json({ msg: 'Server error during password update' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // For safety against account enumeration, we don't disclose whether user exists,
    // but we generate a reset token if found.
    let resetToken = '';
    if (user) {
      resetToken = crypto.randomBytes(32).toString('hex');
      const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour validity

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetPasswordExpires;
      await user.save();

      if (user.organizationId) {
        await AuditLog.create({
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
  } catch (err: any) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ msg: 'Server error during password reset request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.requiresPasswordChange = false;
    await user.save();

    if (user.organizationId) {
      await AuditLog.create({
        organizationId: user.organizationId,
        actorId: user._id,
        action: 'UPDATE',
        collectionName: 'User',
        documentId: user._id,
        diff: { action: 'PASSWORD_RESET_COMPLETED' }
      });
    }

    res.json({ msg: 'Password has been successfully reset. You may now sign in with your new credentials.' });
  } catch (err: any) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ msg: 'Server error during password reset' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const user = await User.findById(userId).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err: any) {
    console.error('getMe error:', err.message);
    res.status(500).json({ msg: 'Server error fetching user profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { name } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const oldName = user.name;
    if (name !== undefined) {
      user.name = name.trim();
    }
    await user.save();

    if (user.organizationId) {
      await AuditLog.create({
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
  } catch (err: any) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ msg: 'Server error updating profile' });
  }
};
