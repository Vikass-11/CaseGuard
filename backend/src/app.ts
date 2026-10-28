import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import caseRoutes from './routes/caseRoutes';
import audioRoutes from './routes/audio.routes';
import { protect } from './middleware/authMiddleware';

const app = express();

// Connect Database
connectDB();

// Enhanced Security Headers via Helmet
app.use(helmet({
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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization against MongoDB operator injection
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// General API Rate Limiting (120 req / 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Stricter Rate Limiting for Authentication Endpoints (15 attempts / 15 min)
const authLimiter = rateLimit({
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/audio', audioRoutes);

// Protected uploads endpoint (confidential victim recordings require session auth)
app.use('/uploads', protect, express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CaseGuard Backend API' }));
app.get('/', (req, res) => res.json({ status: 'active', platform: 'CaseGuard Forensic API Gateway' }));

// 404 Handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err?.message || err);
  const statusCode = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  res.status(statusCode).json({
    message: err.message || 'An internal server error occurred.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

export default app;
