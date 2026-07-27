import { useState, useCallback, useMemo } from 'react';
import type { SceneId } from '../types';
import { sceneFlow } from '../config/scenes';

export interface SceneManager {
  current: SceneId;
  index: number;
  next: () => void;
  prev: () => void;
  goTo: (id: SceneId) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function useSceneManager(initial: SceneId = 'countdown'): SceneManager {
  const [index, setIndex] = useState(() => sceneFlow.indexOf(initial));

  const goTo = useCallback((id: SceneId) => {
    setIndex(Math.max(0, sceneFlow.indexOf(id)));
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => Math.min(sceneFlow.length - 1, prev + 1));
  }, []);

  const prev = useCallback(() => {
    setIndex((p) => Math.max(0, p - 1));
  }, []);

  return useMemo<SceneManager>(() => ({
    current: sceneFlow[index] ?? sceneFlow[0],
    index,
    next,
    prev,
    goTo,
    canGoNext: index < sceneFlow.length - 1,
    canGoPrev: index > 0,
  }), [index, next, prev, goTo]);
}
