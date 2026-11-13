import React from 'react';
import { CelestialBody } from '../types/game';
import { Volume2, VolumeX, Music, Trophy, Sparkles, Globe, Rocket } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopNavProps {
  currentBody: CelestialBody;
  discoveredCount: number;
  totalCount: number;
  collectedStars: number;
  onSwitchPlanet: (body: CelestialBody) => void;
  onOpenMuseum: () => void;
  onOpenIntro: () => void;
  onOpenSuitModal: () => void;
  onOpenEmbedModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentBody,
  discoveredCount,
  totalCount,
  collectedStars,
  onSwitchPlanet,
  onOpenMuseum,
  onOpenIntro,
  onOpenSuitModal,
  onOpenEmbedModal,
  isMuted,
  onToggleMute,
  isMusicPlaying,
  onToggleMusic,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-30 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onOpenMuseum();
          }}
          className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          <span>AstroQuest: Moon & Mars</span>
        </a>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => onSwitchPlanet('moon')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentBody === 'moon' ? 'text-amber-400 font-bold' : ''
          }`}
        >
          <span>The Moon (1969–1972)</span>
        </button>

        <button
          onClick={() => onSwitchPlanet('mars')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentBody === 'mars' ? 'text-amber-400 font-bold' : ''
          }`}
        >
          <span>Mars Rovers (1997–2021)</span>
        </button>

        <button
          onClick={onOpenMuseum}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Museum ({discoveredCount}/{totalCount})</span>
        </button>

        <button
          onClick={onOpenSuitModal}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Suit Colors</span>
        </button>

        <button
          onClick={onOpenIntro}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
        >
          <span>📖 Story Intro</span>
        </button>

        <button
          onClick={onOpenEmbedModal}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-400 hover:text-amber-300"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Link to Website</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action + compact audio triggers */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Star counter */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
          <span>⭐</span>
          <span>{collectedStars}</span>
        </div>

        {/* Audio FX & Music toggles */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Mute Space Chimes' : 'Play Space Ambient Chimes'}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'text-amber-400 animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Primary Planet Transit Button */}
        <button
          onClick={() => onSwitchPlanet(currentBody === 'moon' ? 'mars' : 'moon')}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap shrink-0 transform active:scale-95"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{currentBody === 'moon' ? 'Travel to Mars 🔴' : 'Return to Moon 🌕'}</span>
        </button>
      </div>
    </header>
  );
};
