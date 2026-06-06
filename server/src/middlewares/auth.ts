import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mindspace-dev-secret-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    studentId: string;
  };
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; studentId: string };
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to verify that the request's target student matches the authenticated user's studentId.
 * Prevents Insecure Direct Object Reference (IDOR) vulnerabilities.
 */
export function requireStudentMatch(paramName: string = 'studentId') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const targetStudentId = req.params[paramName] || req.body[paramName];
    if (!targetStudentId) {
      res.status(400).json({ error: 'Student identifier missing' });
      return;
    }

    if (targetStudentId.toString() !== authReq.user.studentId.toString()) {
      res.status(403).json({ error: 'Access denied: student profile mismatch' });
      return;
    }

    next();
  };
}
