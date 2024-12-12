import { AnimationType } from '@/lib/constants';

export const lightMageConfig = {
  id: 'light-mage',
  name: 'Light Mage',
  spriteBase: '/sprites/mages/light-mage',
  animations: {
    Idle: { frames: 6, frameRate: 8 },
    Walk: { frames: 8, frameRate: 10 },
    Run: { frames: 8, frameRate: 12 },
    Attack_1: { frames: 6, frameRate: 15 },
    Attack_2: { frames: 6, frameRate: 15 },
    Holy_light: { frames: 6, frameRate: 12 },
    Divine_beam: { frames: 8, frameRate: 12 }
  } as Record<AnimationType, { frames: number; frameRate: number }>
};
