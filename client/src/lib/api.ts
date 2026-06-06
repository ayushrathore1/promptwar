// ─── API Client for MindSpace Backend ────────────────────────────
// Communicates with Express backend on Render (or localhost:3001 in dev)

import { type IStudent, type IMoodEntry, type IMicroAction, type MindScanParams, type AgentStatus, type WeeklyPattern, type ExamType } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Auth Token Management ──────────────────────────────────────
const TOKEN_KEY = 'mindspace_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ─── Fetch Helpers ───────────────────────────────────────────────
async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const authHeaders = getAuthHeaders();
  const mergedHeaders = {
    ...authHeaders,
    ...(options?.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Student API ─────────────────────────────────────────────────
export async function fetchStudents(): Promise<IStudent[]> {
  return fetchJSON('/api/students');
}

export async function fetchStudent(id: string): Promise<IStudent> {
  return fetchJSON(`/api/students/${id}`);
}

// ─── Mood API ────────────────────────────────────────────────────
export async function fetchMoodHistory(studentId: string): Promise<IMoodEntry[]> {
  return fetchJSON(`/api/moods/${studentId}`);
}

export async function logMood(data: {
  studentId: string;
  moodScore: number;
  moodLabel: string;
  trigger: string;
  note?: string;
}): Promise<IMoodEntry> {
  return fetchJSON('/api/moods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Toolkit API ─────────────────────────────────────────────────
export async function fetchToolkit(trigger?: string): Promise<IMicroAction[]> {
  const query = trigger ? `?trigger=${encodeURIComponent(trigger)}` : '';
  return fetchJSON(`/api/toolkit${query}`);
}

// ─── MindScan SSE Client ────────────────────────────────────────
export interface MindScanCallbacks {
  onAgentStatus: (agents: AgentStatus[]) => void;
  onBurnoutData: (data: WeeklyPattern) => void;
  onStreamStart: () => void;
  onToken: (content: string) => void;
  onStreamError: (message: string) => void;
  onComplete: (data: { burnoutScore: number }) => void;
  onError: (error: Error) => void;
}

export function startMindScan(params: MindScanParams, callbacks: MindScanCallbacks): AbortController {
  const controller = new AbortController();

  fetch(`${API_URL}/api/scan`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(params),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Scan failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ') && currentEvent) {
            try {
              const data = JSON.parse(line.slice(6));
              switch (currentEvent) {
                case 'agent-status':
                  callbacks.onAgentStatus(data.agents);
                  break;
                case 'burnout-data':
                  callbacks.onBurnoutData(data);
                  break;
                case 'stream-start':
                  callbacks.onStreamStart();
                  break;
                case 'token':
                  callbacks.onToken(data.content);
                  break;
                case 'stream-error':
                  callbacks.onStreamError(data.message);
                  break;
                case 'complete':
                  callbacks.onComplete(data);
                  break;
                case 'error':
                  callbacks.onError(new Error(data.message));
                  break;
              }
            } catch {
              // Skip malformed JSON
            }
            currentEvent = '';
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        callbacks.onError(err);
      }
    });

  return controller;
}

// ─── Auth API ────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  student: IStudent;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return fetchJSON('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  exam: ExamType;
  city?: string;
}): Promise<AuthResponse> {
  return fetchJSON('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function quickLogin(exam: ExamType): Promise<AuthResponse> {
  return fetchJSON(`/api/auth/quick-login/${exam}`, {
    method: 'POST',
  });
}

export async function verifyToken(): Promise<{ student: IStudent }> {
  const token = getStoredToken();
  if (!token) throw new Error('No token');
  return fetchJSON('/api/auth/me', {
    headers: { ...getAuthHeaders() },
  });
}
