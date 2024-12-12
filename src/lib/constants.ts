export const SPRITE_SIZE = {
  WIDTH: 128,
  HEIGHT: 128
} as const;

export const FRAME_RATES = {
  IDLE: 8,
  IDLE_2: 8,
  WALK: 10,
  RUN: 12,
  ATTACK: 15,
  SPECIAL: 12,
  HURT: 10,
  DEAD: 8,
  JUMP: 12
} as const;

export type CharacterClass = 
  | 'fire-mage'
  | 'dark-mage'
  | 'light-mage'
  | 'barbarian'
  | 'battlemaster'
  | 'vanguard'
  | 'archer'
  | 'crimson'
  | 'rapier'
  | 'swordsmen';

export type AnimationType = 
  | 'Idle'
  | 'Walk'
  | 'Run'
  | 'Attack_1'
  | 'Attack_2'
  | 'Attack_3'
  | 'Fireball'
  | 'Flame_jet'
  | 'Shot_1'
  | 'Shot_2'
  | 'Arrow'
  | 'Hurt'
  | 'Dead'
  | 'Jump';

export const CHARACTER_FRAMES: Record<CharacterClass, Partial<Record<AnimationType, number>>> = {
  'fire-mage': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 6,
    Attack_2: 6,
    Fireball: 6,
    Flame_jet: 8,
    Hurt: 4,
    Jump: 8
  },
  'dark-mage': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 4,
    Attack_2: 4,
    Fireball: 4,
    Flame_jet: 14,
    Hurt: 3,
    Jump: 9
  },
  'light-mage': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 4,
    Attack_2: 4,
    Fireball: 4,
    Flame_jet: 14,
    Hurt: 3,
    Jump: 9
  },
  'barbarian': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 4,
    Attack_2: 4,
    Attack_3: 4,
    Hurt: 3,
    Jump: 9
  },
  'battlemaster': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 4,
    Hurt: 3,
    Jump: 9
  },
  'vanguard': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 4,
    Hurt: 3,
    Jump: 9
  },
  'archer': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 6,
    Shot_1: 6,
    Shot_2: 6,
    Arrow: 4,
    Hurt: 4,
    Dead: 6,
    Jump: 8
  },
  'crimson': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 6,
    Attack_2: 6,
    Attack_3: 6,
    Hurt: 4,
    Dead: 6,
    Jump: 8
  },
  'rapier': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 6,
    Attack_2: 6,
    Attack_3: 6,
    Hurt: 4,
    Dead: 6,
    Jump: 8
  },
  'swordsmen': {
    Idle: 6,
    Walk: 8,
    Run: 8,
    Attack_1: 6,
    Attack_2: 6,
    Attack_3: 6,
    Hurt: 4,
    Dead: 6,
    Jump: 8
  }
};
