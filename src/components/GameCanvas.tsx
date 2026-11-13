import React, { useEffect, useRef, useState } from 'react';
import { CelestialBody, SpaceRelic, SuitColor } from '../types/game';
import { soundManager } from '../utils/audio';
import { DialogueBox } from './DialogueBox';

interface GameCanvasProps {
  currentBody: CelestialBody;
  relics: SpaceRelic[];
  discoveredRelicIds: string[];
  suitColor: SuitColor;
  onInspectRelic: (relic: SpaceRelic, initialTab?: 'talk' | 'quiz') => void;
  collectedStars: number;
  onCollectStar: () => void;
  isPaused?: boolean;
}

interface ActiveDialogue {
  speaker: string;
  lines: string[];
  currentIndex: number;
  relic?: SpaceRelic;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  maxLife: number;
  life: number;
}

interface Footprint {
  x: number;
  y: number;
  angle: number;
  alpha: number;
  body: CelestialBody;
  isRight: boolean;
}

interface StarItem {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  body: CelestialBody;
}

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulsePhase: number;
}

const SUIT_COLORS: Record<SuitColor, { main: string; shade: string; fabricSeam: string; accent: string; visor: string }> = {
  classic: { main: '#F8FAFC', shade: '#CBD5E1', fabricSeam: '#94A3B8', accent: '#2563EB', visor: '#F59E0B' },
  rose: { main: '#FFF1F2', shade: '#FECDD3', fabricSeam: '#FDA4AF', accent: '#E11D48', visor: '#FBBF24' },
  cyan: { main: '#ECFEFF', shade: '#BAE6FD', fabricSeam: '#7DD3FC', accent: '#0284C7', visor: '#F59E0B' },
  gold: { main: '#FEFCE8', shade: '#FEF08A', fabricSeam: '#FDE047', accent: '#D97706', visor: '#38BDF8' },
  mint: { main: '#F0FDF4', shade: '#BBF7D0', fabricSeam: '#86EFAC', accent: '#059669', visor: '#FBBF24' },
  violet: { main: '#FAF5FF', shade: '#E9D5FF', fabricSeam: '#D8B4FE', accent: '#9333EA', visor: '#F59E0B' },
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentBody,
  relics,
  discoveredRelicIds,
  suitColor,
  onInspectRelic,
  collectedStars,
  onCollectStar,
  isPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position in world coordinates (0 to 1400 in X, 0 to 900 in Y)
  const playerRef = useRef({
    x: 450,
    y: 350,
    vx: 0,
    vy: 0,
    targetX: 450,
    targetY: 350,
    facing: 'right' as 'left' | 'right' | 'up' | 'down',
    walkCycle: 0,
    isMoving: false,
    stepCount: 0,
  });

  // Companion bot ("Pip")
  const petRef = useRef({
    x: 410,
    y: 330,
    floatOffset: 0,
    blinkTimer: 0,
  });

  const particlesRef = useRef<Particle[]>([]);
  const footprintsRef = useRef<Footprint[]>([]);
  const keysDownRef = useRef<Record<string, boolean>>({});
  const [nearbyRelic, setNearbyRelic] = useState<SpaceRelic | null>(null);
  const [radarDistance, setRadarDistance] = useState<number | null>(null);
  const [nearestRelicName, setNearestRelicName] = useState<string>('');
  const [activeDialogue, setActiveDialogue] = useState<ActiveDialogue | null>(null);
  const greetedBodiesRef = useRef<Record<CelestialBody, boolean>>({ moon: false, mars: false });

  // Floating ambient dust motes (childish cozy atmosphere)
  const dustMotesRef = useRef<DustMote[]>(
    Array.from({ length: 45 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 2,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      pulsePhase: Math.random() * Math.PI * 2,
    }))
  );

  // Collectible Starbits
  const starsRef = useRef<StarItem[]>([
    { id: 'm-s1', x: 260, y: 220, collected: false, body: 'moon' },
    { id: 'm-s2', x: 520, y: 460, collected: false, body: 'moon' },
    { id: 'm-s3', x: 880, y: 320, collected: false, body: 'moon' },
    { id: 'm-s4', x: 1220, y: 360, collected: false, body: 'moon' },
    { id: 'm-s5', x: 650, y: 180, collected: false, body: 'moon' },
    { id: 'r-s1', x: 240, y: 260, collected: false, body: 'mars' },
    { id: 'r-s2', x: 500, y: 520, collected: false, body: 'mars' },
    { id: 'r-s3', x: 880, y: 580, collected: false, body: 'mars' },
    { id: 'r-s4', x: 1180, y: 380, collected: false, body: 'mars' },
    { id: 'r-s5', x: 820, y: 200, collected: false, body: 'mars' },
  ]);

  // Rotor animation for Ingenuity
  const rotorAngleRef = useRef(0);

  // Reset player position when switching planet
  useEffect(() => {
    setActiveDialogue(null);
    if (currentBody === 'moon') {
      playerRef.current.x = 420;
      playerRef.current.y = 350;
      playerRef.current.targetX = 420;
      playerRef.current.targetY = 350;
    } else {
      playerRef.current.x = 400;
      playerRef.current.y = 360;
      playerRef.current.targetX = 400;
      playerRef.current.targetY = 360;
    }
  }, [currentBody]);

  // Trigger Pip's arrival dialogue once the player lands on Moon or Mars and modals are closed
  useEffect(() => {
    if (isPaused || greetedBodiesRef.current[currentBody]) return;

    greetedBodiesRef.current[currentBody] = true;
    const timer = window.setTimeout(() => {
      soundManager.playObjectChirp();
      setActiveDialogue({
        speaker: 'PIP',
        lines:
          currentBody === 'moon'
            ? [
                'Touchdown on the Moon! Walk with WASD or click anywhere to explore the historic Apollo landing sites.',
                'Approach any glowing relic and press Space (or click it) to hear its story. You can also click me anytime for hints!',
              ]
            : [
                'Welcome to Mars! Four legendary rovers are waiting out across the red dunes and craters.',
                'Follow the Martian Rover Scanner at the top right, or click me anytime if you need a clue!',
              ],
        currentIndex: 0,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [currentBody, isPaused]);

  const openRelicDialogue = (relic: SpaceRelic) => {
    soundManager.playObjectClick();
    keysDownRef.current = {};
    playerRef.current.targetX = playerRef.current.x;
    playerRef.current.targetY = playerRef.current.y;
    setActiveDialogue({
      speaker: relic.name.toUpperCase(),
      lines: [relic.greeting, ...relic.speechDialogue],
      currentIndex: 0,
      relic,
    });
  };

  const openPipHintDialogue = () => {
    soundManager.playObjectChirp();
    const undiscoveredOnBody = relics.filter(
      (r) => r.body === currentBody && !discoveredRelicIds.includes(r.id)
    );

    if (undiscoveredOnBody.length === 0) {
      const otherBody = currentBody === 'moon' ? 'Mars' : 'the Moon';
      const remainingOther = relics.filter((r) => r.body !== currentBody && !discoveredRelicIds.includes(r.id)).length;
      setActiveDialogue({
        speaker: 'PIP',
        lines: [
          remainingOther > 0
            ? `Every relic here on ${currentBody === 'moon' ? 'the Moon' : 'Mars'} is cataloged! Let's hop in the rocket and visit ${otherBody} (${remainingOther} left)!`
            : 'Incredible work, Space Archaeologist! You have cataloged every single relic across both the Moon and Mars!',
        ],
        currentIndex: 0,
      });
      return;
    }

    // Find nearest undiscovered relic on this body
    const player = playerRef.current;
    let nearest = undiscoveredOnBody[0];
    let bestDist = Infinity;
    for (const r of undiscoveredOnBody) {
      const d = Math.hypot(r.coordinates.x - player.x, r.coordinates.y - player.y);
      if (d < bestDist) {
        bestDist = d;
        nearest = r;
      }
    }

    const dx = nearest.coordinates.x - player.x;
    const dy = nearest.coordinates.y - player.y;
    const ns = Math.abs(dy) > 70 ? (dy < 0 ? 'north' : 'south') : '';
    const ew = Math.abs(dx) > 70 ? (dx < 0 ? 'west' : 'east') : '';
    const direction = [ns, ew].filter(Boolean).join('-') || 'right nearby';

    setActiveDialogue({
      speaker: 'PIP',
      lines: [
        `My sensors are picking up ${nearest.name} (${nearest.year}) to the ${direction}—about ${Math.round(bestDist)} meters away!`,
      ],
      currentIndex: 0,
    });
  };

  const handleAdvanceDialogue = () => {
    if (!activeDialogue) return;
    soundManager.playObjectClick();
    if (activeDialogue.currentIndex < activeDialogue.lines.length - 1) {
      setActiveDialogue({
        ...activeDialogue,
        currentIndex: activeDialogue.currentIndex + 1,
      });
    } else if (activeDialogue.relic) {
      const targetRelic = activeDialogue.relic;
      setActiveDialogue(null);
      onInspectRelic(targetRelic, 'quiz');
    } else {
      setActiveDialogue(null);
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (activeDialogue) {
        // Movement keys are paused while talking to a relic, or dismiss Pip's hint if moving
        if (!activeDialogue.relic && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
          setActiveDialogue(null);
          keysDownRef.current[e.key.toLowerCase()] = true;
          keysDownRef.current[e.code] = true;
        }
        return;
      }

      keysDownRef.current[e.key.toLowerCase()] = true;
      keysDownRef.current[e.code] = true;

      if ((e.key === 'e' || e.key === 'E' || e.code === 'Space') && nearbyRelic && !e.repeat) {
        openRelicDialogue(nearbyRelic);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key.toLowerCase()] = false;
      keysDownRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyRelic, activeDialogue, isPaused]);

  // Main game animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let stepSoundThrottle = 0;

    const currentRelics = relics.filter((r) => r.body === currentBody);

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update rotor angle for Ingenuity
      rotorAngleRef.current += dt * 22;

      // Process input
      const keys = keysDownRef.current;
      let moveX = 0;
      let moveY = 0;

      if (keys['w'] || keys['arrowup']) moveY -= 1;
      if (keys['s'] || keys['arrowdown']) moveY += 1;
      if (keys['a'] || keys['arrowleft']) moveX -= 1;
      if (keys['d'] || keys['arrowright']) moveX += 1;

      const player = playerRef.current;

      // Click-to-move support
      const distToTarget = Math.hypot(player.targetX - player.x, player.targetY - player.y);
      if (distToTarget > 6 && (moveX === 0 && moveY === 0)) {
        moveX = (player.targetX - player.x) / distToTarget;
        moveY = (player.targetY - player.y) / distToTarget;
      }

      const speed = 210;
      if (moveX !== 0 || moveY !== 0) {
        const mag = Math.hypot(moveX, moveY);
        const normX = moveX / mag;
        const normY = moveY / mag;

        player.x += normX * speed * dt;
        player.y += normY * speed * dt;

        player.x = Math.max(80, Math.min(1320, player.x));
        player.y = Math.max(100, Math.min(820, player.y));

        player.isMoving = true;
        player.walkCycle += dt * 14;

        if (normX < -0.2) player.facing = 'left';
        else if (normX > 0.2) player.facing = 'right';
        else if (normY < -0.2) player.facing = 'up';
        else if (normY > 0.2) player.facing = 'down';

        // Footstep sound and realistic tread footprints
        stepSoundThrottle += dt;
        if (stepSoundThrottle > 0.26) {
          stepSoundThrottle = 0;
          player.stepCount++;
          soundManager.playStep();

          const isRight = player.stepCount % 2 === 0;
          const perpAngle = Math.atan2(normY, normX) + Math.PI / 2;
          const footOffsetX = Math.cos(perpAngle) * (isRight ? 6 : -6);
          const footOffsetY = Math.sin(perpAngle) * (isRight ? 6 : -6);

          footprintsRef.current.push({
            x: player.x + footOffsetX,
            y: player.y + 14 + footOffsetY,
            angle: Math.atan2(normY, normX),
            alpha: 0.7,
            body: currentBody,
            isRight,
          });

          if (footprintsRef.current.length > 70) {
            footprintsRef.current.shift();
          }

          // Soft watercolor-like dust puff particles
          for (let i = 0; i < 4; i++) {
            particlesRef.current.push({
              x: player.x + (Math.random() - 0.5) * 10,
              y: player.y + 16,
              vx: (Math.random() - 0.5) * 16 - normX * 12,
              vy: -Math.random() * 20 - 4,
              alpha: 0.65,
              size: Math.random() * 3 + 2,
              color: currentBody === 'moon' ? '#E2E8F0' : '#FFEDD5',
              maxLife: 0.5,
              life: 0.5,
            });
          }
        }
      } else {
        player.isMoving = false;
        player.walkCycle = 0;
        player.targetX = player.x;
        player.targetY = player.y;
      }

      // Update companion bot smooth follow
      const pet = petRef.current;
      pet.floatOffset = Math.sin(time * 0.0035) * 6;
      const targetPetX = player.x + (player.facing === 'left' ? 34 : -34);
      const targetPetY = player.y - 14 + pet.floatOffset;
      pet.x += (targetPetX - pet.x) * 0.07;
      pet.y += (targetPetY - pet.y) * 0.07;

      // Update ambient dust motes
      dustMotesRef.current.forEach((mote) => {
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
        if (mote.y < 0) mote.y = 900;
        if (mote.x < 0) mote.x = 1400;
        if (mote.x > 1400) mote.x = 0;
      });

      // Check proximity to relics
      let closest: SpaceRelic | null = null;
      let minDistance = Infinity;

      for (const relic of currentRelics) {
        const d = Math.hypot(relic.coordinates.x - player.x, relic.coordinates.y - player.y);
        if (d < minDistance) {
          minDistance = d;
          setNearestRelicName(relic.name);
          setRadarDistance(Math.round(d));
        }
        if (d < 90) {
          closest = relic;
        }
      }
      setNearbyRelic(closest);

      // Collect starbits
      starsRef.current.forEach((star) => {
        if (!star.collected && star.body === currentBody) {
          const d = Math.hypot(star.x - player.x, star.y - player.y);
          if (d < 36) {
            star.collected = true;
            soundManager.playStarPickup();
            onCollectStar();

            for (let i = 0; i < 10; i++) {
              const angle = (Math.PI * 2 * i) / 10;
              particlesRef.current.push({
                x: star.x,
                y: star.y,
                vx: Math.cos(angle) * 70,
                vy: Math.sin(angle) * 70,
                alpha: 1,
                size: 3.5,
                color: '#FDE047',
                maxLife: 0.55,
                life: 0.55,
              });
            }
          }
        }
      });

      // Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = Math.max(0, p.life / p.maxLife);
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Fade footprints slowly
      for (const fp of footprintsRef.current) {
        fp.alpha -= dt * 0.015;
      }
      footprintsRef.current = footprintsRef.current.filter((fp) => fp.alpha > 0.04);

      // --- RENDERING ---
      const w = canvas.width;
      const h = canvas.height;

      const cameraX = Math.max(0, Math.min(1400 - w, player.x - w / 2));
      const cameraY = Math.max(0, Math.min(900 - h, player.y - h / 2));

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // 1. Draw Textured Realistic-Childish Terrain
      drawAestheticTerrain(ctx, currentBody, time);

      // 2. Draw Realistic Apollo Boot Footprints & Wheel Tracks
      drawFootprintsAndTracks(ctx, footprintsRef.current, currentBody);

      // 3. Draw Collectible Stars
      starsRef.current.forEach((star) => {
        if (!star.collected && star.body === currentBody) {
          drawStorybookStar(ctx, star.x, star.y, time);
        }
      });

      // 4. Draw Relics with Detailed Realistic Storybook Texture
      currentRelics.forEach((relic) => {
        const isDiscovered = discoveredRelicIds.includes(relic.id);
        drawRealisticRelic(ctx, relic, isDiscovered, time, rotorAngleRef.current);
      });

      // 5. Draw Particles
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. Draw Player Astronaut with tactile fabric & visor reflections
      drawAestheticAstronaut(ctx, player, suitColor, time, currentBody);

      // 7. Draw Companion Bot ("Pip")
      drawCompanionBot(ctx, pet.x, pet.y, time);

      // 8. Draw Ambient Dust Motes
      drawDustMotes(ctx, dustMotesRef.current, time);

      // 9. Draw Interaction Prompt
      if (closest) {
        drawInteractionPrompt(ctx, closest, player.x, player.y - 52, discoveredRelicIds.includes(closest.id));
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentBody, relics, discoveredRelicIds, suitColor, onCollectStar]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const cameraX = Math.max(0, Math.min(1400 - canvas.width, playerRef.current.x - canvas.width / 2));
    const cameraY = Math.max(0, Math.min(900 - canvas.height, playerRef.current.y - canvas.height / 2));

    const worldClickX = clickScreenX + cameraX;
    const worldClickY = clickScreenY + cameraY;

    // Check if clicked directly on a relic on the current planet
    const clickedRelic = relics.find(
      (r) => r.body === currentBody && Math.hypot(r.coordinates.x - worldClickX, r.coordinates.y - worldClickY) < 55
    );

    if (clickedRelic) {
      openRelicDialogue(clickedRelic);
      return;
    }

    // Check if clicked on companion bot Pip
    if (Math.hypot(petRef.current.x - worldClickX, petRef.current.y - worldClickY) < 32) {
      openPipHintDialogue();
      return;
    }

    // Close any open dialogue and walk to clicked surface point
    if (activeDialogue) {
      setActiveDialogue(null);
    }
    playerRef.current.targetX = worldClickX;
    playerRef.current.targetY = worldClickY;
  };

  const handleTouchDir = (dir: 'up' | 'down' | 'left' | 'right', isPressed: boolean) => {
    const keyMap: Record<string, string> = {
      up: 'arrowup',
      down: 'arrowdown',
      left: 'arrowleft',
      right: 'arrowright',
    };
    keysDownRef.current[keyMap[dir]] = isPressed;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none">
      <div className="relative w-full h-full max-w-[1400px] max-h-[900px] flex items-center justify-center">
        {/* Canvas with subtle tactile paper border */}
        <canvas
          ref={canvasRef}
          width={1100}
          height={680}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair rounded-2xl shadow-2xl border-2 border-slate-800/90 bg-slate-950"
        />

        {/* Storybook HUD Radar Minimap & Compass (Top Right) */}
        <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-2">
          <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 shadow-xl flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full border border-amber-400/40 flex items-center justify-center bg-slate-950/90 overflow-hidden">
              <div className="absolute inset-0 bg-amber-400/10 rounded-full animate-ping" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-300" />
              <span className="absolute top-0.5 text-[8px] font-mono font-bold text-amber-300">N</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-slate-200 font-display">
                {currentBody === 'moon' ? 'Lunar Beacon Radar' : 'Martian Rover Scanner'}
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {radarDistance ? `Relic in: ~${radarDistance}m` : 'Scanning surface...'}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{nearestRelicName}</span>
            </div>
          </div>
        </div>

        {/* In-World RPG Dialogue Box Overlay */}
        {activeDialogue && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-[660px] animate-fadeIn">
            <DialogueBox
              speaker={activeDialogue.speaker}
              lines={activeDialogue.lines}
              currentIndex={activeDialogue.currentIndex}
              onAdvance={handleAdvanceDialogue}
              onClose={() => {
                soundManager.stopSpeaking();
                setActiveDialogue(null);
              }}
              onSkipToAction={
                activeDialogue.relic
                  ? () => {
                      const relic = activeDialogue.relic!;
                      soundManager.stopSpeaking();
                      setActiveDialogue(null);
                      onInspectRelic(relic, 'quiz');
                    }
                  : undefined
              }
              skipActionLabel={
                activeDialogue.relic && discoveredRelicIds.includes(activeDialogue.relic.id)
                  ? 'Open Dossier'
                  : 'Skip to Quiz'
              }
              finalContinueLabel={
                activeDialogue.relic
                  ? discoveredRelicIds.includes(activeDialogue.relic.id)
                    ? 'CLICK TO OPEN DOSSIER'
                    : 'CLICK TO START QUIZ'
                  : 'CLICK TO CLOSE'
              }
            />
          </div>
        )}

        {/* Floating Quick Action Button for Relic Interaction */}
        {nearbyRelic && !activeDialogue && (
          <div className="absolute bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => openRelicDialogue(nearbyRelic)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-full shadow-2xl shadow-amber-500/40 flex items-center gap-2 transform active:scale-95 transition-all text-sm border-2 border-white/60 animate-bounce"
            >
              <span>💬 Talk to {nearbyRelic.name}</span>
              <span className="text-xs bg-slate-950/20 px-2 py-0.5 rounded-full font-bold">
                {discoveredRelicIds.includes(nearbyRelic.id) ? 'Cataloged' : 'Story & Quiz'}
              </span>
            </button>
          </div>
        )}

        {/* On-Screen Mobile Virtual D-Pad */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col items-center sm:hidden bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-xl">
          <button
            onTouchStart={() => handleTouchDir('up', true)}
            onTouchEnd={() => handleTouchDir('up', false)}
            className="w-11 h-11 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-bold text-lg mb-1"
          >
            ▲
          </button>
          <div className="flex gap-2">
            <button
              onTouchStart={() => handleTouchDir('left', true)}
              onTouchEnd={() => handleTouchDir('left', false)}
              className="w-11 h-11 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-bold text-lg"
            >
              ◀
            </button>
            <button
              onTouchStart={() => handleTouchDir('down', true)}
              onTouchEnd={() => handleTouchDir('down', false)}
              className="w-11 h-11 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-bold text-lg"
            >
              ▼
            </button>
            <button
              onTouchStart={() => handleTouchDir('right', true)}
              onTouchEnd={() => handleTouchDir('right', false)}
              className="w-11 h-11 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-bold text-lg"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Keyboard / Controls Help Footer Hint */}
        {!activeDialogue && (
          <div className="absolute bottom-3 right-4 hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span>Move: <strong className="text-white">WASD / Arrow Keys</strong> or <strong className="text-white">Click Surface</strong></span>
            <span className="text-slate-600">·</span>
            <span>Talk: <strong className="text-white">Space / E</strong></span>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={openPipHintDialogue}
              className="text-[#4ADE80] hover:text-emerald-300 font-semibold transition-colors"
            >
              Ask Pip 💬
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- REALISTIC + CHILDISH AESTHETIC DRAWING FUNCTIONS ---

function drawAestheticTerrain(ctx: CanvasRenderingContext2D, body: CelestialBody, time: number) {
  const worldW = 1400;
  const worldH = 900;

  if (body === 'moon') {
    // 1. Lunar Deep Cosmos
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 180);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.7, '#070C1E');
    skyGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, worldW, 180);

    // Realistic Starfield with Constellations & Colorful Twinkle
    for (let i = 0; i < 90; i++) {
      const sx = (i * 179 + 23) % worldW;
      const sy = (i * 67 + 11) % 170;
      const twinkle = Math.sin(time * 0.002 + i * 0.7) * 0.4 + 0.6;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = i % 7 === 0 ? '#93C5FD' : i % 5 === 0 ? '#FEF08A' : '#FFFFFF';
      const size = i % 11 === 0 ? 2.5 : i % 4 === 0 ? 1.8 : 1.2;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;

    // Glowing Detailed Blue Marble Earth in Sky
    const earthX = 1180;
    const earthY = 75;
    const earthRadius = 42;

    // Outer Earth Atmospheric Glow
    const earthAura = ctx.createRadialGradient(earthX, earthY, earthRadius * 0.8, earthX, earthY, earthRadius * 1.5);
    earthAura.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    earthAura.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = earthAura;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Earth Sphere
    const earthGrad = ctx.createRadialGradient(earthX - 12, earthY - 12, 6, earthX, earthY, earthRadius);
    earthGrad.addColorStop(0, '#38BDF8');
    earthGrad.addColorStop(0.4, '#0284C7');
    earthGrad.addColorStop(0.7, '#0369A1');
    earthGrad.addColorStop(1, '#0C4A6E');
    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    // Continents & Cloud Swirls (Childish Storybook Style)
    ctx.fillStyle = 'rgba(74, 222, 128, 0.45)';
    ctx.beginPath();
    ctx.arc(earthX - 10, earthY - 5, 14, 0, Math.PI * 1.5);
    ctx.arc(earthX + 8, earthY + 8, 12, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.ellipse(earthX - 8, earthY - 12, 18, 5, Math.PI * 0.1, 0, Math.PI * 2);
    ctx.ellipse(earthX + 6, earthY + 6, 20, 6, -Math.PI * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Lunar Mountain Horizon with Watercolor Shading
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.bezierCurveTo(240, 140, 480, 165, 750, 135);
    ctx.bezierCurveTo(980, 110, 1220, 150, worldW, 180);
    ctx.lineTo(worldW, worldH);
    ctx.lineTo(0, worldH);
    ctx.fill();

    // Moon Regolith Surface (Soft layered gouache gray with stippling)
    const moonGround = ctx.createLinearGradient(0, 180, 0, worldH);
    moonGround.addColorStop(0, '#94A3B8');
    moonGround.addColorStop(0.35, '#64748B');
    moonGround.addColorStop(0.7, '#475569');
    moonGround.addColorStop(1, '#334155');
    ctx.fillStyle = moonGround;
    ctx.fillRect(0, 180, worldW, worldH - 180);

    // Textured Craters with Depth Shading & Inner Shadows
    const craters = [
      { x: 220, y: 380, rx: 56, ry: 34 },
      { x: 580, y: 560, rx: 72, ry: 44 },
      { x: 920, y: 380, rx: 58, ry: 36 },
      { x: 1260, y: 620, rx: 76, ry: 48 },
      { x: 380, y: 680, rx: 46, ry: 28 },
      { x: 780, y: 240, rx: 40, ry: 24 },
      { x: 1040, y: 720, rx: 50, ry: 30 },
    ];

    craters.forEach((c) => {
      ctx.save();
      // Crater Deep Basin
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crater Inner Shadow
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.ellipse(c.x - 4, c.y - 2, c.rx * 0.75, c.ry * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rim Highlight (Cast by Earthshine / Sun from top-left)
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, Math.PI * 0.85, Math.PI * 1.95);
      ctx.stroke();

      // Ejecta Rays (Delicate chalky lines)
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.25)';
      ctx.lineWidth = 1.2;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(c.x + Math.cos(angle) * c.rx, c.y + Math.sin(angle) * c.ry);
        ctx.lineTo(c.x + Math.cos(angle) * (c.rx + 16), c.y + Math.sin(angle) * (c.ry + 10));
        ctx.stroke();
      }
      ctx.restore();
    });
  } else {
    // 2. Mars Warm Twilight Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 180);
    skyGrad.addColorStop(0, '#1E1B4B');
    skyGrad.addColorStop(0.5, '#431407');
    skyGrad.addColorStop(1, '#7C2D12');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, worldW, 180);

    // Distant Stars in Martian Twilight
    for (let i = 0; i < 75; i++) {
      const sx = (i * 193 + 47) % worldW;
      const sy = (i * 73 + 19) % 170;
      const twinkle = Math.sin(time * 0.0022 + i) * 0.35 + 0.65;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = i % 6 === 0 ? '#FEF08A' : '#FFEDD5';
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    // Mars Moons: Phobos & Deimos (Potato-shaped miniature moons)
    ctx.fillStyle = '#FED7AA';
    ctx.beginPath();
    ctx.ellipse(1120, 65, 13, 9, Math.PI * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(1185, 82, 6, 4.5, -Math.PI * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Distant Olympus Mons & Layered Martian Mesas
    ctx.fillStyle = '#9A3412';
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.bezierCurveTo(250, 115, 520, 140, 800, 100);
    ctx.bezierCurveTo(1050, 80, 1250, 130, worldW, 180);
    ctx.lineTo(worldW, worldH);
    ctx.lineTo(0, worldH);
    ctx.fill();

    // Mars Dune Ground (Apricot and warm rust with wind-blown sand ripples)
    const marsGround = ctx.createLinearGradient(0, 180, 0, worldH);
    marsGround.addColorStop(0, '#C2410C');
    marsGround.addColorStop(0.3, '#EA580C');
    marsGround.addColorStop(0.7, '#C2410C');
    marsGround.addColorStop(1, '#7C2D12');
    ctx.fillStyle = marsGround;
    ctx.fillRect(0, 180, worldW, worldH - 180);

    // Windblown Sand Ripples (Storybook Gouache brushlines)
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
    ctx.lineWidth = 2.5;
    for (let row = 210; row < worldH; row += 75) {
      ctx.beginPath();
      ctx.moveTo(0, row);
      ctx.bezierCurveTo(worldW * 0.25, row - 12, worldW * 0.7, row + 16, worldW, row - 8);
      ctx.stroke();
    }

    // Martian Boulders & Craters
    const boulders = [
      { x: 180, y: 320, r: 22 },
      { x: 480, y: 490, r: 18 },
      { x: 840, y: 360, r: 28 },
      { x: 1120, y: 560, r: 24 },
      { x: 600, y: 720, r: 32 },
    ];
    boulders.forEach((b) => {
      // Boulder Shadow
      ctx.fillStyle = 'rgba(67, 20, 7, 0.6)';
      ctx.beginPath();
      ctx.ellipse(b.x + 4, b.y + b.r * 0.4, b.r * 1.1, b.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Boulder Body
      ctx.fillStyle = '#7C2D12';
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.r, b.r * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Boulder Top Highlight
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.arc(b.x - 3, b.y - 4, b.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Storybook Canvas Paper Texture (Subtle stippling for childish storybook warmth)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let px = 0; px < worldW; px += 24) {
    for (let py = 180; py < worldH; py += 24) {
      if ((px + py) % 7 === 0) {
        ctx.fillRect(px, py, 2, 2);
      }
    }
  }
}

// Realistic Apollo Bootprints & Rover Tracks
function drawFootprintsAndTracks(ctx: CanvasRenderingContext2D, footprints: Footprint[], body: CelestialBody) {
  footprints.forEach((fp) => {
    if (fp.body === body) {
      ctx.save();
      ctx.translate(fp.x, fp.y);
      ctx.rotate(fp.angle);

      // Realistic Waffle-Tread Apollo Boot Impression
      ctx.fillStyle = body === 'moon' ? `rgba(51, 65, 85, ${fp.alpha})` : `rgba(124, 45, 18, ${fp.alpha})`;
      ctx.beginPath();
      ctx.roundRect(-4, -2.5, 9, 5, 2);
      ctx.fill();

      // Ribbed tread crossbars (the iconic moon print texture!)
      ctx.strokeStyle = body === 'moon' ? `rgba(15, 23, 42, ${fp.alpha * 0.9})` : `rgba(67, 20, 7, ${fp.alpha * 0.9})`;
      ctx.lineWidth = 1;
      for (let x = -2; x <= 3; x += 1.8) {
        ctx.beginPath();
        ctx.moveTo(x, -2.2);
        ctx.lineTo(x, 2.2);
        ctx.stroke();
      }

      ctx.restore();
    }
  });
}

function drawStorybookStar(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(time * 0.005 + x) * 4;
  const rot = time * 0.0025;

  // Star Golden Glow
  const glow = ctx.createRadialGradient(0, bob, 2, 0, bob, 16);
  glow.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
  glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, bob, 16, 0, Math.PI * 2);
  ctx.fill();

  // 4-point cute sparkle star with soft bevel
  ctx.rotate(rot);
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.lineTo(Math.cos((i * Math.PI) / 2) * 9, Math.sin((i * Math.PI) / 2) * 9);
    ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * 3.5, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * 3.5);
  }
  ctx.closePath();
  ctx.fill();

  // Star center highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawRealisticRelic(
  ctx: CanvasRenderingContext2D,
  relic: SpaceRelic,
  isDiscovered: boolean,
  time: number,
  rotorAngle: number
) {
  const { x, y } = relic.coordinates;

  ctx.save();
  ctx.translate(x, y);

  // Soft glowing discovery aura
  const pulse = Math.sin(time * 0.005) * 5;
  ctx.fillStyle = isDiscovered ? 'rgba(52, 211, 153, 0.22)' : 'rgba(251, 191, 36, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 10, 42 + pulse, 0, Math.PI * 2);
  ctx.fill();

  // Relic Ground Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 20, 36, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (relic.id) {
    case 'apollo-11': {
      // --- APOLLO 11: EAGLE LUNAR MODULE DESCENT STAGE ---
      // Octagonal descent base with textured gold Mylar foil
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(-20, -12);
      ctx.lineTo(20, -12);
      ctx.lineTo(24, 6);
      ctx.lineTo(-24, 6);
      ctx.closePath();
      ctx.fill();

      // Crumpled gold foil faceted pattern
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-16, -10, 12, 14);
      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(-2, -8, 14, 12);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(14, -6, 8, 10);

      // Black Inconel heat shield section
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(-12, 0, 24, 6);

      // Descent Engine Bell underneath
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-6, 6);
      ctx.lineTo(6, 6);
      ctx.lineTo(9, 15);
      ctx.lineTo(-9, 15);
      ctx.closePath();
      ctx.fill();

      // 4 Tubular Landing Gear Legs & Footpads
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-18, 2);
      ctx.lineTo(-32, 22);
      ctx.moveTo(18, 2);
      ctx.lineTo(32, 22);
      ctx.stroke();

      // Golden Footpads
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.ellipse(-32, 22, 7, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(32, 22, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Egress Ladder with steps
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14, -12);
      ctx.lineTo(26, 18);
      ctx.moveTo(18, -12);
      ctx.lineTo(30, 18);
      ctx.stroke();
      for (let step = -8; step < 16; step += 5) {
        ctx.beginPath();
        ctx.moveTo(14 + (step + 12) * 0.4, step);
        ctx.lineTo(18 + (step + 12) * 0.4, step);
        ctx.stroke();
      }

      // American Flag planted on the Moon
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(38, 22);
      ctx.lineTo(38, -26);
      ctx.stroke();
      // Flag fabric wave
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(38, -26, 20, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(38, -22, 20, 3);
      ctx.fillRect(38, -16, 20, 3);
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(38, -26, 8, 7);

      // Neil's Iconic Footprint with subtle golden beacon
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(-8, 24, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'apollo-15': {
      // --- APOLLO 15: FIRST LUNAR ROVING VEHICLE (MOON BUGGY) ---
      // Chassis & seats
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(-24, -6, 48, 14);

      // Wire mesh wheels with chevron tread pattern
      ctx.fillStyle = '#475569';
      [-18, 18].forEach((wx) => {
        ctx.beginPath();
        ctx.arc(wx, 13, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Inner wheel hub
        ctx.fillStyle = '#94A3B8';
        ctx.beginPath();
        ctx.arc(wx, 13, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Crew Seats & Seatbelts
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-12, -15, 11, 9);
      ctx.fillRect(2, -15, 11, 9);

      // High-gain parabolic dish antenna
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(16, -18, 9, Math.PI * 0.2, Math.PI * 1.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, -9);
      ctx.lineTo(16, -6);
      ctx.stroke();

      // David Scott's Hammer and Falcon Feather resting on a lunar rock
      ctx.fillStyle = '#64748B';
      ctx.fillRect(28, 14, 5, 7); // geology rock
      ctx.strokeStyle = '#94A3B8'; // hammer handle
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(27, 10);
      ctx.lineTo(34, 18);
      ctx.stroke();
      // Falcon feather (white delicate brush)
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(34, 8);
      ctx.bezierCurveTo(36, 12, 33, 16, 31, 19);
      ctx.stroke();
      break;
    }

    case 'apollo-17': {
      // --- APOLLO 17: ORANGE SOIL & DUCT-TAPED MAP FENDER ROVER ---
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(-24, -6, 48, 14);

      // Taped cardboard map fender on rear wheel! (Four maps + gray tape)
      ctx.fillStyle = '#F97316'; // Cardboard map tone
      ctx.fillRect(-28, 2, 14, 7);
      ctx.strokeStyle = '#64748B'; // Gray duct tape clamp
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-25, 2);
      ctx.lineTo(-25, 9);
      ctx.stroke();

      // Wheels
      ctx.fillStyle = '#475569';
      [-18, 18].forEach((wx) => {
        ctx.beginPath();
        ctx.arc(wx, 13, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Orange Volcanic Glass Beads glowing in the dust!
      ctx.fillStyle = '#FB923C';
      [-20, -12, 4, 14, 24].forEach((bx) => {
        ctx.beginPath();
        ctx.arc(bx, 19, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.arc(bx - 0.5, 18.5, 1, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'mars-pathfinder': {
      // --- MARS PATHFINDER & SOJOURNER (1997) ---
      // Deflated protective airbags
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.ellipse(-16, 12, 14, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(16, 12, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sagan Memorial Station Triangular Solar Petals
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.moveTo(-20, 5);
      ctx.lineTo(0, -16);
      ctx.lineTo(20, 5);
      ctx.closePath();
      ctx.fill();
      // Solar gridlines
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(0, 5);
      ctx.stroke();

      // Sojourner micro-rover driving on ramp
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(18, 3, 16, 9);
      // Sojourner solar top
      ctx.fillStyle = '#0369A1';
      ctx.fillRect(19, 1, 14, 3);
      // 6 Mini wheels
      ctx.fillStyle = '#1E293B';
      [17, 23, 29].forEach((sx) => {
        ctx.fillRect(sx, 12, 4, 3.5);
      });
      // APXS sensor snout
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(34, 7);
      ctx.lineTo(38, 9);
      ctx.stroke();
      break;
    }

    case 'spirit-opportunity': {
      // --- SPIRIT & OPPORTUNITY (2004) ---
      // Chassis with realistic solar wings & Pancam head
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(-18, -6, 36, 13);

      // Solar Wings with solar cell divisions
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.moveTo(-26, -4);
      ctx.lineTo(-18, -9);
      ctx.lineTo(18, -9);
      ctx.lineTo(26, -4);
      ctx.lineTo(18, 3);
      ctx.lineTo(-18, 3);
      ctx.closePath();
      ctx.fill();

      // Mast with Pancam binocular stereo cameras ("eyes")
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, -24);
      ctx.stroke();

      // Pancam Head
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-7, -26, 14, 6);
      ctx.fillStyle = '#38BDF8'; // Cute blue glass camera lenses
      ctx.beginPath();
      ctx.arc(-3.5, -23, 1.8, 0, Math.PI * 2);
      ctx.arc(3.5, -23, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 6 Rocker-Bogie wheels
      ctx.fillStyle = '#334155';
      [-16, 0, 16].forEach((wx) => {
        ctx.beginPath();
        ctx.arc(wx, 13, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hematite Martian "Blueberries"
      ctx.fillStyle = '#60A5FA';
      [-24, -14, 18, 28].forEach((bx) => {
        ctx.beginPath();
        ctx.arc(bx, 18, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'curiosity': {
      // --- CURIOSITY (2012) ---
      // Heavy car-sized chassis
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(-24, -8, 48, 17);

      // High Mastcam & ChemCam laser
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(14, -8);
      ctx.lineTo(14, -28);
      ctx.stroke();

      // ChemCam Head box
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(9, -32, 12, 8);
      ctx.fillStyle = '#EF4444'; // Red rock-zapping laser lens
      ctx.beginPath();
      ctx.arc(15, -28, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // RTG Nuclear Power Generator with radiator fins on back
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-28, -14, 10, 11);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      for (let fin = -13; fin <= -4; fin += 3) {
        ctx.beginPath();
        ctx.moveTo(-28, fin);
        ctx.lineTo(-18, fin);
        ctx.stroke();
      }

      // Robotic Arm with drill
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(18, 4);
      ctx.lineTo(28, 10);
      ctx.lineTo(33, 16);
      ctx.stroke();

      // Heavy 6 wheels with Morse code JPL holes
      ctx.fillStyle = '#334155';
      [-18, 0, 18].forEach((wx) => {
        ctx.beginPath();
        ctx.arc(wx, 14, 6.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // "Happy Birthday" musical notes floating in space
      ctx.fillStyle = '#FB7185';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('♪', -14, -22 + Math.sin(time * 0.005) * 3);
      ctx.fillText('♫', -2, -28 + Math.cos(time * 0.004) * 3);
      break;
    }

    case 'perseverance-ingenuity': {
      // --- PERSEVERANCE & INGENUITY (2021) ---
      // Percy Rover Chassis
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-24, -8, 48, 17);

      // SuperCam Mast
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(14, -8);
      ctx.lineTo(14, -28);
      ctx.stroke();
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(9, -32, 12, 8);

      // Wheels
      ctx.fillStyle = '#334155';
      [-18, 0, 18].forEach((wx) => {
        ctx.beginPath();
        ctx.arc(wx, 14, 6.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // INGENUITY HELICOPTER ("Ginny") Hovering with Realistic Motion Blur
      const ginnyX = 42;
      const ginnyY = -24 + Math.sin(time * 0.006) * 5;

      // Ginny Shadow on ground
      ctx.fillStyle = 'rgba(67, 20, 7, 0.4)';
      ctx.beginPath();
      ctx.ellipse(ginnyX, 18, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fuselage cube
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(ginnyX - 6, ginnyY - 5, 12, 10);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1;
      ctx.strokeRect(ginnyX - 6, ginnyY - 5, 12, 10);

      // Solar Panel atop rotors
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(ginnyX - 8, ginnyY - 9, 16, 4);

      // Dual Counter-Rotating Carbon Fiber Rotors
      const rotorSpan = Math.cos(rotorAngle) * 18;
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ginnyX - rotorSpan, ginnyY - 11);
      ctx.lineTo(ginnyX + rotorSpan, ginnyY - 11);
      ctx.stroke();

      const lowerRotorSpan = Math.cos(-rotorAngle * 1.05) * 18;
      ctx.beginPath();
      ctx.moveTo(ginnyX - lowerRotorSpan, ginnyY - 8);
      ctx.lineTo(ginnyX + lowerRotorSpan, ginnyY - 8);
      ctx.stroke();

      // Slender Carbon Fiber Landing Legs
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ginnyX - 5, ginnyY + 5);
      ctx.lineTo(ginnyX - 11, ginnyY + 15);
      ctx.moveTo(ginnyX + 5, ginnyY + 5);
      ctx.lineTo(ginnyX + 11, ginnyY + 15);
      ctx.stroke();
      break;
    }
  }

  // Storybook Parchment Mission Label
  ctx.fillStyle = isDiscovered ? '#34D399' : '#FBBF24';
  ctx.font = 'bold 11px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(relic.name, 0, -38);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillText(`(${relic.year})`, 0, -26);

  ctx.restore();
}

function drawAestheticAstronaut(
  ctx: CanvasRenderingContext2D,
  player: { x: number; y: number; walkCycle: number; facing: string; isMoving: boolean },
  suitColor: SuitColor,
  time: number,
  body: CelestialBody
) {
  const { x, y, walkCycle, facing } = player;
  const palette = SUIT_COLORS[suitColor];

  ctx.save();
  ctx.translate(x, y);

  // Astronaut Drop Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const legSwing = Math.sin(walkCycle) * 6;
  const bodyBob = Math.abs(Math.sin(walkCycle)) * 3.5;

  // 1. PLSS Life Support Backpack
  ctx.fillStyle = palette.shade;
  ctx.beginPath();
  ctx.roundRect(-16, -16 - bodyBob, 9, 20, 3);
  ctx.fill();

  // Backpack LED Status Ring
  ctx.fillStyle = Math.sin(time * 0.007) > 0 ? '#10B981' : '#059669';
  ctx.beginPath();
  ctx.arc(-11.5, -12 - bodyBob, 2, 0, Math.PI * 2);
  ctx.fill();

  // 2. Cute Legs & Apollo Overshoes
  ctx.fillStyle = palette.main;
  ctx.fillRect(-10, 4 - bodyBob + (player.isMoving ? legSwing : 0), 8, 11);
  ctx.fillRect(2, 4 - bodyBob - (player.isMoving ? legSwing : 0), 8, 11);

  // Ribbed Boots with Apollo Waffle Tread sole
  ctx.fillStyle = palette.shade;
  ctx.beginPath();
  ctx.ellipse(-6, 15 - bodyBob + (player.isMoving ? legSwing : 0), 5.5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 15 - bodyBob - (player.isMoving ? legSwing : 0), 5.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Cute Spacesuit Torso with Fabric Seams
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.roundRect(-13, -11 - bodyBob, 26, 17, 8);
  ctx.fill();

  // Fabric Seam lines (Storybook illustration detail)
  ctx.strokeStyle = palette.fabricSeam;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-12, -4 - bodyBob);
  ctx.lineTo(12, -4 - bodyBob);
  ctx.stroke();

  // Mission Chest Badge
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(-3, -2 - bodyBob, 3, 0, Math.PI * 2);
  ctx.fill();

  // 4. Arms
  ctx.fillStyle = palette.main;
  if (facing === 'left') {
    ctx.fillRect(-15, -8 - bodyBob - legSwing * 0.5, 6, 12);
  } else {
    ctx.fillRect(10, -8 - bodyBob + legSwing * 0.5, 6, 12);
  }

  // 5. Chubby Round Helmet with Texture
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.arc(0, -19 - bodyBob, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.shade;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 6. Translucent Gold Mirror Visor with Horizon Reflection
  ctx.fillStyle = palette.visor;
  ctx.beginPath();
  const visorX = facing === 'left' ? -3 : facing === 'right' ? 3 : 0;
  ctx.ellipse(visorX, -18 - bodyBob, 11, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Celestial reflection on visor (Earth reflection if on Moon, Martian hills if on Mars!)
  ctx.fillStyle = body === 'moon' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(249, 115, 22, 0.45)';
  ctx.beginPath();
  ctx.arc(visorX + 2, -18 - bodyBob, 4, 0, Math.PI);
  ctx.fill();

  // Visor Sun glint
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.ellipse(visorX + 4, -20 - bodyBob, 4, 2.2, -Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Cute Cheek Blush
  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.beginPath();
  ctx.arc(visorX - 5.5, -14 - bodyBob, 2.2, 0, Math.PI * 2);
  ctx.arc(visorX + 5.5, -14 - bodyBob, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCompanionBot(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);

  // Floating Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 9, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spherical porcelain white drone body
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Cute face visor
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Happy cyan LED eyes (^.^)
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(-2.8, -0.5, 1.3, 0, Math.PI * 2);
  ctx.arc(2.8, -0.5, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Antenna with glowing heart
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.lineTo(0, -17);
  ctx.stroke();

  ctx.fillStyle = Math.sin(time * 0.007) > 0 ? '#F43F5E' : '#FB7185';
  ctx.beginPath();
  ctx.arc(0, -18, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawDustMotes(ctx: CanvasRenderingContext2D, motes: DustMote[], time: number) {
  motes.forEach((mote) => {
    ctx.save();
    const pulse = Math.sin(time * 0.003 + mote.pulsePhase) * 0.3 + 0.7;
    ctx.globalAlpha = mote.alpha * pulse;
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawInteractionPrompt(
  ctx: CanvasRenderingContext2D,
  relic: SpaceRelic,
  x: number,
  y: number,
  isCataloged: boolean
) {
  ctx.save();
  ctx.translate(x, y);

  const text = isCataloged ? `Talk to ${relic.name}` : `Talk to ${relic.name} [Space]`;

  ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
  const textWidth = ctx.measureText(text).width;
  const padX = 14;
  const padY = 7;

  // Warm storybook parchment bubble
  ctx.fillStyle = isCataloged ? 'rgba(15, 23, 42, 0.95)' : 'rgba(217, 119, 6, 0.95)';
  ctx.beginPath();
  ctx.roundRect(-textWidth / 2 - padX, -16 - padY, textWidth + padX * 2, 28, 14);
  ctx.fill();

  // Pointer tip
  ctx.beginPath();
  ctx.moveTo(-5, 5);
  ctx.lineTo(5, 5);
  ctx.lineTo(0, 10);
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.strokeStyle = isCataloged ? '#34D399' : '#FDE68A';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, -2);

  ctx.restore();
}
