import { Router, Request, Response } from 'express';
import { Student } from '../models/Student';
import { MoodEntry } from '../models/MoodEntry';
import { streamChat } from '../services/groq';
import { authMiddleware, requireStudentMatch } from '../middlewares/auth';
import { IMoodEntry } from '../types';

const router = Router();

// POST /api/chat — Streaming chat with Saathi via SSE
router.post('/', authMiddleware, requireStudentMatch('studentId'), async (req: Request, res: Response) => {
  const { studentId, message, history } = req.body as {
    studentId: string;
    message: string;
    history: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!studentId || !message || !Array.isArray(history)) {
    res.status(400).json({ error: 'Missing or invalid fields: studentId, message, history' });
    return;
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Timeout handling — if >30s, end connection
  const timeout = setTimeout(() => {
    res.write(`event: token\ndata: ${JSON.stringify({ content: '\n\n(Chat session timed out. Please try sending a message again.)' })}\n\n`);
    res.write(`event: complete\ndata: {}\n\n`);
    res.end();
  }, 30000);

  try {
    // Fetch student profile for system prompt context
    const student = await Student.findById(studentId);
    if (!student) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'Student profile not found.' })}\n\n`);
      res.end();
      return;
    }

    // Fetch recent mood history (last 14 days) for context
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentMoods = await MoodEntry.find({
      studentId: student._id,
      createdAt: { $gte: fourteenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .lean() as unknown as IMoodEntry[];

    const daysRemaining = Math.max(0, Math.ceil((student.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    const stream = streamChat({
      examName: student.exam,
      daysRemaining,
      background: student.background,
      currentMessage: message,
      history,
      recentMoods,
    });

    for await (const token of stream) {
      res.write(`event: token\ndata: ${JSON.stringify({ content: token })}\n\n`);
    }

    res.write(`event: complete\ndata: {}\n\n`);
  } catch (error) {
    console.error('Saathi chat error:', error);
    res.write(`event: error\ndata: ${JSON.stringify({ message: 'Saathi is resting right now. Please try again in a bit.' })}\n\n`);
  } finally {
    clearTimeout(timeout);
    res.end();
  }
});

export default router;
