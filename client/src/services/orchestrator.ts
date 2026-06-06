// ─── Client Orchestrator — SSE Bridge to Backend ─────────────────
// Connects WellnessMissionControl UI callbacks to the backend's
// /api/scan SSE endpoint. No AI keys in the browser.

import { startMindScan } from '../lib/api';
import {
  type IStudent,
  type IMoodEntry,
  type MoodScore,
  type MoodLabel,
  type TriggerType,
  type WeeklyPattern,
  type MissionControlResult,
  type AgentStatus,
} from '../types';

export interface OrchestratorCallbacks {
  onStatusChange?: (
    agentName: 'patternScout' | 'burnoutAnalyst' | 'microCoach',
    status: 'pending' | 'running' | 'complete' | 'error',
    result?: unknown
  ) => void;
  onPatternScoutToken?: (token: string) => void;
  onMicroCoachToken?: (token: string) => void;
}

/**
 * Runs the Wellness Mission Control scan via the backend SSE endpoint.
 * The server runs 3 Groq AI agents in parallel and streams results back.
 */
export async function runWellnessOrchestrator(
  student: IStudent,
  _moodHistory: IMoodEntry[],
  currentEntry: {
    moodScore: MoodScore;
    moodLabel: MoodLabel;
    trigger: TriggerType;
    note?: string;
  },
  callbacks?: OrchestratorCallbacks
): Promise<MissionControlResult> {
  return new Promise<MissionControlResult>((resolve, reject) => {
    let patternResult = '';
    let coachResult = '';
    let burnoutData: WeeklyPattern | undefined;
    let finalBurnoutScore = 50;

    // Map SSE agent names to callback keys
    const agentNameMap: Record<string, 'patternScout' | 'burnoutAnalyst' | 'microCoach'> = {
      'Pattern Scout': 'patternScout',
      'Burnout Analyst': 'burnoutAnalyst',
      'Micro-Coach': 'microCoach',
    };

    const controller = startMindScan(
      {
        studentId: student._id || '',
        moodScore: currentEntry.moodScore,
        moodLabel: currentEntry.moodLabel,
        trigger: currentEntry.trigger,
        note: currentEntry.note,
      },
      {
        onAgentStatus: (agents: AgentStatus[]) => {
          agents.forEach((agent) => {
            const key = agentNameMap[agent.name];
            if (key && callbacks?.onStatusChange) {
              callbacks.onStatusChange(key, agent.status, agent.result);
            }
            // Capture results from completed agents
            if (agent.status === 'complete' && agent.result) {
              if (agent.name === 'Pattern Scout') {
                patternResult = agent.result as string;
              } else if (agent.name === 'Micro-Coach') {
                coachResult = agent.result as string;
              }
            }
          });
        },

        onBurnoutData: (data: WeeklyPattern) => {
          burnoutData = data;
          callbacks?.onStatusChange?.('burnoutAnalyst', 'complete', data);
        },

        onStreamStart: () => {
          // Stream tokens will follow
        },

        onToken: (content: string) => {
          // Route tokens to the Pattern Scout stream display
          callbacks?.onPatternScoutToken?.(content);
          // Also append to the Micro-Coach display
          callbacks?.onMicroCoachToken?.(content);
        },

        onStreamError: (message: string) => {
          console.warn('Stream error from server:', message);
        },

        onComplete: (data: { burnoutScore: number }) => {
          finalBurnoutScore = data.burnoutScore;

          resolve({
            patternScout: {
              status: 'fulfilled',
              result: patternResult,
            },
            burnoutAnalyst: {
              status: 'fulfilled',
              result: burnoutData || {
                dominantMood: 'Unknown',
                triggerHotspot: currentEntry.trigger,
                burnoutRiskScore: finalBurnoutScore,
                weekSummary: 'Analysis complete.',
                recommendedFocus: 'Continue tracking your mood daily.',
              },
            },
            microCoach: {
              status: 'fulfilled',
              result: coachResult,
            },
          });
        },

        onError: (error: Error) => {
          console.error('SSE connection error:', error);

          // Resolve with error states instead of rejecting
          // so the UI can show fallback content
          resolve({
            patternScout: { status: 'rejected' },
            burnoutAnalyst: { status: 'rejected' },
            microCoach: { status: 'rejected' },
          });
        },
      }
    );

    // Safety timeout — 30 seconds max
    setTimeout(() => {
      controller.abort();
      reject(new Error('MindScan timed out after 30 seconds'));
    }, 30000);
  });
}
