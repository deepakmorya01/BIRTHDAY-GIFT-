import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { lazy, Suspense } from 'react';
import type { SceneComponentProps } from '../../types';
import { useSceneManagerContext } from '../../hooks';
import { GoldButton } from '../../components';
import { getTeaserImages } from '../../config/images';
import { TeaserBackground } from './TeaserBackground';

const DomeGallery = lazy(() => import('../../components/DomeGallery/DomeGallery'));

const EASE = [0.16, 1, 0.3, 1] as const;

export function TeaserGalleryScene({ isActive }: SceneComponentProps) {
  const manager = useSceneManagerContext();
  const managerRef = useRef(manager);
  managerRef.current = manager;

  const teaserImages = useMemo(() => getTeaserImages(), []);
  const domeImages = useMemo(
    () => teaserImages.map((img) => ({ src: img.src, alt: img.alt })),
    [teaserImages],
  );

  const [showButton, setShowButton] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const buttonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) {
      setShowButton(false);
      setNavigating(false);
      if (buttonTimerRef.current) clearTimeout(buttonTimerRef.current);
    } else {
      if (buttonTimerRef.current) clearTimeout(buttonTimerRef.current);
      buttonTimerRef.current = setTimeout(() => setShowButton(true), 3000);
    }
  }, [isActive]);

  const handleContinue = useCallback(() => {
    if (navigating) return;
    setNavigating(true);
    setTimeout(() => managerRef.current?.next(), 1000);
  }, [navigating]);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden px-4"
      style={{ paddingTop: 'max(4rem, env(safe-area-inset-top))', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      <TeaserBackground />

      <motion.div
        className="relative z-10 mt-4 mb-4 text-center sm:mt-8"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: navigating ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p className="font-body text-xs sm:text-sm tracking-[0.3em] text-gold-300/80 uppercase">A Glimpse Ahead</p>
        <h2 className="font-display text-display-md text-gradient-gold mt-2">Teaser Gallery</h2>
      </motion.div>

      <div
        className="relative z-10 flex w-full flex-1 items-center justify-center"
        style={{ minHeight: 'clamp(400px, 65vh, 700px)' }}
      >
        {teaserImages.length > 0 ? (
          <Suspense fallback={null}>
            <DomeGallery
              images={domeImages}
              fit={0.8}
              fitBasis="auto"
              minRadius={600}
              segments={34}
              dragDampening={2}
              maxVerticalRotationDeg={0}
              grayscale={false}
              overlayBlurColor="#120F17"
            />
          </Suspense>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: navigating ? 0 : 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="h-12 w-12 rounded-full border-2 border-gold-300/20 border-t-gold-300/60 animate-spin" />
            <p className="font-body text-sm text-void-300">Teaser photos coming soon</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            className="relative z-20 flex flex-col items-center gap-4 px-4 pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: navigating ? 0 : 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <GoldButton variant="solid" onClick={handleContinue} className="px-10 py-4 text-base sm:text-lg">
                Continue Journey
                <ArrowRight size={20} />
              </GoldButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {navigating && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-void-950" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(233,177,58,0.06), transparent 60%)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
