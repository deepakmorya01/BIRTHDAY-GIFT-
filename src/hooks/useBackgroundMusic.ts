import { useEffect, useRef, useState, useCallback } from 'react';
import { musicConfig, musicSrc } from '../config/music';

const rampTo = (
  audio: HTMLAudioElement,
  target: number,
  durationMs: number,
) =>
  new Promise<void>((resolve) => {
    const start = audio.volume;
    const delta = target - start;
    if (Math.abs(delta) < 0.001 || durationMs <= 0) {
      audio.volume = target;
      resolve();
      return;
    }
    const steps = Math.max(1, Math.floor(durationMs / 16));
    let i = 0;
    const tick = () => {
      i += 1;
      audio.volume = Math.max(0, Math.min(1, start + delta * (i / steps)));
      if (i < steps) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(musicSrc);
    audio.loop = musicConfig.loop;
    audio.volume = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    const startOnInteraction = () => {
      if (started) return;
      setStarted(true);
      void (async () => {
        try {
          await audio.play();
          await rampTo(audio, musicConfig.volume, musicConfig.fadeInMs);
        } catch {
          setStarted(false);
        }
      })();
    };

    const events: (keyof WindowEventMap)[] = ['click', 'keydown', 'touchstart'];
    events.forEach((e) =>
      window.addEventListener(e, startOnInteraction, { once: true }),
    );

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, startOnInteraction),
      );
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [started]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio) {
        if (next) void rampTo(audio, 0, musicConfig.fadeOutMs);
        else void rampTo(audio, musicConfig.volume, musicConfig.fadeInMs);
      }
      return next;
    });
  }, []);

  return { muted, toggleMute };
}
