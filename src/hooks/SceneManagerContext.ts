import { createContext, useContext } from 'react';
import type { SceneManager } from './useSceneManager';

export const SceneManagerContext = createContext<SceneManager | null>(null);

export function useSceneManagerContext(): SceneManager | null {
  return useContext(SceneManagerContext);
}
