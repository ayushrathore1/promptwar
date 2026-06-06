// ─── DEPRECATED ──────────────────────────────────────────────────
// This file previously contained direct Gemini API calls from the browser.
// All AI processing now happens server-side via Groq through the
// /api/scan SSE endpoint. See: services/orchestrator.ts + lib/api.ts
//
// Security: API keys must never be exposed in client-side code.
// ─────────────────────────────────────────────────────────────────

// Re-export the simulateTokenStream utility for fallback use
export async function simulateTokenStream(
  text: string,
  onToken: (token: string) => void,
  delayMs = 25
): Promise<string> {
  const words = text.split(/(\s+)/);
  for (const word of words) {
    if (word) {
      onToken(word);
      const jitter = Math.random() * 20 - 10;
      await new Promise((resolve) => setTimeout(resolve, Math.max(5, delayMs + jitter)));
    }
  }
  return text;
}
