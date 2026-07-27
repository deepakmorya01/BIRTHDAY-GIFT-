import { motion, AnimatePresence } from 'framer-motion';
import { Cake, XCircle, RotateCcw } from 'lucide-react';
import type { DevModeContext } from '../hooks/useDevMode';
import { GlassPanel, GoldButton } from './';

interface DevModeDialogProps {
  devMode: DevModeContext;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function DevModeDialog({ devMode }: DevModeDialogProps) {
  const { active, birthdaySimulated, enableBirthdaySim, disableBirthdaySim, deactivate } = devMode;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ background: 'rgba(2,2,5,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={deactivate}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <GlassPanel
              variant="gold"
              className="w-full max-w-xs p-6"
              style={{ boxShadow: '0 0 40px rgba(233,177,58,0.15), 0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="mb-5 text-center">
                <p className="font-body text-[10px] tracking-[0.3em] text-gold-300/60 uppercase">Developer Mode</p>
                <h3 className="mt-1 font-display text-xl text-gradient-gold">Testing Controls</h3>
              </div>
              <div className="flex flex-col gap-3">
                <GoldButton
                  variant={birthdaySimulated ? 'solid' : 'outline'}
                  onClick={enableBirthdaySim}
                  className="w-full justify-center text-sm"
                  disabled={birthdaySimulated}
                >
                  <Cake size={16} />
                  {birthdaySimulated ? 'Simulation Active' : 'Enable Birthday Simulation'}
                </GoldButton>
                <GoldButton
                  variant="outline"
                  onClick={disableBirthdaySim}
                  className="w-full justify-center text-sm"
                  disabled={!birthdaySimulated}
                >
                  <XCircle size={16} />
                  Disable Birthday Simulation
                </GoldButton>
                <div className="my-1 h-px bg-gold-400/10" />
                <GoldButton variant="ghost" onClick={deactivate} className="w-full justify-center text-sm">
                  <RotateCcw size={16} />
                  Return to Normal Mode
                </GoldButton>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
