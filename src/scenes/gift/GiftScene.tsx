import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { ParticleField, GoldButton } from '../../components';

const EASE = [0.16, 1, 0.3, 1] as const;

export function GiftScene({ isActive: _isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const [opened, setOpened] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const managerRef = useRef(manager);
  managerRef.current = manager;

  const handleOpen = useCallback(() => {
    if (opened) return;
    setOpened(true);
  }, [opened]);

  const handleContinue = useCallback(() => {
    if (navigating) return;
    setNavigating(true);
    setTimeout(() => managerRef.current?.next(), 700);
  }, [navigating]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/70 via-void-900/70 to-void-950/70" />
      <ParticleField count={25} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.p
          className="font-body text-xs sm:text-sm tracking-[0.3em] text-gold-300/70 uppercase"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          A Gift For You
        </motion.p>

        <motion.button
          onClick={handleOpen}
          disabled={opened}
          className="relative flex h-32 w-32 items-center justify-center rounded-full glass-panel"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: opened ? 1.1 : 1,
            opacity: 1,
            boxShadow: opened
              ? '0 0 60px rgba(233,177,58,0.4)'
              : '0 0 30px rgba(233,177,58,0.15)',
          }}
          whileHover={{ scale: opened ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Gift size={48} className="text-gold-300" />
        </motion.button>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.p
              key="hint"
              className="font-display text-lg italic text-void-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              Tap to open your gift
            </motion.p>
          ) : (
            <motion.div
              key="message"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <p className="max-w-md font-display text-lg sm:text-xl italic text-gradient-gold">
                Before the celebration begins, a few glimpses await...
              </p>
              <GoldButton variant="solid" onClick={handleContinue} className="px-10 py-4 text-base">
                Continue Journey
                <ArrowRight size={20} />
              </GoldButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
