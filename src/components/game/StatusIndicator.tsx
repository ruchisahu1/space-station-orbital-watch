import { cn } from '@/lib/utils';
import type { SystemStatus } from '@/contexts/GameContext';

interface StatusIndicatorProps {
  status: SystemStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export function StatusIndicator({ 
  status, 
  size = 'md', 
  className,
  pulse = true 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'rounded-full inline-block',
        sizeClasses[size],
        status === 'nominal' && 'status-nominal',
        status === 'warning' && 'status-warning',
        status === 'critical' && 'status-critical',
        status === 'standby' && 'status-standby',
        !pulse && 'animation-none',
        className
      )}
    />
  );
}