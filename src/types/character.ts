export type CharacterClass = 
  | "fire-mage"
  | "dark-mage" 
  | "light-mage"
  | "archer"
  | "crimson"
  | "rapier"
  | "swordsmen"

export interface CharacterStats {
  strength: number    // Physical damage and carrying capacity
  intelligence: number // Magic power and puzzle solving
  health: number     // Hit points and resistance
  agility: number    // Speed and dodge chance
  magic: number      // Spell power and mana points
}

export interface CharacterAbility {
  name: string
  description: string
  type: "attack" | "defense" | "utility" | "special"
  damage?: number
  healing?: number
  effects?: string[]
}

export interface Character {
  id: string
  userId: string
  name: string
  class: CharacterClass
  stats: CharacterStats
  abilities: CharacterAbility[]
  status: {
    currentHealth: number
    maxHealth: number
    currentMagic: number
    maxMagic: number
    isAlive: boolean
  }
  backstory?: string
  traits?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CharacterAnimationState {
  Idle: string
  Attack: string
  Cast: string
  Hit: string
  Death: string
  Victory: string
  Defend: string
}

export interface CharacterProps {
  character: Character
  animation?: keyof CharacterAnimationState
  scale?: number
  className?: string
  onAnimationComplete?: () => void
}
