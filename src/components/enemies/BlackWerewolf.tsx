'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE } from '@/lib/constants';

// Black Werewolf specific animations and configurations
export const BLACK_WEREWOLF_ANIMATIONS = {
  Idle: { frames: 8, frameRate: 16 },
  Walk: { frames: 11, frameRate: 22 },
  Run: { frames: 9, frameRate: 18 },
  Jump: { frames: 7, frameRate: 14 },
  Attack_1: { frames: 6, frameRate: 12 },
  Attack_2: { frames: 4, frameRate: 8 },
  Attack_3: { frames: 5, frameRate: 10 },
  Run_Attack: { frames: 7, frameRate: 14 },
  Hurt: { frames: 2, frameRate: 4 },
  Dead: { frames: 2, frameRate: 4 }
} as const;

export type BlackWerewolfAnimationType = keyof typeof BLACK_WEREWOLF_ANIMATIONS;

export interface BlackWerewolfProps {
  animation?: BlackWerewolfAnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function BlackWerewolf({
  animation = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: BlackWerewolfProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `/sprites/enemies/warewolfs/black_warewolfs/${animation}.png`;
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
    const image = new Image();
    const spritePath = getSpritePath();
    let isMounted = true;

    const loadImage = async () => {
      setIsLoading(true);
      setError(null);
      frameRef.current = 0;

      try {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = spritePath;
        });

        if (isMounted) {
          setIsLoading(false);
          const animConfig = BLACK_WEREWOLF_ANIMATIONS[animation];
          requestAnimationFrame((timestamp) => startAnimation(image, animConfig, timestamp));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load Black Werewolf sprite:', spritePath);
          setError(`Failed to load sprite: ${spritePath}`);
          setIsLoading(false);
        }
      }
    };

    cleanup();
    loadImage();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [animation]);

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

      // Clear canvas before checking deltaTime to prevent frame persistence
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (deltaTime >= frameDuration) {
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
      } else {
        // If we haven't reached the next frame time, redraw the current frame
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
