import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { randomBetween } from '../../lib/utils';

interface ButterflyProps {
  count?: number;
  className?: string;
}

interface Butterfly {
  id: number;
  startX: number;
  driftX: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  wingDur: number;
}

const COLORS = [
  'rgba(239,196,87,0.9)',
  'rgba(245,217,142,0.9)',
  'rgba(255,180,200,0.9)',
  'rgba(255,220,180,0.9)',
];

export function ButterflyField({ count = 12, className = '' }: ButterflyProps) {
  const butterflies = useMemo<Butterfly[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        startX: randomBetween(15, 85),
        driftX: randomBetween(-80, 80),
        size: randomBetween(16, 28),
        duration: randomBetween(5, 9),
        delay: randomBetween(0, 2.5),
        color: COLORS[i % COLORS.length],
        wingDur: randomBetween(0.25, 0.45),
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-0"
          style={{ left: `${b.startX}%` }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -window.innerHeight * 0.9, x: b.driftX }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            ease: 'easeOut',
            times: [0, 0.1, 0.85, 1],
          }}
        >
          <Butterfly size={b.size} color={b.color} wingDur={b.wingDur} />
        </motion.div>
      ))}
    </div>
  );
}

function Butterfly({ size, color, wingDur }: { size: number; color: string; wingDur: number }) {
  return (
    <div style={{ width: size, height: size * 0.85, position: 'relative' }}>
      <svg viewBox="0 0 40 34" width={size} height={size * 0.85} fill="none">
        <g style={{ transformOrigin: '20px 17px' }}>
          <motion.ellipse
            cx={12} cy={13} rx={9} ry={11}
            fill={color}
            opacity={0.85}
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: wingDur, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '20px 17px' }}
          />
          <motion.ellipse
            cx={28} cy={13} rx={9} ry={11}
            fill={color}
            opacity={0.85}
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: wingDur, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '20px 17px' }}
          />
        </g>
        <ellipse cx={20} cy={17} rx={1.5} ry={9} fill="rgba(40,30,20,0.6)" />
      </svg>
    </div>
  );
}
