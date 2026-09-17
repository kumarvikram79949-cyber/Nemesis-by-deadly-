export type GameMode = '1m';

export interface UserSession {
  name: string;
  key: string;
  role: 'user' | 'admin';
  activatedAt: number;
  expiresAt: number | null; // null = unlimited
  planName: string;
}

export interface GameIssue {
  issueNumber: string;
  number: number;
  size: 'BIG' | 'SMALL';
  color?: 'RED' | 'GREEN' | 'VIOLET';
  parity?: 'EVEN' | 'ODD';
  time?: string;
}

export interface QuantitativePrediction {
  prediction: 'BIG' | 'SMALL';
  confidence: string; // e.g. "97%"
  pattern_detected: string; // e.g. "BSBSB" | "STREAK_4" | "MIRROR_SYMMETRY" | "RSI_OVERSOLD"
  level: 'LEVEL 1 (1x)' | 'LEVEL 2 (Recovery)';
  main_number: number; // 0-9
  side_number: number; // 0-9
  color: 'RED' | 'GREEN' | 'VIOLET';
  parity: 'EVEN' | 'ODD';
  // Advanced Telemetry Metrics
  rsi14: number;
  rsiSignal: 'OVERSOLD_BOUNCE' | 'OVERBOUGHT_REVERSAL' | 'NEUTRAL_MOMENTUM';
  markovOddsBig: number;
  markovOddsSmall: number;
  streakHazard: number;
  streakCount: number;
  // Deep Color Trading Logic Patterns
  colorPattern: string; // e.g., "1-1 PING PONG (R-G)", "2-2 DOUBLE JUMP", "2-1-2 RHYTHM", "1-2-3 STAIRCASE", "DRAGON RED (5x)"
  colorTrendBias: 'RED' | 'GREEN' | 'VIOLET';
  colorRatio: { red: number; green: number; violet: number };
  periodsSinceViolet: number;
  violetAlert?: string;
  aiTacticalAdvice: string;
  // Comprehensive Real-Time Trend Analysis
  trend: TrendAnalysisData;
  // Automatic AI Suggestion
  aiSuggestion: AISuggestionPayload;
}

export interface TrendAnalysisData {
  trendState: 'STRONG BULLISH (BIG EXPANSION)' | 'STRONG BEARISH (SMALL SLIDE)' | 'CHOPPY OSCILLATION (PING PONG)' | 'SIDEWAYS ACCUMULATION' | 'EXHAUSTION REVERSAL';
  trendDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trendStrength: number; // 0 - 100%
  continuationOdds: number; // e.g. 78%
  reversalOdds: number; // e.g. 22%
  emaFast: number; // EMA-5 of numbers
  emaSlow: number; // EMA-10 of numbers
  emaSignal: 'GOLDEN CROSS (BULLISH)' | 'DEATH CROSS (BEARISH)' | 'PARALLEL TRACK';
  macdLine: number;
  macdSignal: number;
  macdHistogram: number;
  momentumLabel: 'EXPANDING BULLISH' | 'COOLING BULLISH' | 'EXPANDING BEARISH' | 'COOLING BEARISH' | 'NEUTRAL';
  supportLevel: number; // Dynamic support floor (0-4)
  resistanceLevel: number; // Dynamic resistance ceiling (5-9)
  currentBallDistance: number;
  colorWaveDelta: number; // -100 to +100 (Negative = Red dominant, Positive = Green dominant)
  violetCountdown: number;
  recentSlope: number[];
}

export interface AISuggestionPayload {
  actionCommand: string; // e.g. "🎯 ACTION: LOCK IN BIG • LEVEL 1"
  badge: 'STRONG BUY' | 'NORMAL BET' | 'RECOVERY ENTRY' | 'CAUTION WAIT';
  confidenceText: string;
  reasoning: string[];
  suggestedStake: 'LEVEL 1 (Base 1x)' | 'LEVEL 2 (Recovery 3x)';
  targetBalls: number[];
  colorHedge: string;
  emotion: 'EXCITED' | 'THINKING' | 'SMUG' | 'SHOCKED' | 'HAPPY';
  bittuQuote: string; // Energetic Hinglish quote
}

export interface WinGoNeuralMatrixTelemetry {
  target_period: string;
  predicted_signal: 'BIG' | 'SMALL';
  confidence_rate: string;
  live_streak_probability: {
    target_chance: string;
    momentum: 'Stable' | 'Volatile' | 'Reversal Alert';
    hedge_chance: string;
  };
  pattern_insights: {
    markov_5th_order: string;
    mean_reversion_pressure: boolean;
    p_reversion: string;
  };
  target_numbers: {
    primary_target: number;
    primary_role: string;
    opposite_hedge: number;
    hedge_role: string;
    category_hedge_pool: number[];
  };
  parity_edge: {
    dominant_pattern: 'ODD' | 'EVEN';
    odd_percentage: string;
    even_percentage: string;
    active_streak: string;
  };
  telemetry: {
    active_stake_level: '1x' | '2x' | '3x';
    consensus_modules: string;
  };
}

export interface PredictionData extends QuantitativePrediction {
  period: string;
  predictedSize: 'BIG' | 'SMALL';
  predictedNumber: number;
  confidenceNumber: number; // numeric representation e.g. 97
  algorithmName: string;
  reason: string;
  timestamp: number;
  secondaryNumbers?: number[];
  dragonAlert?: string;
  neuralMatrix: WinGoNeuralMatrixTelemetry;
}

export interface HistoryRecord {
  period: string;
  predictedSize: 'BIG' | 'SMALL';
  predictedNumber: number;
  actualNumber: number;
  actualSize: 'BIG' | 'SMALL';
  actualColor?: 'RED' | 'GREEN' | 'VIOLET';
  status: 'WIN' | 'LOSS' | 'DIRECT HIT';
  level: 'LEVEL 1 (1x)' | 'LEVEL 2 (Recovery)';
  patternDetected?: string;
  colorPattern?: string;
  timestamp: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  emotion?: 'HAPPY' | 'EXCITED' | 'THINKING' | 'CONFUSED' | 'SMUG' | 'SHOCKED' | 'NEUTRAL';
}

export interface LicenseKey {
  key: string;
  durationLabel: string;
  durationMs: number | null; // null = unlimited
  createdAt: number;
  expiresAt: number | null;
  assignedTo?: string;
  status: 'active' | 'revoked' | 'expired';
  createdBy: string;
}

export interface PaymentRequest {
  id: string;
  userName: string;
  planName: string;
  durationLabel: string;
  amount: number;
  utr: string;
  telegramHandle?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
  generatedKey?: string;
}

export interface PlanOption {
  id: string;
  label: string;
  durationLabel: string;
  durationMs: number | null; // null = unlimited
  price: number;
  recommended?: boolean;
}
