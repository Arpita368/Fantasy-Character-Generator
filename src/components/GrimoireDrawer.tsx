import React from 'react';
import { Character } from '../types/character';
import { CLASS_DEFINITIONS } from '../data/fantasyData';
import { X, Trash2, ArrowUpRight, BookOpen, Shield } from 'lucide-react';

interface GrimoireDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCharacters: Character[];
  onSelectCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onClearAll: () => void;
}

export const GrimoireDrawer: React.FC<GrimoireDrawerProps> = ({
  isOpen,
  onClose,
  savedCharacters,
  onSelectCharacter,
  onDeleteCharacter,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-stone-900 border-l border-amber-600/40 h-full flex flex-col p-6 shadow-2xl text-stone-200"
        role="dialog"
        aria-label="Saved Adventurers Roster"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-200">
              Hall of Adventurers
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            aria-label="Close roster"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-2 text-xs text-stone-400 flex justify-between items-center">
          <span>{savedCharacters.length} heroes preserved</span>
          {savedCharacters.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
            >
              Clear Roster
            </button>
          )}
        </div>

        {/* List of Characters */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-2">
          {savedCharacters.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <Shield className="w-10 h-10 mb-3 stroke-[1.5] text-amber-600/30" />
              <p className="font-cinzel text-sm font-semibold text-stone-400">
                The Hall is Empty
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Save generated heroes to keep a record of your favorite rolls.
              </p>
            </div>
          ) : (
            savedCharacters.map((char) => {
              const classDef = CLASS_DEFINITIONS[char.characterClass];
              return (
                <div
                  key={char.id}
                  className="group relative rounded-lg bg-stone-950/70 border border-stone-800 hover:border-amber-600/50 p-3 flex gap-3 items-center transition-all"
                >
                  <img
                    src={char.currentPortraitStyle === 'cartoon' ? char.cartoonPortraitUrl : char.portraitUrl}
                    alt={char.name}
                    className="w-14 h-14 rounded object-cover border border-amber-700/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cinzel text-sm font-bold text-amber-200 truncate">
                      {char.name}
                    </h4>
                    <p className="text-xs text-stone-400 italic truncate font-body">
                      {char.title}
                    </p>
                    <p className="text-[11px] text-amber-500/80 font-cinzel mt-0.5">
                      {char.characterClass} · <span className="text-stone-400">{char.race}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectCharacter(char);
                        onClose();
                      }}
                      className="p-1.5 rounded bg-stone-800 text-stone-300 hover:text-amber-200 hover:bg-stone-700 transition-colors"
                      title="Inspect this adventurer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCharacter(char.id)}
                      className="p-1.5 rounded text-stone-500 hover:text-red-400 transition-colors"
                      title="Remove from roster"
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
            className="w-full py-2 text-xs font-cinzel tracking-wider uppercase bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors"
          >
            Close Grimoire
          </button>
        </div>
      </div>
    </div>
  );
};
