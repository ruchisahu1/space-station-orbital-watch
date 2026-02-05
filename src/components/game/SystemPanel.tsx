import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';
import type { SystemStatus } from '@/contexts/GameContext';
import { motion } from 'framer-motion';

interface SystemPanelProps {
  name: string;
  status: SystemStatus;
  value: number;
  states?: string[];
  onToggle?: () => void;
  className?: string;
}

export function SystemPanel({ 
  name, 
  status, 
  value, 
  states = ['STANDBY', 'ACTIVE'],
  onToggle,
  className 
}: SystemPanelProps) {
  const currentStateIndex = status === 'standby' ? 0 : 1;

  return (
    <motion.div 
      className={cn(
        'panel-glow rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50',
        className
      )}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium uppercase tracking-wider">{name}</h4>
        <StatusIndicator status={status} />
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div 
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            status === 'nominal' && 'bg-status-nominal',
            status === 'warning' && 'bg-status-warning',
            status === 'critical' && 'bg-status-critical',
            status === 'standby' && 'bg-status-standby',
          )}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex gap-2">
        {states.map((state, index) => (
          <span
            key={state}
            className={cn(
              'text-xs px-2 py-1 rounded border transition-colors',
              index === currentStateIndex
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-muted text-muted-foreground'
            )}
          >
            {state}
          </span>
        ))}
      </div>
    </motion.div>
  );
}