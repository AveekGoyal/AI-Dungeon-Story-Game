'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Fire Spirit specific animations and configurations
export const FIRE_SPIRIT_ANIMATIONS = {
  Idle: { frames: 6, frameRate: 12 },
  Idle_2: { frames: 6, frameRate: 12 },
  Walk: { frames: 7, frameRate: 14 },
  Run: { frames: 7, frameRate: 14 },
  Attack: { frames: 14, frameRate: 28 },
  Shot: { frames: 8, frameRate: 16 },
  Charge: { frames: 8, frameRate: 16 },
  Explosion: { frames: 11, frameRate: 22 },
  Flame: { frames: 13, frameRate: 26 },
  Hurt: { frames: 3, frameRate: 6 },
  Dead: { frames: 5, frameRate: 10 }
} as const;

export type FireSpiritAnimationType = keyof typeof FIRE_SPIRIT_ANIMATIONS;

interface FireSpiritProps {
  animation?: FireSpiritAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function FireSpirit({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: FireSpiritProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/enemies/fire_spirit/${animation}.png`;
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
      const animConfig = FIRE_SPIRIT_ANIMATIONS[animation];
      requestAnimationFrame(() => startAnimation(image, animConfig));
    };

    image.onerror = () => {
      console.error('Failed to load Fire Spirit sprite:', spritePath);
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

    // Enable image smoothing for better scaling
    ctx.imageSmoothingEnabled = false;

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
          canvas.width,
          canvas.height
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
