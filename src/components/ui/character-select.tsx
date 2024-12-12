'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterSprite } from './character-sprite';
import { CharacterClass, AnimationType } from '@/lib/constants';
import { fireMageConfig, darkMageConfig, lightMageConfig } from '@/config/characters';

const getCharacterConfig = (characterClass: CharacterClass) => {
  switch (characterClass) {
    case 'fire-mage':
      return fireMageConfig;
    case 'dark-mage':
      return darkMageConfig;
    case 'light-mage':
      return lightMageConfig;
    default:
      return fireMageConfig; // Default to fire mage if unknown
  }
};

const characters: Array<{
  id: CharacterClass;
  name: string;
  animationSequence: AnimationType[];
}> = [
  { 
    id: 'fire-mage',
    name: 'Fire Mage',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Fireball', 'Flame_jet']
  },
  { 
    id: 'dark-mage',
    name: 'Dark Mage',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Attack_2', 'Fireball']
  },
  { 
    id: 'light-mage',
    name: 'Light Mage',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Attack_2', 'Flame_jet']
  },
  { 
    id: 'barbarian',
    name: 'Barbarian',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Attack_2', 'Attack_3']
  },
  { 
    id: 'battlemaster',
    name: 'Battlemaster',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Jump']
  },
  { 
    id: 'vanguard',
    name: 'Vanguard',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Jump']
  },
  { 
    id: 'archer',
    name: 'Archer',
    animationSequence: ['Idle', 'Walk', 'Shot_1', 'Shot_2', 'Arrow']
  },
  { 
    id: 'crimson',
    name: 'Crimson',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Attack_2', 'Attack_3']
  },
  { 
    id: 'rapier',
    name: 'Rapier',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Attack_2', 'Attack_3']
  },
  { 
    id: 'swordsmen',
    name: 'Swordsmen',
    animationSequence: ['Idle', 'Walk', 'Attack_1', 'Attack_2', 'Attack_3']
  }
];

export function CharacterSelect() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterClass>('fire-mage');
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('Idle');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCharacterSelect = (characterId: CharacterClass) => {
    setIsTransitioning(true);
    setCurrentAnimation('Idle');
    setTimeout(() => {
      setSelectedCharacter(characterId);
      setIsTransitioning(false);
    }, 300);
  };

  const handleAnimationComplete = () => {
    if (isTransitioning) return;
    
    const character = characters.find(c => c.id === selectedCharacter);
    if (!character) return;

    const currentIndex = character.animationSequence.indexOf(currentAnimation);
    const nextIndex = (currentIndex + 1) % character.animationSequence.length;
    setCurrentAnimation(character.animationSequence[nextIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-4xl p-8 mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Character</h2>

      {/* Character sprite display */}
      <div className="relative w-96 h-96 flex items-center justify-center mb-12">
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <motion.div
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 transform-gpu"
          style={{ 
            willChange: 'transform, opacity',
            imageRendering: 'pixelated'
          }}
        >
          <CharacterSprite
            config={getCharacterConfig(selectedCharacter)}
            animationType={currentAnimation}
            scale={3}
            onAnimationComplete={handleAnimationComplete}
            className="pixel-perfect"
          />
        </motion.div>
      </div>

      {/* Character selection grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => handleCharacterSelect(character.id)}
            className={`
              px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedCharacter === character.id
                ? 'bg-gray-900 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            {character.name}
          </button>
        ))}
      </div>
    </div>
  );
}
