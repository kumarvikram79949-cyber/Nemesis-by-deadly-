import { useState } from 'react';
import { Volume2, VolumeX, Shield, LogOut, Send, Cpu } from 'lucide-react';
import { UserSession } from '../types';
import { DEVELOPER_NAME, TELEGRAM_LINK, TELEGRAM_USERNAME } from '../utils/storage';
import { isSoundEnabled, playClickSound, setSoundEnabled } from '../utils/audio';

interface NavbarProps {
  session: UserSession | null;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenBuyModal: () => void;
}

export default function Navbar({
  session,
  onLogout,
  onOpenAdmin,
}: NavbarProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    playClickSound();
  };

  return (
    <header className="sticky top-0 z-30 flex-shrink-0 bg-[#070D18]/90 backdrop-blur-xl border-b border-[#00F0FF]/30 shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
      {/* Top Cyber Telemetry Banner */}
      <div className="relative py-1.5 px-3 text-center bg-gradient-to-r from-[#003B5C] via-[#00F0FF] via-[#00FF9D] to-[#003B5C] text-[#030712] font-['Orbitron'] text-[9px] font-black tracking-[2.5px] uppercase shadow-[0_0_18px_rgba(0,240,255,0.4)]">
        ⚡ NEMESIS BY {DEVELOPER_NAME} • NEXT-GEN QUANTUM HUD PREDICTION SYSTEM ⚡
      </div>

      {/* Main Tactical Bar */}
      <div className="max-w-xl mx-auto px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-[#00F0FF] via-[#00B0FF] to-[#00FF9D] shadow-[0_0_15px_rgba(0,240,255,0.5)] shrink-0">
            <div className="w-full h-full rounded-[10px] bg-[#050C18] flex items-center justify-center text-[#00F0FF] font-black text-sm">
              <Cpu className="w-5 h-5 text-[#00F0FF] animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Orbitron'] font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF] tracking-wider truncate">
                NEMESIS
              </span>
              <span className="text-[8.5px] font-['Orbitron'] font-extrabold text-[#00FF9D] bg-[#00FF9D]/15 px-2 py-0.2 rounded border border-[#00FF9D]/40 shrink-0">
                BY DEADLY
              </span>
            </div>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-['Rajdhani'] font-bold text-[#38BDF8] hover:text-[#00F0FF] flex items-center gap-1 transition truncate"
            >
              <Send className="w-2.5 h-2.5 text-[#00F0FF]" /> {TELEGRAM_USERNAME}
            </a>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {session && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[9px] font-['JetBrains_Mono'] text-[#38BDF8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
              <span className="truncate max-w-[90px]">{session.name}</span>
            </div>
          )}

          {/* Admin Button */}
          {session?.role === 'admin' && (
            <button
              onClick={() => {
                playClickSound();
                onOpenAdmin();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black font-['Orbitron'] font-black text-[10px] tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition hover:brightness-110"
              title="Open Admin Panel"
            >
              <Shield className="w-3.5 h-3.5" /> ADMIN
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition ${
              soundOn
                ? 'bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
            title={soundOn ? 'Sound On' : 'Sound Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              playClickSound();
              onLogout();
            }}
            className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 flex items-center justify-center transition"
            title="Lock / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
