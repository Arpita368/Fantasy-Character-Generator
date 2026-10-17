import { 
  Character, 
  CharacterClass, 
  ClassDefinition, 
  CharacterStats, 
  CardRarity, 
  CharacterRace, 
  RaceModifier,
  QuestHook,
  LockState 
} from '../types/character';

export const GAME_AURAS: Record<CharacterClass, string[]> = {
  Mage: [
    'Astral Supernova Glow',
    'Arcane Void Resonance',
    'Chrono-Temporal Sparkles',
    'Glacial Crystal Frost',
  ],
  Warrior: [
    'Dragonfire Berserker Fury',
    'Molten Iron Embers',
    'Thunderous Shockwave Wave',
    'Battle-Hardened Crest Aura',
  ],
  Rogue: [
    'Shadow Mist Veil',
    'Toxic Emerald Vapor',
    'Phantom Night Mirage',
    'Moonlit Blade Glint',
  ],
  Cleric: [
    'Solar Sunburst Luminescence',
    'Holy Golden Corona',
    'Angelic Feather Wings',
    'Cleansing Divine Radiance',
  ],
  Ranger: [
    'Sylvan Spirit Wisps',
    'Autumn Wind Swirl',
    'Verdant Nature Brambles',
    'Predator Instinct Gleam',
  ],
  Paladin: [
    'Radiant Aegis of Dawn',
    'Flaming Lion Crest',
    'Solar Judgement Beam',
    'Consecrated Bastion Corona',
  ],
};

export const RACES: CharacterRace[] = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling'];

export const RACE_MODIFIERS: Record<CharacterRace, RaceModifier> = {
  Human: {
    name: 'Human',
    tagline: 'Adaptable Pioneers of the Realm',
    bonusSummary: '+10 HP, +10 MP, +5 STR, +5 INT, +5 CHA',
    healthMod: 10,
    manaMod: 10,
    strengthMod: 5,
    intelligenceMod: 5,
    charismaMod: 5,
  },
  Elf: {
    name: 'Elf',
    tagline: 'Ancient Weavers of the Astral Starlight',
    bonusSummary: '+30 MP, +15 INT, -10 STR, -10 HP',
    healthMod: -10,
    manaMod: 30,
    strengthMod: -10,
    intelligenceMod: 15,
    charismaMod: 5,
  },
  Dwarf: {
    name: 'Dwarf',
    tagline: 'Indomitable Keepers of Deep Mountain Forges',
    bonusSummary: '+35 HP, +15 STR, -20 MP, -8 CHA',
    healthMod: 35,
    manaMod: -20,
    strengthMod: 15,
    intelligenceMod: 0,
    charismaMod: -8,
  },
  Orc: {
    name: 'Orc',
    tagline: 'Unyielding Vanguard of the Sunken Steppes',
    bonusSummary: '+25 STR, +20 HP, -25 MP, -12 INT',
    healthMod: 20,
    manaMod: -25,
    strengthMod: 25,
    intelligenceMod: -12,
    charismaMod: -5,
  },
  Halfling: {
    name: 'Halfling',
    tagline: 'Nimble Wayfarers Blessed with Uncanny Luck',
    bonusSummary: '+20 CHA, +15 MP, -18 STR, -5 HP',
    healthMod: -5,
    manaMod: 15,
    strengthMod: -18,
    intelligenceMod: 5,
    charismaMod: 20,
  },
};

