import { motion, AnimatePresence } from 'framer-motion';

interface GlobalLoaderProps {
  visible: boolean;
}

export function GlobalLoader({ visible }: GlobalLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="h-12 w-12 rounded-full border-2 border-gold-300/20 border-t-gold-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <p className="font-body text-xs tracking-[0.3em] text-gold-300/60 uppercase">Loading</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
