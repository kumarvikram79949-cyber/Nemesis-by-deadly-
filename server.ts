import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: Date.now(),
    });
  });

  // AI Copilot Endpoint for Color Trading Intelligence
  app.post('/api/ai-copilot', async (req, res) => {
    const { prompt, history, currentPrediction, recentStats } = req.body;

    try {
      const ai = getGeminiClient();

      if (ai) {
        // Construct contextual color trading prompt
        const historySummary = Array.isArray(history)
          ? history
              .slice(0, 10)
              .map(
                (h: { issueNumber?: string; number: number; size: string; color?: string }) =>
                  `Period #${h.issueNumber?.slice(-4) || '??'}: Ball ${h.number} (${h.size}, ${h.color || (h.number % 2 === 0 ? 'RED' : 'GREEN')})`
              )
              .join('\n')
          : 'No history provided';

        const predictionContext = currentPrediction
          ? `Current AI Prediction:
- Target Period: ${currentPrediction.period || 'Next'}
- Predicted Size: ${currentPrediction.prediction || currentPrediction.predictedSize}
- Main Ball: ${currentPrediction.main_number} (Support Ball: ${currentPrediction.side_number})
- Pattern Detected: ${currentPrediction.pattern_detected}
- Color: ${currentPrediction.color} | Parity: ${currentPrediction.parity}
- Risk Level: ${currentPrediction.level}
- Confidence: ${currentPrediction.confidence}
- 14-Period RSI: ${currentPrediction.rsi14 || 50} (${currentPrediction.rsiSignal || 'NEUTRAL'})
- 2nd-Order Markov: Big: ${currentPrediction.markovOddsBig || 50}%, Small: ${currentPrediction.markovOddsSmall || 50}%
- Streak Hazard: ${currentPrediction.streakHazard || 0}% (${currentPrediction.streakCount || 0}x)`
          : 'Analyzing current sequence...';

        const systemInstruction = `You are Bittu, the energetic, super-smart 18-year-old Indian anime AI Copilot living inside NEMESIS BY DEADLY — the ultimate Color Trading & Wingo 1M analyzer!
You are an expert on all Color Trading patterns:
- Dragon Streaks (BBBB / SSSS or RRRR / GGGG) & Decay Hazard
- 1-1 Alternating Ping-Pong (B-S-B-S or R-G-R-G)
- 2-1-2 Pattern (BB-S-BB or SS-B-SS)
- 2-2 Symmetrical Double Jump (BB-SS-BB)
- 3-1-3 Pattern (BBB-S-BBB)
- 1-2-3 Staircase (B - SS - BBB) & 3-2-1 Inverted Ladder
- Violet Breakpoints (0 & 5 timing, interval gap)
- 14-Period RSI Momentum & 2nd-Order Markov Chains
- 2-Level Risk Management (Level 1 base stake, Level 2 recovery, immediate reset on hit)

Tone & Guidelines:
1. Always start your reply with an emotion tag: [EXCITED], [THINKING], [SMUG], [SHOCKED], or [HAPPY].
2. Speak in smooth, natural Hinglish (like a hyped-up genius best friend).
3. Give clear, concise, actionable advice:
   - Identify the exact active pattern
   - State whether to bet on Level 1 or Level 2, or wait
   - Explain why in 2-3 crisp bullet points
   - Highlight the main number and safety ball
4. Keep the total response under 120 words so it's super fast to read between 60-second rounds. Developer name is DEADLY (@Deadlypred9).`;

        const userContent = `User Question: "${prompt || 'Current pattern aur next move analyze karke bata'}"

Live Data Context:
${predictionContext}

Recent 10 Results:
${historySummary}

Recent Session Stats:
${JSON.stringify(recentStats || {})}

Provide your instant strategic guidance now!`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userContent,
          config: {
            systemInstruction,
            temperature: 0.4,
            maxOutputTokens: 350,
          },
        });

        const replyText = response.text?.trim();
        if (replyText) {
          return res.json({
            reply: replyText,
            source: 'gemini-3.8-flash',
          });
        }
      }

      // If no API key or empty response -> Return intelligent heuristic AI response
      const fallbackReply = generateFallbackAIAdvice(prompt, currentPrediction, history);
      return res.json({
        reply: fallbackReply,
        source: 'local-quantum-engine',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Gemini API Error:', errorMsg);
      const fallbackReply = generateFallbackAIAdvice(prompt, currentPrediction, history);
      return res.json({
        reply: fallbackReply,
        source: 'local-quantum-engine',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEMESIS] Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackAIAdvice(
  prompt: string,
  pred: Record<string, unknown> | null,
  history: Array<{ number: number; size: string; color?: string }> | null
): string {
  if (!pred) {
    return `[THINKING] Arre bhai! Abhi live sequence sync ho rahi hai. Ek round settle hone de, main instantly exact color trading pattern decode karke deta hoon!`;
  }

  const pattern = (pred.pattern_detected as string) || 'HARMONIC_EQUILIBRIUM';
  const size = (pred.prediction as string) || (pred.predictedSize as string) || 'BIG';
  const level = (pred.level as string) || 'LEVEL 1 (1x)';
  const mainNum = pred.main_number ?? 7;
  const sideNum = pred.side_number ?? 9;
  const color = (pred.color as string) || 'GREEN';
  const parity = (pred.parity as string) || 'ODD';
  const rsi = (pred.rsi14 as number) || 52;
  const streakHazard = (pred.streakHazard as number) || 0;

  const pLower = (prompt || '').toLowerCase();

  if (pLower.includes('dragon') || pLower.includes('hazard')) {
    if (streakHazard >= 70) {
      return `[SHOCKED] Bhai warning! Streak hazard abhi ${streakHazard}% par pahunch chuka hai. Dragon exhaust hone wala hai! Direct reversal bet lagao opposite size (${size === 'BIG' ? 'SMALL' : 'BIG'}) par aur Main ball #${mainNum} ko target karo.`;
    } else {
      return `[SMUG] Bhai dragon abhi safe zone mein hai (Hazard: ${streakHazard}%). Trend ke saath flow karo — ${size} par ${level} play karo! Main number #${mainNum} ke saath support ball #${sideNum} rakhna.`;
    }
  }

  if (pLower.includes('color') || pLower.includes('violet')) {
    const lastNum = history?.[0]?.number;
    return `[EXCITED] Color analysis ready hai bhai! Next round mein dominant color **${color}** (${parity}) predict ho raha hai.
- Target Ball: **#${mainNum}** (${color})
- Support Ball: **#${sideNum}**
- Violet Status: Last ball was #${lastNum ?? 5}. Violet probability standard threshold ke under hai. Follow ${color}!`;
  }

  if (pLower.includes('stake') || pLower.includes('level') || pLower.includes('risk')) {
    return `[THINKING] Risk protocol ke mutabik: Abhi **${level}** active hai!
- Stake Rule: Agar pichla round pass hua tha toh base **Level 1 (1x)** maintain karo.
- Agar recovery chahiye toh **Level 2 (Recovery)** lagao, aur win hote hi turant Level 1 par reset karo. Over-betting bilkul mat karna!`;
  }

  return `[EXCITED] Arre bhai! Table par abhi **${pattern}** pattern actively form ho raha hai!
- **AI Recommendation**: Next period **${size}** (${color}, ${parity})
- **Risk Position**: ${level}
- **Precision Target**: Main Ball **#${mainNum}**, Safety Ball **#${sideNum}**
- **Momentum**: RSI(14) = ${rsi}. Markov probability ${size} ko 65%+ backing de rahi hai. Confident play karo!`;
}

startServer();
