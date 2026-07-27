import { useMemo } from 'react';
import { randomBetween } from '../../lib/utils';

interface Star {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export function CountdownBackground() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 40 }, () => ({
        left: randomBetween(0, 100),
        top: randomBetween(0, 100),
        size: randomBetween(1, 3),
        delay: randomBetween(0, 5),
        duration: randomBetween(3, 8),
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
      <div className="absolute inset-0 bg-moonlight opacity-50" />
      <div className="absolute inset-0 bg-radial-spotlight" />

      <div
        className="absolute left-0 right-0 animate-fog-drift"
        style={{
          top: '40%',
          height: '30%',
          background: 'linear-gradient(to right, transparent, rgba(30,28,38,0.28), transparent)',
          animationDuration: '26s',
        }}
      />

      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="absolute rounded-full bg-gold-100 animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: '0 0 3px rgba(245,217,142,0.6)',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.7)' }} />
    </div>
  );
}
