import { TriggerType } from '../types';

// ─── Pre-cached fallback micro-actions ───────────────────────────
// Used when Groq API is unavailable, times out (>8s), or errors.
const FALLBACK_ACTIONS: Record<TriggerType, { title: string; instruction: string }[]> = {
  'Syllabus pressure': [
    {
      title: 'One-Page Focus',
      instruction: 'Open your notes to one single page. Read just that page slowly. Remind yourself: you don\'t need to conquer the mountain today — just this one page.',
    },
    {
      title: 'Brain Dump',
      instruction: 'Grab a piece of paper. Write down every topic stressing you out. Now circle just ONE you can revise today. The rest can wait.',
    },
  ],
  'Mock test scores': [
    {
      title: 'Score Reframe',
      instruction: 'Write down your last mock score. Below it, write one topic you got wrong that you now understand. That gap is growth — not failure.',
    },
    {
      title: 'Error Pattern Scan',
      instruction: 'Look at your last mock. Find one silly mistake you can fix immediately. That\'s your win for today.',
    },
  ],
  'Family expectations': [
    {
      title: 'Boundary Breath',
      instruction: 'Close your eyes. Breathe in for 4 counts, hold for 4, out for 6. As you exhale, silently say: "Their love is not conditional on my rank."',
    },
    {
      title: 'Gratitude Note',
      instruction: 'Think of one thing your family does that actually supports you — even if small. Hold that thought for 10 seconds. They\'re trying too.',
    },
  ],
  'Comparison with peers': [
    {
      title: 'My-Lane Check',
      instruction: 'Put your phone face-down. Take 3 slow breaths. Remind yourself: their highlight reel is not your behind-the-scenes. You are running your own race.',
    },
    {
      title: 'Progress Recall',
      instruction: 'Think back to a topic you struggled with 3 months ago that you now understand. That\'s proof you\'re moving forward.',
    },
  ],
  'Sleep issues': [
    {
      title: '4-7-8 Wind Down',
      instruction: 'Lie down or sit comfortably. Breathe in for 4 counts, hold for 7, exhale slowly for 8. Repeat 3 times. This signals your nervous system to rest.',
    },
    {
      title: 'Screen Sunset',
      instruction: 'Set your phone brightness to minimum right now. Switch to night mode. Your eyes and brain will thank you in 20 minutes.',
    },
  ],
  'Physical health': [
    {
      title: 'Desk Stretch',
      instruction: 'Stand up. Reach both arms overhead, interlace fingers, and stretch to the left for 10 seconds, then right for 10 seconds. Roll your shoulders back 5 times.',
    },
    {
      title: 'Water Check',
      instruction: 'Drink a full glass of water right now. Dehydration affects focus more than you think. Set a reminder for 2 hours from now.',
    },
  ],
  'Time management': [
    {
      title: 'Two-Minute Rule',
      instruction: 'Pick the smallest pending task on your list — the one that takes under 2 minutes. Do it right now. Done? That momentum is real.',
    },
    {
      title: 'Priority Triangle',
      instruction: 'Write down 3 things you need to do today. Circle the one that matters most. Start with that. The other two are bonus.',
    },
  ],
  'Result anxiety': [
    {
      title: 'Ground Yourself',
      instruction: 'Touch the surface you\'re sitting on. Feel its temperature. Name 3 things you can see. Your results are in the future — you are here, now, and you are okay.',
    },
    {
      title: 'Outcome Detach',
      instruction: 'Close your eyes. Whisper to yourself: "I have done my work. The result is one chapter, not the whole story." Take 3 deep breaths.',
    },
  ],
};

// ─── Get a random fallback action for a trigger ──────────────────
export function getFallbackAction(trigger: TriggerType): { title: string; instruction: string; durationSeconds: number } {
  const actions = FALLBACK_ACTIONS[trigger] || FALLBACK_ACTIONS['Syllabus pressure'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  return { ...action, durationSeconds: 30 };
}

// ─── Get fallback MindScan text ──────────────────────────────────
export function getFallbackInsight(trigger: TriggerType, moodLabel: string): string {
  const action = getFallbackAction(trigger);
  return `MindSpace is working offline right now, but here's something that might help. Feeling ${moodLabel.toLowerCase()} about "${trigger}" is completely valid — you're not alone in this.\n\n✦ 30-Second Action: ${action.title}\n${action.instruction}`;
}
