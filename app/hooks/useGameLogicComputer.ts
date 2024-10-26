import { Game } from '../gameLogic/backgammon';
import { PLAYER_COLORS } from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { useGameState } from './GameStateContext';

export const useGameLogicComputer = (
  makeTurn: (turn: Turn, quickTurn?: boolean, game?: Game) => Promise<Game | undefined>,
) => {

    const {
      setDisableScreen,
      bot,
      game,
    } = useGameState()

    const runBot = async () => {
      if (game) {
        if (game.getMovesLeft().length === 0) { return
        } else {
          if (game.getCurrentPlayer() === PLAYER_COLORS.BLACK) {
            setDisableScreen(true);
            await makeBotMove();
          }
        }
      }
    };

    const makeBotMove = async () => {
      if (game) {
        const botTurn = bot.makeMove(game);
        if (botTurn) {
          await makeTurn(botTurn);
        } else console.log('FAILED');
      }
    };

  return {
    runBot,
  };
};
