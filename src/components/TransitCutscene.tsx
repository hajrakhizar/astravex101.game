import React from 'react';
import { CelestialBody } from '../types/game';

interface TransitCutsceneProps {
  destination: CelestialBody;
}

export const TransitCutscene: React.FC<TransitCutsceneProps> = ({ destination }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none animate-fadeIn">
      {/* Animated Starry Background */}
      <div className="relative flex flex-col items-center">
        {/* Cute Rocket */}
        <div className="relative text-6xl animate-bounce mb-4 filter drop-shadow-[0_10px_20px_rgba(251,191,36,0.5)]">
          🚀
        </div>

        {/* Thruster Fire & Sparkles */}
        <div className="flex gap-1 -mt-2">
          <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-rose-500 rounded-full animate-ping" />
          <div className="w-4 h-12 bg-gradient-to-b from-yellow-300 via-amber-500 to-rose-600 rounded-full animate-pulse" />
          <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-rose-500 rounded-full animate-ping" />
        </div>

        <h3 className="text-xl font-bold font-display mt-6 tracking-wide text-white">
          {destination === 'mars' ? 'Entering Martian Orbit... 🔴' : 'Descending toward Lunar Surface... 🌕'}
        </h3>
        <p className="text-xs text-amber-300/80 mt-1 font-mono">
          {destination === 'mars' ? 'Destination: Ares Vallis & Jezero Crater' : 'Destination: Sea of Tranquility & Taurus-Littrow'}
        </p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
