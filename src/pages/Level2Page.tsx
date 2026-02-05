import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { IncidentCard } from '@/components/game/IncidentCard';
import { AIPanel } from '@/components/game/AIPanel';
import { ShipReactionOverlay, type ShipReaction } from '@/components/game/ShipReactionOverlay';
import { StationStatusFlash } from '@/components/game/StationStatusFlash';
import { QAShip } from '@/components/game/QAShip';
import { playCorrectSound, playWrongSound } from '@/lib/reactionSound';

interface Incident {
  id: number;
  title: string;
  alert: string;
  lesson: string;
  choices: {
    text: string;
    isCorrect: boolean;
    consequence: string;
  }[];
}

const incidents: Incident[] = [
  {
    id: 1,
    title: 'SOLAR PANEL MISALIGNMENT',
    alert: 'Power generation reduced by 25%. Solar array orientation drifting.',
    lesson: 'Power management is proactive. Small corrections prevent cascade failures.',
    choices: [
      {
        text: 'Reorient station gradually',
        isCorrect: true,
        consequence: 'Station adjusts orientation smoothly. Power generation restored to 100%.',
      },
      {
        text: 'Switch to battery backup',
        isCorrect: true,
        consequence: 'Battery reserves engaged. Provides time for proper solar realignment.',
      },
      {
        text: 'Ignore - power levels still acceptable',
        isCorrect: false,
        consequence: 'Power continues to drop. Battery reserves depleted faster than expected.',
      },
    ],
  },
  {
    id: 2,
    title: 'OXYGEN SCRUBBER FAULT',
    alert: 'CO₂ levels rising in Habitat Module. Primary scrubber offline.',
    lesson: 'Life support is non-negotiable. Redundancy systems exist for a reason.',
    choices: [
      {
        text: 'Activate backup scrubber immediately',
        isCorrect: true,
        consequence: 'Backup scrubber online. CO₂ levels stabilizing. Crew safety maintained.',
      },
      {
        text: 'Reduce crew activity to lower CO₂ output',
        isCorrect: true,
        consequence: 'Crew moves to low-activity protocol. Buys time for repairs.',
      },
      {
        text: 'Disable warning - levels are within tolerance',
        isCorrect: false,
        consequence: 'CO₂ continues rising. Crew reports headaches and fatigue. Emergency protocols activated.',
      },
    ],
  },
  {
    id: 3,
    title: 'THERMAL CONTROL FAILURE',
    alert: 'Temperature rising near electronics bay. Cooling loop pressure drop detected.',
    lesson: 'Heat kills systems silently. Thermal management prevents cascading failures.',
    choices: [
      {
        text: 'Reroute cooling through backup loop',
        isCorrect: true,
        consequence: 'Secondary loop engaged. Temperature stabilizing. Electronics protected.',
      },
      {
        text: 'Reduce power load to generate less heat',
        isCorrect: true,
        consequence: 'Non-essential systems powered down. Heat generation reduced significantly.',
      },
      {
        text: 'Increase system output to push through',
        isCorrect: false,
        consequence: 'Electronics bay overheating. Multiple systems enter protective shutdown.',
      },
    ],
  },
  {
    id: 4,
    title: 'ATTITUDE DRIFT',
    alert: 'Station orientation drifting off optimal axis. Solar efficiency dropping.',
    lesson: 'Space rewards patience, not force. Gentle corrections are more efficient.',
    choices: [
      {
        text: 'Apply small thruster correction',
        isCorrect: true,
        consequence: 'Gentle thrust applied. Station returning to optimal orientation smoothly.',
      },
      {
        text: 'Allow passive correction using gyroscopes',
        isCorrect: true,
        consequence: 'Gyroscopes compensating. Slower but fuel-efficient correction.',
      },
      {
        text: 'Full thrust to quickly realign',
        isCorrect: false,
        consequence: 'Overcorrection! Station oscillating. More fuel spent on counter-corrections.',
      },
    ],
  },
];

