import { useCallback, useMemo } from 'react';
import type { SceneId } from '../types';
import { sceneFlow } from '../config/scenes';

export interface RouteProtection {
  isLocked: (sceneId: SceneId) => boolean;
  lockedScenes: SceneId[];
}

export function useRouteProtection(isUnlocked: boolean): RouteProtection {
  const lockedScenes = useMemo<SceneId[]>(
    () =>
      isUnlocked
        ? []
        : sceneFlow.filter(
            (id) => id !== 'loading' && id !== 'welcome' && id !== 'gift' && id !== 'teaser-gallery' && id !== 'countdown',
          ),
    [isUnlocked],
  );

  const isLocked = useCallback(
    (sceneId: SceneId): boolean => {
      if (isUnlocked) return false;
      return lockedScenes.includes(sceneId);
    },
    [isUnlocked, lockedScenes],
  );

  return { isLocked, lockedScenes };
}
