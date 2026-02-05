import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type QAShipReaction = 'correct' | 'wrong';

interface QAShipProps {
  /** Current reaction from user's answer: null = awaiting choice or idle. */
  reaction: QAShipReaction | null;
  /** Whether user has picked an answer for this incident (ship shows "result" state). */
  hasSelectedChoice: boolean;
  /** After reaction clears, use this so ship stays nominal/critical until next incident. */
  selectedWasCorrect?: boolean | null;
  className?: string;
}

/**
 * Space ship / station graphic in the Q&A area. Changes appearance based on user input:
 * - Idle (no choice yet): amber/warning, subtle pulse
 * - Correct: green/nominal, stabilized
 * - Wrong: red/critical, stressed
 */
export function QAShip({ reaction, hasSelectedChoice, selectedWasCorrect, className }: QAShipProps) {
  const gradientId = useId().replace(/:/g, '-');
  const isIdle = !hasSelectedChoice && !reaction;
  const isCorrect = reaction === 'correct' || (hasSelectedChoice && selectedWasCorrect === true && !reaction);
  const isWrong = reaction === 'wrong' || (hasSelectedChoice && selectedWasCorrect === false && !reaction);

  const strokeClass = cn(
    'transition-colors duration-300',
    isCorrect && 'text-status-nominal',
    isWrong && 'text-status-critical',
    isIdle && 'text-status-warning'
  );

  const fillClass = cn(
    'transition-colors duration-300',
    isCorrect && 'text-status-nominal/20',
    isWrong && 'text-status-critical/20',
    isIdle && 'text-status-warning/15'
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-start gap-2 shrink-0',
        className
      )}
      aria-hidden
    >
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
        Station
      </span>
      <motion.div
        className="relative w-full max-w-[100px] aspect-square flex items-center justify-center"
        animate={
          isWrong
            ? { x: [0, -2, 2, -1, 0], transition: { duration: 0.35 } }
            : isCorrect
              ? { scale: [1, 1.05, 1.02], transition: { duration: 0.4 } }
              : isIdle
                ? { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
                : {}
        }
      >
        <svg
          viewBox="0 0 80 64"
          className="w-full h-full drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0.08} />
            </linearGradient>
            <filter id="qa-ship-glow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Main hull / body */}
          <ellipse cx="40" cy="36" rx="22" ry="14" className={fillClass} stroke="currentColor" fill={`url(#${gradientId})`} />
          <ellipse cx="40" cy="36" rx="20" ry="12" className={strokeClass} fill="none" />
          {/* Nose */}
          <path d="M 18 36 Q 8 36 12 28 L 14 24 L 16 28 Z" className={fillClass} stroke="currentColor" />
          <path d="M 62 36 Q 72 36 68 28 L 66 24 L 64 28 Z" className={fillClass} stroke="currentColor" />
          {/* Solar panels left */}
          <rect x="4" y="28" width="14" height="4" rx="1" className={strokeClass} fill="currentColor" fillOpacity={0.2} />
          <line x1="8" y1="28" x2="8" y2="32" className={strokeClass} />
          <line x1="14" y1="28" x2="14" y2="32" className={strokeClass} />
          {/* Solar panels right */}
          <rect x="62" y="28" width="14" height="4" rx="1" className={strokeClass} fill="currentColor" fillOpacity={0.2} />
          <line x1="66" y1="28" x2="66" y2="32" className={strokeClass} />
          <line x1="72" y1="28" x2="72" y2="32" className={strokeClass} />
          {/* Cockpit / dome */}
          <ellipse cx="40" cy="30" rx="6" ry="4" className={strokeClass} fill="currentColor" fillOpacity={0.15} />
          {/* Engine glow - stronger when correct, warning when wrong */}
          <ellipse
            cx="40"
            cy="50"
            rx="8"
            ry="3"
            className={cn(
              'transition-opacity duration-300',
              isCorrect && 'fill-status-nominal/40',
              isWrong && 'fill-status-critical/50 animate-pulse',
              isIdle && 'fill-primary/20'
            )}
          />
        </svg>
        {/* Status label */}
        <motion.span
          key={reaction ?? 'idle'}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-[10px] font-mono uppercase tracking-wider',
            isCorrect && 'text-status-nominal',
            isWrong && 'text-status-critical',
            isIdle && 'text-status-warning/80'
          )}
        >
          {isCorrect ? 'Nominal' : isWrong ? 'Critical' : 'Alert'}
        </motion.span>
      </motion.div>
    </div>
  );
}
