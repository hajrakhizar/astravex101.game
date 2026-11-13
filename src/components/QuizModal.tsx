import React, { useState, useEffect } from 'react';
import { SpaceRelic } from '../types/game';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, X, RotateCcw, Volume2, MessageSquare } from 'lucide-react';
import { DialogueBox } from './DialogueBox';

interface QuizModalProps {
  relic: SpaceRelic;
  isAlreadyDiscovered: boolean;
  initialTab?: 'talk' | 'quiz';
  onClose: () => void;
  onSuccess: (relicId: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  relic,
  isAlreadyDiscovered,
  initialTab = 'talk',
  onClose,
  onSuccess,
}) => {
  // Modal tabs: 'talk' (conversing with the relic) or 'quiz' (answering the trivia)
  const [activeTab, setActiveTab] = useState<'talk' | 'quiz'>(initialTab);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(isAlreadyDiscovered);

  const dialogueLines = [relic.greeting, ...relic.speechDialogue];

  // Play dialogue chirp and speak greeting when opening in talk mode
  useEffect(() => {
    soundManager.playObjectChirp();
    if (initialTab !== 'talk') {
      return () => {
        soundManager.stopSpeaking();
      };
    }

    const timer = setTimeout(() => {
      soundManager.speakRoverVoice(relic.greeting);
    }, 400);

    return () => {
      clearTimeout(timer);
      soundManager.stopSpeaking();
    };
  }, [relic, initialTab]);

  const question = relic.quizQuestions[currentQuestionIndex];
  const totalQuestions = relic.quizQuestions.length;

  const handleSpeakCurrentDialogue = () => {
    soundManager.playObjectChirp();
    const currentLine = dialogueLines[dialogueIndex] || relic.greeting;
    soundManager.speakRoverVoice(currentLine);
  };

  const handleNextDialogue = () => {
    soundManager.playObjectClick();
    if (dialogueIndex < dialogueLines.length - 1) {
      const nextIndex = dialogueIndex + 1;
      setDialogueIndex(nextIndex);
      soundManager.speakRoverVoice(dialogueLines[nextIndex]);
    } else {
      // Transition to quiz!
      setActiveTab('quiz');
      soundManager.playCorrect();
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      soundManager.speakRoverVoice("Great job! That's correct!");
    } else {
      soundManager.playWrong();
      soundManager.speakRoverVoice("Almost! Check out this historical clue.");
    }
  };

  const handleNextQuestion = () => {
    soundManager.playObjectClick();
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setQuizFinished(true);
      soundManager.playFanfare();
      onSuccess(relic.id);
      soundManager.speakRoverVoice(`Congratulations! You have officially cataloged ${relic.name}!`);
    }
  };

  const handleRetryQuestion = () => {
    soundManager.playObjectClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const illustrationSrc =
    relic.body === 'moon'
      ? '/src/assets/images/apollo_lander_storybook_1794455201883.jpg'
      : '/src/assets/images/mars_rovers_storybook_1794455200903.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Storybook Hero Banner Image */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden border-b border-slate-700/80 bg-slate-950">
          <img
            src={illustrationSrc}
            alt={relic.name}
            className="w-full h-full object-cover object-center filter saturate-[1.1]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => {
              soundManager.stopSpeaking();
              onClose();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-200 border border-white/20 flex items-center justify-center backdrop-blur-sm transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Mission Info Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{relic.body === 'moon' ? '🌕' : '🔴'}</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display drop-shadow-md">
                  {relic.name}
                </h2>
                <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950/70 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {relic.year}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium drop-shadow">{relic.landingSite}</p>
            </div>

            <div className="text-[11px] font-mono text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-amber-500/30 hidden sm:block">
              {relic.cutesyNickname}
            </div>
          </div>
        </div>

        {/* Tab Controls: Talk With Relic vs Mission Quiz */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.playObjectClick();
                setActiveTab('talk');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'talk' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk With {relic.name} 💬</span>
            </button>
            <button
              onClick={() => {
                soundManager.playObjectClick();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Mission Quiz ({totalQuestions} Questions)</span>
            </button>
          </div>

          {/* Voice Speak Button */}
          <button
            onClick={handleSpeakCurrentDialogue}
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            title="Read Dialogue Aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Read Voice</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'talk' ? (
            // --- TALKING RELIC CONVERSATION MODE ---
            <div className="space-y-4 pt-3 animate-fadeIn">
              <DialogueBox
                embedded
                speaker={relic.name.toUpperCase()}
                lines={dialogueLines}
                currentIndex={dialogueIndex}
                onAdvance={handleNextDialogue}
                finalContinueLabel={isAlreadyDiscovered ? 'CLICK TO VIEW DOSSIER' : 'CLICK TO START QUIZ'}
              />

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>👩‍🚀 Listening to {relic.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playObjectClick();
                    setActiveTab('quiz');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>{isAlreadyDiscovered ? 'Open Dossier' : 'Jump to Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : !quizFinished ? (
            // --- QUIZ MODE ---
            <div className="space-y-4 pt-1 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-semibold text-slate-200">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="font-mono text-amber-400 font-semibold">Answer to obtain relic</span>
              </div>

              {/* Question Text */}
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                  {question.question}
                </p>
              </div>

              {/* Options List */}
              <div className="space-y-2.5 pt-1">
                {question.options.map((option, idx) => {
                  let btnStyle =
                    'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:border-amber-400/50';

                  if (isAnswered) {
                    if (idx === question.correctIndex) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 font-bold shadow-lg shadow-emerald-500/10';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between shadow-sm ${btnStyle}`}
                    >
                      <span className="leading-snug">{option}</span>
                      {isAnswered && idx === question.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== question.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Explanation Card */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm animate-fadeIn ${
                    isCorrect
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Cosmic Discovery! That's correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Almost! Check out the historical fact:</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 mt-1 leading-relaxed text-xs">{question.explanation}</p>
                  <p className="mt-2 text-amber-300 text-[11px] italic font-medium">⭐ Fun Fact: {question.funFact}</p>

                  <div className="mt-4 flex items-center justify-end gap-3">
                    {!isCorrect ? (
                      <button
                        onClick={handleRetryQuestion}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Try Again
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
                      >
                        <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Obtain Relic! ✨'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // --- RELIC CATALOGED CEREMONY ---
            <div className="text-center py-4 space-y-4 animate-scaleUp">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl">
                  {relic.body === 'moon' ? '🚀' : '🤖'}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  Relic Successfully Cataloged
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-1">{relic.cutesyNickname}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Added to your Cosmic Field Museum with full honors!
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Earth Launch Date:</span>
                  <span className="text-slate-200 font-mono font-medium">{relic.earthLaunchDate}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Landing Site:</span>
                  <span className="text-slate-200 font-medium">{relic.landingSite}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Historic Milestone:</span>
                  <span className="text-amber-300 font-medium">{relic.primaryDiscovery}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    soundManager.playObjectClick();
                    setActiveTab('talk');
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
                >
                  Chat Again 💬
                </button>
                <button
                  onClick={() => {
                    soundManager.stopSpeaking();
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95"
                >
                  Continue Exploration ✨
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
