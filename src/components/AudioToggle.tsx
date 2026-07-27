import { useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useDevMode } from '../hooks';

interface AudioToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export function AudioToggle({ muted, onToggle }: AudioToggleProps) {
  const devMode = useDevMode();

  const handleClick = useCallback(() => {
    onToggle();
    devMode?.registerTap();
  }, [onToggle, devMode]);

  return (
    <button
      onClick={handleClick}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full glass text-void-100 transition-all hover:scale-110 hover:text-gold-200"
      style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
