import { useMemo } from 'react';
import { randomBetween } from '../../lib/utils';

interface Firefly {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  xDrift: number;
  yDrift: number;
}

interface FogBand {
  top: number;
  height: number;
  delay: number;
  duration: number;
}

export function GiftBackground() {
  const fireflies = useMemo<Firefly[]>(
    () =>
      Array.from({ length: 18 }, () => ({
        left: randomBetween(5, 95),
        top: randomBetween(10, 90),
        size: randomBetween(3, 6),
        delay: randomBetween(0, 6),
        duration: randomBetween(6, 12),
        xDrift: randomBetween(-40, 40),
        yDrift: randomBetween(-60, -20),
      })),
    [],
  );

  const fogBands = useMemo<FogBand[]>(
    () => [
      { top: 60, height: 35, delay: 0, duration: 24 },
      { top: 30, height: 28, delay: 8, duration: 30 },
      { top: 75, height: 25, delay: 4, duration: 20 },
    ],
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(233,177,58,0.14), transparent 70%)',
        }}
      />
      <div className="absolute inset-0 bg-moonlight opacity-40" />

      {fogBands.map((f, i) => (
        <div
          key={`fog-${i}`}
          className="absolute left-0 right-0 animate-fog-drift"
          style={{
            top: `${f.top}%`,
            height: `${f.height}%`,
            background: 'linear-gradient(to right, transparent, rgba(30,28,38,0.3), transparent)',
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
            ['--x-drift' as string]: `${f.xDrift}px`,
            ['--y-drift' as string]: `${f.yDrift}px`,
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

      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.7)' }} />
    </div>
  );
}
