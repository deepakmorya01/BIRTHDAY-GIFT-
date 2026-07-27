import { useMemo } from 'react';
import { randomBetween } from '../../lib/utils';

interface Star {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

interface GlowOrb {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export function WelcomeBackground() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 50 }, () => ({
        left: randomBetween(0, 100),
        top: randomBetween(0, 100),
        size: randomBetween(1, 3),
        delay: randomBetween(0, 4),
        duration: randomBetween(3, 7),
      })),
    [],
  );

  const orbs = useMemo<GlowOrb[]>(
    () =>
      Array.from({ length: 5 }, () => ({
        left: randomBetween(10, 90),
        top: randomBetween(15, 85),
        size: randomBetween(120, 260),
        delay: randomBetween(0, 6),
        duration: randomBetween(12, 22),
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
      <div className="absolute inset-0 bg-moonlight opacity-60" />
      <div className="absolute inset-0 bg-radial-spotlight" />

      {orbs.map((o, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full animate-fog-drift"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: `${o.size}px`,
            height: `${o.size}px`,
            background: 'radial-gradient(circle, rgba(239,196,87,0.07) 0%, transparent 70%)',
            animationDuration: `${o.duration}s`,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}

      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 animate-fog-drift"
        style={{ background: 'linear-gradient(to top, rgba(20,20,30,0.5), transparent)' }}
      />
      <div
        className="absolute top-1/4 left-0 right-0 h-1/3 animate-fog-drift"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(30,30,40,0.25), transparent)',
          animationDelay: '6s',
          animationDuration: '28s',
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
