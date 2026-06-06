# MindSpace — Antigravity Build Plan
### AI-Powered Mental Wellness App for Indian Exam Students

---

## 1. THE 3-COLUMN CANVAS

| CORE LOOP | AI LAYER | WOW MOMENT |
|---|---|---|
| Student taps → logs mood (5-tap emoji scale) | Gemini reads mood + exam context, surfaces a personalised insight instantly | Streaming "MindScan" — AI narrates the student's emotional pattern live, word by word, as if it's thinking alongside them |
| Student picks a stress trigger from a visual wheel | Gemini cross-references triggers + mood history to detect burnout risk | An "Exam Burnout Risk" score that updates in real time as tokens stream in |
| Student reads/listens to a personalised micro-action (30-second task) | Gemini generates a hyper-specific action — not generic advice, tuned to exam name, date proximity, and mood | The micro-action feels written *for them*, not copy-pasted from a wellness blog |

**Rules verified:**
- ✅ Core Loop completable in 3 actions (tap mood → pick trigger → read action)
- ✅ AI Layer is visible — streaming text, live score, named agent pipeline
- ✅ Wow Moment demonstrable in under 45 seconds on stage

---

## 2. PROJECT CONTEXT — CONTEXT.md

```
# Project Context — MindSpace

## Product Vision
MindSpace helps Indian students preparing for NEET, JEE, CUET, CAT, GATE, UPSC,
and board exams track their mood, identify stress triggers, and receive
hyper-personalised AI wellness support — right when they need it most.

## The Hero Feature
The "MindScan" — a Gemini-powered streaming emotional analysis that reads the
student's mood log + trigger selection and narrates a personalised insight +
a concrete 30-second micro-action. This must stream visibly, feel personal,
and finish in under 20 seconds. Everything else in the app is secondary.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS (dark mode default, zinc/slate base palette)
- Google AI Studio / Gemini 2.0 Flash API (streaming enabled)
- Antigravity component library / scaffolding

## Design System Rules
- Dark mode only: background #0f0f13, card surface #18181f, border #2a2a35
- Primary accent: Google Blue #4285F4
- Secondary accents: Calm Teal #1DB8A4, Warm Amber #F5A623, Alert Coral #E8593C
- All AI responses stream visibly — never show a static spinner alone
- Streaming text has a pulsing cursor and a soft glow on the last rendered line
- Every empty state has an illustration or an encouraging prompt
- Mobile-first responsive (375px → 768px → 1280px)
- No gradients, no heavy shadows — flat and calm

## Tone & UX Voice
Warm, grounding, slightly poetic — like a trusted senior who has been through
the same exams and genuinely cares. Never clinical. Never preachy.
Uses "you" language. Acknowledges difficulty before offering help.

## Target Users
Students aged 16–28 preparing for:
NEET | JEE (Main + Advanced) | CUET | CAT | GATE | UPSC (Prelims + Mains) | State Board Exams

## Indian Context Rules (apply everywhere)
- Use ₹ denomination for any financial references
- Names: regional diversity — Tamil, Bengali, Gujarati, Punjabi, Marathi, UP/Bihar backgrounds
- Exam dates and result seasons are emotionally loaded moments — treat them with care
- Avoid toxic positivity ("you can do it!" energy) — opt for honest, grounded support

## Core Screens
1. Dashboard / Home — mood ring + streak + quick MindScan trigger
2. Mood Logger — 5-point emoji scale + one-word label
3. Trigger Wheel — visual radial selector of stress sources
4. MindScan — streaming AI insight panel (the hero)
5. History — mood timeline + pattern chart (weekly view)
6. Toolkit — saved micro-actions + breathing exercises

## What This App Is NOT
- Not a therapy replacement — always recommend professional help for serious distress
- Not a productivity tracker — no study hours, no target scores
- Not generic — every AI output must reference the student's actual exam, mood, and trigger
```

---

## 3. THE 4-AGENT BUILD SETUP

### Agent Alpha — The Architect
> Open Tab 1. This agent only makes decisions and writes specs. Never ask it to write code.

