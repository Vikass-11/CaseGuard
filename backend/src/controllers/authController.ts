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

    // Since this handles "orgName", we create a new Organization
    const newOrg = await Organization.create([{ name: orgName || 'Default Org' }], { session });
    const organizationId = newOrg[0]._id;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{
      name,
      email,
      passwordHash,
      organizationId,
      role: 'ADMIN' // The creator of an org becomes the ADMIN
    }], { session });

    user = newUsers[0];

    const payload = {
      id: user.id,
      role: user.role,
      organizationId: user.organizationId
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
      organizationId: user.organizationId
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    res.json({ token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
