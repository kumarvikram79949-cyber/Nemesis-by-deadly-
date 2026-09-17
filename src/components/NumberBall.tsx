import React from 'react';

interface NumberBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
}

export default function NumberBall({ number, size = 'md', pulse = false }: NumberBallProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
  };

  const isBig = number >= 5;

  // Futuristic Neon Cyber Spheres
  const themeClasses = isBig
    ? 'bg-gradient-to-br from-[#00F0FF] via-[#0284C7] to-[#082F49] text-black border-[#67E8F9] shadow-[0_0_18px_rgba(0,240,255,0.6)]'
    : 'bg-gradient-to-br from-[#00FF9D] via-[#059669] to-[#022C22] text-black border-[#6EE7B7] shadow-[0_0_18px_rgba(0,255,157,0.6)]';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full select-none ${sizeClasses[size]} ${
        pulse ? 'animate-pulse' : ''
      }`}
    >
      {/* Outer Hologram Ring */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center font-black font-['Orbitron'] border-2 shadow-lg transition-transform ${themeClasses}`}
      >
        <span className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          {number}
        </span>
      </div>

      {/* Cyber Reticle Dots */}
      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-60 pointer-events-none" />
    </div>
  );
}
