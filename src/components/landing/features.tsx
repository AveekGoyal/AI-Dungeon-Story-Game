"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
// Heroes - Mages
import { FireMage, FireMageAnimationType, FIRE_MAGE_ANIMATIONS } from '@/components/characters/fire-mage';
import { DarkMage, DarkMageAnimationType, DARK_MAGE_ANIMATIONS } from '@/components/characters/dark-mage';
import { LightMage, LightMageAnimationType, LIGHT_MAGE_ANIMATIONS } from '@/components/characters/light-mage';
import { Wizard, WizardAnimationType, WIZARD_ANIMATIONS } from '@/components/characters/wizard';
import { Enchantress, EnchantressAnimationType, ENCHANTRESS_ANIMATIONS } from '@/components/characters/enchantress';
// Heroes - Warriors
import { Archer, ArcherAnimationType, ARCHER_ANIMATIONS } from '@/components/characters/archer';
import { Crimson, CrimsonAnimationType, CRIMSON_ANIMATIONS } from '@/components/characters/crimson';
import { Rapier, RapierAnimationType, RAPIER_ANIMATIONS } from '@/components/characters/rapier';
import { Swordsmen, SwordsmenAnimationType, SWORDSMEN_ANIMATIONS } from '@/components/characters/swordsmen';
// Enemies
import { FireSpirit, FireSpiritAnimationType, FIRE_SPIRIT_ANIMATIONS } from '@/components/enemies/FireSpirit';
import { Plent, PlentAnimationType, PLENT_ANIMATIONS } from '@/components/enemies/Plent';
import { SkeletonSpearman, SkeletonSpearmanAnimationType, SKELETON_SPEARMAN_ANIMATIONS } from '@/components/enemies/SkeletonSpearman';
import { Skeleton, SkeletonAnimationType, SKELETON_ANIMATIONS } from '@/components/enemies/Skeleton';
import { SkeletonArcher, SkeletonArcherAnimationType, SKELETON_ARCHER_ANIMATIONS } from '@/components/enemies/SkeletonArcher';
import { SkeletonWarrior, SkeletonWarriorAnimationType, SKELETON_WARRIOR_ANIMATIONS } from '@/components/enemies/SkeletonWarrior';
import { BlackWerewolf, BlackWerewolfAnimationType, BLACK_WEREWOLF_ANIMATIONS } from '@/components/enemies/BlackWerewolf';
import { RedWerewolf, RedWerewolfAnimationType, RED_WEREWOLF_ANIMATIONS } from '@/components/enemies/RedWerewolf';
import { WhiteWerewolf, WhiteWerewolfAnimationType, WHITE_WEREWOLF_ANIMATIONS } from '@/components/enemies/WhiteWerewolf';
import { ForestTroll, ForestTrollAnimationType, FOREST_TROLL_ANIMATIONS } from '@/components/enemies/ForestTroll';
import { SwampTroll, SwampTrollAnimationType, SWAMP_TROLL_ANIMATIONS } from '@/components/enemies/SwampTroll';
import { MountainTroll, MountainTrollAnimationType, MOUNTAIN_TROLL_ANIMATIONS } from '@/components/enemies/MountainTroll';
import { cn } from '@/lib/utils';
import { medievalSharp } from '@/app/fonts';

type CharacterConfig = {
  id: string;
  name: string;
  description: string;
  component: any;
  category: 'mage' | 'warrior' | 'enemy';
  animations: string[];
}

