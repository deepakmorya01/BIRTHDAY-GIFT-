import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { ParticleField } from '../../components';

const BirthdayWishes3D = lazy(() =>
  import('./BirthdayWishes3D').then((m) => ({ default: m.BirthdayWishes3D }))
);

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealPhase = 'letter-dissolve' | 'particles-gather' | 'birthday-title' | 'cake-rise' | 'hero-shot' | 'wish-prompt';

const PHASE_TIMINGS: Record<RevealPhase, number> = {
  'letter-dissolve': 0,
  'particles-gather': 2500,
  'birthday-title': 4000,
  'cake-rise': 8000,
  'hero-shot': 12000,
  'wish-prompt': 15500,
};

export function BirthdayWishesScene({ isActive: _isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const [phase, setPhase] = useState<RevealPhase>('letter-dissolve');
  const [threePhase, setThreePhase] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const phaseEntries = Object.entries(PHASE_TIMINGS) as [RevealPhase, number][];
    const createdTimers = phaseEntries.map(([p, delay]) =>
      setTimeout(() => {
        setPhase(p);
        if (p === 'cake-rise') setThreePhase(2);
        if (p === 'hero-shot') setThreePhase(2);
        if (p === 'wish-prompt') setThreePhase(3);
        if (p === 'particles-gather') setThreePhase(1);
      }, delay)
    );

    timersRef.current = createdTimers;

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const showTitle = phase === 'birthday-title' || phase === 'cake-rise' || phase === 'hero-shot';
  const showSubtitle = phase === 'birthday-title' || phase === 'cake-rise';
  const showWishPrompt = phase === 'wish-prompt';
  const showCake = phase === 'cake-rise' || phase === 'hero-shot' || phase === 'wish-prompt';
  const hideHtmlTitle = phase === 'cake-rise' || phase === 'hero-shot' || phase === 'wish-prompt';

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dark cinematic background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a0f 40%, #0d0a05 70%, #050508 100%)' }}
      />

      {/* Warm radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(233,177,58,0.1), transparent 55%)',
        }}
      />

      {/* Light rays */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(233,177,58,0.06) 60deg, transparent 120deg, rgba(233,177,58,0.04) 200deg, transparent 280deg, rgba(233,177,58,0.06) 340deg, transparent 360deg)',
          animation: 'slow-spin 40s linear infinite',
        }}
      />

      {/* 2D particle overlay for depth (pre-3D) */}
      {phase === 'letter-dissolve' || phase === 'particles-gather' ? (
        <ParticleField count={40} />
      ) : null}

      {/* 3D Scene */}
      {showCake && (
        <Suspense fallback={null}>
          <BirthdayWishes3D phase={threePhase} />
        </Suspense>
      )}

      {/* Letter dissolving effect */}
      <AnimatePresence>
        {phase === 'letter-dissolve' && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            <motion.div
              className="rounded-2xl p-8"
              initial={{ scale: 1, filter: 'blur(0px)' }}
              animate={{ scale: 0.8, filter: 'blur(20px)' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              style={{
                background: 'rgba(13,13,18,0.85)',
                border: '1px solid rgba(233,177,58,0.3)',
                boxShadow: '0 0 40px rgba(233,177,58,0.15)',
              }}
            >
              <p
                className="text-lg italic"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  color: '#e9b13a',
                }}
              >
                With Love, Deepak ❤️
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particles gathering glow */}
      <AnimatePresence>
        {phase === 'particles-gather' && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            <motion.div
              className="rounded-full"
              initial={{ width: 4, height: 4, opacity: 0 }}
              animate={{ width: 120, height: 120, opacity: [0, 0.8, 0.4] }}
              transition={{ duration: 1.5, ease: EASE }}
              style={{
                background:
                  'radial-gradient(circle, rgba(233,177,58,0.5), rgba(233,177,58,0.05) 70%, transparent)',
                boxShadow: '0 0 80px rgba(233,177,58,0.3)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birthday Title (HTML overlay — only before cake appears) */}
      <AnimatePresence>
        {showTitle && !hideHtmlTitle && (
          <motion.div
            className="absolute left-0 right-0 z-20 flex flex-col items-center px-6 text-center"
            style={{ top: '28%' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <motion.h1
              className="text-4xl sm:text-6xl"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                color: '#e9b13a',
                textShadow: '0 0 30px rgba(233,177,58,0.4)',
                letterSpacing: '0.02em',
              }}
              animate={{
                textShadow: [
                  '0 0 30px rgba(233,177,58,0.3)',
                  '0 0 50px rgba(233,177,58,0.5)',
                  '0 0 30px rgba(233,177,58,0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              Happy Birthday Kumkum
            </motion.h1>

            <AnimatePresence>
              {showSubtitle && (
                <motion.p
                  className="mt-4 max-w-md text-base sm:text-lg italic"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    color: '#c4c4cc',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3, ease: EASE }}
                >
                  Today is all about celebrating you and the beautiful moments that make you special.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wish prompt — below the cake with generous spacing */}
      <AnimatePresence>
        {showWishPrompt && (
          <motion.div
            className="absolute left-0 right-0 z-20 flex flex-col items-center px-6 text-center"
            style={{ bottom: '12%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            <motion.p
              className="text-xl sm:text-2xl italic"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                color: '#e9b13a',
                textShadow: '0 0 24px rgba(233,177,58,0.3)',
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              Close your eyes... Make a Wish
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="fixed bottom-20 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 max-w-lg mx-auto">
        <button
          type="button"
          disabled={!manager?.canGoPrev}
          onClick={() => manager?.prev()}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm sm:text-base transition-all"
          style={{
            background: 'transparent',
            color: '#e9b13a',
            border: '1px solid rgba(233,177,58,0.5)',
            opacity: !manager?.canGoPrev ? 0.35 : 1,
            cursor: !manager?.canGoPrev ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowLeft size={18} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          disabled={!manager?.canGoNext}
          onClick={() => manager?.next()}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, #e9b13a, #b87d1c)',
            color: '#1a1208',
            border: '1px solid rgba(233,177,58,0.6)',
            boxShadow: '0 0 24px rgba(233,177,58,0.25)',
            opacity: !manager?.canGoNext ? 0.35 : 1,
            cursor: !manager?.canGoNext ? 'not-allowed' : 'pointer',
          }}
        >
          <span>Next</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
