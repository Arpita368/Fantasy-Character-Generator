import React, { useState, useRef } from 'react';
import { Character, CharacterClass } from '../types/character';
import { CLASS_DEFINITIONS, RACE_MODIFIERS } from '../data/fantasyData';
import { soundManager } from '../utils/audio';
import { 
  Layers, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  Eye, 
  Heart, 
  Droplet, 
  Sword, 
  Sparkles, 
  Award, 
  PlusCircle, 
  Swords, 
  Check, 
  FileJson,
  X
} from 'lucide-react';

interface DeckViewProps {
  deck: Character[];
  onSelectCharacter: (char: Character) => void;
  onRemoveFromDeck: (id: string) => void;
  onClearDeck: () => void;
  onImportDeck: (chars: Character[]) => void;
  onAddSampleCharacters: () => void;
  onNavigateToForge: () => void;
  onNavigateToBattle: (charId?: string) => void;
}

export const DeckView: React.FC<DeckViewProps> = ({
  deck,
  onSelectCharacter,
  onRemoveFromDeck,
  onClearDeck,
  onImportDeck,
  onAddSampleCharacters,
  onNavigateToForge,
  onNavigateToBattle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDeck = deck.filter((char) => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.characterClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.race.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || char.characterClass === classFilter;
    return matchesSearch && matchesClass;
  });

  // Export entire deck as JSON
  const handleExportDeck = () => {
    try {
      soundManager.playChime();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(deck, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `eldoria_deck_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Failed to export deck:', err);
    }
  };

  // Import deck from JSON file
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].name) {
          onImportDeck(parsed as Character[]);
          soundManager.playVictoryFanfare();
          setImportStatus(`Successfully imported ${parsed.length} characters into your deck!`);
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus('Invalid deck JSON format.');
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err) {
        setImportStatus('Error parsing deck JSON file.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-amber-300 border-amber-400 bg-amber-950/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'Epic': return 'text-purple-300 border-purple-400 bg-purple-950/80 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
      case 'Rare': return 'text-sky-300 border-sky-400 bg-sky-950/80';
      default: return 'text-stone-300 border-stone-600 bg-stone-900/80';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Deck Header & Collection Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-amber-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="font-uncial text-2xl sm:text-3xl font-bold text-amber-200">
              My Deck & Vault
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-stone-400">
            {deck.length} {deck.length === 1 ? 'card' : 'cards'} stored in your alchemical grimoire (persisted across sessions).
          </p>
        </div>

        {/* Global Deck Actions (Export, Import, Clear, Add Sample) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Deck Button */}
          <button
            onClick={handleExportDeck}
            disabled={deck.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase bg-stone-900 border border-amber-600/60 hover:bg-amber-600/20 hover:border-amber-400 text-amber-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
            title="Download your entire deck as a JSON file"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Deck</span>
          </button>

          {/* Import Deck Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase bg-stone-900 border border-stone-700 hover:border-amber-500 hover:text-amber-200 text-stone-300 transition-all cursor-pointer shadow-sm"
            title="Import characters from an eldoria JSON file"
          >
            <Upload className="w-4 h-4 text-stone-400" />
            <span>Import Deck</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFileChange}
            className="hidden"
          />

          {deck.length > 0 && (
            <button
              onClick={onClearDeck}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-cinzel text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/60 transition-colors cursor-pointer"
              title="Delete all cards in your deck"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Deck</span>
            </button>
          )}
        </div>
      </div>

      {/* Import Status Alert Banner */}
      {importStatus && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-cinzel flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400" />
            <span>{importStatus}</span>
          </div>
          <button onClick={() => setImportStatus(null)} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      {deck.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-stone-950/80 p-3 rounded-xl border border-amber-900/40">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Filter by name, race, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger', 'Paladin'].map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-2.5 py-1 rounded-lg text-xs font-cinzel whitespace-nowrap transition-colors cursor-pointer ${
                  classFilter === cls
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/70 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-900'
                }`}
              >
                {cls === 'all' ? 'All Classes' : cls}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {deck.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl bg-stone-950/80 border-2 border-dashed border-amber-900/50 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-amber-950/40 border-2 border-amber-600/40 flex items-center justify-center mb-4 shadow-xl">
            <Layers className="w-10 h-10 text-amber-400/60" />
          </div>
          <h3 className="font-uncial text-2xl font-bold text-amber-200 mb-2">
            Your Card Deck is Empty
          </h3>
          <p className="font-body text-stone-400 max-w-md text-base leading-relaxed mb-6">
            Forge characters in the alchemist's workshop and click <strong className="text-amber-300">"Save to Deck"</strong> to preserve your favorite heroes, or import an existing deck file.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToForge}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-stone-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg hover:from-amber-300 hover:to-yellow-400 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Forge Your First Character</span>
            </button>
            <button
              onClick={onAddSampleCharacters}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 border border-amber-600/60 text-amber-300 font-cinzel font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Add Starter Champions</span>
            </button>
          </div>
        </div>
      ) : filteredDeck.length === 0 ? (
        <div className="py-16 text-center text-stone-500 font-cinzel text-sm">
          No saved character cards matched your search filter.
        </div>
      ) : (
        /* SAVED CHARACTERS GRID (SMALL CARDS IN A GRID) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeck.map((char) => {
            const classDef = CLASS_DEFINITIONS[char.characterClass];
            const imgUrl = char.currentPortraitStyle === 'cartoon' 
              ? char.cartoonPortraitUrl 
              : char.portraitUrl;

            // Mini stat percentages
            const hpPct = Math.min(100, Math.round((char.health / 200) * 100));
            const mpPct = Math.min(100, Math.round((char.mana / 230) * 100));
            const strPct = Math.min(100, Math.round((char.strength / 125) * 100));
            const intPct = Math.min(100, Math.round((char.intelligence / 125) * 100));
            const chaPct = Math.min(100, Math.round((char.charisma / 120) * 100));

            return (
              <div
                key={char.id}
                className="group relative rounded-2xl bg-stone-900/90 border-2 border-amber-900/60 hover:border-amber-500/80 p-4 transition-all duration-200 shadow-xl flex flex-col justify-between hover:shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              >
                <div>
                  {/* Top Header: Rarity & Quick Actions */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold uppercase border ${getRarityBadgeColor(char.rarity)}`}>
                      {char.rarity}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Delete Button on Each Saved Card */}
                      <button
                        onClick={() => onRemoveFromDeck(char.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/50 transition-colors cursor-pointer"
                        title="Delete card from My Deck"
                        aria-label={`Delete ${char.name} from deck`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: Portrait & Metadata */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-600/50 shrink-0 bg-stone-950 shadow-md">
                      <img
                        src={imgUrl}
                        alt={char.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-uncial text-lg font-bold text-amber-100 truncate">
                        {char.name}
                      </h4>
                      <p className="font-medieval italic text-xs text-amber-300/80 truncate">
                        {char.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-cinzel text-stone-400 mt-1">
                        <span className="text-amber-400 font-semibold">{char.characterClass}</span>
                        <span>·</span>
                        <span className="text-stone-300">{char.race}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 truncate mt-0.5">
                        {char.primaryWeapon}
                      </p>
                    </div>
                  </div>

                  {/* Visual Progress Bars for the 5 Stats */}
                  <div className="space-y-1.5 bg-stone-950/70 p-2.5 rounded-xl border border-stone-800 text-[11px] font-mono mb-3">
                    {/* HP & MP */}
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-red-500" />
                        <span>{char.health} HP</span>
                      </span>
                      <span className="text-sky-400 font-bold flex items-center gap-1">
                        <Droplet className="w-3 h-3 fill-sky-500" />
                        <span>{char.mana} MP</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${hpPct}%` }} />
                      </div>
                      <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${mpPct}%` }} />
                      </div>
                    </div>

                    {/* STR, INT, CHA */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400">
                      <span>STR: <strong className="text-amber-300">{char.strength}</strong></span>
                      <span>INT: <strong className="text-purple-300">{char.intelligence}</strong></span>
                      <span>CHA: <strong className="text-rose-300">{char.charisma}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Click to View Full, Fight in Arena) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/80">
                  <button
                    onClick={() => onSelectCharacter(char)}
                    className="w-full py-2 px-3 rounded-lg bg-stone-950 text-amber-300 border border-amber-600/60 hover:bg-amber-600/20 text-xs font-cinzel font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Load this character to view full card"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full</span>
                  </button>

                  <button
                    onClick={() => onNavigateToBattle(char.id)}
                    className="w-full py-2 px-3 rounded-lg bg-stone-900 text-stone-200 border border-stone-700 hover:border-amber-400 hover:text-amber-200 text-xs font-cinzel font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Pick for duel in Battle Arena"
                  >
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Duel</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
