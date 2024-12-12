import { motion } from 'framer-motion';

export interface BackgroundProps {
  type: 'castle' | 'mountains' | 'forest' | 'dungeon';
  weather?: 'clear' | 'rain' | 'snow' | 'fog';
  timeOfDay?: 'day' | 'night' | 'dusk' | 'dawn';
  parallax?: boolean;
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({
  type,
  weather = 'clear',
  timeOfDay = 'day',
  parallax = false,
  className = '',
}) => {
  const getBackgroundLayers = () => {
    // This will be replaced with actual background layer images
    const layers = [
      `${type}_bg`,
      `${type}_middle`,
      `${type}_fg`,
    ];

    return layers.map((layer, index) => ({
      image: `/assets/environments/${type}/${layer}.png`,
      parallaxStrength: parallax ? (index + 1) * 0.2 : 0,
    }));
  };

  const getWeatherEffect = () => {
    if (weather === 'clear') return null;

    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(/assets/effects/${weather}.png)`,
          opacity: 0.5,
        }}
      />
    );
  };

  const getDayNightOverlay = () => {
    if (timeOfDay === 'day') return null;

    const overlayOpacity = {
      night: 0.5,
      dusk: 0.3,
      dawn: 0.2,
    }[timeOfDay];

    return (
      <div
        className="absolute inset-0 pointer-events-none bg-blue-900"
        style={{ opacity: overlayOpacity }}
      />
    );
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {getBackgroundLayers().map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${layer.image})`,
            zIndex: index,
          }}
          animate={parallax ? {
            x: [-10 * layer.parallaxStrength, 10 * layer.parallaxStrength],
          } : undefined}
          transition={parallax ? {
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          } : undefined}
        />
      ))}
      {getWeatherEffect()}
      {getDayNightOverlay()}
    </div>
  );
};

export default Background;
