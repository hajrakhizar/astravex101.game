import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Rocket, ArrowRight, ArrowLeft, Volume2, Sparkles, X } from 'lucide-react';

interface IntroModalProps {
  onComplete: () => void;
  onClose?: () => void;
}

const INTRO_SLIDES = [
  {
    chapter: 'Prologue · Chapter 1',
    title: 'Footprints Across the Stars',
    subtitle: 'Humanity reaches beyond Earth into the great cosmic ocean.',
    body: 'In July 1969, three brave astronauts flew across the black vacuum of space to touch down on the silver dust of the Moon. Neil Armstrong and Buzz Aldrin walked across the Sea of Tranquility, leaving behind the descent stage of Lunar Module Eagle, an American flag, and footprints that will last for millions of years.',
    image: '/src/assets/images/apollo_lander_storybook_1794455201883.jpg',
    tag: 'Apollo Lunar Expeditions (1969–1972)',
    soundSnippet: 'We came in peace for all mankind.',
  },
  {
    chapter: 'Prologue · Chapter 2',
    title: 'Robotic Pioneers on Mars',
    subtitle: 'Bouncing airbags, rolling wheels, and flying rotors.',
    body: 'In 1997, Mars Pathfinder bounced across Ares Vallis inside giant airbags, releasing tiny Sojourner—the first wheeled rover on Mars. Years later, twin rovers Spirit and Opportunity proved ancient water once flowed. Then came Curiosity with its laser lab, and Perseverance with Ingenuity—the very first solar helicopter to fly on another planet!',
    image: '/src/assets/images/mars_rovers_storybook_1794455200903.jpg',
    tag: 'Mars Exploration Fleet (1997–2021)',
    soundSnippet: 'Exploring the Red Planet sol after sol.',
  },
  {
    chapter: 'Prologue · Chapter 3',
    title: 'Your Mission, Little Astronaut!',
    subtitle: 'Seek out the 7 time capsules and hear their stories.',
    body: 'Today, the Moon and Mars hold seven historic relics waiting for you. Walk your astronaut across the surface, click on the relics to speak directly with them, and answer their mini-quizzes to catalog them into the Cosmic Field Museum. Let us preserve humanity\'s greatest journeys!',
    image: '/src/assets/images/astronaut_mascot_1794453536633.jpg',
    tag: 'Cosmic Field Museum Mission',
    soundSnippet: 'Touch the surface. Listen to history.',
  },
];

export const IntroModal: React.FC<IntroModalProps> = ({ onComplete, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = INTRO_SLIDES[currentSlide];
  const isLast = currentSlide === INTRO_SLIDES.length - 1;

  const handleNext = () => {
    soundManager.playObjectClick();
    if (isLast) {
      soundManager.playFanfare();
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playObjectClick();
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleSpeakSlide = () => {
    soundManager.playObjectChirp();
    soundManager.speakRoverVoice(`${slide.title}. ${slide.body}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Scrim */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter saturate-[1.1] transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Skip / Close Button */}
          {onClose && (
            <button
              onClick={() => {
                soundManager.stopSpeaking();
                onClose();
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 border border-white/20 flex items-center justify-center transition-colors z-10"
              title="Skip Intro"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Chapter pill & Voice button */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30">
              {slide.chapter}
            </span>
            <button
              onClick={handleSpeakSlide}
              className="w-7 h-7 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/30 text-amber-300 hover:text-white flex items-center justify-center transition-transform active:scale-90"
              title="Read Story Aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Headline on Image */}
          <div className="absolute bottom-3 left-5 right-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display drop-shadow-md">
              {slide.title}
            </h2>
            <p className="text-xs text-amber-300/90 font-medium drop-shadow">{slide.subtitle}</p>
          </div>
        </div>

        {/* Narrative Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed">
            <p>{slide.body}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="font-mono text-amber-400">{slide.tag}</span>
            <span className="italic text-[11px]">"{slide.soundSnippet}"</span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {INTRO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundManager.playObjectClick();
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <span>{isLast ? 'Begin Expedition! 🚀' : 'Continue Story'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
