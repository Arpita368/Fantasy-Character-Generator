import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types/character';
import { soundManager } from '../utils/audio';
import { 
  Swords, 
  RotateCcw, 
  Play, 
  Pause, 
  StepForward, 
  Trophy, 
  Heart, 
  Droplet, 
  Sword, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  PlusCircle, 
  Flame,
  Award
} from 'lucide-react';

interface BattleArenaProps {
  deck: Character[];
  onAddSampleCharacters: () => void;
  onNavigateToForge: () => void;
}

interface CombatantState {
  character: Character;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  strength: number;
  intelligence: number;
  isHit: boolean;
  isAttacking: boolean;
}

interface BattleLogEntry {
  round: number;
  attackerName: string;
  defenderName: string;
  actionName: string;
  damage: number;
  isCrit: boolean;
  isMagic: boolean;
  mpUsed: number;
  defenderRemainingHp: number;
  message: string;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  deck,
  onAddSampleCharacters,
  onNavigateToForge,
}) => {
  const [fighter1Id, setFighter1Id] = useState<string>('');
  const [fighter2Id, setFighter2Id] = useState<string>('');

  const [combatant1, setCombatant1] = useState<CombatantState | null>(null);
  const [combatant2, setCombatant2] = useState<CombatantState | null>(null);

  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [winner, setWinner] = useState<CombatantState | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-select initial two fighters when deck changes
  useEffect(() => {
    if (deck.length >= 2) {
      if (!fighter1Id || !deck.some(c => c.id === fighter1Id)) {
        setFighter1Id(deck[0].id);
      }
      if (!fighter2Id || !deck.some(c => c.id === fighter2Id) || fighter2Id === deck[0]?.id) {
        setFighter2Id(deck[1].id);
      }
    } else if (deck.length === 1) {
      setFighter1Id(deck[0].id);
    }
  }, [deck]);

  // Initialize or reset combatants when fighter IDs change
  const initCombatants = (id1: string, id2: string) => {
    const c1 = deck.find(c => c.id === id1);
    const c2 = deck.find(c => c.id === id2);

    if (c1 && c2 && c1.id !== c2.id) {
      setCombatant1({
        character: c1,
        currentHp: c1.health,
        maxHp: c1.maxHealth,
        currentMp: c1.mana,
        maxMp: c1.maxMana,
        strength: c1.strength,
        intelligence: c1.intelligence,
        isHit: false,
        isAttacking: false,
      });

      setCombatant2({
        character: c2,
        currentHp: c2.health,
        maxHp: c2.maxHealth,
        currentMp: c2.mana,
        maxMp: c2.maxMana,
        strength: c2.strength,
        intelligence: c2.intelligence,
        isHit: false,
        isAttacking: false,
      });

      setBattleLogs([]);
      setCurrentRound(0);
      setIsBattleActive(false);
      setIsAutoPlaying(false);
      setWinner(null);
    }
  };

  useEffect(() => {
    if (fighter1Id && fighter2Id && fighter1Id !== fighter2Id) {
      initCombatants(fighter1Id, fighter2Id);
    }
  }, [fighter1Id, fighter2Id]);

  // Scroll to bottom of log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLogs]);

  // Execute a single turn in the battle
  const executeNextTurn = () => {
    if (!combatant1 || !combatant2 || winner) return;

    // Determine whose turn it is in this round (alternating)
    const isFighter1Turn = currentRound % 2 === 0;
    const attacker = isFighter1Turn ? combatant1 : combatant2;
    const defender = isFighter1Turn ? combatant2 : combatant1;

    // Decide between Magic / Signature Art vs Physical Weapon Strike
    const canCastMagic = attacker.currentMp >= 25;
    const useMagic = canCastMagic && (Math.random() > 0.4 || attacker.character.characterClass === 'Mage');

    let damage = 0;
    let isCrit = false;
    let actionName = '';
    let mpUsed = 0;

    if (useMagic) {
      mpUsed = 25;
      // Magic damage scales with Intelligence + small Strength
      const baseMagic = attacker.intelligence * 0.45 + (attacker.strength * 0.15);
      const variance = Math.floor(Math.random() * 16) + 8;
      damage = Math.round(baseMagic + variance);
      actionName = attacker.character.signatureAbility;
      soundManager.playSpellCast();
    } else {
      // Physical damage scales with Strength
      const basePhys = attacker.strength * 0.38;
      const variance = Math.floor(Math.random() * 12) + 6;
      isCrit = Math.random() < 0.22;
      damage = Math.round((basePhys + variance) * (isCrit ? 1.6 : 1.0));
      actionName = attacker.character.primaryWeapon;
      soundManager.playSwordClash();
    }

    const nextDefenderHp = Math.max(0, defender.currentHp - damage);
    const nextAttackerMp = Math.max(0, attacker.currentMp - mpUsed + (useMagic ? 0 : 6)); // Small MP regen on physical turn

    // Create log message
    let message = '';
    if (useMagic) {
      message = `${attacker.character.name} invocates ${actionName}, expending ${mpUsed} MP to strike ${defender.character.name} for ${damage} arcane damage!`;
    } else if (isCrit) {
      message = `CRITICAL HIT! ${attacker.character.name} executes an overwhelming strike with ${actionName}, shattering defenses for ${damage} damage!`;
    } else {
      message = `${attacker.character.name} attacks with ${actionName}, dealing ${damage} physical damage to ${defender.character.name}.`;
    }

    if (nextDefenderHp <= 0) {
      message += ` ⚔️ ${defender.character.name} has been vanquished!`;
    }

    const newLogEntry: BattleLogEntry = {
      round: currentRound + 1,
      attackerName: attacker.character.name,
      defenderName: defender.character.name,
      actionName,
      damage,
      isCrit,
      isMagic: useMagic,
      mpUsed,
      defenderRemainingHp: nextDefenderHp,
      message,
    };

    setBattleLogs(prev => [...prev, newLogEntry]);
    setCurrentRound(prev => prev + 1);
    setIsBattleActive(true);

    // Update state with animation flags
    if (isFighter1Turn) {
      setCombatant1(prev => prev ? { ...prev, currentMp: nextAttackerMp, isAttacking: true } : null);
      setCombatant2(prev => prev ? { ...prev, currentHp: nextDefenderHp, isHit: true } : null);
    } else {
      setCombatant2(prev => prev ? { ...prev, currentMp: nextAttackerMp, isAttacking: true } : null);
      setCombatant1(prev => prev ? { ...prev, currentHp: nextDefenderHp, isHit: true } : null);
    }

    // Reset visual hit/attack flags after a short delay
    setTimeout(() => {
      setCombatant1(prev => prev ? { ...prev, isHit: false, isAttacking: false } : null);
      setCombatant2(prev => prev ? { ...prev, isHit: false, isAttacking: false } : null);
    }, 280);

    // Check for victor
    if (nextDefenderHp <= 0) {
      setWinner(attacker);
      setIsAutoPlaying(false);
      soundManager.playVictoryFanfare();
    }
  };

  // Auto-play battle loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && !winner && combatant1 && combatant2) {
      timer = setTimeout(() => {
        executeNextTurn();
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentRound, winner, combatant1, combatant2]);

  const handleResetBattle = () => {
    initCombatants(fighter1Id, fighter2Id);
  };

  // If deck has less than 2 characters
  if (deck.length < 2) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center text-center">
        <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-600/50 mb-4 shadow-2xl">
          <Swords className="w-16 h-16 text-amber-400 animate-pulse" />
        </div>
        <h2 className="font-uncial text-3xl font-bold text-amber-200 mb-2">
          The Grand Arena of Eldoria
        </h2>
        <p className="font-body text-stone-300 max-w-md text-base mb-6">
          You need at least <strong>two saved characters</strong> in your deck to stage turn-based champion duels.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onAddSampleCharacters}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-stone-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg hover:from-amber-300 hover:to-yellow-400 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-stone-950" />
            <span>Summon 2 Sample Combatants</span>
          </button>
          <button
            onClick={onNavigateToForge}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-cinzel font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Go to Card Forge</span>
          </button>
        </div>
      </div>
    );
  }

  const c1PercentHp = combatant1 ? Math.min(100, Math.max(0, Math.round((combatant1.currentHp / combatant1.maxHp) * 100))) : 0;
  const c2PercentHp = combatant2 ? Math.min(100, Math.max(0, Math.round((combatant2.currentHp / combatant2.maxHp) * 100))) : 0;

  const c1PercentMp = combatant1 ? Math.min(100, Math.max(0, Math.round((combatant1.currentMp / combatant1.maxMp) * 100))) : 0;
  const c2PercentMp = combatant2 ? Math.min(100, Math.max(0, Math.round((combatant2.currentMp / combatant2.maxMp) * 100))) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col items-center">
      {/* Arena Banner Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-cinzel tracking-widest uppercase text-amber-500 mb-1">
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Turn-Based Combat Arena</span>
          <Swords className="w-4 h-4 text-amber-400" />
        </div>
        <h2 className="font-uncial text-3xl sm:text-4xl font-bold text-amber-100">
          Championship of the Realm
        </h2>
        <p className="font-body text-xs sm:text-sm text-stone-400 mt-1 max-w-lg mx-auto">
          Combat damage is dynamically derived from Health, Strength, and Mana. Cast powerful signature spells or unleash weapon strikes!
        </p>
      </div>

      {/* Fighter Pickers Toolbar */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Fighter 1 Picker (Red Corner) */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-red-800/60 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-xs font-cinzel font-bold text-red-300 uppercase tracking-wider">
              Challenger A:
            </span>
          </div>
          <select
            value={fighter1Id}
            onChange={(e) => setFighter1Id(e.target.value)}
            disabled={isBattleActive && !winner}
            className="flex-1 max-w-[220px] bg-stone-950 text-amber-100 text-xs font-cinzel rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            {deck.map((char) => (
              <option key={char.id} value={char.id} disabled={char.id === fighter2Id}>
                {char.name} ({char.characterClass} - {char.health} HP)
              </option>
            ))}
          </select>
        </div>

        {/* Fighter 2 Picker (Blue Corner) */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-sky-800/60 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="text-xs font-cinzel font-bold text-sky-300 uppercase tracking-wider">
              Challenger B:
            </span>
          </div>
          <select
            value={fighter2Id}
            onChange={(e) => setFighter2Id(e.target.value)}
            disabled={isBattleActive && !winner}
            className="flex-1 max-w-[220px] bg-stone-950 text-amber-100 text-xs font-cinzel rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {deck.map((char) => (
              <option key={char.id} value={char.id} disabled={char.id === fighter1Id}>
                {char.name} ({char.characterClass} - {char.health} HP)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN BATTLE ARENA GRID */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch mb-6">
        {/* COMBATANT 1 CARD */}
        {combatant1 && (
          <div className={`lg:col-span-4 rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col justify-between ${
            combatant1.isHit 
              ? 'bg-red-950/70 border-red-500 scale-98 ring-4 ring-red-500/50' 
              : combatant1.isAttacking
                ? 'bg-amber-950/60 border-amber-400 scale-102 ring-2 ring-amber-400/60'
                : 'bg-stone-900/90 border-red-900/50 shadow-xl'
          }`}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-red-900/40">
                <span className="px-2 py-0.5 rounded text-[10px] font-cinzel font-bold uppercase bg-red-950 text-red-300 border border-red-700/50">
                  Corner I
                </span>
                <span className="text-xs font-cinzel text-stone-400">
                  {combatant1.character.race} {combatant1.character.characterClass}
                </span>
              </div>

              {/* Portrait & Name */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={combatant1.character.currentPortraitStyle === 'cartoon' ? combatant1.character.cartoonPortraitUrl : combatant1.character.portraitUrl}
                  alt={combatant1.character.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-red-600/60 shrink-0 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="font-uncial text-xl font-bold text-amber-100 truncate">
                    {combatant1.character.name}
                  </h3>
                  <p className="font-medieval italic text-xs text-amber-300/80 truncate">
                    {combatant1.character.title}
                  </p>
                  <p className="text-[11px] text-stone-400 font-cinzel mt-0.5">
                    STR: <strong className="text-amber-400">{combatant1.strength}</strong> · INT: <strong className="text-purple-400">{combatant1.intelligence}</strong>
                  </p>
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-red-400 font-cinzel font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-red-500" />
                    <span>Health</span>
                  </span>
                  <span className="tabular-nums font-bold text-red-200">
                    {combatant1.currentHp} / {combatant1.maxHp} HP
                  </span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-3 border border-red-900/60 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                    style={{ width: `${c1PercentHp}%` }}
                  />
                </div>
              </div>

              {/* Mana Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-sky-400 font-cinzel font-semibold">
                    <Droplet className="w-3.5 h-3.5 fill-sky-500" />
                    <span>Mana</span>
                  </span>
                  <span className="tabular-nums font-bold text-sky-200">
                    {combatant1.currentMp} / {combatant1.maxMp} MP
                  </span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-2.5 border border-sky-900/60 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${c1PercentMp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Armament summary */}
            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 space-y-0.5">
              <p className="truncate"><span className="text-amber-400 font-semibold">Weapon:</span> {combatant1.character.primaryWeapon}</p>
              <p className="truncate"><span className="text-purple-400 font-semibold">Signature:</span> {combatant1.character.signatureAbility}</p>
            </div>
          </div>
        )}

        {/* CENTER ARENA CONTROLS & STATUS */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-950/90 border-2 border-amber-900/60 shadow-2xl text-center">
          {/* Winner Banner or VS Insignia */}
          {winner ? (
            <div className="w-full p-4 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-4 animate-bounce">
              <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-1.5" />
              <h4 className="font-uncial text-2xl font-bold text-amber-100">
                {winner.character.name} Triumphs!
              </h4>
              <p className="font-cinzel text-xs text-amber-300 tracking-wider mt-1 uppercase">
                Champion of the Eldoria Arena
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <div className="w-14 h-14 rounded-full bg-amber-950/80 border-2 border-amber-600/80 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Swords className="w-7 h-7 text-amber-400" />
              </div>
              <h4 className="font-uncial text-lg text-amber-200">
                Round {currentRound}
              </h4>
              <p className="text-xs font-cinzel text-stone-400">
                {isBattleActive ? 'Battle in Progress...' : 'Ready for Duel'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5 max-w-xs">
            {!winner ? (
              <>
                <button
                  onClick={executeNextTurn}
                  disabled={isAutoPlaying}
                  className="w-full py-2.5 px-4 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 border border-amber-200 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <StepForward className="w-4 h-4 text-stone-950" />
                  <span>Execute Round</span>
                </button>

                <button
                  onClick={() => setIsAutoPlaying(prev => !prev)}
                  className={`w-full py-2.5 px-4 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAutoPlaying
                      ? 'bg-amber-600/30 text-amber-200 border-amber-400'
                      : 'bg-stone-900 text-stone-200 border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
                  <span>{isAutoPlaying ? 'Pause Auto Battle' : 'Auto Simulate Battle'}</span>
                </button>
              </>
            ) : null}

            <button
              onClick={handleResetBattle}
              className="w-full py-2 px-4 rounded-xl font-cinzel text-xs text-stone-300 bg-stone-900 border border-stone-800 hover:text-amber-200 hover:border-amber-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Duel / Rematch</span>
            </button>
          </div>
        </div>

        {/* COMBATANT 2 CARD */}
        {combatant2 && (
          <div className={`lg:col-span-4 rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col justify-between ${
            combatant2.isHit 
              ? 'bg-red-950/70 border-red-500 scale-98 ring-4 ring-red-500/50' 
              : combatant2.isAttacking
                ? 'bg-amber-950/60 border-amber-400 scale-102 ring-2 ring-amber-400/60'
                : 'bg-stone-900/90 border-sky-900/50 shadow-xl'
          }`}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-sky-900/40">
                <span className="px-2 py-0.5 rounded text-[10px] font-cinzel font-bold uppercase bg-sky-950 text-sky-300 border border-sky-700/50">
                  Corner II
                </span>
                <span className="text-xs font-cinzel text-stone-400">
                  {combatant2.character.race} {combatant2.character.characterClass}
                </span>
              </div>

              {/* Portrait & Name */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={combatant2.character.currentPortraitStyle === 'cartoon' ? combatant2.character.cartoonPortraitUrl : combatant2.character.portraitUrl}
                  alt={combatant2.character.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-sky-600/60 shrink-0 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="font-uncial text-xl font-bold text-amber-100 truncate">
                    {combatant2.character.name}
                  </h3>
                  <p className="font-medieval italic text-xs text-amber-300/80 truncate">
                    {combatant2.character.title}
                  </p>
                  <p className="text-[11px] text-stone-400 font-cinzel mt-0.5">
                    STR: <strong className="text-amber-400">{combatant2.strength}</strong> · INT: <strong className="text-purple-400">{combatant2.intelligence}</strong>
                  </p>
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-red-400 font-cinzel font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-red-500" />
                    <span>Health</span>
                  </span>
                  <span className="tabular-nums font-bold text-red-200">
                    {combatant2.currentHp} / {combatant2.maxHp} HP
                  </span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-3 border border-red-900/60 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                    style={{ width: `${c2PercentHp}%` }}
                  />
                </div>
              </div>

              {/* Mana Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-sky-400 font-cinzel font-semibold">
                    <Droplet className="w-3.5 h-3.5 fill-sky-500" />
                    <span>Mana</span>
                  </span>
                  <span className="tabular-nums font-bold text-sky-200">
                    {combatant2.currentMp} / {combatant2.maxMp} MP
                  </span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-2.5 border border-sky-900/60 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${c2PercentMp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Armament summary */}
            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 space-y-0.5">
              <p className="truncate"><span className="text-amber-400 font-semibold">Weapon:</span> {combatant2.character.primaryWeapon}</p>
              <p className="truncate"><span className="text-purple-400 font-semibold">Signature:</span> {combatant2.character.signatureAbility}</p>
            </div>
          </div>
        )}
      </div>

      {/* BATTLE LOG PARCHMENT TERMINAL */}
      <div className="w-full rounded-2xl bg-stone-950 border-2 border-amber-900/60 p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-900/40">
          <span className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Grand Arena Combat Chronicle</span>
          </span>
          <span className="text-[11px] font-mono text-stone-500">
            {battleLogs.length} Actions Logged
          </span>
        </div>

        <div className="h-44 sm:h-52 overflow-y-auto space-y-2 pr-2 text-xs font-mono leading-relaxed">
          {battleLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-500 italic font-body text-sm">
              Press "Execute Round" or "Auto Simulate Battle" to begin the clash of champions!
            </div>
          ) : (
            battleLogs.map((log, idx) => (
              <div 
                key={idx}
                className={`p-2 rounded-lg border flex items-start gap-2.5 ${
                  log.isCrit
                    ? 'bg-amber-950/40 border-amber-500/70 text-amber-200'
                    : log.isMagic
                      ? 'bg-purple-950/30 border-purple-600/40 text-purple-200'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300'
                }`}
              >
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-700 shrink-0">
                  R{log.round}
                </span>
                <div className="flex-1 min-w-0">
                  <p>{log.message}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Impact: <span className="text-red-400 font-bold">-{log.damage} HP</span> · {log.defenderName} left with <span className="text-amber-300 font-bold">{log.defenderRemainingHp} HP</span>
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
