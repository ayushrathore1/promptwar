# Engineering MindSpace: A Multi-Agent AI Mental Wellness Platform for Indian Exam Students

*How we built a secure, high-contrast, offline-resilient wellness dashboard that delivers personalized emotional insights and 30-second micro-resets.*

---

## The Challenge

Indian competitive exams like **NEET, JEE, UPSC, GATE, CAT, and CUET** are among the most stressful in the world. Millions of students study 12–14 hours a day under intense cognitive load and emotional pressure. 

**MindSpace** was created to act as a compassionate, grounding digital companion. Our goal was to build a mental wellness web application that provides:
1. **Low-friction mood logging** (completed in under 3 taps).
2. **AI MindScan**: An immersive, streaming insight engine analyzing the student's mood, stress triggers, and exam dates.
3. **Wellness Mission Control**: A multi-agent AI system analyzing weekly burnout risk and patterns.
4. **Actionable micro-steps**: 30-second hyper-specific exercises.

---

## 🏗️ Architecture & Component Design

MindSpace is built on a modern full-stack TypeScript architecture:
- **Client**: React (19), TypeScript, Tailwind CSS (v4), Vitest + JSDOM for unit testing.
- **Server**: Express.js, Mongoose/MongoDB, JWT Session Authentication, Groq API (Llama-3.3-70b-versatile) with SSE (Server-Sent Events) streaming.

```
mindspace/
├── client/                     # React + Tailwind Frontend
│   ├── src/
│   │   ├── components/         # MoodRing, TriggerWheel, BurnoutRiskMeter, StreamingText...
│   │   ├── services/           # fallback.ts, orchestrator.ts, gemini.ts
│   │   ├── test/               # Vitest suite (25/25 unit tests)
│   │   └── App.tsx             # Secure profile switching & core state
└── server/                     # Node + Express Backend
    ├── src/
    │   ├── middlewares/        # authMiddleware.ts, IDOR validation
    │   ├── routes/             # auth.ts, mood.ts, scan.ts, student.ts
    │   └── services/           # AuthService.ts, orchestrator.ts (Groq LLM streaming)
```

---

## 🧠 Multi-Agent Orchestration & The Streaming "MindScan"

The core feature of MindSpace is the **Wellness Mission Control** panel, powered by three specialized AI agents executed in parallel:

1. **🔍 Pattern Scout**: Analyzes the student's 14-day history, mapping recovery curves and stress triggers to find dominant mood clusters.
2. **⚠️ Burnout Analyst**: Computes a numeric burnout risk score ($0-100$) based on streak duration, consecutive overwhelmed check-ins, and trigger patterns.
3. **💡 Micro-Coach**: Synthesizes the overall state into a customized 30-second reset exercise tailored specifically to their exam (e.g., box breathing for NEET exam anxiety, boundary-setting scripts for family expectations).

### Server-Sent Events (SSE) Token Cascade

To minimize perceived latency and ensure an engaging experience, the server streams the AI tokens as they arrive. We built a custom **`StreamingText`** component on the client that:
- Appends new tokens instantly.
- Displays a pulsing primary-blue cursor.
- Adds a faint left border glow (`border-left: 2px solid rgba(66, 133, 244, 0.4)`) to the active line.
- Auto-scrolls smoothly to follow the text stream.

---

## 🔒 Security Hardening

Security and student data privacy are crucial when dealing with mental wellness:
1. **Encapsulated Authentication**: All validation, hashing (12-round bcrypt), and JWT token signing are isolated within a dedicated `AuthService.ts`.
2. **Strict Route Security**: Applied token authentication and an **Insecure Direct Object Reference (IDOR)** prevention middleware (`requireStudentMatch`) across all `/api/mood`, `/api/student`, and `/api/scan` endpoints.
3. **Brute-Force Prevention**: Enforced strict rate-limiting on auth routes using `express-rate-limit`.

---

## 🎨 Accessibility & Legibility

To make MindSpace usable by everyone, we followed **WCAG 2.1 compliance** standards:
- **Contrast Ratios**: Replaced all low-contrast elements with brand-compliant CSS color variables (`text-brand-text` for titles and `text-brand-text-secondary` for body text), ensuring great readability in light-theme mode.
- **ARIA Elements**: Replaced custom non-semantic selectors with fully accessible toggle buttons using `aria-pressed`, `role="radio"`, and `aria-checked` states.
- **Live Regions**: Configured `aria-live="polite"` on the streaming MindScan panel so screen readers dynamically announce text arrivals.

---

## 🧪 Verification & Health Check

Quality was verified via strict local compile environments and comprehensive test suites:
- **TypeScript**: Complete type coverage across client & server (`npx tsc --noEmit` returns **0 errors**).
- **Client Tests**: 25/25 unit tests passing (covering the custom Burnout Risk Meter, Mood Ring selector, and custom types).
- **Server Tests**: 6/6 unit tests passing (covering login validation, password strength validation, and session switching).

---

*Built with care for the Antigravity Hackathon.*
