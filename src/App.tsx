import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Character, 
  CharacterClass,
  CharacterRace,
  LockState
} from './types/character';
import { 
  generateCharacter,
  generateCharacterWithLocks,
  CLASS_DEFINITIONS,
  GAME_AURAS,
  generateUniqueBackstory,
  generateQuestHook,
  RACES,
  RACE_MODIFIERS
} from './data/fantasyData';
import { CharacterCard } from './components/CharacterCard';
import { DeckView } from './components/DeckView';
import { BattleArena } from './components/BattleArena';
import { HowToPlayModal } from './components/HowToPlayModal';
import { soundManager } from './utils/audio';
import { 
  Dices, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Layers, 
  History, 
  Compass, 
  Gamepad2, 
  RefreshCw, 
  FlaskConical, 
  Sparkle, 
  Feather, 
  Check, 
  Users, 
  ChevronDown, 
  Lock, 
  Unlock,
  Swords,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  X
} from 'lucide-react';

const CLASS_OPTIONS: { id: CharacterClass | 'all'; label: string }[] = [
  { id: 'all', label: 'All Classes' },
  { id: 'Warrior', label: 'Warrior' },
  { id: 'Mage', label: 'Mage' },
  { id: 'Rogue', label: 'Rogue' },
  { id: 'Cleric', label: 'Cleric' },
  { id: 'Ranger', label: 'Ranger' },
  { id: 'Paladin', label: 'Paladin' },
];

const RACE_OPTIONS: { id: CharacterRace | 'all'; label: string; badge: string; desc: string }[] = [
  { id: 'all', label: 'Random Race', badge: '🎲 Any', desc: 'Random Ancestry' },
  { id: 'Human', label: 'Human', badge: '🛡️ Versatile', desc: '+10 HP, +10 MP, +5 All' },
  { id: 'Elf', label: 'Elf', badge: '✨ Arcane', desc: '+30 MP, +15 INT, -10 STR, -10 HP' },
  { id: 'Dwarf', label: 'Dwarf', badge: '⚒️ Sturdy', desc: '+35 HP, +15 STR, -20 MP, -8 CHA' },
  { id: 'Orc', label: 'Orc', badge: '🪓 Mighty', desc: '+25 STR, +20 HP, -25 MP, -12 INT' },
  { id: 'Halfling', label: 'Halfling', badge: '🍀 Lucky', desc: '+20 CHA, +15 MP, -18 STR, -5 HP' },
];

type AppTab = 'forge' | 'deck' | 'battle';

interface GenerationError {
  title: string;
  message: string;
  onRetry: () => void;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('forge');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | 'all'>('all');
  const [selectedRace, setSelectedRace] = useState<CharacterRace | 'all'>('all');
  const [character, setCharacter] = useState<Character | null>(null);
  
  // Generation & Loading States
  const [isRolling, setIsRolling] = useState(false);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [isGeneratingQuestHook, setIsGeneratingQuestHook] = useState(false);
  const [generationError, setGenerationError] = useState<GenerationError | null>(null);

  // Sound, Help Modal & Deck State
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [myDeck, setMyDeck] = useState<Character[]>([]);
  const [history, setHistory] = useState<Character[]>([]);

  // Lock State: Name, Class, Race, Stats
  const [locks, setLocks] = useState<LockState>({
    name: false,
    class: false,
    race: false,
    stats: false,
  });

  const isBusy = isRolling || isGeneratingPortrait || isGeneratingBackstory || isGeneratingQuestHook;

