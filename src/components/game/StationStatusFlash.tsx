import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type StationReaction = 'correct' | 'wrong';

interface StationStatusFlashProps {
  reaction: StationReaction | null;
  className?: string;
}

/** Minimal station graphic that flashes green (nominal) or red (critical) when a choice is made. */
export function StationStatusFlash({ reaction, className }: StationStatusFlashProps) {
  return (
    <div className={cn('flex items-center justify-center', className)} aria-hidden>
      <motion.div
        className="relative w-10 h-10 flex items-center justify-center"
        animate={
          reaction
            ? {
                scale: [1, 1.2, 1.05],
                transition: { duration: 0.45 },
              }
            : { scale: 1 }
        }
      >
        {/* Station icon: central hub + small panels */}
        <svg
          viewBox="0 0 32 32"
          className={cn(
            'w-8 h-8 transition-colors duration-300',
            reaction === 'correct' && 'text-status-nominal',
            reaction === 'wrong' && 'text-status-critical',
            !reaction && 'text-primary/60'
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="16" cy="16" r="6" fill="currentColor" fillOpacity={reaction ? 0.25 : 0.1} stroke="currentColor" />
          <circle cx="16" cy="16" r="3" fill="currentColor" fillOpacity={reaction ? 0.8 : 0.3} />
          <line x1="16" y1="10" x2="16" y2="6" />
          <line x1="16" y1="22" x2="16" y2="26" />
          <line x1="10" y1="16" x2="6" y2="16" />
          <line x1="22" y1="16" x2="26" y2="16" />
        </svg>
        {/* Glow ring when reacting */}
        <AnimatePresence>
          {reaction && (
            <motion.span
              key={reaction}
              className={cn(
                'absolute inset-0 rounded-full pointer-events-none',
                reaction === 'correct' && 'bg-status-nominal/40',
                reaction === 'wrong' && 'bg-status-critical/40'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.5, 1.3] }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              style={{ filter: 'blur(8px)' }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
