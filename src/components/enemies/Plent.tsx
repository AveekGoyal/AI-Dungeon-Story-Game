'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Plent specific animations and configurations
export const PLENT_ANIMATIONS = {
  Idle: { frames: 5, frameRate: 10 },
  Walk: { frames: 9, frameRate: 18 },
  Attack_1: { frames: 6, frameRate: 12 },
  Attack_2: { frames: 5, frameRate: 10 },
  Attack_3: { frames: 8, frameRate: 16 },
  Attack_Disguise: { frames: 7, frameRate: 14 },
  Disguise: { frames: 11, frameRate: 22 },
  Poison: { frames: 7, frameRate: 14 },
  Hurt: { frames: 3, frameRate: 6 },
  Dead: { frames: 2, frameRate: 4 }
} as const;

export type PlentAnimationType = keyof typeof PLENT_ANIMATIONS;

export interface PlentProps {
  animation?: PlentAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function Plent({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: PlentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/enemies/plent/${animation}.png`;
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
      const animConfig = PLENT_ANIMATIONS[animation];
      requestAnimationFrame((timestamp) => startAnimation(image, animConfig, timestamp));
    };

    image.onerror = () => {
      console.error('Failed to load Plent sprite:', spritePath);
      setError(`Failed to load sprite: ${spritePath}`);
      setIsLoading(false);
    };

    image.src = spritePath;
  };

  const startAnimation = (
    image: HTMLImageElement, 
    animConfig: { frames: number; frameRate: number },
    timestamp: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable image smoothing for better pixel art rendering
    ctx.imageSmoothingEnabled = false;

    let lastFrameTime = timestamp;
    const frameDuration = 1000 / animConfig.frameRate;

    const animate = (currentTime: number) => {
      if (!canvas || !ctx) return;

      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameDuration) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw current frame
        ctx.drawImage(
          image,
          frameRef.current * SPRITE_SIZE.WIDTH,
          0,
          SPRITE_SIZE.WIDTH,
          SPRITE_SIZE.HEIGHT,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Special handling for Dead animation - stop at last frame
        if (animation === 'Dead') {
          if (frameRef.current < animConfig.frames - 1) {
            frameRef.current += 1;
          } else {
            if (onAnimationComplete) {
              onAnimationComplete();
            }
            return; // Stop the animation
          }
        } else {
          // Normal animation loop for other animations
          frameRef.current = (frameRef.current + 1) % animConfig.frames;
          if (frameRef.current === 0 && onAnimationComplete) {
            onAnimationComplete();
          }
        }
        lastFrameTime = currentTime;
      }

      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
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
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: SPRITE_SIZE.WIDTH * scale,
        height: SPRITE_SIZE.HEIGHT * scale,
      }}
    >
      <canvas
        ref={canvasRef}
        width={SPRITE_SIZE.WIDTH * scale}
        height={SPRITE_SIZE.HEIGHT * scale}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
