import { Router, Request, Response } from 'express';
import { runMissionControl } from '../services/orchestrator';
import { getFallbackInsight } from '../services/fallback';
import { MoodScore, MoodLabel, TriggerType } from '../types';
import { authMiddleware, requireStudentMatch } from '../middlewares/auth';

const router = Router();

// POST /api/scan — Streaming MindScan via SSE (IDOR check: body studentId matches token studentId)
router.post('/', authMiddleware, requireStudentMatch('studentId'), async (req: Request, res: Response) => {
  const { studentId, moodScore, moodLabel, trigger } = req.body as {
    studentId: string;
    moodScore: MoodScore;
    moodLabel: MoodLabel;
    trigger: TriggerType;
  };

  if (!studentId || !moodScore || !moodLabel || !trigger) {
    res.status(400).json({ error: 'Missing required fields: studentId, moodScore, moodLabel, trigger' });
    return;
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Timeout handling — if >15s total, close gracefully
  const timeout = setTimeout(() => {
    const fallback = getFallbackInsight(trigger, moodLabel);
    res.write(`event: token\ndata: ${JSON.stringify({ content: fallback })}\n\n`);
    res.write(`event: complete\ndata: ${JSON.stringify({ burnoutScore: 50 })}\n\n`);
    res.end();
  }, 15000);

  try {
    await runMissionControl({ studentId, moodScore, moodLabel, trigger }, res);
  } catch (error) {
    console.error('MindScan error:', error);
    const fallback = getFallbackInsight(trigger, moodLabel);
    res.write(`event: stream-error\ndata: ${JSON.stringify({ message: 'AI unavailable — showing saved insight' })}\n\n`);
    res.write(`event: token\ndata: ${JSON.stringify({ content: fallback })}\n\n`);
    res.write(`event: complete\ndata: ${JSON.stringify({ burnoutScore: 50 })}\n\n`);
  } finally {
    clearTimeout(timeout);
    res.end();
  }
});

export default router;
