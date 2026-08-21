"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Organization_1 = __importDefault(require("../models/Organization"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const register = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, email, password, orgName } = req.body;
        let user = await User_1.default.findOne({ email }).session(session);
        if (user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Since this handles "orgName", we create a new Organization
        const newOrg = await Organization_1.default.create([{ name: orgName || 'Default Org' }], { session });
        const organizationId = newOrg[0]._id;
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUsers = await User_1.default.create([{
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
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ token });
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            id: user.id,
            role: user.role,
            organizationId: user.organizationId
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.login = login;
