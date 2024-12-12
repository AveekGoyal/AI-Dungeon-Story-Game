'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Forest Troll specific animations and configurations
export const FOREST_TROLL_ANIMATIONS = {
  Attack: { frames: 10, frameRate: 20 },
  Walk: { frames: 10, frameRate: 20 },
  Run: { frames: 10, frameRate: 20 },
  Jump: { frames: 10, frameRate: 20 },
  Idle: { frames: 10, frameRate: 20 },
  Dead: { frames: 10, frameRate: 20 }
} as const;

export type ForestTrollAnimationType = keyof typeof FOREST_TROLL_ANIMATIONS;

interface ForestTrollProps {
  animation?: ForestTrollAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export function ForestTroll({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = '',
  width = SPRITE_SIZE.WIDTH * scale,
  height = SPRITE_SIZE.HEIGHT * scale,
  x = 0,
  y = 0
}: ForestTrollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sprites, setSprites] = useState<HTMLImageElement[]>([]);

  // Load all frames for the current animation
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const loadedSprites: HTMLImageElement[] = [];
    const totalFrames = FOREST_TROLL_ANIMATIONS[animation].frames;

    const loadFrame = (index: number) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        const paddedIndex = index.toString().padStart(3, '0');
        img.src = `/sprites/enemies/trolls/troll1/${animation}_${paddedIndex}.png`;
        
        img.onload = () => {
          loadedSprites[index] = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load frame ${index}`));
      });
    };

    Promise.all(Array.from({ length: totalFrames }, (_, i) => loadFrame(i)))
      .then(() => {
        setSprites(loadedSprites);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      // Cleanup loaded sprites
      loadedSprites.forEach(sprite => {
        sprite.src = '';
      });
    };
  }, [animation]);

  // Animation loop
  useEffect(() => {
    if (isLoading || error || !sprites.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { frames, frameRate } = FOREST_TROLL_ANIMATIONS[animation];
    const frameDuration = 1000 / frameRate;
    let lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameDuration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const currentFrame = frameRef.current;
        const sprite = sprites[currentFrame];
        
        if (sprite) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }

        frameRef.current = (currentFrame + 1) % frames;
        lastFrameTime = currentTime;

        if (frameRef.current === 0 && onAnimationComplete) {
          onAnimationComplete();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animation, isLoading, error, sprites, onAnimationComplete, width, height]);

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
      style={{ 
        imageRendering: 'pixelated',
        width: SPRITE_SIZE.WIDTH * scale,
        height: SPRITE_SIZE.HEIGHT * scale
      }}
    />
  );
}
