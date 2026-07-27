import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { letterContent } from '../../config/letter';
import { useSceneManagerContext } from '../../hooks';

export function LetterScene() {
  const manager = useSceneManagerContext();

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-8"
      style={{
        paddingTop: 'max(2rem, env(safe-area-inset-top))',
        paddingBottom: 'max(7rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a0f 50%, #050508 100%)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(233,177,58,0.08), transparent 60%)',
        }}
      />

      {/* Letter card */}
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl p-6 sm:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background:
            'linear-gradient(145deg, rgba(245,233,198,0.06), rgba(13,13,18,0.92))',
          border: '1px solid rgba(233,177,58,0.3)',
          boxShadow: '0 0 40px rgba(233,177,58,0.1), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Greeting */}
        <h2
          className="text-2xl sm:text-3xl"
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            color: '#e9b13a',
            fontWeight: 600,
          }}
        >
          {letterContent.greeting}
        </h2>

        {/* Birthday line */}
        <p
          className="mt-3 text-lg sm:text-xl italic"
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            color: '#f3d98e',
          }}
        >
          {letterContent.birthdayLine}
        </p>

        {/* Divider */}
        <div
          className="my-5 h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(233,177,58,0.4), transparent)' }}
        />

        {/* Paragraphs */}
        <div className="space-y-4">
          {letterContent.paragraphs.map((text, idx) => (
            <p
              key={idx}
              className="text-base sm:text-lg leading-relaxed"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                color: '#e6e6ea',
                fontStyle: 'italic',
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Sign-off */}
        <div className="mt-8">
          {letterContent.signoff.map((text, sIdx) => (
            <p
              key={sIdx}
              className="text-base sm:text-lg"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                color: sIdx === letterContent.signoff.length - 1 ? '#e9b13a' : '#c4c4cc',
                fontWeight: sIdx === letterContent.signoff.length - 1 ? 600 : 400,
                textShadow:
                  sIdx === letterContent.signoff.length - 1
                    ? '0 0 18px rgba(233,177,58,0.35)'
                    : 'none',
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Previous / Next buttons */}
      <div className="fixed bottom-20 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 max-w-lg mx-auto">
        <button
          type="button"
          disabled={!manager?.canGoPrev}
          onClick={() => manager?.prev()}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm sm:text-base transition-all"
          style={{
            background: 'transparent',
            color: '#e9b13a',
            border: '1px solid rgba(233,177,58,0.5)',
            opacity: !manager?.canGoPrev ? 0.35 : 1,
            cursor: !manager?.canGoPrev ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowLeft size={18} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          disabled={!manager?.canGoNext}
          onClick={() => manager?.next()}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, #e9b13a, #b87d1c)',
            color: '#1a1208',
            border: '1px solid rgba(233,177,58,0.6)',
            boxShadow: '0 0 24px rgba(233,177,58,0.25)',
            opacity: !manager?.canGoNext ? 0.35 : 1,
            cursor: !manager?.canGoNext ? 'not-allowed' : 'pointer',
          }}
        >
          <span>Next</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
