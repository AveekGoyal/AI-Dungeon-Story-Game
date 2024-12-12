"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FireMage, FIRE_MAGE_ANIMATIONS, FireMageAnimationType } from "@/components/characters/fire-mage"
import { SkeletonWarrior, SKELETON_WARRIOR_ANIMATIONS, SkeletonWarriorAnimationType } from "@/components/enemies/SkeletonWarrior"
import { DarkMage, DARK_MAGE_ANIMATIONS, DarkMageAnimationType } from "@/components/characters/dark-mage"
import { BlackWerewolf, BLACK_WEREWOLF_ANIMATIONS, BlackWerewolfAnimationType } from "@/components/enemies/BlackWerewolf"
import { LightMage, LIGHT_MAGE_ANIMATIONS, LightMageAnimationType } from "@/components/characters/light-mage"
import { SwampTroll, SWAMP_TROLL_ANIMATIONS, SwampTrollAnimationType } from "@/components/enemies/SwampTroll"
import { cn } from "@/lib/utils";
import medievalSharp from "@/lib/typography";

const scenarios = [
  {
    id: 1,
    title: "War-torn Battlefield Clash",
    description: "Engage in an epic battle against the fierce Black Werewolf in the war-torn ruins.",
    background: "/backgrounds/battleground/Battleground1/Bright/Battleground1.png",
    hero: {
      component: FireMage,
      animation: "Attack_2" as FireMageAnimationType,
      description: "Fire Mage channels destructive flame magic"
    },
    enemy: {
      component: BlackWerewolf,
      animation: "Attack_1" as BlackWerewolfAnimationType,
      description: "Black Werewolf prowls through the battlefield ruins"
    },
    options: ["Cast Fireball", "Flame Jet", "Defensive Stance"]
  },
  {
    id: 2,
    title: "Castle Battleground Duel",
    description: "Face the undead Skeleton Warrior in the grand castle battleground.",
    background: "/backgrounds/battleground/Battleground2/Bright/Battleground2.png",
    hero: {
      component: DarkMage,
      animation: "Attack_2" as DarkMageAnimationType,
      description: "Dark Mage wields shadow magic in the castle grounds"
    },
    enemy: {
      component: SkeletonWarrior,
      animation: "Attack_3" as SkeletonWarriorAnimationType,
      description: "Skeleton Warrior defends the ancient castle"
    },
    options: ["Shadow Strike", "Dark Sphere", "Magic Shield"]
  },
  {
    id: 3,
    title: "Jungle Battleground Combat",
    description: "Challenge the mighty Swamp Troll in the mystical jungle battleground.",
    background: "/backgrounds/battleground/Battleground3/Bright/Battleground3.png",
    hero: {
      component: LightMage,
      animation: "Attack_2" as LightMageAnimationType,
      description: "Light Mage brings radiance to the jungle"
    },
    enemy: {
      component: SwampTroll,
      animation: "Attack" as SwampTrollAnimationType,
      description: "Swamp Troll emerges from the jungle depths"
    },
    options: ["Holy Light", "Divine Shield", "Purifying Blast"]
  }
];

export function GamePreview() {
  const [currentScenario, setCurrentScenario] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const nextScenario = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevScenario = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentScenario((prev) => (prev - 1 + scenarios.length) % scenarios.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const scenario = scenarios[currentScenario];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={cn(
          "text-4xl md:text-5xl font-bold text-center text-white mb-12",
          medievalSharp.className
        )}>
          Experience Epic Adventures
        </h2>

        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          {/* Background Image */}
          <motion.div 
            key={`bg-${scenario.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${scenario.background})` }}
          />

          {/* Content Container */}
          <div className="relative min-h-[500px] flex flex-col">
            {/* Character Battle Scene */}
            <div className="flex-1 flex justify-between items-center px-12 py-8">
              <motion.div
                key={`hero-${scenario.id}`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="transform-gpu"
              >
                <scenario.hero.component
                  scale={3}
                  animation={scenario.hero.animation}
                  facing="right"
                />
              </motion.div>

              <motion.div
                key={`enemy-${scenario.id}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="transform-gpu"
              >
                <scenario.enemy.component
                  scale={3}
                  animation={scenario.enemy.animation}
                  facing="left"
                  className="scale-x-[-1]"
                />
              </motion.div>
            </div>

            {/* Scenario Information */}
            <div className="bg-gradient-to-t from-black to-transparent p-8">
              <motion.div
                key={`info-${scenario.id}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className={cn(
                  "text-2xl md:text-3xl font-bold text-white mb-2",
                  medievalSharp.className
                )}>
                  {scenario.title}
                </h3>
                <p className="text-lg text-gray-300 mb-4">
                  {scenario.description}
                </p>

                {/* Battle Options */}
                <div className="flex gap-4 mt-4">
                  {scenario.options.map((option, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-amber-500/80 hover:bg-amber-600/80 text-white font-semibold rounded-lg transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevScenario}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
          >
            ←
          </button>
          <button
            onClick={nextScenario}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
          >
            →
          </button>

          {/* Scenario Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {scenarios.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentScenario ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}