  // Load saved cards from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('eldoria_player_deck') || localStorage.getItem('eldoria_saved_characters');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMyDeck(parsed);
        }
      }
    } catch {
      // Storage unavailable
    }
    // Generate initial character
    try {
      const initialChar = generateCharacter();
      setCharacter(initialChar);
      setHistory([initialChar]);
    } catch (err) {
      setGenerationError({
        title: 'Initial Conjuration Failed',
        message: 'Could not forge starting adventurer. Check leyline connectivity.',
        onRetry: () => rollNewCharacter('all', 'all', false),
      });
    }
  }, []);

  const saveToLocalStorage = (chars: Character[]) => {
    try {
      localStorage.setItem('eldoria_player_deck', JSON.stringify(chars));
    } catch {
      // Ignore storage errors
    }
  };

  const handleToggleLock = (key: keyof LockState) => {
    setLocks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      soundManager.playChime();
      return next;
    });
  };

  const handleUnlockAll = () => {
    setLocks({
      name: false,
      class: false,
      race: false,
      stats: false,
    });
    soundManager.playChime();
  };

  // Roll new character with full error handling and retry support
  const rollNewCharacter = useCallback((
    forcedClassOption?: CharacterClass | 'all', 
    forcedRaceOption?: CharacterRace | 'all', 
    playFx = true
  ) => {
    if (isBusy) return;
    setGenerationError(null);

    const classToUse = forcedClassOption !== undefined ? forcedClassOption : selectedClass;
    const targetClass = classToUse === 'all' ? undefined : classToUse;

    const raceToUse = forcedRaceOption !== undefined ? forcedRaceOption : selectedRace;
    const targetRace = raceToUse === 'all' ? undefined : raceToUse;
    
    setIsRolling(true);
    if (playFx) {
      soundManager.playDiceRoll();
    }

    setTimeout(() => {
      try {
        const nextChar = generateCharacterWithLocks(character, locks, targetClass, targetRace);
        setCharacter(nextChar);
        setHistory(prev => [nextChar, ...prev.slice(0, 9)]);
        setIsRolling(false);
        if (playFx) {
          soundManager.playChime();
        }
      } catch (err) {
        setIsRolling(false);
        setGenerationError({
          title: 'Character Generation Disrupted',
          message: 'The celestial runes were unstable. Would you like to re-forge the adventurer?',
          onRetry: () => rollNewCharacter(forcedClassOption, forcedRaceOption, playFx),
        });
      }
    }, 280);
  }, [character, locks, selectedClass, selectedRace, isBusy]);

  // Spacebar keyboard shortcut to roll in Forge tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'forge' && !isBusy && e.code === 'Space' && (e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'SELECT') {
        e.preventDefault();
        rollNewCharacter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isBusy, rollNewCharacter]);

  const handleToggleSound = () => {
    const enabled = soundManager.toggleSound();
    setSoundEnabled(enabled);
  };

  // Save to Deck toggle handler
  const handleSaveToDeck = (char: Character) => {
    setMyDeck(prev => {
      const exists = prev.some(c => c.id === char.id);
      let updated: Character[];
      if (exists) {
        updated = prev.filter(c => c.id !== char.id);
      } else {
        updated = [char, ...prev];
        soundManager.playChime();
      }
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const handleRemoveFromDeck = (id: string) => {
    setMyDeck(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const handleClearDeck = () => {
    setMyDeck([]);
    saveToLocalStorage([]);
    soundManager.playChime();
  };

  const handleImportDeck = (importedCards: Character[]) => {
    setMyDeck(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const newAdditions = importedCards.filter(c => !existingIds.has(c.id));
      const merged = [...newAdditions, ...prev];
      saveToLocalStorage(merged);
      return merged;
    });
  };

  const handleAddSampleCharacters = () => {
    const warrior = generateCharacter('Warrior', 'Dwarf');
    const mage = generateCharacter('Mage', 'Elf');
    setMyDeck(prev => {
      const updated = [warrior, mage, ...prev];
      saveToLocalStorage(updated);
      return updated;
    });
    soundManager.playVictoryFanfare();
  };

  const handleRerollStats = () => {
    if (!character || isBusy) return;
    soundManager.playDiceRoll();
    try {
      const refreshed = generateCharacter(character.characterClass, character.race);
      setCharacter({
        ...character,
        stats: refreshed.stats,
        health: refreshed.health,
        maxHealth: refreshed.maxHealth,
        mana: refreshed.mana,
        maxMana: refreshed.maxMana,
        strength: refreshed.strength,
        intelligence: refreshed.intelligence,
        charisma: refreshed.charisma,
        primaryWeapon: refreshed.primaryWeapon,
        signatureAbility: refreshed.signatureAbility,
      });
      soundManager.playChime();
    } catch (err) {
      setGenerationError({
        title: 'Stat Reroll Failed',
        message: 'Could not recalculate attribute matrices.',
        onRetry: handleRerollStats,
      });
    }
  };

  const handleGenerateCartoonPortrait = () => {
    if (!character || isBusy) return;
    setGenerationError(null);
    setIsGeneratingPortrait(true);
    soundManager.playCartoonPowerUp();

    setTimeout(() => {
      try {
        setCharacter(prev => prev ? { ...prev, currentPortraitStyle: 'cartoon' } : null);
        setIsGeneratingPortrait(false);
      } catch (err) {
        setIsGeneratingPortrait(false);
        setGenerationError({
          title: 'Portrait Transmutation Failed',
          message: 'Unable to render cartoon art style. Re-aligning alchemical dyes.',
          onRetry: handleGenerateCartoonPortrait,
        });
      }
    }, 280);
  };

  const handleRegenerateCartoonPortrait = () => {
    if (!character || isBusy) return;
    setGenerationError(null);
    setIsGeneratingPortrait(true);
    soundManager.playCartoonPowerUp();

    setTimeout(() => {
      try {
        const auras = GAME_AURAS[character.characterClass];
        const nextAura = auras[Math.floor(Math.random() * auras.length)];
        setCharacter(prev => {
          if (!prev) return null;
          return {
            ...prev,
            currentPortraitStyle: 'cartoon',
            gameAura: nextAura,
            activeCartoonVariant: (prev.activeCartoonVariant + 1) % 4,
          };
        });
        setIsGeneratingPortrait(false);
      } catch (err) {
        setIsGeneratingPortrait(false);
        setGenerationError({
          title: 'Aura Regeneration Interrupted',
          message: 'Cosmic aura frequency was disrupted. Please try again.',
          onRetry: handleRegenerateCartoonPortrait,
        });
      }
    }, 280);
  };

  const handleSwitchToClassicPortrait = () => {
    if (!character || isBusy) return;
    soundManager.playChime();
    setCharacter(prev => prev ? { ...prev, currentPortraitStyle: 'classic' } : null);
  };

  // Backstory generation with error handling
  const handleGenerateBackstory = () => {
    if (!character || isBusy) return;
    setGenerationError(null);
    setIsGeneratingBackstory(true);
    soundManager.playQuillScratch();

    setTimeout(() => {
      try {
        const freshBackstory = generateUniqueBackstory(character);
        setCharacter(prev => prev ? { ...prev, lore: freshBackstory } : null);
        setIsGeneratingBackstory(false);
        soundManager.playChime();
      } catch (err) {
        setIsGeneratingBackstory(false);
        setGenerationError({
          title: 'Story Inscription Failed',
          message: 'The quill dried out before the chronicle could be recorded.',
          onRetry: handleGenerateBackstory,
        });
      }
    }, 260);
  };

  // Quest hook generation with error handling
  const handleGenerateQuestHook = () => {
    if (!character || isBusy) return;
    setGenerationError(null);
    setIsGeneratingQuestHook(true);
    soundManager.playQuestFanfare();

    setTimeout(() => {
      try {
        const freshQuest = generateQuestHook(character);
        setCharacter(prev => prev ? { ...prev, questHook: freshQuest } : null);
        setIsGeneratingQuestHook(false);
      } catch (err) {
        setIsGeneratingQuestHook(false);
        setGenerationError({
          title: 'Quest Hook Generation Failed',
          message: 'The scouting emissary could not locate an uncharted quest line.',
          onRetry: handleGenerateQuestHook,
        });
      }
    }, 260);
  };

  const isCurrentInDeck = character ? myDeck.some(c => c.id === character.id) : false;
  const isCartoonActive = character?.currentPortraitStyle === 'cartoon';
  const lockedCount = Object.values(locks).filter(Boolean).length;

  return (
    <div className="min-h-screen text-stone-200 flex flex-col relative selection:bg-amber-600/30 selection:text-amber-200 bg-stone-950 font-body">
      {/* Ancient Alchemist's Workbench Textured Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter contrast-125"
        style={{ backgroundImage: `url('/src/assets/images/alchemist_workbench_bg_1792256730245.jpg')` }}
        aria-hidden="true" 
      />

      {/* Atmospheric dark vignette and warm candlelight gradient */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(245,158,11,0.18),rgba(12,10,9,0.92)_70%)]" 
        aria-hidden="true" 
      />

      {/* Top Bar with Navigation Tabs, How to Play, & Sound Control */}
      <header className="sticky top-0 z-40 w-full border-b border-amber-900/60 bg-stone-950/95 backdrop-blur-md shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Name: Fantasy Character Generator */}
          <button 
            onClick={() => setActiveTab('forge')}
            className="font-cinzel text-base sm:text-xl font-bold tracking-wider text-amber-200 whitespace-nowrap shrink-0 hover:text-amber-100 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FlaskConical className="w-5 h-5 text-amber-500" />
            <span className="font-uncial tracking-wider text-amber-300">Fantasy Character Generator</span>
          </button>

          {/* Core Navigation Tabs: Forge, My Deck, Battle Arena */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-stone-900/80 p-1 rounded-xl border border-amber-900/50 shadow-inner">
            <button
              onClick={() => setActiveTab('forge')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'forge'
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-500/70 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline sm:inline">Forge</span>
            </button>

            <button
              onClick={() => setActiveTab('deck')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'deck'
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-500/70 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Deck ({myDeck.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('battle')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'battle'
                  ? 'bg-red-500/25 text-red-200 border border-red-500/70 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-red-400" />
              <span>Battle</span>
            </button>
          </nav>

          {/* Action Utilities: How to Play & Audio Mute Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* How to Play Help Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="inline-flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-amber-800/60 bg-stone-900/90 text-amber-300 hover:text-amber-100 hover:border-amber-500 transition-colors text-xs font-cinzel font-bold cursor-pointer"
              title="How to Play and feature guide"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">How to Play</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg border border-stone-800 bg-stone-900/90 text-stone-400 hover:text-amber-200 hover:border-amber-700/60 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute acoustics' : 'Unmute acoustics'}
              aria-label="Toggle audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        {/* GLOBAL FRIENDLY ERROR BANNER WITH RETRY BUTTON */}
        {generationError && (
          <div className="w-full max-w-3xl mb-6 p-4 rounded-2xl bg-red-950/90 border-2 border-red-500 text-stone-100 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-red-300">
                  {generationError.title}
                </h4>
                <p className="font-body text-xs sm:text-sm text-stone-300 mt-0.5">
                  {generationError.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={generationError.onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-800/80 hover:bg-red-700 text-stone-100 border border-red-400 text-xs font-cinzel font-bold uppercase tracking-wider shadow cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                onClick={() => setGenerationError(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-red-900/50 cursor-pointer"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: CARD FORGE */}
        {activeTab === 'forge' && (
          <div className="w-full flex flex-col items-center">
            {/* Title Header: Fantasy Character Generator */}
            <div className="text-center max-w-2xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-cinzel tracking-widest uppercase text-amber-500/90 mb-1.5">
                <Sparkle className="w-3.5 h-3.5 text-amber-500" />
                <span>Alchemist Workbench & Card Forge</span>
                <Sparkle className="w-3.5 h-3.5 text-amber-500" />
              </div>

              <h1 className="font-uncial text-3xl sm:text-5xl font-bold tracking-wide text-amber-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-balance">
                Fantasy Character Generator
              </h1>

              <p className="font-body italic text-sm sm:text-lg text-amber-200/80 mt-1.5">
                Forge bordered player cards with class-weighted stats. Lock traits, synthesize lore, and stage epic arena battles!
              </p>
            </div>

            {/* Generator Controls Toolbar: Race Dropdown, Class Tabs, Lock Indicators, and Action Buttons */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 mb-8">
              {/* Race Selection Dropdown & Class Filter Row */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {/* RACE DROPDOWN */}
                <div className="flex items-center gap-2 bg-stone-900/90 border border-amber-600/60 rounded-xl px-3 py-2 shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-cinzel text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Race:</span>
                  </span>
                  <div className="relative">
                    <select
                      value={selectedRace}
                      disabled={isBusy}
                      onChange={(e) => {
                        const nextRace = e.target.value as CharacterRace | 'all';
                        setSelectedRace(nextRace);
                        rollNewCharacter(selectedClass, nextRace, true);
                      }}
                      className="appearance-none bg-stone-950 text-amber-200 text-xs font-cinzel rounded-lg pl-3 pr-8 py-1.5 border border-amber-800/80 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Character Race Selection"
                    >
                      {RACE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id} className="bg-stone-950 text-amber-100 py-1">
                          {opt.label} — {opt.desc}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                  </div>
                </div>

                {/* Interactive Class Filter Tabs */}
                <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1 bg-stone-900/90 rounded-xl border border-amber-900/40 shadow-inner overflow-x-auto max-w-full">
                  {CLASS_OPTIONS.map((opt) => {
                    const isActive = selectedClass === opt.id;
                    return (
                      <button
                        key={opt.id}
                        disabled={isBusy}
                        onClick={() => {
                          setSelectedClass(opt.id);
                          rollNewCharacter(opt.id, selectedRace, true);
                        }}
                        className={`px-2.5 sm:px-3 py-1.5 text-xs font-cinzel font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          isActive
                            ? 'bg-amber-700/40 text-amber-200 border border-amber-500/70 shadow-sm'
                            : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ATTRIBUTE LOCK BAR: Quick overview of what is locked */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-cinzel">
                <span className="text-stone-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <span>Lock Attributes:</span>
                </span>

                {/* Name Lock */}
                <button
                  onClick={() => handleToggleLock('name')}
                  disabled={isBusy}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                    locks.name
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title={locks.name ? 'Name is locked' : 'Click to lock Name'}
                >
                  {locks.name ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-stone-500" />}
                  <span>Name</span>
                </button>

                {/* Class Lock */}
                <button
                  onClick={() => handleToggleLock('class')}
                  disabled={isBusy}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                    locks.class
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title={locks.class ? 'Class is locked' : 'Click to lock Class'}
                >
                  {locks.class ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-stone-500" />}
                  <span>Class</span>
                </button>

                {/* Race Lock */}
                <button
                  onClick={() => handleToggleLock('race')}
                  disabled={isBusy}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                    locks.race
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title={locks.race ? 'Race is locked' : 'Click to lock Race'}
                >
                  {locks.race ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-stone-500" />}
                  <span>Race</span>
                </button>

                {/* Stats Lock */}
                <button
                  onClick={() => handleToggleLock('stats')}
                  disabled={isBusy}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                    locks.stats
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title={locks.stats ? 'Stats are locked' : 'Click to lock Stats'}
                >
                  {locks.stats ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-stone-500" />}
                  <span>Stats</span>
                </button>

                {lockedCount > 0 && (
                  <button
                    onClick={handleUnlockAll}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline ml-1 cursor-pointer"
                  >
                    Reset Locks
                  </button>
                )}
              </div>

              {/* Action Buttons Toolbar with Loading Spinners */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                {/* Primary Prominent Generate Character Button */}
                <button
                  onClick={() => rollNewCharacter(selectedClass, selectedRace, true)}
                  disabled={isBusy}
                  className="relative px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-cinzel text-sm sm:text-base font-bold tracking-widest uppercase text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2 border-2 border-amber-200/60 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Dices className={`w-5 h-5 text-stone-900 transition-transform duration-300 ${isRolling ? 'rotate-180 scale-110 animate-spin' : 'group-hover:rotate-45'}`} />
                  <span>
                    {isRolling 
                      ? 'Conjuring Hero...' 
                      : lockedCount > 0 
                        ? `Generate (${lockedCount} Locked)` 
                        : 'Generate Character'}
                  </span>
                </button>

                {/* Save to Deck Button */}
                <button
                  onClick={() => character && handleSaveToDeck(character)}
                  disabled={!character || isBusy}
                  className={`px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrentInDeck
                      ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : 'bg-stone-900/90 text-amber-200 border-amber-500/60 hover:bg-stone-800 hover:text-amber-100'
                  }`}
                  title="Save current player card to My Deck"
                >
                  {isCurrentInDeck ? <Check className="w-4 h-4 text-stone-950 stroke-[2.5]" /> : <Layers className="w-4 h-4 text-amber-400" />}
                  <span>{isCurrentInDeck ? 'In Deck' : 'Save to Deck'}</span>
                </button>

                {/* Generate Backstory Button */}
                <button
                  onClick={handleGenerateBackstory}
                  disabled={isBusy || !character}
                  className="px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-200 bg-stone-900/90 border border-amber-600/50 hover:bg-stone-800 hover:border-amber-400 hover:text-amber-100 shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Generate a unique, one-to-two-sentence origin story for the character on screen"
                >
                  {isGeneratingBackstory ? (
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : (
                    <Feather className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{isGeneratingBackstory ? 'Inscribing...' : 'Generate Backstory'}</span>
                </button>

                {/* Generate Quest Hook Button */}
                <button
                  onClick={handleGenerateQuestHook}
                  disabled={isBusy || !character}
                  className="px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-200 bg-stone-900/90 border border-amber-500/60 hover:bg-stone-800 hover:border-amber-400 hover:text-amber-100 shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Generate a 2-3 sentence mini-adventure based on backstory, class, and race"
                >
                  <Compass className={`w-4 h-4 text-amber-400 ${isGeneratingQuestHook ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingQuestHook ? 'Summoning...' : 'Generate Quest Hook'}</span>
                </button>

                {/* Cartoon / Video Game Style Portrait Action */}
                {!isCartoonActive ? (
                  <button
                    onClick={handleGenerateCartoonPortrait}
                    disabled={isBusy || !character}
                    className="px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-200 bg-stone-900/90 border border-amber-500/60 hover:bg-stone-800 hover:border-amber-400 hover:text-amber-100 shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate a cartoon/video game style portrait for this card"
                  >
                    {isGeneratingPortrait ? <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> : <Gamepad2 className="w-4 h-4 text-amber-400" />}
                    <span>Cartoon Portrait</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRegenerateCartoonPortrait}
                    disabled={isBusy || !character}
                    className="px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-200 bg-amber-950/60 border border-amber-400/80 hover:bg-amber-900/70 hover:text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Regenerate cartoon / video game portrait with a new aura"
                  >
                    <RefreshCw className={`w-4 h-4 text-amber-400 ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                    <span>Regen Portrait</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] font-cinzel tracking-wider text-amber-400/70">
                Tip: Press <kbd className="px-2 py-0.5 bg-stone-900 text-amber-300 rounded border border-amber-700/60">Space</kbd> on the table to generate a fresh player card
              </p>
            </div>

            {/* BORDERED PLAYER CARD WITH 3D CARD FLIP / FADE-IN ANIMATION */}
            <div className="w-full flex justify-center perspective-[1200px]">
              <AnimatePresence mode="wait">
                {character && (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, rotateY: 90, scale: 0.94 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: -90, scale: 0.94 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex justify-center"
                  >
                    <CharacterCard
                      character={character}
                      locks={locks}
                      onToggleLock={handleToggleLock}
                      onRerollStats={handleRerollStats}
                      onSaveToDeck={handleSaveToDeck}
                      isSavedInDeck={isCurrentInDeck}
                      onGenerateCartoonPortrait={handleGenerateCartoonPortrait}
                      onRegenerateCartoonPortrait={handleRegenerateCartoonPortrait}
                      onSwitchToClassicPortrait={handleSwitchToClassicPortrait}
                      isGeneratingPortrait={isGeneratingPortrait}
                      onGenerateBackstory={handleGenerateBackstory}
                      isGeneratingBackstory={isGeneratingBackstory}
                      onGenerateQuestHook={handleGenerateQuestHook}
                      isGeneratingQuestHook={isGeneratingQuestHook}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick History Strip on Card Table */}
            {history.length > 1 && (
              <div className="w-full max-w-4xl mx-auto mt-12 pt-6 border-t border-amber-900/40">
                <div className="flex items-center justify-between mb-3 text-xs text-stone-400 font-cinzel">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-amber-400/80">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Card Invocations</span>
                  </span>
                  <span>{history.length} logged</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {history.slice(0, 5).map((hist) => {
                    const histImg = hist.currentPortraitStyle === 'cartoon' 
                      ? hist.cartoonPortraitUrl 
                      : hist.portraitUrl;

                    return (
                      <button
                        key={hist.id}
                        disabled={isBusy}
                        onClick={() => setCharacter(hist)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50 ${
                          character?.id === hist.id
                            ? 'bg-amber-950/40 border-amber-500/70 ring-1 ring-amber-500/40'
                            : 'bg-stone-900/80 border-stone-800/80 hover:border-amber-800/60 hover:bg-stone-900'
                        }`}
                      >
                        <img
                          src={histImg}
                          alt={hist.name}
                          className="w-8 h-8 rounded-lg object-cover border border-amber-700/40 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-uncial text-xs font-semibold text-amber-100 truncate">
                            {hist.name}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate font-cinzel">
                            {hist.race} · {hist.health} HP · {hist.characterClass}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY DECK (FULL GRID VIEW) */}
        {activeTab === 'deck' && (
          <DeckView
            deck={myDeck}
            onSelectCharacter={(char) => {
              setCharacter(char);
              setActiveTab('forge');
            }}
            onRemoveFromDeck={handleRemoveFromDeck}
            onClearDeck={handleClearDeck}
            onImportDeck={handleImportDeck}
            onAddSampleCharacters={handleAddSampleCharacters}
            onNavigateToForge={() => setActiveTab('forge')}
            onNavigateToBattle={() => setActiveTab('battle')}
          />
        )}

        {/* TAB 3: BATTLE ARENA */}
        {activeTab === 'battle' && (
          <BattleArena
            deck={myDeck}
            onAddSampleCharacters={handleAddSampleCharacters}
            onNavigateToForge={() => setActiveTab('forge')}
          />
        )}
      </main>

      {/* "HOW TO PLAY" GUIDE MODAL */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Footer: Fantasy Character Generator */}
      <footer className="relative z-10 w-full border-t border-amber-950/70 bg-stone-950/95 py-6 text-center text-xs text-stone-500 font-body">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="italic">
            © <strong>Fantasy Character Generator</strong> · Health · Mana · Strength · Intelligence · Charisma
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-amber-500/80 font-cinzel text-[11px]">
            <span>Warrior (STR/HP)</span>
            <span aria-hidden="true">·</span>
            <span>Mage (MP/INT)</span>
            <span aria-hidden="true">·</span>
            <span>Rogue (CHA)</span>
            <span aria-hidden="true">·</span>
            <span>Turn-Based Arena</span>
            <span aria-hidden="true">·</span>
            <span>PNG Export</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
