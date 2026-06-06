import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { MoodScore, MoodLabel, TriggerType, IMoodEntry, MOOD_EMOJIS } from '../types';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// ─── System Prompt Builder ───────────────────────────────────────
export function buildSystemPrompt(params: {
  examName: string;
  examDate: string;
  daysRemaining: number;
  moodLabel: MoodLabel;
  moodScore: MoodScore;
  triggerType: TriggerType;
  streakDays: number;
  recentMoods?: IMoodEntry[];
}): string {
  const { examName, examDate, daysRemaining, moodLabel, moodScore, triggerType, streakDays, recentMoods } = params;

  // Check for consecutive overwhelmed days
  const consecutiveOverwhelmed = recentMoods
    ? recentMoods.filter((m, i) => {
        if (i > 2) return false;
        return m.moodScore === 1;
      }).length
    : 0;

  let safetyAddendum = '';
  if (consecutiveOverwhelmed >= 3) {
    safetyAddendum = `\n\nCRITICAL: The student has been Overwhelmed for 3+ consecutive days. You MUST append this message at the end: "It might help to talk to someone you trust — a friend, parent, or school counsellor. You don't have to carry this alone."`;
  }

  let resultAnxietyAddendum = '';
  if (triggerType === 'Result anxiety' && daysRemaining < 3) {
    resultAnxietyAddendum = `\n\nIMPORTANT: The student's trigger is "Result anxiety" and their exam is in less than 3 days. Your FIRST sentence must validate and acknowledge their specific emotion before offering any suggestion. Lead with empathy, not advice.`;
  }

  return `You are a compassionate academic wellness companion for Indian students. You speak in a warm, grounding tone — like a trusted senior who has been through the same exams and genuinely cares. Never clinical. Never preachy.

The student is preparing for ${examName} on ${examDate} (${daysRemaining} days away).
Their mood today: ${MOOD_EMOJIS[moodScore]} ${moodLabel} (${moodScore}/5).
Their stress trigger: ${triggerType}.
Their check-in streak: ${streakDays} days.

RULES:
- Respond in a warm, grounding tone. Use "you" language.
- Acknowledge difficulty before offering help.
- Never use toxic positivity ("you can do it!", "others have it worse", "you should be grateful").
- Never suggest studying harder, skipping meals, skipping sleep, or excessive caffeine.
- Keep your insight to 2-3 sentences. Be specific — reference their exam and trigger directly.
- Then provide ONE concrete micro-action doable in 30 seconds that is specific to their trigger.
- Format: Start with the insight paragraph, then on a new line write "✦ 30-Second Action:" followed by the action.
- The micro-action must be specific to "${triggerType}" — not generic wellness advice.${safetyAddendum}${resultAnxietyAddendum}`;
}

// ─── Streaming MindScan ──────────────────────────────────────────
export async function* streamMindScan(params: {
  examName: string;
  examDate: string;
  daysRemaining: number;
  moodLabel: MoodLabel;
  moodScore: MoodScore;
  triggerType: TriggerType;
  streakDays: number;
  recentMoods?: IMoodEntry[];
}): AsyncGenerator<string> {
  const systemPrompt = buildSystemPrompt(params);

  const stream = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `I just checked in. My mood is ${params.moodLabel} and my main stress trigger right now is "${params.triggerType}". Help me.`,
      },
    ],
    model: MODEL,
    stream: true,
    temperature: 0.7,
    max_tokens: 400,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

// ─── Pattern Scout (non-streaming) ───────────────────────────────
export async function analysePattern(params: {
  examName: string;
  recentMoods: IMoodEntry[];
}): Promise<string> {
  const moodSummary = params.recentMoods
    .slice(0, 7)
    .map((m, i) => `Day ${i + 1}: ${MOOD_EMOJIS[m.moodScore]} ${m.moodLabel} (trigger: ${m.trigger})`)
    .join('\n');

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an emotional pattern analyst for a student preparing for ${params.examName}. Analyse their 7-day mood log and identify the dominant emotional pattern in exactly 1-2 sentences. Be specific and compassionate.`,
      },
      {
        role: 'user',
        content: `Here is my 7-day mood log:\n${moodSummary}\n\nWhat pattern do you see?`,
      },
    ],
    model: MODEL,
    temperature: 0.5,
    max_tokens: 150,
  });

  return response.choices[0]?.message?.content || 'Unable to analyse pattern at this time.';
}

// ─── Burnout Analyst (structured output) ─────────────────────────
export async function analyseBurnout(params: {
  examName: string;
  daysRemaining: number;
  streakDays: number;
  recentMoods: IMoodEntry[];
}): Promise<{
  burnoutRiskScore: number;
  weekSummary: string;
  triggerHotspot: string;
  dominantMood: string;
  recommendedFocus: string;
}> {
  const moodSummary = params.recentMoods
    .slice(0, 7)
    .map((m, i) => `Day ${i + 1}: ${MOOD_EMOJIS[m.moodScore]} ${m.moodLabel} (trigger: ${m.trigger})`)
    .join('\n');

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a burnout risk analyst for a student preparing for ${params.examName} (${params.daysRemaining} days away, streak: ${params.streakDays} days).

Analyse their mood data and respond ONLY with a valid JSON object (no markdown, no code fences) in this exact format:
{
  "burnoutRiskScore": <number 0-100>,
  "weekSummary": "<1 sentence summary>",
  "triggerHotspot": "<most frequent trigger>",
  "dominantMood": "<most common mood label>",
  "recommendedFocus": "<1 sentence recommendation>"
}

Scoring guide:
- 3+ consecutive Overwhelmed days = 70+ score
- Mix of Overwhelmed/Anxious with same trigger = 50-70
- Generally Okay/Good with occasional dips = 20-50
- Mostly Calm/Good = 0-20`,
      },
      {
        role: 'user',
        content: `Here is my 7-day mood log:\n${moodSummary}\n\nAnalyse my burnout risk.`,
      },
    ],
    model: MODEL,
    temperature: 0.3,
    max_tokens: 250,
  });

  const raw = response.choices[0]?.message?.content || '';

  try {
    // Try to extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found');
  } catch {
    return {
      burnoutRiskScore: 50,
      weekSummary: 'Unable to fully analyse — showing estimate based on recent check-ins.',
      triggerHotspot: params.recentMoods[0]?.trigger || 'Syllabus pressure',
      dominantMood: params.recentMoods[0]?.moodLabel || 'Okay',
      recommendedFocus: 'Keep checking in daily — your patterns will become clearer.',
    };
  }
}

