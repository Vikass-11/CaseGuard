import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Case from '../models/Case';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import Prediction from '../models/Prediction';
import TimelineEvent from '../models/TimelineEvent';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard');
    console.log('MongoDB Connected');
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Case.deleteMany();
    await CaseInput.deleteMany();
    await CaseStatement.deleteMany();
    await Prediction.deleteMany();
    await TimelineEvent.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@caseguard.com',
      passwordHash,
      role: 'admin',
    });

    const worker = await User.create({
      name: 'Case Worker',
      email: 'worker@caseguard.com',
      passwordHash,
      role: 'case_worker',
    });

    // Create a sample case
    const sampleCase = await Case.create({
      title: 'Jenkins Domestic Dispute - Escalation Report',
      status: 'open',
      assignedTo: worker._id,
      createdBy: worker._id,
    });

    await CaseInput.create({
      caseId: sampleCase._id,
      relationshipType: 'Spouse (Married 5 years)',
      incidentFrequency: 'Weekly (Escalating)',
      priorComplaints: true,
    });

    await CaseStatement.create({
      caseId: sampleCase._id,
      originalText: 'The incidents have been escalating over the last six months...',
      anonymizedText: 'The incidents have been escalating over the last six months. On Tuesday evening around 8:00 PM, [Abuser] came home intoxicated and began screaming about finances. When I tried to leave the room, he grabbed my arm forcefully, leaving bruises, and blocked the doorway so I could not exit. He threatened that if I ever tried to call the police, he would make sure I never saw our children again.',
      entities: [{ type: 'PERSON', value: '[Abuser]' }]
    });

    await Prediction.create({
      caseId: sampleCase._id,
      severity: 'Severe',
      escalationScore: 85,
      escalationLevel: 'High',
      patterns: ['Coercive Control', 'Isolation', 'Threats'],
      triggers: ['Repeated Complaints', 'Fear Indicators']
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error: any) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
