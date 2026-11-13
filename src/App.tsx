/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CelestialBody, SpaceRelic, SuitColor } from './types/game';
import { SPACE_RELICS } from './data/relicsData';
import { soundManager } from './utils/audio';
import { GameCanvas } from './components/GameCanvas';
import { TopNav } from './components/TopNav';
import { QuizModal } from './components/QuizModal';
import { MuseumModal } from './components/MuseumModal';
import { EmbedModal } from './components/EmbedModal';
import { SuitModal } from './components/SuitModal';
import { TransitCutscene } from './components/TransitCutscene';
import { IntroModal } from './components/IntroModal';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentBody, setCurrentBody] = useState<CelestialBody>('moon');
  const [discoveredRelicIds, setDiscoveredRelicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astroquest_discovered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [collectedStars, setCollectedStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('astroquest_stars');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [suitColor, setSuitColor] = useState<SuitColor>('classic');
  const [inspectingRelic, setInspectingRelic] = useState<SpaceRelic | null>(null);
  const [inspectingRelicTab, setInspectingRelicTab] = useState<'talk' | 'quiz'>('talk');
  const [isMuseumOpen, setIsMuseumOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [isSuitOpen, setIsSuitOpen] = useState(false);
  const [isTransitActive, setIsTransitActive] = useState(false);
  const [transitDestination, setTransitDestination] = useState<CelestialBody>('mars');

  // Storybook Intro at the start of the game
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('astroquest_intro_seen');
    } catch {
      return true;
    }
  });

  const [isMuted, setIsMuted] = useState(!soundManager.isEnabled());
  const [isMusicPlaying, setIsMusicPlaying] = useState(soundManager.isMusicEnabled());

  const handleDismissIntro = () => {
    setIsIntroOpen(false);
    try {
      localStorage.setItem('astroquest_intro_seen', 'true');
    } catch {
      // Ignore
    }
  };

  const handleSwitchPlanet = (newBody: CelestialBody) => {
    if (newBody === currentBody) return;
    soundManager.playPlanetSwitch();
    setTransitDestination(newBody);
    setIsTransitActive(true);

    setTimeout(() => {
      setCurrentBody(newBody);
      setIsTransitActive(false);
    }, 1400);
  };

  const handleInspectRelic = (relic: SpaceRelic, initialTab: 'talk' | 'quiz' = 'talk') => {
    soundManager.playObjectClick();
    setInspectingRelicTab(initialTab);
    setInspectingRelic(relic);
  };

  const handleRelicQuizSuccess = (relicId: string) => {
    setDiscoveredRelicIds((prev) => {
      if (prev.includes(relicId)) return prev;
      const next = [...prev, relicId];
      try {
        localStorage.setItem('astroquest_discovered', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleCollectStar = () => {
    setCollectedStars((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('astroquest_stars', next.toString());
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleToggleMute = () => {
    const enabled = soundManager.toggleSound();
    setIsMuted(!enabled);
  };

  const handleToggleMusic = () => {
    const playing = soundManager.toggleMusic();
    setIsMusicPlaying(playing);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Bar Navigation */}
      <TopNav
        currentBody={currentBody}
        discoveredCount={discoveredRelicIds.length}
        totalCount={SPACE_RELICS.length}
        collectedStars={collectedStars}
        onSwitchPlanet={handleSwitchPlanet}
        onOpenMuseum={() => setIsMuseumOpen(true)}
        onOpenIntro={() => setIsIntroOpen(true)}
        onOpenSuitModal={() => setIsSuitOpen(true)}
        onOpenEmbedModal={() => setIsEmbedOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Exploration Surface */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
        <GameCanvas
          currentBody={currentBody}
          relics={SPACE_RELICS}
          discoveredRelicIds={discoveredRelicIds}
          suitColor={suitColor}
          onInspectRelic={handleInspectRelic}
          collectedStars={collectedStars}
          onCollectStar={handleCollectStar}
          isPaused={Boolean(
            isInitialLoading ||
              inspectingRelic ||
              isMuseumOpen ||
              isEmbedOpen ||
              isSuitOpen ||
              isIntroOpen ||
              isTransitActive
          )}
        />
      </main>

      {/* Planet Cutscene Transition */}
      {isTransitActive && <TransitCutscene destination={transitDestination} />}

      {/* Relic Inspection & Quiz Modal with Talking Objects */}
      {inspectingRelic && (
        <QuizModal
          relic={inspectingRelic}
          isAlreadyDiscovered={discoveredRelicIds.includes(inspectingRelic.id)}
          initialTab={inspectingRelicTab}
          onClose={() => setInspectingRelic(null)}
          onSuccess={handleRelicQuizSuccess}
        />
      )}

      {/* Museum & Archives Modal */}
      {isMuseumOpen && (
        <MuseumModal
          relics={SPACE_RELICS}
          discoveredRelicIds={discoveredRelicIds}
          onClose={() => setIsMuseumOpen(false)}
          onOpenRelic={(relic) => {
            setIsMuseumOpen(false);
            handleInspectRelic(relic);
          }}
        />
      )}

      {/* Suit Customizer Modal */}
      {isSuitOpen && (
        <SuitModal
          currentSuit={suitColor}
          onSelectSuit={(color) => setSuitColor(color)}
          onClose={() => setIsSuitOpen(false)}
        />
      )}

      {/* Link to Website / Embed Code Generator Modal */}
      {isEmbedOpen && <EmbedModal onClose={() => setIsEmbedOpen(false)} />}

      {/* Animated Storybook Intro at the start of the game */}
      {!isInitialLoading && isIntroOpen && (
        <IntroModal
          onComplete={handleDismissIntro}
          onClose={handleDismissIntro}
        />
      )}

      {/* Retro Pixel Loading Screen before game starts */}
      {isInitialLoading && (
        <LoadingScreen onComplete={() => setIsInitialLoading(false)} />
      )}
    </div>
  );
}
