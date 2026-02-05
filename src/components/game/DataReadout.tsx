import { cn } from '@/lib/utils';

interface DataReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'nominal' | 'warning' | 'critical';
  className?: string;
}

export function DataReadout({ 
  label, 
  value, 
  unit, 
  status = 'nominal',
  className 
}: DataReadoutProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          'font-mono text-2xl font-bold',
          status === 'nominal' && 'text-status-nominal text-glow-green',
          status === 'warning' && 'text-status-warning text-glow-amber',
          status === 'critical' && 'text-status-critical text-glow-red',
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  );
}