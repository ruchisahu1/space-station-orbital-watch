import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { StatusIndicator } from './StatusIndicator';

export function StationDiagram() {
  const { state } = useGame();

  const modules = [
    { name: 'Habitat', x: 50, y: 40, system: state.lifeSupport },
    { name: 'Power', x: 20, y: 60, system: state.powerSystems },
    { name: 'Thermal', x: 80, y: 60, system: state.thermalControl },
    { name: 'Control', x: 50, y: 80, system: state.attitudeControl },
    { name: 'Comms', x: 50, y: 20, system: state.communications },
  ];

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Central station body */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-primary/50 bg-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-2 rounded-full border border-primary/30 bg-background/50" />
      </motion.div>

      {/* Solar panels */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="absolute left-4 right-1/2 h-full mr-14 bg-gradient-to-r from-primary/60 to-primary/30 border border-primary/50 rounded-sm">
          <div className="absolute inset-0 flex">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-primary/30 last:border-r-0" />
            ))}
          </div>
        </div>
        <div className="absolute right-4 left-1/2 h-full ml-14 bg-gradient-to-l from-primary/60 to-primary/30 border border-primary/50 rounded-sm">
          <div className="absolute inset-0 flex">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-primary/30 last:border-r-0" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modules */}
      {modules.map((module, index) => (
        <motion.div
          key={module.name}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: `${module.x}%`, top: `${module.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <div className="w-10 h-10 rounded-lg border border-primary/50 bg-card/80 flex items-center justify-center">
            <StatusIndicator status={module.system.status} size="lg" />
          </div>
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{module.name}</span>
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        <motion.line
          x1="50%" y1="40%" x2="50%" y2="50%"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.line
          x1="20%" y1="60%" x2="50%" y2="50%"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
        <motion.line
          x1="80%" y1="60%" x2="50%" y2="50%"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />
        <motion.line
          x1="50%" y1="80%" x2="50%" y2="50%"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        <motion.line
          x1="50%" y1="20%" x2="50%" y2="50%"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />
      </svg>
    </div>
  );
}