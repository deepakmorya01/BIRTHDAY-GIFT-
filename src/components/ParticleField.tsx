import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleFieldProps {
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

export function ParticleField({ count = 28 }: ParticleFieldProps) {
  const particlesRef = useRef<Particle[]>([]);
  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 6,
      drift: (Math.random() - 0.5) * 40,
    }));
  }

  useEffect(() => {
    return () => { particlesRef.current = []; };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particlesRef.current.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(233, 177, 58, 0.7)',
            boxShadow: '0 0 6px rgba(233, 177, 58, 0.5)',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -120 - Math.random() * 80],
            x: [0, p.drift],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
