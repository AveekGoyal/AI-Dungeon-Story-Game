'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Crimson specific animations and configurations
export const CRIMSON_ANIMATIONS = {
  Idle: { frames: 6, frameRate: 12 },
  Walk: { frames: 8, frameRate: 16 },
  Run: { frames: 7, frameRate: 14 },
  Jump: { frames: 6, frameRate: 12 },
  Attack_1: { frames: 5, frameRate: 10 },
  Attack_2: { frames: 2, frameRate: 4 },
  Attack_3: { frames: 5, frameRate: 10 },
  Attack_4: { frames: 5, frameRate: 10 },
  Hurt: { frames: 3, frameRate: 6 },
  Dead: { frames: 4, frameRate: 8 }
} as const;

export type CrimsonAnimationType = keyof typeof CRIMSON_ANIMATIONS;

interface CrimsonProps {
  animation?: CrimsonAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function Crimson({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: CrimsonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/adventurer/crimson/${animation}.png`;
  };

  // Cleanup function to cancel animation frame
  const cleanup = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Load sprite sheet when animation changes
  useEffect(() => {
    cleanup();
    loadSpriteSheet();
    return cleanup;
  }, [animation]);

  const loadSpriteSheet = () => {
    setIsLoading(true);
    setError(null);
    frameRef.current = 0;

    const image = new Image();
    const spritePath = getSpritePath();

    image.onload = () => {
      setIsLoading(false);
      const animConfig = CRIMSON_ANIMATIONS[animation];
      requestAnimationFrame(() => startAnimation(image, animConfig));
    };

    image.onerror = () => {
      console.error('Failed to load Crimson sprite:', spritePath);
      setError(`Failed to load sprite: ${spritePath}`);
      setIsLoading(false);
    };

    image.src = spritePath;
  };

  const startAnimation = (image: HTMLImageElement, animConfig: { frames: number; frameRate: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastFrameTime = 0;
    const frameDuration = 1000 / animConfig.frameRate;

    const animate = (timestamp: number) => {
      if (!lastFrameTime) lastFrameTime = timestamp;
      const deltaTime = timestamp - lastFrameTime;

      if (deltaTime >= frameDuration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          image,
          frameRef.current * SPRITE_SIZE.WIDTH,
          0,
          SPRITE_SIZE.WIDTH,
          SPRITE_SIZE.HEIGHT,
          0,
          0,
          SPRITE_SIZE.WIDTH * scale,
          SPRITE_SIZE.HEIGHT * scale
        );

        frameRef.current = (frameRef.current + 1) % animConfig.frames;
        if (frameRef.current === 0 && onAnimationComplete) {
          onAnimationComplete();
        }

        lastFrameTime = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ width: SPRITE_SIZE.WIDTH * scale, height: SPRITE_SIZE.HEIGHT * scale }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={SPRITE_SIZE.WIDTH * scale}
      height={SPRITE_SIZE.HEIGHT * scale}
      className={className}
    />
  );
}