**Prompt:**
```
You are a senior product architect. Given this problem statement:

"Students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and board exams face
acute stress, burnout, self-doubt, and anxiety — especially during exam season
and result periods. They need a tool that helps them track mood, identify stress
triggers, reflect emotionally, and receive personalised AI wellness support."

And this app concept: MindSpace — a dark-mode React + Gemini 2.0 Flash app.

Write the complete TypeScript interface definitions and component tree for a
production React application. Output as a structured spec document with:

1. All TypeScript interfaces (MoodEntry, TriggerType, MindScanResult, 
   StudentProfile, WeeklyPattern)
2. Full component tree with prop types
3. Gemini API response shapes (streaming + structured JSON)
4. State management structure (what lives in global state vs component state)
5. Route structure (/dashboard, /log, /scan, /history, /toolkit)
6. The exact system prompt architecture for the MindScan feature

Output only the spec document. No code. No explanations.
```

---

### Agent Beta — The UI Builder
> Open Tab 2. Feed it Alpha's output. Only visual components — no API logic.

**Prompt:**
```
You are a senior React/Tailwind UI engineer. Using this exact component spec:

[PASTE ALPHA'S OUTPUT HERE]

Build all React components with Tailwind CSS. Requirements:

DESIGN SYSTEM:
- Background: #0f0f13, Card surface: #18181f, Border: #2a2a35
- Primary: #4285F4 (Google Blue), Teal: #1DB8A4, Amber: #F5A623, Coral: #E8593C
- Dark mode only — no light mode

COMPONENTS TO BUILD:
1. MoodRing — circular 5-point emoji mood selector with tap animation
   (emojis: 😰 😟 😐 🙂 😌 mapped to Overwhelmed/Anxious/Okay/Good/Calm)
2. TriggerWheel — radial selector with 8 triggers:
   (Syllabus pressure | Mock test scores | Family expectations | 
    Comparison with peers | Sleep issues | Physical health | 
    Time management | Result anxiety)
3. MindScanPanel — streaming text display with pulsing cursor + glow on last line
4. MoodTimeline — weekly horizontal chart with emoji markers
5. StreakBadge — current daily check-in streak with flame icon
6. MicroActionCard — card showing a 30-second personalised action with 
   a "Done ✓" tap
7. ExamContextBanner — top banner showing student's exam + days remaining
8. BurnoutRiskMeter — animated arc meter (0–100) with colour zones

STYLE RULES:
- Skeleton loading states on every data-dependent component (animate-pulse shimmer)
- Micro-animations: scale-105 on hover, transition-all duration-200
- Mobile-first, responsive at sm/md/lg breakpoints
- Every interactive element has active and disabled states
- Use lucide-react for all icons
- Every button has aria-label, every input has a label

Do NOT write API logic. Return only the visual components as complete .tsx files.
```

---

### Agent Gamma — The Brain
> Open Tab 3. Handles all Gemini API integration and logic.