// Base stats configured so:
// - Warriors have higher Strength (95 base) and Health (160 base)
// - Mages have higher Mana (195 base) and Intelligence (98 base)
// - Rogues have higher Charisma (95 base)
export const CLASS_DEFINITIONS: Record<CharacterClass, ClassDefinition> = {
  Warrior: {
    name: 'Warrior',
    role: 'Vanguard Champion',
    tagline: 'Stalwart Bulwark of Steel & Unyielding Might',
    description: 'Frontline juggernauts clad in masterwork plate armor, trained in martial discipline to break enemy ranks and defend their allies.',
    portraitUrl: '/src/assets/images/class_warrior_portrait_1792256164046.jpg',
    cartoonPortraitUrl: '/src/assets/images/cartoon_warrior_game_art_1792256474520.jpg',
    color: {
      primary: 'text-amber-500',
      border: 'border-amber-600/50',
      accent: 'bg-amber-950/80 text-amber-300',
      bgGlow: 'from-amber-600/20 via-red-600/10 to-transparent',
    },
    primaryWeapons: [
      'Runic Broadsword & Spiked Kite Shield',
      'Dragon-Forged Zweihänder',
      'Heavy Greataxe of the Mountain Kings',
      'Twin Flanged Warhammers',
    ],
    signatureAbilities: [
      'Whirlwind Cleave',
      'Unstoppable Battle Roar',
      'Shield Bash & Earthshatter',
      'Ironclad Last Stand',
    ],
    statAffinities: {
      primary: 'strength',
      secondary: 'constitution',
    },
    // Warriors: High Health & High Strength
    baseHealth: 160,
    baseMana: 40,
    baseStrength: 96,
    baseIntelligence: 44,
    baseCharisma: 56,
  },
  Mage: {
    name: 'Mage',
    role: 'Arcane Scholar',
    tagline: 'Weaver of Astral Runes & Primordial Elements',
    description: 'Masters of the arcane mysteries who manipulate cosmic reality, commanding devastating spellstorms and ancient enchantments.',
    portraitUrl: '/src/assets/images/class_mage_portrait_1792256163170.jpg',
    cartoonPortraitUrl: '/src/assets/images/cartoon_mage_game_art_1792256473324.jpg',
    color: {
      primary: 'text-indigo-400',
      border: 'border-indigo-500/50',
      accent: 'bg-indigo-950/80 text-indigo-300',
      bgGlow: 'from-indigo-600/20 via-purple-600/10 to-transparent',
    },
    primaryWeapons: [
      'Staff of Astral Resonance',
      'Crystalline Spell-Focus Wand',
      'Tome of the Seven Seals & Silver Athame',
      'Arcanist Orb of Frozen Starlight',
    ],
    signatureAbilities: [
      'Supernova Cascade',
      'Time Warp & Chrono Rift',
      'Glacial Blizzard Lance',
      'Arcane Null-Field Barrier',
    ],
    statAffinities: {
      primary: 'intelligence',
      secondary: 'wisdom',
    },
    // Mages: High Mana & High Intelligence
    baseHealth: 82,
    baseMana: 195,
    baseStrength: 40,
    baseIntelligence: 98,
    baseCharisma: 64,
  },
  Rogue: {
    name: 'Rogue',
    role: 'Shadow Infiltrator',
    tagline: 'Silent Whisper in the Night & Master of Cunning',
    description: 'Agile scoundrels and deadly phantoms who strike from the shadows, picking impossible locks and disarming traps with lethal precision.',
    portraitUrl: '/src/assets/images/class_rogue_portrait_1792256163949.jpg',
    cartoonPortraitUrl: '/src/assets/images/cartoon_rogue_game_art_1792256475280.jpg',
    color: {
      primary: 'text-emerald-400',
      border: 'border-emerald-500/50',
      accent: 'bg-emerald-950/80 text-emerald-300',
      bgGlow: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    },
    primaryWeapons: [
      'Twin Serrated Shadowglass Daggers',
      'Concealed Repeating Wrist-Crossbow',
      'Venom-Tipped Stiletto & Smoke Bombs',
      'Ghost-Steel Rapier & Parrying Dagger',
    ],
    signatureAbilities: [
      'Shadowstep Ambush',
      'Lethal Hemorrhage Flurry',
      'Vanish & Smoke Veil',
      'Acrobatic Slipstream Strike',
    ],
    statAffinities: {
      primary: 'dexterity',
      secondary: 'charisma',
    },
    // Rogues: Higher Charisma
    baseHealth: 110,
    baseMana: 85,
    baseStrength: 66,
    baseIntelligence: 75,
    baseCharisma: 96,
  },
  Cleric: {
    name: 'Cleric',
    role: 'Divine Emissary',
    tagline: 'Beacon of Sacred Dawn & Miraculous Grace',
    description: 'Holy conduits of celestial power who mend shattered bodies, consecrate desecrated sanctums, and purge the unholy with burning dawnlight.',
    portraitUrl: '/src/assets/images/class_cleric_portrait_1792256163148.jpg',
    cartoonPortraitUrl: '/src/assets/images/cartoon_cleric_game_art_1792256475739.jpg',
    color: {
      primary: 'text-amber-300',
      border: 'border-amber-400/50',
      accent: 'bg-stone-900/90 text-amber-200',
      bgGlow: 'from-amber-400/20 via-yellow-500/10 to-transparent',
    },
    primaryWeapons: [
      'Consecrated Sunburst Morningstar & Holy Reliquary',
      'Silver Flanged Mace of the High Patriarch',
      'Carved Cedar Staff of Radiant Dawn',
      'Blessed Tower Kite with Solar Crest',
    ],
    signatureAbilities: [
      'Dawnfire Sanctuary',
      'Resurrection Miracle',
      'Purifying Smite of Heaven',
      'Aegis of the Sun Queen',
    ],
    statAffinities: {
      primary: 'wisdom',
      secondary: 'constitution',
    },
    baseHealth: 132,
    baseMana: 162,
    baseStrength: 66,
    baseIntelligence: 76,
    baseCharisma: 84,
  },
  Ranger: {
    name: 'Ranger',
    role: 'Wilderness Scout',
    tagline: 'Ghost of the Ancient Forest & Silent Pathfinder',
    description: 'Peerless trackers and deadly archers who survive in the harshest untamed frontiers, speaking the secret tongues of beasts and trees.',
    portraitUrl: '/src/assets/images/class_ranger_portrait_1792256163884.jpg',
    cartoonPortraitUrl: '/src/assets/images/cartoon_ranger_game_art_1792256476106.jpg',
    color: {
      primary: 'text-lime-400',
      border: 'border-lime-500/50',
      accent: 'bg-lime-950/80 text-lime-300',
      bgGlow: 'from-lime-600/20 via-emerald-600/10 to-transparent',
    },
    primaryWeapons: [
      'Heartwood Recurve Greatbow & Silver Bodkin Arrows',
      'Twin Damascus Hunting Hatchets',
      'Long-Reach Ashwood Spear & Bolas',
      'Rune-Carved Elven Shortsword & Hunting Horn',
    ],
    signatureAbilities: [
      'Hail of Piercing Thorns',
      'Camouflage & Shadowmeld',
      'Predator Call of the Direwolf',
      'Heartseeker Snipe',
    ],
    statAffinities: {
      primary: 'dexterity',
      secondary: 'wisdom',
    },
    baseHealth: 122,
    baseMana: 105,
    baseStrength: 75,
    baseIntelligence: 70,
    baseCharisma: 66,
  },
  Paladin: {
    name: 'Paladin',
    role: 'Holy Crusader',
    tagline: 'Sworn Blade of Justice & Radiant Bastion',
    description: 'Armored knights bound by inviolable sacred oaths, radiating blinding righteous fury and defending the innocent against apocalyptic shadows.',
    portraitUrl: '/src/assets/images/class_paladin_portrait_1792256164229.jpg',
    cartoonPortraitUrl: '/src/assets/images/cartoon_paladin_game_art_1792256476219.jpg',
    color: {
      primary: 'text-yellow-400',
      border: 'border-yellow-500/50',
      accent: 'bg-stone-900/90 text-yellow-200',
      bgGlow: 'from-yellow-500/20 via-amber-600/10 to-transparent',
    },
    primaryWeapons: [
      'Blazing Sunblade & Engraved Lion Kite Shield',
      'Two-Handed Holy Executioner Greatsword',
      'Gilded Halberd of the Order of Light',
      'Masterwork Flail of the Inquisitor',
    ],
    signatureAbilities: [
      'Radiant Solar Smite',
      'Lay on Hands & Restoration',
      'Aura of Inflexible Courage',
      'Wrath of the Solar Champion',
    ],
    statAffinities: {
      primary: 'strength',
      secondary: 'charisma',
    },
    baseHealth: 148,
    baseMana: 115,
    baseStrength: 88,
    baseIntelligence: 66,
    baseCharisma: 90,
  },
};

