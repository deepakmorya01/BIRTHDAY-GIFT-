import { motion, AnimatePresence } from 'framer-motion';

interface DigitProps {
  value: number;
  label: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CountdownDigit({ value, label }: DigitProps) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-xl border border-gold-400/20 bg-void-800/60 backdrop-blur-xl sm:h-28 sm:w-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 to-transparent" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            className="relative font-display text-3xl font-medium text-gradient-gold sm:text-5xl"
            initial={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-void-950/40" />
      </div>
      <span className="font-body text-[10px] tracking-[0.2em] text-gold-200/60 uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}
