import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { GoldButton } from './GoldButton';

interface LockedScreenProps {
  message: string;
  onBack: () => void;
}

export function LockedScreen({ message, onBack }: LockedScreenProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full glass">
          <Lock size={28} className="text-gold-300/70" />
        </div>
        <p className="max-w-sm font-display text-lg italic text-void-200">{message}</p>
        <GoldButton variant="outline" onClick={onBack} className="px-8 py-3 text-sm">
          Return to Countdown
        </GoldButton>
      </motion.div>
    </div>
  );
}
