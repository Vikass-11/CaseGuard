import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

const ALLOWED_ROLES = ['ADMIN', 'LAWYER', 'CASE_WORKER'];

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ organizationId: req.user.organizationId })
      .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, registrationNumber } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const assignedRole = role && ALLOWED_ROLES.includes(role.toUpperCase()) 
      ? role.toUpperCase() 
      : 'CASE_WORKER';

    const salt = await bcrypt.genSalt(10);
    // Use registrationNumber as password if provided, otherwise standard temporary password
    const initialPassword = registrationNumber && registrationNumber.trim().length >= 6 
      ? registrationNumber.trim() 
      : 'SecurePass123!';
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    const newUser = await User.create({
      name: name ? name.trim() : undefined,
      email: normalizedEmail,
      passwordHash,
      organizationId: req.user.organizationId,
      role: assignedRole,
      registrationNumber: registrationNumber ? registrationNumber.trim() : undefined,
      requiresPasswordChange: true
    });

    await AuditLog.create({ 
      organizationId: req.user.organizationId, 
      actorId: req.user._id, 
      action: 'CREATE', 
      collectionName: 'User', 
      documentId: newUser._id,
      diff: { role: assignedRole, email: normalizedEmail }
    });
    
    const userResponse = await User.findById(newUser._id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !ALLOWED_ROLES.includes(role.toUpperCase())) {
      return res.status(400).json({ message: `Invalid role. Allowed roles are: ${ALLOWED_ROLES.join(', ')}` });
    }

    const targetRole = role.toUpperCase();

    // Prevent sole admin from demoting themselves
    if (id === req.user._id.toString() && targetRole !== 'ADMIN') {
      const adminCount = await User.countDocuments({
        organizationId: req.user.organizationId,
        role: 'ADMIN'
      });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot demote the sole remaining administrator for this organization.' });
      }
    }

    // Security check: Ensure user belongs to the same organization (Tenant Isolation)
    const existingUser = await User.findOne({ _id: id, organizationId: req.user.organizationId });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found in your organization' });
    }

    const oldRole = existingUser.role;
    existingUser.role = targetRole;
    await existingUser.save();

    await AuditLog.create({ 
      organizationId: req.user.organizationId, 
      actorId: req.user._id, 
      action: 'UPDATE', 
      collectionName: 'User', 
      documentId: existingUser._id,
      diff: { role: { before: oldRole, after: targetRole } }
    });

    const sanitizedUser = await User.findById(existingUser._id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    res.json(sanitizedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Verify tenant and user existence
    const user = await User.findOne({ _id: id, organizationId: req.user.organizationId });
    if (!user) {
      return res.status(404).json({ message: 'User not found in your organization' });
    }

    // If deleting an admin, ensure at least one admin remains
    if (user.role === 'ADMIN') {
      const adminCount = await User.countDocuments({
        organizationId: req.user.organizationId,
        role: 'ADMIN'
      });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the sole administrator for this organization.' });
      }
    }

    await User.deleteOne({ _id: id, organizationId: req.user.organizationId });

    await AuditLog.create({ 
      organizationId: req.user.organizationId, 
      actorId: req.user._id, 
      action: 'DELETE', 
      collectionName: 'User', 
      documentId: user._id,
      diff: { email: user.email, role: user.role }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find({ organizationId: req.user.organizationId })
      .sort({ timestamp: -1 })
      .limit(200)
      .populate('actorId', 'name email role');
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getEvalMetrics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const Prediction = (await import('../models/Prediction')).default;
    const Recommendation = (await import('../models/Recommendation')).default;
    
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
  } catch (error) {
    next(error);
  }
};
