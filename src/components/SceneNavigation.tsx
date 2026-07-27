import { motion, AnimatePresence } from 'framer-motion';
import type { SceneManager } from '../hooks/useSceneManager';
import { sceneFlow, sceneLabels } from '../config/scenes';
import type { SceneDefinition } from '../types';

interface SceneNavigationProps {
  manager: SceneManager;
  registry: Record<string, SceneDefinition>;
}

export function SceneNavigation({ manager }: SceneNavigationProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
      <div className="flex items-center gap-1.5 rounded-full glass px-3 py-2">
        {sceneFlow.map((id, i) => (
          <button
            key={id}
            onClick={() => manager.goTo(id)}
            aria-label={sceneLabels[id]}
            className="group relative flex h-2 items-center"
          >
            <motion.span
              className="block rounded-full transition-all duration-500 ease-cinematic"
              animate={{
                width: i === manager.index ? 24 : 8,
                backgroundColor: i === manager.index ? '#e9b13a' : '#4a4a55',
              }}
            />
          </button>
        ))}
      </div>
      <AnimatePresence>
        <motion.p
          key={manager.current}
          className="mt-2 text-center font-body text-[10px] tracking-[0.2em] text-void-300 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sceneLabels[manager.current]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
