import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Character, CharacterStats, CharacterRace, LockState } from '../types/character';
import { CLASS_DEFINITIONS, formatModifier, RACE_MODIFIERS } from '../data/fantasyData';
import { soundManager } from '../utils/audio';
import { 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw, 
  Shield, 
  Sword, 
  BookOpen, 
  Zap, 
  Compass, 
  Sun, 
  Dices, 
  Gamepad2, 
  Palette, 
  Flame, 
  RotateCcw, 
  Scroll, 
  Feather, 
  Heart, 
  Droplet, 
  Layers, 
  Award, 
  MapPin, 
  Gift, 
  Lock, 
  Unlock,
  Download,
  Share2
} from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  locks: LockState;
  onToggleLock: (key: keyof LockState) => void;
  onRerollStats: () => void;
  onSaveToDeck: (char: Character) => void;
  isSavedInDeck: boolean;
  onGenerateCartoonPortrait: () => void;
  onRegenerateCartoonPortrait: () => void;
  onSwitchToClassicPortrait: () => void;
  isGeneratingPortrait?: boolean;
  onGenerateBackstory: () => void;
  isGeneratingBackstory?: boolean;
  onGenerateQuestHook: () => void;
  isGeneratingQuestHook?: boolean;
}

const STAT_CONFIG: { key: keyof CharacterStats; label: string; abbrev: string }[] = [
  { key: 'strength', label: 'Strength', abbrev: 'STR' },
  { key: 'dexterity', label: 'Dexterity', abbrev: 'DEX' },
  { key: 'constitution', label: 'Constitution', abbrev: 'CON' },
  { key: 'intelligence', label: 'Intelligence', abbrev: 'INT' },
  { key: 'wisdom', label: 'Wisdom', abbrev: 'WIS' },
  { key: 'charisma', label: 'Charisma', abbrev: 'CHA' },
];

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  locks,
  onToggleLock,
  onRerollStats,
  onSaveToDeck,
  isSavedInDeck,
  onGenerateCartoonPortrait,
  onRegenerateCartoonPortrait,
  onSwitchToClassicPortrait,
  isGeneratingPortrait = false,
  onGenerateBackstory,
  isGeneratingBackstory = false,
  onGenerateQuestHook,
  isGeneratingQuestHook = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const classDef = CLASS_DEFINITIONS[character.characterClass];
  const raceMod = character.raceModifier || RACE_MODIFIERS[character.race as CharacterRace] || RACE_MODIFIERS.Human;

  const isCartoon = character.currentPortraitStyle === 'cartoon';
  const displayedImageUrl = isCartoon 
    ? character.cartoonPortraitUrl 
    : character.portraitUrl;

  // "Download Card" - Exports current character card as PNG image
  const handleDownloadCard = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);
    soundManager.playChime();

    try {
      // Export element to PNG data URL
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#0c0a09',
        pixelRatio: 2,
      });

      const safeName = character.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const safeClass = character.characterClass.toLowerCase();
      const link = document.createElement('a');
      link.download = `${safeName}_${safeClass}_card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export character card as PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // "Copy as Text" - Copies character's full details to clipboard
  const handleCopy = async () => {
    const questSection = character.questHook 
      ? `\n[ACTIVE QUEST HOOK: ${character.questHook.title}]\nThreat: ${character.questHook.threatLevel} | Location: ${character.questHook.location}\nNarrative: ${character.questHook.narrative}\nReward: ${character.questHook.reward}\n`
      : '';

    const text = `=== [PLAYER CARD] ${character.fullName} ===
Class: ${character.characterClass} (${classDef.role})
Race: ${character.race} (${character.raceBonusDescription || raceMod.bonusSummary})
Rarity: ${character.rarity}

[CORE COMBAT VITALS]
Health: ${character.health} HP (Max: ${character.maxHealth})
Mana: ${character.mana} MP (Max: ${character.maxMana})
Strength: ${character.strength} STR
Intelligence: ${character.intelligence} INT
Charisma: ${character.charisma} CHA

