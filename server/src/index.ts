import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import scanRoutes from './routes/scan';
import moodRoutes from './routes/mood';
import studentRoutes from './routes/student';
import toolkitRoutes from './routes/toolkit';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ──────────────────────────────────────────
// Helmet sets various HTTP headers to protect against common attacks
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disable CSP for SSE streaming compatibility
}));

// Rate limiting — prevents abuse (100 requests per 15 min per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Stricter rate limit for AI scan endpoint (10 per 15 min)
const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI scan rate limit reached. Please wait before scanning again.' },
});

// Strict rate limit for authentication endpoints (20 per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

app.use('/api', apiLimiter);
app.use('/api/scan', scanLimiter);
app.use('/api/auth', authLimiter);

// ─── CORS ─────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (process.env.NODE_ENV === 'development') {
        callback(null, true); // Allow all in dev
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' })); // Limit payload size

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/toolkit', toolkitRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MindSpace API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────
async function start(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🧠 MindSpace API running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Scan:   POST http://localhost:${PORT}/api/scan`);
    console.log(`   Moods:  http://localhost:${PORT}/api/moods`);
    console.log(`   Students: http://localhost:${PORT}/api/students\n`);
  });
}

start().catch((err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