export const NAME_PREFIXES = [
  'Ael', 'Thal', 'Bryn', 'Kael', 'Mor', 'Vael', 'Eld', 'Tor', 'Fen', 'Dar',
  'Syl', 'Xyl', 'Zeph', 'Rav', 'Cor', 'Bran', 'Lys', 'Oth', 'Bel', 'Gor',
  'Al', 'Eir', 'Fael', 'Garr', 'Hald', 'Ill', 'Jor', 'Krag', 'Lorn', 'Mal',
  'Nym', 'Or', 'Per', 'Quen', 'Ryn', 'Ser', 'Tark', 'Ul', 'Val', 'Wulf',
  'Yv', 'Zor', 'Cael', 'Drak', 'Eow', 'Farr', 'Grim', 'Haer', 'Isil', 'Khor',
];

export const NAME_CORES = [
  'dor', 'mar', 'vash', 'wen', 'gorn', 'thas', 'ion', 'del', 'wyn', 'khor',
  'mir', 'grim', 'ren', 'lith', 'drak', 'bor', 'dan', 'fel', 'gar', 'hin',
  'kar', 'lan', 'mon', 'nor', 'quin', 'rad', 'sar', 'tin', 'var', 'zor',
  'alor', 'aris', 'ath', 'diel', 'elor', 'endir', 'eth', 'ian', 'ilas', 'orin',
  'ram', 'ric', 'thor', 'val', 'vorn', 'wick', 'mund', 'brand', 'ward', 'helm',
];

