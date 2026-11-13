import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const PRELOAD_ASSETS = [
  '/src/assets/images/astronaut_mascot_1794453536633.jpg',
  '/src/assets/images/moon_surface_art_1794453537645.jpg',
  '/src/assets/images/mars_surface_art_1794453538140.jpg',
  '/src/assets/images/apollo_lander_storybook_1794455201883.jpg',
  '/src/assets/images/mars_rovers_storybook_1794455200903.jpg',
  '/src/assets/images/space_relics_badge_1794453537899.jpg',
];

const LOADING_MESSAGES = [
  'Charting lunar landing sites...',
  'Scanning Martian rover telemetry...',
  'Polishing Cosmic Museum archives...',
  'Ready for launch!',
];

const TOTAL_SEGMENTS = 16;

const PIXEL_STARS = [
  { top: '12%', left: '8%', size: 3, delay: '0s' },
  { top: '18%', left: '88%', size: 2, delay: '0.4s' },
  { top: '24%', left: '22%', size: 2, delay: '0.8s' },
  { top: '14%', left: '64%', size: 3, delay: '0.2s' },
  { top: '76%', left: '14%', size: 2, delay: '0.6s' },
  { top: '82%', left: '84%', size: 3, delay: '0.3s' },
  { top: '70%', left: '72%', size: 2, delay: '0.9s' },
  { top: '86%', left: '34%', size: 2, delay: '0.5s' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [filledSegments, setFilledSegments] = useState(0);
  const [dotCount, setDotCount] = useState(3);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    PRELOAD_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stepMs = prefersReducedMotion ? 50 : 125;

    const progressTimer = window.setInterval(() => {
      setFilledSegments((prev) => {
        if (prev >= TOTAL_SEGMENTS) {
          window.clearInterval(progressTimer);
          return TOTAL_SEGMENTS;
        }
        return prev + 1;
      });
    }, stepMs);

    const dotTimer = window.setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 360);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(dotTimer);
    };
  }, []);

  useEffect(() => {
    if (filledSegments < TOTAL_SEGMENTS) return;

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, 240);

    const doneTimer = window.setTimeout(() => {
      onCompleteRef.current();
    }, 540);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [filledSegments]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        setIsFadingOut(true);
        window.setTimeout(() => onCompleteRef.current(), 180);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    window.setTimeout(() => onCompleteRef.current(), 180);
  };

  const progressPercent = Math.round((filledSegments / TOTAL_SEGMENTS) * 100);
  const messageIndex =
    filledSegments >= TOTAL_SEGMENTS
      ? 3
      : Math.min(2, Math.floor((filledSegments / TOTAL_SEGMENTS) * 3));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading AstroQuest: Moon & Mars"
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#060918] text-white select-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle 8-bit pixel starfield */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PIXEL_STARS.map((star, idx) => (
          <div
            key={idx}
            className="absolute bg-slate-300/60 animate-twinkle motion-reduce:animate-none"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Center Retro NASA-Blue Title Strip & Terminal Loading */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-8 flex flex-col items-center">
        {/* Iconic NASA-Blue Rectangular Banner */}
        <div className="w-full bg-[#0038A8] border-y-2 border-t-[#2563EB] border-b-[#001F66] shadow-[0_14px_40px_rgba(0,56,168,0.35)] px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-3 sm:gap-7">
          {/* Pixel-Art Moon, Mars & Rocket Emblem */}
          <div className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-[#00287A] border border-[#3B82F6]/40 p-1">
            <svg
              viewBox="0 0 16 16"
              className="w-full h-full"
              shapeRendering="crispEdges"
              aria-hidden="true"
            >
              {/* Tiny Pixel Moon (top-left) */}
              <rect x="1" y="2" width="3" height="3" fill="#CBD5E1" />
              <rect x="2" y="1" width="1" height="1" fill="#E2E8F0" />
              <rect x="2" y="3" width="1" height="1" fill="#94A3B8" />

              {/* Tiny Pixel Mars (bottom-right) */}
              <rect x="11" y="10" width="4" height="4" fill="#DC2626" />
              <rect x="12" y="9" width="2" height="1" fill="#EF4444" />
              <rect x="12" y="10" width="1" height="1" fill="#FB923C" />
              <rect x="13" y="12" width="1" height="1" fill="#991B1B" />

              {/* Pixel Stars */}
              <rect x="13" y="2" width="1" height="1" fill="#FEF08A" />
              <rect x="2" y="11" width="1" height="1" fill="#FEF08A" />

              {/* Pixel Rocket Nose */}
              <rect x="7" y="1" width="2" height="1" fill="#EF4444" />
              <rect x="6" y="2" width="4" height="1" fill="#EF4444" />

              {/* Rocket Body */}
              <rect x="6" y="3" width="4" height="6" fill="#FFFFFF" />
              <rect x="9" y="3" width="1" height="6" fill="#CBD5E1" />

              {/* Rocket Porthole Window */}
              <rect x="7" y="4" width="2" height="2" fill="#38BDF8" />

              {/* Rocket Side Fins */}
              <rect x="5" y="7" width="1" height="3" fill="#EF4444" />
              <rect x="10" y="7" width="1" height="3" fill="#EF4444" />

              {/* Engine Nozzle */}
              <rect x="7" y="9" width="2" height="1" fill="#64748B" />

              {/* Thruster Flame */}
              <rect x="7" y="10" width="2" height="2" fill="#FBBF24" />
              <rect x="7" y="12" width="1" height="2" fill="#F97316" />
              <rect x="8" y="12" width="1" height="1" fill="#F97316" />
            </svg>
          </div>

          {/* Crisp Pixel Title */}
          <h1
            className="font-pixel font-bold text-white tracking-wider leading-none text-center whitespace-nowrap"
            style={{ fontSize: 'clamp(1.1rem, 3.8vw, 3.1rem)' }}
          >
            AstroQuest: Moon &amp; Mars
          </h1>
        </div>

        {/* Classic Terminal Green Loading... */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
          <div className="font-pixel font-bold text-[#00FF1A] tracking-widest text-2xl sm:text-4xl min-w-[11ch] text-center">
            Loading{'.'.repeat(dotCount)}
            <span className="opacity-0">{'.'.repeat(3 - dotCount)}</span>
          </div>

          {/* Segmented Retro Pixel Progress Bar */}
          <div className="flex flex-col items-center gap-2 mt-1">
            <div
              className="flex items-center gap-1 p-1.5 bg-[#0A1128] border-2 border-[#1E3A8A]/70"
              aria-hidden="true"
            >
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, index) => {
                const isActive = index < filledSegments;
                return (
                  <div
                    key={index}
                    className={`w-2.5 h-3.5 sm:w-3 sm:h-4 transition-colors duration-100 ${
                      isActive ? 'bg-[#00FF1A]' : 'bg-[#131E42]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 tabular-nums">
              <span>{LOADING_MESSAGES[messageIndex]}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#00FF1A] font-bold">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Skip Control */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-5 right-5 min-h-[40px] px-4 py-2 text-xs font-mono text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 bg-[#0A1128]/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF1A]"
      >
        Skip
      </button>
    </div>
  );
};
