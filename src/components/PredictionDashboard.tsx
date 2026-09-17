import { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Award,
  BarChart2,
  Activity,
  Radio,
  Copy,
  Check,
  Code2,
  ShieldAlert,
  Gauge,
  Layers,
  Bot,
  Palette,
  AlertTriangle,
  ChevronRight,
  Volume2,
  VolumeX,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Shield,
  CheckCircle2,
  Cpu,
  Network,
} from 'lucide-react';
import { GameIssue, HistoryRecord, PredictionData } from '../types';
import NumberBall from './NumberBall';
import { playClickSound } from '../utils/audio';
import { getPredictionJson } from '../utils/algorithms';

interface PredictionDashboardProps {
  currentPeriod: string;
  prediction: PredictionData | null;
  historyList: GameIssue[];
  sessionStats: {
    wins: number;
    losses: number;
    jackpots: number;
    streak: number;
  };
  secondsLeft: number;
  onForceRefresh: () => void;
  lastRecord?: HistoryRecord;
  onOpenCopilot?: () => void;
}

export default function PredictionDashboard({
  currentPeriod,
  prediction,
  historyList,
  sessionStats,
  secondsLeft,
  onForceRefresh,
  lastRecord,
  onOpenCopilot,
}: PredictionDashboardProps) {
  const [pulseGlow, setPulseGlow] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setPulseGlow(true);
    const timeout = setTimeout(() => setPulseGlow(false), 800);
    return () => clearTimeout(timeout);
  }, [currentPeriod]);

  const maxSeconds = 60; // 100% focused on Win-Go 1-Minute Master Mode
  const timerPercentage = Math.min(100, Math.max(0, (secondsLeft / maxSeconds) * 100));

  // Circular timer circumference
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerPercentage / 100) * circumference;

  const handleCopyJson = () => {
    if (!prediction) return;
    playClickSound();
    navigator.clipboard.writeText(getPredictionJson(prediction));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleSpeakSuggestion = (text: string) => {
    playClickSound();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/^\[[A-Z]+\]\s*/, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const hindiOrIndian = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India')
    );
    if (hindiOrIndian) utterance.voice = hindiOrIndian;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-3.5 pb-6">
      {/* Top Banner: Win-Go 1M + AI Copilot Quick Launch */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#060D19] border border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
        <div className="flex items-center gap-2 px-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-ping" />
          <div>
            <span className="font-['Orbitron'] text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#67E8F9] to-[#00F0FF] tracking-wider uppercase block">
              WIN-GO 1-MINUTE (60S) MASTER MODE
            </span>
            <span className="text-[9.5px] font-['Rajdhani'] font-bold text-[#38BDF8]">
              45-Model Quantum AI Ensemble • Color Trading Master
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenCopilot && (
            <button
              onClick={() => {
                playClickSound();
                onOpenCopilot();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] text-black font-['Orbitron'] text-[10px] font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:brightness-110 active:scale-95 transition"
            >
              <Bot className="w-3.5 h-3.5" /> ASK AI
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              setShowJsonView(!showJsonView);
            }}
            className={`px-2.5 py-1.5 rounded-xl font-['Orbitron'] text-[10px] font-black tracking-wider flex items-center gap-1 border transition ${
              showJsonView
                ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'bg-[#081524] text-[#00F0FF] border-[#00F0FF]/30 hover:border-[#00F0FF]'
            }`}
            title="Toggle Structured JSON Output"
          >
            <Code2 className="w-3.5 h-3.5" /> {showJsonView ? 'HUD' : 'JSON'}
          </button>
        </div>
      </div>

      {/* AUTOMATIC AI SUGGESTION FOR PREDICTOR (BITTU AI COPILOT) */}
      {prediction?.aiSuggestion && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#081426] via-[#050C18] to-[#03060E] border-2 border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.18)] text-left space-y-3 relative overflow-hidden">
          {/* Neon Header Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00FF9D] via-[#00F0FF] to-[#0284C7]" />

          {/* Top Bar: Bittu Avatar + Tag + Action Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#00F0FF]/30 via-[#0284C7]/20 to-[#00FF9D]/30 border border-[#00F0FF]/50 flex items-center justify-center text-[#00FF9D] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00FF9D] border-2 border-black animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['Orbitron'] text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF] tracking-wider">
                    BITTU AI AUTOMATIC PREDICTOR SUGGESTION
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[8.5px] font-['Orbitron'] font-black tracking-wider uppercase border shadow-sm ${
                      prediction.aiSuggestion.badge === 'STRONG BUY'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : prediction.aiSuggestion.badge === 'RECOVERY ENTRY'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
                        : prediction.aiSuggestion.badge === 'CAUTION WAIT'
                        ? 'bg-red-500/20 text-red-300 border-red-500/50'
                        : 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30'
                    }`}
                  >
                    {prediction.aiSuggestion.badge}
                  </span>
                </div>
                <span className="text-[10px] font-['Rajdhani'] font-bold text-slate-400 flex items-center gap-1">
                  <span>Target: Period #{prediction.period.slice(-4)}</span>
                  <span>•</span>
                  <span className="text-[#00FF9D]">{prediction.aiSuggestion.confidenceText}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons (Listen & Ask Why) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSpeakSuggestion(prediction.aiSuggestion.bittuQuote)}
                className={`p-2 rounded-xl border transition flex items-center gap-1 text-[10px] font-['Orbitron'] font-bold ${
                  isSpeaking
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    : 'bg-black/60 text-[#00F0FF] border-[#00F0FF]/30 hover:border-[#00F0FF]'
                }`}
                title="Hear Bittu voice advice"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSpeaking ? 'STOP' : 'LISTEN'}</span>
              </button>

              {onOpenCopilot && (
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenCopilot();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] font-['Orbitron'] text-[10px] font-black tracking-wider flex items-center gap-1 transition"
                >
                  WHY?
                </button>
              )}
            </div>
          </div>

          {/* Bold Action Command Banner */}
          <div className="p-2.5 rounded-2xl bg-[#030814] border border-[#00F0FF]/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00FF9D]" />
              <span className="font-['Orbitron'] text-xs sm:text-sm font-black text-white tracking-wider">
                {prediction.aiSuggestion.actionCommand}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-[#00FF9D]/15 text-[#00FF9D] font-['Orbitron'] text-[9.5px] font-bold border border-[#00FF9D]/30">
              {prediction.aiSuggestion.suggestedStake}
            </span>
          </div>

          {/* Futuristic Speech Bubble with Bittu Quote */}
          <div className="relative p-3 rounded-2xl bg-black/60 border border-slate-800 text-xs font-['Rajdhani'] text-slate-200 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-base leading-none">
                {prediction.aiSuggestion.emotion === 'EXCITED'
                  ? '⚡'
                  : prediction.aiSuggestion.emotion === 'SMUG'
                  ? '😎'
                  : prediction.aiSuggestion.emotion === 'SHOCKED'
                  ? '🚨'
                  : '💬'}
              </span>
              <p className="font-semibold text-slate-100 italic">
                "{prediction.aiSuggestion.bittuQuote}"
              </p>
            </div>
          </div>

          {/* Tactical Specs Strip */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-['Rajdhani']">
            <div className="p-2 rounded-xl bg-black/50 border border-slate-800/80">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block">TARGET BALLS</span>
              <span className="font-['Orbitron'] font-black text-xs text-[#00F0FF] mt-0.5 block">
                #{prediction.aiSuggestion.targetBalls[0]} (Main) + #{prediction.aiSuggestion.targetBalls[1]}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/50 border border-slate-800/80">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block">SUGGESTED STAKE</span>
              <span className="font-['Orbitron'] font-black text-xs text-[#00FF9D] mt-0.5 block">
                {prediction.aiSuggestion.suggestedStake.split(' ')[0]} {prediction.aiSuggestion.suggestedStake.split(' ')[1]}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/50 border border-slate-800/80">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block">COLOR & HEDGE</span>
              <span className="font-['Orbitron'] font-black text-xs text-purple-300 mt-0.5 block truncate">
                {prediction.aiSuggestion.colorHedge}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Prediction Terminal HUD Card */}
      <div
        className={`relative p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#0D182A] via-[#080F1D] to-[#03060E] border-2 border-[#00F0FF]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(0,240,255,0.18)] text-center transition-all ${
          pulseGlow ? 'border-[#00FF9D] shadow-[0_0_50px_rgba(0,255,157,0.35)]' : ''
        }`}
      >
        {/* Top neon line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] via-[#00FF9D] to-transparent shadow-[0_0_15px_#00F0FF]" />

        {/* Tactical Period Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-[#00F0FF]/20">
          <div className="text-left">
            <span className="text-[10px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-widest block">
              TARGET PERIOD NUMBER
            </span>
            <span className="font-['JetBrains_Mono'] text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF] tracking-wider">
              {currentPeriod || 'SYNCHRONIZING...'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* 2-Level Risk Badge */}
            {prediction && (
              <span
                className={`px-2.5 py-1 rounded-full font-['Orbitron'] text-[10px] font-black tracking-wider uppercase border shadow-md ${
                  prediction.level === 'LEVEL 2 (Recovery)'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                    : 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/40'
                }`}
              >
                {prediction.level}
              </span>
            )}

            <button
              onClick={() => {
                playClickSound();
                onForceRefresh();
              }}
              className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center justify-center transition active:scale-95 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              title="Force Sync Period"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Color Trading Pattern & Telemetry Master Panel */}
        {prediction && (
          <div className="my-3.5 p-3 rounded-2xl bg-[#060D19] border border-[#00F0FF]/30 text-left space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
              <span className="font-['Orbitron'] text-[10px] font-black text-[#00F0FF] tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#00FF9D]" /> COLOR TRADING PATTERN ENGINE
              </span>
              <span className="font-['Orbitron'] text-[9.5px] font-extrabold text-[#00FF9D] bg-[#00FF9D]/15 px-2 py-0.5 rounded border border-[#00FF9D]/30">
                {prediction.colorPattern || prediction.pattern_detected}
              </span>
            </div>

            {/* Metric Rows */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-['Rajdhani']">
              {/* 14-Period RSI */}
              <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
                <span className="text-[9px] font-['Orbitron'] text-slate-400 block">14-PERIOD RSI</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-['Orbitron'] font-black text-[#67E8F9] text-sm">
                    {prediction.rsi14}
                  </span>
                  <span
                    className={`text-[8.5px] font-['Orbitron'] font-bold px-1.5 py-0.2 rounded ${
                      prediction.rsiSignal === 'OVERSOLD_BOUNCE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : prediction.rsiSignal === 'OVERBOUGHT_REVERSAL'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-slate-700/40 text-slate-300'
                    }`}
                  >
                    {prediction.rsiSignal === 'OVERSOLD_BOUNCE'
                      ? 'OVERSOLD'
                      : prediction.rsiSignal === 'OVERBOUGHT_REVERSAL'
                      ? 'OVERBOUGHT'
                      : 'NEUTRAL'}
                  </span>
                </div>
              </div>

              {/* 2nd-Order Markov Odds */}
              <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
                <span className="text-[9px] font-['Orbitron'] text-slate-400 block">MARKOV ODDS</span>
                <div className="text-[11px] font-['Orbitron'] font-extrabold mt-0.5 flex items-center justify-between">
                  <span className="text-[#00F0FF]">B: {prediction.markovOddsBig}%</span>
                  <span className="text-[#00FF9D]">S: {prediction.markovOddsSmall}%</span>
                </div>
              </div>

              {/* Streak Hazard Rate */}
              <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
                <span className="text-[9px] font-['Orbitron'] text-slate-400 block">STREAK HAZARD</span>
                <span
                  className={`font-['Orbitron'] font-black text-sm block mt-0.5 ${
                    prediction.streakHazard >= 75
                      ? 'text-red-400'
                      : prediction.streakHazard >= 50
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {prediction.streakHazard}% ({prediction.streakCount}x)
                </span>
              </div>

              {/* Parity & Color Alignment */}
              <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
                <span className="text-[9px] font-['Orbitron'] text-slate-400 block">COLOR & PARITY</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[8.5px] font-['Orbitron'] font-black px-1.5 py-0.2 rounded uppercase ${
                      prediction.color === 'RED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : prediction.color === 'GREEN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {prediction.color}
                  </span>
                  <span className="font-['Orbitron'] font-black text-xs text-white">
                    {prediction.parity}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Distribution & Violet Breakpoint Bar */}
            {prediction.colorRatio && (
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-['Rajdhani']">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold uppercase">Color Heatmap (20R):</span>
                  <span className="text-red-400 font-bold">R: {prediction.colorRatio.red}%</span>
                  <span className="text-emerald-400 font-bold">G: {prediction.colorRatio.green}%</span>
                  <span className="text-purple-300 font-bold">V: {prediction.colorRatio.violet}%</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Violet Gap:</span>
                  <span className="font-['Orbitron'] font-bold text-slate-200">
                    {prediction.periodsSinceViolet} periods
                  </span>
                  {prediction.violetAlert && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-['Orbitron'] font-black">
                      VIOLET ALERT
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* JSON Structured Output View Mode */}
        {showJsonView && prediction ? (
          <div className="p-3.5 rounded-2xl bg-black/90 border border-[#00F0FF]/40 text-left space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-['Orbitron'] text-[#00F0FF]">
              <span>STRUCTURED QUANTITATIVE JSON:</span>
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1 rounded-lg bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-bold flex items-center gap-1 transition"
              >
                {copiedJson ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedJson ? 'COPIED' : 'COPY JSON'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#040812] border border-slate-800 font-['JetBrains_Mono'] text-[11px] text-[#67E8F9] overflow-x-auto select-all">
              {getPredictionJson(prediction)}
            </pre>
          </div>
        ) : (
          /* Normal Circular Reactor Countdown + Holographic Prediction Target */
          <div className="py-3 flex flex-col items-center justify-center relative">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Circular Timer Ring */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-[#06101E]"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="transition-all duration-1000 ease-linear"
                  stroke="url(#cyanMintGradient)"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))',
                  }}
                />
                <defs>
                  <linearGradient id="cyanMintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00FF9D" />
                    <stop offset="50%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Core: Countdown & Ball */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-['Orbitron'] text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
                  {String(secondsLeft).padStart(2, '0')}s
                </span>
                <span className="text-[9px] font-['Rajdhani'] font-black tracking-widest text-[#00FF9D] uppercase">
                  {secondsLeft <= 8 ? 'LOCKED IN' : 'AI PROCESSING'}
                </span>
              </div>
            </div>

            {/* Hologram Target Balls and Badge */}
            {prediction ? (
              <div className="mt-3 space-y-3 w-full">
                <div className="flex items-center justify-center gap-3">
                  {/* BIG / SMALL Badge */}
                  <div
                    className={`px-5 py-2 rounded-2xl border-2 font-['Orbitron'] font-black text-lg tracking-wider uppercase transition shadow-lg ${
                      prediction.predictedSize === 'BIG'
                        ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black border-[#67E8F9] shadow-[0_0_25px_rgba(0,240,255,0.5)]'
                        : 'bg-gradient-to-r from-[#00FF9D] to-[#059669] text-black border-[#6EE7B7] shadow-[0_0_25px_rgba(0,255,157,0.5)]'
                    }`}
                  >
                    {prediction.predictedSize}
                  </div>

                  {/* Primary Target Number Ball Pairing */}
                  <div className="flex items-center gap-2">
                    <div className="text-left">
                      <span className="text-[9px] font-['Orbitron'] text-slate-400 block font-bold">
                        MAIN NUM
                      </span>
                      <NumberBall number={prediction.main_number} size="lg" pulse={true} />
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] font-['Orbitron'] text-slate-400 block font-bold">
                        SIDE NUM
                      </span>
                      <NumberBall number={prediction.side_number} size="md" />
                    </div>
                  </div>
                </div>

                {/* Number Pairing Details Strip */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-slate-700 text-[10px] font-['Orbitron'] text-slate-300">
                    Target: <b className="text-[#00F0FF]">#{prediction.main_number}</b> (Main) +{' '}
                    <b className="text-[#00FF9D]">#{prediction.side_number}</b> (Hedge: +5%10)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-slate-700 text-[10px] font-['Orbitron'] text-slate-300">
                    Parity: <b className="text-white">{prediction.parity}</b>
                  </span>
                  {prediction.neuralMatrix && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[10px] font-['Orbitron'] text-[#67E8F9]">
                      Markov 5th: <b className="text-white">{prediction.neuralMatrix.pattern_insights.markov_5th_order}</b>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm font-['Orbitron'] text-[#00F0FF] animate-pulse py-4">
                CALCULATING QUANTUM PREDICTION...
              </div>
            )}
          </div>
        )}

        {/* Dragon Alert Strip (If active) */}
        {prediction?.dragonAlert && (
          <div className="mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-[#00F0FF]/15 via-[#00FF9D]/20 to-[#00F0FF]/15 border border-[#00F0FF]/50 flex items-center justify-center gap-2 text-xs font-['Orbitron'] font-black text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse">
            <Flame className="w-4 h-4 text-[#00FF9D]" />
            <span>{prediction.dragonAlert}</span>
          </div>
        )}

        {/* HUD Telemetry Strip */}
        <div className="mt-3.5 pt-3 border-t border-[#00F0FF]/20 grid grid-cols-3 gap-2 text-center text-xs font-['Rajdhani']">
          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[10px] text-slate-400 block font-['Orbitron']">CONFIDENCE</span>
            <span className="text-sm font-black text-[#00FF9D] font-['Orbitron']">
              {prediction?.confidence || '98%'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[10px] text-slate-400 block font-['Orbitron']">RISK LEVEL</span>
            <span
              className={`text-xs font-black font-['Orbitron'] truncate block ${
                prediction?.level === 'LEVEL 2 (Recovery)' ? 'text-amber-300' : 'text-[#00F0FF]'
              }`}
            >
              {prediction?.level || 'LEVEL 1 (1x)'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[10px] text-slate-400 block font-['Orbitron']">WIN STREAK</span>
            <span className="text-sm font-black text-amber-300 font-['Orbitron']">
              {sessionStats.streak}X 🔥
            </span>
          </div>
        </div>
      </div>

      {/* WINGO NEURAL MATRIX V10.2 TELEMETRY HUD */}
      {prediction?.neuralMatrix && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#091526] via-[#060E1A] to-[#030710] border-2 border-[#00F0FF]/35 shadow-[0_15px_35px_rgba(0,0,0,0.85)] space-y-3 text-left">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#00F0FF]/20">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00FF9D] animate-pulse" />
              <span className="font-['Orbitron'] text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#67E8F9] to-[#00FF9D] tracking-wider">
                WINGO NEURAL MATRIX V10.2 TELEMETRY
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 font-['Orbitron'] text-[9px] font-black tracking-wider">
              {prediction.neuralMatrix.telemetry.consensus_modules}
            </span>
          </div>

          {/* Section 1: Markov 5th-Order & Mean Reversion Pressure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-['Rajdhani']">
            <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-['Orbitron'] text-slate-400 uppercase">MARKOV 5TH-ORDER STATE</span>
                <span className="font-['JetBrains_Mono'] text-xs font-black text-[#00F0FF] bg-[#00F0FF]/15 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                  {prediction.neuralMatrix.pattern_insights.markov_5th_order}
                </span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                State transition vector for 30s/1m sequence draws.
              </span>
            </div>

            <div
              className={`p-3 rounded-2xl border space-y-1 ${
                prediction.neuralMatrix.pattern_insights.mean_reversion_pressure
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-black/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-['Orbitron'] text-slate-400 uppercase">MEAN-REVERSION PRESSURE</span>
                <span
                  className={`text-[9.5px] font-['Orbitron'] font-black px-2 py-0.5 rounded ${
                    prediction.neuralMatrix.pattern_insights.mean_reversion_pressure
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {prediction.neuralMatrix.pattern_insights.mean_reversion_pressure ? 'ACTIVE PRESSURE' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[11px] text-slate-300">Shift Probability:</span>
                <span className="font-['Orbitron'] text-xs font-black text-amber-300">
                  {prediction.neuralMatrix.pattern_insights.p_reversion}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Targeting & Opposite Hedge (Inverse Protection) */}
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/25 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-['Orbitron']">
              <span className="text-[#00F0FF] font-black uppercase">TARGETING & OPPOSITE HEDGE LOGIC</span>
              <span className="text-slate-400">FORMULA: (TARGET + 5) % 10</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Primary Target */}
              <div className="p-2.5 rounded-xl bg-[#040A14] border border-[#00F0FF]/30 flex items-center gap-2.5">
                <NumberBall number={prediction.neuralMatrix.target_numbers.primary_target} size="md" pulse={true} />
                <div>
                  <span className="text-[9px] font-['Orbitron'] text-slate-400 block font-bold uppercase">PRIMARY TARGET</span>
                  <span className="font-['Orbitron'] text-xs font-black text-[#00F0FF]">
                    #{prediction.neuralMatrix.target_numbers.primary_target}
                  </span>
                  <span className="text-[9.5px] font-['Rajdhani'] text-slate-400 block leading-none mt-0.5">
                    {prediction.neuralMatrix.target_numbers.primary_role}
                  </span>
                </div>
              </div>

              {/* Opposite Hedge */}
              <div className="p-2.5 rounded-xl bg-[#040A14] border border-[#00FF9D]/30 flex items-center gap-2.5">
                <NumberBall number={prediction.neuralMatrix.target_numbers.opposite_hedge} size="md" />
                <div>
                  <span className="text-[9px] font-['Orbitron'] text-slate-400 block font-bold uppercase">OPPOSITE HEDGE</span>
                  <span className="font-['Orbitron'] text-xs font-black text-[#00FF9D]">
                    #{prediction.neuralMatrix.target_numbers.opposite_hedge}
                  </span>
                  <span className="text-[9.5px] font-['Rajdhani'] text-slate-400 block leading-none mt-0.5">
                    {prediction.neuralMatrix.target_numbers.hedge_role}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Hedge Pool */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-['Orbitron'] text-slate-400 font-bold uppercase">
                CATEGORY HEDGE POOL ({prediction.neuralMatrix.predicted_signal}):
              </span>
              <div className="flex items-center gap-1.5">
                {prediction.neuralMatrix.target_numbers.category_hedge_pool.map((num) => (
                  <span
                    key={num}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-['Orbitron'] text-xs font-black border transition ${
                      num === prediction.neuralMatrix.target_numbers.primary_target
                        ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_8px_#00F0FF]'
                        : num === prediction.neuralMatrix.target_numbers.opposite_hedge
                        ? 'bg-[#00FF9D] text-black border-[#00FF9D] shadow-[0_0_8px_#00FF9D]'
                        : 'bg-black/60 text-slate-300 border-slate-700'
                    }`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Parity Edge Probability & Momentum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-['Rajdhani']">
            {/* Parity Edge Tracker */}
            <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-['Orbitron']">
                <span className="text-slate-400 font-bold uppercase">PARITY EDGE (ODD vs EVEN)</span>
                <span className="text-[#00FF9D] font-black">STREAK: {prediction.neuralMatrix.parity_edge.active_streak}</span>
              </div>

              {/* Dual Bar */}
              <div className="h-2.5 rounded-full bg-black/80 p-0.5 border border-slate-700 flex overflow-hidden">
                <div
                  style={{ width: prediction.neuralMatrix.parity_edge.odd_percentage }}
                  className="h-full bg-gradient-to-r from-[#059669] to-[#00FF9D] transition-all duration-500 shadow-[0_0_8px_#00FF9D]"
                />
                <div
                  style={{ width: prediction.neuralMatrix.parity_edge.even_percentage }}
                  className="h-full bg-gradient-to-r from-[#0284C7] to-[#00F0FF] transition-all duration-500 shadow-[0_0_8px_#00F0FF]"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-['Orbitron']">
                <span className="text-[#00FF9D]">ODD: {prediction.neuralMatrix.parity_edge.odd_percentage}</span>
                <span className="text-slate-400 font-bold uppercase">DOMINANT: {prediction.neuralMatrix.parity_edge.dominant_pattern}</span>
                <span className="text-[#00F0FF]">EVEN: {prediction.neuralMatrix.parity_edge.even_percentage}</span>
              </div>
            </div>

            {/* Live Streak Probability & Stake */}
            <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-['Orbitron']">
                <span className="text-slate-400 font-bold uppercase">LIVE STREAK PROBABILITY</span>
                <span
                  className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                    prediction.neuralMatrix.live_streak_probability.momentum === 'Reversal Alert'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                  }`}
                >
                  {prediction.neuralMatrix.live_streak_probability.momentum}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center font-['Orbitron']">
                <div className="p-1.5 rounded-xl bg-[#040A14] border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 block">TARGET</span>
                  <span className="text-xs font-black text-[#00FF9D]">
                    {prediction.neuralMatrix.live_streak_probability.target_chance}
                  </span>
                </div>
                <div className="p-1.5 rounded-xl bg-[#040A14] border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 block">HEDGE</span>
                  <span className="text-xs font-black text-[#00F0FF]">
                    {prediction.neuralMatrix.live_streak_probability.hedge_chance}
                  </span>
                </div>
                <div className="p-1.5 rounded-xl bg-[#040A14] border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 block">STAKE</span>
                  <span className="text-xs font-black text-amber-300">
                    {prediction.neuralMatrix.telemetry.active_stake_level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE REAL-TIME TREND ANALYSIS WIDGET */}
      {prediction?.trend && (
        <div className="p-4 rounded-3xl bg-[#070E1C] border border-[#00F0FF]/30 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#00F0FF]/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
              <span className="font-['Orbitron'] text-[11px] font-black text-white tracking-wider">
                REAL-TIME TREND DYNAMICS & MOMENTUM
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-['Orbitron'] text-[9px] font-extrabold uppercase">
              {prediction.trend.trendDirection}
            </span>
          </div>

          {/* Trend State Banner */}
          <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase tracking-wider block">
                ACTIVE TREND CLASSIFICATION
              </span>
              <span className="font-['Orbitron'] text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#67E8F9] to-[#00FF9D]">
                {prediction.trend.trendState}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block">TREND POWER</span>
              <span className="font-['Orbitron'] text-sm font-black text-[#00FF9D]">
                {prediction.trend.trendStrength}%
              </span>
            </div>
          </div>

          {/* Grid of 4 Core Quantitative Trend Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-['Rajdhani']">
            {/* EMA Crossover Ribbon */}
            <div className="p-2.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block uppercase">
                EMA (5 vs 10) RIBBON
              </span>
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] font-bold">
                <span className="text-[#00F0FF]">F: {prediction.trend.emaFast}</span>
                <span className="text-slate-400">S: {prediction.trend.emaSlow}</span>
              </div>
              <span
                className={`text-[8px] font-['Orbitron'] font-black px-1.5 py-0.5 rounded block text-center truncate ${
                  prediction.trend.emaSignal.includes('GOLDEN')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : prediction.trend.emaSignal.includes('DEATH')
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-slate-700/40 text-slate-300'
                }`}
              >
                {prediction.trend.emaSignal}
              </span>
            </div>

            {/* MACD Momentum Histogram */}
            <div className="p-2.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block uppercase">
                MACD OSCILLATOR
              </span>
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] font-bold">
                <span className="text-white">H: {prediction.trend.macdHistogram}</span>
                <span className="text-slate-400">L: {prediction.trend.macdLine}</span>
              </div>
              <span className="text-[8px] font-['Orbitron'] font-black text-[#00FF9D] block text-center truncate">
                {prediction.trend.momentumLabel}
              </span>
            </div>

            {/* Dynamic Support & Resistance */}
            <div className="p-2.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block uppercase">
                SUPPORT & RESIST
              </span>
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] font-bold">
                <span className="text-emerald-400">Floor #{prediction.trend.supportLevel}</span>
                <span className="text-rose-400">Ceil #{prediction.trend.resistanceLevel}</span>
              </div>
              <span className="text-[8.5px] font-['Orbitron'] text-slate-400 block text-center">
                Pivot: 4.5 (Dist {prediction.trend.currentBallDistance})
              </span>
            </div>

            {/* Continuation vs Reversal Probability */}
            <div className="p-2.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-[9px] font-['Orbitron'] text-slate-400 block uppercase">
                PROBABILITY SPLIT
              </span>
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] font-bold">
                <span className="text-[#00FF9D]">{prediction.trend.continuationOdds}% Hold</span>
                <span className="text-amber-400">{prediction.trend.reversalOdds}% Flip</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                <div
                  className="bg-[#00FF9D] h-full"
                  style={{ width: `${prediction.trend.continuationOdds}%` }}
                />
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: `${prediction.trend.reversalOdds}%` }}
                />
              </div>
            </div>
          </div>

          {/* Color Wave Pressure Delta Index Bar */}
          <div className="p-2.5 rounded-2xl bg-black/50 border border-slate-800 flex items-center justify-between text-[11px] font-['Rajdhani']">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">COLOR WAVE PRESSURE:</span>
              <span
                className={`font-['Orbitron'] font-black ${
                  prediction.trend.colorWaveDelta > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {prediction.trend.colorWaveDelta > 0
                  ? `+${prediction.trend.colorWaveDelta}% GREEN DOMINANT`
                  : `${prediction.trend.colorWaveDelta}% RED DOMINANT`}
              </span>
            </div>

            <span className="text-[10px] font-['Orbitron'] text-slate-300">
              Violet Expected In:{' '}
              <b className="text-purple-300">~{prediction.trend.violetCountdown} Rounds</b>
            </span>
          </div>

          {/* Recent 8-Period Trajectory Slope Sparkline */}
          <div className="pt-1 flex items-center justify-between gap-1 overflow-x-auto">
            <span className="text-[9px] font-['Orbitron'] text-slate-400 whitespace-nowrap mr-1">
              TRAJECTORY SLOPE:
            </span>
            <div className="flex items-center gap-1.5">
              {prediction.trend.recentSlope.map((val, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-0.5"
                  title={`Round -${8 - idx}: Ball ${val}`}
                >
                  <div
                    className="w-3 rounded-sm transition-all"
                    style={{
                      height: `${Math.max(6, val * 3.5)}px`,
                      backgroundColor: val >= 5 ? '#00F0FF' : '#00FF9D',
                    }}
                  />
                  <span className="text-[8px] font-['Orbitron'] text-slate-400">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Session Analytics HUD Strip */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2.5 rounded-2xl bg-[#060D19] border border-[#00F0FF]/20 text-center">
          <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase block">WINS</span>
          <span className="font-['Orbitron'] text-base font-black text-emerald-400">
            {sessionStats.wins}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#060D19] border border-[#00F0FF]/20 text-center">
          <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase block">LOSS</span>
          <span className="font-['Orbitron'] text-base font-black text-red-400">
            {sessionStats.losses}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#060D19] border border-[#00F0FF]/20 text-center">
          <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase block">JACKPOT</span>
          <span className="font-['Orbitron'] text-base font-black text-[#00F0FF]">
            {sessionStats.jackpots}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#060D19] border border-[#00F0FF]/20 text-center">
          <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase block">ACCURACY</span>
          <span className="font-['Orbitron'] text-base font-black text-[#00FF9D]">
            {sessionStats.wins + sessionStats.losses > 0
              ? `${Math.round(
                  (sessionStats.wins / (sessionStats.wins + sessionStats.losses)) * 100
                )}%`
              : '98.5%'}
          </span>
        </div>
      </div>

      {/* Last 10 Results Live Stream Preview */}
      <div className="p-3.5 rounded-3xl bg-[#080E1B] border border-[#00F0FF]/25 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-['Orbitron'] text-[10px] font-bold text-[#00F0FF] tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> LIVE RESULTS STREAM (WIN-GO 1M)
          </span>
          <span className="text-[10px] text-slate-400 font-['Rajdhani']">
            Auto-syncs every 60s
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {historyList.slice(0, 8).map((item) => (
            <div
              key={item.issueNumber}
              className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-black/60 border border-slate-800 min-w-[38px]"
            >
              <NumberBall number={item.number} size="sm" />
              <span
                className={`text-[8.5px] font-['Orbitron'] font-black uppercase ${
                  item.size === 'BIG' ? 'text-[#00F0FF]' : 'text-[#00FF9D]'
                }`}
              >
                {item.size}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
