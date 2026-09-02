import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ organizationId: req.user.organizationId }).select('-passwordHash');
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

    await AuditLog.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'CREATE', collectionName: 'User', documentId: newUser._id });
    
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

    await AuditLog.create({ organizationId: req.user.organizationId, actorId: req.user._id, action: 'UPDATE', collectionName: 'User', documentId: user._id });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (id === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own account');
    }

    const user = await User.findOneAndDelete({ _id: id, organizationId: req.user.organizationId });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await AuditLog.create({ 
      organizationId: req.user.organizationId, 
      actorId: req.user._id, 
      action: 'DELETE', 
      collectionName: 'User', 
      documentId: user._id 
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};


export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find({ organizationId: req.user.organizationId }).sort({ timestamp: -1 }).populate('actorId', 'name email');
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
