import React, { useState } from 'react';
import { SpaceRelic } from '../types/game';
import { X, Trophy, Sparkles, CheckCircle2, Lock, Calendar, MapPin, Award, Image as ImageIcon } from 'lucide-react';

interface MuseumModalProps {
  relics: SpaceRelic[];
  discoveredRelicIds: string[];
  onClose: () => void;
  onOpenRelic: (relic: SpaceRelic) => void;
}

export const MuseumModal: React.FC<MuseumModalProps> = ({
  relics,
  discoveredRelicIds,
  onClose,
  onOpenRelic,
}) => {
  const [filter, setFilter] = useState<'all' | 'moon' | 'mars' | 'gallery'>('all');
  const [selectedRelic, setSelectedRelic] = useState<SpaceRelic>(relics[0]);

  const filteredRelics = relics.filter((r) => filter === 'all' || r.body === filter);
  const totalCount = relics.length;
  const discoveredCount = discoveredRelicIds.length;
  const isAllCollected = discoveredCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Cosmic Field Museum & Archives</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Relics Discovered:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {discoveredCount} / {totalCount}
                </span>
                <span>·</span>
                <span className="font-medium text-slate-300">{Math.round((discoveredCount / totalCount) * 100)}% Complete</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar & Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Relics ({totalCount})
            </button>
            <button
              onClick={() => setFilter('moon')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'moon' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Moon Missions 🌕 (3)
            </button>
            <button
              onClick={() => setFilter('mars')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'mars' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mars Missions 🔴 (4)
            </button>
            <button
              onClick={() => setFilter('gallery')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                filter === 'gallery' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Field Art Journal</span>
            </button>
          </div>

          {/* Master Explorer Badge Pill */}
          {isAllCollected && (
            <div className="flex items-center gap-2 text-xs bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full shadow-sm">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">Master Cosmic Archaeologist Certified!</span>
            </div>
          )}
        </div>

        {/* Content View */}
        {filter === 'gallery' ? (
          // Field Art Journal Gallery
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                Visual Field Journal
              </span>
              <h3 className="text-xl font-bold text-white font-display mt-0.5">
                Storybook Realistic Illustrations
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Hand-crafted gouache and textured children’s book art documenting historic lunar and Martian expeditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Apollo 11 Storybook Painting */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src="/src/assets/images/apollo_lander_storybook_1794455201883.jpg"
                    alt="Apollo 11 Lunar Module Eagle"
                    className="w-full h-full object-cover filter saturate-[1.05] hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-display">Lunar Module Eagle (1969)</span>
                    <span className="text-[10px] font-mono text-slate-400">Sea of Tranquility</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The textured golden foil descent stage, American flag, and the iconic waffle boot prints forever preserved in the lunar regolith beneath a radiant Earth.
                  </p>
                </div>
              </div>

              {/* Mars Rovers Storybook Painting */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src="/src/assets/images/mars_rovers_storybook_1794455200903.jpg"
                    alt="Perseverance & Ingenuity on Mars"
                    className="w-full h-full object-cover filter saturate-[1.05] hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-display">Percy & Ginny (2021)</span>
                    <span className="text-[10px] font-mono text-slate-400">Jezero Crater Delta</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Perseverance rover carving ribbed wheel tracks through warm apricot dunes, alongside Ingenuity helicopter with dual carbon-fiber rotor blades.
                  </p>
                </div>
              </div>

              {/* Cosmic Explorer Badge Medal */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl md:col-span-2 flex flex-col sm:flex-row items-center p-4 gap-4">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border border-amber-400/40 shrink-0">
                  <img
                    src="/src/assets/images/space_relics_badge_1794455200903.jpg"
                    alt="Cosmic Badge"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/space_relics_badge_1794453537899.jpg';
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                    Explorer Honors Medal
                  </span>
                  <h4 className="text-base font-bold text-white font-display">
                    Humanity's Heritage Beyond Earth
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    From Apollo 11's first steps in 1969 to Ingenuity's historic flights in 2021, these seven missions represent human curiosity and peaceful scientific exploration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Standard Relic Cards Split View
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Grid: Artifact cards */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-max">
              {filteredRelics.map((r) => {
                const isFound = discoveredRelicIds.includes(r.id);
                const isSelected = selectedRelic.id === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRelic(r)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-slate-800/90 shadow-lg shadow-amber-500/10'
                        : isFound
                        ? 'border-slate-700/80 bg-slate-800/40 hover:bg-slate-800/70'
                        : 'border-slate-800/60 bg-slate-950/40 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{r.body === 'moon' ? '🌕' : '🔴'}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight font-display">{r.name}</h4>
                          <span className="text-[11px] font-mono text-amber-400/90 font-medium">{r.year}</span>
                        </div>
                      </div>

                      {isFound ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {r.cutesyNickname}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 truncate max-w-[130px]">{r.landingSite}</span>
                      <span className={isFound ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                        {isFound ? 'Cataloged' : 'Not yet visited'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Panel: Selected Artifact Detailed Dossier */}
            <div className="md:col-span-5 bg-slate-950/75 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                    Mission Dossier · {selectedRelic.body.toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      discoveredRelicIds.includes(selectedRelic.id)
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {discoveredRelicIds.includes(selectedRelic.id) ? 'Cataloged' : 'Awaiting Visit'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-display mt-2">{selectedRelic.name}</h3>
                <p className="text-xs text-amber-300 font-medium italic mt-0.5">
                  "{selectedRelic.cutesyNickname}"
                </p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Launch: <strong className="text-white">{selectedRelic.earthLaunchDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Site: <strong className="text-white">{selectedRelic.landingSite}</strong></span>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
                    <strong className="text-slate-100 block mb-1">Key Scientific Milestone:</strong>
                    {selectedRelic.primaryDiscovery}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{selectedRelic.detailedLore}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenRelic(selectedRelic);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{discoveredRelicIds.includes(selectedRelic.id) ? 'Review Mission Quiz' : 'Take Mission Quiz Now'}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
