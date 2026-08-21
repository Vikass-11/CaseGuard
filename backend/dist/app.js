"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect Database
(0, db_1.connectDB)();
// Init Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Define Routes
app.use('/api/auth', authRoutes_1.default);
app.get('/', (req, res) => res.send('API Running'));
exports.default = app;
