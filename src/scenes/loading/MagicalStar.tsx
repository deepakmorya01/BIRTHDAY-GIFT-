import { motion } from 'framer-motion';

interface MagicalStarProps {
  intensity: number;
  dissolving: boolean;
}

export function MagicalStar({ intensity, dissolving }: MagicalStarProps) {
  const scale = 0.8 + intensity * 0.4;
  const glow = 0.3 + intensity * 0.7;

  return (
    <motion.div
      className="relative"
      animate={dissolving ? { scale: 1.5, opacity: 0 } : { scale, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(239,196,87,1)" />
            <stop offset="40%" stopColor="rgba(239,196,87,0.6)" />
            <stop offset="100%" stopColor="rgba(239,196,87,0)" />
          </radialGradient>
          <linearGradient id="starBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf8ec" />
            <stop offset="50%" stopColor="#f5d98e" />
            <stop offset="100%" stopColor="#e9b13a" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#starGlow)" opacity={glow} />
        <path
          d="M40 8L47 30L70 33L52 48L58 70L40 58L22 70L28 48L10 33L33 30Z"
          fill="url(#starBody)"
          stroke="rgba(255,240,200,0.5)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
}
