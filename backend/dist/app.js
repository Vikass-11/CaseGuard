"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const caseRoutes_1 = __importDefault(require("./routes/caseRoutes"));
const audio_routes_1 = __importDefault(require("./routes/audio.routes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
// Connect Database
(0, db_1.connectDB)();
// Enhanced Security Headers via Helmet
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'blob:'],
            connectSrc: ["'self'", process.env.CLIENT_ORIGIN || 'http://localhost:3000']
        }
    } : false
}));
// CORS Configuration with origin validation
const allowedOrigins = [
    process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://localhost:5000'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        }
        else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Request size limits
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Input sanitization against MongoDB operator injection
app.use((req, res, next) => {
    if (req.body)
        express_mongo_sanitize_1.default.sanitize(req.body);
    if (req.params)
        express_mongo_sanitize_1.default.sanitize(req.params);
    next();
});
// General API Rate Limiting (120 req / 15 minutes)
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
// Stricter Rate Limiting for Authentication Endpoints (15 attempts / 15 min)
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login or verification attempts. Please wait 15 minutes before trying again.' }
});
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
// Define API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/cases', caseRoutes_1.default);
app.use('/api/audio', audio_routes_1.default);
// Protected uploads endpoint (confidential victim recordings require session auth)
app.use('/uploads', authMiddleware_1.protect, express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CaseGuard Backend API' }));
app.get('/', (req, res) => res.json({ status: 'active', platform: 'CaseGuard Forensic API Gateway' }));
// 404 Handler for undefined routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API endpoint ${req.originalUrl} not found.` });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err?.message || err);
    const statusCode = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
    res.status(statusCode).json({
        message: err.message || 'An internal server error occurred.',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
});
exports.default = app;
