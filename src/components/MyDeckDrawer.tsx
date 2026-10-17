import React, { useState } from 'react';
import { Character } from '../types/character';
import { CLASS_DEFINITIONS } from '../data/fantasyData';
import { 
  X, 
  Trash2, 
  ArrowUpRight, 
  Layers, 
  Shield, 
  Heart, 
  Droplet, 
  Sword, 
  Search,
  Sparkles,
  Award
} from 'lucide-react';

interface MyDeckDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Character[];
  activeCharacterId?: string;
  onSelectCharacter: (char: Character) => void;
  onRemoveFromDeck: (id: string) => void;
  onClearDeck: () => void;
}

export const MyDeckDrawer: React.FC<MyDeckDrawerProps> = ({
  isOpen,
  onClose,
  deck,
  activeCharacterId,
  onSelectCharacter,
  onRemoveFromDeck,
  onClearDeck,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredDeck = deck.filter((char) => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.characterClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.race.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || char.characterClass === classFilter;
    return matchesSearch && matchesClass;
  });

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-amber-300 border-amber-400 bg-amber-950/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'Epic': return 'text-purple-300 border-purple-400 bg-purple-950/80 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
      case 'Rare': return 'text-sky-300 border-sky-400 bg-sky-950/80';
      default: return 'text-stone-300 border-stone-600 bg-stone-900/80';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-stone-950 border-l-2 border-amber-700/60 h-full flex flex-col p-6 shadow-2xl text-stone-200 overflow-hidden"
        role="dialog"
        aria-label="My Deck - Saved Character Cards"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-600/50">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-uncial text-xl font-bold text-amber-200">
                My Deck
              </h2>
              <p className="text-[11px] font-cinzel text-amber-500/80">
                {deck.length} {deck.length === 1 ? 'Card' : 'Cards'} in Collection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
            aria-label="Close My Deck"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        {deck.length > 0 && (
          <div className="pt-3 pb-2 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search deck by name, race, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-900/90 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600/60"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-[340px]">
                {['all', 'Mage', 'Warrior', 'Rogue', 'Cleric', 'Ranger', 'Paladin'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setClassFilter(cls)}
                    className={`px-2 py-0.5 rounded text-[11px] font-cinzel whitespace-nowrap transition-colors ${
                      classFilter === cls
                        ? 'bg-amber-600/30 text-amber-200 border border-amber-500/60'
                        : 'text-stone-400 hover:text-stone-200 bg-stone-900'
                    }`}
                  >
                    {cls === 'all' ? 'All' : cls}
                  </button>
                ))}
              </div>

              <button
                onClick={onClearDeck}
                className="text-[11px] font-cinzel text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
              >
                Clear Deck
              </button>
            </div>
          </div>
        )}

        {/* Deck Cards List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-2">
          {deck.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <Layers className="w-12 h-12 mb-3 stroke-[1.5] text-amber-600/30" />
              <p className="font-uncial text-lg font-semibold text-amber-200/80">
                Your Deck is Empty
              </p>
              <p className="text-xs text-stone-400 max-w-xs mt-1.5 font-body">
                Click <span className="text-amber-300 font-semibold">"Save to Deck"</span> on any generated character card to build your personalized champion roster.
              </p>
            </div>
          ) : filteredDeck.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-center text-stone-500 text-xs font-cinzel">
              No character cards matched your search filter.
            </div>
          ) : (
            filteredDeck.map((char) => {
              const classDef = CLASS_DEFINITIONS[char.characterClass];
              const isActive = activeCharacterId === char.id;
              const imgUrl = char.currentPortraitStyle === 'cartoon' 
                ? char.cartoonPortraitUrl 
                : char.portraitUrl;

              return (
                <div
                  key={char.id}
                  className={`group relative rounded-xl border-2 p-3 flex gap-3.5 items-center transition-all ${
                    isActive
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/50'
                      : 'bg-stone-900/85 border-stone-800 hover:border-amber-700/60 hover:bg-stone-900'
                  }`}
                >
                  {/* Miniature Card Portrait with Rarity Trim */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-amber-600/50 shrink-0 bg-stone-950 shadow-md">
                    <img
                      src={imgUrl}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-cinzel font-bold border leading-tight backdrop-blur-xs">
                      <span className={`px-1 py-0.2 rounded ${getRarityBadgeColor(char.rarity)}`}>
                        {char.rarity[0]}
                      </span>
                    </div>
                  </div>

                  {/* Card Details & Core Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-uncial text-base font-bold text-amber-200 truncate">
                        {char.name}
                      </h4>
                      {isActive && (
                        <span className="text-[9px] font-cinzel uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-amber-300/80 italic truncate font-medieval">
                      {char.title}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-stone-400 font-cinzel mt-1">
                      <span className="text-amber-400 font-semibold">{char.characterClass}</span>
                      <span>·</span>
                      <span className="text-stone-300 font-medium">{char.race}</span>
                      <span className="text-[10px] text-amber-500/70">({char.raceBonusDescription || ''})</span>
                    </div>

                    {/* All 5 Vitals Badges: Health, Mana, Strength, Intelligence, Charisma */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono tabular-nums">
                      <span className="flex items-center gap-0.5 text-red-400" title="Health">
                        <Heart className="w-3 h-3 fill-red-500/30 text-red-400" />
                        <span className="font-bold">{char.health} HP</span>
                      </span>
                      <span className="flex items-center gap-0.5 text-sky-400" title="Mana">
                        <Droplet className="w-3 h-3 fill-sky-500/30 text-sky-400" />
                        <span className="font-bold">{char.mana} MP</span>
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400" title="Strength">
                        <Sword className="w-3 h-3 text-amber-400" />
                        <span className="font-bold">{char.strength} STR</span>
                      </span>
                      <span className="flex items-center gap-0.5 text-purple-400" title="Intelligence">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="font-bold">{char.intelligence} INT</span>
                      </span>
                      <span className="flex items-center gap-0.5 text-rose-400" title="Charisma">
                        <Award className="w-3 h-3 text-rose-400" />
                        <span className="font-bold">{char.charisma} CHA</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectCharacter(char);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/50 transition-colors"
                      title="Load card into player card viewer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFromDeck(char.id)}
                      className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors"
                      title="Remove from My Deck"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-cinzel font-bold tracking-wider uppercase bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl transition-colors cursor-pointer"
          >
            Return to Card Table
          </button>
        </div>
      </div>
    </div>
  );
};