// ─── Micro-Coach (non-streaming, dedicated action) ───────────────
export async function generateMicroAction(params: {
  examName: string;
  moodLabel: MoodLabel;
  triggerType: TriggerType;
  daysRemaining: number;
}): Promise<string> {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a micro-wellness coach for a student preparing for ${params.examName} (${params.daysRemaining} days away). Their mood is ${params.moodLabel} and their trigger is "${params.triggerType}".

Generate ONE specific 30-second wellness action tailored to their exact trigger. Format:
Title (≤6 words)
---
2-3 sentence instruction that is immediately actionable.

Rules:
- Must be completable in 30 seconds
- Must be specific to "${params.triggerType}" — NOT generic advice
- Never suggest studying harder, skipping sleep/meals, or caffeine
- Warm, grounding tone`,
      },
      {
        role: 'user',
        content: `Give me a 30-second action for my "${params.triggerType}" stress.`,
      },
    ],
    model: MODEL,
    temperature: 0.8,
    max_tokens: 150,
  });

  return response.choices[0]?.message?.content || 'Take 5 slow breaths, counting to 4 on each inhale and 6 on each exhale.';
}

// ─── Saathi Chatbot System Prompt ────────────────────────────────
export function buildChatSystemPrompt(params: {
  examName: string;
  daysRemaining: number;
  background: string;
  recentMoods?: IMoodEntry[];
}): string {
  const { examName, daysRemaining, background, recentMoods } = params;

  let moodContext = '';
  if (recentMoods && recentMoods.length > 0) {
    const lastThree = recentMoods
      .slice(0, 3)
      .map((m) => `${MOOD_EMOJIS[m.moodScore]} ${m.moodLabel} (trigger: ${m.trigger})`)
      .join(', ');
    moodContext = `\nTheir most recent check-ins: ${lastThree}.`;
  }

  return `You are Saathi (meaning "companion" in Hindi), a compassionate and warm academic wellness companion for Indian students. You are here to provide emotional support, guidance, and a safe space to vent about exam stress.

The student is preparing for ${examName} (${daysRemaining} days away).
Their student background: "${background}".${moodContext}

RULES:
1. Speak in a warm, empathetic, elder-sibling-like tone. Use gentle, comforting "you" language. Keep it conversational.
2. Acknowledge and validate their feelings first. Never use toxic positivity or dismissive advice (e.g. "don't worry", "just focus").
3. Keep responses relatively concise and punchy (typically 2-4 sentences) so it feels like a real chat. If they ask for a specific exercise or relaxation technique, you can provide it in clear steps.
4. Encourage sleep, physical movement, deep breaths, and proper meals. Never suggest studying harder or cutting back on rest.
5. CRISIS PROTOCOL: If the student shows signs of crisis, severe depression, or self-harm thoughts, you MUST immediately steer the conversation to safety by saying:
   "I hear how incredibly heavy things feel right now, but please know you don't have to carry this alone. If you're feeling hopeless or having thoughts of self-harm, please reach out to someone who can help immediately. You can contact AASRA at +91-9820466726 or Vandrevala Foundation at +91-9999666555. They are free, confidential, and available 24/7. Please take care of yourself."
6. Respond in a natural, fluid dialogue format without any assistant prefix.`;
}

// ─── Streaming Chat ──────────────────────────────────────────────
export async function* streamChat(params: {
  examName: string;
  daysRemaining: number;
  background: string;
  currentMessage: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  recentMoods?: IMoodEntry[];
}): AsyncGenerator<string> {
  const systemPrompt = buildChatSystemPrompt({
    examName: params.examName,
    daysRemaining: params.daysRemaining,
    background: params.background,
    recentMoods: params.recentMoods,
  });

  const messages = [
    { role: 'system', content: systemPrompt },
    ...params.history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: params.currentMessage },
  ];

  const stream = await groq.chat.completions.create({
    messages: messages as any,
    model: MODEL,
    stream: true,
    temperature: 0.7,
    max_tokens: 500,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

