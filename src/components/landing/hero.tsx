'use client';

import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { FireMage, FireMageAnimationType } from '@/components/characters/fire-mage'
import { DarkMage, DarkMageAnimationType } from "@/components/characters/dark-mage"
import { LightMage, LightMageAnimationType } from "@/components/characters/light-mage"
import { Wizard, WizardAnimationType } from "@/components/characters/wizard"
import { Enchantress, EnchantressAnimationType } from "@/components/characters/enchantress"
import { Crimson, CrimsonAnimationType } from "@/components/characters/crimson"
import { CharacterCard } from '@/components/ui/character-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { medievalSharp, lora } from '@/app/fonts'
import Link from 'next/link';

interface CharacterConfig {
  type: 'FireMage' | 'DarkMage' | 'LightMage' | 'Wizard' | 'Enchantress' | 'Crimson'
  scale: number
  name: string
}

export function Hero() {
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const characters: CharacterConfig[] = [
    { type: 'FireMage', scale: 3.5, name: "Fire Mage" },
    { type: 'DarkMage', scale: 3.5, name: "Dark Mage" },
    { type: 'LightMage', scale: 3.5, name: "Light Mage" },
    { type: 'Wizard', scale: 3.5, name: "Wizard" },
    { type: 'Enchantress', scale: 3.5, name: "Enchantress" },
    { type: 'Crimson', scale: 3.5, name: "Crimson" }
  ];

  // Function to advance to next character
  const advanceToNextCharacter = useCallback(() => {
    if (!carouselApi) return;
    const nextIndex = (currentCharacter + 1) % characters.length;
    carouselApi.scrollTo(nextIndex);
  }, [carouselApi, currentCharacter, characters.length]);

  // Handle carousel API initialization and selection
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on('select', () => {
      const selectedIndex = carouselApi.selectedScrollSnap();
      if (selectedIndex !== currentCharacter) {
        setCurrentCharacter(selectedIndex);
      }
    });
  }, [carouselApi, currentCharacter]);

  // Animation sequence effect
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start with full opacity
    setOpacity(1);

    // Set up the interval for the animation sequence
    intervalRef.current = setInterval(() => {
      // Start fade out
      setOpacity(0);
      
      // After fade completes, advance to next character
      setTimeout(() => {
        advanceToNextCharacter();
      }, 1000); // 1 second fade duration
    }, 5000); // 4 seconds of attack + 1 second fade

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentCharacter, advanceToNextCharacter]);

  const getCharacterAnimation = (charType: CharacterConfig['type']) => {
    switch (charType) {
      case 'FireMage':
        return 'Flame_jet';
      case 'DarkMage':
        return 'Magic_sphere';
      case 'LightMage':
        return 'Light_charge';
      case 'Wizard':
        return 'Attack_3';
      case 'Enchantress':
        return 'Attack_4';
      case 'Crimson':
        return 'Attack_3';
    }
  };

  const renderCharacter = (config: CharacterConfig) => {
    const animation = getCharacterAnimation(config.type);
    
    switch (config.type) {
      case 'FireMage':
        return <FireMage scale={config.scale} animation={animation as FireMageAnimationType} />
      case 'DarkMage':
        return <DarkMage scale={config.scale} animation={animation as DarkMageAnimationType} />
      case 'LightMage':
        return <LightMage scale={config.scale} animation={animation as LightMageAnimationType} />
      case 'Wizard':
        return <Wizard scale={config.scale} animation={animation as WizardAnimationType} />
      case 'Enchantress':
        return <Enchantress scale={config.scale} animation={animation as EnchantressAnimationType} />
      case 'Crimson':
        return <Crimson scale={config.scale} animation={animation as CrimsonAnimationType} />
    }
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/stars.png')] opacity-50" />
      <div className="relative h-full container mx-auto flex items-center justify-center py-16">
        <div className="flex items-center justify-between w-full gap-8">
          {/* Left side - Character carousel */}
          <div className="w-1/2">
            <Carousel
              opts={{
                loop: true,
                skipSnaps: false,
                duration: 20
              }}
              setApi={setCarouselApi}
              className="w-full max-w-lg mx-auto"
            >
              <CarouselContent>
                {characters.map((char, index) => (
                  <CarouselItem key={char.type} className="relative">
                    <CharacterCard name={char.name}>
                      <div className="relative w-full h-[400px] flex items-center justify-center">
                        {/* Current character with fade effect */}
                        <motion.div
                          key={`${char.type}-${index === currentCharacter}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: index === currentCharacter ? opacity : 0 }}
                          transition={{ duration: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {renderCharacter(char)}
                        </motion.div>
                        
                        {/* Preload next character */}
                        {index === (currentCharacter + 1) % characters.length && (
                          <div className="opacity-0 absolute inset-0 flex items-center justify-center">
                            {renderCharacter(char)}
                          </div>
                        )}
                      </div>
                    </CharacterCard>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-4 text-black">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>

          {/* Right side - Text content */}
          <div className="w-1/2 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={cn(
                "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight",
                medievalSharp.className
              )}
            >
              <span className="text-amber-500">
              Enter The
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
              Infinite Dungeon
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn(
                "text-xl text-gray-300 max-w-xl",
                lora.className
              )}
            >
              Enter a world where no two adventures are the same. With AI-driven narratives that adapt to your choices, every playthrough unveils new stories, challenges, and possibilities.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className={cn(
                  "bg-red-700 hover:bg-red-800 text-white text-lg px-8 py-6 shadow-lg shadow-red-900/50",
                  medievalSharp.className
                )}
                asChild
              >
                <Link href="/sign-in">
                  Begin Your Quest
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}