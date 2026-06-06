import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ExamType } from '../types';

const router = Router();

// ─── POST /api/auth/register ─────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, exam, city, background } = req.body;

    const session = await AuthService.register({
      email,
      password,
      name,
      exam,
      city,
      background,
    });

    res.status(201).json({
      token: session.token,
      student: session.student.toObject(),
    });
  } catch (error: any) {
    const message = error.message || 'Registration failed';
    // Match common bad request errors to return 400
    if (
      message.includes('required') ||
      message.includes('at least') ||
      message.includes('exists') ||
      message.includes('Invalid exam')
    ) {
      res.status(400).json({ error: message });
    } else {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const session = await AuthService.login(email, password);
    res.json({
      token: session.token,
      student: session.student.toObject(),
    });
  } catch (error: any) {
    const message = error.message || 'Login failed';
    if (message.includes('required')) {
      res.status(400).json({ error: message });
    } else if (message.includes('Invalid email or password')) {
      res.status(401).json({ error: message });
    } else if (message.includes('not found')) {
      res.status(404).json({ error: message });
    } else {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  }
});

// ─── POST /api/auth/quick-login/:exam ────────────────────────────
router.post('/quick-login/:exam', async (req: Request, res: Response) => {
  try {
    const examParam = (req.params.exam as string).toUpperCase() as ExamType;
    const session = await AuthService.quickLogin(examParam);
    res.json({
      token: session.token,
      student: session.student.toObject(),
    });
  } catch (error: any) {
    const message = error.message || 'Quick login failed';
    if (message.includes('Invalid exam')) {
      res.status(400).json({ error: message });
    } else {
      console.error('Quick login error:', error);
      res.status(500).json({ error: 'Quick login failed' });
    }
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const student = await AuthService.verifyToken(token);
    res.json({ student: student.toObject() });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.message.includes('expired')) {
      res.status(401).json({ error: 'Invalid or expired token' });
    } else if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Token verification failed' });
    }
  }
});

export default router;
