import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Home } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { randomBetween } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = 'burst' | 'settle' | 'calm' | 'finale';

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  color: string;
  size: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
  scale: number;
}

interface GoldMote {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const CONFETTI_COLORS = ['#e9b13a', '#f5d98e', '#d4a017', '#fff7e6', '#c4c4cc'];
const FIREWORK_COLORS = ['#e9b13a', '#f5d98e', '#fff7e6', '#d4a017'];

export function CelebrationScene({ isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const managerRef = useRef(manager);
  managerRef.current = manager;

  const [phase, setPhase] = useState<Phase>('burst');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const confetti = useMemo<Confetti[]>(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: randomBetween(0, 100),
        delay: randomBetween(0, 1.5),
        duration: randomBetween(3, 5.5),
        drift: randomBetween(-120, 120),
        rotate: randomBetween(0, 360),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: randomBetween(6, 12),
      })),
    [],
  );

  const fireworks = useMemo<Firework[]>(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        x: randomBetween(15, 85),
        y: randomBetween(20, 55),
        delay: randomBetween(0, 2.5),
        color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
        scale: randomBetween(0.7, 1.4),
      })),
    [],
  );

  const motes = useMemo<GoldMote[]>(
    () =>
      Array.from({ length: 28 }, () => ({
        left: randomBetween(0, 100),
        top: randomBetween(10, 90),
        size: randomBetween(2, 5),
        delay: randomBetween(0, 5),
        duration: randomBetween(8, 16),
        drift: randomBetween(-30, 30),
      })),
    [],
  );

  useEffect(() => {
    if (!isActive) return;
    const schedule: [Phase, number][] = [
      ['settle', 4200],
      ['calm', 7800],
      ['finale', 10000],
    ];
    const created = schedule.map(([p, delay]) => setTimeout(() => setPhase(p), delay));
    timersRef.current = created;
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [isActive]);

  const showConfetti = phase === 'burst' || phase === 'settle';
  const showFireworks = phase === 'burst' || phase === 'settle';
  const showMotes = phase === 'calm' || phase === 'finale';
  const showCard = phase === 'finale';

  const handleReplay = () => managerRef.current?.goTo('welcome');
  const handleStart = () => managerRef.current?.goTo('loading');

  return (
    <motion.div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE }}
    >
      {/* Background gradient — warms during burst, calms later */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950"
        animate={{
          opacity: phase === 'burst' ? 0.85 : 1,
        }}
        transition={{ duration: 2, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 50% 40%, rgba(233,177,58,0.18), transparent 60%)',
            'radial-gradient(ellipse at 50% 45%, rgba(233,177,58,0.08), transparent 65%)',
            'radial-gradient(ellipse at 50% 50%, rgba(233,177,58,0.03), transparent 70%)',
          ],
        }}
        transition={{ duration: 4, ease: EASE }}
      />

      {/* Fireworks */}
      <AnimatePresence>
        {showFireworks && (
          <div className="pointer-events-none absolute inset-0 z-[1]">
            {fireworks.map((fw) => (
              <motion.div
                key={fw.id}
                className="absolute"
                style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, fw.scale, fw.scale * 0.4], opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, delay: fw.delay, ease: 'easeOut' }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: fw.color,
                    boxShadow: `0 0 40px 12px ${fw.color}, 0 0 80px 24px ${fw.color}66`,
                  }}
                />
                {Array.from({ length: 14 }).map((_, j) => {
                  const angle = (j / 14) * Math.PI * 2;
                  const r = 80 * fw.scale;
                  return (
                    <motion.span
                      key={j}
                      className="absolute rounded-full"
                      style={{
                        width: 4,
                        height: 4,
                        background: fw.color,
                        boxShadow: `0 0 8px ${fw.color}`,
                      }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos(angle) * r,
                        y: Math.sin(angle) * r,
                        opacity: 0,
                      }}
                      transition={{ duration: 1.8, delay: fw.delay, ease: 'easeOut' }}
                    />
                  );
                })}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
            {confetti.map((c) => (
              <motion.div
                key={c.id}
                className="absolute top-[-5%]"
                style={{
                  left: `${c.left}%`,
                  width: c.size,
                  height: c.size * 0.4,
                  background: c.color,
                  borderRadius: 2,
                }}
                initial={{ y: 0, opacity: 1, rotate: c.rotate }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, c.drift],
                  opacity: phase === 'settle' ? [1, 1, 0.4] : [1, 1, 0.8],
                  rotate: [c.rotate, c.rotate + 360],
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  repeat: phase === 'burst' ? Infinity : 0,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Soft golden particles — remain after everything settles */}
      <AnimatePresence>
        {showMotes && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[3]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, ease: EASE }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{ boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.6)' }}
      />

      {/* Finale: thank-you glass card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="relative z-10 w-full max-w-lg text-center"
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <motion.h1
              className="font-display text-4xl sm:text-5xl text-gradient-gold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}