export const NAME_SUFFIXES = [
  'ius', 'or', 'a', 'ia', 'en', 'is', 'an', 'iel', 'ar', 'os',
  'in', 'ath', 'eth', 'on', 'ard', 'und', 'ric', 'as', 'yr', 'al',
  'yn', 'ok', 'esh', 'ea', 'us', 'um', 'ax', 'ix', 'ex', 'or',
];

export const TITLES = [
  'the Sunweaver',
  'Shadowstrider',
  'of the Iron Crags',
  'the Undaunted',
  'the Spell-Forged',
  'of the Whispering Woods',
  'Stormwhisper',
  'Drakeblood',
  'the Unbroken',
  'the Silver Hand',
  'the Silent Fang',
  'of House Valerius',
  'Oathkeeper',
  'the Starwatcher',
  'Shield of the Realm',
  'the Moonseeker',
  'the Ironheart',
  'of the High Spire',
  'Bane of Wyrms',
  'the Dawnwarden',
  'the Relentless',
  'of the Frost Peak',
  'the Emberblade',
  'Ghost of the Mire',
];

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
];

export const QUIRKS = [
  'Never sleeps without a silver coin beneath their pillow.',
  'Carries an ancient map to a city that is said to never exist.',
  'Hums forgotten tavern songs from childhood when entering battle.',
  'Refuses to cross running water without saluting the river spirits.',
  'Keeps a tiny pressed frostflower from their snowy ancestral homeland.',
  'Obsessively inspects every door handle twice before turning it.',
  'Speaks softly to their blade as if it were a loyal hound.',
  'Wears an enigmatic signet ring whose crest matches no known nobility.',
  'Can accurately predict heavy thunderstorms by an old wound in their shoulder.',
  'Always leaves a warm loaf of bread at roadside traveler shrines.',
];

export const ORIGIN_INCIDENTS: Record<CharacterClass, string[]> = {
  Warrior: [
    'The sole survivor of the Ironfang Siege, bearing the cracked standard of a lost vanguard regiment.',
    'Forged their own ancestral broadsword in the volcanic bellows of Mount Kar-Krag after defeating the clan champion.',
    'Renounced high feudal titles and aristocratic banquets to protect humble pilgrim caravans across the badlands.',
    'Carved their legend in the brutal gladiatorial pits of Oakhaven before leading a daring slave revolt into the crags.',
    'Orphaned in the burning of the western watchtowers, they were raised by veteran mercenaries who taught them to trust steel above all else.',
    'Survived a fatal spear thrust through the chest by sheer stubborn will, swearing to never fall so long as an innocent stands behind them.',
    'Exiled from their mountain stronghold for refusing to execute a captive banneret, wandering the frontier as an unyielding sentinel.',
    'Bears the heavy battle-scars of thirty-two skirmishes along the shattered border, their armor fused with enchanted iron rivets.',
  ],
  Mage: [
    'Banished from the Celestial Academy after deciphering a sealed starchart that whispered forbidden prophecies.',
    'Born during a celestial alignment in the floating spires of Aethelgard, where cosmic leylines permanently etched glowing runes across their skin.',
    'Spent seven solitary winters atop the Spire of Echoes transcribing primordial cantrips from an elder crystal.',
    'Discovered an ancient astral rift beneath their family\'s apothecary, absorbing a dormant spark of chronomancy.',
    'Apprenticed to an eccentric hermit alchemist who mysteriously dissolved into stardust, leaving behind a locked silver grimoire.',
    'Awakened their dormant spellcraft while defending an ancient library from a destructive siege of shadow beasts.',
    'Bound a fragment of fallen meteor starfire into their crystal wand during a midnight solstice ritual.',
    'Survives as the last apprentice of the Sunken Spire, guarding memory crystals containing ten centuries of arcane formulae.',
  ],
  Rogue: [
    'Once slipped past the sovereign wardens of the Sunken Vault and vanished into the fog with a single emerald ring.',
    'Raised amidst the shadowed rooftops of the capital, surviving by razor wit and unmatched sleight of hand.',
    'Maintains three distinct identities across merchant guilds, known only as the Pale Phantom in underground circles.',
    'Escaped the executioner\'s block by picking the master padlock with a bent silver hairneedle stolen from the magistrate\'s wife.',
    'Betrayed by their former guildmaster during a high-stakes midnight heist, they now operate in the dark with a lethal vendetta.',
    'Trained in the silent art of assassination in the shrouded alleys of the Obsidian Docks before cutting ties with blood.',
    'Stole an enchanted map from an inquisitor\'s carriage that reveals secret passageways beneath every fortress in Eldoria.',
    'Won their freedom in a high-stakes game of loaded bone dice against a demon disguised as a Venetian merchant.',
  ],
  Cleric: [
    'Spared by divine providence during the Ash Plague, dedicating every waking dawn to healing the afflicted.',
    'Hears the golden clarion call of the Dawn Matron even amidst the deafening chaos of clashing armies.',
    'Traveled through haunted barrows for three moons to sanctify ancestral tombs desecrated by necromancers.',
    'Found as an abandoned infant upon the marble altar of the Sunburst Monastery during a solar eclipse.',
    'A former court physician who abandoned royal opulence after witnessing an angel of mercy heal a dying beggar in the gutter.',
    'Survived three days lost in the Abyssal Catacombs guided only by a softly glowing holy relic clutched to their chest.',
    'Consecrated their silver mace at the Well of Dawns, swearing to bring cleansing radiance to the darkest corners of the realm.',
    'Spent their novice years in silent contemplative prayer beneath a weeping statue that bled pure molten gold.',
  ],
  Ranger: [
    'Can track the faint scent of crushed mountain pine over three days of torrential autumn rain.',
    'Raised by the Wardens of the Deep Bough after being found nestled beside a sleeping direwolf cub.',
    'Guards the fragile borderline between the civilized farming valleys and the primordial untamed wilderness.',
    'Watched their ancestral forest burn in an alchemical wildfire, swearing vengeance against the guild barons who ordered the blight.',
    'Crossed the frozen passes of the Wyrmtooth Peaks alone, surviving a winter blizzard by befriending a giant mountain eagle.',
    'Blessed by an ancient sylvan dryad at the edge of the Whispering Mere, rendering their footfalls as silent as falling snow.',
    'A master marksman whose arrows have shattered dragon scales and severed execution ropes from three hundred paces.',
    'Patrols the forgotten beast trails of the Old World, where monsters from forgotten myth still stalk the twilight.',
  ],
  Paladin: [
    'Swore the sacred Oath of the Morning Star upon the shattered ruins of their childhood sanctuary.',
    'Refused an imperial pardon because doing so would have compromised a vow made to a fallen squire.',
    'Channels righteous solar fury through their blade, illuminating dark caverns with the warm glow of midday.',
    'Kneeled before a dying seraph on a blood-soaked battlefield, receiving an anointed spark of celestial righteousness.',
    'Cast aside the corrupt heraldry of their noble house to defend destitute outcasts from extortionate tax barons.',
    'Defended a mountain pass for an entire night against waves of undead ghouls, standing alone until the sunrise broke.',
    'Bears the radiant emblem of the Lion Sovereign etched into their breastplate, an infallible beacon of hope for the oppressed.',
    'Survives as the living custodian of the White Flame, a sacred fire said to burn away both physical illness and spiritual taint.',
  ],
};

