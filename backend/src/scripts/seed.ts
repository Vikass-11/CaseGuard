import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Organization from '../models/Organization';
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
    // Clear existing data (bypassing Mongoose hooks)
    await Organization.collection.deleteMany({});
    await User.collection.deleteMany({});
    await Case.collection.deleteMany({});
    await CaseInput.collection.deleteMany({});
    await CaseStatement.collection.deleteMany({});
    await Prediction.collection.deleteMany({});
    await TimelineEvent.collection.deleteMany({});

    // Create users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create a shared Default Org
    const newOrgs = await Organization.create([{ name: 'Default Org' }]);
    const orgId = newOrgs[0]._id;

    const admin = await User.create({
      organizationId: orgId,
      name: 'Admin User',
      email: 'admin@caseguard.com',
      passwordHash,
      role: 'ADMIN',
    });

    const worker = await User.create({
      organizationId: orgId,
      name: 'Case Worker',
      email: 'worker@caseguard.com',
      passwordHash,
      role: 'CASE_WORKER',
    });

    // Create a sample case 1
    const sampleCase1 = await Case.create({
      organizationId: orgId,
      title: 'Jenkins Domestic Dispute - Escalation Report',
      status: 'INTAKE',
      createdBy: worker._id,
    });

    await CaseInput.create({
      caseId: sampleCase1._id,
      relationshipType: 'Spouse (Married 5 years)',
      incidentFrequency: 'Weekly (Escalating)',
      priorComplaints: true,
    });

    await CaseStatement.create({
      caseId: sampleCase1._id,
      originalText: 'The incidents have been escalating over the last six months...',
      anonymizedText: 'The incidents have been escalating over the last six months. On Tuesday evening around 8:00 PM, [Abuser] came home intoxicated and began screaming about finances. When I tried to leave the room, he grabbed my arm forcefully, leaving bruises, and blocked the doorway so I could not exit. He threatened that if I ever tried to call the police, he would make sure I never saw our children again.',
      entities: [{ type: 'PERSON', value: '[Abuser]' }]
    });

    await Prediction.create({
      caseId: sampleCase1._id,
      severity: 'Severe',
      escalationScore: 85,
      escalationLevel: 'High',
      patterns: ['Coercive Control', 'Isolation', 'Threats'],
      triggers: ['Repeated Complaints', 'Fear Indicators']
    });

    // Create a sample case 2
    const sampleCase2 = await Case.create({
      organizationId: orgId,
      title: 'Smith Financial Abuse & Harassment',
      status: 'ANALYSIS',
      createdBy: worker._id,
    });

    await CaseInput.create({
      caseId: sampleCase2._id,
      relationshipType: 'Ex-Partner',
      incidentFrequency: 'Daily (Digital Harassment)',
      priorComplaints: false,
    });

    await CaseStatement.create({
      caseId: sampleCase2._id,
      originalText: 'He keeps texting me from different numbers...',
      anonymizedText: 'He keeps texting me from different numbers after I blocked him. He also logged into my bank account and transferred all the money to a joint account I cannot access, leaving me unable to pay rent.',
      entities: [{ type: 'PERSON', value: '[Abuser]' }]
    });

    await Prediction.create({
      caseId: sampleCase2._id,
      severity: 'Moderate',
      escalationScore: 60,
      escalationLevel: 'Medium',
      patterns: ['Financial Abuse', 'Digital Stalking'],
      triggers: ['Financial Control', 'Persistent Contact']
    });

    // Create a sample case 3
    const sampleCase3 = await Case.create({
      organizationId: orgId,
      title: 'Doe Custody Violation & Threats',
      status: 'REVIEW',
      createdBy: worker._id,
    });

    await CaseInput.create({
      caseId: sampleCase3._id,
      relationshipType: 'Co-parent',
      incidentFrequency: 'Monthly (During Custody Exchange)',
      priorComplaints: true,
    });

    await CaseStatement.create({
      caseId: sampleCase3._id,
      originalText: 'During the custody exchange on Sunday, he refused to hand over...',
      anonymizedText: 'During the custody exchange on Sunday, he refused to hand over our child at the agreed time. He started yelling at me in the parking lot and said he would take the kids out of state if I try to get a lawyer.',
      entities: [{ type: 'PERSON', value: '[Abuser]' }]
    });

    await Prediction.create({
      caseId: sampleCase3._id,
      severity: 'Life-Threatening',
      escalationScore: 92,
      escalationLevel: 'High',
      patterns: ['Child Weaponization', 'Flight Risk', 'Public Altercation'],
      triggers: ['Custody Violation', 'Threat of Kidnapping']
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error: any) {
    console.error(`Error seeding data:`, error);
    process.exit(1);
  }
};

seedData();
