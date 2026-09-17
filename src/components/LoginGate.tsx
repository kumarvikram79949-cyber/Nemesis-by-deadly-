import React, { useState } from 'react';
import {
  Lock,
  Sparkles,
  Send,
  ShoppingCart,
  User,
  CheckCircle2,
  Terminal,
  ShieldAlert,
} from 'lucide-react';
import {
  ADMIN_KEY,
  DEVELOPER_NAME,
  getStoredKeys,
  saveSession,
  saveStoredKeys,
  TELEGRAM_LINK,
  TELEGRAM_USERNAME,
} from '../utils/storage';
import { UserSession } from '../types';
import { playClickSound, playWinSound, tone } from '../utils/audio';

interface LoginGateProps {
  onLoginSuccess: (session: UserSession) => void;
  onOpenBuyModal: () => void;
}

export default function LoginGate({
  onLoginSuccess,
  onOpenBuyModal,
}: LoginGateProps) {
  const [keyInput, setKeyInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [needsNamePrompt, setNeedsNamePrompt] = useState(false);
  const [pendingMatchedKey, setPendingMatchedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setErrorMsg('');
    const rawKey = keyInput.trim();

    if (!rawKey) {
      setErrorMsg('SYSTEM ERROR: Please input security authorization key!');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      // Check if Admin Key
      if (rawKey.toUpperCase() === ADMIN_KEY) {
        playWinSound();
        const adminSession: UserSession = {
          name: 'DEADLY (Owner)',
          key: ADMIN_KEY,
          role: 'admin',
          activatedAt: Date.now(),
          expiresAt: null,
          planName: 'Quantum Admin Master',
        };
        saveSession(adminSession);
        onLoginSuccess(adminSession);
        return;
      }

      // Check standard keys
      const allKeys = getStoredKeys();
      const matched = allKeys.find((k) => k.key.toUpperCase() === rawKey.toUpperCase());

      if (!matched) {
        tone(180, 0, 0.25, 'sawtooth', 0.1);
        setErrorMsg('AUTH DENIED! Invalid cryptographic key. Purchase key or contact @Deadlypred9');
        return;
      }

      if (matched.status === 'revoked') {
        tone(180, 0, 0.25, 'sawtooth', 0.1);
        setErrorMsg('SECURITY ALERT: Key revoked by central administrator.');
        return;
      }

      if (matched.expiresAt && Date.now() > matched.expiresAt) {
        tone(180, 0, 0.25, 'sawtooth', 0.1);
        setErrorMsg('SESSION EXPIRED: Key validity duration has elapsed. Renew key to proceed.');
        return;
      }

      // If key already has assigned user name, login immediately
      if (matched.assignedTo && matched.assignedTo.trim()) {
        playWinSound();
        const session: UserSession = {
          name: matched.assignedTo,
          key: matched.key,
          role: 'user',
          activatedAt: Date.now(),
          expiresAt: matched.expiresAt,
          planName: matched.durationLabel,
        };
        saveSession(session);
        onLoginSuccess(session);
        return;
      }

      // First time user with this key -> prompt for Name
      setPendingMatchedKey(matched.key);
      setNeedsNamePrompt(true);
    }, 400);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const finalName = nameInput.trim();
    if (!finalName) {
      setErrorMsg('Aapka naam darj karein / Enter operative name');
      return;
    }

    if (!pendingMatchedKey) return;

    const allKeys = getStoredKeys();
    const matched = allKeys.find((k) => k.key.toUpperCase() === pendingMatchedKey.toUpperCase());

    if (matched) {
      matched.assignedTo = finalName;
      saveStoredKeys(allKeys);

      playWinSound();
      const session: UserSession = {
        name: finalName,
        key: matched.key,
        role: 'user',
        activatedAt: Date.now(),
        expiresAt: matched.expiresAt,
        planName: matched.durationLabel,
      };
      saveSession(session);
      onLoginSuccess(session);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#040711]/90 backdrop-blur-2xl overflow-y-auto">
      {/* Sci-fi Hologram Reticle Effect */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-40" />

      <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-b from-[#0C1527] via-[#070D1A] to-[#03060D] border-2 border-[#00F0FF]/40 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(0,240,255,0.2)] text-center my-auto overflow-hidden">
        {/* Top neon line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] via-[#00FF9D] to-transparent shadow-[0_0_15px_#00F0FF]" />

        {/* Telegram Direct Header Link */}
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#00F0FF] text-black font-['Orbitron'] text-[10px] font-black tracking-wider flex items-center justify-center gap-2 border border-[#38BDF8]/40 shadow-[0_4px_16px_rgba(0,240,255,0.3)] mb-5 hover:brightness-110 transition active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5" /> JOIN TELEGRAM • {TELEGRAM_USERNAME}
        </a>

        {/* Cyber Core Emblem */}
        <div className="relative w-20 h-20 mx-auto mb-3 rounded-2xl p-1 bg-gradient-to-tr from-[#00F0FF] via-[#0284C7] to-[#00FF9D] shadow-[0_0_35px_rgba(0,240,255,0.45)]">
          <div className="w-full h-full rounded-[14px] bg-[#050C19] flex items-center justify-center text-[#00F0FF]">
            <Terminal className="w-9 h-9 text-[#00F0FF] animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-['Orbitron'] text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF] tracking-wider drop-shadow-[0_0_18px_rgba(0,240,255,0.5)]">
          NEMESIS TERMINAL
        </h1>
        <p className="font-['Rajdhani'] text-xs font-bold text-[#38BDF8] uppercase tracking-[3px] mt-1 mb-6">
          QUANTUM AI VERIFICATION GATEWAY
        </p>

        {/* FIRST TIME USER PROMPT */}
        {needsNamePrompt ? (
          <form onSubmit={handleNameSubmit} className="space-y-3.5 text-left">
            <div className="p-3 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-center">
              <span className="text-xs font-['Orbitron'] text-[#00F0FF] font-bold block">
                👋 FIRST TIME OPERATIVE REGISTRATION
              </span>
              <span className="text-[11px] font-['Rajdhani'] text-[#94A3B8] mt-1 block">
                Apna naam darj karein. Ye aapke User Info tab me cryptographically link ho jayega.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-['Orbitron'] text-[#00F0FF] uppercase tracking-wider block mb-1">
                OPERATIVE NAME / AAPKA NAAM
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Vikram Singh"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border-1.5 border-[#00F0FF]/40 text-[#E0F2FE] font-['Rajdhani'] font-bold text-sm tracking-wide focus:border-[#00F0FF] focus:outline-none focus:ring-2 focus:ring-[#00F0FF]/30"
                />
                <User className="w-4 h-4 text-[#00F0FF] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#00FF9D] text-black font-['Orbitron'] font-black text-xs tracking-widest uppercase shadow-[0_6px_25px_rgba(0,240,255,0.4)] transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> BIND OPERATIVE & LAUNCH
            </button>
          </form>
        ) : (
          /* STANDARD KEY INPUT FORM */
          <form onSubmit={handleVerifyKey} className="space-y-4">
            <div className="relative text-left">
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="ENTER ACCESS KEY..."
                className="w-full px-4 py-3.5 rounded-2xl bg-[#040813] border-2 border-[#00F0FF]/35 text-[#00F0FF] font-['JetBrains_Mono'] font-extrabold text-center text-sm sm:text-base tracking-[2.5px] placeholder:tracking-normal placeholder:font-['Rajdhani'] placeholder:text-xs placeholder:text-slate-500 focus:border-[#00F0FF] focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition"
              />
              <Lock className="w-4 h-4 text-[#00F0FF]/40 absolute left-3.5 top-4 pointer-events-none" />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-['Rajdhani'] font-bold text-center flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] hover:brightness-110 text-black font-['Orbitron'] font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_8px_30px_rgba(0,240,255,0.35)] transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {isVerifying ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </button>

            {/* Action button: Buy Key */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onOpenBuyModal();
                }}
                className="w-full py-3 px-3 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] font-['Orbitron'] text-xs font-extrabold tracking-wider border border-[#00F0FF]/40 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" /> GET VIP ACCESS KEY
              </button>
            </div>
          </form>
        )}

        {/* Developer & Admin Badge Info */}
        <div className="mt-6 pt-3.5 border-t border-slate-800 text-[11px] font-['Rajdhani'] text-slate-400 space-y-1">
          <div>
            System Architect:{' '}
            <span className="text-[#00F0FF] font-bold font-['Orbitron'] tracking-wider">
              {DEVELOPER_NAME}
            </span>{' '}
            • Telegram:{' '}
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-[#38BDF8] font-bold hover:underline"
            >
              {TELEGRAM_USERNAME}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