[ATTRIBUTES]
STR: ${character.stats.strength} (${formatModifier(character.stats.strength)}) | DEX: ${character.stats.dexterity} (${formatModifier(character.stats.dexterity)})
CON: ${character.stats.constitution} (${formatModifier(character.stats.constitution)}) | INT: ${character.stats.intelligence} (${formatModifier(character.stats.intelligence)})
WIS: ${character.stats.wisdom} (${formatModifier(character.stats.wisdom)}) | CHA: ${character.stats.charisma} (${formatModifier(character.stats.charisma)})

[EQUIPMENT & ART]
Armament: ${character.primaryWeapon}
Signature Art: ${character.signatureAbility}
Game Aura: ${character.gameAura}

[ORIGIN STORY]
${character.lore}
Quirk: ${character.quirk}
${questSection}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const getClassIcon = () => {
    switch (character.characterClass) {
      case 'Mage': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Warrior': return <Sword className="w-5 h-5 text-amber-500" />;
      case 'Rogue': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'Cleric': return <Sun className="w-5 h-5 text-amber-300" />;
      case 'Ranger': return <Compass className="w-5 h-5 text-lime-400" />;
      case 'Paladin': return <Shield className="w-5 h-5 text-amber-400" />;
      default: return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  const getRarityBadge = () => {
    switch (character.rarity) {
      case 'Legendary':
        return {
          label: 'Legendary',
          color: 'text-amber-300 border-amber-400/80 bg-amber-950/80 shadow-[0_0_12px_rgba(245,158,11,0.6)]',
          borderGlow: 'border-amber-500/80',
        };
      case 'Epic':
        return {
          label: 'Epic',
          color: 'text-purple-300 border-purple-400/80 bg-purple-950/80 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
          borderGlow: 'border-purple-500/70',
        };
      case 'Rare':
        return {
          label: 'Rare',
          color: 'text-sky-300 border-sky-400/80 bg-sky-950/80 shadow-[0_0_10px_rgba(56,189,248,0.4)]',
          borderGlow: 'border-sky-500/60',
        };
      default:
        return {
          label: 'Common',
          color: 'text-stone-300 border-stone-600 bg-stone-900/80',
          borderGlow: 'border-stone-700/80',
        };
    }
  };

  const getThreatBadge = (threat: string) => {
    switch (threat) {
      case 'Mythic':
        return 'bg-purple-950/90 text-purple-300 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
      case 'Deadly':
        return 'bg-red-950/90 text-red-300 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
      case 'Dangerous':
        return 'bg-amber-950/90 text-amber-300 border-amber-500';
      default:
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-500';
    }
  };

  const rarityInfo = getRarityBadge();

  // Progress Bar scale calculations
  const healthPercent = Math.min(100, Math.max(12, Math.round((character.health / 200) * 100)));
  const manaPercent = Math.min(100, Math.max(12, Math.round((character.mana / 230) * 100)));
  const strengthPercent = Math.min(100, Math.max(12, Math.round((character.strength / 125) * 100)));
  const intPercent = Math.min(100, Math.max(12, Math.round((character.intelligence / 125) * 100)));
  const chaPercent = Math.min(100, Math.max(12, Math.round((character.charisma / 120) * 100)));

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl bg-stone-950 p-1.5 sm:p-2.5 shadow-[0_30px_70px_rgba(0,0,0,0.95)] transition-all duration-300">
      {/* Outer Bordered Player Card Metal Casing (Captured by html-to-image) */}
      <div 
        ref={cardRef}
        className={`relative rounded-[22px] border-4 ${rarityInfo.borderGlow} bg-stone-900/95 p-5 sm:p-7 md:p-8 workbench-card text-stone-200 overflow-hidden`}
      >
        {/* Ornate corner bracket rivets */}
        <div className="brass-rivet top-3 left-3" />
        <div className="brass-rivet top-3 right-3" />
        <div className="brass-rivet bottom-3 left-3" />
        <div className="brass-rivet bottom-3 right-3" />

        {/* Outer Filigree Foil Corner Accents */}
        <div className="absolute top-2 left-6 text-amber-500/30 text-xs font-serif select-none pointer-events-none">⚜</div>
        <div className="absolute top-2 right-6 text-amber-500/30 text-xs font-serif select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 left-6 text-amber-500/30 text-xs font-serif select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 right-6 text-amber-500/30 text-xs font-serif select-none pointer-events-none">⚜</div>

        {/* TOP BAR: Player Card Metadata, Lock Attributes Indicator, Download Card, Copy as Text, & Save to Deck */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-amber-900/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-cinzel font-bold tracking-wider uppercase border ${rarityInfo.color}`}>
              {character.rarity} Hero
            </span>
            <span className="text-stone-500">·</span>
            
            {/* RACE WITH LOCK ICON */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-950/70 border border-amber-600/60 shadow-inner">
              <span className="text-xs font-cinzel text-amber-200 font-bold tracking-wide">
                {character.race}
              </span>
              <button
                onClick={() => onToggleLock('race')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  locks.race 
                    ? 'text-amber-400 bg-amber-500/30' 
                    : 'text-stone-500 hover:text-amber-300'
                }`}
                title={locks.race ? 'Race is LOCKED' : 'Lock Race'}
                aria-label={locks.race ? 'Unlock Race' : 'Lock Race'}
              >
                {locks.race ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
            </div>

            <span className="text-stone-500">·</span>

            {/* CLASS WITH LOCK ICON */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-stone-900 border border-stone-700 shadow-inner">
              <span className="text-xs font-cinzel text-amber-400/90 font-medium tracking-wider">
                {character.characterClass}
              </span>
              <button
                onClick={() => onToggleLock('class')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  locks.class 
                    ? 'text-amber-400 bg-amber-500/30' 
                    : 'text-stone-500 hover:text-amber-300'
                }`}
                title={locks.class ? 'Class is LOCKED' : 'Lock Class'}
                aria-label={locks.class ? 'Unlock Class' : 'Lock Class'}
              >
                {locks.class ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
            </div>

            <span className="text-stone-500">·</span>
            <span className="text-xs text-stone-400 font-cinzel">
              {character.alignment}
            </span>
          </div>

          {/* Quick Card Export & Deck Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download Card Button (Export as PNG image) */}
            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-bold tracking-wider uppercase text-amber-200 bg-stone-900 border border-amber-600/60 hover:bg-amber-600/20 hover:border-amber-400 hover:text-amber-100 rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
              title="Download this character card as a PNG image"
            >
              <Download className={`w-3.5 h-3.5 text-amber-400 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Exporting...' : 'Download Card'}</span>
            </button>

            {/* Copy as Text Button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-bold tracking-wider uppercase text-stone-300 bg-stone-900/90 border border-stone-700 hover:border-amber-500 hover:text-amber-200 rounded-lg transition-colors cursor-pointer"
              title="Copy character details and stats to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy as Text'}</span>
            </button>

            {/* Save to Deck Button */}
            <button
              onClick={() => onSaveToDeck(character)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-cinzel font-bold tracking-wider uppercase rounded-lg border transition-all duration-200 shadow-sm cursor-pointer ${
                isSavedInDeck
                  ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-stone-900 text-amber-300 border-amber-600/60 hover:bg-amber-600/20 hover:border-amber-400'
              }`}
              title={isSavedInDeck ? 'Remove card from My Deck' : 'Save this player card to My Deck'}
            >
              {isSavedInDeck ? <Check className="w-4 h-4 text-stone-950 stroke-[2.5]" /> : <Layers className="w-4 h-4 text-amber-400" />}
              <span>{isSavedInDeck ? 'In Deck' : 'Save to Deck'}</span>
            </button>
          </div>
        </div>

        {/* CARD HERO BANNER: Stylized Fantasy Character Name & Title + Name Lock */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-stone-950 border border-amber-600/40">
                {getClassIcon()}
              </span>
              <span className="text-xs font-cinzel font-bold tracking-widest uppercase text-amber-400">
                {classDef.role}
              </span>
              <span className="text-stone-500">|</span>
              <span className="text-xs font-body italic text-amber-300/80">
                {raceMod.tagline}
              </span>
            </div>

            {/* Stylized Fantasy Font for Character Name with Lock Button */}
            <div className="flex items-center gap-3">
              <h2 className="font-uncial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-amber-100 drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] leading-none">
                {character.name}
              </h2>
              <button
                onClick={() => onToggleLock('name')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  locks.name
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-stone-900/80 border-stone-700 text-stone-500 hover:text-amber-300 hover:border-amber-600/60'
                }`}
                title={locks.name ? 'Name is LOCKED' : 'Lock Name'}
                aria-label={locks.name ? 'Unlock Name' : 'Lock Name'}
              >
                {locks.name ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>

            <p className="font-medieval italic text-xl sm:text-2xl text-amber-300/90 mt-1">
              {character.title}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[11px] font-cinzel tracking-widest text-amber-500/80 uppercase">
              Ancestry & Class
            </p>
            <p className="font-uncial text-xl sm:text-2xl text-amber-200">
              {character.race} {character.characterClass}
            </p>
            <p className="text-[11px] font-mono text-amber-400/90 mt-0.5">
              {character.raceBonusDescription || raceMod.bonusSummary}
            </p>
          </div>
        </div>

        {/* MAIN PLAYER CARD GRID: Artwork + Stat Badges + Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Framed Card Artwork Window */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[300px] md:max-w-none rounded-2xl overflow-hidden border-4 border-amber-600/70 shadow-[0_12px_35px_rgba(0,0,0,0.9)] bg-stone-950 group">
              {!imageError ? (
                <img
                  key={displayedImageUrl}
                  src={displayedImageUrl}
                  alt={`${character.name} the ${character.race} ${character.characterClass}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover object-center filter contrast-105 transition-all duration-300 ${
                    isGeneratingPortrait ? 'scale-105 blur-[2px]' : 'scale-100 blur-0'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-950 text-amber-400">
                  <div className="p-4 rounded-full bg-stone-900 border border-amber-600/40 mb-3">
                    {getClassIcon()}
                  </div>
                  <p className="font-uncial text-xl font-bold">{character.race} {character.characterClass}</p>
                  <p className="text-xs text-stone-400 mt-1">{classDef.role}</p>
                </div>
              )}

              {/* Transmutation / Summoning Animation Overlay */}
              {isGeneratingPortrait && (
                <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 animate-fadeIn">
                  <Sparkles className="w-9 h-9 text-amber-400 animate-spin mb-2" />
                  <p className="font-uncial text-sm font-bold tracking-wider text-amber-200">
                    Transmuting Art Style...
                  </p>
                </div>
              )}

              {/* Inner gold frame border */}
              <div className="absolute inset-0 border-2 border-amber-400/30 rounded-2xl pointer-events-none" />

              {/* Top Style Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-cinzel font-semibold tracking-wider bg-stone-950/90 text-amber-300 border border-amber-500/60 backdrop-blur-xs shadow-md">
                  {isCartoon ? <Gamepad2 className="w-3.5 h-3.5 text-amber-400" /> : <Palette className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isCartoon ? 'Cartoon Game Art' : 'Classic Oil'}</span>
                </span>
              </div>

              {/* Bottom Card Frame Seal */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent p-3 pt-8 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-cinzel text-amber-400/90 font-bold">
                  {character.characterClass}
                </span>
                <span className="text-[11px] font-cinzel text-amber-300 font-bold tracking-wider">
                  {character.race}
                </span>
              </div>
            </div>

            {/* Portrait Style Controls Panel */}
            <div className="w-full max-w-[300px] md:max-w-none mt-3 p-3 rounded-xl bg-stone-950/85 border border-amber-900/50 flex flex-col gap-2.5 shadow-inner">
              {isCartoon && (
                <div className="flex items-center justify-between text-[11px] font-cinzel text-amber-300/90 px-1 pb-1.5 border-b border-stone-800">
                  <span className="flex items-center gap-1 text-stone-400">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>Aura:</span>
                  </span>
                  <span className="truncate max-w-[170px] font-semibold text-amber-200">
                    {character.gameAura}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {!isCartoon ? (
                  <button
                    onClick={onGenerateCartoonPortrait}
                    disabled={isGeneratingPortrait}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-cinzel font-bold tracking-wider uppercase rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 shadow-md active:scale-98 transition-all duration-150 cursor-pointer"
                    title="Generate cartoon / video game style player card portrait"
                  >
                    <Gamepad2 className="w-4 h-4 text-stone-950" />
                    <span>Cartoon Portrait</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onRegenerateCartoonPortrait}
                      disabled={isGeneratingPortrait}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-cinzel font-bold tracking-wider uppercase rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 shadow-md active:scale-98 transition-all duration-150 cursor-pointer"
                      title="Regenerate cartoon / video game portrait with a new aura"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-stone-950 ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                      <span>Regenerate</span>
                    </button>

                    <button
                      onClick={onSwitchToClassicPortrait}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-cinzel text-stone-300 hover:text-amber-200 bg-stone-900 border border-stone-800 rounded-lg hover:border-amber-700/60 transition-colors cursor-pointer"
                      title="Revert to classic oil painting portrait"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Classic</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: CORE PLAYER CARD STATS WITH PROGRESS BARS & LOCK */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            {/* 5 CORE COMBAT VITALS: Health, Mana, Strength, Intelligence, Charisma */}
            <div className="bg-stone-950/90 rounded-2xl border-2 border-amber-800/60 p-4 sm:p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-amber-900/40 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Core Combat Vitals</span>
                  </span>
                  {/* STATS LOCK BUTTON */}
                  <button
                    onClick={() => onToggleLock('stats')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-cinzel font-semibold transition-all cursor-pointer ${
                      locks.stats
                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                        : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-amber-300 hover:border-amber-600/60'
                    }`}
                    title={locks.stats ? 'Stats are LOCKED' : 'Lock Stats'}
                    aria-label={locks.stats ? 'Unlock Stats' : 'Lock Stats'}
                  >
                    {locks.stats ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
                    <span>{locks.stats ? 'Stats Locked' : 'Lock Stats'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-cinzel text-amber-400/90 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/40">
                    {character.characterClass} Role Focus
                  </span>
                </div>
              </div>

              {/* 5 Vitals Cards with VISUAL PROGRESS BARS */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                {/* 1. Health */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-red-950/70 to-stone-950 border-2 border-red-600/60 p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg group hover:border-red-500 transition-colors">
                  <div className="p-1.5 rounded-full bg-red-950/90 border border-red-500/60 text-red-400 mb-1 shadow-[0_0_10px_rgba(239,68,68,0.35)]">
                    <Heart className="w-4 h-4 fill-red-500 text-red-400" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-cinzel font-bold text-red-300 uppercase tracking-wider">
                    Health
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-red-100 tracking-tight mt-0.5">
                    {character.health}
                  </span>
                  <span className="text-[9px] font-mono text-red-400 font-semibold mb-2">
                    HP MAX
                  </span>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-red-900/60 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-rose-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                      style={{ width: `${healthPercent}%` }}
                    />
                  </div>
                </div>

                {/* 2. Mana */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-sky-950/70 to-stone-950 border-2 border-sky-600/60 p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg group hover:border-sky-500 transition-colors">
                  <div className="p-1.5 rounded-full bg-sky-950/90 border border-sky-500/60 text-sky-400 mb-1 shadow-[0_0_10px_rgba(56,189,248,0.35)]">
                    <Droplet className="w-4 h-4 fill-sky-500 text-sky-400" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-cinzel font-bold text-sky-300 uppercase tracking-wider">
                    Mana
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-sky-100 tracking-tight mt-0.5">
                    {character.mana}
                  </span>
                  <span className="text-[9px] font-mono text-sky-400 font-semibold mb-2">
                    MP MAX
                  </span>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-sky-900/60 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-sky-600 to-cyan-300 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                      style={{ width: `${manaPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Strength */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-950/70 to-stone-950 border-2 border-amber-600/60 p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg group hover:border-amber-500 transition-colors">
                  <div className="p-1.5 rounded-full bg-amber-950/90 border border-amber-500/60 text-amber-400 mb-1 shadow-[0_0_10px_rgba(245,158,11,0.35)]">
                    <Sword className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-cinzel font-bold text-amber-300 uppercase tracking-wider">
                    Strength
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-amber-100 tracking-tight mt-0.5">
                    {character.strength}
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 font-semibold mb-2">
                    STR POWER
                  </span>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-amber-900/60 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-amber-600 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]"
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>
                </div>

                {/* 4. Intelligence */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-purple-950/70 to-stone-950 border-2 border-purple-600/60 p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg group hover:border-purple-500 transition-colors">
                  <div className="p-1.5 rounded-full bg-purple-950/90 border border-purple-500/60 text-purple-300 mb-1 shadow-[0_0_10px_rgba(168,85,247,0.35)]">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-cinzel font-bold text-purple-300 uppercase tracking-wider">
                    Intelligence
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-purple-100 tracking-tight mt-0.5">
                    {character.intelligence}
                  </span>
                  <span className="text-[9px] font-mono text-purple-400 font-semibold mb-2">
                    INT MIND
                  </span>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-purple-900/60 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-300 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                      style={{ width: `${intPercent}%` }}
                    />
                  </div>
                </div>

                {/* 5. Charisma */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-950/70 to-stone-950 border-2 border-rose-500/60 p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg group hover:border-rose-400 transition-colors col-span-2 sm:col-span-1">
                  <div className="p-1.5 rounded-full bg-rose-950/90 border border-rose-500/60 text-rose-300 mb-1 shadow-[0_0_10px_rgba(244,63,94,0.35)]">
                    <Award className="w-4 h-4 text-rose-300" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-cinzel font-bold text-rose-300 uppercase tracking-wider">
                    Charisma
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-rose-100 tracking-tight mt-0.5">
                    {character.charisma}
                  </span>
                  <span className="text-[9px] font-mono text-rose-400 font-semibold mb-2">
                    CHA CHARM
                  </span>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-rose-900/60 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-rose-600 to-amber-300 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]"
                      style={{ width: `${chaPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Attributes Grid (STR, DEX, CON, INT, WIS, CHA) */}
            <div className="bg-stone-950/85 rounded-xl border border-stone-800 p-3.5 shadow-inner">
              <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-stone-800/80">
                <span className="font-cinzel text-xs font-semibold uppercase tracking-wider text-amber-300/80">
                  Ability Matrix Scores
                </span>
                <button
                  onClick={onRerollStats}
                  className="inline-flex items-center gap-1 text-[11px] font-cinzel text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
                  title="Reroll character matrix scores"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Reroll Matrix</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {STAT_CONFIG.map(({ key, abbrev }) => {
                  const val = character.stats[key];
                  const mod = formatModifier(val);
                  const isAffinity = classDef.statAffinities.primary === key || classDef.statAffinities.secondary === key;
                  const statBarPercent = Math.min(100, Math.round((val / 18) * 100));

                  return (
                    <div
                      key={key}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-colors ${
                        isAffinity
                          ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                          : 'bg-stone-900/80 border-stone-800 text-stone-300'
                      }`}
                    >
                      <span className="text-[10px] font-cinzel font-medium text-stone-400 uppercase tracking-wider">
                        {abbrev}
                      </span>
                      <span className="text-base font-bold font-mono tabular-nums mt-0.5">
                        {val}
                      </span>
                      <span className={`text-[10px] font-mono tabular-nums mb-1 ${val >= 14 ? 'text-amber-400 font-semibold' : 'text-stone-400'}`}>
                        {mod}
                      </span>

                      <div className="w-full bg-stone-950 rounded-full h-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isAffinity ? 'bg-amber-400' : 'bg-stone-600'}`}
                          style={{ width: `${statBarPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Armament & Signature Ability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <div className="flex items-center gap-1.5 text-amber-400/85 font-cinzel text-[11px] uppercase tracking-wider mb-1">
                  <Sword className="w-3.5 h-3.5" />
                  <span>Primary Weapon</span>
                </div>
                <p className="text-stone-200 font-medium font-body text-sm leading-snug">
                  {character.primaryWeapon}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <div className="flex items-center gap-1.5 text-amber-400/85 font-cinzel text-[11px] uppercase tracking-wider mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Signature Art</span>
                </div>
                <p className="text-stone-200 font-medium font-body text-sm leading-snug">
                  {character.signatureAbility}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ancient Parchment Scroll Lore with Generate Backstory Button */}
        <div className="mt-6 pt-5 border-t border-amber-900/50">
          <div className="rounded-xl parchment-scroll p-5 md:p-6 text-stone-900 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-amber-950/20 text-stone-800">
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-900" />
                <h3 className="font-cinzel text-xs font-bold tracking-widest uppercase text-stone-900">
                  Player Origin Story & Lore
                </h3>
              </div>
              
              <button
                onClick={onGenerateBackstory}
                disabled={isGeneratingBackstory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-bold tracking-wider uppercase text-amber-950 bg-amber-200/90 hover:bg-amber-300 border border-amber-900/30 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate a unique one-to-two-sentence origin story for this character"
              >
                {isGeneratingBackstory ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-900 animate-spin" />
                ) : (
                  <Feather className="w-3.5 h-3.5 text-amber-900" />
                )}
                <span>{isGeneratingBackstory ? 'Inscribing Story...' : 'Generate Backstory'}</span>
              </button>
            </div>
            
            {isGeneratingBackstory ? (
              <div className="py-6 flex flex-col items-center justify-center text-amber-900 gap-2">
                <Sparkles className="w-6 h-6 animate-spin text-amber-800" />
                <p className="font-cinzel text-xs font-bold tracking-wider uppercase">Inscribing Ancient Chronicle...</p>
              </div>
            ) : (
              <div className="transition-opacity duration-200">
                <p className="font-body text-base md:text-lg leading-relaxed text-stone-950 italic">
                  "{character.lore}"
                </p>

                <div className="mt-3.5 pt-2.5 border-t border-stone-800/15 flex items-start gap-2 text-xs md:text-sm text-stone-800">
                  <span className="font-cinzel font-bold text-stone-950 shrink-0">Card Quirk:</span>
                  <span className="font-body text-stone-900">{character.quirk}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEPARATE SECTION: QUEST HOOK / MINI-ADVENTURE WITH "GENERATE QUEST HOOK" BUTTON */}
        <div className="mt-5 pt-4 border-t border-amber-900/50">
          <div className="rounded-xl bg-stone-950/90 border-2 border-amber-700/60 p-4 sm:p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-amber-900/40">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h3 className="font-cinzel text-xs font-bold tracking-widest uppercase text-amber-200">
                  Active Quest Hook (Mini-Adventure)
                </h3>
                {character.questHook && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold uppercase border ${getThreatBadge(character.questHook.threatLevel)}`}>
                    {character.questHook.threatLevel}
                  </span>
                )}
              </div>

              {/* Prominent "Generate Quest Hook" Button */}
              <button
                onClick={onGenerateQuestHook}
                disabled={isGeneratingQuestHook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-bold tracking-wider uppercase text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 border border-amber-200/50 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate a 2-3 sentence mini-adventure based on backstory, class, and race"
              >
                {isGeneratingQuestHook ? (
                  <Compass className="w-3.5 h-3.5 text-stone-900 animate-spin" />
                ) : (
                  <Compass className="w-3.5 h-3.5 text-stone-900" />
                )}
                <span>{isGeneratingQuestHook ? 'Summoning Quest...' : 'Generate Quest Hook'}</span>
              </button>
            </div>

            {isGeneratingQuestHook ? (
              <div className="py-8 flex flex-col items-center justify-center text-amber-400 gap-2">
                <Compass className="w-7 h-7 animate-spin text-amber-400" />
                <p className="font-cinzel text-xs font-bold tracking-wider uppercase text-amber-200">Synthesizing Mini-Adventure...</p>
              </div>
            ) : character.questHook ? (
              <div className="space-y-3 text-stone-200 transition-opacity duration-200">
                <div>
                  <h4 className="font-uncial text-lg text-amber-300">
                    {character.questHook.title}
                  </h4>
                  <p className="font-body text-stone-200 text-sm sm:text-base leading-relaxed mt-1 italic">
                    "{character.questHook.narrative}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  {/* Location */}
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-cinzel text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                        Location
                      </span>
                      <p className="text-stone-300 font-medium">
                        {character.questHook.location}
                      </p>
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 flex items-start gap-2">
                    <Gift className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-cinzel text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
                        Quest Bounty & Reward
                      </span>
                      <p className="text-stone-300 font-medium leading-tight">
                        {character.questHook.reward}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs font-cinzel text-stone-400">
                Click "Generate Quest Hook" above to weave a 2-3 sentence mini-adventure based on {character.name}'s backstory, class, and race.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Card Footer Watermark */}
        <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between text-[11px] font-cinzel text-stone-500">
          <span>Card ID: #{character.id.slice(-6).toUpperCase()}</span>
          <span>{character.race} {character.characterClass} · Eldoria Deck</span>
          <span>{character.rarity} · 1st Edition</span>
        </div>
      </div>
    </div>
  );
};
