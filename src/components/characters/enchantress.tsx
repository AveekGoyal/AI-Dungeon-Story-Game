'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Enchantress specific animations and configurations
export const ENCHANTRESS_ANIMATIONS = {
  Idle: { frames: 5, frameRate: 10 },
  Walk: { frames: 8, frameRate: 16 },
  Run: { frames: 8, frameRate: 16 },
  Jump: { frames: 8, frameRate: 16 },
  Attack_1: { frames: 6, frameRate: 12 },
  Attack_2: { frames: 3, frameRate: 6 },
  Attack_3: { frames: 3, frameRate: 6 },
  Attack_4: { frames: 10, frameRate: 20 },
  Hurt: { frames: 2, frameRate: 4 },
  Dead: { frames: 5, frameRate: 10 }
} as const;

export type EnchantressAnimationType = keyof typeof ENCHANTRESS_ANIMATIONS;

interface EnchantressProps {
  animation?: EnchantressAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function Enchantress({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: EnchantressProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/mages/enchantress/${animation}.png`;
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
      const animConfig = ENCHANTRESS_ANIMATIONS[animation];
      requestAnimationFrame(() => startAnimation(image, animConfig));
    };

    image.onerror = () => {
      console.error('Failed to load Enchantress sprite:', spritePath);
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
      const elapsed = timestamp - lastFrameTime;

      if (elapsed >= frameDuration) {
        // Clear the canvas
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

        // Update frame counter
        frameRef.current = (frameRef.current + 1) % animConfig.frames;
        
        // Call onAnimationComplete when cycle completes
        if (frameRef.current === 0 && onAnimationComplete) {
          onAnimationComplete();
        }

        lastFrameTime = timestamp;
      }

      // Continue the animation loop
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
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
      className={`pixelated ${className}`}
      style={{
        imageRendering: 'pixelated',
        width: SPRITE_SIZE.WIDTH * scale,
        height: SPRITE_SIZE.HEIGHT * scale
      }}
    />
  );
}
