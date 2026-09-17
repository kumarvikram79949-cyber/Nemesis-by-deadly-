// Web Audio API Synthesizer for NEMESIS BY DEADLY
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

try {
  const saved = localStorage.getItem('nemesis_sound');
  soundEnabled = saved !== 'off';
} catch {
  soundEnabled = true;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  try {
    localStorage.setItem('nemesis_sound', enabled ? 'on' : 'off');
  } catch {
    // Ignore storage errors
  }
}

export function ensureAudio(): void {
  if (!audioCtx) {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    } catch {
      // Audio not supported
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
}

export function tone(freq: number, startOffset: number, duration: number, type: OscillatorType = 'sine', volume = 0.1): void {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime + startOffset;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.06);
  } catch {
    // ignore
  }
}

export function playClickSound(): void {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t0);
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.linearRampToValueAtTime(0.08, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.06);
  } catch {
    // ignore
  }
}

export function playWinSound(): void {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = t0 + idx * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch {
    // ignore
  }
}

export function playLossSound(): void {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime;
    const notes = [220, 180, 140];
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = t0 + idx * 0.12;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch {
    // ignore
  }
}

export function playJackpotSound(): void {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = t0 + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {
    // ignore
  }
}

export function triggerVibration(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore
  }
}
