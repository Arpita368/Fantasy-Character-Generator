import React from 'react';
import { 
  X, 
  HelpCircle, 
  Dices, 
  Lock, 
  Award, 
  Layers, 
  Swords, 
  Download, 
  Compass, 
  Gamepad2, 
  Heart, 
  Droplet, 
  Sword,
  Sparkles
} from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-stone-950 border-2 border-amber-600/70 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-label="How to Play - Fantasy Character Generator Guide"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-amber-900/60 bg-stone-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/50">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-uncial text-xl font-bold text-amber-200">
                How to Play & Guide
              </h2>
              <p className="text-[11px] font-cinzel text-amber-500/80">
                Master the Alchemical Card Forge & Arena
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Sections */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm font-body">
          {/* Section 1: Forging & Controls */}
          <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-xs uppercase tracking-wider mb-2">
              <Dices className="w-4 h-4 text-amber-400" />
              <span>1. Forging & Controls</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Click the prominent <strong className="text-amber-200">"Generate Character"</strong> button or tap <kbd className="px-1.5 py-0.5 rounded bg-stone-950 border border-amber-700/60 text-[10px] text-amber-300 font-mono">Space</kbd> on your keyboard to conjure a random hero. You can select specific classes or races from the workbench toolbar, or leave them on random for procedural rolls.
            </p>
          </div>

          {/* Section 2: Attribute Locks */}
          <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-xs uppercase tracking-wider mb-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>2. Attribute Locks</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Click the <Lock className="inline w-3.5 h-3.5 text-amber-400 mx-0.5" /> lock icons next to <strong className="text-amber-200">Name</strong>, <strong className="text-amber-200">Class</strong>, <strong className="text-amber-200">Race</strong>, or <strong className="text-amber-200">Stats</strong> to lock them in place. When you click Generate again, only the unlocked attributes will reroll, allowing you to fine-tune your ideal adventurer.
            </p>
          </div>

          {/* Section 3: Class-Weighted Stats & Visual Bars */}
          <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>3. Class Stats & Visual Progress Bars</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Combat vitals are calculated with class specializations and racial traits, displayed as colored progress bars:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 font-mono text-[11px]">
              <li className="p-2 rounded bg-stone-950/80 border border-red-900/60 text-red-300">
                <strong>Warriors:</strong> High Health & Strength
              </li>
              <li className="p-2 rounded bg-stone-950/80 border border-sky-900/60 text-sky-300">
                <strong>Mages:</strong> High Mana & Intelligence
              </li>
              <li className="p-2 rounded bg-stone-950/80 border border-rose-900/60 text-rose-300">
                <strong>Rogues:</strong> Higher Charisma & Agility
              </li>
            </ul>
          </div>

          {/* Section 4: Art Styles & Quest Hooks */}
          <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-xs uppercase tracking-wider mb-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>4. Portraits, Backstories & Quest Hooks</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Toggle between <strong className="text-amber-200">Classic Oil</strong> and <strong className="text-amber-200">Cartoon Game Art</strong>, and randomize video-game auras. Click <strong className="text-amber-200">"Generate Backstory"</strong> for unique origins, or <strong className="text-amber-200">"Generate Quest Hook"</strong> to synthesize a 2–3 sentence mini-adventure tailored to your character's race, class, and weapon.
            </p>
          </div>

          {/* Section 5: My Deck, PNG Downloads & JSON Portability */}
          <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-xs uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>5. My Deck, PNG Download & JSON Export</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Click <strong className="text-amber-200">"Save to Deck"</strong> to persist heroes in your browser across sessions. Download a crisp PNG image card via <strong className="text-amber-200">"Download Card"</strong>, or copy full textual transcripts with <strong className="text-amber-200">"Copy as Text"</strong>. Export your full deck to JSON or import decks anytime.
            </p>
          </div>

          {/* Section 6: Turn-Based Battle Arena */}
          <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex items-center gap-2 text-red-400 font-cinzel font-bold text-xs uppercase tracking-wider mb-2">
              <Swords className="w-4 h-4 text-red-400" />
              <span>6. Turn-Based Battle Arena</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Switch to the <strong className="text-amber-200">Battle</strong> tab to pit any two champions from your deck against each other. Combat damage is dynamically calculated from <strong className="text-red-400">Health</strong>, <strong className="text-amber-400">Strength</strong>, and <strong className="text-sky-400">Mana</strong>, featuring physical weapon strikes, signature magical abilities, critical strikes, and a real-time combat chronicle.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/90 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-md hover:from-amber-300 hover:to-yellow-400 cursor-pointer"
          >
            Got It, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
