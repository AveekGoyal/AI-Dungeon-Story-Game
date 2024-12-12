'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Archer specific animations and configurations
export const ARCHER_ANIMATIONS = {
  Idle: { frames: 6, frameRate: 12 },
  Idle_2: { frames: 4, frameRate: 8 },
  Walk: { frames: 8, frameRate: 16 },
  Run: { frames: 8, frameRate: 16 },
  Jump: { frames: 9, frameRate: 18 },
  Attack_1: { frames: 4, frameRate: 8 },
  Shot_1: { frames: 14, frameRate: 28 },
  Shot_2: { frames: 13, frameRate: 26 },
  Hurt: { frames: 3, frameRate: 6 },
  Dead: { frames: 3, frameRate: 6 }
} as const;

export type ArcherAnimationType = keyof typeof ARCHER_ANIMATIONS;

interface ArcherProps {
  animation?: ArcherAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function Archer({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: ArcherProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/adventurer/archer/${animation}.png`;
  };

  // Cleanup function to cancel animation frame
  const cleanup = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Reset animation state
  const resetAnimation = () => {
    frameRef.current = 0;
    cleanup();
  };

  // Handle sprite loading
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const image = new Image();
    image.src = getSpritePath();
    
    image.onload = () => {
      setIsLoading(false);
      resetAnimation();
    };
    
    image.onerror = () => {
      setError(`Failed to load sprite: ${getSpritePath()}`);
      setIsLoading(false);
    };
    
    return cleanup;
  }, [animation]);

  // Animation loop
  useEffect(() => {
    if (isLoading || error || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = getSpritePath();

    const animationConfig = ARCHER_ANIMATIONS[animation];
    const frameCount = animationConfig.frames;
    const frameRate = animationConfig.frameRate;
    const frameDuration = 1000 / frameRate;
    let lastFrameTime = 0;

    const animate = (currentTime: number) => {
      if (!canvas) return;

      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameDuration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the current frame
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

        frameRef.current = (frameRef.current + 1) % frameCount;
        if (frameRef.current === 0 && onAnimationComplete) {
          onAnimationComplete();
        }

        lastFrameTime = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return cleanup;
  }, [animation, scale, isLoading, error, onAnimationComplete]);

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
      width={SPRITE_SIZE.WIDTH * (scale as number)}
      height={SPRITE_SIZE.HEIGHT * (scale as number)}
      className={className}
    />
  );
}
