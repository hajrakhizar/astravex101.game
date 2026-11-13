import React, { useEffect, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DialogueBoxProps {
  speaker: string;
  lines: string[];
  currentIndex: number;
  onAdvance: () => void;
  onClose?: () => void;
  onSkipToAction?: () => void;
  skipActionLabel?: string;
  finalContinueLabel?: string;
  embedded?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  lines,
  currentIndex,
  onAdvance,
  onClose,
  onSkipToAction,
  skipActionLabel = 'Skip to Quiz',
  finalContinueLabel = 'CLICK TO CONTINUE',
  embedded = false,
}) => {
  const fullText = lines[currentIndex] ?? '';
  const [displayedLength, setDisplayedLength] = useState(0);
  const isTyping = displayedLength < fullText.length;
  const isLastLine = currentIndex >= lines.length - 1;

  // Typewriter reveal effect with gentle retro RPG chirp
  useEffect(() => {
    setDisplayedLength(0);
    if (!fullText) return;

    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setDisplayedLength(current);
      if (current % 4 === 1 && current < fullText.length) {
        soundManager.playObjectChirp();
      }
      if (current >= fullText.length) {
        window.clearInterval(interval);
      }
    }, 20);

    return () => window.clearInterval(interval);
  }, [fullText, currentIndex]);

  // Fast-forward or advance with Space, Enter, E; close with Escape when shown as in-world overlay
  useEffect(() => {
    if (embedded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.code === 'Space' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        if (displayedLength < fullText.length) {
          setDisplayedLength(fullText.length);
        } else {
          onAdvance();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [embedded, displayedLength, fullText.length, onAdvance, onClose]);

  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTyping) {
      setDisplayedLength(fullText.length);
    } else {
      onAdvance();
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playObjectChirp();
    soundManager.speakRoverVoice(fullText);
  };

  const continueText = isTyping
    ? 'CLICK TO FAST-FORWARD'
    : isLastLine
    ? finalContinueLabel
    : 'CLICK TO CONTINUE';

  return (
    <div
      onClick={handleBoxClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isTyping) {
            setDisplayedLength(fullText.length);
          } else {
            onAdvance();
          }
        }
      }}
      className={`relative w-full ${
        embedded ? '' : 'max-w-[660px]'
      } bg-[#111524]/95 border-2 border-[#25D34A] rounded-[2px] shadow-[0_0_0_2px_rgba(6,10,20,0.92),0_14px_34px_rgba(0,0,0,0.78)] cursor-pointer select-none transition-transform active:scale-[0.995] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]`}
      style={{ fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      {/* Overlapping Top-Left Green Speaker Nameplate */}
      <div className="absolute -top-3.5 left-4 bg-[#25D34A] px-3 py-0.5 shadow-[0_2px_0_rgba(6,10,20,0.85)]">
        <span className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.12em] text-[#051B0A] whitespace-nowrap">
          {speaker}
        </span>
      </div>

      {/* Top-Right Compact Controls (Page indicator, Voice, Close/Skip) */}
      <div
        className="absolute top-2 right-2.5 flex items-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {lines.length > 1 && (
          <span className="text-[10px] font-bold text-[#4ADE80]/70 tabular-nums">
            {currentIndex + 1}/{lines.length}
          </span>
        )}
        <button
          type="button"
          onClick={handleSpeak}
          title="Read Dialogue Aloud"
          className="p-1 text-[#4ADE80]/75 hover:text-[#4ADE80] hover:bg-[#25D34A]/15 rounded-[2px] transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
        {onSkipToAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSkipToAction();
            }}
            className="text-[10px] font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 px-1.5 py-0.5 border border-amber-400/35 hover:border-amber-300/60 bg-amber-500/10 rounded-[2px] transition-colors"
          >
            {skipActionLabel}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close Dialogue (Esc)"
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-[2px] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Centered RPG Dialogue Copy */}
      <div className="px-6 sm:px-10 pt-7 pb-3 min-h-[86px] flex items-center justify-center">
        <p className="text-center text-xs sm:text-[14px] leading-relaxed text-slate-100 font-medium tracking-wide">
          {fullText.slice(0, displayedLength)}
          {isTyping && (
            <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-[#25D34A] animate-pulse" />
          )}
        </p>
      </div>

      {/* Bottom Centered Continuation Prompt */}
      <div className="pb-2.5 px-4 flex items-center justify-center">
        <span
          className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#4ADE80] ${
            isTyping ? 'opacity-65' : 'animate-pulse'
          }`}
        >
          &lt; {continueText} &gt;
        </span>
      </div>
    </div>
  );
};
