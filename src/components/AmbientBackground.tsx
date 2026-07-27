import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  showParticles?: boolean;
  showPetals?: boolean;
}

export function AmbientBackground({ showParticles = true }: AmbientBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(233,177,58,0.06), transparent 60%)' }}
      />
      {showParticles && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at 70% 80%, rgba(233,177,58,0.04), transparent 50%)' }}
        />
      )}
    </div>
  );
}
