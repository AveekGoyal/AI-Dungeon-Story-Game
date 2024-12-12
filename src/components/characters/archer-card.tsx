import React, { useState } from 'react'
import { Archer } from '@/components/characters/archer'
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
    left: '130px',
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
                <Archer animation="Idle" />
              </div>
            )}

            <div className="px-16 py-16">
              <h2 className={cn(
                "text-4xl text-center mb-8 text-gray-800",
                medievalSharp.className
              )}>
                {isBack ? "Attributes & Abilities" : "Archer"}
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
                        Master of the Long Bow
                      </h3>
                    </div>

                    <p className="italic text-gray-900 leading-relaxed pr-4">
                      "With unmatched precision and deadly accuracy, the Archer 
                      strikes from afar, their arrows finding their mark with 
                      uncanny consistency."
                    </p>
                  </div>
                </div>
              ) : (
                // Back content
                <div className="flex flex-col gap-6 pl-12">
                  <div className="space-y-2">
                    <StatBar label="Strength" value={6} maxValue={10} color="red" />
                    <StatBar label="Intelligence" value={7} maxValue={10} color="blue" />
                    <StatBar label="Health Points" value={5} maxValue={10} color="green" />
                    <StatBar label="Agility" value={9} maxValue={10} color="yellow" />
                    <StatBar label="Magic Points" value={4} maxValue={10} color="purple" />
                  </div>

                  <div className="space-y-1">
                    <h3 className={cn(
                      "text-2xl text-gray-800",
                      medievalSharp.className
                    )}>
                      Special Attacks
                    </h3>
                    <ul className="space-y-3 text-gray-800">
                      <li>• Precision Shot</li>
                      <li>• Rain of Arrows</li>
                      <li>• Eagle Eye</li>
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
            <Archer animation="Idle" />
          </div>

          <div className="px-16 py-16">
            <h2 className={cn(
              "text-4xl text-center mb-8 text-gray-800",
              medievalSharp.className
            )}>
              Archer
            </h2>

            {/* Stats Panel */}
            <div className="absolute right-4 top-[150px]">
              <div className="space-y-2">
                <OverviewStatBar label="Strength" value={6} maxValue={10} color="red" />
                <OverviewStatBar label="Intelligence" value={7} maxValue={10} color="blue" />
                <OverviewStatBar label="Health Points" value={5} maxValue={10} color="green" />
                <OverviewStatBar label="Agility" value={9} maxValue={10} color="yellow" />
                <OverviewStatBar label="Magic Points" value={4} maxValue={10} color="purple" />
              </div>

              <div className="space-y-1 mt-4">
                <h3 className={cn(
                  "text-2xl text-gray-800",
                  medievalSharp.className
                )}>
                  Special Attacks
                </h3>
                <ul className="space-y-1 text-gray-800">
                  <li>• Precision Shot</li>
                  <li>• Rain of Arrows</li>
                  <li>• Eagle Eye</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
