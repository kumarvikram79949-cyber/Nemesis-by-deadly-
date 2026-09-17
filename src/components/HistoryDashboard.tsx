import { Trash2, TrendingUp, CheckCircle2, XCircle, Award } from 'lucide-react';
import { HistoryRecord } from '../types';
import NumberBall from './NumberBall';
import { playClickSound } from '../utils/audio';

interface HistoryDashboardProps {
  records: HistoryRecord[];
  onClearHistory: () => void;
  onDeleteRecord?: (timestamp: number) => void;
}

export default function HistoryDashboard({
  records,
  onClearHistory,
  onDeleteRecord,
}: HistoryDashboardProps) {
  const total = records.length;
  const wins = records.filter((r) => r.status === 'WIN').length;
  const directHits = records.filter((r) => r.status === 'DIRECT HIT').length;
  const losses = records.filter((r) => r.status === 'LOSS').length;
  const winRate = total > 0 ? Math.round(((wins + directHits) / total) * 100) : 0;

  return (
    <div className="space-y-4 pb-8">
      {/* Top Analytics Summary Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#0D1829] via-[#080E1A] to-[#04060E] border-2 border-[#00F0FF]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#00F0FF]/20">
          <div>
            <h2 className="font-['Orbitron'] text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF]">
              QUANTUM MATCH LEDGER
            </h2>
            <p className="text-[11px] font-['Rajdhani'] font-bold text-slate-400">
              Live Round-by-Round Verified Match History
            </p>
          </div>

          {total > 0 && (
            <button
              onClick={() => {
                playClickSound();
                onClearHistory();
              }}
              className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-['Rajdhani'] font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Clear All History"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* Analytics stats */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center">
          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/20">
            <span className="text-[9px] font-['Orbitron'] text-slate-400 block">TOTAL</span>
            <span className="font-['Orbitron'] text-sm sm:text-base font-black text-slate-200">
              {total}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/30">
            <span className="text-[9px] font-['Orbitron'] text-emerald-400 block">WINS</span>
            <span className="font-['Orbitron'] text-sm sm:text-base font-black text-emerald-300">
              {wins}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-[#00F0FF]/30">
            <span className="text-[9px] font-['Orbitron'] text-[#00F0FF] block">DIRECT</span>
            <span className="font-['Orbitron'] text-sm sm:text-base font-black text-[#00F0FF]">
              {directHits}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/60 border border-[#00FF9D]/30">
            <span className="text-[9px] font-['Orbitron'] text-[#00FF9D] block">ACCURACY</span>
            <span className="font-['Orbitron'] text-sm sm:text-base font-black text-[#00FF9D]">
              {winRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Match Records Table / List */}
      <div className="space-y-2">
        {total === 0 ? (
          <div className="p-10 rounded-3xl bg-[#060D19] border border-[#00F0FF]/20 text-center space-y-2">
            <TrendingUp className="w-8 h-8 text-[#00F0FF] mx-auto opacity-40 animate-pulse" />
            <div className="font-['Orbitron'] text-sm font-bold text-slate-300">
              NO MATCH SESSIONS RECORDED YET
            </div>
            <p className="text-xs font-['Rajdhani'] text-slate-500 max-w-xs mx-auto">
              Jab bhi active period ka result aayega, yahan real-time comparison automatic display hoga.
            </p>
          </div>
        ) : (
          records.map((rec) => {
            const isJackpot = rec.status === 'DIRECT HIT';
            const isWin = rec.status === 'WIN';

            return (
              <div
                key={rec.period + rec.timestamp}
                className={`p-3 sm:p-3.5 rounded-2xl border transition flex items-center justify-between gap-2.5 ${
                  isJackpot
                    ? 'bg-gradient-to-r from-[#0C223A] via-[#081524] to-[#040810] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : isWin
                    ? 'bg-gradient-to-r from-[#061F1A] via-[#051512] to-[#030A09] border-emerald-500/40'
                    : 'bg-[#060A14] border-red-500/30'
                }`}
              >
                {/* Period & Result */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['JetBrains_Mono'] font-extrabold text-xs sm:text-sm text-slate-200">
                      {rec.period}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-['Orbitron'] text-[8.5px] font-black uppercase flex items-center gap-1 ${
                        isJackpot
                          ? 'bg-[#00F0FF]/25 border border-[#00F0FF] text-[#00F0FF]'
                          : isWin
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                          : 'bg-red-500/20 border border-red-500/50 text-red-300'
                      }`}
                    >
                      {isJackpot ? (
                        <>
                          <Award className="w-3 h-3 text-[#00F0FF]" /> DIRECT HIT
                        </>
                      ) : isWin ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> WIN
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> MISS
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-[11px] font-['Rajdhani'] text-slate-400 flex flex-wrap items-center gap-2">
                    <span>
                      Predicted:{' '}
                      <b className="text-white font-['Orbitron']">{rec.predictedSize}</b> (
                      {rec.predictedNumber})
                    </span>
                    <span>•</span>
                    <span>
                      Actual:{' '}
                      <b
                        className={
                          rec.actualSize === 'BIG' ? 'text-[#00F0FF]' : 'text-[#00FF9D]'
                        }
                      >
                        {rec.actualSize}
                      </b>
                    </span>
                    {rec.level && (
                      <>
                        <span>•</span>
                        <span className="text-[#67E8F9] font-['Orbitron'] text-[9px] font-bold">
                          {rec.level}
                        </span>
                      </>
                    )}
                    {rec.patternDetected && (
                      <span className="text-[8.5px] font-['Orbitron'] font-bold text-slate-400 bg-black/50 px-1.5 py-0.5 rounded border border-white/5">
                        {rec.patternDetected}
                      </span>
                    )}
                  </div>
                </div>

                {/* Number Ball, Result Match & Delete Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <NumberBall number={rec.actualNumber} size="sm" />
                  {onDeleteRecord && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onDeleteRecord(rec.timestamp);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition active:scale-90"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
