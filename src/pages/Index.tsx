import { GameProvider, useGame } from '@/contexts/GameContext';
import { IntroPage } from './IntroPage';
import { Level1Page } from './Level1Page';
import { Level2Page } from './Level2Page';
import { OutcomePage } from './OutcomePage';

function GameRouter() {
  const { state } = useGame();

  switch (state.currentPage) {
    case 'intro':
      return <IntroPage />;
    case 'level1':
      return <Level1Page />;
    case 'level2':
      return <Level2Page />;
    case 'outcome':
      return <OutcomePage />;
    default:
      return <IntroPage />;
  }
}

const Index = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default Index;