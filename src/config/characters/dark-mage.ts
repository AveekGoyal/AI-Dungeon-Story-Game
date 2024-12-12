import { AnimationType } from '@/lib/constants';

export const darkMageConfig = {
  id: 'dark-mage',
  name: 'Dark Mage',
  spriteBase: '/sprites/mages/dark-mage',
  animations: {
    Idle: { frames: 6, frameRate: 8 },
    Walk: { frames: 8, frameRate: 10 },
    Run: { frames: 8, frameRate: 12 },
    Attack_1: { frames: 6, frameRate: 15 },
    Attack_2: { frames: 6, frameRate: 15 },
    Dark_bolt: { frames: 6, frameRate: 12 },
    Shadow_strike: { frames: 8, frameRate: 12 }
  } as Record<AnimationType, { frames: number; frameRate: number }>
};
