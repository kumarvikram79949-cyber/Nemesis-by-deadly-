import {
  User,
  KeyRound,
  ShieldCheck,
  Send,
  Sparkles,
  Zap,
  Lock,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { UserSession } from '../types';
import { DEVELOPER_NAME, TELEGRAM_LINK, TELEGRAM_USERNAME } from '../utils/storage';
import { playClickSound } from '../utils/audio';

interface UserInfoDashboardProps {
  session: UserSession | null;
  onLogout: () => void;
  onOpenBuyModal: () => void;
}

export default function UserInfoDashboard({
  session,
  onLogout,
  onOpenBuyModal,
}: UserInfoDashboardProps) {
  // Format remaining time
  const getRemainingTimeText = () => {
    if (!session) return 'N/A';
    if (!session.expiresAt) return 'UNLIMITED / LIFETIME ACCESS';

    const diff = session.expiresAt - Date.now();
    if (diff <= 0) return 'EXPIRED';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    if (days > 0) {
      return `${days} Days ${remHours} Hours Remaining`;
    }
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} Hours ${mins} Minutes Remaining`;
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Profile Hero Card */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#0D182A] via-[#080E1B] to-[#040710] border-2 border-[#00F0FF]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(0,240,255,0.2)] text-center">
        {/* Top neon line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] via-[#00FF9D] to-transparent shadow-[0_0_15px_#00F0FF]" />

        <div className="relative w-20 h-20 mx-auto mb-3 rounded-2xl p-1 bg-gradient-to-tr from-[#00F0FF] via-[#0284C7] to-[#00FF9D] shadow-[0_0_25px_rgba(0,240,255,0.45)]">
          <div className="w-full h-full rounded-[14px] bg-[#050B16] flex items-center justify-center text-[#00F0FF]">
            <User className="w-9 h-9 text-[#00F0FF]" />
          </div>
        </div>

        <h2 className="font-['Orbitron'] text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF] tracking-wider">
          {session?.name || 'VIP Operative'}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="px-3 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] font-['Orbitron'] text-[10px] font-black tracking-wider uppercase">
            {session?.planName || 'VIP PASS'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-['Orbitron'] text-[10px] font-black flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        </div>
      </div>

      {/* Key & License Credentials */}
      <div className="p-4 rounded-3xl bg-[#080E1B] border border-[#00F0FF]/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#00F0FF]/15">
          <span className="font-['Orbitron'] text-xs font-bold text-[#00F0FF] tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-4 h-4" /> LICENSE & KEY CREDENTIALS
          </span>
          <span className="text-[10px] text-slate-400 font-['Rajdhani']">
            Cryptographically Locked
          </span>
        </div>

        <div className="space-y-2 text-xs font-['Rajdhani']">
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 flex items-center justify-between">
            <span className="text-slate-400 font-['Orbitron'] text-[10px]">ACTIVE KEY</span>
            <span className="font-['JetBrains_Mono'] font-extrabold text-[#00F0FF] tracking-widest text-sm">
              {session?.key || '---'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 flex items-center justify-between">
            <span className="text-slate-400 font-['Orbitron'] text-[10px]">VALIDITY STATUS</span>
            <span className="font-['Orbitron'] font-bold text-[#00FF9D] text-xs">
              {getRemainingTimeText()}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/20 flex items-center justify-between">
            <span className="text-slate-400 font-['Orbitron'] text-[10px]">DEVICE / PROTOCOL</span>
            <span className="font-['JetBrains_Mono'] text-emerald-400 text-xs">
              TLS 1.3 • AES-256 ENCRYPTED
            </span>
          </div>
        </div>

        <div className="pt-1 flex gap-2">
          <button
            onClick={() => {
              playClickSound();
              onOpenBuyModal();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] text-black font-['Orbitron'] text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.35)] transition hover:brightness-110 active:scale-[0.98]"
          >
            EXTEND / RENEW KEY
          </button>
          <button
            onClick={() => {
              playClickSound();
              onLogout();
            }}
            className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 font-['Orbitron'] text-xs font-bold border border-red-500/30 transition"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Developer Information Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0D1829] via-[#080E1B] to-[#040710] border border-[#00F0FF]/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-['Orbitron'] text-xs font-bold text-[#00F0FF] tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> OFFICIAL ARCHITECT & DEVELOPER
          </span>
          <span className="text-[10px] text-emerald-400 font-['Orbitron'] font-bold">
            VERIFIED OWNER
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-black/50 border border-[#00F0FF]/20 flex items-center justify-between gap-3">
          <div>
            <div className="font-['Orbitron'] font-black text-base text-white">
              DEVELOPER: {DEVELOPER_NAME}
            </div>
            <div className="text-[11px] font-['Rajdhani'] text-slate-300">
              Creator of NEMESIS AI Prediction Engine & Telegram Support
            </div>
          </div>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#00F0FF] text-black font-['Orbitron'] text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.35)] shrink-0 transition hover:brightness-110 active:scale-[0.97]"
          >
            <Send className="w-3.5 h-3.5" /> {TELEGRAM_USERNAME}
          </a>
        </div>
      </div>

      {/* Complete System Specifications requested in prompt */}
      <div className="p-4 rounded-3xl bg-[#080E1B] border border-[#00F0FF]/30 space-y-3">
        <div className="font-['Orbitron'] text-xs font-bold text-[#00F0FF] tracking-wider">
          🌟 SYSTEM SPECIFICATIONS & CAPABILITIES
        </div>

        <div className="space-y-2.5 text-xs font-['Rajdhani']">
          {/* Experience Level */}
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/15">
            <div className="text-[#00F0FF] font-['Orbitron'] text-[10px] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 🌟 EXPERIENCE LEVEL
            </div>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              ♦️ PREMIUM • ULTRA • NEXT-GEN ♦️ Smooth & Powerful User Experience ♦️ Fast Response • Clean Interface
            </p>
          </div>

          {/* AI Result System */}
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/15">
            <div className="text-[#00F0FF] font-['Orbitron'] text-[10px] font-bold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> 🧠 AI RESULT SYSTEM
            </div>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              ♦️ Advanced AI Result Analysis 🧠 Smart Pattern Detection ⭕️ Real-Time Result Processing 🔮 Intelligent Prediction Engine
            </p>
          </div>

          {/* Working Level */}
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/15">
            <div className="text-[#00F0FF] font-['Orbitron'] text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> ⚡️ WORKING LEVEL
            </div>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              ⚡ HIGH-PERFORMANCE SYSTEM 🚀 Ultra-Fast Processing ♦️ Optimized For Smooth Performance ♦️ Advanced Control & Stability
            </p>
          </div>

          {/* Premium Features */}
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00F0FF]/15">
            <div className="text-[#00F0FF] font-['Orbitron'] text-[10px] font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 🛡 PREMIUM FEATURES
            </div>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              🤖 AI POWERED ENGINE ♦️ LIVE RESULT SYSTEM ♦️ SMART ANALYSIS ♦️ STEALTH PREMIUM UI ♦️ SECURE & PRIVATE SYSTEM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
