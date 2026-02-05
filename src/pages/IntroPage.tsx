import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, BookOpen, Bot, Play } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import controlRoomBg from '@/assets/control-room-bg.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function IntroPage() {
  const { dispatch } = useGame();
  const [systemsManualOpen, setSystemsManualOpen] = useState(false);
  const [missionAIOpen, setMissionAIOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${controlRoomBg})` }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/60" />
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/80 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Earth glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-t from-primary/20 via-primary/5 to-transparent blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Title section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-2 h-2 rounded-full bg-status-nominal animate-pulse" />
            <span className="text-sm font-mono text-primary uppercase tracking-wider">Flight Control Active</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow-cyan">
            <span className="text-primary">Orbital</span>
            <span className="text-foreground"> Command</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Space Station Operations & Safety
          </p>
        </motion.div>

        {/* Mission brief */}
        <motion.div
          className="panel-glow rounded-lg p-6 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Mission Brief
          </h2>
          <div className="space-y-4 text-foreground/90">
            <p>
              <strong className="text-primary">Welcome, Flight Control Officer.</strong>
            </p>
            <p>
              You are responsible for a space station orbiting Earth.
              Astronaut lives depend on oxygen, power, and stability.
            </p>
            <p className="text-status-warning font-medium">
              Space is unforgiving. Calm decisions keep everyone alive.
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Golden Rule
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-status-nominal/20 text-status-nominal border border-status-nominal/30 text-sm font-mono">
                Life Support
              </span>
              <span className="text-muted-foreground">&gt;</span>
              <span className="px-3 py-1 rounded-full bg-status-warning/20 text-status-warning border border-status-warning/30 text-sm font-mono">
                Station Stability
              </span>
              <span className="text-muted-foreground">&gt;</span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-mono">
                Mission Objectives
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={() => dispatch({ type: 'SET_PAGE', page: 'level1' })}
            className="control-button flex items-center gap-2 text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            Enter Control Room
          </motion.button>
          
          <motion.button
            onClick={() => setSystemsManualOpen(true)}
            className="control-button flex items-center gap-2 opacity-70"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-5 h-5" />
            Systems Manual
          </motion.button>
          
          <motion.button
            onClick={() => setMissionAIOpen(true)}
            className="control-button flex items-center gap-2 opacity-70"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-5 h-5" />
            Meet Mission AI
          </motion.button>
        </motion.div>
      </div>

      {/* Systems Manual dialog */}
      <Dialog open={systemsManualOpen} onOpenChange={setSystemsManualOpen}>
        <DialogContent className="panel-glow border-primary/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <BookOpen className="w-5 h-5" />
              Systems Manual
            </DialogTitle>
            <DialogDescription>
              Overview of station systems you will monitor and control.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground/90">
            <div>
              <h4 className="font-semibold text-primary mb-1">Life Support</h4>
              <p className="text-muted-foreground">Oxygen generation and CO₂ scrubbing. Keep this system nominal at all times.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Power Systems</h4>
              <p className="text-muted-foreground">Solar arrays and battery reserves. Balance generation with consumption.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Thermal Control</h4>
              <p className="text-muted-foreground">Cooling loops and radiators. Prevents overheating of critical equipment.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Attitude Control</h4>
              <p className="text-muted-foreground">Orientation and stability. Keeps solar panels and antennas correctly aligned.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Communications</h4>
              <p className="text-muted-foreground">Link to ground and crew. Essential for mission coordination and emergencies.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meet Mission AI dialog */}
      <Dialog open={missionAIOpen} onOpenChange={setMissionAIOpen}>
        <DialogContent className="panel-glow border-primary/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Bot className="w-5 h-5" />
              Meet Mission AI
            </DialogTitle>
            <DialogDescription>
              Your onboard supervisor during operations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground/90">
            <p>
              Mission AI is an automated supervisor that monitors station telemetry and provides real-time status and guidance during your shift.
            </p>
            <p>
              It will report oxygen levels, power reserves, thermal readings, and crew status. When incidents occur, it will alert you and update you on the effects of your decisions.
            </p>
            <p className="text-muted-foreground">
              Use its feedback to keep the station operational and the crew safe. It does not take actions itself—you remain in command.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}