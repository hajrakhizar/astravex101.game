import React from 'react';
import { X, Sparkles, Rocket, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  onStart: () => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot Avatar */}
        <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-950">
          <img
            src="/src/assets/images/astronaut_mascot_1794453536633.jpg"
            alt="Cute Astronaut Mascot"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
            Welcome, Space Archaeologist!
          </span>
          <h2 className="text-2xl font-bold text-white font-display mt-1">
            AstroQuest: Relics of the Moon & Mars
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
            Step onto the lunar regolith and the red dunes of Mars to discover historic objects left behind by humanity’s greatest space explorers!
          </p>
        </div>

        {/* Missions Checklist preview */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-left text-xs space-y-2">
          <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
            <span>7 Historic Relics to Discover:</span>
            <span className="text-amber-400 font-mono">1969 → 2021</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span>🌕</span>
              <span>Apollo 11 (1969)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🌕</span>
              <span>Apollo 15 (1971)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🌕</span>
              <span>Apollo 17 (1972)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔴</span>
              <span>Pathfinder (1997)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔴</span>
              <span>Spirit & Opportunity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔴</span>
              <span>Curiosity (2012)</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <span>🔴</span>
              <span>Perseverance & Ingenuity (2021)</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              onStart();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Rocket className="w-4 h-4" />
            <span>Begin Cosmic Expedition!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
