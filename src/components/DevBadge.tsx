import { motion, AnimatePresence } from 'framer-motion';

interface DevBadgeProps {
  visible: boolean;
}

export function DevBadge({ visible }: DevBadgeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-3 left-3 z-40 rounded-full border border-gold-400/20 bg-void-900/80 px-2.5 py-1 backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <span className="font-body text-[9px] tracking-[0.15em] text-gold-300/70 uppercase">Developer Preview</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