const characters: CharacterConfig[] = [
  // Heroes - Mages
  {
    id: 'fire-mage',
    name: 'Fire Mage',
    description: 'Master of destructive fire magic',
    component: FireMage,
    category: 'mage',
    animations: Object.keys(FIRE_MAGE_ANIMATIONS),
  },
  {
    id: 'dark-mage',
    name: 'Dark Mage',
    description: 'Wielder of shadow and dark arts',
    component: DarkMage,
    category: 'mage',
    animations: Object.keys(DARK_MAGE_ANIMATIONS),
  },
  {
    id: 'light-mage',
    name: 'Light Mage',
    description: 'Blessed with divine healing powers',
    component: LightMage,
    category: 'mage',
    animations: Object.keys(LIGHT_MAGE_ANIMATIONS),
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'Master of arcane magic',
    component: Wizard,
    category: 'mage',
    animations: Object.keys(WIZARD_ANIMATIONS),
  },
  {
    id: 'enchantress',
    name: 'Enchantress',
    description: 'Mistress of enchantments',
    component: Enchantress,
    category: 'mage',
    animations: Object.keys(ENCHANTRESS_ANIMATIONS),
  },
  // Heroes - Warriors
  {
    id: 'archer',
    name: 'Archer',
    description: 'Expert marksman with deadly accuracy',
    component: Archer,
    category: 'warrior',
    animations: Object.keys(ARCHER_ANIMATIONS),
  },
  {
    id: 'crimson',
    name: 'Crimson',
    description: 'Swift assassin with deadly precision',
    component: Crimson,
    category: 'warrior',
    animations: Object.keys(CRIMSON_ANIMATIONS),
  },
  {
    id: 'rapier',
    name: 'Rapier',
    description: 'Elegant fencer with precise strikes',
    component: Rapier,
    category: 'warrior',
    animations: Object.keys(RAPIER_ANIMATIONS),
  },
  {
    id: 'swordsmen',
    name: 'Swordsmen',
    description: 'Skilled warrior with powerful combos',
    component: Swordsmen,
    category: 'warrior',
    animations: Object.keys(SWORDSMEN_ANIMATIONS),
  },
  // Enemies
  {
    id: 'fire-spirit',
    name: 'Fire Spirit',
    description: 'Elemental being of pure flame',
    component: FireSpirit,
    category: 'enemy',
    animations: Object.keys(FIRE_SPIRIT_ANIMATIONS),
  },
  {
    id: 'plent',
    name: 'Plent',
    description: 'Poisonous plant creature',
    component: Plent,
    category: 'enemy',
    animations: Object.keys(PLENT_ANIMATIONS),
  },
  {
    id: 'skeleton-spearman',
    name: 'Skeleton Spearman',
    description: 'Undead warrior with deadly reach',
    component: SkeletonSpearman,
    category: 'enemy',
    animations: Object.keys(SKELETON_SPEARMAN_ANIMATIONS),
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    description: 'Basic undead warrior',
    component: Skeleton,
    category: 'enemy',
    animations: Object.keys(SKELETON_ANIMATIONS),
  },
  {
    id: 'skeleton-archer',
    name: 'Skeleton Archer',
    description: 'Undead marksman',
    component: SkeletonArcher,
    category: 'enemy',
    animations: Object.keys(SKELETON_ARCHER_ANIMATIONS),
  },
  {
    id: 'skeleton-warrior',
    name: 'Skeleton Warrior',
    description: 'Elite undead fighter',
    component: SkeletonWarrior,
    category: 'enemy',
    animations: Object.keys(SKELETON_WARRIOR_ANIMATIONS),
  },
  {
    id: 'black-werewolf',
    name: 'Black Werewolf',
    description: 'Fierce lycanthrope hunter',
    component: BlackWerewolf,
    category: 'enemy',
    animations: Object.keys(BLACK_WEREWOLF_ANIMATIONS),
  },
  {
    id: 'red-werewolf',
    name: 'Red Werewolf',
    description: 'Bloodthirsty werewolf',
    component: RedWerewolf,
    category: 'enemy',
    animations: Object.keys(RED_WEREWOLF_ANIMATIONS),
  },
  {
    id: 'white-werewolf',
    name: 'White Werewolf',
    description: 'Arctic werewolf hunter',
    component: WhiteWerewolf,
    category: 'enemy',
    animations: Object.keys(WHITE_WEREWOLF_ANIMATIONS),
  },
  {
    id: 'forest-troll',
    name: 'Forest Troll',
    description: 'Woodland brute',
    component: ForestTroll,
    category: 'enemy',
    animations: Object.keys(FOREST_TROLL_ANIMATIONS),
  },
  {
    id: 'swamp-troll',
    name: 'Swamp Troll',
    description: 'Marsh-dwelling monster',
    component: SwampTroll,
    category: 'enemy',
    animations: Object.keys(SWAMP_TROLL_ANIMATIONS),
  },
  {
    id: 'mountain-troll',
    name: 'Mountain Troll',
    description: 'Highland behemoth',
    component: MountainTroll,
    category: 'enemy',
    animations: Object.keys(MOUNTAIN_TROLL_ANIMATIONS),
  },
];

export function Features() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [currentAnimation, setCurrentAnimation] = useState('Idle');

  const filteredCharacters = selectedCategory === 'all'
    ? characters
    : characters.filter(char => char.category === selectedCategory);

  const CharacterComponent = selectedCharacter.component;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold mb-4 text-white",
            medievalSharp.className
          )}>
            Interact with the Characters
          </h2>
          <p className="text-xl text-gray-300">
            Explore each character's unique animations and abilities
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px] mx-auto bg-gray-900/50">
            {['all', 'mage', 'warrior', 'enemy'].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                onClick={() => setSelectedCategory(tab)}
                className={cn(
                  "text-lg font-semibold text-gray-400 hover:text-amber-500 transition-colors data-[state=active]:text-amber-500",
                  medievalSharp.className
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Character Preview */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={selectedCharacter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="transform-gpu"
              >
                <CharacterComponent
                  scale={selectedCharacter.id.includes('troll') ? 2 : 4}
                  animation={currentAnimation}
                />
              </motion.div>
            </div>
          </div>

          {/* Character Selection and Controls */}
          <div className="space-y-8">
            {/* Character Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {filteredCharacters.map((char) => (
                <Card
                  key={char.id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    selectedCharacter.id === char.id
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50"
                      : "bg-gray-900 hover:bg-gray-800 border-gray-800"
                  )}
                  onClick={() => {
                    setSelectedCharacter(char);
                    setCurrentAnimation('Idle');
                  }}
                >
                  <h3 className={cn(
                    "text-lg font-semibold",
                    medievalSharp.className,
                    selectedCharacter.id === char.id
                      ? "text-amber-700"
                      : "text-amber-500"
                  )}>
                    {char.name}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    selectedCharacter.id === char.id
                      ? "text-black"
                      : "text-gray-300"
                  )}>{char.description}</p>
                </Card>
              ))}
            </div>

            {/* Animation Controls */}
            <div className="space-y-4">
              <h3 className={cn(
                "text-lg font-semibold text-amber-500",
                medievalSharp.className
              )}>
                Animations
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2">
                {selectedCharacter.animations.map((animation) => (
                  <Button
                    key={animation}
                    variant={currentAnimation === animation ? "default" : "outline"}
                    onClick={() => setCurrentAnimation(animation)}
                    className={cn(
                      currentAnimation === animation
                        ? "bg-amber-500 hover:bg-amber-600 text-black"
                        : "bg-gray-900 text-gray-300 border-gray-800 hover:border-amber-500/50 hover:text-amber-500"
                    )}
                  >
                    {animation.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}