**Prompt:**
```
You are building the AI integration layer for MindSpace — a mental wellness app
for Indian exam students (NEET, JEE, CUET, CAT, GATE, UPSC, board exams).

Here is the component structure: [PASTE ALPHA'S OUTPUT HERE]

Write the complete Gemini 2.0 Flash API integration using the AI SDK with:

1. STREAMING MINDSCAN (core feature):
   - Use streamGenerateContent
   - System prompt must reference: exam name, mood score, trigger type, 
     days to exam, streak count
   - Output: personalised insight (2–3 sentences) + one 30-second micro-action
   - The micro-action must be specific to the trigger 
     (e.g. if trigger = "Family expectations" → a breathing + boundary script,
      not a generic "take a walk")
   - Stream tokens word by word — show cursor while streaming

2. MULTI-AGENT ORCHESTRATOR (the wow moment panel):
   Build a MoodOrchestrator with 3 parallel Gemini calls:
   - Agent "Pattern Scout": analyses last 7 days mood history, finds the 
     dominant emotional pattern
   - Agent "Burnout Analyst": computes burnout risk (0–100) based on 
     trigger frequency + mood dips + streak
   - Agent "Micro-Coach": generates the personalised 30-second action
   Show a live "Wellness Mission Control" panel with each agent's status 
   (pending → running → complete) using Promise.allSettled()
   Each agent has a name, icon (lucide), and specialty label

3. STRUCTURED OUTPUT — Weekly Pattern Analysis:
   JSON mode with this schema:
   {
     "dominantMood": string,
     "triggerHotspot": string,
     "burnoutRiskScore": number (0-100),
     "weekSummary": string (1 sentence),
     "recommendedFocus": string
   }

4. SYSTEM PROMPTS — make every response feel branded:
   System prompt template:
   "You are a compassionate academic wellness companion for Indian students.
    The student is preparing for {examName} on {examDate} ({daysRemaining} days away).
    Their mood today: {moodLabel} ({moodScore}/5).
    Their stress trigger: {triggerType}.
    Their check-in streak: {streakDays} days.
    Respond in a warm, grounding tone. Acknowledge difficulty before offering help.
    Never use toxic positivity. Be specific — reference their exam and trigger directly.
    Keep insight to 2-3 sentences. Micro-action must be doable in 30 seconds."

5. ERROR HANDLING:
   - API timeout > 8s: show "Taking a moment to think..." with breathing animation
   - Network error: "MindSpace works offline too — here's a saved tip"
   - Fallback: serve a pre-cached micro-action from the local toolkit

Include complete prompt engineering for each AI feature.
Return as complete .ts service files.
```

---

### Agent Delta — The Polisher
> Open Tab 4. Finds and fixes everything before demo.

**Prompt:**
```
Review this complete React + Gemini application: [PASTE MERGED CODE HERE]

Your job is to find and fix:

1. HARDCODED VALUES → make dynamic:
   - Exam name must come from student profile (default: "JEE Main")
   - Days remaining must calculate from actual exam date
   - Mood history must pull from localStorage or state

2. MISSING STATES — add loading + error states to:
   - MindScanPanel (streaming skeleton before first token arrives)
   - MoodTimeline (shimmer while fetching history)
   - BurnoutRiskMeter (animated fill from 0 to final value)

3. MOCK DATA — generate hyper-realistic data for Indian exam students:
   - 5 student profiles: 
     Priya Venkataraman (NEET, Chennai), Arjun Sharma (JEE, Kota),
     Fatima Shaikh (CUET, Mumbai), Gurpreet Singh (GATE, Chandigarh),
     Meenakshi Iyer (UPSC, Bengaluru)
   - 14 days of mood history per student (mix of dips and recoveries)
   - At least 1 record per student showing a burnout-risk spike 
     (3 consecutive days of Overwhelmed + high Syllabus pressure trigger)
   - Streak counts: 4, 11, 2, 7, 19 (diversity, not all high)
   - MicroActions stored in toolkit: at least 6 per trigger type

4. UI POLISH:
   - ExamContextBanner must pulse amber when daysRemaining < 7
   - BurnoutRiskMeter arc must animate from 0 → value on mount (300ms ease-out)
   - MindScanPanel last streamed line must have a subtle #4285F4 left border glow
   - Empty history state: illustration of a calm student + "Your story starts today"

5. RESPONSIVE:
   - TriggerWheel must collapse from radial (desktop) to vertical list (mobile < 480px)
   - MoodOrchestrator panel must be collapsible on mobile (chevron toggle)

6. ACCESSIBILITY:
   - Every emoji in MoodRing needs aria-label ("Mood: Overwhelmed, 1 out of 5")
   - TriggerWheel items need role="radio" + aria-checked
   - MindScanPanel needs aria-live="polite" for streaming text
   - All icon buttons need aria-label

Return complete fixed files. All mock data pre-populated. Every state implemented.
```

---

## 4. THE STREAMING RESPONSE — TOKEN CASCADE

Tell Agent Gamma explicitly:

