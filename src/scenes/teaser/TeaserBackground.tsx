import { useMemo } from 'react';
import { randomBetween } from '../../lib/utils';

interface Firefly {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

interface FogBand {
  top: number;
  height: number;
  delay: number;
  duration: number;
}

interface Sparkle {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export function TeaserBackground() {
  const fireflies = useMemo<Firefly[]>(
    () =>
      Array.from({ length: 16 }, () => ({
        left: randomBetween(5, 95),
        top: randomBetween(10, 90),
        size: randomBetween(3, 5),
        delay: randomBetween(0, 6),
        duration: randomBetween(7, 14),
      })),
    [],
  );

  const fogBands = useMemo<FogBand[]>(
    () => [
      { top: 55, height: 30, delay: 0, duration: 26 },
      { top: 25, height: 25, delay: 6, duration: 32 },
    ],
    [],
  );

  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: 25 }, () => ({
        left: randomBetween(0, 100),
        top: randomBetween(0, 100),
        size: randomBetween(1, 2.5),
        delay: randomBetween(0, 5),
        duration: randomBetween(3, 6),
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/70 via-void-900/70 to-void-950/70" />
      <div className="absolute inset-0 bg-moonlight opacity-50" />
      <div className="absolute inset-0 bg-radial-spotlight" />

      {fogBands.map((f, i) => (
        <div
          key={`fog-${i}`}
          className="absolute left-0 right-0 animate-fog-drift"
          style={{
            top: `${f.top}%`,
            height: `${f.height}%`,
            background: 'linear-gradient(to right, transparent, rgba(30,28,38,0.28), transparent)',
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        />
      ))}

      {fireflies.map((f, i) => (
        <div
          key={`firefly-${i}`}
          className="absolute animate-firefly-wander"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        >
          <span
            className="block rounded-full"
            style={{
              width: `${f.size}px`,
              height: `${f.size}px`,
              background: 'rgba(239,196,87,0.9)',
              boxShadow: '0 0 8px rgba(239,196,87,0.7), 0 0 16px rgba(239,196,87,0.3)',
            }}
          />
        </div>
      ))}

      {sparkles.map((s, i) => (
        <span
          key={`sparkle-${i}`}
          className="absolute rounded-full bg-gold-100 animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.7)' }} />
    </div>
  );
}
