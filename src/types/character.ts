export type CharacterClass = 'Mage' | 'Rogue' | 'Warrior' | 'Cleric' | 'Ranger' | 'Paladin';

export type CharacterRace = 'Human' | 'Elf' | 'Dwarf' | 'Orc' | 'Halfling';

export type PortraitStyle = 'classic' | 'cartoon';

export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface RaceModifier {
  name: CharacterRace;
  tagline: string;
  bonusSummary: string;
  healthMod: number;
  manaMod: number;
  strengthMod: number;
  intelligenceMod: number;
  charismaMod: number;
}

export interface QuestHook {
  title: string;
  narrative: string; // 2-3 sentences based on backstory, class, and race
  location: string;
  threatLevel: 'Moderate' | 'Dangerous' | 'Deadly' | 'Mythic';
  reward: string;
}

export interface LockState {
  name: boolean;
  class: boolean;
  race: boolean;
  stats: boolean;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  fullName: string;
  characterClass: CharacterClass;
  race: CharacterRace;
  raceBonusDescription: string;
  raceModifier: RaceModifier;
  portraitUrl: string;
  cartoonPortraitUrl: string;
  currentPortraitStyle: PortraitStyle;
  activeCartoonVariant: number;
  gameAura: string;
  classTagline: string;
  primaryWeapon: string;
  signatureAbility: string;
  alignment: string;
  quirk: string;
  lore: string;
  questHook?: QuestHook;
  stats: CharacterStats;
  // Core Player Card Stats (5 primary stats)
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  intelligence: number;
  charisma: number;
  rarity: CardRarity;
  createdAt: number;
}

export interface ClassDefinition {
  name: CharacterClass;
  role: string;
  tagline: string;
  description: string;
  portraitUrl: string;
  cartoonPortraitUrl: string;
  color: {
    primary: string;
    border: string;
    accent: string;
    bgGlow: string;
  };
  primaryWeapons: string[];
  signatureAbilities: string[];
  statAffinities: {
    primary: keyof CharacterStats;
    secondary: keyof CharacterStats;
  };
  baseHealth: number;
  baseMana: number;
  baseStrength: number;
  baseIntelligence: number;
  baseCharisma: number;
}
