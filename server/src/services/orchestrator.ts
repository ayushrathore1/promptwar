import { MoodEntry } from '../models/MoodEntry';
import { Student } from '../models/Student';
import { analysePattern, analyseBurnout, generateMicroAction, streamMindScan } from './groq';
import { MoodLabel, MoodScore, TriggerType, IMoodEntry, WeeklyPattern } from '../types';
import { Response } from 'express';

interface OrchestratorParams {
  studentId: string;
  moodScore: MoodScore;
  moodLabel: MoodLabel;
  trigger: TriggerType;
}

// ─── SSE Helper ──────────────────────────────────────────────────
function sendSSE(res: Response, event: string, data: any): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// ─── Mission Control Orchestrator ────────────────────────────────
export async function runMissionControl(params: OrchestratorParams, res: Response): Promise<void> {
  const { studentId, moodScore, moodLabel, trigger } = params;

  // Fetch student profile
  const student = await Student.findById(studentId);
  if (!student) {
    sendSSE(res, 'error', { message: 'Student not found' });
    return;
  }

  // Fetch recent mood history (last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const recentMoods = await MoodEntry.find({
    studentId: student._id,
    createdAt: { $gte: fourteenDaysAgo },
  })
    .sort({ createdAt: -1 })
    .lean() as unknown as IMoodEntry[];

  const daysRemaining = Math.max(0, Math.ceil((student.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  // ─── Signal all agents as pending ──────────────────────────────
  sendSSE(res, 'agent-status', {
    agents: [
      { name: 'Pattern Scout', icon: 'Search', specialty: 'Mood pattern analysis', status: 'pending' },
      { name: 'Burnout Analyst', icon: 'AlertTriangle', specialty: 'Stress load assessment', status: 'pending' },
      { name: 'Micro-Coach', icon: 'Lightbulb', specialty: 'Personalised action', status: 'pending' },
    ],
  });

  // ─── Launch all 3 agents in parallel ───────────────────────────
  // Signal running
  sendSSE(res, 'agent-status', {
    agents: [
      { name: 'Pattern Scout', icon: 'Search', specialty: 'Mood pattern analysis', status: 'running' },
      { name: 'Burnout Analyst', icon: 'AlertTriangle', specialty: 'Stress load assessment', status: 'running' },
      { name: 'Micro-Coach', icon: 'Lightbulb', specialty: 'Personalised action', status: 'running' },
    ],
  });

  const [patternResult, burnoutResult, coachResult] = await Promise.allSettled([
    // Agent 1: Pattern Scout
    analysePattern({
      examName: student.exam,
      recentMoods: recentMoods,
    }),

    // Agent 2: Burnout Analyst
    analyseBurnout({
      examName: student.exam,
      daysRemaining,
      streakDays: student.streak,
      recentMoods: recentMoods,
    }),

    // Agent 3: Micro-Coach
    generateMicroAction({
      examName: student.exam,
      moodLabel,
      triggerType: trigger,
      daysRemaining,
    }),
  ]);

  // ─── Send agent results ────────────────────────────────────────
  const agents = [
    {
      name: 'Pattern Scout',
      icon: 'Search',
      specialty: 'Mood pattern analysis',
      status: patternResult.status === 'fulfilled' ? 'complete' : 'error',
      result: patternResult.status === 'fulfilled' ? patternResult.value : 'Unable to analyse pattern',
    },
    {
      name: 'Burnout Analyst',
      icon: 'AlertTriangle',
      specialty: 'Stress load assessment',
      status: burnoutResult.status === 'fulfilled' ? 'complete' : 'error',
      result: burnoutResult.status === 'fulfilled' ? burnoutResult.value : null,
    },
    {
      name: 'Micro-Coach',
      icon: 'Lightbulb',
      specialty: 'Personalised action',
      status: coachResult.status === 'fulfilled' ? 'complete' : 'error',
      result: coachResult.status === 'fulfilled' ? coachResult.value : 'Unable to generate action',
    },
  ];

  sendSSE(res, 'agent-status', { agents });

  // Send burnout data separately for the meter
  if (burnoutResult.status === 'fulfilled') {
    sendSSE(res, 'burnout-data', burnoutResult.value);
  }

  // ─── Stream the main MindScan insight ──────────────────────────
  sendSSE(res, 'stream-start', {});

  try {
    const stream = streamMindScan({
      examName: student.exam,
      examDate: student.examDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      daysRemaining,
      moodLabel,
      moodScore,
      triggerType: trigger,
      streakDays: student.streak,
      recentMoods: recentMoods,
    });

    for await (const token of stream) {
      sendSSE(res, 'token', { content: token });
    }
  } catch (error) {
    console.error('Streaming error:', error);
    sendSSE(res, 'stream-error', { message: 'Stream interrupted — showing fallback' });
  }

  // ─── Signal complete ───────────────────────────────────────────
  sendSSE(res, 'complete', {
    burnoutScore: burnoutResult.status === 'fulfilled'
      ? (burnoutResult.value as WeeklyPattern).burnoutRiskScore
      : 50,
  });
}
