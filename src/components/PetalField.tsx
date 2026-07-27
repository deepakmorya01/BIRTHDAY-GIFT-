import { useMemo } from 'react';
import { randomBetween, randomInt } from '../lib/utils';

interface PetalFieldProps {
  count?: number;
  className?: string;
}

interface Petal {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  hue: number;
}

export function PetalField({ count = 15, className = '' }: PetalFieldProps) {
  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: randomBetween(0, 100),
        size: randomBetween(8, 16),
        duration: randomBetween(10, 18),
        delay: randomBetween(0, 12),
        drift: randomBetween(-60, 60),
        hue: randomInt(0, 20),
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-petal-fall"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        >
          <svg viewBox="0 0 20 12" fill="none" className="w-full h-full">
            <path
              d="M10 0C14 2 18 4 20 6C18 8 14 10 10 12C6 10 2 8 0 6C2 4 6 2 10 0Z"
              fill={`hsl(${340 + p.hue}, 80%, ${75 + p.hue / 4}%)`}
              opacity={0.7}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
