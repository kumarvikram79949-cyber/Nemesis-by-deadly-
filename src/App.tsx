import { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { GameIssue, HistoryRecord, PredictionData, UserSession } from './types';
import { clearSession, getStoredSession } from './utils/storage';
import {
  computeNextPeriod,
  fetchLiveWinGoResults,
  generateAIPrediction,
} from './utils/algorithms';
import BackgroundParticles from './components/BackgroundParticles';
import Navbar from './components/Navbar';
import BottomNav, { TabId } from './components/BottomNav';
import LoginGate from './components/LoginGate';
import BuyKeyModal from './components/BuyKeyModal';
import AdminPanelModal from './components/AdminPanelModal';
import PredictionDashboard from './components/PredictionDashboard';
import HistoryDashboard from './components/HistoryDashboard';
import AlgorithmDashboard from './components/AlgorithmDashboard';
import UserInfoDashboard from './components/UserInfoDashboard';
import ResultModal from './components/ResultModal';
import AICopilotModal from './components/AICopilotModal';
import { playClickSound } from './utils/audio';

export default function App() {
  // Session State
  const [session, setSession] = useState<UserSession | null>(() => getStoredSession());
  const [activeTab, setActiveTab] = useState<TabId>('prediction');

  // Modals State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCopilotModal, setShowCopilotModal] = useState(false);
  const [latestResultModal, setLatestResultModal] = useState<HistoryRecord | null>(null);

  // Game Engine State - 100% Focused on Win-Go 1-Minute Master Mode
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [historyList, setHistoryList] = useState<GameIssue[]>([]);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nemesis_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeEngine, setActiveEngine] = useState('WinGo Neural Matrix V10.2');

  // Seconds countdown for 60s cycle
  const [secondsLeft, setSecondsLeft] = useState<number>(60);

  // Session Win/Loss/Jackpot Stats
  const sessionStats = {
    wins: historyRecords.filter((r) => r.status === 'WIN').length,
    losses: historyRecords.filter((r) => r.status === 'LOSS').length,
    jackpots: historyRecords.filter((r) => r.status === 'DIRECT HIT').length,
    streak: (() => {
      let s = 0;
      for (const r of historyRecords) {
        if (r.status === 'WIN' || r.status === 'DIRECT HIT') s++;
        else break;
      }
      return s;
    })(),
  };

  const lastProcessedRef = useRef<string>('');
  const activePredRef = useRef<PredictionData | null>(null);

  // Sync activePredRef
  useEffect(() => {
    activePredRef.current = prediction;
  }, [prediction]);

  // Main Engine Logic: Fetch from API and compare results
  const runEngineLogic = useCallback(async () => {
    const list = await fetchLiveWinGoResults('1m');
    if (!list || list.length === 0) return;

    setHistoryList(list);
    const latest = list[0];
    const latestIssue = latest.issueNumber;

    // Check if new period has rolled over
    if (lastProcessedRef.current !== '' && lastProcessedRef.current !== latestIssue) {
      const activePred = activePredRef.current;
      if (activePred && activePred.period === latestIssue) {
        const actualNumber = latest.number;
        const actualSize = latest.size;
        let status: 'WIN' | 'LOSS' | 'DIRECT HIT' = 'LOSS';

        if (actualNumber === activePred.predictedNumber) {
          status = 'DIRECT HIT';
        } else if (actualSize === activePred.predictedSize) {
          status = 'WIN';
        } else {
          status = 'LOSS';
        }

        const newRecord: HistoryRecord = {
          period: latestIssue,
          predictedSize: activePred.predictedSize,
          predictedNumber: activePred.predictedNumber,
          actualNumber,
          actualSize,
          actualColor: latest.color,
          status,
          level: activePred.level,
          patternDetected: activePred.pattern_detected,
          colorPattern: activePred.colorPattern,
          timestamp: Date.now(),
        };

        setHistoryRecords((prev) => {
          const updated = [newRecord, ...prev];
          try {
            localStorage.setItem('nemesis_history', JSON.stringify(updated.slice(0, 100)));
          } catch {
            // ignore
          }
          return updated;
        });

        // Show celebration popup
        setLatestResultModal(newRecord);
      }
    }

    lastProcessedRef.current = latestIssue;

    // Compute Next Period & AI Prediction using Quantitative Ensemble & 2-Level Risk
    const nextPeriod = computeNextPeriod(latestIssue);
    setCurrentPeriod(nextPeriod);

    if (!activePredRef.current || activePredRef.current.period !== nextPeriod) {
      const newPred = generateAIPrediction(
        nextPeriod,
        list,
        activeEngine,
        historyRecords[0]
      );
      setPrediction(newPred);
      activePredRef.current = newPred;
    }
  }, [activeEngine, historyRecords]);

  // Timer Tick (1s interval for 60s WinGo 1M cycle)
  useEffect(() => {
    const maxSec = 60;
    const now = Math.floor(Date.now() / 1000);
    const rem = maxSec - (now % maxSec);
    setSecondsLeft(rem);

    const timer = setInterval(() => {
      const currentNow = Math.floor(Date.now() / 1000);
      const remaining = maxSec - (currentNow % maxSec);
      setSecondsLeft(remaining);

      // On boundary rollover, trigger instant engine logic
      if (remaining === maxSec || remaining === 1) {
        runEngineLogic();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [runEngineLogic]);

  // Periodic API Polling (every 2 seconds)
  useEffect(() => {
    runEngineLogic();
    const poller = setInterval(() => {
      runEngineLogic();
    }, 2000);

    return () => clearInterval(poller);
  }, [runEngineLogic]);

  // Clear History Callback
  const handleClearHistory = () => {
    setHistoryRecords([]);
    try {
      localStorage.removeItem('nemesis_history');
    } catch {
      // ignore
    }
  };

  // Delete Single Record Callback
  const handleDeleteRecord = (timestamp: number) => {
    setHistoryRecords((prev) => {
      const updated = prev.filter((r) => r.timestamp !== timestamp);
      try {
        localStorage.setItem('nemesis_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Logout
  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  // If user is not authenticated -> show Login Gate
  if (!session) {
    return (
      <main className="min-h-screen w-full bg-[#040711] text-[#E0F2FE] relative overflow-x-hidden font-['Sora']">
        <BackgroundParticles />
        <LoginGate
          onLoginSuccess={(newSession) => setSession(newSession)}
          onOpenBuyModal={() => setShowBuyModal(true)}
        />
        <BuyKeyModal
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#040711] text-[#E0F2FE] flex flex-col justify-between relative overflow-x-hidden font-['Sora']">
      <BackgroundParticles />

      {/* Top Navbar */}
      <Navbar
        session={session}
        onLogout={handleLogout}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenBuyModal={() => setShowBuyModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3.5 pt-3 pb-32 relative z-10">
        <div key={activeTab} className="animate-butter-fade">
          {activeTab === 'prediction' && (
            <PredictionDashboard
              currentPeriod={currentPeriod}
              prediction={prediction}
              historyList={historyList}
              sessionStats={sessionStats}
              secondsLeft={secondsLeft}
              onForceRefresh={runEngineLogic}
              lastRecord={historyRecords[0]}
              onOpenCopilot={() => setShowCopilotModal(true)}
            />
          )}

          {activeTab === 'history' && (
            <HistoryDashboard
              records={historyRecords}
              onClearHistory={handleClearHistory}
              onDeleteRecord={handleDeleteRecord}
            />
          )}

          {activeTab === 'algorithm' && (
            <AlgorithmDashboard
              historyList={historyList}
              activeEngine={activeEngine}
              onSelectEngine={(engineName) => setActiveEngine(engineName)}
            />
          )}

          {activeTab === 'user-info' && (
            <UserInfoDashboard
              session={session}
              onLogout={handleLogout}
              onOpenBuyModal={() => setShowBuyModal(true)}
            />
          )}
        </div>
      </main>

      {/* Floating AI Copilot Trigger Button (Locked neatly above Bottom Tabs) */}
      <button
        onClick={() => {
          playClickSound();
          setShowCopilotModal(true);
        }}
        className="fixed bottom-[74px] right-3.5 sm:right-6 z-40 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#00FF9D] text-black font-['Orbitron'] text-xs font-black tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition"
      >
        <Bot className="w-4 h-4 text-black" />
        <span>AI COPILOT</span>
        <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        isAdmin={session.role === 'admin'}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Interactive AI Copilot Modal */}
      <AICopilotModal
        isOpen={showCopilotModal}
        onClose={() => setShowCopilotModal(false)}
        prediction={prediction}
        historyList={historyList}
        sessionStats={sessionStats}
      />

      {/* Buy Key Modal */}
      <BuyKeyModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />

      {/* Cinematic Result Celebration Modal */}
      <ResultModal
        result={latestResultModal}
        onClose={() => setLatestResultModal(null)}
      />
    </div>
  );
}
