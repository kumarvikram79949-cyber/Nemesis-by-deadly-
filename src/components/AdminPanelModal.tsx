import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Copy,
  Check,
  Trash2,
  Send,
  UserCheck,
  Shield,
  Coins,
  CheckCircle2,
  XCircle,
  Terminal,
} from 'lucide-react';
import { LicenseKey, PaymentRequest } from '../types';
import {
  addLicenseKey,
  deleteLicenseKey,
  deletePaymentRequest,
  DEVELOPER_NAME,
  getPaymentRequests,
  getStoredKeys,
  PLANS,
  revokeLicenseKey,
  savePaymentRequests,
  TELEGRAM_LINK,
  TELEGRAM_USERNAME,
} from '../utils/storage';
import { playClickSound } from '../utils/audio';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysChanged?: () => void;
}

export default function AdminPanelModal({
  isOpen,
  onClose,
  onKeysChanged,
}: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'keys' | 'requests'>('generate');
  const [keysList, setKeysList] = useState<LicenseKey[]>(getStoredKeys());
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(getPaymentRequests());

  // Generator State
  const [selectedDuration, setSelectedDuration] = useState<{
    label: string;
    ms: number | null;
  }>({
    label: '7 Days VIP',
    ms: 7 * 24 * 60 * 60 * 1000,
  });
  const [assignedUserName, setAssignedUserName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<LicenseKey | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const refreshData = () => {
    setKeysList(getStoredKeys());
    setPaymentRequests(getPaymentRequests());
    if (onKeysChanged) onKeysChanged();
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const created = addLicenseKey(
      selectedDuration.label,
      selectedDuration.ms,
      assignedUserName.trim() || undefined
    );
    setNewlyCreatedKey(created);
    setAssignedUserName('');
    refreshData();
  };

  const handleCopy = (text: string) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRevoke = (key: string) => {
    playClickSound();
    revokeLicenseKey(key);
    refreshData();
  };

  const handleDelete = (key: string) => {
    playClickSound();
    deleteLicenseKey(key);
    refreshData();
  };

  const handleDeleteRequest = (reqId: string) => {
    playClickSound();
    deletePaymentRequest(reqId);
    refreshData();
  };

  // Accept Payment Request and auto-generate Key
  const handleApproveRequest = (req: PaymentRequest) => {
    playClickSound();
    const matchedPlan = PLANS.find((p) => p.durationLabel === req.durationLabel) || PLANS[4];
    const generated = addLicenseKey(matchedPlan.durationLabel, matchedPlan.durationMs, req.userName);

    const all = getPaymentRequests();
    const target = all.find((r) => r.id === req.id);
    if (target) {
      target.status = 'approved';
      target.generatedKey = generated.key;
      savePaymentRequests(all);
    }
    refreshData();

    // Prepare Telegram message
    const telegramReply = encodeURIComponent(
      `Hello ${req.userName}! Aapka payment (₹${req.amount}) verify ho gaya hai.\n\n` +
      `⚡ NEMESIS BY DEADLY QUANTUM ACCESS KEY:\n` +
      `${generated.key}\n\n` +
      `Duration: ${generated.durationLabel}\n` +
      `Terminal URL: ${window.location.origin}\n\n` +
      `High-performance AI engine active. Contact: ${TELEGRAM_USERNAME}`
    );

    window.open(`${TELEGRAM_LINK}?text=${telegramReply}`, '_blank');
  };

  const handleRejectRequest = (reqId: string) => {
    playClickSound();
    const all = getPaymentRequests();
    const target = all.find((r) => r.id === reqId);
    if (target) {
      target.status = 'rejected';
      savePaymentRequests(all);
    }
    refreshData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0D1526] via-[#080E1A] to-[#03060E] border-2 border-[#00F0FF]/50 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(0,240,255,0.25)] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top cyan neon line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_15px_#00F0FF]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#00F0FF]/25 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#0284C7] p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.5)]">
              <div className="w-full h-full bg-[#050B16] rounded-[14px] flex items-center justify-center text-[#00F0FF]">
                <Terminal className="w-6 h-6 text-[#00F0FF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Orbitron'] text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#67E8F9] to-[#00F0FF]">
                  NEMESIS COMMAND CENTER
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[9px] font-['Orbitron'] font-bold">
                  MASTER TERMINAL
                </span>
              </div>
              <p className="text-[11px] font-['Rajdhani'] font-bold text-slate-300">
                Architect: <span className="text-[#00F0FF] font-['Orbitron']">{DEVELOPER_NAME}</span> | Telegram:{' '}
                <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="underline hover:text-[#00FF9D]">
                  {TELEGRAM_USERNAME}
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-[#050A14] border border-[#00F0FF]/25 mb-5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('generate');
            }}
            className={`flex-1 py-2.5 rounded-xl font-['Orbitron'] text-xs font-black tracking-wider flex items-center justify-center gap-2 transition ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#00FF9D] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" /> GENERATE KEY
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('requests');
            }}
            className={`flex-1 py-2.5 rounded-xl font-['Orbitron'] text-xs font-black tracking-wider flex items-center justify-center gap-2 relative transition ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#00FF9D] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" /> PAYMENT QUEUE
            {paymentRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {paymentRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('keys');
            }}
            className={`flex-1 py-2.5 rounded-xl font-['Orbitron'] text-xs font-black tracking-wider flex items-center justify-center gap-2 transition ${
              activeTab === 'keys'
                ? 'bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#00FF9D] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> ACTIVE KEYS ({keysList.length})
          </button>
        </div>

        {/* TAB 1: GENERATE KEY */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div>
                <label className="text-xs font-['Orbitron'] text-[#00F0FF] uppercase tracking-wider block mb-2 font-bold">
                  Select Authorization Validity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '1 Hour', ms: 60 * 60 * 1000 },
                    { label: '1 Day', ms: 24 * 60 * 60 * 1000 },
                    { label: '2 Days', ms: 2 * 24 * 60 * 60 * 1000 },
                    { label: '3 Days', ms: 3 * 24 * 60 * 60 * 1000 },
                    { label: '7 Days VIP', ms: 7 * 24 * 60 * 60 * 1000 },
                    { label: '10 Days Pro', ms: 10 * 24 * 60 * 60 * 1000 },
                    { label: '1 Month Master', ms: 30 * 24 * 60 * 60 * 1000 },
                    { label: 'Unlimited / Lifetime', ms: null },
                  ].map((dur) => (
                    <button
                      key={dur.label}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedDuration(dur);
                      }}
                      className={`p-2.5 rounded-xl text-center border font-['Rajdhani'] font-bold text-xs transition ${
                        selectedDuration.label === dur.label
                          ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'bg-[#060D19] border-slate-800 text-slate-300 hover:border-[#00F0FF]/40'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-['Orbitron'] text-[#00F0FF] uppercase tracking-wider block mb-1.5 font-bold">
                  Target Operative Name (Optional)
                </label>
                <input
                  type="text"
                  value={assignedUserName}
                  onChange={(e) => setAssignedUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma / @UserTelegram"
                  className="w-full px-3.5 py-3 rounded-xl bg-black/80 border border-[#00F0FF]/30 text-[#E0F2FE] text-sm font-['Rajdhani'] font-bold focus:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] text-black font-['Orbitron'] font-black text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(0,240,255,0.4)] transition hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" /> ISSUE NEW CRYPTOGRAPHIC KEY
              </button>
            </form>

            {/* Newly Created Key Display */}
            {newlyCreatedKey && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0A1629] to-[#050C19] border border-[#00F0FF]/50 space-y-3 shadow-[0_0_25px_rgba(0,240,255,0.25)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-['Orbitron'] text-[#00FF9D] font-bold tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> KEY GENERATED & ARCHIVED
                  </span>
                  <span className="text-xs font-['Rajdhani'] font-bold text-[#00F0FF]">
                    {newlyCreatedKey.durationLabel}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/80 border border-[#00F0FF]/40 flex items-center justify-between gap-2">
                  <span className="font-['JetBrains_Mono'] font-extrabold text-[#00F0FF] text-sm sm:text-base tracking-widest select-all">
                    {newlyCreatedKey.key}
                  </span>
                  <button
                    onClick={() => handleCopy(newlyCreatedKey.key)}
                    className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] text-xs font-['Orbitron'] font-bold flex items-center gap-1 border border-[#00F0FF]/50 transition"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey ? 'COPIED' : 'COPY'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`${TELEGRAM_LINK}?text=${encodeURIComponent(
                      `Hello! Here is your NEMESIS BY DEADLY VIP Key:\n\nKey: ${newlyCreatedKey.key}\nDuration: ${newlyCreatedKey.durationLabel}\n\nLogin: ${window.location.origin}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-['Orbitron'] text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" /> TRANSMIT VIA TELEGRAM
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAYMENT QUEUE */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {paymentRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-['Rajdhani']">
                Koi payment request nahi aayi abhi tak / No pending payment transmissions.
              </div>
            ) : (
              paymentRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    req.status === 'pending'
                      ? 'bg-[#0B1527] border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : req.status === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-red-950/20 border-red-500/30 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Rajdhani'] font-black text-base text-[#E0F2FE]">
                          {req.userName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-['Orbitron'] font-bold uppercase ${
                            req.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : req.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs font-['Rajdhani'] text-slate-300">
                        Plan: <b className="text-[#00F0FF]">{req.planName}</b> • Amount:{' '}
                        <b className="text-[#00FF9D]">₹{req.amount}</b>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-['JetBrains_Mono'] text-slate-400 flex flex-col items-end gap-1">
                      <div>UTR: <b className="text-[#00F0FF]">{req.utr}</b></div>
                      {req.telegramHandle && (
                        <div>TG: <b className="text-[#38BDF8]">{req.telegramHandle}</b></div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(req.id)}
                        className="px-1.5 py-0.5 rounded bg-red-500/10 hover:bg-red-500/25 text-red-400 flex items-center gap-1 text-[9px] font-['Orbitron'] mt-0.5 border border-red-500/20"
                        title="Delete Request"
                      >
                        <Trash2 className="w-3 h-3" /> DEL
                      </button>
                    </div>
                  </div>

                  {req.generatedKey && (
                    <div className="mt-2 p-2 rounded-xl bg-black/60 border border-[#00F0FF]/30 flex items-center justify-between">
                      <span className="text-xs font-['JetBrains_Mono'] text-[#00F0FF]">
                        Key: {req.generatedKey}
                      </span>
                      <button
                        onClick={() => handleCopy(req.generatedKey!)}
                        className="px-2 py-1 bg-[#00F0FF]/20 text-[#00F0FF] text-[10px] rounded"
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  {req.status === 'pending' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-['Orbitron'] text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                      >
                        <CheckCircle2 className="w-4 h-4" /> VERIFY & DISPATCH KEY
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-['Orbitron'] text-xs font-bold border border-red-500/40 transition"
                      >
                        <XCircle className="w-4 h-4" /> REJECT
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: ALL KEYS */}
        {activeTab === 'keys' && (
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {keysList.map((k) => (
              <div
                key={k.key}
                className="p-3 rounded-xl bg-[#060D19] border border-[#00F0FF]/20 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-['JetBrains_Mono'] font-extrabold text-[#E0F2FE] truncate">
                      {k.key}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[8px] font-['Orbitron'] uppercase ${
                        k.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {k.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-['Rajdhani'] flex items-center gap-2 mt-0.5">
                    <span>{k.durationLabel}</span>
                    {k.assignedTo && <span>• Operative: {k.assignedTo}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(k.key)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00F0FF]"
                    title="Copy Key"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {k.key !== 'DEADLY IS KIND' && k.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(k.key)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
                      title="Revoke Key"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {k.key !== 'DEADLY IS KIND' && (
                    <button
                      onClick={() => handleDelete(k.key)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Delete Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
