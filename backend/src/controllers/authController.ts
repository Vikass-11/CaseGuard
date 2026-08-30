import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Organization from '../models/Organization';
import User from '../models/User';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, email, password, orgName } = req.body;

    let user = await User.findOne({ email }).session(session);
    if (user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Find or create a shared 'Default Org' so all demo users can see the same cases
    let org = await Organization.findOne({ name: 'Default Org' }).session(session);
    if (!org) {
      const newOrgs = await Organization.create([{ name: 'Default Org' }], { session });
      org = newOrgs[0];
    }
    const organizationId = org._id;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{
      name,
      email,
      passwordHash,
      organizationId,
      role: 'CASE_WORKER' // Default role for new users
    }], { session });

    user = newUsers[0];

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
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
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
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    // Assuming authMiddleware has set req.user
    const userId = (req as any).user._id;
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

    // Generate new token reflecting requiresPasswordChange: false
    const payload = {
      id: updatedUser.id,
      role: updatedUser.role,
      organizationId: updatedUser.organizationId,
      requiresPasswordChange: updatedUser.requiresPasswordChange
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    res.json({ msg: 'Password updated successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
