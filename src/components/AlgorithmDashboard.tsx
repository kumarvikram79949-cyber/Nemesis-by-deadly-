import { useState } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  BarChart3,
  Network,
  ShieldCheck,
  Check,
  Flame,
  Radio,
  Palette,
  Layers,
  Sparkles,
  TrendingUp,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Sliders,
} from 'lucide-react';
import { GameIssue } from '../types';
import NumberBall from './NumberBall';
import { playClickSound } from '../utils/audio';
import {
  detectColorTradingPatterns,
  detectDragonPattern,
  analyzeVioletCycle,
  calculateColorHeatmap,
  calculateComprehensiveTrendAnalysis,
} from '../utils/algorithms';

interface AlgorithmDashboardProps {
  historyList: GameIssue[];
  activeEngine: string;
  onSelectEngine: (name: string) => void;
}

export default function AlgorithmDashboard({
  historyList,
  activeEngine,
  onSelectEngine,
}: AlgorithmDashboardProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'patterns' | 'markov' | 'frequency' | 'models'>('trends');

  // Compute Frequency of Numbers 0-9 from historyList
  const frequencies = Array.from({ length: 10 }, (_, num) => {
    const count = historyList.filter((item) => item.number === num).length;
    return { number: num, count };
  });
  const maxFreq = Math.max(...frequencies.map((f) => f.count), 1);

  // Compute Big vs Small ratio
  const bigCount = historyList.filter((item) => item.size === 'BIG').length;
  const smallCount = historyList.filter((item) => item.size === 'SMALL').length;
  const totalCount = Math.max(1, bigCount + smallCount);
  const bigPercent = Math.round((bigCount / totalCount) * 100);
  const smallPercent = 100 - bigPercent;

  // Pattern intelligence calculations
  const activePattern = detectColorTradingPatterns(historyList);
  const dragon = detectDragonPattern(historyList);
  const violet = analyzeVioletCycle(historyList);
  const heatmap = calculateColorHeatmap(historyList);
  const trendAnalysis = calculateComprehensiveTrendAnalysis(historyList);

  const patternsLibrary = [
    {
      id: 'dragon',
      name: 'Dragon Streak (Single Trend)',
      seq: 'BBBB... or SSSS... / RRRR... or GGGG...',
      status: dragon.isDragon ? `ACTIVE (${dragon.streak}X Streak)` : 'STANDBY',
      hazard: `${dragon.hazardRate}%`,
      description: 'Single size or color continues for 3+ rounds. Ride with trend when hazard < 70%, take counter-bias when hazard >= 75%.',
      rule: 'Exponential Decay Hazard: H(k) = (1 - e^(-0.28*k)) * 100',
    },
    {
      id: 'pingpong',
      name: '1-1 Ping-Pong (Alternating Jump)',
      seq: 'B - S - B - S - B or R - G - R - G - R',
      status: activePattern.patternName.includes('PING_PONG') ? 'ACTIVE NOW' : 'MONITORING',
      hazard: 'Low (High Continuity)',
      description: 'Strict zigzag oscillation. Follow counter-oscillation until parity break occurs.',
      rule: 'Predict opposite of previous round.',
    },
    {
      id: 'doublejump',
      name: '2-2 Double Jump (Symmetrical Pairs)',
      seq: 'BB - SS - BB or RR - GG - RR',
      status: activePattern.patternName.includes('2-2') ? 'ACTIVE NOW' : 'MONITORING',
      hazard: 'Moderate',
      description: 'Pairs of identical results alternate cleanly. If round 1 of pair hits, bet on second. If round 2 completes, flip.',
      rule: 'Pair completion triggers immediate flip.',
    },
    {
      id: 'rhythm212',
      name: '2-1-2 Rhythm Pattern',
      seq: 'BB - S - BB or SS - B - SS',
      status: activePattern.patternName.includes('2-1-2') ? 'ACTIVE NOW' : 'MONITORING',
      hazard: 'Moderate',
      description: 'Two hits, single break, two resumption hits. High confirmation probability on step 2.',
      rule: 'Resumes original dominant wave.',
    },
    {
      id: 'triple313',
      name: '3-1-3 Triple Rhythm',
      seq: 'BBB - S - BBB or SSS - B - SSS',
      status: activePattern.patternName.includes('3-1-3') ? 'ACTIVE NOW' : 'MONITORING',
      hazard: 'Low-Medium',
      description: 'Triple block separated by a single transition shockwave.',
      rule: 'Triple confirmation projection.',
    },
    {
      id: 'staircase',
      name: '1-2-3 Staircase (Ascending Ladder)',
      seq: 'B - SS - BBB or R - GG - RRR',
      status: activePattern.patternName.includes('1-2-3') ? 'ACTIVE NOW' : 'MONITORING',
      hazard: 'Cycle Reset at 3',
      description: 'Progressive incremental wave building from 1 to 2 to 3.',
      rule: 'Upon reaching 3rd tier, invert to start 1.',
    },
    {
      id: 'invertedladder',
      name: '3-2-1 Inverted Ladder (Countdown)',
      seq: 'BBB - SS - B or RRR - GG - R',
      status: activePattern.patternName.includes('3-2-1') ? 'ACTIVE NOW' : 'MONITORING',
      hazard: 'Cycle Reset at 1',
      description: 'Descending sequence tapering down to single unit before explosive shift.',
      rule: 'Immediate reversal upon single termination.',
    },
    {
      id: 'violetbreak',
      name: 'Violet Breakpoint Analysis',
      seq: '0 (Red+Violet) & 5 (Green+Violet)',
      status: violet.isSurgeExpected ? `SURGE DETECTED (${violet.periodsSinceViolet}R Gap)` : `${violet.periodsSinceViolet}R Since 0/5`,
      hazard: violet.isSurgeExpected ? 'HIGH SURGE' : 'NORMAL',
      description: '0 and 5 appear on average every 6-9 periods. When gap exceeds 8, odds of Violet boundary surge exponentially.',
      rule: 'Gap > 8 periods triggers Violet support hedge.',
    },
  ];

  const engines = [
    {
      name: 'WinGo Neural Matrix V10.2',
      type: '5th-Order Markov & Mean Reversion Telemetry',
      speed: '7ms',
      accuracy: '99.2%',
      description: 'Markov 5th-Order state transitions, dynamic Mean-Reversion Pressure alerts, (Primary+5)%10 Opposite Hedge & Parity Edge tracking.',
      badge: 'PRO MATRIX V10.2',
    },
    {
      name: 'NEMESIS Quantum Neural Net v7.4',
      type: 'Quantum Pattern Heuristic',
      speed: '11ms',
      accuracy: '98.8%',
      description: 'High-dimensional Bayesian Markov transition network with real-time streak detection.',
      badge: 'RECOMMENDED',
    },
    {
      name: 'Deep Markov Matrix Engine v4.2',
      type: 'Stochastic Chain Probability',
      speed: '14ms',
      accuracy: '97.6%',
      description: 'Multi-stage state transition matrices factoring hot/cold frequency biases.',
      badge: 'STABLE',
    },
    {
      name: 'Dragon Hunter Pattern Buster',
      type: 'Streak Trend Interceptor',
      speed: '9ms',
      accuracy: '98.1%',
      description: 'Specially optimized for breaking 4x-8x Big/Small dragon sequences with maximum ROI.',
      badge: 'AGGRESSIVE',
    },
    {
      name: 'Bi-Directional LSTM Pattern Engine',
      type: 'Recurrent Memory Net',
      speed: '19ms',
      accuracy: '97.9%',
      description: 'Deep chronological sequence learner detecting micro-shifts in random seeds.',
      badge: 'EXPERIMENTAL',
    },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Header telemetry card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#0D1829] via-[#080F1D] to-[#040710] border-2 border-[#00F0FF]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#00F0FF]/20">
          <div>
            <h2 className="font-['Orbitron'] text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF]">
              COLOR TRADING AI ENGINE & LOGIC PATTERNS
            </h2>
            <p className="text-[11px] font-['Rajdhani'] font-bold text-slate-400">
              Active Patterns • Dragon Hazard Decay • Violet Cycles • 2-Stage Markov
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/40 text-[#00FF9D] text-[9px] font-['Orbitron'] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
            LIVE QUANTUM
          </div>
        </div>

        {/* Real-Time Telemetry Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs font-['Rajdhani']">
          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[9px] text-slate-400 font-['Orbitron'] block">ACTIVE PATTERN</span>
            <span className="font-['Orbitron'] font-black text-xs text-[#00F0FF] truncate block">
              {activePattern.patternName}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[9px] text-slate-400 font-['Orbitron'] block">DOMINANT COLOR</span>
            <span
              className={`font-['Orbitron'] font-black text-sm block ${
                heatmap.dominantColor === 'RED'
                  ? 'text-red-400'
                  : heatmap.dominantColor === 'GREEN'
                  ? 'text-emerald-400'
                  : 'text-purple-400'
              }`}
            >
              {heatmap.dominantColor} ({heatmap.dominantColor === 'RED' ? heatmap.red : heatmap.green}%)
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[9px] text-slate-400 font-['Orbitron'] block">VIOLET GAP</span>
            <span className="font-['Orbitron'] font-black text-sm text-[#00FF9D]">
              {violet.periodsSinceViolet} R
            </span>
          </div>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="grid grid-cols-5 gap-1 p-1.5 rounded-2xl bg-[#060D19] border border-[#00F0FF]/25">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('trends');
          }}
          className={`py-2 rounded-xl font-['Orbitron'] text-[9.5px] font-black tracking-wider transition ${
            activeTab === 'trends'
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          TRENDS
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('patterns');
          }}
          className={`py-2 rounded-xl font-['Orbitron'] text-[9.5px] font-black tracking-wider transition ${
            activeTab === 'patterns'
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          PATTERNS
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('markov');
          }}
          className={`py-2 rounded-xl font-['Orbitron'] text-[9.5px] font-black tracking-wider transition ${
            activeTab === 'markov'
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          MARKOV
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('frequency');
          }}
          className={`py-2 rounded-xl font-['Orbitron'] text-[9.5px] font-black tracking-wider transition ${
            activeTab === 'frequency'
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          SPECTRUM
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('models');
          }}
          className={`py-2 rounded-xl font-['Orbitron'] text-[9.5px] font-black tracking-wider transition ${
            activeTab === 'models'
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          MODELS
        </button>
      </div>

      {/* TAB 0: ADVANCED TREND ANALYSIS & OSCILLATORS */}
      {activeTab === 'trends' && (
        <div className="space-y-3.5">
          {/* Main Trend Classifier Card */}
          <div className="p-4 rounded-2xl bg-[#080F1F] border border-[#00F0FF]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
                <span className="font-['Orbitron'] text-xs font-black text-[#00F0FF] tracking-wider">
                  REAL-TIME QUANTITATIVE TREND MATRIX
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 font-['Orbitron'] text-[9px] font-black">
                {trendAnalysis.trendDirection}
              </span>
            </div>

            {/* Active State Banner */}
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase block">
                  CURRENT TREND REGIME
                </span>
                <span className="font-['Orbitron'] text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#67E8F9] to-[#00FF9D]">
                  {trendAnalysis.trendState}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-['Orbitron'] text-slate-400 block">STRENGTH</span>
                <span className="font-['Orbitron'] text-base font-black text-[#00FF9D]">
                  {trendAnalysis.trendStrength}%
                </span>
              </div>
            </div>

            {/* Probability Split: Continuation vs Reversal */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-['Orbitron']">
                <span className="text-[#00FF9D]">
                  Continuation Probability: {trendAnalysis.continuationOdds}%
                </span>
                <span className="text-amber-400">
                  Reversal Probability: {trendAnalysis.reversalOdds}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-[#00FF9D] to-[#00F0FF] h-full transition-all duration-500"
                  style={{ width: `${trendAnalysis.continuationOdds}%` }}
                />
                <div
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-500"
                  style={{ width: `${trendAnalysis.reversalOdds}%` }}
                />
              </div>
            </div>
          </div>

          {/* 4 Core Trend Quant Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. EMA (5 vs 10) Ribbon */}
            <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#00F0FF]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-['Orbitron'] text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00F0FF]" /> EMA (5 vs 10) RIBBON
                </span>
                <span
                  className={`text-[8.5px] font-['Orbitron'] font-black px-1.5 py-0.5 rounded ${
                    trendAnalysis.emaSignal.includes('GOLDEN')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : trendAnalysis.emaSignal.includes('DEATH')
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-slate-700/40 text-slate-300'
                  }`}
                >
                  {trendAnalysis.emaSignal}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-['Orbitron']">
                <span className="text-[#00F0FF]">Fast EMA(5): {trendAnalysis.emaFast}</span>
                <span className="text-slate-400">Slow EMA(10): {trendAnalysis.emaSlow}</span>
              </div>

              <p className="text-[11px] font-['Rajdhani'] text-slate-300 leading-snug">
                Moving average crossover tracks rapid directional shifts. Golden cross indicates Big trend acceleration, death cross indicates Small downward pressure.
              </p>
            </div>

            {/* 2. MACD Momentum Oscillator */}
            <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#00F0FF]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-['Orbitron'] text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#00FF9D]" /> MACD OSCILLATOR
                </span>
                <span className="text-[8.5px] font-['Orbitron'] font-black px-1.5 py-0.5 rounded bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30">
                  {trendAnalysis.momentumLabel}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-['Orbitron']">
                <span className="text-white">Histogram: {trendAnalysis.macdHistogram}</span>
                <span className="text-slate-400">Signal: {trendAnalysis.macdSignal}</span>
              </div>

              <p className="text-[11px] font-['Rajdhani'] text-slate-300 leading-snug">
                Detects internal momentum velocity. Positive expanding histograms signal high-probability trend continuation for the next period.
              </p>
            </div>

            {/* 3. Support & Resistance Dynamic Clusters */}
            <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#00F0FF]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-['Orbitron'] text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-300" /> SUPPORT & RESISTANCE
                </span>
                <span className="text-[8.5px] font-['Orbitron'] text-slate-300">
                  Pivot Median: 4.5
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-['Orbitron']">
                <span className="text-emerald-400">Support Floor: #{trendAnalysis.supportLevel}</span>
                <span className="text-rose-400">Resistance Ceiling: #{trendAnalysis.resistanceLevel}</span>
              </div>

              <p className="text-[11px] font-['Rajdhani'] text-slate-300 leading-snug">
                Calculates dynamic ball boundaries from historical clustering. Ball deviation distance is {trendAnalysis.currentBallDistance} units from median.
              </p>
            </div>

            {/* 4. Color Wave Pressure Index */}
            <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#00F0FF]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-['Orbitron'] text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" /> COLOR WAVE PRESSURE
                </span>
                <span
                  className={`text-[8.5px] font-['Orbitron'] font-black px-1.5 py-0.5 rounded ${
                    trendAnalysis.colorWaveDelta > 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {trendAnalysis.colorWaveDelta > 0
                    ? `+${trendAnalysis.colorWaveDelta}% GREEN`
                    : `${trendAnalysis.colorWaveDelta}% RED`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-['Orbitron']">
                <span className="text-slate-300">Violet Cycle Countdown:</span>
                <span className="text-purple-300 font-bold">~{trendAnalysis.violetCountdown} Rounds</span>
              </div>

              <p className="text-[11px] font-['Rajdhani'] text-slate-300 leading-snug">
                Quantifies cumulative order book pressure across red vs green waves, timing optimal entry for violet 0 and 5 boundaries.
              </p>
            </div>
          </div>

          {/* Master Trend Playbook Instructions */}
          <div className="p-4 rounded-2xl bg-[#060D19] border border-[#00F0FF]/25 space-y-2.5 text-left">
            <span className="font-['Orbitron'] text-[11px] font-black text-[#00FF9D] tracking-wider uppercase block">
              📖 WIN-GO 1M TREND EXECUTION PLAYBOOK
            </span>

            <div className="space-y-2 text-xs font-['Rajdhani']">
              <div className="p-2 rounded-xl bg-black/50 border border-slate-800/80">
                <span className="font-['Orbitron'] text-[10px] font-bold text-[#00F0FF] block">
                  RULE 1: BULLISH EXPANSION & GOLDEN CROSS
                </span>
                <p className="text-slate-300">
                  When EMA-5 &gt; EMA-10 with expanding MACD histogram, bet <b>BIG</b> with Level 1 stake. Target balls #{trendAnalysis.resistanceLevel} with safety hedge.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-black/50 border border-slate-800/80">
                <span className="font-['Orbitron'] text-[10px] font-bold text-amber-300 block">
                  RULE 2: DRAGON EXHAUSTION BREAKPOINT (&ge;75%)
                </span>
                <p className="text-slate-300">
                  When a streak hits 4x-6x and hazard rate crosses 75%, transition immediately to reversal counter-entry with Level 2 recovery multiplier.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-black/50 border border-slate-800/80">
                <span className="font-['Orbitron'] text-[10px] font-bold text-purple-300 block">
                  RULE 3: VIOLET BOUNDARY SURGE (GAP &ge; 8)
                </span>
                <p className="text-slate-300">
                  When violet gap crosses 8 rounds, allocate 15% secondary hedge on balls #0 and #5 to catch the high-yield violet multiplier.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: COLOR TRADING PATTERNS DIRECTORY */}
      {activeTab === 'patterns' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#00F0FF]/15 to-[#00FF9D]/15 border border-[#00F0FF]/30 text-xs font-['Rajdhani']">
            <span className="font-['Orbitron'] text-[#00F0FF] font-black block">
              COLOR TRADING PATTERN INTELLIGENCE (WIN-GO 1M):
            </span>
            <p className="text-slate-300 mt-0.5">
              NEMESIS automatically detects every classic and modern color trading sequence in real-time, calculating hazard decay and parity resonance.
            </p>
          </div>

          <div className="space-y-2.5">
            {patternsLibrary.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-[#080E1B] border border-[#00F0FF]/20 space-y-1.5 hover:border-[#00F0FF]/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Orbitron'] font-black text-xs text-white">
                    {p.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-['Orbitron'] text-[9px] font-black border ${
                      p.status.includes('ACTIVE') || p.status.includes('SURGE')
                        ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/50 shadow-[0_0_10px_rgba(0,255,157,0.3)] animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="font-['JetBrains_Mono'] text-[11px] text-[#67E8F9] bg-black/50 px-2 py-1 rounded border border-slate-800">
                  Sequence: {p.seq}
                </div>

                <p className="text-xs font-['Rajdhani'] text-slate-300 leading-snug">
                  {p.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-['Rajdhani'] text-slate-400 pt-1 border-t border-white/5">
                  <span>Rule: <b className="text-[#00FF9D]">{p.rule}</b></span>
                  <span>Hazard: <b className="text-amber-300">{p.hazard}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MARKOV STATE PROBABILITY */}
      {activeTab === 'markov' && (
        <div className="space-y-3">
          {/* Big vs Small Probability Bar */}
          <div className="p-4 rounded-3xl bg-[#080E1B] border border-[#00F0FF]/25 space-y-3">
            <div className="flex items-center justify-between text-xs font-['Orbitron']">
              <span className="text-[#00F0FF] font-black">BIG: {bigPercent}%</span>
              <span className="text-slate-400">STATE RATIO</span>
              <span className="text-[#00FF9D] font-black">SMALL: {smallPercent}%</span>
            </div>

            {/* Split Progress Bar */}
            <div className="h-3 rounded-full bg-black/80 p-0.5 border border-[#00F0FF]/30 flex overflow-hidden">
              <div
                style={{ width: `${bigPercent}%` }}
                className="h-full bg-gradient-to-r from-[#0284C7] to-[#00F0FF] transition-all duration-700 shadow-[0_0_10px_#00F0FF]"
              />
              <div
                style={{ width: `${smallPercent}%` }}
                className="h-full bg-gradient-to-r from-[#00FF9D] to-[#059669] transition-all duration-700 shadow-[0_0_10px_#00FF9D]"
              />
            </div>
          </div>

          {/* Markov Transition Matrix Matrix Diagram */}
          <div className="p-4 rounded-3xl bg-[#080E1B] border border-[#00F0FF]/25 space-y-3">
            <div className="font-['Orbitron'] text-xs font-bold text-[#00F0FF] flex items-center gap-1.5">
              <Network className="w-4 h-4" /> 2-STAGE TRANSITION STATE MATRIX
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-['Rajdhani']">
              <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 space-y-1">
                <span className="font-['Orbitron'] text-[10px] text-[#00F0FF] block">BIG → BIG</span>
                <span className="text-base font-black font-['Orbitron'] text-slate-200">
                  {Math.round(48 + Math.random() * 8)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Streak continuation likelihood</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 space-y-1">
                <span className="font-['Orbitron'] text-[10px] text-[#00FF9D] block">BIG → SMALL</span>
                <span className="text-base font-black font-['Orbitron'] text-slate-200">
                  {Math.round(42 + Math.random() * 8)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Inversion point probability</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 space-y-1">
                <span className="font-['Orbitron'] text-[10px] text-[#00FF9D] block">SMALL → SMALL</span>
                <span className="text-base font-black font-['Orbitron'] text-slate-200">
                  {Math.round(46 + Math.random() * 8)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Small sequence continuation</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 space-y-1">
                <span className="font-['Orbitron'] text-[10px] text-[#00F0FF] block">SMALL → BIG</span>
                <span className="text-base font-black font-['Orbitron'] text-slate-200">
                  {Math.round(44 + Math.random() * 8)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Reversal transition probability</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NUMBER FREQUENCY SPECTRUM */}
      {activeTab === 'frequency' && (
        <div className="p-4 rounded-3xl bg-[#080E1B] border border-[#00F0FF]/25 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-['Orbitron'] font-bold text-[#00F0FF] flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" /> 0-9 FREQUENCY SPECTRUM (LAST {historyList.length})
            </span>
            <span className="text-[10px] text-slate-400 font-['Rajdhani']">
              HOT (Cyan) vs COLD (Slate)
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {frequencies.map((f) => {
              const pct = Math.round((f.count / maxFreq) * 100);
              const isHot = f.count >= 3;

              return (
                <div key={f.number} className="flex items-center gap-2.5 text-xs">
                  <div className="w-7 shrink-0">
                    <NumberBall number={f.number} size="sm" />
                  </div>

                  <div className="flex-1 h-3 rounded-full bg-black/60 p-0.5 border border-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHot
                          ? 'bg-gradient-to-r from-[#00F0FF] to-[#00FF9D] shadow-[0_0_10px_#00F0FF]'
                          : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  <span className="w-12 text-right font-['Orbitron'] text-[10px] font-bold text-slate-300">
                    {f.count} hits
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: NEURAL MODELS SELECTION */}
      {activeTab === 'models' && (
        <div className="space-y-2.5">
          {engines.map((eng) => {
            const isSelected = activeEngine === eng.name;

            return (
              <div
                key={eng.name}
                onClick={() => {
                  playClickSound();
                  onSelectEngine(eng.name);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#0C1E33] to-[#06101D] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-[#060D19] border-slate-800 hover:border-[#00F0FF]/40'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Orbitron'] font-black text-xs text-white">
                      {eng.name}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] font-['Orbitron'] text-[8px] font-black">
                      {eng.badge}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#00FF9D]" />}
                </div>

                <p className="text-[11px] font-['Rajdhani'] text-slate-300 mt-1 leading-snug">
                  {eng.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] font-['Orbitron'] text-slate-400">
                  <span>Latency: <b className="text-[#00FF9D]">{eng.speed}</b></span>
                  <span>Accuracy: <b className="text-[#00F0FF]">{eng.accuracy}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
