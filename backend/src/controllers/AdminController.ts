import { Response, NextFunction } from 'express';
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
