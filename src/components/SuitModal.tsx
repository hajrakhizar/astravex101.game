import React from 'react';
import { SuitColor } from '../types/game';
import { X, Sparkles, Check } from 'lucide-react';

interface SuitModalProps {
  currentSuit: SuitColor;
  onSelectSuit: (color: SuitColor) => void;
  onClose: () => void;
}

const SUITS: { id: SuitColor; label: string; desc: string; previewBg: string; border: string }[] = [
  { id: 'classic', label: 'Classic Apollo', desc: 'Crisp white spacesuit with golden lunar visor', previewBg: 'bg-slate-100', border: 'border-slate-300' },
  { id: 'rose', label: 'Bubblegum Rose', desc: 'Pastel blossom pink with starlight yellow visor', previewBg: 'bg-pink-100', border: 'border-pink-300' },
  { id: 'cyan', label: 'Starlight Cyan', desc: 'Subtle neon cyan with solar amber visor', previewBg: 'bg-cyan-100', border: 'border-cyan-300' },
  { id: 'gold', label: 'Solar Flare Gold', desc: 'Warm celestial gold with azure visor', previewBg: 'bg-amber-100', border: 'border-amber-300' },
  { id: 'mint', label: 'Emerald Mint', desc: 'Cozy pastel mint with stardust visor', previewBg: 'bg-emerald-100', border: 'border-emerald-300' },
  { id: 'violet', label: 'Nebula Lilac', desc: 'Cosmic soft lavender with golden visor', previewBg: 'bg-purple-100', border: 'border-purple-300' },
];

export const SuitModal: React.FC<SuitModalProps> = ({ currentSuit, onSelectSuit, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">Astronaut Wardrobe</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Choose your favorite spacesuit style for roaming the Moon & Mars!
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {SUITS.map((suit) => {
            const isSelected = currentSuit === suit.id;
            return (
              <button
                key={suit.id}
                onClick={() => {
                  onSelectSuit(suit.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-slate-800/90 shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/50 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-full ${suit.previewBg} ${suit.border} border-2 flex items-center justify-center text-sm shadow-inner`}>
                    👩‍🚀
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{suit.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{suit.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
