import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { ParticleField, GoldButton } from '../../components';

const EASE = [0.16, 1, 0.3, 1] as const;

export function WelcomeScene({ isActive: _isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/70 via-void-900/70 to-void-950/70" />
      <ParticleField count={30} />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        >
          <Sparkles className="text-gold-300/80" size={32} />
        </motion.div>

        <p className="font-body text-xs sm:text-sm tracking-[0.3em] text-gold-300/70 uppercase">
          Welcome
        </p>

        <h1 className="font-display text-display-lg sm:text-display-xl text-gradient-gold max-w-2xl">
          A Surprise Awaits You
        </h1>

        <motion.p
          className="max-w-md font-display text-lg sm:text-xl italic text-void-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
        >
          Someone has prepared something truly special for you.
          Take a moment. Breathe it in. Let the journey begin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE }}
          className="mt-4"
        >
          <GoldButton variant="solid" onClick={() => manager?.next()} className="px-10 py-4 text-base sm:text-lg">
            Begin the Journey
            <ArrowRight size={20} />
          </GoldButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
