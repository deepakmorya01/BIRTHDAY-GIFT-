import { useEffect, useState, useCallback } from 'react';
import type { ImageId, ImageAsset } from '../types';
import { imageManifest } from '../config/images';

export function getImage(id: ImageId): ImageAsset {
  return imageManifest[id];
}

export function getImageSrc(id: ImageId): string {
  return imageManifest[id].src;
}

export function preloadImages(ids: ImageId[]): Promise<void> {
  return Promise.all(
    ids.map(
      (id) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = imageManifest[id].src;
        }),
    ),
  ).then(() => undefined);
}

export function useImagePreload(ids: ImageId[]) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const total = ids.length;
    if (total === 0) {
      setReady(true);
      setProgress(1);
      return;
    }

    ids.forEach((id) => {
      const img = new Image();
      const onDone = () => {
        if (cancelled) return;
        done += 1;
        setProgress(done / total);
        if (done >= total) setReady(true);
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = imageManifest[id].src;
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return { progress, ready };
}

export function useImage(id: ImageId) {
  const asset = getImage(id);
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);
  return { asset, loaded, onLoad };
}
