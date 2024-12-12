'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Skeleton Spearman specific animations and configurations
export const SKELETON_SPEARMAN_ANIMATIONS = {
  Idle: { frames: 6, frameRate: 12 },
  Walk: { frames: 7, frameRate: 14 },
  Run: { frames: 6, frameRate: 12 },
  Attack_1: { frames: 4, frameRate: 8 },
  Attack_2: { frames: 4, frameRate: 8 },
  Run_Attack: { frames: 5, frameRate: 10 },
  Protect: { frames: 2, frameRate: 4 },
  Fall: { frames: 6, frameRate: 12 },
  Hurt: { frames: 3, frameRate: 6 },
  Dead: { frames: 5, frameRate: 10 }
} as const;

export type SkeletonSpearmanAnimationType = keyof typeof SKELETON_SPEARMAN_ANIMATIONS;

export interface SkeletonSpearmanProps {
  animation?: SkeletonSpearmanAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function SkeletonSpearman({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: SkeletonSpearmanProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/enemies/skeleton_spearman/${animation}.png`;
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
      const animConfig = SKELETON_SPEARMAN_ANIMATIONS[animation];
      requestAnimationFrame((timestamp) => startAnimation(image, animConfig, timestamp));
    };

    image.onerror = () => {
      console.error('Failed to load Skeleton Spearman sprite:', spritePath);
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

    // Disable image smoothing for pixel art
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

        // Update frame
        frameRef.current = (frameRef.current + 1) % animConfig.frames;
        if (frameRef.current === 0 && onAnimationComplete) {
          onAnimationComplete();
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
