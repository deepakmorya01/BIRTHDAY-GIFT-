import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { ParticleField } from '../../components';

const EASE = [0.16, 1, 0.3, 1] as const;

export function LoadingScene({ isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const managerRef = useRef(manager);
  managerRef.current = manager;

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => managerRef.current?.next(), 2500);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/70 via-void-900/70 to-void-950/70" />
      <ParticleField count={20} />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <motion.div
          className="h-14 w-14 rounded-full border-2 border-gold-300/20 border-t-gold-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className="font-display text-lg italic text-gradient-gold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
        >
          Preparing something special...
        </motion.p>
      </motion.div>
    </div>
  );
}
