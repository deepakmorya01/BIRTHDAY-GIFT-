import { motion } from 'framer-motion';
import type { SceneDefinition } from '../types';
import type { SceneComponentProps } from '../types';

interface SceneRendererProps {
  scene: SceneDefinition | undefined;
  isActive: boolean;
}

export function SceneRenderer({ scene, isActive }: SceneRendererProps) {
  if (!scene) return null;
  const Component = scene.component as React.ComponentType<SceneComponentProps>;
  return (
    <motion.div
      key={scene.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 min-h-screen w-full"
    >
      <Component isActive={isActive} />
    </motion.div>
  );
}
