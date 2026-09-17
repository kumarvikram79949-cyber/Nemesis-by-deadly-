import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  QrCode,
  CreditCard,
  Zap,
} from 'lucide-react';
import {
  DEVELOPER_NAME,
  PLANS,
  submitPaymentRequest,
  TELEGRAM_LINK,
  TELEGRAM_USERNAME,
  UPI_ID,
} from '../utils/storage';
import { PlanOption } from '../types';
import { playClickSound } from '../utils/audio';

interface BuyKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmittedRequest?: () => void;
}

export default function BuyKeyModal({ isOpen, onClose, onSubmittedRequest }: BuyKeyModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(PLANS[4]); // 7 Days default
  const [userName, setUserName] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    playClickSound();
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenTelegram = () => {
    playClickSound();
    const message = encodeURIComponent(
      `Hello DEADLY Bhai! Maine NEMESIS Key ke liye ${selectedPlan.label} (₹${selectedPlan.price}) ka payment UPI ID (${UPI_ID}) par kar diya hai.\n\n` +
      `User Name: ${userName || 'NEMESIS Operative'}\n` +
      `Plan: ${selectedPlan.label}\n` +
      `Amount: ₹${selectedPlan.price}\n` +
      (utrNumber ? `UTR / Ref: ${utrNumber}\n` : '') +
      `Please verify payment screenshot & grant VIP authorization key.`
    );
    window.open(`${TELEGRAM_LINK}?text=${message}`, '_blank');
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setFormError('');
    if (!userName.trim()) {
      setFormError('Kripya apna naam darj karein! / Please enter operative name');
      return;
    }
    if (!utrNumber.trim()) {
      setFormError('Kripya UPI Transaction ID / UTR darj karein! / Please enter 12-digit UTR');
      return;
    }

    submitPaymentRequest(userName.trim(), selectedPlan, utrNumber.trim(), telegramHandle.trim());
    setSubmitted(true);
    if (onSubmittedRequest) onSubmittedRequest();
  };

  // UPI Intent URL
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    'NEMESIS BY DEADLY'
  )}&am=${selectedPlan.price}&cu=INR&tn=${encodeURIComponent(
    `NEMESIS Key ${selectedPlan.label}`
  )}`;

  // Cyber styled QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiIntentUrl
  )}&color=00f0ff&bgcolor=060b18`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0D1629] via-[#080E1B] to-[#040710] border-2 border-[#00F0FF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(0,240,255,0.2)] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top cyan neon line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] via-[#00FF9D] to-transparent shadow-[0_0_15px_#00F0FF]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#00F0FF]/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF]/30 to-[#0284C7]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Zap className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="font-['Orbitron'] text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF]">
                ACQUIRE VIP ACCESS KEY
              </h3>
              <p className="text-[11px] font-['Rajdhani'] font-bold text-[#38BDF8] tracking-wider uppercase">
                Official Gateway • Architect: {DEVELOPER_NAME} ({TELEGRAM_USERNAME})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-['Orbitron'] text-xl font-black text-[#00F0FF]">
              PAYMENT TRANSACTION QUEUED!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Aapki payment details DEADLY bhai ke Admin Terminal me dispatch ho chuki hain. Fast
              activation ke liye screenshot Telegram par{' '}
              <span className="text-[#00F0FF] font-bold">{TELEGRAM_USERNAME}</span> par transmit karein.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleOpenTelegram}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#00F0FF] text-black font-['Orbitron'] font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition hover:brightness-110"
              >
                <Send className="w-4 h-4" /> TRANSMIT SCREENSHOT TO @DEADLYPRED9
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-['Orbitron'] text-xs tracking-wider transition"
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Select Plan Duration */}
            <div>
              <label className="text-[11px] font-['Orbitron'] text-[#00F0FF] tracking-wider uppercase block mb-2 font-bold">
                1. Select Cryptographic Access Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedPlan(plan);
                      }}
                      className={`relative p-2.5 rounded-xl text-left border transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#0B253D] to-[#071524] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                          : 'bg-[#060D19] border-slate-800 hover:border-[#00F0FF]/40'
                      }`}
                    >
                      {plan.recommended && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#00FF9D] text-black text-[8px] font-black font-['Orbitron']">
                          PRO
                        </span>
                      )}
                      <div className="text-[11px] font-['Rajdhani'] font-bold text-slate-200 leading-tight">
                        {plan.label}
                      </div>
                      <div className="text-sm font-['Orbitron'] font-black text-[#00F0FF] mt-1">
                        ₹{plan.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Payment Details */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0A1222] to-[#050912] border border-[#00F0FF]/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-['Rajdhani'] font-bold">
                  Tier: <b className="text-[#00F0FF]">{selectedPlan.label}</b>
                </span>
                <span className="font-['Orbitron'] font-black text-[#00FF9D] text-base">
                  Pay ₹{selectedPlan.price}
                </span>
              </div>

              {/* UPI ID Banner */}
              <div className="p-2.5 rounded-xl bg-black/70 border border-[#00F0FF]/30 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] font-['Orbitron'] text-slate-400 uppercase tracking-wider block">
                    Official Central UPI ID
                  </span>
                  <span className="font-['JetBrains_Mono'] font-extrabold text-[#00F0FF] text-sm tracking-wide select-all">
                    {UPI_ID}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1.5 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] text-[11px] font-['Orbitron'] font-bold flex items-center gap-1 border border-[#00F0FF]/40 transition"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUpi ? 'COPIED' : 'COPY'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/10 flex items-center gap-1"
                    title="Toggle QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#00F0FF]" />
                  </button>
                </div>
              </div>

              {/* QR Code Collapsible */}
              {showQr && (
                <div className="p-3 bg-[#050C19] rounded-xl border border-[#00F0FF]/30 flex flex-col items-center justify-center text-center animate-fadeIn">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-36 h-36 rounded-lg border-2 border-[#00F0FF]/50 p-1 bg-black"
                  />
                  <span className="text-[10px] text-slate-300 mt-1 font-['Rajdhani']">
                    Scan with PhonePe, Google Pay, Paytm or any UPI App
                  </span>
                </div>
              )}

              {/* Direct UPI Intent Link & Telegram Direct */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={upiIntentUrl}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#00F0FF] to-[#38BDF8] text-black font-['Orbitron'] font-black text-[11px] tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.35)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" /> PAY VIA UPI APP
                </a>
                <button
                  type="button"
                  onClick={handleOpenTelegram}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:brightness-110 text-white font-['Orbitron'] font-black text-[11px] tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.3)] transition active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" /> SCREENSHOT TO @DEADLYPRED9
                </button>
              </div>
            </div>

            {/* Step 3: Fast UTR verification form */}
            <form onSubmit={handleSubmitUtr} className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-['Orbitron'] text-[#00F0FF] tracking-wider uppercase font-bold">
                  2. Transmit Transaction Hash (Fast Confirmation)
                </label>
                <span className="text-[10px] text-slate-400">Auto-sent to Admin Terminal</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Operative Name (Aapka Naam)"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-[#00F0FF]/30 text-[#E0F2FE] text-xs font-['Rajdhani'] font-bold focus:border-[#00F0FF] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="12-digit UTR / Ref ID"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-['JetBrains_Mono'] focus:border-[#00F0FF] focus:outline-none"
                  />
                </div>
              </div>

              <input
                type="text"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
                placeholder="Telegram Username (Optional, e.g. @YourUsername)"
                className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-[#00F0FF]/30 text-[#E0F2FE] text-xs font-['Rajdhani'] focus:border-[#00F0FF] focus:outline-none"
              />

              {formError && (
                <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-['Rajdhani'] font-bold text-center">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] text-black font-['Orbitron'] font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.35)] transition hover:brightness-110 active:scale-[0.98]"
              >
                SUBMIT UTR TO DEADLY TERMINAL
              </button>
            </form>

            {/* Note & Telegram contact */}
            <div className="p-3 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 flex items-start gap-2.5 text-[11px] text-slate-300 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
              <div>
                Payment screenshot verify hote hi DEADLY bhai aapko direct private Telegram message
                par access key dispatch kar denge. Support handle:{' '}
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00F0FF] font-bold underline inline-flex items-center gap-1"
                >
                  {TELEGRAM_USERNAME} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