export const ORIGIN_DESTINIES = [
  'Now heralded across taverns as {title}, they wander the frontier with {primaryWeapon} ready to defy any peril.',
  'Bound by an inviolable oath of vengeance and honor, they will not lay down their arms until Eldoria is cleansed of corruption.',
  'Guided by ancient instinct and the proud traditions of their {race} lineage, they seek to uncover the lost relics of the First Age.',
  'With {signatureAbility} mastered through years of relentless discipline, they offer their allegiance only to causes worthy of their code.',
  'Carrying the weight of a solemn promise to the fallen, they press forward into the shadowy unknown without a shred of hesitation.',
  'Their path is fraught with deadly foes, yet every tavern bard whispers that destiny has marked {name} for eternal glory.',
  'Driven by an insatiable yearning for justice, they roam the wildlands balancing the scales wherever tyranny holds sway.',
  'Every dawn finds them one step closer to their elusive fate, leaving a trail of vanquished monstrosities in their wake.',
];

export const LORE_SNIPPETS: Record<CharacterClass, string[]> = ORIGIN_INCIDENTS;

export function generateUniqueBackstory(character: Character): string {
  const incidents = ORIGIN_INCIDENTS[character.characterClass];
  let incident = getRandomItem(incidents);
  if (character.lore.startsWith(incident) && incidents.length > 1) {
    const others = incidents.filter(i => !character.lore.startsWith(i));
    if (others.length > 0) {
      incident = getRandomItem(others);
    }
  }

  const destinyTemplate = getRandomItem(ORIGIN_DESTINIES);
  const destiny = destinyTemplate
    .replace('{title}', character.title)
    .replace('{name}', character.name)
    .replace('{race}', character.race)
    .replace('{primaryWeapon}', character.primaryWeapon)
    .replace('{signatureAbility}', character.signatureAbility);

  return `${incident} ${destiny}`;
}

