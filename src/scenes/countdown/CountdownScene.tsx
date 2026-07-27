import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext, useCountdown, useDevMode } from '../../hooks';
import { GoldButton } from '../../components';
import { siteConfig } from '../../config/site';
import Lightning from '../../components/effects/Lightning/Lightning';
import { CountdownBackground } from './CountdownBackground';
import { CountdownDigit } from './CountdownDigit';

const EASE = [0.16, 1, 0.3, 1] as const;

export function CountdownScene({ isActive: _isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const managerRef = useRef(manager);
  managerRef.current = manager;

  const devMode = useDevMode();
  const simulated = devMode?.birthdaySimulated ?? false;
  const { days, hours, minutes, seconds, isComplete: realIsComplete } = useCountdown(siteConfig.birthday);
  const isComplete = realIsComplete || simulated;

  const [unlocked, setUnlocked] = useState(isComplete);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (isComplete) setUnlocked(true);
  }, [isComplete]);

  const handleContinue = useCallback(() => {
    if (navigating) return;
    setNavigating(true);
    setTimeout(() => managerRef.current?.next(), 700);
  }, [navigating]);

  // Auto-continue ONLY when the real countdown reaches zero.
  // No timer-based shortcuts, no preview auto-advance, no dev-only progression.
  useEffect(() => {
    if (!realIsComplete || navigating) return;
    const t = setTimeout(() => handleContinue(), 1800);
    return () => clearTimeout(t);
  }, [realIsComplete, navigating, handleContinue]);

  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <CountdownBackground />

      {/* React Bits Lightning — animated background layer */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <Lightning hue={40} xOffset={0.8} speed={0.7} intensity={1.9} size={1.9} />
      </div>

      {/* Existing overlay for readability */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-void-950/30" />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="countdown"
            className="relative z-10 flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="text-gold-300/70" size={24} />
              <p className="font-body text-xs sm:text-sm tracking-[0.3em] text-gold-300/70 uppercase">The Countdown</p>
            </div>
            <h2 className="font-display text-display-md sm:text-display-lg text-gradient-gold">
              Something beautiful is on its way
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {units.map((u) => (
                <CountdownDigit key={u.label} value={u.value} label={u.label} />
              ))}
            </div>
            <p className="font-display text-base sm:text-lg italic text-void-200">
              Every second brings us closer to the celebration.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            className="relative z-10 flex flex-col items-center gap-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: navigating ? 0 : 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Sparkles className="text-gold-300" size={40} />
            </motion.div>
            <h2 className="font-display text-display-md sm:text-display-lg text-gradient-gold">The moment is here!</h2>
            <p className="font-display text-lg sm:text-xl italic text-void-200 max-w-md">
              The wait is over. Your special journey begins now.
            </p>
            <GoldButton variant="solid" onClick={handleContinue} className="px-10 py-4 text-base sm:text-lg">
              Continue Journey
              <ArrowRight size={20} />
            </GoldButton>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {navigating && (
          <motion.div
            className="absolute inset-0 z-50 bg-void-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
