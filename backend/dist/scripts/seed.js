"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Case_1 = __importDefault(require("../models/Case"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
const Prediction_1 = __importDefault(require("../models/Prediction"));
const TimelineEvent_1 = __importDefault(require("../models/TimelineEvent"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard');
        console.log('MongoDB Connected');
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
const seedData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await User_1.default.deleteMany();
        await Case_1.default.deleteMany();
        await CaseInput_1.default.deleteMany();
        await CaseStatement_1.default.deleteMany();
        await Prediction_1.default.deleteMany();
        await TimelineEvent_1.default.deleteMany();
        // Create users
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash('password123', salt);
        const admin = await User_1.default.create({
            name: 'Admin User',
            email: 'admin@caseguard.com',
            passwordHash,
            role: 'admin',
        });
        const worker = await User_1.default.create({
            name: 'Case Worker',
            email: 'worker@caseguard.com',
            passwordHash,
            role: 'case_worker',
        });
        // Create a sample case
        const sampleCase = await Case_1.default.create({
            title: 'Jenkins Domestic Dispute - Escalation Report',
            status: 'open',
            assignedTo: worker._id,
            createdBy: worker._id,
        });
        await CaseInput_1.default.create({
            caseId: sampleCase._id,
            relationshipType: 'Spouse (Married 5 years)',
            incidentFrequency: 'Weekly (Escalating)',
            priorComplaints: true,
        });
        await CaseStatement_1.default.create({
            caseId: sampleCase._id,
            originalText: 'The incidents have been escalating over the last six months...',
            anonymizedText: 'The incidents have been escalating over the last six months. On Tuesday evening around 8:00 PM, [Abuser] came home intoxicated and began screaming about finances. When I tried to leave the room, he grabbed my arm forcefully, leaving bruises, and blocked the doorway so I could not exit. He threatened that if I ever tried to call the police, he would make sure I never saw our children again.',
            entities: [{ type: 'PERSON', value: '[Abuser]' }]
        });
        await Prediction_1.default.create({
            caseId: sampleCase._id,
            severity: 'Severe',
            escalationScore: 85,
            escalationLevel: 'High',
            patterns: ['Coercive Control', 'Isolation', 'Threats'],
            triggers: ['Repeated Complaints', 'Fear Indicators']
        });
        console.log('Database seeded successfully!');
        process.exit();
    }
    catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};
seedData();
