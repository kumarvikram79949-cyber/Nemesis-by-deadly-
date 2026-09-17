import { Sparkles, History, Cpu, User, Shield } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export type TabId = 'prediction' | 'history' | 'algorithm' | 'user-info';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  isAdmin,
  onOpenAdmin,
}: BottomNavProps) {
  const tabs: { id: TabId; label: string; icon: typeof Sparkles }[] = [
    { id: 'prediction', label: 'PREDICT', icon: Sparkles },
    { id: 'history', label: 'HISTORY', icon: History },
    { id: 'algorithm', label: 'ALGORITHM', icon: Cpu },
    { id: 'user-info', label: 'USER INFO', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#060B17]/95 backdrop-blur-xl border-t border-[#00F0FF]/30 shadow-[0_-12px_35px_rgba(0,0,0,0.95)] pb-[env(safe-area-inset-bottom,0px)]">
      {/* Top Cyan Neon Light Bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF]/70 via-[#00FF9D]/70 to-transparent shadow-[0_0_12px_#00F0FF]" />

      <div className="max-w-xl mx-auto px-2 py-2 flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                onTabChange(tab.id);
              }}
              className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-out active:scale-90 select-none relative ${
                isActive
                  ? 'text-[#00F0FF] bg-gradient-to-b from-[#00F0FF]/20 to-transparent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_10px_#00F0FF]" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ease-out ${
                  isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : ''
                }`}
              />
              <span className="text-[9px] font-['Orbitron'] font-extrabold tracking-wider uppercase leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* If Admin, quick access admin button in bottom bar */}
        {isAdmin && onOpenAdmin && (
          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className="flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 text-[#00FF9D] hover:text-white transition-all duration-200 ease-out active:scale-90 select-none"
          >
            <Shield className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="text-[9px] font-['Orbitron'] font-extrabold tracking-wider uppercase leading-none">
              ADMIN
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
