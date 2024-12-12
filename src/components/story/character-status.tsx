"use client"

import { medievalSharp } from "@/lib/typography"
import { cn } from "@/lib/utils"

// Placeholder character data
const PLACEHOLDER_CHARACTER = {
  name: "Eldric",
  class: "Fire Mage",
  level: 1,
  health: 100,
  maxHealth: 100,
  magic: 80,
  maxMagic: 100,
  experience: 0
}

type StatBarProps = {
  label: string
  current: number
  max: number
  color: string
}

function StatBar({ label, current, max, color }: StatBarProps) {
  const percentage = (current / max) * 100

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function CharacterStatus() {
  const character = PLACEHOLDER_CHARACTER

  return (
    <div className="p-4 bg-card rounded-lg border shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={cn(medievalSharp.className, "text-xl text-primary")}>
            {character.name}
          </h3>
          <p className="text-sm text-muted-foreground">{character.class}</p>
        </div>
        <div className="px-3 py-1 bg-primary rounded-full">
          <span className="text-primary-foreground">Level {character.level}</span>
        </div>
      </div>

      <div className="space-y-3">
        <StatBar 
          label="Health" 
          current={character.health} 
          max={character.maxHealth}
          color="bg-red-500"
        />
        <StatBar 
          label="Magic" 
          current={character.magic} 
          max={character.maxMagic}
          color="bg-blue-500"
        />
      </div>
    </div>
  )
}