// Generates a short mini-adventure (2-3 sentences) based on the character's backstory, class, and race
export function generateQuestHook(character: Character): QuestHook {
  const templates = [
    {
      title: `The Oath of ${character.race} Blood`,
      threatLevel: 'Dangerous' as const,
      location: 'The Ironfang Crags',
      reward: '750 Gold Sovereigns and the Runed Sigil of the Realm',
      buildNarrative: (c: Character) => 
        `Because ${c.name} is a renowned ${c.race} ${c.characterClass} who once ${c.lore.slice(0, 50).toLowerCase()}..., word has reached the high fortress that an old enemy has seized the frontier pass. Arming themselves with their ${c.primaryWeapon}, they must march into the jagged caverns before the seasonal eclipse begins. Only their mastery of ${c.signatureAbility} can breach the fortified inner sanctum and bring justice to the realm.`
    },
    {
      title: `Shadows over the Sylvan Leyline`,
      threatLevel: 'Mythic' as const,
      location: 'The Sunken Spires of Aethelgard',
      reward: 'Primordial Leyline Keystone (+25 Max Mana) and Ancient Titles',
      buildNarrative: (c: Character) => 
        `Disturbances echoing ${c.name}'s origin have manifested across the leyline conduits of Eldoria, threatening to tear the fabric between realms. As a battle-tested ${c.characterClass} hailing from proud ${c.race} heritage, ${c.name} is summoned by the Circle of Elders to venture into the Sunken Spires. Wielding their ${c.primaryWeapon}, they must dispel the corrupted anomalies using ${c.signatureAbility} before the cataclysm becomes irreversible.`
    },
    {
      title: `The Siege of Dun-Kael Fortress`,
      threatLevel: 'Deadly' as const,
      location: 'Dun-Kael Fortress',
      reward: 'Masterwork Armor Relic (+30 Max Health) and 1,200 Silver Ingots',
      buildNarrative: (c: Character) => 
        `A renegade warband has blockaded Dun-Kael Fortress, trapping helpless refugees who cry out for a champion of ${c.race} grit. Having survived the trials of being a ${c.characterClass}, ${c.name} accepts the desperate contract and scouts the perimeter under cover of night. By unleashing ${c.signatureAbility} through their trusted ${c.primaryWeapon}, they intend to dismantle the siege engines and claim retribution for the fallen.`
    },
    {
      title: `The Lost Heist of House Valerius`,
      threatLevel: 'Moderate' as const,
      location: 'The Obsidian Docks of Eldoria',
      reward: 'Shadowglass Relic and Safe Passage Across All Sovereign Borders',
      buildNarrative: (c: Character) => 
        `Whispers of ${c.name}'s past dealings have reached the underworld syndicates lurking near the misty obsidian docks. Leveraging the keen instincts of their ${c.race} lineage, this intrepid ${c.characterClass} must infiltrate a heavily guarded merchant flagship carrying stolen celestial relics. With ${c.primaryWeapon} drawn and ${c.signatureAbility} at the ready, ${c.name} has only until high tide to recover the artifacts and slip into the fog.`
    },
  ];

  const selected = getRandomItem(templates);
  return {
    title: selected.title,
    threatLevel: selected.threatLevel,
    location: selected.location,
    reward: selected.reward,
    narrative: selected.buildNarrative(character),
  };
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function rollStat(primary: boolean = false, secondary: boolean = false): number {
  const d6 = () => Math.floor(Math.random() * 6) + 1;
  const rolls = [d6(), d6(), d6(), d6()];
  rolls.sort((a, b) => b - a);
  let base = rolls[0] + rolls[1] + rolls[2];
  
  if (primary) {
    base = Math.max(base, 14 + Math.floor(Math.random() * 5));
  } else if (secondary) {
    base = Math.max(base, 12 + Math.floor(Math.random() * 5));
  }
  return Math.min(18, Math.max(8, base));
}

export function generateRandomName(): { firstName: string; title: string; fullName: string } {
  const prefix = getRandomItem(NAME_PREFIXES);
  const core = getRandomItem(NAME_CORES);
  
  const useSuffix = Math.random() > 0.3;
  const firstName = useSuffix 
    ? `${prefix}${core}${getRandomItem(NAME_SUFFIXES)}`
    : `${prefix}${core}`;

  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const title = getRandomItem(TITLES);
  
  return {
    firstName: formattedName,
    title,
    fullName: `${formattedName} ${title}`,
  };
}

// Calculate the 5 combat vitals based strictly on class affinities + random variance within range + race modifiers
export function calculateClassStats(
  characterClass: CharacterClass, 
  race: CharacterRace
): {
  health: number;
  mana: number;
  strength: number;
  intelligence: number;
  charisma: number;
} {
  const classDef = CLASS_DEFINITIONS[characterClass];
  const raceMod = RACE_MODIFIERS[race];

  // Specific class variances:
  // - Warriors have higher Strength and Health
  // - Mages have higher Mana and Intelligence
  // - Rogues have higher Charisma
  // Each has controlled randomness (variance) within its thematic range:
  const healthRnd = Math.floor(Math.random() * 15) - 7;
  const manaRnd = Math.floor(Math.random() * 15) - 7;
  const strRnd = Math.floor(Math.random() * 9) - 4;
  const intRnd = Math.floor(Math.random() * 9) - 4;
  const chaRnd = Math.floor(Math.random() * 9) - 4;

  const health = Math.max(45, classDef.baseHealth + healthRnd + raceMod.healthMod);
  const mana = Math.max(15, classDef.baseMana + manaRnd + raceMod.manaMod);
  const strength = Math.max(20, classDef.baseStrength + strRnd + raceMod.strengthMod);
  const intelligence = Math.max(20, classDef.baseIntelligence + intRnd + raceMod.intelligenceMod);
  const charisma = Math.max(20, classDef.baseCharisma + chaRnd + raceMod.charismaMod);

  return {
    health,
    mana,
    strength,
    intelligence,
    charisma,
  };
}

export function generateCharacter(
  forcedClass?: CharacterClass, 
  forcedRace?: CharacterRace
): Character {
  const availableClasses: CharacterClass[] = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger', 'Paladin'];
  const characterClass = forcedClass && availableClasses.includes(forcedClass)
    ? forcedClass
    : getRandomItem(availableClasses);

  const race: CharacterRace = forcedRace && RACES.includes(forcedRace)
    ? forcedRace
    : getRandomItem(RACES);

  const raceMod = RACE_MODIFIERS[race];
  const classDef = CLASS_DEFINITIONS[characterClass];
  const { firstName, title, fullName } = generateRandomName();
  const alignment = getRandomItem(ALIGNMENTS);
  const quirk = getRandomItem(QUIRKS);
  const lore = getRandomItem(LORE_SNIPPETS[characterClass]);
  const primaryWeapon = getRandomItem(classDef.primaryWeapons);
  const signatureAbility = getRandomItem(classDef.signatureAbilities);
  const auras = GAME_AURAS[characterClass];
  const gameAura = auras[0];

  // Ability Matrix Scores
  const stats: CharacterStats = {
    strength: rollStat(
      classDef.statAffinities.primary === 'strength',
      classDef.statAffinities.secondary === 'strength'
    ),
    dexterity: rollStat(
      classDef.statAffinities.primary === 'dexterity',
      classDef.statAffinities.secondary === 'dexterity'
    ),
    constitution: rollStat(
      classDef.statAffinities.primary === 'constitution',
      classDef.statAffinities.secondary === 'constitution'
    ),
    intelligence: rollStat(
      classDef.statAffinities.primary === 'intelligence',
      classDef.statAffinities.secondary === 'intelligence'
    ),
    wisdom: rollStat(
      classDef.statAffinities.primary === 'wisdom',
      classDef.statAffinities.secondary === 'wisdom'
    ),
    charisma: rollStat(
      classDef.statAffinities.primary === 'charisma',
      classDef.statAffinities.secondary === 'charisma'
    ),
  };

  const { health, mana, strength, intelligence, charisma } = calculateClassStats(characterClass, race);

  // Rarity roll
  const rarityRoll = Math.random();
  let rarity: CardRarity = 'Common';
  if (rarityRoll > 0.93) rarity = 'Legendary';
  else if (rarityRoll > 0.75) rarity = 'Epic';
  else if (rarityRoll > 0.45) rarity = 'Rare';

  const baseChar: Character = {
    id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: firstName,
    title,
    fullName,
    characterClass,
    race,
    raceBonusDescription: raceMod.bonusSummary,
    raceModifier: raceMod,
    portraitUrl: classDef.portraitUrl,
    cartoonPortraitUrl: classDef.cartoonPortraitUrl,
    currentPortraitStyle: 'classic',
    activeCartoonVariant: 0,
    gameAura,
    classTagline: classDef.tagline,
    primaryWeapon,
    signatureAbility,
    alignment,
    quirk,
    lore,
    stats,
    health,
    maxHealth: health,
    mana,
    maxMana: mana,
    strength,
    intelligence,
    charisma,
    rarity,
    createdAt: Date.now(),
  };

  baseChar.questHook = generateQuestHook(baseChar);

  return baseChar;
}

// Generate with Locks: respects locked Name, Class, Race, and Stats!
export function generateCharacterWithLocks(
  currentChar: Character | null,
  locks: LockState,
  forcedClass?: CharacterClass,
  forcedRace?: CharacterRace
): Character {
  if (!currentChar) {
    return generateCharacter(forcedClass, forcedRace);
  }

  // 1. Determine Class
  const availableClasses: CharacterClass[] = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger', 'Paladin'];
  let characterClass: CharacterClass;
  if (locks.class) {
    characterClass = currentChar.characterClass;
  } else if (forcedClass && availableClasses.includes(forcedClass)) {
    characterClass = forcedClass;
  } else {
    characterClass = getRandomItem(availableClasses);
  }

  // 2. Determine Race
  let race: CharacterRace;
  if (locks.race) {
    race = currentChar.race;
  } else if (forcedRace && RACES.includes(forcedRace)) {
    race = forcedRace;
  } else {
    race = getRandomItem(RACES);
  }

  const raceMod = RACE_MODIFIERS[race];
  const classDef = CLASS_DEFINITIONS[characterClass];

  // 3. Determine Name & Title
  let firstName = currentChar.name;
  let title = currentChar.title;
  let fullName = currentChar.fullName;
  if (!locks.name) {
    const rolledName = generateRandomName();
    firstName = rolledName.firstName;
    title = rolledName.title;
    fullName = rolledName.fullName;
  }

  // 4. Determine Weapons, Ability, Aura, Lore
  const primaryWeapon = locks.class 
    ? currentChar.primaryWeapon 
    : getRandomItem(classDef.primaryWeapons);
  const signatureAbility = locks.class 
    ? currentChar.signatureAbility 
    : getRandomItem(classDef.signatureAbilities);
  const auras = GAME_AURAS[characterClass];
  const gameAura = locks.class ? currentChar.gameAura : auras[0];
  const lore = locks.class && locks.name 
    ? currentChar.lore 
    : getRandomItem(LORE_SNIPPETS[characterClass]);
  const quirk = getRandomItem(QUIRKS);
  const alignment = getRandomItem(ALIGNMENTS);

  // 5. Determine Stats (Combat Vitals & Ability Matrix)
  let health: number;
  let mana: number;
  let strength: number;
  let intelligence: number;
  let charisma: number;
  let stats: CharacterStats;

  if (locks.stats) {
    // Keep exact previous stats
    health = currentChar.health;
    mana = currentChar.mana;
    strength = currentChar.strength;
    intelligence = currentChar.intelligence;
    charisma = currentChar.charisma;
    stats = currentChar.stats;
  } else {
    const vitals = calculateClassStats(characterClass, race);
    health = vitals.health;
    mana = vitals.mana;
    strength = vitals.strength;
    intelligence = vitals.intelligence;
    charisma = vitals.charisma;

    stats = {
      strength: rollStat(
        classDef.statAffinities.primary === 'strength',
        classDef.statAffinities.secondary === 'strength'
      ),
      dexterity: rollStat(
        classDef.statAffinities.primary === 'dexterity',
        classDef.statAffinities.secondary === 'dexterity'
      ),
      constitution: rollStat(
        classDef.statAffinities.primary === 'constitution',
        classDef.statAffinities.secondary === 'constitution'
      ),
      intelligence: rollStat(
        classDef.statAffinities.primary === 'intelligence',
        classDef.statAffinities.secondary === 'intelligence'
      ),
      wisdom: rollStat(
        classDef.statAffinities.primary === 'wisdom',
        classDef.statAffinities.secondary === 'wisdom'
      ),
      charisma: rollStat(
        classDef.statAffinities.primary === 'charisma',
        classDef.statAffinities.secondary === 'charisma'
      ),
    };
  }

  const result: Character = {
    id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: firstName,
    title,
    fullName,
    characterClass,
    race,
    raceBonusDescription: raceMod.bonusSummary,
    raceModifier: raceMod,
    portraitUrl: classDef.portraitUrl,
    cartoonPortraitUrl: classDef.cartoonPortraitUrl,
    currentPortraitStyle: currentChar.currentPortraitStyle,
    activeCartoonVariant: currentChar.activeCartoonVariant,
    gameAura,
    classTagline: classDef.tagline,
    primaryWeapon,
    signatureAbility,
    alignment,
    quirk,
    lore,
    stats,
    health,
    maxHealth: health,
    mana,
    maxMana: mana,
    strength,
    intelligence,
    charisma,
    rarity: currentChar.rarity,
    createdAt: Date.now(),
  };

  result.questHook = generateQuestHook(result);

  return result;
}

export function formatModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
