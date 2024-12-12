import React, { useState } from 'react'
import { Crimson } from '@/components/characters/crimson'
import { medievalSharp, lora } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Define the type for StatBarProps
type ColorMap = {
  red: string;
  blue: string;
  green: string;
  yellow: string;
  purple: string;
};

type StatBarProps = {
  label: string;
  value: number;
  maxValue: number;
  color: keyof ColorMap;
};

// Keep front side character position same
const characterPositions = {
  front: {
    left: '110px',
    bottom: '250px',
    scale: 3,
    scaleX: 1,
  }
}

function StatBar({ label, value, maxValue, color }: StatBarProps) {
  const percentage = (value / maxValue) * 100;
  const colors: ColorMap = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="grid grid-cols-[120px_200px_60px] items-center whitespace-nowrap">
      <span className="text-gray-800 text-sm">{label}</span>
      <div className="w-full">
        <div className="h-2 bg-black/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors[color]} rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-gray-800 text-sm text-right">{value}/{maxValue}</span>
    </div>
  );
}

// New StatBar specifically for overview card
function OverviewStatBar({ label, value, maxValue, color }: StatBarProps) {
  const percentage = (value / maxValue) * 100;
  const colors: ColorMap = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="grid grid-cols-[120px_100px_40px] items-center whitespace-nowrap pr-20">
      <span className="text-gray-800 text-sm">{label}</span>
      <div className="w-full">
        <div className="h-2 bg-black/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors[color]} rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-gray-800 text-sm text-right">{value}/{maxValue}</span>
    </div>
  );
}

export default function CharacterCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-[626px] h-[468px] preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front and Back cards */}
        {[false, true].map((isBack) => (
          <div
            key={isBack ? 'back' : 'front'}
            className={cn(
              "absolute w-full h-full",
              "bg-[url('/images/parchment-bg.png')] bg-cover bg-center",
              isBack ? 'rotateY-180' : ''
            )}
            style={{
              backfaceVisibility: 'hidden',
              transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Character Animation - Only on front side */}
            {!isBack && (
              <div 
                className="absolute z-10"
                style={{
                  left: characterPositions.front.left,
                  bottom: characterPositions.front.bottom,
                  transform: `scale(${characterPositions.front.scale}) scaleX(${characterPositions.front.scaleX})`
                }}
              >
                <Crimson animation="Idle" />
              </div>
            )}

            <div className="px-16 py-16">
              <h2 className={cn(
                "text-4xl text-center mb-8 text-gray-800",
                medievalSharp.className
              )}>
                {isBack ? "Attributes & Abilities" : "Crimson Knight"}
              </h2>

              {!isBack ? (
                // Front content
                <div className="flex flex-col gap-6 ml-[200px]">
                  <div className="space-y-2">
                    <div>
                      <h3 className={cn(
                        "text-xl mb-4 mt-5 bg-gradient-to-r from-red-700 to-orange-600 text-transparent bg-clip-text",
                        medievalSharp.className
                      )}>
                        Blood-Sworn Protector
                      </h3>
                    </div>

                    <p className="italic text-gray-900 leading-relaxed pr-4">
                      "Clad in crimson armor forged in dragon fire, these elite 
                      knights have sworn blood oaths to protect the realm, their 
                      very essence bound to their sacred duty."
                    </p>
                  </div>
                </div>
              ) : (
                // Back content
                <div className="flex flex-col gap-6 pl-12">
                  <div className="space-y-2">
                    <StatBar label="Strength" value={9} maxValue={10} color="red" />
                    <StatBar label="Intelligence" value={6} maxValue={10} color="blue" />
                    <StatBar label="Health Points" value={8} maxValue={10} color="green" />
                    <StatBar label="Agility" value={7} maxValue={10} color="yellow" />
                    <StatBar label="Magic Points" value={5} maxValue={10} color="purple" />
                  </div>

                  <div className="space-y-1">
                    <h3 className={cn(
                      "text-2xl text-gray-800",
                      medievalSharp.className
                    )}>
                      Special Attacks
                    </h3>
                    <ul className="space-y-3 text-gray-800">
                      <li>• Blood Oath</li>
                      <li>• Dragon's Fury</li>
                      <li>• Crimson Shield</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className={cn(
                "absolute bottom-11 right-20 text-right text-gray-600 text-sm pr-4",
                lora.className
              )}>
                {isBack ? (
                  <div>*Click card to view story</div>
                ) : (
                  <div>*Click card to view attributes</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// Add new OverviewCard component
export function OverviewCard() {
  console.log('CrimsonOverview - Rendering component')
  return (
    <div className="perspective-1000">
      <div className="relative w-[626px] h-[468px]">
        <div className={cn(
          "absolute w-full h-full",
          "bg-[url('/images/parchment-bg.png')] bg-cover bg-center"
        )}>
          {/* Character Animation */}
          <div 
            className="absolute z-10"
            style={{
              left: characterPositions.front.left,
              bottom: characterPositions.front.bottom,
              transform: `scale(${characterPositions.front.scale}) scaleX(${characterPositions.front.scaleX})`
            }}
          >
            <Crimson animation="Idle" />
          </div>

          <div className="px-16 py-16">
            <h2 className={cn(
              "text-4xl text-center mb-8 text-gray-800",
              medievalSharp.className
            )}>
              Crimson Knight
            </h2>

            {/* Stats Panel */}
            <div className="absolute right-4 top-[150px]">
              <div className="space-y-2">
                <OverviewStatBar label="Strength" value={9} maxValue={10} color="red" />
                <OverviewStatBar label="Intelligence" value={5} maxValue={10} color="blue" />
                <OverviewStatBar label="Health Points" value={8} maxValue={10} color="green" />
                <OverviewStatBar label="Agility" value={6} maxValue={10} color="yellow" />
                <OverviewStatBar label="Magic Points" value={3} maxValue={10} color="purple" />
              </div>

              <div className="space-y-1 mt-4">
                <h3 className={cn(
                  "text-2xl text-gray-800",
                  medievalSharp.className
                )}>
                  Special Attacks
                </h3>
                <ul className="space-y-1 text-gray-800">
                  <li>• Crimson Slash</li>
                  <li>• Blood Shield</li>
                  <li>• Berserker Rage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