```
All Gemini responses in MindSpace must stream using the streaming API.
Build a StreamingText component that:

1. Displays text tokens as they arrive, character by character
2. Shows a pulsing cursor (#4285F4 blue, 2px wide, blinking at 0.8s interval)
   while streaming is in progress
3. The most recently completed line has a faint left border glow:
   border-left: 2px solid rgba(66, 133, 244, 0.4)
   This glow fades out as the next line begins
4. Auto-scrolls to follow new content (scrollIntoView with smooth behaviour)
5. On stream complete: cursor disappears, a soft "✦ MindScan complete" label 
   fades in at #1DB8A4 (teal)
6. The transition from loading skeleton to first token uses opacity-0 → opacity-100 
   over 200ms

This should feel like watching a trusted mentor think through your situation 
in real time — not like waiting for a loading bar.
```

---

## 5. MULTI-AGENT MISSION CONTROL PANEL

Tell Agent Gamma explicitly:

```
Build a WellnessMissionControl component that:

- Triggers when the student taps "Run MindScan"
- Breaks the scan into 3 parallel Gemini API calls:
  1. 🔍 Pattern Scout     → "Analysing your 7-day mood pattern..."
  2. ⚠️  Burnout Analyst   → "Checking your stress load..."
  3. 💡 Micro-Coach       → "Crafting your 30-second action..."

- Displays a live panel showing each agent's status:
  [pending] dimmed icon + label
  [running] pulsing blue dot + label + live token count
  [complete] green checkmark + label + 1-line result summary

- Uses Promise.allSettled() to run all 3 in parallel
- The Micro-Coach result streams into the MindScanPanel below
- The panel can be collapsed with a chevron (collapsed by default on mobile)
- Panel header: "Wellness Mission Control" with a small satellite icon

Make it look like a calm, focused command centre — not a loading screen.
Dark bg #18181f, subtle #2a2a35 borders, agents listed vertically with 16px gap.
```

---

## 6. HYPER-REALISTIC MOCK DATA

Tell Agent Delta explicitly:

```
Generate hyper-realistic mock data for MindSpace targeting Indian exam students.

Rules for realism:
- Use real Indian names from multiple regional backgrounds
- Exam dates: 30–90 days from today (relative)
- All mood logs within last 14 days
- User-generated text (journal notes) must have natural imperfections —
  slight informality, Hinglish where natural ("too much ho gaya today")
- Include status diversity: some days Overwhelmed, some Okay, some Calm —
  not a perfect recovery arc
- At least 1 student must have a visible burnout pattern the AI would flag
  (3+ consecutive Overwhelmed scores with Syllabus pressure as trigger)
- Streak counts: realistic mix — some broke their streak, some are on a run

Student profiles to generate:
1. Priya Venkataraman — NEET, Chennai, Class 12, streak: 4 days
2. Arjun Sharma — JEE Advanced, Kota coaching, streak: 11 days
3. Fatima Shaikh — CUET, Mumbai, first-gen college student, streak: 2 days
4. Gurpreet Singh — GATE (CSE), Chandigarh, working student, streak: 7 days
5. Meenakshi Iyer — UPSC Prelims, Bengaluru, 2nd attempt, streak: 19 days

Toolkit micro-actions to generate (6 per trigger = 48 total):
Triggers: Syllabus pressure | Mock scores | Family expectations | 
          Peer comparison | Sleep issues | Physical health | 
          Time management | Result anxiety

Each micro-action: title (≤6 words) + instruction (2–3 sentences, 30 seconds) 
+ duration_seconds: 30
```

---

## 7. SKELETON LOADING STATES

Tell Agent Delta explicitly:

