export const TRIGGER_TYPES = [
  'Syllabus pressure',
  'Mock test scores',
  'Family expectations',
  'Comparison with peers',
  'Sleep issues',
  'Physical health',
  'Time management',
  'Result anxiety',
] as const;

export type TriggerType = typeof TRIGGER_TYPES[number];

export const MOOD_LABELS = ['Overwhelmed', 'Anxious', 'Okay', 'Good', 'Calm'] as const;
export type MoodLabel = typeof MOOD_LABELS[number];
export type MoodScore = 1 | 2 | 3 | 4 | 5;

export const MOOD_EMOJIS: Record<MoodScore, string> = {
  1: '😰',
  2: '😟',
  3: '😐',
  4: '🙂',
  5: '😌',
};

export const EXAM_TYPES = ['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC'] as const;
export type ExamType = typeof EXAM_TYPES[number];

export interface IStudent {
  _id?: string;
  name: string;
  exam: ExamType;
  examDate: string; // ISO string or date representation on client
  city: string;
  streak: number;
  lastCheckIn: string | null;
  background: string;
}

export interface IMoodEntry {
  _id?: string;
  studentId: string;
  moodScore: MoodScore;
  moodLabel: MoodLabel;
  trigger: TriggerType;
  note?: string;
  createdAt: string;
}

export interface IMicroAction {
  _id?: string;
  trigger: TriggerType;
  title: string;
  instruction: string;
  durationSeconds: number;
}

export interface AgentStatus {
  name: string;
  icon: string;
  specialty: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  result?: string;
  tokenCount?: number;
}

export interface MindScanParams {
  studentId: string;
  moodScore: MoodScore;
  moodLabel: MoodLabel;
  trigger: TriggerType;
  note?: string;
}

export interface WeeklyPattern {
  dominantMood: string;
  triggerHotspot: string;
  burnoutRiskScore: number;
  weekSummary: string;
  recommendedFocus: string;
}

export interface MissionControlResult {
  patternScout: {
    status: 'fulfilled' | 'rejected';
    result?: string;
  };
  burnoutAnalyst: {
    status: 'fulfilled' | 'rejected';
    result?: WeeklyPattern;
  };
  microCoach: {
    status: 'fulfilled' | 'rejected';
    result?: string;
  };
}
