import { motion, AnimatePresence } from 'framer-motion';

export type ShipReaction = 'correct' | 'wrong';

interface ShipReactionOverlayProps {
  reaction: ShipReaction | null;
  onComplete?: () => void;
}

const REACTION_DURATION_MS = 1200;

export function ShipReactionOverlay({ reaction, onComplete }: ShipReactionOverlayProps) {
  return (
    <AnimatePresence>
      {reaction && (
        <motion.div
          key={reaction}
          className="absolute inset-0 z-20 pointer-events-none"
          initial={false}
          exit={{ opacity: 0 }}
        >
          {/* Correct: green stabilization sweep / pulse from center */}
          {reaction === 'correct' && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: REACTION_DURATION_MS / 1000,
                times: [0, 0.4, 1],
              }}
              onAnimationComplete={onComplete}
              style={{
                background: `radial-gradient(circle at 50% 50%, hsl(var(--status-nominal) / 0.5) 0%, hsl(var(--status-nominal) / 0.2) 40%, transparent 70%)`,
              }}
            />
          )}

          {/* Wrong: red alert pulse / vignette */}
          {reaction === 'wrong' && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: REACTION_DURATION_MS / 1000,
                times: [0, 0.3, 1],
              }}
              onAnimationComplete={onComplete}
              style={{
                background: `radial-gradient(ellipse at 50% 50%, hsl(var(--status-critical) / 0.3) 0%, hsl(var(--status-critical) / 0.15) 50%, transparent 70%)`,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
