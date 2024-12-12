import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface WerewolfProps {
  scale?: number;
  facing?: 'left' | 'right';
  animation?: 'idle' | 'walk' | 'run' | 'jump' | 'attack' | 'howl' | 'hit' | 'death';
  onAnimationComplete?: () => void;
  className?: string;
}

const FRAME_COUNTS = {
  idle: 6,     // Standing alert
  walk: 8,     // Walking animation
  run: 6,      // Running animation
  jump: 7,     // Jump attack
  attack: 6,   // Claw attack
  howl: 8,     // Howling animation
  hit: 4,      // Taking damage
  death: 8,    // Death animation
};

const SPRITE_SIZE = {
  WIDTH: 48,
  HEIGHT: 48,
};

export const Werewolf: React.FC<WerewolfProps> = ({
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
    const loadSprite = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };

    loadSprite();
  }, []);

  useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    const totalFrames = FRAME_COUNTS[animation];
    
    if (isAnimating) {
      frameInterval = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = (prev + 1) % totalFrames;
          
          // If we've completed a cycle and it's a one-time animation
          if (nextFrame === 0 && ['attack', 'jump', 'howl', 'hit', 'death'].includes(animation)) {
            setIsAnimating(false);
            onAnimationComplete?.();
          }
          
          return nextFrame;
        });
      }, 90); // Faster for aggressive movements
    }

    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [animation, isAnimating, onAnimationComplete]);

  // Add dust particles for running animation
  const dustParticles = Array.from({ length: 3 }).map((_, index) => ({
    id: index,
    delay: index * 0.15,
  }));

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
      {/* Main sprite */}
      <div
        className="w-48 h-48 bg-contain bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(/sprites/enemies/warewolfs/${animation}/${currentFrame}.png)`,
        }}
      />

      {/* Dust effect for running */}
      {(animation === 'run' || animation === 'jump') && dustParticles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 bg-gray-300 rounded-full opacity-40"
          animate={{
            x: facing === 'right' ? [-10, -20] : [10, 20],
            y: [0, -5],
            opacity: [0.4, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: particle.delay,
          }}
          style={{
            left: '50%',
            bottom: '10%',
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Attack effect */}
      {animation === 'attack' && currentFrame >= 2 && currentFrame <= 4 && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.8] }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 border-2 border-red-500 rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Werewolf;