```
Build skeleton loading components for all MindSpace data views.

Requirements:
- Animated shimmer: animate-pulse with gradient overlay (#2a2a35 → #323245)
- Skeleton shapes must match EXACT dimensions of real content
  (MoodTimeline skeleton = 7 circles + 7 connecting lines, same spacing)
- Rotating status messages every 1.5 seconds while loading MindScan:
  "Reading your emotional pattern..." 
  → "Cross-referencing your stress signals..."
  → "Tuning your personalised support..."
  → "Almost ready..."
- Messages must be exam-context-aware (not generic "Loading..." copy)
- Transition from skeleton → real content: opacity-0 to opacity-100, 300ms ease-in
- MoodRing skeleton: 5 ghost circles in a row, shimmer animation
- BurnoutRiskMeter skeleton: grey arc with pulse, no value shown
```

---

## 8. SAFE CONTENT GUARDRAILS

Include these instructions in every Agent Gamma prompt:

```
CRITICAL — Mental Health Safety Rules:
1. If mood score = 1 (Overwhelmed) for 3+ consecutive days:
   Always append: "It might help to talk to someone you trust — a friend, 
   parent, or school counsellor. You don't have to carry this alone."

2. Never suggest: "just study harder", "others have it worse", 
   "you should be grateful", or any comparison framing.

3. If trigger = "Result anxiety" and daysRemaining < 3:
   Lead with acknowledgement of the specific emotion before any suggestion.
   First sentence must validate, not advise.

4. Micro-actions must NEVER involve: avoiding sleep to study, 
   skipping meals, or excessive caffeine.

5. All AI output must end with an optional "Talk to someone 🤝" 
   soft nudge if burnoutRiskScore > 70.
```

---

## 9. DEMO SCRIPT (45 seconds on stage)

```
[0:00] Open app — show ExamContextBanner: "JEE Main — 23 days away"
[0:05] Tap mood: student picks 😰 Overwhelmed (tap animation plays)
[0:10] Trigger Wheel appears — tap "Syllabus pressure"
[0:14] MindScan begins — WellnessMissionControl panel lights up:
       Pattern Scout → running (pulsing dot)
       Burnout Analyst → running
       Micro-Coach → running
[0:20] Tokens start streaming into MindScanPanel — cursor blinks,
       last line glows blue as text appears
[0:35] All agents complete with green checkmarks
       BurnoutRiskMeter animates to 67 (amber zone)
       Streaming ends: "✦ MindScan complete" appears in teal
[0:42] Show the Micro-Action card: "Box Breathing — 30 seconds"
[0:45] Tap "Done ✓" — streak increments, confetti micro-animation
```

---

## 10. FILE STRUCTURE

```
mindspace/
├── src/
│   ├── components/
│   │   ├── MoodRing.tsx
│   │   ├── TriggerWheel.tsx
│   │   ├── MindScanPanel.tsx
│   │   ├── StreamingText.tsx
│   │   ├── WellnessMissionControl.tsx
│   │   ├── MoodTimeline.tsx
│   │   ├── BurnoutRiskMeter.tsx
│   │   ├── StreakBadge.tsx
│   │   ├── MicroActionCard.tsx
│   │   ├── ExamContextBanner.tsx
│   │   └── skeletons/
│   │       ├── MoodTimelineSkeleton.tsx
│   │       ├── MindScanSkeleton.tsx
│   │       └── BurnoutRiskSkeleton.tsx
│   ├── services/
│   │   ├── gemini.ts          ← streaming + structured output
│   │   ├── orchestrator.ts    ← multi-agent Promise.allSettled
│   │   └── fallback.ts        ← offline / error fallback actions
│   ├── data/
│   │   ├── mockStudents.ts    ← 5 hyper-realistic profiles
│   │   ├── mockMoodHistory.ts ← 14 days × 5 students
│   │   └── toolkit.ts         ← 48 micro-actions (6 per trigger)
│   ├── types/
│   │   └── index.ts           ← all TypeScript interfaces
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── MoodLogger.tsx
│   │   ├── MindScan.tsx
│   │   ├── History.tsx
│   │   └── Toolkit.tsx
│   └── App.tsx
├── CONTEXT.md                 ← paste into every agent
└── README.md
```

---

*Built for Antigravity Hackathon — MindSpace v1.0*
*Stack: React + TypeScript + Vite + Tailwind + Gemini 2.0 Flash*
