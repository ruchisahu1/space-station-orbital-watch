import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { StatusIndicator } from './StatusIndicator';
import { cn } from '@/lib/utils';

interface AIPanelProps {
  /** When true, layout is horizontal (for full-width bar). */
  horizontal?: boolean;
}

export function AIPanel({ horizontal }: AIPanelProps) {
  const { state } = useGame();

  const getCrewStatusColor = () => {
    switch (state.crewStatus) {
      case 'green': return 'nominal';
      case 'yellow': return 'warning';
      case 'red': return 'critical';
    }
  };

  const header = (
    <div className={cn('flex items-center gap-3 shrink-0', horizontal && 'mission-ai-header')}>
      <div className={cn('w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center', horizontal && 'mission-ai-icon')}>
        <Bot className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className={cn('font-semibold text-sm', horizontal && 'mission-ai-title')}>Mission AI</h3>
        <span className={cn('text-xs text-muted-foreground', horizontal && 'mission-ai-subtitle')}>Supervisor Active</span>
      </div>
      <StatusIndicator status="nominal" size="sm" className="ml-auto" />
    </div>
  );

  const message = (
    <div className={cn('bg-background/50 rounded-lg p-3', horizontal ? 'flex-1 min-w-0 mission-ai-message' : 'flex-1 mb-4')}>
      <AnimatePresence mode="wait">
        <motion.p
          key={state.aiMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-foreground/90 font-mono"
        >
          {state.aiMessage}
        </motion.p>
      </AnimatePresence>
    </div>
  );

  const stats = (
    <div className={cn('flex gap-3 shrink-0', !horizontal && 'grid grid-cols-2 gap-3', horizontal && 'mission-ai-stats')}>
      <div className={cn('bg-background/30 rounded p-2', horizontal && 'mission-ai-stat')}>
        <span className={cn('text-xs text-muted-foreground block mb-1', horizontal && 'mission-ai-stat-label')}>Oxygen</span>
        <span className={cn('font-mono text-status-nominal text-glow-green', horizontal && 'mission-ai-stat-value')}>{state.oxygenLevel}%</span>
      </div>
      <div className={cn('bg-background/30 rounded p-2', horizontal && 'mission-ai-stat')}>
        <span className={cn('text-xs text-muted-foreground block mb-1', horizontal && 'mission-ai-stat-label')}>Power</span>
        <span className={cn('font-mono text-status-nominal text-glow-green', horizontal && 'mission-ai-stat-value')}>{state.powerReserves}%</span>
      </div>
      <div className={cn('bg-background/30 rounded p-2', horizontal && 'mission-ai-stat')}>
        <span className={cn('text-xs text-muted-foreground block mb-1', horizontal && 'mission-ai-stat-label')}>Temp</span>
        <span className={cn('font-mono text-primary', horizontal && 'mission-ai-stat-value')}>{state.internalTemp}°C</span>
      </div>
      <div className={cn('bg-background/30 rounded p-2', horizontal && 'mission-ai-stat')}>
        <span className={cn('text-xs text-muted-foreground block mb-1', horizontal && 'mission-ai-stat-label')}>Crew</span>
        <div className="flex items-center gap-2">
          <StatusIndicator status={getCrewStatusColor()} size="sm" />
          <span className={cn('font-mono text-xs uppercase', horizontal && 'mission-ai-stat-value')}>{state.crewStatus}</span>
        </div>
      </div>
    </div>
  );

  if (horizontal) {
    return (
      <div className="panel-glow rounded-lg p-4 flex flex-row items-center gap-4 w-full h-full min-h-0 mission-ai-panel">
        {header}
        <div className="mission-ai-body flex-1 min-w-0 flex flex-row items-center gap-4">
          {message}
          {stats}
        </div>
      </div>
    );
  }

  return (
    <div className="panel-glow rounded-lg p-4 h-full flex flex-col">
      <div className="mb-4">{header}</div>
      {message}
      {stats}
    </div>
  );
}