import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import caseRoutes from './routes/caseRoutes';
import adminRoutes from './routes/adminRoutes';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

const app: Application = express();

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(mongoSanitize());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Health check endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.get('/api/health/db', (req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.status(200).json({ status: 'UP', database: 'connected' });
  } else {
    res.status(503).json({ status: 'DOWN', database: 'disconnected' });
  }
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to CaseGuard API' });
});

// Global error handler
app.use(errorHandler);

export default app;
