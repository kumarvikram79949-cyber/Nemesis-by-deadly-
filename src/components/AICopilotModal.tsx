import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Zap,
  Flame,
  Shield,
  Palette,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CopilotMessage, GameIssue, PredictionData } from '../types';
import { playClickSound, playWinSound } from '../utils/audio';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionData | null;
  historyList: GameIssue[];
  sessionStats: {
    wins: number;
    losses: number;
    jackpots: number;
    streak: number;
  };
}

export default function AICopilotModal({
  isOpen,
  onClose,
  prediction,
  historyList,
  sessionStats,
}: AICopilotModalProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `[EXCITED] Arre bhai! Main hoon Bittu — tera AI Copilot & Color Trading Strategy Advisor! 🎯
Table ka real-time pattern analysis ready hai. Bol bhai, kya janna hai? Niche quick prompt choose kar ya apna sawal poochh!`,
      timestamp: Date.now(),
      emotion: 'EXCITED',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '⚡ Deep Trend Analysis', query: 'Analyze current sequence and explain the active pattern' },
    { label: '🛡️ Stake & Risk Advice', query: 'Should I bet on Level 1 or Level 2 right now?' },
    { label: '🎨 Color & Violet Check', query: 'What is the color distribution and Violet breakpoint probability?' },
    { label: '🐉 Dragon Hazard Status', query: 'Is there a dragon streak and what is its hazard decay rate?' },
  ];

  const handleSendMessage = async (customQuery?: string) => {
    const textToSend = (customQuery || inputText).trim();
    if (!textToSend || isLoading) return;

    playClickSound();

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          history: historyList.slice(0, 15),
          currentPrediction: prediction,
          recentStats: sessionStats,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || '[THINKING] Analysis complete!';

        // Extract emotion tag if present
        let emotion: CopilotMessage['emotion'] = 'EXCITED';
        const match = replyText.match(/^\[([A-Z]+)\]/);
        if (match) {
          emotion = match[1] as CopilotMessage['emotion'];
        }

        const botMsg: CopilotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: Date.now(),
          emotion,
        };

        setMessages((prev) => [...prev, botMsg]);
        if (soundEnabled) {
          playWinSound();
        }
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Local smart fallback
      const fallbackReply = prediction
        ? `[EXCITED] Bhai Table par abhi **${prediction.pattern_detected}** pattern chal raha hai! Next target **${prediction.prediction}** (${prediction.color}) hai. Stake position **${prediction.level}** maintain karo aur Main Ball #${prediction.main_number} target karo!`
        : `[THINKING] Arre bhai! Next round sync ho raha hai. Ek second ruk, abhi fresh signals aate hain!`;

      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: Date.now(),
        emotion: 'EXCITED',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
      <div
        className="relative w-full max-w-lg h-[620px] max-h-[90vh] rounded-3xl bg-gradient-to-b from-[#091322] via-[#050A14] to-[#03060C] border-2 border-[#00F0FF]/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#00F0FF] via-[#00FF9D] to-transparent shadow-[0_0_15px_#00F0FF]" />

        {/* Header */}
        <div className="p-4 border-b border-[#00F0FF]/20 flex items-center justify-between bg-[#060D19]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-[#0284C7] to-[#00FF9D] p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <div className="w-full h-full bg-[#040812] rounded-[14px] flex items-center justify-center text-[#00F0FF] font-['Orbitron'] font-black text-sm">
                AI
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00FF9D] border-2 border-[#040812]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-['Orbitron'] text-sm font-black text-white tracking-wider">
                  BITTU • AI COPILOT
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-[#00FF9D]/20 text-[#00FF9D] text-[9px] font-['Orbitron'] font-bold border border-[#00FF9D]/40">
                  LIVE QUANTUM
                </span>
              </div>
              <span className="text-[10px] font-['Rajdhani'] font-bold text-slate-400">
                Wingo 1M Real-Time Strategy & Pattern Decoder
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
            </button>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Active Target Context Header */}
        {prediction && (
          <div className="px-4 py-2 bg-gradient-to-r from-[#00F0FF]/10 via-[#00FF9D]/10 to-transparent border-b border-[#00F0FF]/15 flex items-center justify-between text-xs font-['Rajdhani']">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-['Orbitron'] text-slate-400">NEXT TARGET:</span>
              <span className="font-['Orbitron'] font-black text-[#00F0FF]">
                {prediction.prediction} ({prediction.color})
              </span>
              <span className="text-[10px] text-slate-400">|</span>
              <span className="text-[10px] font-['Orbitron'] text-slate-400">BALLS:</span>
              <span className="font-['Orbitron'] font-black text-[#00FF9D]">
                #{prediction.main_number} & #{prediction.side_number}
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/10 font-['Orbitron'] text-[9px] text-amber-300 font-bold">
              {prediction.level}
            </span>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-['Rajdhani'] text-sm">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#00F0FF] text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-[#071220] text-slate-200 border border-[#00F0FF]/25 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line break-words">{msg.text}</div>
                  <div
                    className={`text-[9px] mt-1 text-right font-['JetBrains_Mono'] ${
                      isUser ? 'text-black/60' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-['Orbitron'] text-[#00F0FF] animate-pulse">
              <Sparkles className="w-4 h-4 text-[#00FF9D] animate-spin" />
              <span>BITTU IS ANALYZING COLOR TRADING PATTERNS...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 py-2 bg-[#050A14] border-t border-[#00F0FF]/15 flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(qp.query)}
              className="px-2.5 py-1.5 rounded-xl bg-[#081526] hover:bg-[#00F0FF]/20 border border-[#00F0FF]/25 text-[#67E8F9] hover:text-white font-['Rajdhani'] font-bold text-xs whitespace-nowrap transition active:scale-95 disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#060D19] border-t border-[#00F0FF]/20 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Poochh bhai, Bittu se koi bhi sawal..."
            className="flex-1 bg-[#03060E] border border-[#00F0FF]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00F0FF] shadow-inner font-['Rajdhani'] font-semibold"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#00FF9D] text-black flex items-center justify-center transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
