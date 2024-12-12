import { useState } from 'react';
import { motion } from 'framer-motion';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'weapon' | 'armor' | 'potion' | 'scroll' | 'key' | 'treasure';

export interface GameItemProps {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description?: string;
  icon: string;
  animate?: boolean;
  onClick?: () => void;
  className?: string;
}

const RARITY_COLORS = {
  common: 'border-gray-400',
  uncommon: 'border-green-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400',
};

const RARITY_GLOWS = {
  common: 'shadow-gray-400/50',
  uncommon: 'shadow-green-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-purple-400/50',
  legendary: 'shadow-yellow-400/50',
};

export const GameItem: React.FC<GameItemProps> = ({
  name,
  type,
  rarity,
  description,
  icon,
  animate = true,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const itemVariants = {
    idle: {
      y: 0,
      rotate: 0,
      scale: 1,
    },
    hover: {
      y: -5,
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <div className="relative">
      <motion.div
        className={`
          relative cursor-pointer
          rounded-lg border-2 p-2
          ${RARITY_COLORS[rarity]}
          ${animate ? 'hover:shadow-lg' : ''}
          ${RARITY_GLOWS[rarity]}
          ${className}
        `}
        variants={animate ? itemVariants : undefined}
        initial="idle"
        animate={isHovered ? 'hover' : 'idle'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div
          className="w-12 h-12 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${icon})` }}
        />
      </motion.div>

      {/* Tooltip */}
      {isHovered && (
        <motion.div
          className="absolute z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg -top-24 left-1/2 transform -translate-x-1/2"
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-gray-300 capitalize">{type} • {rarity}</div>
          {description && (
            <div className="text-xs mt-1 text-gray-400">{description}</div>
          )}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
        </motion.div>
      )}
    </div>
  );
};

export default GameItem;
