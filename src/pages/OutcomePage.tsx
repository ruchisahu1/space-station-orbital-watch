import { motion } from 'framer-motion';
import { Trophy, Shield, RefreshCcw, BookOpen, Rocket, CheckCircle, AlertTriangle } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export function OutcomePage() {
  const { state, dispatch } = useGame();
  
  const successRate = state.totalDecisions > 0 
    ? Math.round((state.correctDecisions / state.totalDecisions) * 100) 
    : 0;
  
  const isSuccess = !state.safeModeActivated && successRate >= 50;
  const crewSafetyPercent = state.safeModeActivated ? 100 : (successRate >= 75 ? 100 : successRate >= 50 ? 85 : 70);
  
  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="min-h-screen bg-background grid-bg scanlines flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/80 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Result card */}
        <div className={`panel-glow rounded-lg p-8 ${state.safeModeActivated ? 'border-status-warning/50' : isSuccess ? 'border-status-nominal/50' : 'border-status-critical/50'}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                state.safeModeActivated 
                  ? 'bg-status-warning/20' 
                  : isSuccess 
                    ? 'bg-status-nominal/20' 
                    : 'bg-status-critical/20'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {state.safeModeActivated ? (
                <Shield className="w-10 h-10 text-status-warning" />
              ) : isSuccess ? (
                <Trophy className="w-10 h-10 text-status-nominal" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-status-critical" />
              )}
            </motion.div>
            
            <motion.h1
              className={`text-3xl font-bold mb-2 ${
                state.safeModeActivated
                  ? 'text-status-warning text-glow-amber'
                  : isSuccess
                    ? 'text-status-nominal text-glow-green'
                    : 'text-status-critical text-glow-red'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {state.safeModeActivated
                ? 'STATION ENTERED SAFE MODE'
                : isSuccess
                  ? 'SPACE STATION OPERATED SAFELY'
                  : 'MISSION REQUIRES REVIEW'}
            </motion.h1>
            
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {state.safeModeActivated
                ? 'Risk threshold exceeded. Automatic protections activated.'
                : isSuccess
                  ? 'All systems stable. Crew safety maintained.'
                  : 'Review your decisions to improve performance.'}
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <span className="text-sm text-muted-foreground block mb-1">Crew Safety</span>
              <span className={`text-3xl font-mono font-bold ${crewSafetyPercent === 100 ? 'text-status-nominal' : 'text-status-warning'}`}>
                {crewSafetyPercent}%
              </span>
            </div>
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <span className="text-sm text-muted-foreground block mb-1">Decision Accuracy</span>
              <span className={`text-3xl font-mono font-bold ${successRate >= 75 ? 'text-status-nominal' : successRate >= 50 ? 'text-status-warning' : 'text-status-critical'}`}>
                {successRate}%
              </span>
            </div>
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <span className="text-sm text-muted-foreground block mb-1">Correct Decisions</span>
              <span className="text-3xl font-mono font-bold text-primary">
                {state.correctDecisions}/{state.totalDecisions}
              </span>
            </div>
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <span className="text-sm text-muted-foreground block mb-1">System Stability</span>
              <span className={`text-3xl font-mono font-bold ${isSuccess ? 'text-status-nominal' : 'text-status-warning'}`}>
                {isSuccess ? 'Excellent' : 'Moderate'}
              </span>
            </div>
          </motion.div>

          {/* Lessons learned */}
          <motion.div
            className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-semibold text-primary mb-3">What You Learned</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-foreground/90">
                <CheckCircle className="w-4 h-4 text-status-nominal mt-0.5 flex-shrink-0" />
                Life-support priority in all decisions
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/90">
                <CheckCircle className="w-4 h-4 text-status-nominal mt-0.5 flex-shrink-0" />
                Systems interdependence awareness
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/90">
                <CheckCircle className="w-4 h-4 text-status-nominal mt-0.5 flex-shrink-0" />
                Calm crisis handling techniques
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/90">
                <CheckCircle className="w-4 h-4 text-status-nominal mt-0.5 flex-shrink-0" />
                When to pause instead of pushing objectives
              </li>
            </ul>
          </motion.div>

          {/* Key message */}
          {state.safeModeActivated && (
            <motion.div
              className="text-center mb-8 p-4 bg-status-warning/10 border border-status-warning/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-status-warning font-medium">
                "Protecting lives is always mission success."
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={handleRestart}
              className="control-button flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCcw className="w-4 h-4" />
              Retry Mission
            </motion.button>
            <motion.button
              className="control-button flex items-center justify-center gap-2 opacity-70"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-4 h-4" />
              Review Manual
            </motion.button>
            <motion.button
              className="control-button flex items-center justify-center gap-2 opacity-70"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-4 h-4" />
              Advanced Mode
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}