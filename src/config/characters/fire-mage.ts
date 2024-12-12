import { AnimationType } from '@/lib/constants';

export const fireMageConfig = {
  id: 'fire-mage',
  name: 'Fire Mage',
  spriteBase: '/sprites/mages/fire-mage',
  animations: {
    Idle: { frames: 6, frameRate: 8 },
    Walk: { frames: 8, frameRate: 10 },
    Run: { frames: 8, frameRate: 12 },
    Attack_1: { frames: 6, frameRate: 15 },
    Attack_2: { frames: 6, frameRate: 15 },
    Fireball: { frames: 6, frameRate: 12 },
    Flame_jet: { frames: 8, frameRate: 12 }
  } as Record<AnimationType, { frames: number; frameRate: number }>
};