export function Level2Page() {
  const { state, dispatch } = useGame();
  const [currentIncidentIndex, setCurrentIncidentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<(number | null)[]>(new Array(incidents.length).fill(null));
  const [shipReaction, setShipReaction] = useState<ShipReaction | null>(null);
  
  const currentIncident = incidents[currentIncidentIndex];
  const isLastIncident = currentIncidentIndex === incidents.length - 1;
  const hasSelectedChoice = selectedChoices[currentIncidentIndex] !== null;

  const handleChoiceSelect = (choice: { isCorrect: boolean }, index: number) => {
    const newSelectedChoices = [...selectedChoices];
    newSelectedChoices[currentIncidentIndex] = index;
    setSelectedChoices(newSelectedChoices);
    
    dispatch({ type: 'MAKE_DECISION', correct: choice.isCorrect });
    setShipReaction(choice.isCorrect ? 'correct' : 'wrong');
    
    if (choice.isCorrect) {
      dispatch({ type: 'SET_AI_MESSAGE', message: 'Excellent decision. Systems stabilizing. Continue monitoring for additional anomalies.' });
    } else {
      dispatch({ type: 'SET_AI_MESSAGE', message: 'Warning: Suboptimal response detected. Review consequences and learn from this decision.' });
    }
  };

  const handleReactionComplete = () => {
    setShipReaction(null);
  };

  useEffect(() => {
    if (shipReaction === 'correct') playCorrectSound();
    if (shipReaction === 'wrong') playWrongSound();
  }, [shipReaction]);

  const handleNext = () => {
    if (isLastIncident) {
      dispatch({ type: 'SET_PAGE', page: 'outcome' });
    } else {
      setCurrentIncidentIndex(prev => prev + 1);
      dispatch({ type: 'NEXT_INCIDENT' });
      dispatch({ type: 'SET_AI_MESSAGE', message: 'New alert detected. Assess the situation carefully before responding.' });
    }
  };

  const handleSafeMode = () => {
    dispatch({ type: 'ACTIVATE_SAFE_MODE' });
    dispatch({ type: 'SET_PAGE', page: 'outcome' });
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-background grid-bg relative"
      data-reaction={shipReaction ?? undefined}
    >
      <ShipReactionOverlay reaction={shipReaction} onComplete={handleReactionComplete} />

      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary text-glow-cyan">ORBITAL COMMAND</h1>
            <span className="px-2 py-1 rounded bg-status-warning/20 text-status-warning text-xs font-mono uppercase">
              Level 2: Incident Response
            </span>
          </div>
          <div className="flex items-center gap-4">
            <StationStatusFlash reaction={shipReaction} />
            <span className="text-sm text-muted-foreground">Incident:</span>
            <span className="font-mono text-primary">
              {currentIncidentIndex + 1} / {incidents.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main content - shake on wrong; fits in viewport, incident card scrolls if needed */}
      <motion.div
        className="flex-1 min-h-0 flex flex-col overflow-hidden container mx-auto px-4 py-4 relative z-10"
        animate={{ x: shipReaction === 'wrong' ? [0, -6, 6, -4, 0] : 0 }}
        transition={{ x: { duration: 0.4 } }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left column - Ship in Q&A area + Progress, incident card (scrollable), nav buttons */}
          <div className="lg:col-span-2 min-h-0 flex flex-row gap-4 overflow-hidden">
            {/* Space ship - sidebar on desktop; changes with user input (correct / wrong / idle) */}
            <div className="hidden lg:flex flex-col items-center pt-2 shrink-0 w-24 border-r border-border/50 pr-4">
              <QAShip
                reaction={shipReaction}
                hasSelectedChoice={hasSelectedChoice}
                selectedWasCorrect={
                  hasSelectedChoice && selectedChoices[currentIncidentIndex] !== null
                    ? currentIncident.choices[selectedChoices[currentIncidentIndex]!].isCorrect
                    : null
                }
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-3 overflow-hidden">
            {/* Space ship - top of Q&A area on mobile */}
            <div className="lg:hidden flex justify-center py-2 shrink-0 border-b border-border/50">
              <QAShip
                reaction={shipReaction}
                hasSelectedChoice={hasSelectedChoice}
                selectedWasCorrect={
                  hasSelectedChoice && selectedChoices[currentIncidentIndex] !== null
                    ? currentIncident.choices[selectedChoices[currentIncidentIndex]!].isCorrect
                    : null
                }
                className="max-w-[72px]"
              />
            </div>
            {/* Progress bar */}
            <div className="panel-glow rounded-lg p-3 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIncidentIndex + (hasSelectedChoice ? 1 : 0)) / incidents.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-primary">
                  {state.correctDecisions}/{state.totalDecisions} correct
                </span>
              </div>
            </div>

            {/* Current incident - scrolls if content is tall */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <AnimatePresence mode="wait">
                <IncidentCard
                  key={currentIncident.id}
                  title={currentIncident.title}
                  alert={currentIncident.alert}
                  lesson={currentIncident.lesson}
                  choices={currentIncident.choices}
                  onChoiceSelect={handleChoiceSelect}
                  selectedChoice={selectedChoices[currentIncidentIndex]}
                  compact
                />
              </AnimatePresence>
            </div>

            {/* Navigation - always visible at bottom of left column */}
            {hasSelectedChoice && (
              <motion.div
                className="flex justify-between items-center shrink-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleSafeMode}
                  className="control-button control-button-critical flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-4 h-4" />
                  Activate Safe Mode
                </motion.button>
                
                <motion.button
                  onClick={handleNext}
                  className="control-button flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLastIncident ? 'Complete Mission' : 'Next Mission'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
            </div>
          </div>

          {/* Right column - AI Panel */}
          <div className="min-h-0 flex flex-col flex-1">
            <motion.div
              className="h-full min-h-0 flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AIPanel />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}