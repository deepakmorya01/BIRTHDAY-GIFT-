import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Home } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { randomBetween } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

interface GoldMote {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

export function MemoryAlbumScene({ isActive: _isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const managerRef = useRef(manager);
  managerRef.current = manager;

  const motes = useMemo<GoldMote[]>(
    () =>
      Array.from({ length: 24 }, () => ({
        left: randomBetween(0, 100),
        top: randomBetween(10, 90),
        size: randomBetween(2, 5),
        delay: randomBetween(0, 5),
        duration: randomBetween(8, 16),
        drift: randomBetween(-30, 30),
      })),
    [],
  );

  const handleReplay = () => managerRef.current?.goTo('welcome');
  const handleStart = () => managerRef.current?.goTo('loading');

  return (
    <motion.div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: EASE }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(233,177,58,0.05), transparent 70%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        {motes.map((m, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              background: 'rgba(245,217,142,0.9)',
              boxShadow: '0 0 6px rgba(245,217,142,0.6)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, m.drift, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: m.duration,
              delay: m.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.6)' }}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
      >
        <motion.h1
          className="font-display text-4xl sm:text-5xl text-gradient-gold"
          style={{ textShadow: '0 0 30px rgba(233,177,58,0.35)' }}
        >
          Thank You
        </motion.h1>

        <motion.p
          className="mt-6 font-body text-base sm:text-lg leading-relaxed text-void-100"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
        >
          Thank you for taking this beautiful journey.
          <br />
          I hope this little surprise made your birthday even more special.
        </motion.p>

        <motion.p
          className="mt-5 font-display text-xl sm:text-2xl italic text-gradient-gold"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: EASE }}
        >
          Happy Birthday Once Again
        </motion.p>

        <motion.p
          className="mt-4 font-body text-base sm:text-lg text-void-100"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2, ease: EASE }}
        >
          With Love,
          <br />
          Deepak
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.6, ease: EASE }}
        >
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-medium transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #e9b13a, #b87d1c)',
              color: '#1a1208',
              border: '1px solid rgba(233,177,58,0.6)',
              boxShadow: '0 0 24px rgba(233,177,58,0.25)',
            }}
          >
            <RotateCcw size={18} />
            <span>Replay Journey</span>
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-medium transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'transparent',
              color: '#e9b13a',
              border: '1px solid rgba(233,177,58,0.5)',
            }}
          >
            <Home size={18} />
            <span>Back to Start</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
