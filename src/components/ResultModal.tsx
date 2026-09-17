import { useEffect, useRef } from 'react';
import { Award, CheckCircle2, XCircle, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { HistoryRecord } from '../types';
import NumberBall from './NumberBall';
import { playClickSound, playJackpotSound, playLossSound, playWinSound } from '../utils/audio';

interface ResultModalProps {
  result: HistoryRecord | null;
  onClose: () => void;
}

export default function ResultModal({ result, onClose }: ResultModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!result) return;

    if (result.status === 'DIRECT HIT') {
      playJackpotSound();
    } else if (result.status === 'WIN') {
      playWinSound();
    } else {
      playLossSound();
    }

    // Canvas Confetti / Cyber sparks animation for Win or Direct Hit
    if (result.status === 'WIN' || result.status === 'DIRECT HIT') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = Array.from({ length: 90 }, () => ({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 5 + 2,
        color: [
          '#00F0FF',
          '#00FF9D',
          '#38BDF8',
          '#67E8F9',
          '#A855F7',
          '#FFFFFF',
        ][Math.floor(Math.random() * 6)],
        alpha: 1,
      }));

      let animId: number;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.alpha -= 0.015;
          if (p.alpha > 0) {
            alive = true;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        if (alive) {
          animId = requestAnimationFrame(render);
        }
      };
      render();

      return () => cancelAnimationFrame(animId);
    }
  }, [result]);

  if (!result) return null;

  const isJackpot = result.status === 'DIRECT HIT';
  const isWin = result.status === 'WIN';
  const isLoss = result.status === 'LOSS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/90 backdrop-blur-xl">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      <div
        className={`relative z-20 w-full max-w-sm rounded-3xl p-6 text-center border-2 shadow-2xl transition-all ${
          isJackpot
            ? 'bg-gradient-to-b from-[#0D243D] via-[#071524] to-[#040810] border-[#00F0FF] shadow-[0_0_60px_rgba(0,240,255,0.45)]'
            : isWin
            ? 'bg-gradient-to-b from-[#08221D] via-[#051512] to-[#030A09] border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
            : 'bg-gradient-to-b from-[#250E12] via-[#140608] to-[#080204] border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.25)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon */}
        <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
          {isJackpot ? (
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-[#0284C7] to-[#00FF9D] p-1 shadow-[0_0_30px_rgba(0,240,255,0.6)] animate-bounce">
              <div className="w-full h-full bg-[#050C19] rounded-[14px] flex items-center justify-center text-[#00F0FF]">
                <Award className="w-10 h-10 text-[#00F0FF]" />
              </div>
            </div>
          ) : isWin ? (
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 p-1 shadow-[0_0_30px_rgba(52,211,153,0.5)]">
              <div className="w-full h-full bg-[#031510] rounded-[14px] flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-red-500 to-rose-700 p-1 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <div className="w-full h-full bg-[#180507] rounded-[14px] flex items-center justify-center text-red-400">
                <XCircle className="w-10 h-10" />
              </div>
            </div>
          )}
        </div>

        {/* Headline */}
        <h3
          className={`font-['Orbitron'] text-2xl font-black tracking-wider uppercase ${
            isJackpot
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF]'
              : isWin
              ? 'text-emerald-300'
              : 'text-red-400'
          }`}
        >
          {isJackpot
            ? 'QUANTUM DIRECT HIT!'
            : isWin
            ? 'PREDICTION HIT!'
            : 'ROUND MISSED'}
        </h3>

        <div className="text-[11px] font-['Rajdhani'] font-bold text-slate-300 mt-0.5 tracking-wider">
          PERIOD #{result.period}
        </div>

        {/* Prediction Comparison Detail */}
        <div className="my-4 p-3.5 rounded-2xl bg-black/70 border border-white/10 space-y-2.5 text-xs font-['Rajdhani']">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-['Orbitron'] text-[10px]">AI PREDICTION</span>
            <span className="font-['Orbitron'] font-black text-[#00F0FF] text-sm">
              {result.predictedSize} (Ball {result.predictedNumber})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-['Orbitron'] text-[10px]">ACTUAL OUTCOME</span>
            <div className="flex items-center gap-2">
              <span className="font-['Orbitron'] font-black text-white text-sm">
                {result.actualSize}
              </span>
              <NumberBall number={result.actualNumber} size="sm" />
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] text-black font-['Orbitron'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.35)] transition hover:brightness-110 active:scale-[0.98]"
        >
          CONTINUE TO NEXT PERIOD
        </button>
      </div>
    </div>
  );
}
