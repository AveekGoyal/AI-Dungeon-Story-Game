export * from './fire-mage';
export * from './dark-mage';
export * from './light-mage';

export type CharacterConfig = {
  id: string;
  name: string;
  spriteBase: string;
  animations: Record<string, {
    frames: number;
    frameRate: number;
  }>;
};
