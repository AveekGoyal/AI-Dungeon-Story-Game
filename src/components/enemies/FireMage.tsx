import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface FireMageProps {
  scale?: number;
  facing?: 'left' | 'right';
  animation?: 'idle' | 'walk' | 'run' | 'jump' | 'attack1' | 'attack2' | 'fireball' | 'flamejet' | 'hurt' | 'dead';
  onAnimationComplete?: () => void;
  className?: string;
}

const FRAME_COUNTS = {
  idle: 7,
  walk: 6,
  run: 8,
  jump: 9,
  attack1: 4,
  attack2: 4,
  fireball: 8,
  flamejet: 16,
  hurt: 3,
  dead: 6,
};

const SPRITE_SIZE = {
  WIDTH: 32,
  HEIGHT: 32,
};

export const FireMage: React.FC<FireMageProps> = ({
  scale = 1,
  facing = 'right',
  animation = 'idle',
  onAnimationComplete,
  className = '',
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    const totalFrames = FRAME_COUNTS[animation];
    
    if (isAnimating) {
      frameInterval = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = (prev + 1) % totalFrames;
          
          // If we've completed a cycle and it's a one-time animation
          if (nextFrame === 0 && ['attack1', 'attack2', 'fireball', 'flamejet', 'hurt', 'dead'].includes(animation)) {
            setIsAnimating(false);
            onAnimationComplete?.();
          }
          
          return nextFrame;
        });
      }, 100); // Adjust timing as needed
    }

    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [animation, isAnimating, onAnimationComplete]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
    <motion.div
      className={`relative ${className}`}
      style={{
        transform: `scale(${scale}) scaleX(${facing === 'left' ? -1 : 1})`,
      }}
    >
      <div
        className="w-32 h-32 bg-contain bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(/assets/characters/fire_mage/${animation}/${currentFrame}.png)`,
        }}
      />
    </motion.div>
  );
};

export default FireMage;
