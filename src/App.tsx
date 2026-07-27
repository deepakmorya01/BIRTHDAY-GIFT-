import { AnimatePresence } from 'framer-motion';
import {
  useSceneManager,
  SceneManagerContext,
  useDevModeProvider,
  DevModeReactContext,
  useBackgroundMusic,
} from './hooks';
import { sceneRegistry } from './scenes/registry';
import { SceneRenderer, SceneNavigation, AudioToggle, DevBadge, DevModeDialog, FerrofluidBackground } from './components';
import type { SceneId } from './types';

export default function App() {
  const manager = useSceneManager('loading');
  const devMode = useDevModeProvider();
  const { muted, toggleMute } = useBackgroundMusic();

  const scene = sceneRegistry[manager.current];

  const ferrofluidScenes: SceneId[] = ['loading', 'welcome', 'gift', 'teaser-gallery'];
  const isFerrofluidActive = ferrofluidScenes.includes(manager.current);

  return (
    <DevModeReactContext.Provider value={devMode}>
      <SceneManagerContext.Provider value={manager}>
        <div className="relative min-h-screen w-full overflow-hidden bg-void-950" onClick={devMode.registerTap}>
          {isFerrofluidActive && <FerrofluidBackground />}
          <AnimatePresence mode="wait">
            <SceneRenderer key={manager.current} scene={scene} isActive={true} />
          </AnimatePresence>

          <SceneNavigation manager={manager} registry={sceneRegistry} />
          <AudioToggle muted={muted} onToggle={toggleMute} />
          <DevBadge visible={devMode.active} />
          {devMode.active && <DevModeDialog devMode={devMode} />}
        </div>
      </SceneManagerContext.Provider>
    </DevModeReactContext.Provider>
  );
}
