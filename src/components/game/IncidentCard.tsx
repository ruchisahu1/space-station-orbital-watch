import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Choice {
  text: string;
  isCorrect: boolean;
  consequence: string;
}

interface IncidentCardProps {
  title: string;
  alert: string;
  lesson: string;
  choices: Choice[];
  onChoiceSelect: (choice: Choice, index: number) => void;
  selectedChoice: number | null;
  className?: string;
  /** Tighter spacing to fit viewport without scroll (e.g. Level2 desktop). */
  compact?: boolean;
}

export function IncidentCard({
  title,
  alert,
  lesson,
  choices,
  onChoiceSelect,
  selectedChoice,
  className,
  compact,
}: IncidentCardProps) {
  return (
    <motion.div
      className={cn('panel-glow rounded-lg', compact ? 'p-4' : 'p-6', className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn('flex items-center gap-3', compact ? 'mb-3' : 'mb-4')}>
        <div className={cn('rounded-lg bg-status-warning/20 flex items-center justify-center', compact ? 'w-8 h-8' : 'w-10 h-10')}>
          <AlertTriangle className={cn('text-status-warning', compact ? 'w-5 h-5' : 'w-6 h-6')} />
        </div>
        <div>
          <h3 className={cn('font-semibold text-status-warning text-glow-amber', compact ? 'text-base' : 'text-lg')}>{title}</h3>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Incident Alert</span>
        </div>
      </div>

      <div className={cn('bg-status-warning/10 border border-status-warning/30 rounded-lg', compact ? 'p-3 mb-4' : 'p-4 mb-6')}>
        <p className={cn('font-mono text-status-warning', compact && 'text-sm')}>{alert}</p>
      </div>

      <div className={cn(compact ? 'space-y-2 mb-4' : 'space-y-3 mb-6')}>
        {choices.map((choice, index) => (
          <motion.button
            key={index}
            onClick={() => selectedChoice === null && onChoiceSelect(choice, index)}
            disabled={selectedChoice !== null}
            className={cn(
              'w-full text-left rounded-lg border transition-all',
              compact ? 'p-3' : 'p-4',
              selectedChoice === null && 'hover:border-primary hover:bg-primary/10 cursor-pointer',
              selectedChoice === null && 'border-border bg-background/50',
              selectedChoice === index && choice.isCorrect && 'border-status-nominal bg-status-nominal/10',
              selectedChoice === index && !choice.isCorrect && 'border-status-critical bg-status-critical/10',
              selectedChoice !== null && selectedChoice !== index && 'opacity-50'
            )}
            whileHover={selectedChoice === null ? { scale: 1.01 } : {}}
            whileTap={selectedChoice === null ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center gap-3">
              {selectedChoice === index && (
                choice.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-status-nominal flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-status-critical flex-shrink-0" />
                )
              )}
              <span className={cn(
                'font-medium',
                selectedChoice === index && choice.isCorrect && 'text-status-nominal',
                selectedChoice === index && !choice.isCorrect && 'text-status-critical',
              )}>
                {choice.text}
              </span>
            </div>
            {selectedChoice === index && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn('mt-2 text-muted-foreground pl-8', compact ? 'text-xs mt-1.5 pl-7' : 'text-sm')}
              >
                {choice.consequence}
              </motion.p>
            )}
          </motion.button>
        ))}
      </div>

      {selectedChoice !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('bg-primary/10 border border-primary/30 rounded-lg', compact ? 'p-3' : 'p-4')}
        >
          <span className="text-xs uppercase tracking-wider text-primary block mb-1">Lesson Learned</span>
          <p className={cn('text-foreground/90', compact ? 'text-xs' : 'text-sm')}>{lesson}</p>
        </motion.div>
      )}
    </motion.div>
  );
}