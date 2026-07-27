import { motion } from 'framer-motion';

export type GiftBoxPhase = 'idle' | 'shaking' | 'untying' | 'opening' | 'open';

interface GiftBoxProps {
  phase: GiftBoxPhase;
  onTap: () => void;
}

export function GiftBox({ phase, onTap }: GiftBoxProps) {
  const isOpen = phase === 'opening' || phase === 'open';

  return (
    <div className="relative flex flex-col items-center" style={{ perspective: '800px' }}>
      <motion.div
        className="absolute bottom-2 h-24 w-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(239,196,87,0.25), transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{ opacity: phase === 'open' ? [0.6, 1, 0.6] : 0.6 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-20"
        animate={
          phase === 'shaking'
            ? { rotate: [0, -4, 4, -3, 3, 0], x: [0, -3, 3, -2, 2, 0] }
            : isOpen
              ? { y: -70, rotateX: -45, opacity: 0.9 }
              : { rotate: 0, x: 0, y: 0 }
        }
        transition={
          phase === 'shaking'
            ? { duration: 0.6, ease: 'easeInOut' }
            : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
        style={{ transformOrigin: 'center bottom', marginBottom: '-6px' }}
      >
        <BoxLid />
      </motion.div>

      <motion.div
        className="relative z-10 cursor-pointer"
        onClick={onTap}
        animate={phase === 'shaking' ? { rotate: [0, 2, -2, 1, -1, 0] } : { rotate: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        whileHover={phase === 'idle' ? { scale: 1.04 } : undefined}
        whileTap={phase === 'idle' ? { scale: 0.97 } : undefined}
      >
        <BoxBase />

        <motion.div
          className="absolute inset-0 flex items-start justify-center overflow-hidden rounded-b-lg"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="mt-2 h-20 w-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,230,150,0.9), rgba(239,196,87,0.3) 60%, transparent 80%)',
              filter: 'blur(8px)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function BoxLid() {
  return (
    <div className="relative">
      <svg width="160" height="54" viewBox="0 0 160 54" fill="none">
        <defs>
          <linearGradient id="lidBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b1a2e" />
            <stop offset="50%" stopColor="#6b0f20" />
            <stop offset="100%" stopColor="#4a0a17" />
          </linearGradient>
          <linearGradient id="lidShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="ribbonGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5d98e" />
            <stop offset="50%" stopColor="#e9b13a" />
            <stop offset="100%" stopColor="#b8761f" />
          </linearGradient>
        </defs>
        <rect x="4" y="10" width="152" height="40" rx="4" fill="url(#lidBody)" />
        <rect x="4" y="10" width="152" height="40" rx="4" fill="url(#lidShine)" />
        <rect x="4" y="10" width="152" height="3" rx="2" fill="rgba(255,200,150,0.2)" />
        <rect x="70" y="10" width="20" height="40" fill="url(#ribbonGold)" />
        <rect x="72" y="10" width="3" height="40" fill="rgba(255,240,200,0.4)" />
        <ellipse cx="80" cy="8" rx="14" ry="9" fill="url(#ribbonGold)" />
        <ellipse cx="80" cy="8" rx="14" ry="3" fill="rgba(180,100,30,0.3)" />
        <path d="M66 8 Q50 0 56 14 Q62 18 66 8 Z" fill="url(#ribbonGold)" />
        <path d="M94 8 Q110 0 104 14 Q98 18 94 8 Z" fill="url(#ribbonGold)" />
        <ellipse cx="80" cy="6" rx="10" ry="2" fill="rgba(255,240,200,0.35)" />
      </svg>
    </div>
  );
}

function BoxBase() {
  return (
    <div className="relative">
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
        <defs>
          <linearGradient id="baseBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a1424" />
            <stop offset="50%" stopColor="#5a0d1a" />
            <stop offset="100%" stopColor="#3d0812" />
          </linearGradient>
          <linearGradient id="baseShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="ribbonGoldBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5d98e" />
            <stop offset="50%" stopColor="#e9b13a" />
            <stop offset="100%" stopColor="#b8761f" />
          </linearGradient>
        </defs>
        <rect x="8" y="0" width="144" height="125" rx="5" fill="url(#baseBody)" />
        <rect x="8" y="0" width="144" height="125" rx="5" fill="url(#baseShine)" />
        <rect x="8" y="0" width="144" height="3" rx="2" fill="rgba(255,200,150,0.15)" />
        <rect x="70" y="0" width="20" height="125" fill="url(#ribbonGoldBase)" />
        <rect x="72" y="0" width="3" height="125" fill="rgba(255,240,200,0.35)" />
        <rect x="8" y="0" width="4" height="125" fill="rgba(0,0,0,0.2)" />
        <rect x="148" y="0" width="4" height="125" fill="rgba(0,0,0,0.2)" />
      </svg>
    </div>
  );
}
