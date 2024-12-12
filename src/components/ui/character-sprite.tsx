'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRITE_SIZE, CharacterClass, AnimationType } from '@/lib/constants';
import { CharacterConfig } from '@/config/characters';

interface CharacterSpriteProps {
  config: CharacterConfig;
  animationType?: AnimationType;
  scale?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export function CharacterSprite({
  config,
  animationType = 'Idle',
  scale = 1,
  onAnimationComplete,
  className = ''
}: CharacterSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const [spriteSheet, setSpriteSheet] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getSpritePath = () => {
    return `${config.spriteBase}/${animationType}.png`;
  };

  // Cleanup function to cancel animation frame
  const cleanup = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Load sprite sheet when character or animation changes
  useEffect(() => {
    cleanup();
    loadSpriteSheet();
    return cleanup;
  }, [config.spriteBase, animationType]);

  const loadSpriteSheet = () => {
    setIsLoading(true);
    setError(null);
    frameRef.current = 0;

    const image = new Image();
    const spritePath = getSpritePath();

    image.onload = () => {
      setSpriteSheet(image);
      setIsLoading(false);
      const animConfig = config.animations[animationType];
      if (animConfig) {
        requestAnimationFrame(() => startAnimation(image, animConfig));
      }
    };

    image.onerror = () => {
      console.error('Failed to load sprite:', spritePath);
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
        lastFrameTime = timestamp;

        // Call onAnimationComplete if we've completed a cycle
        if (frameRef.current === 0 && onAnimationComplete) {
          onAnimationComplete();
        }
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(animate);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-300 rounded-lg" style={{ width: SPRITE_SIZE.WIDTH * scale, height: SPRITE_SIZE.HEIGHT * scale }} />;
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
        height: SPRITE_SIZE.HEIGHT * scale,
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    />
  );
}
