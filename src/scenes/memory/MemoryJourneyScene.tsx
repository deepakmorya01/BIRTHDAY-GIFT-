import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { ParticleField } from '../../components';
import { getMemoryImages } from '../../config/images';
import Waves from '../../components/effects/Waves/Waves';

const EASE = [0.16, 1, 0.3, 1] as const;
const TRANSITION_DURATION = 0.6;
const FINAL_DELAY = 2000;

export function MemoryJourneyScene({ isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const managerRef = useRef(manager);
  managerRef.current = manager;

  const images = useMemo(() => getMemoryImages(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setCurrentIndex(0);
      setDirection(0);
      setShowFinal(false);
      setNavigating(false);
    }
  }, [isActive]);

  const paginate = useCallback(
    (dir: number) => {
      if (showFinal || navigating) return;
      setDirection(dir);
      setCurrentIndex((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= images.length) return prev;
        return next;
      });
    },
    [images.length, showFinal, navigating],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (showFinal || navigating) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, showFinal, navigating],
  );

  useEffect(() => {
    if (currentIndex !== images.length - 1 || showFinal || navigating) return;
    const t = setTimeout(() => setShowFinal(true), FINAL_DELAY);
    return () => clearTimeout(t);
  }, [currentIndex, images.length, showFinal, navigating]);

  useEffect(() => {
    if (!showFinal || navigating) return;
    const t = setTimeout(() => {
      setNavigating(true);
      setTimeout(() => managerRef.current?.next(), 1000);
    }, FINAL_DELAY);
    return () => clearTimeout(t);
  }, [showFinal, navigating]);

  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      else if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, paginate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(delta) > 50) paginate(delta > 0 ? -1 : 1);
      touchStartX.current = null;
    },
    [paginate],
  );

  const current = images[currentIndex];
  const hasImages = images.length > 0;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 1.04 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, scale: 1.04 }),
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-8 vignette"
      style={{
        paddingTop: 'max(4rem, env(safe-area-inset-top))',
        paddingBottom: 'max(5rem, env(safe-area-inset-bottom))',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(233,177,58,0.05), transparent 60%)' }} />

      {/* React Bits Waves — animated background layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Waves
          lineColor="rgba(255,255,255,0.08)"
          backgroundColor="transparent"
          waveSpeedX={0.008}
          waveSpeedY={0.004}
          waveAmpX={18}
          waveAmpY={10}
          friction={0.93}
          tension={0.008}
          maxCursorMove={60}
          xGap={20}
          yGap={42}
        />
      </div>

      {/* Soft overlay for readability */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/35" />

      <ParticleField count={35} />

      <motion.div
        className="relative z-20 mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: navigating ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p className="font-body text-xs sm:text-sm tracking-[0.3em] text-gold-300/70 uppercase">Memory Journey</p>
      </motion.div>

      {hasImages ? (
      <div className="relative z-20 flex w-full max-w-3xl flex-1 flex-col items-center justify-center">
        <div className="relative w-full" style={{ minHeight: 'clamp(360px, 55vh, 560px)' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: TRANSITION_DURATION, ease: EASE }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <div
                className="relative flex items-center justify-center overflow-hidden rounded-2xl"
                style={{
                  boxShadow: '0 0 40px rgba(233,177,58,0.2), 0 16px 50px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(233,177,58,0.25)',
                }}
              >
                <motion.img
                  src={current.src}
                  alt={current.alt}
                  className="h-auto w-auto max-w-full object-contain max-h-[65vh] sm:max-h-[70vh]"
                  style={{ display: 'block' }}
                  draggable={false}
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <motion.p
                className="mt-6 max-w-lg px-4 text-center font-display text-lg sm:text-2xl italic text-void-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              >
                {current.caption}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {!showFinal && (
          <div className="mt-6 flex items-center gap-6">
            <button
              onClick={() => paginate(-1)}
              disabled={currentIndex === 0}
              aria-label="Previous memory"
              className="flex h-10 w-10 items-center justify-center rounded-full glass text-void-100 transition-all hover:scale-110 hover:text-gold-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1.5">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => goToSlide(i)} aria-label={`Go to memory ${i + 1}`} className="group relative">
                  <span className={`block rounded-full transition-all duration-500 ease-cinematic ${i === currentIndex ? 'h-2 w-6 bg-gold-300' : 'h-2 w-2 bg-void-500 group-hover:bg-void-300'}`} />
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(1)}
              disabled={currentIndex === images.length - 1}
              aria-label="Next memory"
              className="flex h-10 w-10 items-center justify-center rounded-full glass text-void-100 transition-all hover:scale-110 hover:text-gold-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      ) : (
        <motion.div
          className="relative z-20 flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: navigating ? 0 : 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="h-12 w-12 rounded-full border-2 border-gold-300/20 border-t-gold-300/60 animate-spin" />
          <p className="font-body text-sm text-void-300">Memory photos coming soon</p>
        </motion.div>
      )}

      <AnimatePresence>
        {showFinal && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: navigating ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="absolute inset-0 bg-void-950/80 backdrop-blur-sm" />
            <motion.div
              className="relative z-20 text-center px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <h2 className="font-display text-display-md sm:text-display-lg italic text-gradient-gold">
                Our journey doesn't end here...
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {navigating && (
          <motion.div
            className="absolute inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-void-950" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(233,177,58,0.06), transparent 60%)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
