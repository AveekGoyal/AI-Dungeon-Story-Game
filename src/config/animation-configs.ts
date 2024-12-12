import { CharacterClass, AnimationState } from '@/types/character'

export const characterAnimationSequences: Record<CharacterClass, AnimationState[]> = {
  // Mages
  'fire-mage': ['idle', 'walk', 'run', 'attack1', 'attack2', 'fireball', 'flame', 'jump', 'hurt', 'dead'],
  'dark-mage': ['idle', 'walk', 'run', 'attack1', 'attack2', 'fireball', 'flame', 'jump', 'hurt', 'dead'],
  'light-mage': ['idle', 'walk', 'run', 'attack1', 'attack2', 'fireball', 'flame', 'jump', 'hurt', 'dead'],
  
  // Warriors
  'barbarian': ['idle', 'walk', 'run', 'attack1', 'attack2', 'attack3', 'jump', 'hurt', 'dead'],
  'battlemaster': ['idle', 'walk', 'run', 'attack1', 'jump', 'hurt', 'dead'],
  'vanguard': ['idle', 'walk', 'run', 'attack1', 'jump', 'hurt', 'dead'],
  
  // Adventurers
  'archer': ['idle', 'walk', 'run', 'attack1', 'shot1', 'shot2', 'jump', 'hurt', 'dead'],
  'crimson': ['idle', 'walk', 'run', 'attack1', 'attack2', 'attack3', 'attack4', 'jump', 'hurt', 'dead'],
  'rapier': ['idle', 'walk', 'run', 'attack1', 'jump', 'hurt', 'dead'],
  'swordsmen': ['idle', 'walk', 'run', 'attack1', 'jump', 'hurt', 'dead']
}

// Animation timing configurations
export const ANIMATION_TIMINGS = {
  DEFAULT_DURATION: 2000,
  TRANSITION_DURATION: 100,
  DEFAULT_FPS: 6  // Reduced FPS for smoother animations
}
