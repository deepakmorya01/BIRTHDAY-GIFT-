import { lazy, Suspense, useEffect, useState } from 'react';
import type { ComponentProps } from 'react';

const Ferrofluid = lazy(() => import('./Ferrofluid'));

type FerrofluidProps = ComponentProps<typeof Ferrofluid>;

const BASE_PROPS: Partial<FerrofluidProps> = {
  colors: ['#FFD700', '#FFDF6B', '#FFF8D6'],
  backgroundColor: 'transparent',
  speed: 0.45,
  scale: 1.45,
  turbulence: 0.9,
  fluidity: 0.16,
  rimWidth: 0.22,
  sharpness: 3.0,
  shimmer: 1.0,
  glow: 2.8,
  flowDirection: 'up',
  opacity: 0.55,
  mouseInteraction: false,
  dpr: 1,
};

const MOBILE_PROPS: Partial<FerrofluidProps> = {
  speed: 0.35,
  scale: 1.2,
  turbulence: 0.7,
  shimmer: 0.7,
  glow: 2.2,
  opacity: 0.45,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export function FerrofluidBackground({
  paused = false,
  className,
  ...rest
}: FerrofluidProps & { paused?: boolean }) {
  const isMobile = useIsMobile();
  const props = isMobile ? { ...BASE_PROPS, ...MOBILE_PROPS } : BASE_PROPS;

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Ferrofluid {...props} paused={paused} {...rest} />
      </Suspense>
    </div>
  );
}
