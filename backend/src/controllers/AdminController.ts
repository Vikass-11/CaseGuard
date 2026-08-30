import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, registrationNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    // Use registrationNumber as password
    const passwordHash = await bcrypt.hash(registrationNumber || 'password123', salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      organizationId: req.user.organizationId,
      role: role || 'CASE_WORKER',
      registrationNumber,
      requiresPasswordChange: true
    });

    await AuditLog.create({ userId: req.user._id, action: 'CREATE_USER', entityType: 'User', entityId: newUser._id });
    
    // Return user without password
    const userResponse = await User.findById(newUser._id).select('-passwordHash');
    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await AuditLog.create({ userId: req.user._id, action: 'UPDATE_USER_ROLE', entityType: 'User', entityId: user._id });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).populate('userId', 'name email');
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
