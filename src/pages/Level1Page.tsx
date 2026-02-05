import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, AlertTriangle } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { SystemPanel } from '@/components/game/SystemPanel';
import { AIPanel } from '@/components/game/AIPanel';
import { StationDiagram } from '@/components/game/StationDiagram';
import type { SystemStatus } from '@/contexts/GameContext';
import controlRoomBg from '@/assets/control-room-bg.png';

export function Level1Page() {
  const { state, dispatch } = useGame();
  const [systemsActivated, setSystemsActivated] = useState({
    lifeSupport: false,
    powerSystems: false,
    thermalControl: false,
    attitudeControl: false,
    communications: false,
  });

  const allSystemsActive = Object.values(systemsActivated).every(Boolean);

  const toggleSystem = (system: keyof typeof systemsActivated) => {
    const newState = { ...systemsActivated, [system]: !systemsActivated[system] };
    setSystemsActivated(newState);
    
    const newStatus: SystemStatus = newState[system] ? 'nominal' : 'standby';
    dispatch({ 
      type: 'SET_SYSTEM_STATUS', 
      system: system as any,
      status: newStatus 
    });

    // Update AI message based on system changes
    const activeCount = Object.values(newState).filter(Boolean).length;
    if (activeCount === 5) {
      dispatch({ type: 'SET_AI_MESSAGE', message: 'All systems nominal. Station is fully operational. Ready for standard operations.' });
    } else if (activeCount > 0) {
      dispatch({ type: 'SET_AI_MESSAGE', message: `${activeCount}/5 systems active. Continue activating remaining systems for full operational status.` });
    }
  };

  const handleBeginIncidents = () => {
    dispatch({ type: 'SET_AI_MESSAGE', message: 'Alert: Multiple system anomalies detected. Prepare for incident response protocol.' });
    dispatch({ type: 'SET_PAGE', page: 'level2' });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background relative">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${controlRoomBg})` }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/70" />
      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary text-glow-cyan">ORBITAL COMMAND</h1>
            <span className="px-2 py-1 rounded bg-status-nominal/20 text-status-nominal text-xs font-mono uppercase">
              Level 1: Normal Operations
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Station Status:</span>
            <span className={`font-mono ${allSystemsActive ? 'text-status-nominal' : 'text-status-warning'}`}>
              {allSystemsActive ? 'OPERATIONAL' : 'ACTIVATING'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left column - Core System Controls + Mission AI (horizontal space till station map) */}
          <div className="lg:col-span-2 min-h-0 flex flex-col overflow-hidden gap-4">
            <motion.div
              className="panel-glow rounded-lg p-6 shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Core System Controls
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Click each system to activate. All systems must be active for full station operation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SystemPanel
                  name="Life Support"
                  status={state.lifeSupport.status}
                  value={state.lifeSupport.value}
                  states={['STANDBY', 'ACTIVE']}
                  onToggle={() => toggleSystem('lifeSupport')}
                />
                <SystemPanel
                  name="Power Systems"
                  status={state.powerSystems.status}
                  value={state.powerSystems.value}
                  states={['SOLAR', 'BATTERY']}
                  onToggle={() => toggleSystem('powerSystems')}
                />
                <SystemPanel
                  name="Thermal Control"
                  status={state.thermalControl.status}
                  value={state.thermalControl.value}
                  states={['AUTO', 'MANUAL']}
                  onToggle={() => toggleSystem('thermalControl')}
                />
                <SystemPanel
                  name="Attitude Control"
                  status={state.attitudeControl.status}
                  value={state.attitudeControl.value}
                  states={['STABLE', 'ADJUST']}
                  onToggle={() => toggleSystem('attitudeControl')}
                />
                <SystemPanel
                  name="Communications"
                  status={state.communications.status}
                  value={state.communications.value}
                  states={['OFFLINE', 'ACTIVE']}
                  onToggle={() => toggleSystem('communications')}
                />
              </div>
            </motion.div>

            {/* Mission AI - fills remaining vertical space; shrinks when popup appears */}
            <motion.div
              className="mission-ai-container flex-1 min-h-0 w-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AIPanel horizontal />
            </motion.div>

            {/* Start Mission - slides up from bottom when all systems active */}
            {allSystemsActive && (
              <motion.div
                className="panel-glow rounded-lg p-4 border-status-warning/50 shrink-0"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'tween', duration: 0.7, ease: 'easeOut' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-status-warning shrink-0" />
                    <div>
                      <h3 className="font-semibold text-status-warning">Ready for Mission</h3>
                      <p className="text-sm text-muted-foreground">All systems active. Start the mission when ready.</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleBeginIncidents}
                    className="control-button control-button-warning flex items-center gap-2 shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4" />
                    Start Mission
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right column - Station Systems Map (full vertical space) */}
          <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
            <motion.div
              className="panel-glow rounded-lg p-4 h-full min-h-0 flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-3 shrink-0">Station Systems Map</h2>
              <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center">
                <StationDiagram />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}