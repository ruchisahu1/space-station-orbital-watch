import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type SystemStatus = 'nominal' | 'warning' | 'critical' | 'standby';
export type GamePage = 'intro' | 'level1' | 'level2' | 'outcome';
export type CrewStatus = 'green' | 'yellow' | 'red';

interface SystemState {
  status: SystemStatus;
  value: number;
  label: string;
}

interface GameState {
  currentPage: GamePage;
  // Core systems
  lifeSupport: SystemState;
  powerSystems: SystemState;
  thermalControl: SystemState;
  attitudeControl: SystemState;
  communications: SystemState;
  
  // Station metrics
  oxygenLevel: number;
  powerReserves: number;
  internalTemp: number;
  structuralStress: number;
  crewStatus: CrewStatus;
  
  // Game progress
  currentIncident: number;
  incidentsCompleted: number;
  correctDecisions: number;
  totalDecisions: number;
  safeModeActivated: boolean;
  
  // AI messages
  aiMessage: string;
}

type GameAction =
  | { type: 'SET_PAGE'; page: GamePage }
  | { type: 'SET_SYSTEM_STATUS'; system: keyof Pick<GameState, 'lifeSupport' | 'powerSystems' | 'thermalControl' | 'attitudeControl' | 'communications'>; status: SystemStatus }
  | { type: 'UPDATE_METRIC'; metric: 'oxygenLevel' | 'powerReserves' | 'internalTemp' | 'structuralStress'; value: number }
  | { type: 'SET_CREW_STATUS'; status: CrewStatus }
  | { type: 'MAKE_DECISION'; correct: boolean }
  | { type: 'NEXT_INCIDENT' }
  | { type: 'ACTIVATE_SAFE_MODE' }
  | { type: 'SET_AI_MESSAGE'; message: string }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  currentPage: 'intro',
  lifeSupport: { status: 'standby', value: 100, label: 'Life Support' },
  powerSystems: { status: 'standby', value: 100, label: 'Power Systems' },
  thermalControl: { status: 'standby', value: 100, label: 'Thermal Control' },
  attitudeControl: { status: 'standby', value: 100, label: 'Attitude Control' },
  communications: { status: 'standby', value: 100, label: 'Communications' },
  oxygenLevel: 98,
  powerReserves: 85,
  internalTemp: 22,
  structuralStress: 5,
  crewStatus: 'green',
  currentIncident: 0,
  incidentsCompleted: 0,
  correctDecisions: 0,
  totalDecisions: 0,
  safeModeActivated: false,
  aiMessage: 'Awaiting activation...',
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PAGE':
      if (action.page === 'level1') {
        return {
          ...state,
          currentPage: action.page,
          lifeSupport: { ...state.lifeSupport, status: 'standby' },
          powerSystems: { ...state.powerSystems, status: 'standby' },
          thermalControl: { ...state.thermalControl, status: 'standby' },
          attitudeControl: { ...state.attitudeControl, status: 'standby' },
          communications: { ...state.communications, status: 'standby' },
          aiMessage: 'Awaiting activation... Activate all core systems to bring the station online.',
        };
      }
      return { ...state, currentPage: action.page };
      
    case 'SET_SYSTEM_STATUS':
      return {
        ...state,
        [action.system]: { ...state[action.system], status: action.status },
      };
      
    case 'UPDATE_METRIC':
      const newState = { ...state, [action.metric]: action.value };
      // Update crew status based on metrics
      if (action.metric === 'oxygenLevel' && action.value < 85) {
        newState.crewStatus = action.value < 70 ? 'red' : 'yellow';
      }
      return newState;
      
    case 'SET_CREW_STATUS':
      return { ...state, crewStatus: action.status };
      
    case 'MAKE_DECISION':
      return {
        ...state,
        correctDecisions: state.correctDecisions + (action.correct ? 1 : 0),
        totalDecisions: state.totalDecisions + 1,
      };
      
    case 'NEXT_INCIDENT':
      return {
        ...state,
        currentIncident: state.currentIncident + 1,
        incidentsCompleted: state.incidentsCompleted + 1,
      };
      
    case 'ACTIVATE_SAFE_MODE':
      return { ...state, safeModeActivated: true };
      
    case 'SET_AI_MESSAGE':
      return { ...state, aiMessage: action.message };
      
    case 'RESET_GAME':
      return { ...initialState };
      
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}